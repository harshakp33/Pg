'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle2, XCircle, Calendar, ArrowLeft } from 'lucide-react';
import { operationsService } from '@/services/operationsService';
import { Staff, StaffAttendanceRecord, AttendanceStatus } from '@/types/operations';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialStaff, initialStaffAttendance } from '@/data/operations';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function AttendancePage() {
  const [attendance, setAttendance] = useStorageState<StaffAttendanceRecord[]>(
    STORAGE_KEYS.ATTENDANCE,
    initialStaffAttendance
  );
  const staffMembers = operationsService.getStaff();

  const [selectedDate, setSelectedDate] = useState('2024-10-20');

  // Compute stats for selected date
  const dateRecords = attendance.filter((a) => a.date === selectedDate);
  const presentCount = dateRecords.filter((a) => a.status === 'present').length;
  const absentCount = dateRecords.filter((a) => a.status === 'absent').length;
  const halfDayCount = dateRecords.filter((a) => a.status === 'half_day').length;
  const leaveCount = dateRecords.filter((a) => a.status === 'leave').length;

  const attendancePercentage =
    staffMembers.length > 0 ? Math.round(((presentCount + halfDayCount * 0.5) / staffMembers.length) * 100) : 0;

  const handleMarkStatus = (staffId: string, status: AttendanceStatus) => {
    operationsService.markAttendance(staffId, selectedDate, status);
    toast.success(`Marked as ${status.replace('_', ' ').toUpperCase()}`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Staff Attendance Register"
        description="Daily roster check-in/out and monthly biometric duty records."
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Staff', href: '/staff' },
          { label: 'Attendance' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/staff">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Staff</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Attendance Rate" value={`${attendancePercentage}%`} subtitle="Duty turnout today" icon={Clock} />
        <StatCard
          title="Present On Duty"
          value={presentCount}
          subtitle={`${halfDayCount} half-day shifts`}
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Absent"
          value={absentCount}
          subtitle="Unexcused absence"
          icon={XCircle}
          iconColor="text-rose-600 bg-rose-500/10"
        />
        <StatCard title="On Leave" value={leaveCount} subtitle="Authorized vacation" icon={Calendar} iconColor="text-amber-600 bg-amber-500/10" />
      </div>

      {/* Daily & Monthly Views */}
      <Tabs defaultValue="daily" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="daily" className="text-xs rounded-lg">Daily Register View</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs rounded-lg">Monthly Summary Roster</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Selected Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-8 px-2 rounded-lg border border-border text-xs bg-card"
            />
          </div>
        </div>

        {/* Daily View Tab */}
        <TabsContent value="daily" className="space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                  <th className="p-3.5 font-semibold">Staff Code</th>
                  <th className="p-3.5 font-semibold">Name & Contact</th>
                  <th className="p-3.5 font-semibold">Role</th>
                  <th className="p-3.5 font-semibold">Shift</th>
                  <th className="p-3.5 font-semibold">In / Out Time</th>
                  <th className="p-3.5 font-semibold">Current Status</th>
                  <th className="p-3.5 font-semibold text-right">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {staffMembers.map((staff) => {
                  const record = dateRecords.find((r) => r.staffId === staff.id);
                  const currentStatus = record?.status || 'present';

                  return (
                    <tr key={staff.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-foreground">{staff.staffCode}</td>
                      <td className="p-3.5">
                        <p className="font-bold text-foreground">{staff.name}</p>
                        <p className="text-[10px] text-muted-foreground">{staff.phone}</p>
                      </td>
                      <td className="p-3.5 capitalize font-medium text-foreground">{staff.role}</td>
                      <td className="p-3.5 capitalize text-muted-foreground">{staff.shift}</td>
                      <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                        {record?.checkIn || '09:00'} - {record?.checkOut || '18:00'}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={currentStatus} />
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant={currentStatus === 'present' ? 'default' : 'outline'}
                            onClick={() => handleMarkStatus(staff.id, 'present')}
                            className="h-7 text-[11px] px-2"
                          >
                            P
                          </Button>
                          <Button
                            size="sm"
                            variant={currentStatus === 'half_day' ? 'default' : 'outline'}
                            onClick={() => handleMarkStatus(staff.id, 'half_day')}
                            className="h-7 text-[11px] px-2 text-amber-600"
                          >
                            HD
                          </Button>
                          <Button
                            size="sm"
                            variant={currentStatus === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => handleMarkStatus(staff.id, 'absent')}
                            className="h-7 text-[11px] px-2 text-rose-600"
                          >
                            A
                          </Button>
                          <Button
                            size="sm"
                            variant={currentStatus === 'leave' ? 'default' : 'outline'}
                            onClick={() => handleMarkStatus(staff.id, 'leave')}
                            className="h-7 text-[11px] px-2 text-violet-600"
                          >
                            L
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Monthly Summary Tab */}
        <TabsContent value="monthly" className="space-y-4">
          <Card className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground">Monthly Attendance Overview (October 2024)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground">
                    <th className="p-3 font-semibold">Staff Member</th>
                    <th className="p-3 font-semibold">Role</th>
                    <th className="p-3 font-semibold">Total Days</th>
                    <th className="p-3 font-semibold">Present</th>
                    <th className="p-3 font-semibold">Half Days</th>
                    <th className="p-3 font-semibold">Leaves</th>
                    <th className="p-3 font-semibold">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {staffMembers.map((s, idx) => {
                    const daysPresent = 25 - (idx % 3);
                    const leavesTaken = idx % 2;
                    const pct = Math.round((daysPresent / 26) * 100);

                    return (
                      <tr key={s.id} className="hover:bg-muted/20">
                        <td className="p-3 font-bold text-foreground">{s.name}</td>
                        <td className="p-3 capitalize text-muted-foreground">{s.role}</td>
                        <td className="p-3 text-muted-foreground">26 Days</td>
                        <td className="p-3 font-bold text-emerald-600">{daysPresent}</td>
                        <td className="p-3 text-amber-600">{idx % 3 === 0 ? 1 : 0}</td>
                        <td className="p-3 text-violet-600">{leavesTaken}</td>
                        <td className="p-3 font-extrabold text-foreground">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
