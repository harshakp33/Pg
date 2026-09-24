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
import { CalendarCheck, Plus, Search, BedDouble, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { bookingService } from '@/services/bookingService';
import { propertyService } from '@/services/propertyService';
import { Booking, BookingStatus } from '@/types/booking';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialBookings } from '@/data/bookings';
import { formatINR, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function BookingsPage() {
  const [bookings, setBookings] = useStorageState<Booking[]>(
    STORAGE_KEYS.BOOKINGS,
    initialBookings
  );

  const properties = propertyService.getProperties();
  const rooms = propertyService.getRooms();
  const availableBeds = propertyService.getBeds().filter((b) => b.status === 'available');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [bedId, setBedId] = useState(availableBeds[0]?.id || '');
  const [moveInDate, setMoveInDate] = useState(new Date().toISOString().split('T')[0]);
  const [tokenDeposit, setTokenDeposit] = useState(5000);
  const [totalDeposit, setTotalDeposit] = useState(24000);
  const [monthlyRent, setMonthlyRent] = useState(12000);
  const [notes, setNotes] = useState('');

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone || !bedId) {
      toast.error('Please enter name, phone, and select a bed.');
      return;
    }

    const selectedBedObj = availableBeds.find((b) => b.id === bedId);

    const newBooking = bookingService.createBooking({
      applicantName,
      phone,
      email,
      propertyId,
      roomId: selectedBedObj?.roomId || 'room-101',
      bedId,
      moveInDate,
      tokenDeposit,
      totalDeposit,
      monthlyRent,
      status: 'confirmed',
      notes,
    });

    setIsAddOpen(false);
    toast.success(`Booking ${newBooking.bookingCode} confirmed! Bed reserved.`);
    setApplicantName('');
    setNotes('');
  };

  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    bookingService.updateBookingStatus(id, status);
    toast.success(`Booking marked as ${status.toUpperCase()}`);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      bookingService.deleteBooking(deleteTargetId);
      toast.success('Booking cancelled and reserved bed released.');
      setDeleteTargetId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Bookings & Reservations"
        description="Upcoming resident move-in reservations with advance token deposit tracking."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Bookings' }]}
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Create Booking</span>
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Bookings" value={bookings.length} subtitle="All reservation records" icon={CalendarCheck} />
        <StatCard
          title="Confirmed"
          value={bookings.filter((b) => b.status === 'confirmed').length}
          subtitle="Tokens received"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Pending"
          value={bookings.filter((b) => b.status === 'pending').length}
          subtitle="Awaiting agreement"
          icon={Clock}
          iconColor="text-amber-600 bg-amber-500/10"
        />
        <StatCard
          title="Advance Tokens"
          value={formatINR(bookings.reduce((acc, b) => acc + b.tokenDeposit, 0))}
          subtitle="Tokens held"
          icon={BedDouble}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search booking # or applicant..."
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
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="Adjust your search criteria or register a new resident booking."
          actionLabel="Create Booking"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                <th className="p-3.5 font-semibold">Booking #</th>
                <th className="p-3.5 font-semibold">Applicant</th>
                <th className="p-3.5 font-semibold">Contact</th>
                <th className="p-3.5 font-semibold">Reserved Bed</th>
                <th className="p-3.5 font-semibold">Move In Date</th>
                <th className="p-3.5 font-semibold">Token Advance</th>
                <th className="p-3.5 font-semibold">Monthly Rent</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-foreground">{b.bookingCode}</td>
                  <td className="p-3.5 font-bold text-foreground">{b.applicantName}</td>
                  <td className="p-3.5 text-muted-foreground">
                    <p className="font-medium text-foreground">{b.phone}</p>
                    <p className="text-[10px]">{b.email}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-primary">
                    Bed {b.bedId.split('-').slice(1).join('-')}
                  </td>
                  <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                    {formatDate(b.moveInDate)}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-600">
                    {formatINR(b.tokenDeposit)}
                  </td>
                  <td className="p-3.5 font-bold text-foreground">
                    {formatINR(b.monthlyRent)}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Select
                        value={b.status}
                        onValueChange={(val: BookingStatus) => handleUpdateStatus(b.id, val)}
                      >
                        <SelectTrigger className="h-7 text-[11px] w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTargetId(b.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Booking Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Bed Reservation</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Allocate a vacant bed and log advance token deposit received.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Applicant Name *</Label>
              <Input
                required
                placeholder="e.g. Harish Sundaram"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
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

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Property Location</Label>
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

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Reserve Vacant Bed *</Label>
                <Select value={bedId} onValueChange={setBedId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBeds.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        Bed {b.bedNumber} (₹{b.monthlyRent}/mo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Token Received (₹)</Label>
                <Input
                  type="number"
                  step={500}
                  value={tokenDeposit}
                  onChange={(e) => setTokenDeposit(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Monthly Rent (₹)</Label>
                <Input
                  type="number"
                  step={500}
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Move In Date</Label>
                <Input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Total Deposit (₹)</Label>
                <Input
                  type="number"
                  step={1000}
                  value={totalDeposit}
                  onChange={(e) => setTotalDeposit(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Notes</Label>
                <Input
                  placeholder="e.g. Balance deposit on move-in"
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
                Confirm Booking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete / Cancel Confirmation */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Cancel Booking?"
        description="Are you sure you want to cancel this booking? The reserved bed will be immediately marked available for other inquiries."
        confirmLabel="Cancel Booking"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </AppShell>
  );
}
