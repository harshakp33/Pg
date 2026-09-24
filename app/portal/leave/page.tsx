'use client';

import React, { useState } from 'react';
import { TenantPortalShell } from '@/components/layout/TenantPortalShell';
import { useAuth } from '@/hooks/useAuth';
import { useStorageState } from '@/hooks/useStorageState';
import { operationsService } from '@/services/operationsService';
import { tenantService } from '@/services/tenantService';
import { LeaveRequest } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  Plus, 
  Plane, 
  Clock, 
  CheckCircle2, 
  UtensilsCrossed
} from 'lucide-react';

export default function TenantLeavePage() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useStorageState<LeaveRequest[]>(
    'pg_leave_requests',
    operationsService.getLeaveRequests()
  );
  const tenants = tenantService.getTenants();
  const currentTenant = tenants.find(t => t.email === user?.email) || tenants[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [foodOptOut, setFoodOptOut] = useState(true);

  // Filter leave requests for this tenant
  const tenantLeaves = leaveRequests.filter(l => l.tenantId === currentTenant?.id);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
    return days > 0 ? days : 0;
  };

  const selectedDays = calculateDays(startDate, endDate);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim() || !currentTenant) {
      toast.error('Please enter start date, end date, and reason');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be prior to start date');
      return;
    }

    try {
      operationsService.createLeaveRequest({
        propertyId: currentTenant.propertyId,
        tenantId: currentTenant.id,
        startDate,
        endDate,
        reason: foodOptOut && selectedDays >= 3 ? `${reason.trim()} (Mess Rebate Requested)` : reason.trim(),
      });

      setLeaveRequests(operationsService.getLeaveRequests());
      toast.success('Leave request submitted to Warden for approval');
      setIsModalOpen(false);
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch {
      toast.error('Failed to submit leave request');
    }
  };

  return (
    <TenantPortalShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Leave & Travel Gate Pass</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Apply for outstation holiday leave, claim mess food rebate, and notify building security.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Apply For Leave
          </button>
        </div>

        {/* Info card regarding mess rebate */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
          <UtensilsCrossed className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <span className="font-semibold block text-sm">Mess Food Rebate Policy:</span>
            Leaves of 3 consecutive days or more with 24h prior intimation are eligible for a mess deduction of ₹120/day on next month’s billing.
          </div>
        </div>

        {/* Requests list */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Past & Pending Requests</h2>
          {tenantLeaves.length === 0 ? (
            <div className="text-center py-14 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8">
              <Plane className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">No Leave Requests</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                You haven’t applied for any leaves yet. Click below when planning a visit home or vacation.
              </p>
            </div>
          ) : (
            tenantLeaves.map(leave => {
              const days = calculateDays(leave.startDate, leave.endDate);
              return (
                <div
                  key={leave.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {days} Day{days > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{leave.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span>Applied on {formatDate(leave.requestedAt)}</span>
                        {leave.reviewedBy && (
                          <span>• Reviewed by {leave.reviewedBy}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <StatusBadge status={leave.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Apply Leave Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apply for Leave</h3>
                  <p className="text-xs text-slate-500">Intimate PG Warden and pause mess billing.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Departure Date *</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Return Date *</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {selectedDays > 0 && (
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 p-2.5 rounded-xl flex items-center justify-between">
                    <span>Total Duration: <strong>{selectedDays} days</strong></span>
                    {foodOptOut && selectedDays >= 3 && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Est. Rebate: ₹{selectedDays * 120}
                      </span>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason / Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traveling to Hometown (Pune) for Diwali holidays"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="foodOptOut"
                    checked={foodOptOut}
                    onChange={(e) => setFoodOptOut(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
                  />
                  <label htmlFor="foodOptOut" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    Opt-out of PG meals during this leave window (Mess Rebate)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TenantPortalShell>
  );
}
