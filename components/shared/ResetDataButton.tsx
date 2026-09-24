'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetDemoData } from '@/lib/storage';
import { toast } from 'sonner';
import { ConfirmDialog } from './ConfirmDialog';

export function ResetDataButton({ className }: { className?: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    resetDemoData();
    toast.success('Demo data restored to initial state!');
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        className={`h-8 gap-1.5 text-xs rounded-xl border-dashed text-muted-foreground hover:text-foreground hover:bg-muted ${className}`}
        title="Reset all demo records to initial dataset"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset Demo Data</span>
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Reset Demo Data?"
        description="This will restore all properties, rooms, tenants, bookings, invoices, and operations to the initial sample records. Any newly created test records will be refreshed."
        confirmLabel="Reset Everything"
        variant="destructive"
        onConfirm={handleReset}
      />
    </>
  );
}
