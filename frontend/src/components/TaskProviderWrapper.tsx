// src/components/TaskProviderWrapper.tsx
'use client';

import { TaskProvider } from '@/context/TaskContext';
import { ReactNode } from 'react';

export default function TaskProviderWrapper({ children }: { children: ReactNode }) {
  return <TaskProvider>{children}</TaskProvider>;
}