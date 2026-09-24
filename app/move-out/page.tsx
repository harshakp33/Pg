'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowRightLeft,
  Calculator,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { bookingService } from '@/services/bookingService';
import { financeService } from '@/services/financeService';
import { formatINR } from '@/lib/format';
import { toast } from 'sonner';

export default function MoveOutPage() {
  const router = useRouter();
  const tenants = tenantService.getTenants().filter((t) => t.status === 'active' || t.status === 'notice_period');

  const [tenantId, setTenantId] = useState(tenants[0]?.id || '');
  const [moveOutDate, setMoveOutDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Job relocation to another city');
  const [noticeGivenDate, setNoticeGivenDate] = useState('2024-09-15');

  // Settlement Calculator Fields
  const [outstandingRent, setOutstandingRent] = useState(0);
  const [utilityDues, setUtilityDues] = useState(650);
  const [damageCharges, setDamageCharges] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(1000); // deep cleaning / painting fee
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectedTenant = tenants.find((t) => t.id === tenantId);
  const depositAmount = selectedTenant ? selectedTenant.securityDeposit : 24000;

  // Auto calculate refund
  const totalDeductions = outstandingRent + utilityDues + damageCharges + otherDeductions;
  const finalRefundAmount = Math.max(0, depositAmount - totalDeductions);

  const handleConfirmSettlement = () => {
    if (!tenantId) {
      toast.error('Please select a tenant');
      return;
    }

    bookingService.createMoveOut({
      tenantId,
      moveOutDate,
      reason,
      noticeGivenDate,
      outstandingRent,
      utilityDues,
      damageCharges,
      otherDeductions,
      depositAmount,
      finalRefundAmount,
      settlementStatus: 'settled',
      settledAt: new Date().toISOString().split('T')[0],
      settledBy: 'Property Manager',
    });

    toast.success(`Move-Out Settlement finalized for ${selectedTenant?.name}! Bed vacated.`);
    router.push('/tenants');
  };

  return (
    <AppShell>
      <PageHeader
        title="Move-Out Settlement Calculator"
        description="Process resident departures, calculate security deposit deductions, and settle net refunds."
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Residents', href: '/tenants' },
          { label: 'Move Out' },
        ]}
        actions={
          <Link href="/move-in">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Go to Move-In Check-In</span>
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto">
        {/* Form Container */}
        <Card className="p-6 md:col-span-8 bg-card border-border/80 rounded-2xl shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Move-Out Details</h3>
            <p className="text-xs text-muted-foreground">Select resident and enter departure circumstances.</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Resident Leaving</Label>
            <Select value={tenantId} onValueChange={setTenantId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Choose resident" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.tenantCode} • Deposit: {formatINR(t.securityDeposit)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Departure / Move-Out Date</Label>
              <Input
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Notice Given Date</Label>
              <Input
                type="date"
                value={noticeGivenDate}
                onChange={(e) => setNoticeGivenDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Reason for Departure</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Job transfer, completed college, moving to independent flat"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Deductions Breakdown */}
          <div className="pt-4 border-t border-border/60 space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Settlement Deductions
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Unpaid Rent Balance (₹)</Label>
                <Input
                  type="number"
                  value={outstandingRent}
                  onChange={(e) => setOutstandingRent(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Pending Utility / Electricity (₹)</Label>
                <Input
                  type="number"
                  value={utilityDues}
                  onChange={(e) => setUtilityDues(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Damage / Repair Charges (₹)</Label>
                <Input
                  type="number"
                  value={damageCharges}
                  onChange={(e) => setDamageCharges(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Painting & Deep Cleaning (₹)</Label>
                <Input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="w-full text-xs h-10 font-bold gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Review & Execute Final Settlement</span>
          </Button>
        </Card>

        {/* Real-time Calculation Ledger Preview */}
        <div className="md:col-span-4 space-y-4">
          <Card className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-primary" />
              <span>Refund Settlement Ledger</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Original Deposit Held:</span>
                <span className="font-bold text-foreground">{formatINR(depositAmount)}</span>
              </div>

              <div className="space-y-1 text-muted-foreground py-1 border-b border-border/60">
                <div className="flex justify-between text-[11px]">
                  <span>- Unpaid Rent:</span>
                  <span className="text-rose-600 font-semibold">{formatINR(outstandingRent)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>- Electricity / Utilities:</span>
                  <span className="text-rose-600 font-semibold">{formatINR(utilityDues)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>- Room Damages:</span>
                  <span className="text-rose-600 font-semibold">{formatINR(damageCharges)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>- Painting / Deep Clean:</span>
                  <span className="text-rose-600 font-semibold">{formatINR(otherDeductions)}</span>
                </div>
              </div>

              <div className="flex justify-between py-1 text-xs">
                <span className="font-semibold text-muted-foreground">Total Deductions:</span>
                <span className="font-bold text-rose-600">{formatINR(totalDeductions)}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 mt-3">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Net Refund Due Resident</span>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatINR(finalRefundAmount)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Finalize Move-Out Settlement?"
        description={`Confirm final refund of ${formatINR(finalRefundAmount)} to ${selectedTenant?.name}. Their bed will be released back to vacant inventory and tenant marked as Vacated.`}
        confirmLabel="Finalize & Settle"
        variant="destructive"
        onConfirm={handleConfirmSettlement}
      />
    </AppShell>
  );
}
