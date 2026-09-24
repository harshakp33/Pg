'use client';

import React, { useState } from 'react';
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
import { CalendarDays, Plus, Search, CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import { operationsService } from '@/services/operationsService';
import { tenantService } from '@/services/tenantService';
import { LeaveRequest, LeaveStatus } from '@/types/operations';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialLeaveRequests } from '@/data/operations';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function LeavePage() {
  const [leaves, setLeaves] = useStorageState<LeaveRequest[]>(
    STORAGE_KEYS.LEAVE,
    initialLeaveRequests
  );

  const tenants = tenantService.getTenants();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Submit Leave Dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [tenantId, setTenantId] = useState(tenants[0]?.id || '');
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2024-11-05');
  const [reason, setReason] = useState('Diwali festival holiday with parents');

  // Review Dialog
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('Approved. Mess rebate applied.');

  const totalLeaves = leaves.length;
  const pendingCount = leaves.filter((l) => l.status === 'pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'approved').length;

  const filtered = leaves.filter((l) => {
    const tenant = tenants.find((t) => t.id === l.tenantId);
    const matchesSearch =
      l.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant && tenant.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const tenant = tenants.find((t) => t.id === tenantId);

    const newReq = operationsService.createLeaveRequest({
      tenantId,
      propertyId: tenant?.propertyId || 'prop-1',
      startDate,
      endDate,
      reason,
    });

    setIsAddOpen(false);
    toast.success('Leave request submitted!');
  };

  const handleExecuteReview = (status: LeaveStatus) => {
    if (!selectedLeave) return;
    operationsService.updateLeaveStatus(
      selectedLeave.id,
      status,
      'Warden / Manager',
      reviewRemarks
    );
    toast.success(`Leave request ${status.toUpperCase()}`);
    setSelectedLeave(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Resident Leave Applications"
        description="Review holiday requests, manage mess rebate deductions, and ensure property headcount accuracy."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Leave' }]}
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Apply Leave</span>
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Requests" value={totalLeaves} subtitle="All time leave logs" icon={CalendarDays} />
        <StatCard
          title="Pending Approval"
          value={pendingCount}
          subtitle="Awaiting warden review"
          icon={Clock}
          iconColor="text-amber-600 bg-amber-500/10"
        />
        <StatCard
          title="Approved Leaves"
          value={approvedCount}
          subtitle="Mess rebate authorized"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard title="Mess Headcount" value="-2" subtitle="Residents absent today" icon={Calendar} />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenant or reason..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No leave requests found"
          description="Adjust your search criteria or apply for resident vacation leave."
          actionLabel="Apply Leave"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                <th className="p-3.5 font-semibold">Resident</th>
                <th className="p-3.5 font-semibold">Leave Reason</th>
                <th className="p-3.5 font-semibold">Start Date</th>
                <th className="p-3.5 font-semibold">End Date</th>
                <th className="p-3.5 font-semibold">Requested On</th>
                <th className="p-3.5 font-semibold">Review Remarks</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((l) => {
                const tenant = tenants.find((t) => t.id === l.tenantId);

                return (
                  <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      {tenant ? tenant.name : 'Resident'}
                      <span className="block text-[10px] text-muted-foreground">{tenant?.phone}</span>
                    </td>
                    <td className="p-3.5 max-w-xs font-medium text-foreground">
                      {l.reason}
                    </td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">{formatDate(l.startDate)}</td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">{formatDate(l.endDate)}</td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">{formatDate(l.requestedAt)}</td>
                    <td className="p-3.5 text-[11px] text-muted-foreground">
                      {l.reviewRemarks || 'Pending review'}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      {l.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedLeave(l);
                              setReviewRemarks('Approved. Mess rebate applied.');
                            }}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedLeave(l);
                              setReviewRemarks('Rejected. Prior notice not provided.');
                            }}
                            className="h-7 text-xs text-rose-600 rounded-lg gap-1 hover:bg-rose-50"
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground capitalize font-medium">
                          {l.status} by {l.reviewedBy || 'Warden'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Leave Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Resident Leave Request</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Notify the warden of absence to adjust kitchen mess billing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLeave} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Resident Tenant *</Label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} (Bed: {t.bedId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Start Date *</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Return Date *</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Reason for Leave</Label>
              <Input
                placeholder="e.g. Diwali vacation with family"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Submit Leave
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={!!selectedLeave} onOpenChange={(open) => !open && setSelectedLeave(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Authorize or decline resident leave.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <p className="font-semibold text-foreground">
              Reason: <span className="font-normal text-muted-foreground">{selectedLeave?.reason}</span>
            </p>
            <p className="font-semibold text-foreground">
              Duration: <span className="font-normal text-muted-foreground">{formatDate(selectedLeave?.startDate)} to {formatDate(selectedLeave?.endDate)}</span>
            </p>

            <div className="space-y-1">
              <Label className="text-xs">Warden Review Remarks</Label>
              <Input
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleExecuteReview('rejected')}
              className="text-xs text-rose-600 hover:bg-rose-50"
            >
              Reject Leave
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleExecuteReview('approved')}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Approve Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
