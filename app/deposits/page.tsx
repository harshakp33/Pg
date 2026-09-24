'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PiggyBank,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Eye,
} from 'lucide-react';
import { financeService } from '@/services/financeService';
import { tenantService } from '@/services/tenantService';
import { propertyService } from '@/services/propertyService';
import { SecurityDeposit } from '@/types/finance';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialDeposits } from '@/data/finance';
import { formatINR, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function DepositsPage() {
  const [deposits, setDeposits] = useStorageState<SecurityDeposit[]>(
    STORAGE_KEYS.DEPOSITS,
    initialDeposits
  );

  const tenants = tenantService.getTenants();
  const properties = propertyService.getProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit / Refund dialog
  const [selectedDeposit, setSelectedDeposit] = useState<SecurityDeposit | null>(null);
  const [refundAmount, setRefundAmount] = useState(0);
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [deductionReason, setDeductionReason] = useState('');

  const totalHeld = deposits
    .filter((d) => d.status === 'held')
    .reduce((acc, d) => acc + d.refundableAmount, 0);
  const totalPaidIn = deposits.reduce((acc, d) => acc + d.paidAmount, 0);
  const totalRefunded = deposits.reduce((acc, d) => acc + d.refundedAmount, 0);

  const filtered = deposits.filter((dep) => {
    const tenant = tenants.find((t) => t.id === dep.tenantId);
    const matchesSearch =
      tenant &&
      (tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.tenantCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || dep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAction = (dep: SecurityDeposit) => {
    setSelectedDeposit(dep);
    setRefundAmount(dep.refundableAmount);
    setDeductionAmount(dep.deductionAmount);
    setDeductionReason(dep.deductionReason || '');
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeposit) return;

    financeService.updateDeposit(selectedDeposit.id, {
      refundableAmount: refundAmount,
      deductionAmount,
      deductionReason,
      status: refundAmount === 0 ? 'refunded' : 'held',
      refundDate: new Date().toISOString().split('T')[0],
    });

    toast.success('Deposit record updated successfully');
    setSelectedDeposit(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Security Deposits Management"
        description="Track resident caution deposits, held balances, damage deductions, and exit refunds."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Deposits' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Held Deposits" value={formatINR(totalHeld)} subtitle="Current refundable pool" icon={PiggyBank} />
        <StatCard
          title="Total Paid In"
          value={formatINR(totalPaidIn)}
          subtitle="Cumulative caution money"
          icon={ShieldCheck}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Refunded"
          value={formatINR(totalRefunded)}
          subtitle="Returned upon move-out"
          icon={ArrowRightLeft}
          iconColor="text-sky-600 bg-sky-500/10"
        />
        <StatCard title="Active Accounts" value={deposits.length} subtitle="Resident deposit accounts" icon={CheckCircle2} />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenant name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-xs w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="held">Held Active</SelectItem>
            <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
            <SelectItem value="refunded">Fully Refunded</SelectItem>
            <SelectItem value="forfeited">Forfeited</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No deposit records found"
          description="Adjust your search criteria to locate resident caution deposit records."
        />
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                <th className="p-3.5 font-semibold">Resident Tenant</th>
                <th className="p-3.5 font-semibold">Property</th>
                <th className="p-3.5 font-semibold">Deposit Required</th>
                <th className="p-3.5 font-semibold">Paid Amount</th>
                <th className="p-3.5 font-semibold">Refundable Balance</th>
                <th className="p-3.5 font-semibold">Deductions</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((dep) => {
                const tenant = tenants.find((t) => t.id === dep.tenantId);
                const prop = properties.find((p) => p.id === dep.propertyId);

                return (
                  <tr key={dep.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-foreground">{tenant ? tenant.name : 'Resident'}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{tenant?.tenantCode}</p>
                    </td>
                    <td className="p-3.5 text-muted-foreground">{prop?.name || 'PG'}</td>
                    <td className="p-3.5 font-semibold text-foreground">{formatINR(dep.totalDeposit)}</td>
                    <td className="p-3.5 font-bold text-emerald-600">{formatINR(dep.paidAmount)}</td>
                    <td className="p-3.5 font-extrabold text-foreground">{formatINR(dep.refundableAmount)}</td>
                    <td className="p-3.5 text-rose-600 font-semibold">{formatINR(dep.deductionAmount)}</td>
                    <td className="p-3.5">
                      <StatusBadge status={dep.status} />
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAction(dep)}
                        className="h-7 text-xs rounded-lg"
                      >
                        Adjust / Settle
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust / Refund Dialog */}
      <Dialog open={!!selectedDeposit} onOpenChange={(open) => !open && setSelectedDeposit(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Security Deposit</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify refundable balance or record damage deductions for resident departure.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAction} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Refundable Balance (₹)</Label>
              <Input
                type="number"
                step={500}
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Deductions (Damages / Dues) (₹)</Label>
              <Input
                type="number"
                step={500}
                value={deductionAmount}
                onChange={(e) => setDeductionAmount(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Deduction Reason</Label>
              <Input
                placeholder="e.g. Unpaid electricity + painting fee"
                value={deductionReason}
                onChange={(e) => setDeductionReason(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedDeposit(null)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Update Deposit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
