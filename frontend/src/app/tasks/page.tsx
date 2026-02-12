// src/app/tasks/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import TaskProviderWrapper from '@/components/TaskProviderWrapper';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import TaskCard from '@/components/TaskCard';
import AdvancedTaskForm from '@/components/AdvancedTaskForm';

export default function TasksPage() {
  return (
    <TaskProviderWrapper>
      <DashboardLayout>
        <TasksContent />
      </DashboardLayout>
    </TaskProviderWrapper>
  );
}

function TasksContent() {
  const { user } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTaskCompletion, fetchTasks } = useTask();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sort tasks based on selected sort option
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else { // sortBy === 'date'
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (a.due_date) {
        return -1;
      } else if (b.due_date) {
        return 1;
      }
      return 0;
    }
  });

  const handleCreateTask = async (taskData: any) => {
    await createTask(
      taskData.title, 
      taskData.description, 
      taskData.priority, 
      taskData.due_date, 
      taskData.tags
    );
    setShowForm(false);
  };

  const handleUpdateTask = async (id: number, taskData: any) => {
    await updateTask(
      id,
      taskData.title, 
      taskData.description, 
      taskData.priority, 
      taskData.due_date, 
      taskData.tags
    );
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
  };

  const handleToggleTask = (id: number) => {
    toggleTaskCompletion(id);
  };

  // Fetch tasks when filters change
  useEffect(() => {
    if (user) {
      const filters: { completed?: boolean; priority?: string; search?: string } = {};

      if (filter !== 'all') {
        filters.completed = filter === 'completed';
      }

      if (priorityFilter !== 'all') {
        filters.priority = priorityFilter;
      }

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      fetchTasks(filters);
    }
  }, [filter, priorityFilter, searchQuery, user, fetchTasks]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              {showForm ? 'Hide Form' : 'Add Task'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="input-field"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full"
            />
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field"
            >
              <option value="date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 dark:bg-red-900/30 p-4 border border-red-300 dark:border-red-800/50">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Add New Task
            </h2>
            <AdvancedTaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
              submitButtonText="Create Task"
            />
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-300">
              {filter === 'all' ? 'All Tasks' : filter === 'active' ? 'Active Tasks' : 'Completed Tasks'}
              <span className="ml-2 text-slate-600 dark:text-slate-500">({sortedTasks.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading tasks...</p>
            </div>
          ) : sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto bg-slate-200 dark:bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-300">No tasks found</h3>
              <p className="mt-1 text-slate-600 dark:text-slate-500">
                {filter === 'completed' 
                  ? "You haven't completed any tasks yet." 
                  : "Get started by creating a new task."}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map(task => (
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
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}