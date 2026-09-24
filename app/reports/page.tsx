'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Download,
  Building2,
  Users,
  CreditCard,
  TrendingDown,
  BedDouble,
  AlertTriangle,
  CalendarCheck,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { propertyService } from '@/services/propertyService';
import { tenantService } from '@/services/tenantService';
import { financeService } from '@/services/financeService';
import { operationsService } from '@/services/operationsService';
import { bookingService } from '@/services/bookingService';
import { formatINR, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function ReportsPage() {
  const properties = propertyService.getProperties();
  const rooms = propertyService.getRooms();
  const beds = propertyService.getBeds();
  const tenants = tenantService.getTenants();
  const invoices = financeService.getInvoices();
  const payments = financeService.getPayments();
  const expenses = financeService.getExpenses();
  const complaints = operationsService.getComplaints();
  const bookings = bookingService.getBookings();

  // Computations
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
  const availableBeds = beds.filter((b) => b.status === 'available').length;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netOperatingIncome = totalRevenue - totalExpenses;

  // Chart data
  const revenueHistory = [
    { month: 'Jun', collections: 160000, expenses: 71000 },
    { month: 'Jul', collections: 178000, expenses: 80000 },
    { month: 'Aug', collections: 192000, expenses: 84000 },
    { month: 'Sep', collections: 205000, expenses: 89000 },
    { month: 'Oct', collections: 218000, expenses: 92000 },
  ];

  // CSV Export Utility
  const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filename}.csv successfully!`);
  };

  const handleExportTenants = () => {
    const headers = ['Tenant Code', 'Name', 'Phone', 'Email', 'Property', 'Bed', 'Rent', 'Payment Status', 'KYC'];
    const rows = tenants.map((t) => [
      t.tenantCode,
      t.name,
      t.phone,
      t.email,
      t.propertyId,
      t.bedId,
      t.monthlyRent,
      t.paymentStatus,
      t.kyc.status,
    ]);
    exportToCSV('Tenants_Report_October', headers, rows);
  };

  const handleExportPayments = () => {
    const headers = ['Receipt Number', 'Tenant ID', 'Amount', 'Date', 'Method', 'Reference Number', 'Status'];
    const rows = payments.map((p) => [
      p.paymentNumber,
      p.tenantId,
      p.amount,
      p.date,
      p.paymentMethod,
      p.referenceNumber || '',
      p.status,
    ]);
    exportToCSV('Payments_Collections_Report', headers, rows);
  };

  const handleExportExpenses = () => {
    const headers = ['Expense Number', 'Category', 'Title', 'Amount', 'Date', 'Vendor', 'Method'];
    const rows = expenses.map((e) => [
      e.expenseNumber,
      e.category,
      e.title,
      e.amount,
      e.date,
      e.paidTo,
      e.paymentMethod,
    ]);
    exportToCSV('Expenses_Operating_Report', headers, rows);
  };

  return (
    <AppShell>
      <PageHeader
        title="Reports & Business Analytics"
        description="Consolidated property financial reports, bed occupancy metrics, and downloadable CSV audits."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Reports' }]}
        actions={
          <Button onClick={handleExportPayments} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Export Financial Ledger (CSV)</span>
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Collections" value={formatINR(totalRevenue)} subtitle="Gross collections YTD" icon={CreditCard} />
        <StatCard
          title="Operating Expenses"
          value={formatINR(totalExpenses)}
          subtitle="Utility, mess, and salaries"
          icon={TrendingDown}
          iconColor="text-rose-600 bg-rose-500/10"
        />
        <StatCard
          title="Net Operating Income"
          value={formatINR(netOperatingIncome)}
          subtitle="Net cash flow"
          icon={BarChart3}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Current Occupancy"
          value={`${Math.round((occupiedBeds / (totalBeds || 1)) * 100)}%`}
          subtitle={`${occupiedBeds}/${totalBeds} total beds`}
          icon={BedDouble}
        />
      </div>

      {/* Multi-Tab Analytics Reports */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 rounded-xl flex-wrap h-auto">
          <TabsTrigger value="financial" className="text-xs rounded-lg">Revenue & Expenses</TabsTrigger>
          <TabsTrigger value="occupancy" className="text-xs rounded-lg">Occupancy & Beds</TabsTrigger>
          <TabsTrigger value="tenants" className="text-xs rounded-lg">Tenants & KYC</TabsTrigger>
          <TabsTrigger value="complaints" className="text-xs rounded-lg">Complaints & SLA</TabsTrigger>
          <TabsTrigger value="bookings" className="text-xs rounded-lg">Bookings Pipeline</TabsTrigger>
        </TabsList>

        {/* TAB 1: Financial Report */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Monthly Net Revenue Performance</h3>
                <p className="text-xs text-muted-foreground">Historical collections vs operating costs</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleExportPayments} className="h-8 text-xs gap-1.5 rounded-lg">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Download Payments CSV</span>
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportExpenses} className="h-8 text-xs gap-1.5 rounded-lg">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-rose-600" />
                  <span>Download Expenses CSV</span>
                </Button>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => formatINR(Number(val))}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="collections" fill="var(--primary)" name="Collections" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#f87171" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: Occupancy & Beds Report */}
        <TabsContent value="occupancy" className="space-y-6">
          <Card className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground">Property Bed Inventory Distribution</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                    <th className="p-3 font-semibold">Property</th>
                    <th className="p-3 font-semibold">City / Area</th>
                    <th className="p-3 font-semibold">Rooms</th>
                    <th className="p-3 font-semibold">Total Beds</th>
                    <th className="p-3 font-semibold">Occupied</th>
                    <th className="p-3 font-semibold">Available</th>
                    <th className="p-3 font-semibold">Occupancy %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {properties.map((p) => {
                    const propRooms = rooms.filter((r) => r.propertyId === p.id);
                    const propBeds = beds.filter((b) => b.propertyId === p.id);
                    const occ = propBeds.filter((b) => b.status === 'occupied').length;
                    const avail = propBeds.filter((b) => b.status === 'available').length;
                    const pct = propBeds.length > 0 ? Math.round((occ / propBeds.length) * 100) : 0;

                    return (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="p-3 font-bold text-foreground">{p.name}</td>
                        <td className="p-3 text-muted-foreground">{p.area}, {p.city}</td>
                        <td className="p-3 font-semibold">{propRooms.length}</td>
                        <td className="p-3 font-semibold">{propBeds.length}</td>
                        <td className="p-3 font-bold text-foreground">{occ}</td>
                        <td className="p-3 font-bold text-emerald-600">{avail}</td>
                        <td className="p-3 font-extrabold text-primary">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: Tenants & KYC Report */}
        <TabsContent value="tenants" className="space-y-4">
          <Card className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Resident Demographic & Verification Audit</h3>
              <Button size="sm" variant="outline" onClick={handleExportTenants} className="h-8 text-xs gap-1.5 rounded-lg">
                <Download className="h-3.5 w-3.5" />
                <span>Export Tenant List (CSV)</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                    <th className="p-3 font-semibold">Tenant Code</th>
                    <th className="p-3 font-semibold">Name</th>
                    <th className="p-3 font-semibold">Phone</th>
                    <th className="p-3 font-semibold">Company / College</th>
                    <th className="p-3 font-semibold">Rent</th>
                    <th className="p-3 font-semibold">KYC Status</th>
                    <th className="p-3 font-semibold">Rent Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/20">
                      <td className="p-3 font-mono font-bold text-foreground">{t.tenantCode}</td>
                      <td className="p-3 font-semibold text-foreground">{t.name}</td>
                      <td className="p-3 text-muted-foreground">{t.phone}</td>
                      <td className="p-3 text-muted-foreground">{t.companyOrCollege}</td>
                      <td className="p-3 font-bold text-foreground">{formatINR(t.monthlyRent)}</td>
                      <td className="p-3 capitalize font-medium">{t.kyc.status}</td>
                      <td className="p-3 capitalize font-bold text-foreground">{t.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 4: Complaints SLA */}
        <TabsContent value="complaints" className="space-y-4">
          <Card className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground">Maintenance & Service Request Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Raised</span>
                <p className="text-xl font-bold text-foreground mt-1">{complaints.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Resolved Tickets</span>
                <p className="text-xl font-bold text-emerald-600 mt-1">
                  {complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Open Tickets</span>
                <p className="text-xl font-bold text-rose-600 mt-1">
                  {complaints.filter((c) => c.status === 'open' || c.status === 'assigned').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Avg. Resolution SLA</span>
                <p className="text-xl font-bold text-foreground mt-1">&lt; 24 Hrs</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 5: Bookings Pipeline */}
        <TabsContent value="bookings" className="space-y-4">
          <Card className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground">Upcoming Move-Ins Pipeline</h3>
            <div className="space-y-2.5">
              {bookings.map((b) => (
                <div key={b.id} className="p-3 rounded-xl border border-border/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground">{b.applicantName}</span>
                    <span className="text-[11px] text-muted-foreground block">{b.bookingCode} • Bed {b.bedId}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground">Move In: {formatDate(b.moveInDate)}</span>
                    <span className="text-[11px] text-emerald-600 block font-semibold">Token: {formatINR(b.tokenDeposit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
