// src/context/TaskContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from './AuthContext';

import { Task } from '@/types/task';

interface ToggleCompletionResponse {
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (filters?: { completed?: boolean; priority?: string; search?: string }) => Promise<void>;
  createTask: (title: string, description: string, priority?: 'low' | 'medium' | 'high', due_date?: string, tags?: string[]) => Promise<void>;
  updateTask: (id: number, title: string, description: string, priority?: 'low' | 'medium' | 'high', due_date?: string, tags?: string[]) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTasks = async (filters?: { completed?: boolean; priority?: string; search?: string }) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters?.completed !== undefined) {
        queryParams.append('completed', filters.completed.toString());
      }
      if (filters?.priority) {
        queryParams.append('priority', filters.priority);
      }
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }

      const queryString = queryParams.toString();
      const url = `/api/${user.id}/tasks${queryString ? '?' + queryString : ''}`;

      const response = await apiClient.get<Task[]>(url);

      if (response.data) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (title: string, description: string, priority?: 'low' | 'medium' | 'high', due_date?: string, tags?: string[]) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<Task>(`/api/${user.id}/tasks`, { 
        title, 
        description,
        priority,
        due_date,
        tags
      });

      if (response.data) {
        setTasks([...tasks, response.data]);
      } else {
        setError(response.error || 'Failed to create task');
      }
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, title: string, description: string, priority?: 'low' | 'medium' | 'high', due_date?: string, tags?: string[]) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put<Task>(`/api/${user.id}/tasks/${id}`, { 
        title, 
        description,
        priority,
        due_date,
        tags
      });

      if (response.data) {
        const updatedTask = response.data;
        setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
      } else {
        setError(response.error || 'Failed to update task');
      }
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(`/api/${user.id}/tasks/${id}`);

      if (response.status === 200) {
        setTasks(tasks.filter(task => task.id !== id));
      } else {
        setError(response.error || 'Failed to delete task');
      }
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch<ToggleCompletionResponse>(`/api/${user.id}/tasks/${id}/toggle`);

      if (response.data) {
        const updatedTaskData = response.data;
        setTasks(tasks.map(task =>
          task.id === id ? { ...task, completed: updatedTaskData.completed } : task
        ));
      } else {
        setError(response.error || 'Failed to toggle task completion');
      }
    } catch (err) {
      setError('Failed to toggle task completion');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks(); // Fetch all tasks by default
    } else {
      setTasks([]);
    }
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};