'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  UserPlus,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Building,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { bookingService } from '@/services/bookingService';
import { propertyService } from '@/services/propertyService';
import { Application, ApplicationStatus } from '@/types/booking';
import { RoomType } from '@/types/property';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialApplications } from '@/data/bookings';
import { formatINR, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useStorageState<Application[]>(
    STORAGE_KEYS.APPLICATIONS,
    initialApplications
  );
  const properties = propertyService.getProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [preferredPropertyId, setPreferredPropertyId] = useState(properties[0]?.id || '');
  const [preferredRoomType, setPreferredRoomType] = useState<RoomType>('double');
  const [budget, setBudget] = useState(12000);
  const [expectedMoveInDate, setExpectedMoveInDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState<Application['source']>('website');
  const [notes, setNotes] = useState('');

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone || !preferredPropertyId) {
      toast.error('Please enter name, phone, and property');
      return;
    }

    const newApp = bookingService.createApplication({
      applicantName,
      phone,
      email,
      preferredPropertyId,
      preferredRoomType,
      budget,
      expectedMoveInDate,
      source,
      status: 'new',
      notes,
    });

    setIsAddOpen(false);
    toast.success(`Inquiry for ${newApp.applicantName} registered!`);
    setApplicantName('');
    setNotes('');
  };

  const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
    bookingService.updateApplicationStatus(id, status);
    toast.success(`Application updated to: ${status.replace('_', ' ').toUpperCase()}`);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      bookingService.deleteApplication(deleteTargetId);
      toast.success('Inquiry removed');
      setDeleteTargetId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Inquiries & Applications"
        description="Prospective tenant leads pipeline from website inquiries, walk-ins, and broker referrals."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Applications' }]}
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
            <Plus className="h-4 w-4" />
            <span>New Lead / Inquiry</span>
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Inquiries" value={applications.length} subtitle="Active pipeline leads" icon={UserPlus} />
        <StatCard
          title="New Leads"
          value={applications.filter((a) => a.status === 'new').length}
          subtitle="Awaiting contact"
          icon={Mail}
        />
        <StatCard
          title="Visits Scheduled"
          value={applications.filter((a) => a.status === 'visit_scheduled').length}
          subtitle="Site tours this week"
          icon={Calendar}
        />
        <StatCard
          title="Approved / Ready"
          value={applications.filter((a) => a.status === 'approved').length}
          subtitle="Ready for token booking"
          icon={CheckCircle}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applicant name or phone..."
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
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="visit_scheduled">Visit Scheduled</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="Try adjusting your search criteria or register a new applicant inquiry."
          actionLabel="New Inquiry"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                <th className="p-3.5 font-semibold">Applicant</th>
                <th className="p-3.5 font-semibold">Contact</th>
                <th className="p-3.5 font-semibold">Preferred Property</th>
                <th className="p-3.5 font-semibold">Preferred Room</th>
                <th className="p-3.5 font-semibold">Budget</th>
                <th className="p-3.5 font-semibold">Expected Move In</th>
                <th className="p-3.5 font-semibold">Source</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((app) => {
                const prop = properties.find((p) => p.id === app.preferredPropertyId);

                return (
                  <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      {app.applicantName}
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      <p className="font-medium text-foreground">{app.phone}</p>
                      <p className="text-[10px]">{app.email}</p>
                    </td>
                    <td className="p-3.5 font-medium text-foreground">
                      {prop?.name || 'Any PG'}
                    </td>
                    <td className="p-3.5 capitalize font-medium text-foreground">
                      {app.preferredRoomType.replace('_', ' ')}
                    </td>
                    <td className="p-3.5 font-bold text-foreground">
                      {formatINR(app.budget)}
                    </td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                      {formatDate(app.expectedMoveInDate)}
                    </td>
                    <td className="p-3.5 capitalize text-muted-foreground">
                      {app.source.replace('_', ' ')}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Select
                          value={app.status}
                          onValueChange={(val: ApplicationStatus) => handleUpdateStatus(app.id, val)}
                        >
                          <SelectTrigger className="h-7 text-[11px] w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="visit_scheduled">Visit Scheduled</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTargetId(app.id)}
                          className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Lead Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log New Lead / Inquiry</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record walk-in inquiry or phone inquiry details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Applicant Name *</Label>
              <Input
                required
                placeholder="e.g. Sneha Reddy"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Phone Number *</Label>
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

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Preferred Property</Label>
                <Select value={preferredPropertyId} onValueChange={setPreferredPropertyId}>
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
                <Label className="text-xs">Preferred Sharing</Label>
                <Select value={preferredRoomType} onValueChange={(val: RoomType) => setPreferredRoomType(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="double">Double Sharing</SelectItem>
                    <SelectItem value="triple">Triple Sharing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Monthly Budget (₹)</Label>
                <Input
                  type="number"
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Expected Move In</Label>
                <Input
                  type="date"
                  value={expectedMoveInDate}
                  onChange={(e) => setExpectedMoveInDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Source</Label>
                <Select value={source} onValueChange={(val: any) => setSource(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="walk_in">Walk-in</SelectItem>
                    <SelectItem value="referral">Tenant Referral</SelectItem>
                    <SelectItem value="google">Google Maps</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Notes / Preferences</Label>
                <Input
                  placeholder="e.g. Needs car parking space"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Log Inquiry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Inquiry?"
        description="Are you sure you want to remove this applicant lead from the system?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </AppShell>
  );
}
