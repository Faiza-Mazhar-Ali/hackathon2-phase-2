// src/components/ui/GlassCard.tsx
import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <div
      className={`bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}