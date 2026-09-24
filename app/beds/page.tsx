'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
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
  BedDouble,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Wrench,
  User,
  ArrowRight,
  UserPlus,
  RotateCcw,
} from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { tenantService } from '@/services/tenantService';
import { Bed, BedStatus } from '@/types/property';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialBeds } from '@/data/properties';
import { formatINR } from '@/lib/format';
import { toast } from 'sonner';

export default function BedsPage() {
  const [beds, setBeds] = useStorageState<Bed[]>(STORAGE_KEYS.BEDS, initialBeds);
  const properties = propertyService.getProperties();
  const rooms = propertyService.getRooms();
  const tenants = tenantService.getTenants();

  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Interactive Action Dialogs
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [actionType, setActionType] = useState<'assign' | 'reserve' | 'release' | 'maintenance' | null>(null);

  // Form states for modal
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [reserveApplicantName, setReserveApplicantName] = useState('');

  // Computations
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
  const availableBeds = beds.filter((b) => b.status === 'available').length;
  const reservedBeds = beds.filter((b) => b.status === 'reserved').length;
  const maintenanceBeds = beds.filter((b) => b.status === 'maintenance').length;

  const filteredBeds = beds.filter((b) => {
    const matchesSearch =
      b.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.tenantName && b.tenantName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProp = propertyFilter === 'all' || b.propertyId === propertyFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesProp && matchesStatus;
  });

  const handleOpenAction = (bed: Bed, action: 'assign' | 'reserve' | 'release' | 'maintenance') => {
    setSelectedBed(bed);
    setActionType(action);
    setSelectedTenantId(tenants[0]?.id || '');
    setReserveApplicantName('');
  };

  const handleExecuteAction = () => {
    if (!selectedBed || !actionType) return;

    if (actionType === 'assign') {
      const tenant = tenants.find((t) => t.id === selectedTenantId);
      if (!tenant) {
        toast.error('Please choose a tenant');
        return;
      }
      propertyService.assignBed(selectedBed.id, tenant.id, tenant.name);
      tenantService.updateTenant(tenant.id, { bedId: selectedBed.id, roomId: selectedBed.roomId });
      toast.success(`Bed ${selectedBed.bedNumber} assigned to ${tenant.name}!`);
    } else if (actionType === 'release') {
      propertyService.releaseBed(selectedBed.id);
      if (selectedBed.tenantId) {
        tenantService.updateTenant(selectedBed.tenantId, { bedId: '', status: 'vacated' });
      }
      toast.success(`Bed ${selectedBed.bedNumber} is now Available.`);
    } else if (actionType === 'reserve') {
      if (!reserveApplicantName) {
        toast.error('Please enter applicant name');
        return;
      }
      propertyService.reserveBed(selectedBed.id, reserveApplicantName);
      toast.success(`Bed ${selectedBed.bedNumber} reserved for ${reserveApplicantName}`);
    } else if (actionType === 'maintenance') {
      propertyService.markBedMaintenance(selectedBed.id);
      toast.success(`Bed ${selectedBed.bedNumber} marked for maintenance.`);
    }

    setActionType(null);
    setSelectedBed(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Visual Bed Allocation Matrix"
        description="Monitor live bed occupancy, allocate tenants, reserve upcoming beds, or mark units for maintenance."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Beds' }]}
      />

      {/* KPI Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <StatCard title="Total Beds" value={totalBeds} subtitle="Across all properties" icon={BedDouble} />
        <StatCard
          title="Occupied"
          value={occupiedBeds}
          subtitle={`${Math.round((occupiedBeds / totalBeds) * 100)}% occupancy`}
          icon={CheckCircle}
          iconColor="text-blue-600 bg-blue-500/10"
        />
        <StatCard
          title="Available"
          value={availableBeds}
          subtitle="Ready for check-in"
          icon={CheckCircle}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Reserved"
          value={reservedBeds}
          subtitle="Pending move-in"
          icon={Clock}
          iconColor="text-amber-600 bg-amber-500/10"
        />
        <StatCard
          title="Maintenance"
          value={maintenanceBeds}
          subtitle="Repair & cleaning"
          icon={Wrench}
          iconColor="text-rose-600 bg-rose-500/10"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bed # or tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="h-9 text-xs w-48">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bed Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const prop = properties.find((p) => p.id === bed.propertyId);
          const room = rooms.find((r) => r.id === bed.roomId);

          return (
            <Card
              key={bed.id}
              className={`p-4 rounded-2xl border transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between ${
                bed.status === 'occupied'
                  ? 'bg-blue-50/20 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50'
                  : bed.status === 'available'
                  ? 'bg-emerald-50/20 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                  : bed.status === 'reserved'
                  ? 'bg-amber-50/20 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50'
                  : 'bg-rose-50/20 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4 text-primary" />
                    <span className="text-sm font-extrabold text-foreground">Bed {bed.bedNumber}</span>
                  </div>
                  <StatusBadge status={bed.status} />
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-[11px] font-semibold text-foreground">
                    {prop ? prop.name : 'PG Property'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Room {room?.roomNumber || 'Room'} • Floor {room?.floorNumber || 1}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-card border border-border/60 text-xs mb-3">
                  {bed.status === 'occupied' && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Resident</p>
                      <p className="font-bold text-foreground truncate">{bed.tenantName}</p>
                    </div>
                  )}
                  {bed.status === 'available' && (
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      ✓ Vacant & Ready to Occupy
                    </p>
                  )}
                  {bed.status === 'reserved' && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Reserved For</p>
                      <p className="font-semibold text-amber-600 truncate">{bed.tenantName || 'Applicant'}</p>
                    </div>
                  )}
                  {bed.status === 'maintenance' && (
                    <p className="text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                      ⚠ Cleaning & Repainting
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Monthly Rent: <strong>{formatINR(bed.monthlyRent)}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/60 text-xs">
                {bed.status === 'available' ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleOpenAction(bed, 'assign')}
                      className="h-7 text-[11px] gap-1 rounded-lg"
                    >
                      <UserPlus className="h-3 w-3" />
                      <span>Assign</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenAction(bed, 'reserve')}
                      className="h-7 text-[11px] rounded-lg"
                    >
                      Reserve
                    </Button>
                  </>
                ) : bed.status === 'occupied' ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenAction(bed, 'release')}
                      className="h-7 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg col-span-2"
                    >
                      Vacate / Release Bed
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenAction(bed, 'release')}
                      className="h-7 text-[11px] rounded-lg col-span-2"
                    >
                      Mark Available
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={(open) => !open && setActionType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'assign' && `Assign Bed ${selectedBed?.bedNumber}`}
              {actionType === 'reserve' && `Reserve Bed ${selectedBed?.bedNumber}`}
              {actionType === 'release' && `Vacate Bed ${selectedBed?.bedNumber}`}
              {actionType === 'maintenance' && `Mark Bed ${selectedBed?.bedNumber} Maintenance`}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {actionType === 'assign' && 'Select an existing resident or registered tenant to occupy this bed.'}
              {actionType === 'reserve' && 'Enter the applicant name who paid the booking token.'}
              {actionType === 'release' && 'This bed will be marked vacant and ready for new residents.'}
            </DialogDescription>
          </DialogHeader>

          {actionType === 'assign' && (
            <div className="space-y-3 py-2">
              <Label className="text-xs">Select Resident Tenant</Label>
              <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.tenantCode} - {t.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {actionType === 'reserve' && (
            <div className="space-y-3 py-2">
              <Label className="text-xs">Applicant Name *</Label>
              <Input
                placeholder="e.g. Harish Sundaram"
                value={reserveApplicantName}
                onChange={(e) => setReserveApplicantName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setActionType(null)} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleExecuteAction} className="text-xs">
              Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
