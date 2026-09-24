'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'solid' | 'subtle' | 'outline';
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, variant = 'subtle', className, dot = true }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');

  // Semantic Color Resolution
  let colorStyles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let dotColor = 'bg-slate-500';

  // Green / Success: active, paid, available, resolved, completed, approved, verified, successful, inside
  if (['active', 'paid', 'available', 'resolved', 'completed', 'approved', 'verified', 'successful', 'inside', 'present'].includes(normalized)) {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    dotColor = 'bg-emerald-500';
  }
  // Amber / Warning: pending, partially_paid, partially_refunded, visit_scheduled, notice_period, held, half_day, medium
  else if (['pending', 'partially_paid', 'partially_refunded', 'visit_scheduled', 'notice_period', 'held', 'half_day', 'medium'].includes(normalized)) {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    dotColor = 'bg-amber-500';
  }
  // Red / Danger: overdue, critical, vacant, rejected, cancelled, failed, suspended, maintenance, absent
  else if (['overdue', 'critical', 'high', 'vacant', 'rejected', 'cancelled', 'failed', 'suspended', 'maintenance', 'absent'].includes(normalized)) {
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
    dotColor = 'bg-rose-500';
  }
  // Blue / Info: booked, occupied, in_progress, assigned, new, contacted, converted, low
  else if (['booked', 'occupied', 'in_progress', 'assigned', 'new', 'contacted', 'converted', 'low'].includes(normalized)) {
    colorStyles = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60';
    dotColor = 'bg-sky-500';
  }
  // Purple: draft, sent, reserved, leave
  else if (['draft', 'sent', 'reserved', 'leave', 'checked_out'].includes(normalized)) {
    colorStyles = 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60';
    dotColor = 'bg-violet-500';
  }

  // Format label
  const formattedLabel = status
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        colorStyles,
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />}
      <span>{formattedLabel}</span>
    </span>
  );
}
