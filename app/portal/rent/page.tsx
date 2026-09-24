'use client';

import React, { useState } from 'react';
import { TenantPortalShell } from '@/components/layout/TenantPortalShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Receipt, CreditCard, QrCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { tenantService } from '@/services/tenantService';
import { financeService } from '@/services/financeService';
import { formatINR, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function TenantRentPage() {
  const { user } = useAuth();
  const tenant = tenantService.getTenantById(user.tenantId || 'tnt-1') || tenantService.getTenants()[0];
  const invoices = tenant ? financeService.getInvoicesByTenantId(tenant.id) : [];

  const [payingInvoice, setPayingInvoice] = useState<any | null>(null);

  const handleSimulatePayment = () => {
    if (!payingInvoice || !tenant) return;

    financeService.recordPayment({
      tenantId: tenant.id,
      invoiceId: payingInvoice.id,
      propertyId: tenant.propertyId,
      amount: payingInvoice.balanceAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'upi',
      referenceNumber: `UPI/PHONEPE-${Date.now().toString().slice(-6)}`,
      status: 'successful',
      collectedBy: 'PG Manager Gateway',
      remarks: 'Self-paid via Tenant Portal UPI',
    });

    toast.success(`Payment of ${formatINR(payingInvoice.balanceAmount)} processed successfully!`);
    setPayingInvoice(null);
  };

  return (
    <TenantPortalShell>
      <PageHeader
        title="Rent & Billing Statements"
        description="View your monthly rent breakdown, electricity charges, and pay online with UPI."
        breadcrumbs={[{ label: 'Portal', href: '/portal/dashboard' }, { label: 'Rent' }]}
      />

      <div className="space-y-6">
        {invoices.length === 0 ? (
          <Card className="p-8 text-center bg-card border-border/80 rounded-2xl">
            <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No invoices generated yet</p>
          </Card>
        ) : (
          invoices.map((inv) => (
            <Card key={inv.id} className="p-6 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{inv.invoiceNumber}</span>
                    <span className="font-bold text-foreground text-sm">• {inv.month}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Due date: {formatDate(inv.dueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={inv.status} />
                  {inv.balanceAmount > 0 && (
                    <Button
                      size="sm"
                      onClick={() => setPayingInvoice(inv)}
                      className="h-8 gap-1.5 text-xs rounded-xl shadow-xs"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Pay {formatINR(inv.balanceAmount)}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-2 text-xs">
                {inv.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-1 text-muted-foreground">
                    <span>{item.description}</span>
                    <span className="font-semibold text-foreground">{formatINR(item.amount)}</span>
                  </div>
                ))}
                {inv.lateFee > 0 && (
                  <div className="flex justify-between py-1 text-rose-600 font-medium">
                    <span>Late fee penalty</span>
                    <span>+{formatINR(inv.lateFee)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border/60 font-bold text-foreground text-sm">
                  <span>Total Amount</span>
                  <span>{formatINR(inv.totalAmount)}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pay Online Dialog */}
      <Dialog open={!!payingInvoice} onOpenChange={(open) => !open && setPayingInvoice(null)}>
        <DialogContent className="max-w-md p-6 text-center">
          <DialogHeader>
            <DialogTitle>Pay Rent via UPI</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Scan QR code with any UPI app (GPay, PhonePe, Paytm).
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 my-2 rounded-2xl bg-muted/40 border border-border/60 flex flex-col items-center">
            <div className="p-3 bg-white rounded-xl shadow-sm mb-3">
              <QrCode className="h-36 w-36 text-slate-900" />
            </div>
            <p className="text-xs font-semibold text-foreground">UPI ID: pgmanager.business@icici</p>
            <p className="text-xl font-extrabold text-foreground mt-1">
              {formatINR(payingInvoice?.balanceAmount)}
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setPayingInvoice(null)} className="text-xs w-full">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSimulatePayment} className="text-xs w-full gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle2 className="h-4 w-4" />
              <span>Simulate Successful UPI Payment</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TenantPortalShell>
  );
}
