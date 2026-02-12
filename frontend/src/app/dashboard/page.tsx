// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import TaskProviderWrapper from '@/components/TaskProviderWrapper';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import TaskCard from '@/components/TaskCard';
import AdvancedTaskForm from '@/components/AdvancedTaskForm';

export default function DashboardPage() {
  return (
    <TaskProviderWrapper>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </TaskProviderWrapper>
  );
}

function DashboardContent() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showForm, setShowForm] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  const dateFilter = searchParams.get('date');

  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTaskCompletion } = useTask();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks based on params
  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'completed') return task.completed;
    if (statusFilter === 'pending') return !task.completed;
    if (dateFilter === 'today') {
      // Check if task date is today
      const today = new Date();
      const taskDate = new Date(task.created_at || task.updated_at || Date.now());
      return taskDate.getDate() === today.getDate() &&
             taskDate.getMonth() === today.getMonth() &&
             taskDate.getFullYear() === today.getFullYear();
    }
    // Add date filtering if needed
    return true;
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask(newTaskTitle, newTaskDescription);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleUpdateTask = async (id: number, title: string, description: string) => {
    await updateTask(id, title, description);
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
  };

  const handleToggleTask = (id: number) => {
    toggleTaskCompletion(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen via useEffect
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-2">Total Tasks</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            {totalTasks}
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-2">Pending Tasks</h3>
          <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
            {pendingTasks}
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-2">Completion Rate</h3>
          <div className="flex items-center">
            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              {completionPercentage}%
            </p>
          </div>
          <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2.5 mt-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </GlassCard>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Task List */}
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                My Tasks
              </h2>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 border border-violet-300 dark:border-violet-700/50">
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </span>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-3 py-1 rounded-lg bg-slate-800 dark:bg-slate-700 text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                  {showForm ? 'Hide Form' : 'Show Form'}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-100 dark:bg-red-900/30 p-4 border border-red-300 dark:border-red-800/50">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">Loading tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto bg-slate-200 dark:bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-300">No tasks yet</h3>
                  <p className="mt-1 text-slate-600 dark:text-slate-500">Get started by creating a new task.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(task) => {
                      // For editing, we would open a modal or expand the task card
                      console.log('Edit task:', task);
                    }}
                    onDelete={handleDeleteTask}
                    onToggle={handleToggleTask}
                  />
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Add Task Form */}
        {showForm && (
          <div className="lg:col-span-1">
            <GlassCard className="sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Add New Task
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <AdvancedTaskForm
                onSubmit={async (taskData) => {
                  await createTask(taskData.title, taskData.description, taskData.priority, taskData.due_date, taskData.tags);
                }}
                onCancel={() => setShowForm(false)}
                submitButtonText={loading ? 'Adding...' : 'Add Task'}
              />
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}