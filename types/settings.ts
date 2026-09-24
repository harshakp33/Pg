export interface PGSettings {
  appName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  defaultNoticePeriodDays: number;
  lateFeePerDay: number;
  gracePeriodDays: number;
  taxPercentage: number;
  electricityRatePerUnit: number;
  enableSmsNotifications: boolean;
  enableEmailNotifications: boolean;
  enableWhatsAppAlerts: boolean;
  theme: 'light' | 'dark' | 'system';
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  upiId: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'rent' | 'booking' | 'complaint' | 'payment' | 'kyc' | 'system';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  link?: string;
}
