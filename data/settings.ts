import { PGSettings, NotificationItem } from '@/types/settings';

export const initialSettings: PGSettings = {
  appName: 'PG Manager',
  tagline: 'Complete PG & Property Management',
  currency: 'INR',
  currencySymbol: '₹',
  dateFormat: 'DD/MM/YYYY',
  defaultNoticePeriodDays: 30,
  lateFeePerDay: 50,
  gracePeriodDays: 5,
  taxPercentage: 0,
  electricityRatePerUnit: 9.5,
  enableSmsNotifications: true,
  enableEmailNotifications: true,
  enableWhatsAppAlerts: true,
  theme: 'light',
  companyAddress: 'Plot 104, Koramangala 4th Block, 100 Feet Road, Bengaluru, Karnataka 560034',
  companyPhone: '+91 80 4123 4567',
  companyEmail: 'support@pgmanager.in',
  upiId: 'pgmanager.business@icici'
};

export const initialNotifications: NotificationItem[] = [
  {
    id: 'ntf-1',
    title: 'Rent Overdue Alert',
    message: 'Karthik Nair (Room 102-B) has pending invoice of ₹13,650 past due date.',
    type: 'rent',
    priority: 'high',
    read: false,
    createdAt: '2024-10-20 09:30',
    link: '/billing'
  },
  {
    id: 'ntf-2',
    title: 'Critical Maintenance Issue',
    message: 'Electrical spark reported by Priya Patel in Room 101, UrbanNest.',
    type: 'complaint',
    priority: 'high',
    read: false,
    createdAt: '2024-10-20 08:45',
    link: '/complaints'
  },
  {
    id: 'ntf-3',
    title: 'New Booking Confirmed',
    message: 'Sneha Reddy reserved Bed 103-B. Move-in scheduled for 01 Nov 2024.',
    type: 'booking',
    priority: 'medium',
    read: false,
    createdAt: '2024-10-19 16:20',
    link: '/bookings'
  },
  {
    id: 'ntf-4',
    title: 'Payment Received via UPI',
    message: '₹18,650 received from Rahul Sharma for October 2024 Rent.',
    type: 'payment',
    priority: 'low',
    read: true,
    createdAt: '2024-10-18 11:10',
    link: '/payments'
  },
  {
    id: 'ntf-5',
    title: 'KYC Document Pending',
    message: 'Karthik Nair needs police verification form upload.',
    type: 'kyc',
    priority: 'medium',
    read: true,
    createdAt: '2024-10-17 14:00',
    link: '/tenants'
  }
];
