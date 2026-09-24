'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  DoorOpen,
  BedDouble,
  Users,
  CreditCard,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Receipt,
  Activity,
  Plus,
} from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { tenantService } from '@/services/tenantService';
import { financeService } from '@/services/financeService';
import { operationsService } from '@/services/operationsService';
import { formatINR, formatDate } from '@/lib/format';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  const router = useRouter();

  const property = propertyService.getPropertyById(propertyId);
  const buildings = propertyService.getBuildings(propertyId);
  const rooms = propertyService.getRooms(propertyId);
  const beds = propertyService.getBeds(propertyId);
  const tenants = tenantService.getTenants(propertyId);
  const invoices = financeService.getInvoices(propertyId);
  const expenses = financeService.getExpenses(propertyId);
  const complaints = operationsService.getComplaints(propertyId);

  if (!property) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-xl font-bold">Property not found</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">The property you are looking for does not exist.</p>
          <Link href="/properties">
            <Button size="sm">Back to Properties</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
  const availableBeds = beds.filter((b) => b.status === 'available').length;
  const occupancyPct = beds.length > 0 ? Math.round((occupiedBeds / beds.length) * 100) : 0;
  const monthlyEstRevenue = beds.filter((b) => b.status === 'occupied').reduce((acc, b) => acc + b.monthlyRent, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <AppShell>
      <PageHeader
        title={property.name}
        description={`${property.address}, ${property.area}, ${property.city} - ${property.pincode}`}
        badge={<StatusBadge status={property.status} />}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Properties', href: '/properties' },
          { label: property.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/properties">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Properties</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Beds"
          value={beds.length}
          subtitle={`${occupiedBeds} occupied • ${availableBeds} vacant`}
          icon={BedDouble}
        />
        <StatCard
          title="Occupancy"
          value={`${occupancyPct}%`}
          subtitle="Capacity utilization"
          trend={{ value: `${occupiedBeds}/${beds.length} Beds`, isPositive: true }}
          icon={Building2}
        />
        <StatCard
          title="Monthly Collections"
          value={formatINR(monthlyEstRevenue)}
          subtitle="Rent potential"
          icon={CreditCard}
        />
        <StatCard
          title="Open Complaints"
          value={complaints.filter((c) => c.status !== 'closed' && c.status !== 'resolved').length}
          subtitle="Unresolved tickets"
          icon={AlertTriangle}
        />
      </div>

      {/* Property Details Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="rooms" className="text-xs rounded-lg">Rooms & Beds ({rooms.length})</TabsTrigger>
          <TabsTrigger value="tenants" className="text-xs rounded-lg">Tenants ({tenants.length})</TabsTrigger>
          <TabsTrigger value="financials" className="text-xs rounded-lg">Financials</TabsTrigger>
          <TabsTrigger value="complaints" className="text-xs rounded-lg">Complaints ({complaints.length})</TabsTrigger>
        </TabsList>

        {/* TAB 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 bg-card border-border/80 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-foreground">Property Information</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Manager</p>
                  <p className="font-semibold text-foreground mt-0.5">{property.managerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact Phone</p>
                  <p className="font-semibold text-foreground mt-0.5">{property.contactNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground mt-0.5">{property.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Floors</p>
                  <p className="font-semibold text-foreground mt-0.5">{property.totalFloors} Floors</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {property.address}, {property.area}, {property.city} - {property.pincode}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-card border-border/80 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-foreground">Amenities Provided</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-border/60">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Buildings In Location</h4>
                <div className="space-y-2">
                  {buildings.map((b) => (
                    <div key={b.id} className="p-2.5 rounded-xl border border-border/70 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-foreground">{b.name}</p>
                        <p className="text-[10px] text-muted-foreground">{b.description}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: Rooms & Beds */}
        <TabsContent value="rooms" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rooms.map((r) => {
              const roomBeds = beds.filter((b) => b.roomId === r.id);
              return (
                <Card key={r.id} className="p-4 bg-card border-border/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Room {r.roomNumber}</h4>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        Floor {r.floorNumber} • {r.roomType.replace('_', ' ')}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <p className="text-[11px] font-semibold text-muted-foreground">Beds Layout:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {roomBeds.map((bed) => (
                        <div
                          key={bed.id}
                          className={`p-2 rounded-lg border text-xs flex flex-col justify-between ${
                            bed.status === 'occupied'
                              ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50'
                              : bed.status === 'available'
                              ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                              : 'bg-muted/40 border-border/60'
                          }`}
                        >
                          <span className="font-bold text-foreground">{bed.bedNumber}</span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {bed.tenantName || bed.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 3: Tenants */}
        <TabsContent value="tenants" className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground">
                  <th className="p-3 font-medium">Tenant</th>
                  <th className="p-3 font-medium">Room & Bed</th>
                  <th className="p-3 font-medium">Phone</th>
                  <th className="p-3 font-medium">Rent</th>
                  <th className="p-3 font-medium">Payment</th>
                  <th className="p-3 font-medium">KYC</th>
                  <th className="p-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20">
                    <td className="p-3 font-semibold text-foreground">
                      <Link href={`/tenants/${t.id}`} className="hover:underline text-primary">
                        {t.name}
                      </Link>
                    </td>
                    <td className="p-3 font-medium text-foreground">
                      Bed {t.bedId.split('-').slice(1).join('-')}
                    </td>
                    <td className="p-3 text-muted-foreground">{t.phone}</td>
                    <td className="p-3 font-bold text-foreground">{formatINR(t.monthlyRent)}</td>
                    <td className="p-3"><StatusBadge status={t.paymentStatus} /></td>
                    <td className="p-3"><StatusBadge status={t.kyc.status} /></td>
                    <td className="p-3 text-right">
                      <Link href={`/tenants/${t.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Profile →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 4: Financials */}
        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 bg-card border-border/80 rounded-2xl">
              <h3 className="text-sm font-bold text-foreground mb-3">Recent Invoices</h3>
              <div className="space-y-2.5">
                {invoices.slice(0, 4).map((i) => (
                  <div key={i.id} className="p-2.5 rounded-xl border border-border/70 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{i.invoiceNumber} • {i.month}</p>
                      <p className="text-[10px] text-muted-foreground">Total: {formatINR(i.totalAmount)}</p>
                    </div>
                    <StatusBadge status={i.status} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-card border-border/80 rounded-2xl">
              <h3 className="text-sm font-bold text-foreground mb-3">Operating Expenses</h3>
              <div className="space-y-2.5">
                {expenses.slice(0, 4).map((e) => (
                  <div key={e.id} className="p-2.5 rounded-xl border border-border/70 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{e.title}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{e.category} • {formatDate(e.date)}</p>
                    </div>
                    <span className="font-bold text-foreground">{formatINR(e.amount)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 5: Complaints */}
        <TabsContent value="complaints" className="space-y-4">
          <div className="space-y-2.5">
            {complaints.length === 0 ? (
              <EmptyState title="No complaints" description="No maintenance issues logged for this location." />
            ) : (
              complaints.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-border/80 bg-card flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{c.title}</span>
                      <StatusBadge status={c.priority} />
                    </div>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                    <p className="text-[10px] text-muted-foreground">Logged on {formatDate(c.createdDate)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
