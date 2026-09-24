'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
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
  Receipt,
  Printer,
  CreditCard,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  User,
  QrCode,
} from 'lucide-react';
import { financeService } from '@/services/financeService';
import { tenantService } from '@/services/tenantService';
import { propertyService } from '@/services/propertyService';
import { PaymentMethod } from '@/types/finance';
import { formatINR, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const invoiceId = resolvedParams.id;
  const router = useRouter();

  const [invoice, setInvoice] = useState(() => financeService.getInvoiceById(invoiceId));
  const tenant = invoice ? tenantService.getTenantById(invoice.tenantId) : undefined;
  const property = invoice ? propertyService.getPropertyById(invoice.propertyId) : undefined;

  // Pay modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(invoice ? invoice.balanceAmount : 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [referenceNumber, setReferenceNumber] = useState(`UPI/${Date.now().toString().slice(-8)}`);

  if (!invoice) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-xl font-bold">Invoice not found</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">No invoice with this ID exists.</p>
          <Link href="/billing">
            <Button size="sm">Back to Billing</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      toast.error('Payment amount must be greater than zero');
      return;
    }

    financeService.recordPayment({
      tenantId: invoice.tenantId,
      invoiceId: invoice.id,
      propertyId: invoice.propertyId,
      amount: payAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      referenceNumber,
      status: 'successful',
      collectedBy: 'Accountant',
      remarks: `Payment against ${invoice.invoiceNumber}`,
    });

    // Refresh local invoice state
    const refreshed = financeService.getInvoiceById(invoice.id);
    if (refreshed) setInvoice({ ...refreshed });

    setPayModalOpen(false);
    toast.success(`Payment of ${formatINR(payAmount)} recorded successfully!`);
  };

  return (
    <AppShell>
      <PageHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        description={`Issued to ${tenant?.name || 'Resident'} for ${invoice.month}`}
        badge={<StatusBadge status={invoice.status} />}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Billing', href: '/billing' },
          { label: invoice.invoiceNumber },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="h-9 gap-1.5 text-xs rounded-xl"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Invoice</span>
            </Button>
            {invoice.balanceAmount > 0 && (
              <Button
                size="sm"
                onClick={() => setPayModalOpen(true)}
                className="h-9 gap-1.5 text-xs rounded-xl shadow-xs"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Record Payment</span>
              </Button>
            )}
          </div>
        }
      />

      {/* Invoice Printable View */}
      <Card className="max-w-4xl mx-auto p-8 sm:p-12 bg-card border-border/80 rounded-2xl shadow-sm space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">PG Manager</h2>
            </div>
            <p className="text-xs font-semibold text-foreground">{property?.name || 'Coliving'}</p>
            <p className="text-xs text-muted-foreground">{property?.address}</p>
            <p className="text-xs text-muted-foreground">{property?.area}, {property?.city} - {property?.pincode}</p>
            <p className="text-xs text-muted-foreground">Phone: {property?.contactNumber}</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">RENT INVOICE</h1>
            <p className="text-xs font-mono font-bold text-primary">{invoice.invoiceNumber}</p>
            <div className="pt-2 text-xs text-muted-foreground">
              <p>Issue Date: <strong className="text-foreground">{formatDate(invoice.issueDate)}</strong></p>
              <p>Due Date: <strong className="text-foreground">{formatDate(invoice.dueDate)}</strong></p>
              <p>Billing Month: <strong className="text-foreground">{invoice.month}</strong></p>
            </div>
          </div>
        </div>

        {/* Bill To Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Billed To (Resident)</p>
            <p className="text-sm font-bold text-foreground">{tenant?.name}</p>
            <p className="text-muted-foreground">{tenant?.phone}</p>
            <p className="text-muted-foreground">{tenant?.email}</p>
            <p className="text-muted-foreground font-mono">{tenant?.tenantCode}</p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Accommodation Info</p>
            <p className="font-semibold text-foreground">{property?.name}</p>
            <p className="text-muted-foreground">Bed Allocated: <strong className="text-foreground">{tenant?.bedId ? `Bed ${tenant.bedId.split('-').slice(1).join('-')}` : 'Bed 101-A'}</strong></p>
            <p className="text-muted-foreground">Status: <StatusBadge status={invoice.status} /></p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b-2 border-border text-foreground font-bold">
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5 text-center">Category</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {invoice.items.map((item) => (
                <tr key={item.id} className="text-foreground">
                  <td className="py-3 font-medium">{item.description}</td>
                  <td className="py-3 text-center uppercase text-[10px] text-muted-foreground">{item.category}</td>
                  <td className="py-3 text-right font-bold">{formatINR(item.amount)}</td>
                </tr>
              ))}
              {invoice.lateFee > 0 && (
                <tr className="text-rose-600 font-medium">
                  <td className="py-2">Late Payment Penalty</td>
                  <td className="py-2 text-center text-[10px]">late_fee</td>
                  <td className="py-2 text-right font-bold">+{formatINR(invoice.lateFee)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Subtotal and Balance Calculation */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-border/60">
          <div className="max-w-xs text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">UPI Payment Details</p>
            <p>UPI ID: <strong>pgmanager.business@icici</strong></p>
            <p>Accepted via Google Pay, PhonePe, Paytm, or Netbanking.</p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">{formatINR(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-foreground pt-1 border-t border-border/60">
              <span>Total Invoiced:</span>
              <span>{formatINR(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Paid to Date:</span>
              <span>-{formatINR(invoice.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-rose-600 pt-2 border-t border-border/60">
              <span>Balance Due:</span>
              <span>{formatINR(invoice.balanceAmount)}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Remarks */}
        <div className="pt-6 border-t border-dashed border-border/80 text-[11px] text-muted-foreground text-center">
          Thank you for staying at {property?.name || 'our PG'}! This is a system-generated rent invoice receipt.
        </div>
      </Card>

      {/* Record Payment Dialog */}
      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment for {invoice.invoiceNumber}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Log receipt of funds against this invoice.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Payment Amount (₹) *</Label>
              <Input
                type="number"
                step={100}
                max={invoice.balanceAmount}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(val: PaymentMethod) => setPaymentMethod(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI (GPay / PhonePe / Paytm)</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer (NEFT/IMPS)</SelectItem>
                  <SelectItem value="card">Debit / Credit Card</SelectItem>
                  <SelectItem value="online">Online Gateway</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Reference / Transaction Number</Label>
              <Input
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPayModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
