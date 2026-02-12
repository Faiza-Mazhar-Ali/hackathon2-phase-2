// src/types/task.ts

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  owner_id: number; // Changed to match backend
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}