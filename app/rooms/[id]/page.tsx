'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DoorOpen,
  BedDouble,
  Users,
  CreditCard,
  Building2,
  ArrowLeft,
  CheckCircle,
  Wrench,
  User,
} from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { tenantService } from '@/services/tenantService';
import { formatINR } from '@/lib/format';
import { toast } from 'sonner';

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;
  const router = useRouter();

  const room = propertyService.getRoomById(roomId);
  const property = room ? propertyService.getPropertyById(room.propertyId) : undefined;
  const beds = propertyService.getBeds().filter((b) => b.roomId === roomId);
  const tenants = tenantService.getTenants().filter((t) => t.roomId === roomId);

  if (!room) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-xl font-bold">Room not found</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">The room does not exist.</p>
          <Link href="/rooms">
            <Button size="sm">Back to Rooms</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleToggleMaintenance = () => {
    const nextStatus = room.status === 'maintenance' ? 'available' : 'maintenance';
    propertyService.updateRoom(room.id, { status: nextStatus });
    toast.success(`Room status updated to ${nextStatus.toUpperCase()}`);
  };

  return (
    <AppShell>
      <PageHeader
        title={`Room ${room.roomNumber}`}
        description={`${property?.name || 'PG'} • Floor ${room.floorNumber} • ${room.roomType.replace('_', ' ')}`}
        badge={<StatusBadge status={room.status} />}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Rooms', href: '/rooms' },
          { label: `Room ${room.roomNumber}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleMaintenance}
              className="h-9 gap-1.5 text-xs rounded-xl"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>{room.status === 'maintenance' ? 'Mark Available' : 'Mark Maintenance'}</span>
            </Button>
            <Link href="/rooms">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Rooms</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Capacity" value={`${room.capacity} Beds`} subtitle="Total bed capacity" icon={BedDouble} />
        <StatCard
          title="Occupancy"
          value={`${beds.filter((b) => b.status === 'occupied').length} / ${room.capacity}`}
          subtitle={`${beds.filter((b) => b.status === 'available').length} Available`}
          icon={Users}
        />
        <StatCard title="Monthly Rent" value={formatINR(room.baseRent)} subtitle="Per bed monthly rate" icon={CreditCard} />
        <StatCard title="Floor" value={`Floor ${room.floorNumber}`} subtitle={property?.name || 'Property'} icon={Building2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Visual Bed Allocation Matrix for this Room */}
        <Card className="p-5 md:col-span-7 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Bed Allocation & Residents</h3>
            <span className="text-xs text-muted-foreground">{beds.length} Total Beds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {beds.map((bed) => {
              const tenant = tenants.find((t) => t.id === bed.tenantId || t.bedId === bed.id);

              return (
                <div
                  key={bed.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    bed.status === 'occupied'
                      ? 'bg-blue-50/40 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/60'
                      : bed.status === 'available'
                      ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60'
                      : 'bg-muted/40 border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground">Bed {bed.bedNumber}</span>
                    <StatusBadge status={bed.status} />
                  </div>

                  {tenant ? (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span>{tenant.name}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">{tenant.phone}</p>
                      <Link href={`/tenants/${tenant.id}`}>
                        <Button variant="link" className="p-0 h-auto text-xs text-primary font-medium">
                          View Tenant Profile →
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="py-2 text-[11px] text-muted-foreground">
                      {bed.status === 'reserved'
                        ? 'Reserved for upcoming move-in'
                        : bed.status === 'maintenance'
                        ? 'Under deep clean / repair'
                        : 'Bed is vacant and ready for booking'}
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Monthly Rent</span>
                    <span className="font-bold text-foreground">{formatINR(bed.monthlyRent)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Room Specifications & Amenities */}
        <Card className="p-5 md:col-span-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground">Room Specifications</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Room Type</span>
              <span className="font-semibold text-foreground capitalize">{room.roomType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Air Conditioning</span>
              <span className="font-semibold text-foreground">{room.hasAc ? 'Yes (Split AC)' : 'No (Ceiling Fan)'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Washroom</span>
              <span className="font-semibold text-foreground">{room.hasAttachedWashroom ? 'Attached Geyser Bathroom' : 'Common Floor Bathroom'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Balcony</span>
              <span className="font-semibold text-foreground">{room.hasBalcony ? 'Attached Private Balcony' : 'None'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Property Location</span>
              <span className="font-semibold text-foreground">{property?.name}</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {room.description || 'Standard well-ventilated executive sharing room equipped with individual wardrobes, study desk, and high-speed Wi-Fi coverage.'}
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
