// src/components/AdvancedTaskForm.tsx
import React, { useState } from 'react';
import { Task } from '@/types/task';

interface AdvancedTaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'owner_id' | 'created_at' | 'updated_at'>) => void;
  onCancel?: () => void;
  initialTask?: Partial<Task>;
  submitButtonText?: string;
}

export default function AdvancedTaskForm({
  onSubmit,
  onCancel,
  initialTask = {},
  submitButtonText = 'Save Task'
}: AdvancedTaskFormProps) {
  const [title, setTitle] = useState(initialTask.title || '');
  const [description, setDescription] = useState(initialTask.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTask.priority as any || 'medium');
  const [dueDate, setDueDate] = useState(initialTask.due_date || '');
  const [tags, setTags] = useState<string[]>(initialTask.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      completed: initialTask.completed || false,
      priority,
      due_date: dueDate,
      tags
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Task Title *
        </label>
        <input
          type="text"
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field w-full"
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field w-full min-h-[100px]"
          placeholder="Add details..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="input-field w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-due-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="task-due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tags
        </label>
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-field flex-1 rounded-r-none"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-slate-700 dark:bg-slate-600 text-slate-200 px-4 py-2 rounded-r-lg border border-l-0 border-slate-600 dark:border-slate-500 hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 border border-violet-300 dark:border-violet-700/50"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          className="flex-1 btn-primary"
        >
          {submitButtonText}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}