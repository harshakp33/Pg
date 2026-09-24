export type ComplaintCategory =
  | 'electrical'
  | 'plumbing'
  | 'cleaning'
  | 'internet'
  | 'furniture'
  | 'food'
  | 'security'
  | 'other';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

export interface ComplaintComment {
  id: string;
  senderName: string;
  role: string;
  message: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string; // e.g. CMP-2024-101
  tenantId: string;
  propertyId: string;
  roomId?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: Priority;
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: ComplaintStatus;
  imageUrl?: string;
  createdDate: string;
  dueDate: string;
  resolvedDate?: string;
  resolutionRemarks?: string;
  comments: ComplaintComment[];
}

export type MaintenanceStatus = 'open' | 'in_progress' | 'completed';

export interface MaintenanceTask {
  id: string;
  taskNumber: string;
  title: string;
  propertyId: string;
  roomId?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  priority: Priority;
  estimatedCost: number;
  actualCost?: number;
  status: MaintenanceStatus;
  dueDate: string;
  completedDate?: string;
  description: string;
}

export interface Visitor {
  id: string;
  visitorName: string;
  phone: string;
  tenantId: string;
  propertyId: string;
  purpose: string;
  entryTime: string;
  exitTime?: string | null;
  idVerificationType?: string;
  idNumber?: string;
  status: 'inside' | 'checked_out';
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
}

export interface MealItem {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  lunch: string;
  dinner: string;
  specialNotes?: string;
}

export interface MealAttendance {
  id: string;
  date: string;
  propertyId: string;
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  totalDietCharges: number;
}

export interface Notice {
  id: string;
  noticeCode: string;
  title: string;
  content: string;
  propertyId: string; // 'all' or specific property ID
  audience: 'all' | 'tenants' | 'staff';
  priority: Priority;
  isPublished: boolean;
  publishedDate: string;
  expiryDate?: string;
  authorName: string;
}

export type StaffRole =
  | 'manager'
  | 'warden'
  | 'accountant'
  | 'security'
  | 'maintenance'
  | 'cleaner'
  | 'cook';

export interface Staff {
  id: string;
  staffCode: string;
  name: string;
  phone: string;
  email: string;
  role: StaffRole;
  propertyId: string;
  joiningDate: string;
  salary: number;
  status: 'active' | 'on_leave' | 'inactive';
  shift: 'day' | 'night' | 'general';
  avatar?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}
