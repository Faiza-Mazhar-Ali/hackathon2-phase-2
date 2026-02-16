// src/lib/api.ts
import { toast } from 'react-hot-toast';

// Use NEXT_PUBLIC_API_BASE_URL from environment variables
// Default to localhost for development, but allow override for production
const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
    : process.env.API_BASE_URL || 'http://127.0.0.1:8000';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Ensure proper URL construction without double slashes
    const normalizedBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${normalizedBaseUrl}${normalizedEndpoint}`;
    const token = this.getToken();

    // Configure headers with proper content type
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    // Add authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      // Make the request with proper configuration
      const response = await fetch(url, {
        ...options,
        headers,
        // Include credentials for cross-origin requests if needed
        credentials: 'include', // Changed from 'omit' to 'include' to allow cookies and auth
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let responseData = null;

      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          return { 
            error: `Invalid JSON response from server: ${parseError}`, 
            status: response.status 
          };
        }
      } else {
        // For non-JSON responses, return status only
        if (!response.ok) {
          return { 
            error: `HTTP error! Status: ${response.status}`, 
            status: response.status 
          };
        }
        return { data: null as T, status: response.status };
      }

      // Handle non-successful responses
      if (!response.ok) {
        // Special handling for 401 Unauthorized
        if (response.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/auth/sign-in';
          toast.error('Session expired. Please log in again.');
          return { error: 'Unauthorized. Please log in again.', status: 401 };
        }

        // Return error with details
        const errorMsg = responseData?.detail || responseData?.message || `HTTP error! Status: ${response.status}`;
        toast.error(errorMsg);
        return { error: errorMsg, status: response.status };
      }

      // Return successful response
      return { data: responseData, status: response.status };
    } catch (networkError: any) {
      // Handle network errors specifically
      console.error('Network error during API request:', networkError);
      
      // Determine the specific error type
      let errorMessage = 'Failed to connect to the server.';
      
      if (networkError.name === 'TypeError' && networkError.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to reach the server. Please check if the backend is running.';
      } else if (networkError.message.includes('Failed to fetch')) {
        errorMessage = 'Connection failed: Please ensure the backend server is running and accessible.';
      } else {
        errorMessage = `Network error: ${networkError.message || 'Unknown network error'}`;
      }
      
      toast.error(errorMessage);
      return { error: errorMessage, status: 0 }; // 0 indicates network error
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();