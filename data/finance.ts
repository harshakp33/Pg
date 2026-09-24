import { Invoice, Payment, SecurityDeposit, Expense } from '@/types/finance';

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-1001',
    tenantId: 'tnt-1', // Rahul Sharma
    propertyId: 'prop-1',
    month: 'October 2024',
    issueDate: '2024-10-01',
    dueDate: '2024-10-05',
    items: [
      { id: 'it-1', description: 'Monthly Room Rent (Room 101-A)', amount: 18000, category: 'rent' },
      { id: 'it-2', description: 'Electricity Meter Charges (Sep 2024)', amount: 650, category: 'electricity' },
      { id: 'it-3', description: 'Mess / Food Charges', amount: 0, category: 'food' }
    ],
    subtotal: 18650,
    discount: 0,
    lateFee: 0,
    previousBalance: 0,
    totalAmount: 18650,
    paidAmount: 18650,
    balanceAmount: 0,
    status: 'paid',
    notes: 'Paid on time via UPI.'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-1002',
    tenantId: 'tnt-2', // Amit Verma
    propertyId: 'prop-1',
    month: 'October 2024',
    issueDate: '2024-10-01',
    dueDate: '2024-10-05',
    items: [
      { id: 'it-4', description: 'Monthly Bed Rent (Room 102-A)', amount: 13000, category: 'rent' },
      { id: 'it-5', description: 'AC Submeter Electricity Usage', amount: 450, category: 'electricity' }
    ],
    subtotal: 13450,
    discount: 0,
    lateFee: 0,
    previousBalance: 0,
    totalAmount: 13450,
    paidAmount: 13450,
    balanceAmount: 0,
    status: 'paid'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2024-1003',
    tenantId: 'tnt-3', // Karthik Nair
    propertyId: 'prop-1',
    month: 'October 2024',
    issueDate: '2024-10-01',
    dueDate: '2024-10-05',
    items: [
      { id: 'it-6', description: 'Monthly Bed Rent (Room 102-B)', amount: 13000, category: 'rent' },
      { id: 'it-7', description: 'AC Electricity Usage', amount: 450, category: 'electricity' }
    ],
    subtotal: 13450,
    discount: 0,
    lateFee: 200,
    previousBalance: 0,
    totalAmount: 13650,
    paidAmount: 0,
    balanceAmount: 13650,
    status: 'overdue',
    notes: 'Tenant informed salary delay, will pay by 25th.'
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2024-1004',
    tenantId: 'tnt-5', // Rohan Gupta
    propertyId: 'prop-1',
    month: 'October 2024',
    issueDate: '2024-10-01',
    dueDate: '2024-10-05',
    items: [
      { id: 'it-8', description: 'Monthly Bed Rent (Room 201-B)', amount: 9500, category: 'rent' }
    ],
    subtotal: 9500,
    discount: 0,
    lateFee: 0,
    previousBalance: 0,
    totalAmount: 9500,
    paidAmount: 0,
    balanceAmount: 9500,
    status: 'overdue',
    notes: 'To be adjusted during final move-out settlement.'
  },
  {
    id: 'inv-5',
    invoiceNumber: 'INV-2024-1005',
    tenantId: 'tnt-8', // Pranav Rao
    propertyId: 'prop-2',
    month: 'October 2024',
    issueDate: '2024-10-01',
    dueDate: '2024-10-05',
    items: [
      { id: 'it-9', description: 'Monthly Bed Rent (Room 102-A)', amount: 8500, category: 'rent' }
    ],
    subtotal: 8500,
    discount: 0,
    lateFee: 0,
    previousBalance: 0,
    totalAmount: 8500,
    paidAmount: 4000,
    balanceAmount: 4500,
    status: 'partially_paid'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    paymentNumber: 'REC-2024-5001',
    tenantId: 'tnt-1',
    invoiceId: 'inv-1',
    propertyId: 'prop-1',
    amount: 18650,
    date: '2024-10-02',
    paymentMethod: 'upi',
    referenceNumber: 'UPI/427819283741/STLIGHT',
    status: 'successful',
    collectedBy: 'System Auto-Reconciliation',
    remarks: 'Full rent paid via PhonePe'
  },
  {
    id: 'pay-2',
    paymentNumber: 'REC-2024-5002',
    tenantId: 'tnt-2',
    invoiceId: 'inv-2',
    propertyId: 'prop-1',
    amount: 13450,
    date: '2024-10-03',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'NEFT-HDFC-99182371',
    status: 'successful',
    collectedBy: 'Rajesh Kumar',
    remarks: 'Netbanking transfer verified'
  },
  {
    id: 'pay-3',
    paymentNumber: 'REC-2024-5003',
    tenantId: 'tnt-8',
    invoiceId: 'inv-5',
    propertyId: 'prop-2',
    amount: 4000,
    date: '2024-10-05',
    paymentMethod: 'cash',
    referenceNumber: 'CASH-REC-102',
    status: 'successful',
    collectedBy: 'Suresh Reddy',
    remarks: 'Partial cash payment received'
  }
];

