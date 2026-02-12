// src/app/settings/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  );
}

function SettingsContent() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <GlassCard className="p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-8">
          Settings
        </h1>

        <div className="space-y-8">
          {/* Account Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-300 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={user?.username || ''}
                  readOnly
                  className="input-field bg-slate-200/50 dark:bg-slate-800/50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="input-field bg-slate-200/50 dark:bg-slate-800/50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-300 mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Dark Mode</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Switch between light and dark themes</p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    darkMode ? 'bg-violet-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Language</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Select your preferred language</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field w-32"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-300 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Task Reminders</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications for upcoming tasks</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notificationsEnabled ? 'bg-violet-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Auto Sync</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automatically sync your tasks across devices</p>
                </div>
                <button
                  onClick={() => setAutoSync(!autoSync)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    autoSync ? 'bg-violet-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      autoSync ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-300 mb-4">Danger Zone</h2>
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800/50 rounded-lg p-4">
              <h3 className="font-medium text-red-700 dark:text-red-300 mb-2">Delete Account</h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}