// src/components/TaskCard.tsx
import React from 'react';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  // Determine priority class for styling
  const priorityClass = task.priority === 'high' 
    ? 'priority-high' 
    : task.priority === 'medium' 
      ? 'priority-medium' 
      : 'priority-low';

  return (
    <div className={`task-card ${task.completed ? 'opacity-80' : ''} ${priorityClass}`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 h-5 w-5 text-violet-600 rounded-full focus:ring-violet-500 cursor-pointer border-slate-600 dark:border-slate-600"
        />
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <h3 className={`text-lg font-medium truncate ${task.completed ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
              {task.title}
            </h3>
            <span className={`status-badge ${task.completed ? 'status-completed' : 'status-pending'}`}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
          {task.description && (
            <p className={`text-sm mt-1 ${task.completed ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
            <div className="flex items-center">
              <span className="text-slate-500 dark:text-slate-400">Owner:</span>
              <span className="ml-1 text-slate-600 dark:text-slate-400">{task.owner_id}</span>
            </div>
            
            {task.priority && (
              <div className="flex items-center">
                <span className="text-slate-500 dark:text-slate-400">Priority:</span>
                <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                  task.priority === 'high' ? 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500/30' :
                  task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-500/30' :
                  'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-500/30'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            )}
            
            {task.due_date && (
              <div className="flex items-center">
                <span className="text-slate-500 dark:text-slate-400">Due:</span>
                <span className={`ml-1 text-slate-600 dark:text-slate-400 ${
                  new Date(task.due_date) < new Date() && !task.completed ? 'text-red-600 dark:text-red-400' : ''
                }`}>
                  {new Date(task.due_date).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {task.created_at && (
              <div className="flex items-center">
                <span className="text-slate-500 dark:text-slate-400">Created:</span>
                <span className="ml-1 text-slate-600 dark:text-slate-400">{new Date(task.created_at).toLocaleDateString()}</span>
              </div>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-1.5 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-700/50 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-1 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-md text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}