import { Invoice, Payment, SecurityDeposit, Expense } from '@/types/finance';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { initialInvoices, initialPayments, initialDeposits, initialExpenses } from '@/data/finance';
import { tenantService } from './tenantService';

export const financeService = {
  // Invoices
  getInvoices: (propertyId?: string): Invoice[] => {
    const list = getItem<Invoice[]>(STORAGE_KEYS.INVOICES, initialInvoices);
    if (propertyId) return list.filter((i) => i.propertyId === propertyId);
    return list;
  },

  getInvoiceById: (id: string): Invoice | undefined => {
    const list = financeService.getInvoices();
    return list.find((i) => i.id === id);
  },

  getInvoicesByTenantId: (tenantId: string): Invoice[] => {
    const list = financeService.getInvoices();
    return list.filter((i) => i.tenantId === tenantId);
  },

  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const list = financeService.getInvoices();
    const count = list.length + 1;
    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2024-${1000 + count}`,
    };
    setItem(STORAGE_KEYS.INVOICES, [newInvoice, ...list]);
    return newInvoice;
  },

  updateInvoice: (id: string, updates: Partial<Invoice>): Invoice | null => {
    const list = financeService.getInvoices();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.INVOICES, [...list]);
    return list[idx];
  },

  deleteInvoice: (id: string): boolean => {
    const list = financeService.getInvoices();
    const filtered = list.filter((i) => i.id !== id);
    if (filtered.length === list.length) return false;
    setItem(STORAGE_KEYS.INVOICES, filtered);
    return true;
  },

  generateMonthlyRentInvoices: (month: string, dueDate: string): number => {
    const tenants = tenantService.getTenants().filter((t) => t.status === 'active');
    let count = 0;
    tenants.forEach((t) => {
      financeService.createInvoice({
        tenantId: t.id,
        propertyId: t.propertyId,
        month,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate,
        items: [
          {
            id: `item-${Date.now()}-${t.id}`,
            description: `Room Rent for ${month}`,
            amount: t.monthlyRent,
            category: 'rent',
          },
        ],
        subtotal: t.monthlyRent,
        discount: 0,
        lateFee: 0,
        previousBalance: 0,
        totalAmount: t.monthlyRent,
        paidAmount: 0,
        balanceAmount: t.monthlyRent,
        status: 'sent',
      });
      count++;
    });
    return count;
  },

  // Payments
  getPayments: (propertyId?: string): Payment[] => {
    const list = getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, initialPayments);
    if (propertyId) return list.filter((p) => p.propertyId === propertyId);
    return list;
  },

  getPaymentById: (id: string): Payment | undefined => {
    const list = financeService.getPayments();
    return list.find((p) => p.id === id);
  },

  getPaymentsByTenantId: (tenantId: string): Payment[] => {
    const list = financeService.getPayments();
    return list.filter((p) => p.tenantId === tenantId);
  },

  recordPayment: (data: Omit<Payment, 'id' | 'paymentNumber'>): Payment => {
    const list = financeService.getPayments();
    const count = list.length + 1;
    const newPayment: Payment = {
      ...data,
      id: `pay-${Date.now()}`,
      paymentNumber: `REC-2024-${5000 + count}`,
    };

    setItem(STORAGE_KEYS.PAYMENTS, [newPayment, ...list]);

    // Update invoice if linked
    if (data.invoiceId) {
      const invoice = financeService.getInvoiceById(data.invoiceId);
      if (invoice) {
        const newPaid = invoice.paidAmount + data.amount;
        const newBalance = Math.max(0, invoice.totalAmount - newPaid);
        const newStatus =
          newBalance === 0 ? 'paid' : newPaid > 0 ? 'partially_paid' : invoice.status;
        financeService.updateInvoice(invoice.id, {
          paidAmount: newPaid,
          balanceAmount: newBalance,
          status: newStatus,
        });
      }
    }

    // Update tenant payment status and log activity
    tenantService.addActivity(
      data.tenantId,
      'Payment Recorded',
      `Received ₹${data.amount} via ${data.paymentMethod.toUpperCase()}`,
      data.collectedBy
    );

    return newPayment;
  },

  // Deposits
  getDeposits: (): SecurityDeposit[] => {
    return getItem<SecurityDeposit[]>(STORAGE_KEYS.DEPOSITS, initialDeposits);
  },

  getDepositByTenantId: (tenantId: string): SecurityDeposit | undefined => {
    const list = financeService.getDeposits();
    return list.find((d) => d.tenantId === tenantId);
  },

  updateDeposit: (id: string, updates: Partial<SecurityDeposit>): SecurityDeposit | null => {
    const list = financeService.getDeposits();
    const idx = list.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.DEPOSITS, [...list]);
    return list[idx];
  },

  // Expenses
  getExpenses: (propertyId?: string): Expense[] => {
    const list = getItem<Expense[]>(STORAGE_KEYS.EXPENSES, initialExpenses);
    if (propertyId) return list.filter((e) => e.propertyId === propertyId);
    return list;
  },

  createExpense: (data: Omit<Expense, 'id' | 'expenseNumber'>): Expense => {
    const list = financeService.getExpenses();
    const count = list.length + 1;
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
      expenseNumber: `EXP-2024-${String(count).padStart(3, '0')}`,
    };
    setItem(STORAGE_KEYS.EXPENSES, [newExpense, ...list]);
    return newExpense;
  },

  updateExpense: (id: string, updates: Partial<Expense>): Expense | null => {
    const list = financeService.getExpenses();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.EXPENSES, [...list]);
    return list[idx];
  },

  deleteExpense: (id: string): boolean => {
    const list = financeService.getExpenses();
    const filtered = list.filter((e) => e.id !== id);
    if (filtered.length === list.length) return false;
    setItem(STORAGE_KEYS.EXPENSES, filtered);
    return true;
  },
};
