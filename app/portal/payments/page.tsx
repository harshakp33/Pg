'use client';

import React from 'react';
import { TenantPortalShell } from '@/components/layout/TenantPortalShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { tenantService } from '@/services/tenantService';
import { financeService } from '@/services/financeService';
import { formatINR, formatDate } from '@/lib/format';

export default function TenantPaymentsPage() {
  const { user } = useAuth();
  const tenant = tenantService.getTenantById(user.tenantId || 'tnt-1') || tenantService.getTenants()[0];
  const payments = tenant ? financeService.getPaymentsByTenantId(tenant.id) : [];

  return (
    <TenantPortalShell>
      <PageHeader
        title="Payment Receipts"
        description="Historical archive of all your verified rent and security deposit receipts."
        breadcrumbs={[{ label: 'Portal', href: '/portal/dashboard' }, { label: 'Payments' }]}
      />

      <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
              <th className="p-3.5 font-semibold">Receipt Number</th>
              <th className="p-3.5 font-semibold">Amount Paid</th>
              <th className="p-3.5 font-semibold">Date</th>
              <th className="p-3.5 font-semibold">Payment Mode</th>
              <th className="p-3.5 font-semibold">Transaction Reference</th>
              <th className="p-3.5 font-semibold">Status</th>
              <th className="p-3.5 font-semibold text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-muted/20">
                <td className="p-3.5 font-mono font-bold text-foreground">{p.paymentNumber}</td>
                <td className="p-3.5 font-extrabold text-foreground">{formatINR(p.amount)}</td>
                <td className="p-3.5 text-muted-foreground whitespace-nowrap">{formatDate(p.date)}</td>
                <td className="p-3.5 uppercase text-muted-foreground font-semibold text-[10px]">{p.paymentMethod}</td>
                <td className="p-3.5 font-mono text-[10px] text-muted-foreground">{p.referenceNumber || 'N/A'}</td>
                <td className="p-3.5"><StatusBadge status={p.status} /></td>
                <td className="p-3.5 text-right whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-7 text-xs gap-1.5 rounded-lg"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Receipt</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TenantPortalShell>
  );
}
