export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'upi' | 'cash' | 'bank_transfer' | 'card' | 'online';

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  category: 'rent' | 'electricity' | 'water' | 'food' | 'maintenance' | 'late_fee' | 'discount' | 'other';
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., INV-2024-1001
  tenantId: string;
  propertyId: string;
  month: string; // e.g. "October 2024"
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  lateFee: number;
  previousBalance: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  notes?: string;
}

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. REC-2024-5001
  tenantId: string;
  invoiceId?: string;
  propertyId: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  status: 'successful' | 'pending' | 'failed';
  receiptUrl?: string;
  collectedBy: string;
  remarks?: string;
}

export interface SecurityDeposit {
  id: string;
  tenantId: string;
  propertyId: string;
  totalDeposit: number;
  paidAmount: number;
  refundableAmount: number;
  deductionAmount: number;
  refundedAmount: number;
  status: 'held' | 'partially_refunded' | 'refunded' | 'forfeited';
  paymentDate?: string;
  refundDate?: string;
  deductionReason?: string;
}

export type ExpenseCategory =
  | 'electricity'
  | 'water'
  | 'internet'
  | 'food'
  | 'maintenance'
  | 'salary'
  | 'cleaning'
  | 'security'
  | 'rent'
  | 'other';

export interface Expense {
  id: string;
  expenseNumber: string; // e.g. EXP-2024-001
  propertyId: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  paidTo: string;
  receiptAttachment?: string;
  description?: string;
  status: 'paid' | 'pending';
}
