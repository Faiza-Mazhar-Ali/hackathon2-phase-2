// src/app/calendar/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import TaskProviderWrapper from '@/components/TaskProviderWrapper';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';

export default function CalendarPage() {
  return (
    <TaskProviderWrapper>
      <DashboardLayout>
        <CalendarContent />
      </DashboardLayout>
    </TaskProviderWrapper>
  );
}

function CalendarContent() {
  const { user } = useAuth();
  const { tasks, loading } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter tasks by date
  const tasksForCurrentMonth = tasks.filter(task => {
    if (!task.due_date) return false;
    const taskDate = new Date(task.due_date);
    return (
      taskDate.getMonth() === currentDate.getMonth() &&
      taskDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Get days in month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Get first day of month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Calendar
          </h1>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-700 text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              Today
            </button>
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg bg-slate-800 dark:bg-slate-700 text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              &lt;
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg bg-slate-800 dark:bg-slate-700 text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-300 text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-slate-500 dark:text-slate-400 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-24"></div>;
            }

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayTasks = tasksForCurrentMonth.filter(task => {
              if (!task.due_date) return false;
              const taskDate = new Date(task.due_date);
              return (
                taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
              );
            });

            return (
              <div 
                key={day} 
                className={`h-24 p-2 border rounded-lg ${
                  date.toDateString() === new Date().toDateString()
                    ? 'border-violet-500 dark:border-violet-400 bg-violet-100 dark:bg-violet-900/20'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className="text-slate-800 dark:text-slate-300 font-medium">{day}</div>
                <div className="mt-1 space-y-1 max-h-16 overflow-y-auto">
                  {dayTasks.slice(0, 2).map(task => (
                    <div 
                      key={task.id} 
                      className={`text-xs p-1 rounded truncate ${
                        task.completed 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' 
                          : 'bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-slate-600 dark:text-slate-500">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-300 mb-4">Upcoming Tasks</h3>
          {loading ? (
            <div className="text-center py-4 text-slate-600 dark:text-slate-500">Loading tasks...</div>
          ) : tasksForCurrentMonth.length === 0 ? (
            <div className="text-center py-4 text-slate-600 dark:text-slate-500">No tasks scheduled for this month</div>
          ) : (
            <div className="space-y-3">
              {[...tasksForCurrentMonth]
                .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime())
                .slice(0, 5)
                .map(task => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-lg flex justify-between items-center ${
                      task.completed 
                        ? 'bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-800/50' 
                        : 'bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">{task.title}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      task.completed 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' 
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                    }`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}