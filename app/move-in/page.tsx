'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowRightLeft,
  KeyRound,
  FileCheck,
  CheckCircle2,
  BedDouble,
  ShieldCheck,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { propertyService } from '@/services/propertyService';
import { bookingService } from '@/services/bookingService';
import { financeService } from '@/services/financeService';
import { formatINR } from '@/lib/format';
import { toast } from 'sonner';

export default function MoveInPage() {
  const router = useRouter();
  const tenants = tenantService.getTenants().filter((t) => t.status === 'active');
  const properties = propertyService.getProperties();
  const rooms = propertyService.getRooms();
  const beds = propertyService.getBeds();

  const [tenantId, setTenantId] = useState(tenants[0]?.id || '');
  const [agreementDate, setAgreementDate] = useState(new Date().toISOString().split('T')[0]);
  const [depositReceived, setDepositReceived] = useState(24000);
  const [firstRentReceived, setFirstRentReceived] = useState(12000);
  const [inventoryChecked, setInventoryChecked] = useState(true);
  const [keysHandedOver, setKeysHandedOver] = useState(true);
  const [kycCompleted, setKycCompleted] = useState(true);
  const [remarks, setRemarks] = useState('Welcome kit and room keys handed over.');

  const selectedTenant = tenants.find((t) => t.id === tenantId);
  const selectedBed = beds.find((b) => b.id === selectedTenant?.bedId);
  const selectedRoom = rooms.find((r) => r.id === selectedTenant?.roomId);
  const selectedProp = properties.find((p) => p.id === selectedTenant?.propertyId);

  const handleCompleteMoveIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) {
      toast.error('Please choose a tenant');
      return;
    }

    bookingService.createMoveIn({
      tenantId,
      propertyId: selectedTenant?.propertyId || 'prop-1',
      roomId: selectedTenant?.roomId || 'room-101',
      bedId: selectedTenant?.bedId || 'bed-101-A',
      agreementDate,
      depositReceived,
      firstRentReceived,
      inventoryChecked,
      keysHandedOver,
      kycCompleted,
      remarks,
    });

    toast.success(`Move-In Check-In completed for ${selectedTenant?.name}!`);
    router.push(`/tenants/${tenantId}`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Move-In Check-In Desk"
        description="Verify inventory checklist, rental agreement signature, security deposit receipt, and key handover."
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Residents', href: '/tenants' },
          { label: 'Move In' },
        ]}
        actions={
          <Link href="/move-out">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Go to Move-Out Settlement</span>
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto">
        {/* Form Container */}
        <Card className="p-6 md:col-span-8 bg-card border-border/80 rounded-2xl shadow-xs">
          <form onSubmit={handleCompleteMoveIn} className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Resident Verification</h3>
              <p className="text-xs text-muted-foreground">Select the arriving resident to execute check-in.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Select Resident</Label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose resident" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.tenantCode} • {t.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Agreement Date</Label>
                <Input
                  type="date"
                  value={agreementDate}
                  onChange={(e) => setAgreementDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Security Deposit Received (₹)</Label>
                <Input
                  type="number"
                  step={1000}
                  value={depositReceived}
                  onChange={(e) => setDepositReceived(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">First Month Rent Received (₹)</Label>
                <Input
                  type="number"
                  step={500}
                  value={firstRentReceived}
                  onChange={(e) => setFirstRentReceived(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Remarks / Welcome Notes</Label>
                <Input
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="pt-4 border-t border-border/60 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Move-In Inspection Checklist
              </h4>

              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={inventoryChecked}
                    onChange={(e) => setInventoryChecked(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-foreground">Room Inventory & Fixtures Verified</span>
                    <p className="text-[11px] text-muted-foreground">Mattress, pillow, study chair, wardrobe keys, switchboards inspected.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={keysHandedOver}
                    onChange={(e) => setKeysHandedOver(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-foreground">RFID Card & Physical Room Keys Handed Over</span>
                    <p className="text-[11px] text-muted-foreground">Access card programmed for main entrance and room lock.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={kycCompleted}
                    onChange={(e) => setKycCompleted(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-foreground">Aadhaar & Police Verification Form Signed</span>
                    <p className="text-[11px] text-muted-foreground">Original ID verified and photocopies archived in document folder.</p>
                  </div>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full text-xs h-10 font-bold gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete Move-In Registration</span>
            </Button>
          </form>
        </Card>

        {/* Resident Summary Card */}
        <div className="md:col-span-4 space-y-4">
          <Card className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Allocated Room & Bed
            </h4>

            {selectedTenant ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2">
                  <p className="text-sm font-bold text-foreground">{selectedTenant.name}</p>
                  <p className="text-muted-foreground">{selectedTenant.phone}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">{selectedTenant.tenantCode}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property:</span>
                    <span className="font-semibold text-foreground">{selectedProp?.name || 'PG'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span className="font-semibold text-foreground">Room {selectedRoom?.roomNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bed:</span>
                    <span className="font-bold text-primary">Bed {selectedBed?.bedNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent:</span>
                    <span className="font-bold text-foreground">{formatINR(selectedTenant.monthlyRent)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">Select resident to preview</p>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
