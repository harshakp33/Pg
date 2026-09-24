'use client';

import React, { useState } from 'react';
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
  TrendingDown,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  DollarSign,
  Zap,
  UtensilsCrossed,
  Wifi,
  Users,
} from 'lucide-react';
import { financeService } from '@/services/financeService';
import { propertyService } from '@/services/propertyService';
import { Expense, ExpenseCategory, PaymentMethod } from '@/types/finance';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialExpenses } from '@/data/finance';
import { formatINR, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useStorageState<Expense[]>(
    STORAGE_KEYS.EXPENSES,
    initialExpenses
  );

  const properties = propertyService.getProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>('electricity');
  const [amount, setAmount] = useState(5000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [paidTo, setPaidTo] = useState('');
  const [description, setDescription] = useState('');

  const totalExpenseAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
  const electricityTotal = expenses.filter((e) => e.category === 'electricity').reduce((acc, e) => acc + e.amount, 0);
  const foodTotal = expenses.filter((e) => e.category === 'food').reduce((acc, e) => acc + e.amount, 0);
  const salaryTotal = expenses.filter((e) => e.category === 'salary').reduce((acc, e) => acc + e.amount, 0);

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesProperty = propertyFilter === 'all' || e.propertyId === propertyFilter;
    return matchesSearch && matchesCategory && matchesProperty;
  });

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setTitle('');
    setPropertyId(properties[0]?.id || '');
    setCategory('electricity');
    setAmount(5000);
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('online');
    setPaidTo('');
    setDescription('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setTitle(exp.title);
    setPropertyId(exp.propertyId);
    setCategory(exp.category);
    setAmount(exp.amount);
    setDate(exp.date);
    setPaymentMethod(exp.paymentMethod);
    setPaidTo(exp.paidTo);
    setDescription(exp.description || '');
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !paidTo || amount <= 0) {
      toast.error('Please enter title, payee, and amount');
      return;
    }

    if (editingExpense) {
      financeService.updateExpense(editingExpense.id, {
        title,
        propertyId,
        category,
        amount,
        date,
        paymentMethod,
        paidTo,
        description,
      });
      toast.success('Expense updated');
    } else {
      financeService.createExpense({
        title,
        propertyId,
        category,
        amount,
        date,
        paymentMethod,
        paidTo,
        description,
        status: 'paid',
      });
      toast.success('Expense recorded successfully');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      financeService.deleteExpense(deleteTargetId);
      toast.success('Expense removed');
      setDeleteTargetId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Operating Expenses"
        description="Track property utility bills, grocery rations, housekeeping supplies, and staff salaries."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Expenses' }]}
        actions={
          <Button onClick={handleOpenAdd} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Expenses" value={formatINR(totalExpenseAmount)} subtitle="Monthly operating cost" icon={TrendingDown} />
        <StatCard
          title="Electricity (Power)"
          value={formatINR(electricityTotal)}
          subtitle="BESCOM commercial grid"
          icon={Zap}
          iconColor="text-amber-600 bg-amber-500/10"
        />
        <StatCard
          title="Food / Groceries"
          value={formatINR(foodTotal)}
          subtitle="Mess kitchen ration"
          icon={UtensilsCrossed}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Staff Salaries"
          value={formatINR(salaryTotal)}
          subtitle="Cook, warden, security"
          icon={Users}
          iconColor="text-sky-600 bg-sky-500/10"
        />
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expense or payee..."
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
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 text-xs w-44">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="water">Water Supply</SelectItem>
              <SelectItem value="internet">Internet / WiFi</SelectItem>
              <SelectItem value="food">Food & Ration</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="salary">Staff Salaries</SelectItem>
              <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
              <SelectItem value="security">Security Agency</SelectItem>
              <SelectItem value="rent">Building Rent</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="Adjust your search criteria or log a new operational expense."
          actionLabel="Add Expense"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                <th className="p-3.5 font-semibold">Expense #</th>
                <th className="p-3.5 font-semibold">Title / Description</th>
                <th className="p-3.5 font-semibold">Category</th>
                <th className="p-3.5 font-semibold">Property</th>
                <th className="p-3.5 font-semibold">Paid To (Vendor)</th>
                <th className="p-3.5 font-semibold">Date</th>
                <th className="p-3.5 font-semibold">Amount</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((e) => {
                const prop = properties.find((p) => p.id === e.propertyId);

                return (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-foreground">{e.expenseNumber}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-foreground">{e.title}</p>
                      {e.description && <p className="text-[10px] text-muted-foreground line-clamp-1">{e.description}</p>}
                    </td>
                    <td className="p-3.5 capitalize font-medium text-foreground">{e.category}</td>
                    <td className="p-3.5 text-muted-foreground truncate max-w-[120px]">{prop?.name || 'PG'}</td>
                    <td className="p-3.5 text-muted-foreground">{e.paidTo}</td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">{formatDate(e.date)}</td>
                    <td className="p-3.5 font-extrabold text-foreground">{formatINR(e.amount)}</td>
                    <td className="p-3.5">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(e)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTargetId(e.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Expense Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit Expense' : 'Log Operating Expense'}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record a bill payment or operational cost against a property.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Expense Title *</Label>
              <Input
                required
                placeholder="e.g. BESCOM Electricity Bill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={category} onValueChange={(val: ExpenseCategory) => setCategory(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="water">Water Supply</SelectItem>
                    <SelectItem value="internet">Internet / WiFi</SelectItem>
                    <SelectItem value="food">Food & Ration</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="salary">Staff Salaries</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Amount (₹) *</Label>
                <Input
                  type="number"
                  step={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
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

              <div className="space-y-1">
                <Label className="text-xs">Paid To (Vendor / Staff) *</Label>
                <Input
                  required
                  placeholder="e.g. BESCOM / Sri Balaji Traders"
                  value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(val: PaymentMethod) => setPaymentMethod(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online / Netbanking</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Description / Bill Notes</Label>
                <Input
                  placeholder="e.g. Month of October bill for meters"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                {editingExpense ? 'Update Expense' : 'Save Expense'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Expense Record?"
        description="Are you sure you want to remove this expense entry?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </AppShell>
  );
}
