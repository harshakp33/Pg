'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
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
  ShieldCheck,
  Plus,
  Search,
  Users,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  DollarSign,
  Phone,
  Mail,
} from 'lucide-react';
import { operationsService } from '@/services/operationsService';
import { propertyService } from '@/services/propertyService';
import { Staff, StaffRole } from '@/types/operations';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialStaff } from '@/data/operations';
import { formatINR, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function StaffPage() {
  const [staffList, setStaffList] = useStorageState<Staff[]>(
    STORAGE_KEYS.STAFF,
    initialStaff
  );

  const properties = propertyService.getProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('warden');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [joiningDate, setJoiningDate] = useState('2023-01-10');
  const [salary, setSalary] = useState(28000);
  const [status, setStatus] = useState<Staff['status']>('active');
  const [shift, setShift] = useState<Staff['shift']>('general');

  const totalPayroll = staffList.reduce((acc, s) => acc + s.salary, 0);

  const filtered = staffList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.staffCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName('');
    setPhone('+91 ');
    setEmail('');
    setRole('warden');
    setPropertyId(properties[0]?.id || '');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setSalary(28000);
    setStatus('active');
    setShift('general');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (s: Staff) => {
    setEditingStaff(s);
    setName(s.name);
    setPhone(s.phone);
    setEmail(s.email);
    setRole(s.role);
    setPropertyId(s.propertyId);
    setJoiningDate(s.joiningDate);
    setSalary(s.salary);
    setStatus(s.status);
    setShift(s.shift);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please enter staff name and phone');
      return;
    }

    if (editingStaff) {
      operationsService.updateStaff(editingStaff.id, {
        name,
        phone,
        email,
        role,
        propertyId,
        joiningDate,
        salary,
        status,
        shift,
      });
      toast.success('Staff profile updated');
    } else {
      operationsService.createStaff({
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@pgmanager.in`,
        role,
        propertyId,
        joiningDate,
        salary,
        status,
        shift,
      });
      toast.success('New staff member onboarded!');
    }

    setIsDialogOpen(false);
  };

  return (
    <AppShell>
      <PageHeader
        title="Staff & Property Crew"
        description="Property managers, wardens, security supervisors, housekeepers, and kitchen cooks."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Staff' }]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/attendance">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Daily Attendance</span>
              </Button>
            </Link>
            <Button onClick={handleOpenAdd} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Add Staff</span>
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Staff" value={staffList.length} subtitle="On property payroll" icon={ShieldCheck} />
        <StatCard
          title="Active Duty"
          value={staffList.filter((s) => s.status === 'active').length}
          subtitle="Currently working"
          icon={Users}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Monthly Payroll"
          value={formatINR(totalPayroll)}
          subtitle="Salary liabilities"
          icon={DollarSign}
        />
        <StatCard title="Wardens & Leads" value={staffList.filter((s) => s.role === 'warden' || s.role === 'manager').length} subtitle="Operations heads" icon={Calendar} />
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 text-xs w-44">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="warden">Warden</SelectItem>
            <SelectItem value="accountant">Accountant</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="cleaner">Cleaner</SelectItem>
            <SelectItem value="cook">Cook</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No staff members found"
          description="Adjust your search criteria or register a new staff member."
          actionLabel="Add Staff"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                <th className="p-3.5 font-semibold">Staff Code</th>
                <th className="p-3.5 font-semibold">Staff Member</th>
                <th className="p-3.5 font-semibold">Role</th>
                <th className="p-3.5 font-semibold">Property</th>
                <th className="p-3.5 font-semibold">Shift</th>
                <th className="p-3.5 font-semibold">Joining Date</th>
                <th className="p-3.5 font-semibold">Monthly Salary</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((s) => {
                const prop = properties.find((p) => p.id === s.propertyId);

                return (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-foreground">{s.staffCode}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-foreground">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.phone}</p>
                    </td>
                    <td className="p-3.5 capitalize font-medium text-foreground">{s.role}</td>
                    <td className="p-3.5 text-muted-foreground truncate max-w-[120px]">{prop?.name || 'PG'}</td>
                    <td className="p-3.5 capitalize text-muted-foreground">{s.shift}</td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">{formatDate(s.joiningDate)}</td>
                    <td className="p-3.5 font-bold text-foreground">{formatINR(s.salary)}</td>
                    <td className="p-3.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(s)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Profile' : 'Register New Staff Member'}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the employee role, property assignment, and salary.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Full Name *</Label>
              <Input
                required
                placeholder="e.g. Suresh Reddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Phone *</Label>
                <Input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Role</Label>
                <Select value={role} onValueChange={(val: StaffRole) => setRole(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="warden">Warden</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="cleaner">Cleaner</SelectItem>
                    <SelectItem value="cook">Cook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Shift</Label>
                <Select value={shift} onValueChange={(val: any) => setShift(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General (Day)</SelectItem>
                    <SelectItem value="day">Morning Shift</SelectItem>
                    <SelectItem value="night">Night Shift</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Assigned Property Location</Label>
                <Select value={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Monthly Salary (₹)</Label>
                <Input
                  type="number"
                  step={1000}
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Joining Date</Label>
                <Input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                {editingStaff ? 'Update Profile' : 'Onboard Staff'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
