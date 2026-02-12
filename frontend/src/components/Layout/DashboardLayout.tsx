// src/components/Layout/DashboardLayout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();

  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/auth/sign-in');
  };

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Calendar', href: '/calendar', icon: '📅' },
    { name: 'Tasks', href: '/tasks', icon: '✅' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href.includes('?')) {
      const [basePath, queryParams] = href.split('?');
      if (pathname === basePath) {
        const urlParams = new URLSearchParams(queryParams);
        for (const [key, value] of urlParams) {
          if (new URLSearchParams(window.location.search).get(key) === value) {
            return true;
          }
        }
      }
    }
    return pathname === href;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen via useEffect
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col border-r ${
        darkMode 
          ? 'bg-slate-950 text-slate-200 border-slate-800' 
          : 'bg-white text-slate-800 border-slate-200'
      }`}>
        <div className={`p-4 border-b ${
          darkMode 
            ? 'border-slate-800' 
            : 'border-slate-200'
        } flex items-center`}>
          <div className="bg-violet-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-2">
            T
          </div>
          {sidebarOpen && <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">TodoApp</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto p-1 rounded-full hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>

        <nav className="p-2 flex-1">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-1">
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-slate-800 text-violet-400 dark:bg-slate-800 dark:text-violet-400'
                      : 'hover:bg-slate-800 dark:hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className={`ml-3 overflow-hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`p-4 border-t ${
          darkMode 
            ? 'border-slate-800' 
            : 'border-slate-200'
        }`}>
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center p-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-xl">
              {darkMode ? '☀️' : '🌙'}
            </span>
            <span className={`ml-3 overflow-hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className={`backdrop-blur-md border-b z-10 ${sidebarOpen ? 'pl-64' : 'pl-20'} transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-900/80 border-slate-800' 
            : 'bg-white/80 border-slate-200'
        }`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                TodoApp
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <div className="flex items-center space-x-2">
                <div className={`border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center ${
                  darkMode 
                    ? 'bg-slate-800 text-slate-300' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {user?.username?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${
                    darkMode 
                      ? 'text-slate-300' 
                      : 'text-slate-700'
                  }`}>
                    Hi, {user?.username} 👋
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  darkMode 
                    ? 'text-red-400 hover:text-red-300 hover:bg-slate-800' 
                    : 'text-red-600 hover:text-red-700 hover:bg-slate-100'
                }`}
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto p-6 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-950 to-slate-900' 
            : 'bg-gradient-to-br from-slate-50 to-slate-100'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}