export const initialDeposits: SecurityDeposit[] = [
  {
    id: 'dep-1',
    tenantId: 'tnt-1',
    propertyId: 'prop-1',
    totalDeposit: 36000,
    paidAmount: 36000,
    refundableAmount: 36000,
    deductionAmount: 0,
    refundedAmount: 0,
    status: 'held',
    paymentDate: '2023-09-01'
  },
  {
    id: 'dep-2',
    tenantId: 'tnt-2',
    propertyId: 'prop-1',
    totalDeposit: 26000,
    paidAmount: 26000,
    refundableAmount: 26000,
    deductionAmount: 0,
    refundedAmount: 0,
    status: 'held',
    paymentDate: '2023-11-15'
  },
  {
    id: 'dep-3',
    tenantId: 'tnt-5',
    propertyId: 'prop-1',
    totalDeposit: 19000,
    paidAmount: 19000,
    refundableAmount: 7700,
    deductionAmount: 11300,
    refundedAmount: 0,
    status: 'held',
    paymentDate: '2024-02-01',
    deductionReason: '₹9500 unpaid rent + ₹800 electricity + ₹1000 painting/deep cleaning'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    expenseNumber: 'EXP-2024-001',
    propertyId: 'prop-1',
    category: 'electricity',
    title: 'BESCOM Electricity Bill - Sep 2024',
    amount: 28450,
    date: '2024-10-05',
    paymentMethod: 'online',
    paidTo: 'BESCOM Bangalore',
    status: 'paid',
    description: 'Commercial electricity bill for Starlight Koramangala 4 floors'
  },
  {
    id: 'exp-2',
    expenseNumber: 'EXP-2024-002',
    propertyId: 'prop-1',
    category: 'food',
    title: 'Monthly Ration & Grocery Wholesale',
    amount: 45000,
    date: '2024-10-03',
    paymentMethod: 'bank_transfer',
    paidTo: 'Sri Balaji Wholesale Traders',
    status: 'paid',
    description: 'Rice, wheat flour, pulses, cooking oil and dry spices'
  },
  {
    id: 'exp-3',
    expenseNumber: 'EXP-2024-003',
    propertyId: 'prop-1',
    category: 'internet',
    title: 'ACT Fibernet Commercial Gigabit 500Mbps',
    amount: 6850,
    date: '2024-10-02',
    paymentMethod: 'online',
    paidTo: 'ACT Fibernet',
    status: 'paid'
  },
  {
    id: 'exp-4',
    expenseNumber: 'EXP-2024-004',
    propertyId: 'prop-1',
    category: 'salary',
    title: 'Staff Salaries (Security, Warden, Cook)',
    amount: 58000,
    date: '2024-10-01',
    paymentMethod: 'bank_transfer',
    paidTo: 'Staff Payroll Account',
    status: 'paid'
  },
  {
    id: 'exp-5',
    expenseNumber: 'EXP-2024-005',
    propertyId: 'prop-1',
    category: 'maintenance',
    title: 'Plumbing & Water Tank Deep Cleaning',
    amount: 4500,
    date: '2024-10-12',
    paymentMethod: 'cash',
    paidTo: 'FastFix Plumbers Koramangala',
    status: 'paid'
  },
  {
    id: 'exp-6',
    expenseNumber: 'EXP-2024-006',
    propertyId: 'prop-2',
    category: 'electricity',
    title: 'BESCOM HSR Sector 2 Power Bill',
    amount: 19200,
    date: '2024-10-06',
    paymentMethod: 'online',
    paidTo: 'BESCOM Bangalore',
    status: 'paid'
  },
  {
    id: 'exp-7',
    expenseNumber: 'EXP-2024-007',
    propertyId: 'prop-3',
    category: 'security',
    title: 'EagleEye 24x7 Security Agency Contract',
    amount: 32000,
    date: '2024-10-04',
    paymentMethod: 'bank_transfer',
    paidTo: 'EagleEye Security Services',
    status: 'paid'
  }
];
