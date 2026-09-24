import {
  Complaint,
  ComplaintComment,
  MaintenanceTask,
  Visitor,
  LeaveRequest,
  MealItem,
  Notice,
  Staff,
  StaffAttendanceRecord,
} from '@/types/operations';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import {
  initialComplaints,
  initialMaintenanceTasks,
  initialVisitors,
  initialLeaveRequests,
  weeklyFoodMenu,
  initialNotices,
  initialStaff,
  initialStaffAttendance,
} from '@/data/operations';

export const operationsService = {
  // Complaints
  getComplaints: (propertyId?: string): Complaint[] => {
    const list = getItem<Complaint[]>(STORAGE_KEYS.COMPLAINTS, initialComplaints);
    if (propertyId) return list.filter((c) => c.propertyId === propertyId);
    return list;
  },

  getComplaintById: (id: string): Complaint | undefined => {
    const list = operationsService.getComplaints();
    return list.find((c) => c.id === id);
  },

  createComplaint: (
    data: Omit<Complaint, 'id' | 'ticketNumber' | 'createdDate' | 'comments'>
  ): Complaint => {
    const list = operationsService.getComplaints();
    const count = list.length + 1;
    const newComplaint: Complaint = {
      ...data,
      id: `cmp-${Date.now()}`,
      ticketNumber: `CMP-2024-${100 + count}`,
      createdDate: new Date().toISOString().split('T')[0],
      comments: [],
    };
    setItem(STORAGE_KEYS.COMPLAINTS, [newComplaint, ...list]);
    return newComplaint;
  },

  updateComplaint: (id: string, updates: Partial<Complaint>): Complaint | null => {
    const list = operationsService.getComplaints();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.COMPLAINTS, [...list]);
    return list[idx];
  },

  addComplaintComment: (
    complaintId: string,
    comment: Omit<ComplaintComment, 'id' | 'createdAt'>
  ): Complaint | null => {
    const complaint = operationsService.getComplaintById(complaintId);
    if (!complaint) return null;
    const newComment: ComplaintComment = {
      ...comment,
      id: `cm-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-IN'),
    };
    return operationsService.updateComplaint(complaintId, {
      comments: [...complaint.comments, newComment],
    });
  },

  // Maintenance
  getMaintenanceTasks: (propertyId?: string): MaintenanceTask[] => {
    const list = getItem<MaintenanceTask[]>(STORAGE_KEYS.MAINTENANCE, initialMaintenanceTasks);
    if (propertyId) return list.filter((m) => m.propertyId === propertyId);
    return list;
  },

  createMaintenanceTask: (data: Omit<MaintenanceTask, 'id' | 'taskNumber'>): MaintenanceTask => {
    const list = operationsService.getMaintenanceTasks();
    const count = list.length + 1;
    const newTask: MaintenanceTask = {
      ...data,
      id: `mnt-${Date.now()}`,
      taskNumber: `MNT-2024-${String(count).padStart(3, '0')}`,
    };
    setItem(STORAGE_KEYS.MAINTENANCE, [newTask, ...list]);
    return newTask;
  },

  updateMaintenanceTask: (id: string, updates: Partial<MaintenanceTask>): MaintenanceTask | null => {
    const list = operationsService.getMaintenanceTasks();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.MAINTENANCE, [...list]);
    return list[idx];
  },

  // Visitors
  getVisitors: (propertyId?: string): Visitor[] => {
    const list = getItem<Visitor[]>(STORAGE_KEYS.VISITORS, initialVisitors);
    if (propertyId) return list.filter((v) => v.propertyId === propertyId);
    return list;
  },

  checkInVisitor: (data: Omit<Visitor, 'id' | 'entryTime' | 'status'>): Visitor => {
    const list = operationsService.getVisitors();
    const now = new Date();
    const entryTime = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newVisitor: Visitor = {
      ...data,
      id: `vis-${Date.now()}`,
      entryTime,
      exitTime: null,
      status: 'inside',
    };
    setItem(STORAGE_KEYS.VISITORS, [newVisitor, ...list]);
    return newVisitor;
  },

  checkOutVisitor: (id: string): Visitor | null => {
    const list = operationsService.getVisitors();
    const idx = list.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    const now = new Date();
    const exitTime = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    list[idx] = { ...list[idx], status: 'checked_out', exitTime };
    setItem(STORAGE_KEYS.VISITORS, [...list]);
    return list[idx];
  },

  // Leave Requests
  getLeaveRequests: (propertyId?: string): LeaveRequest[] => {
    const list = getItem<LeaveRequest[]>(STORAGE_KEYS.LEAVE, initialLeaveRequests);
    if (propertyId) return list.filter((l) => l.propertyId === propertyId);
    return list;
  },

  createLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'status' | 'requestedAt'>): LeaveRequest => {
    const list = operationsService.getLeaveRequests();
    const newReq: LeaveRequest = {
      ...data,
      id: `lev-${Date.now()}`,
      status: 'pending',
      requestedAt: new Date().toISOString().split('T')[0],
    };
    setItem(STORAGE_KEYS.LEAVE, [newReq, ...list]);
    return newReq;
  },

  updateLeaveStatus: (
    id: string,
    status: LeaveRequest['status'],
    reviewedBy: string,
    reviewRemarks?: string
  ): LeaveRequest | null => {
    const list = operationsService.getLeaveRequests();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    list[idx] = {
      ...list[idx],
      status,
      reviewedBy,
      reviewRemarks,
      reviewedAt: new Date().toISOString().split('T')[0],
    };
    setItem(STORAGE_KEYS.LEAVE, [...list]);
    return list[idx];
  },

  // Food Menu
  getFoodMenu: (): MealItem[] => {
    return getItem<MealItem[]>(STORAGE_KEYS.FOOD_MENU, weeklyFoodMenu);
  },

  updateMealItem: (id: string, updates: Partial<MealItem>): MealItem | null => {
    const list = operationsService.getFoodMenu();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.FOOD_MENU, [...list]);
    return list[idx];
  },

  // Notices
  getNotices: (): Notice[] => {
    return getItem<Notice[]>(STORAGE_KEYS.NOTICES, initialNotices);
  },

  createNotice: (data: Omit<Notice, 'id' | 'noticeCode' | 'publishedDate'>): Notice => {
    const list = operationsService.getNotices();
    const count = list.length + 1;
    const newNotice: Notice = {
      ...data,
      id: `not-${Date.now()}`,
      noticeCode: `NTC-2024-${String(count).padStart(2, '0')}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    setItem(STORAGE_KEYS.NOTICES, [newNotice, ...list]);
    return newNotice;
  },

  updateNotice: (id: string, updates: Partial<Notice>): Notice | null => {
    const list = operationsService.getNotices();
    const idx = list.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.NOTICES, [...list]);
    return list[idx];
  },

  deleteNotice: (id: string): boolean => {
    const list = operationsService.getNotices();
    const filtered = list.filter((n) => n.id !== id);
    if (filtered.length === list.length) return false;
    setItem(STORAGE_KEYS.NOTICES, filtered);
    return true;
  },

  // Staff
  getStaff: (propertyId?: string): Staff[] => {
    const list = getItem<Staff[]>(STORAGE_KEYS.STAFF, initialStaff);
    if (propertyId) return list.filter((s) => s.propertyId === propertyId);
    return list;
  },

  createStaff: (data: Omit<Staff, 'id' | 'staffCode'>): Staff => {
    const list = operationsService.getStaff();
    const count = list.length + 1;
    const newStaff: Staff = {
      ...data,
      id: `stf-${Date.now()}`,
      staffCode: `STF-${String(count).padStart(2, '0')}`,
    };
    setItem(STORAGE_KEYS.STAFF, [newStaff, ...list]);
    return newStaff;
  },

  updateStaff: (id: string, updates: Partial<Staff>): Staff | null => {
    const list = operationsService.getStaff();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.STAFF, [...list]);
    return list[idx];
  },

  // Attendance
  getAttendance: (): StaffAttendanceRecord[] => {
    return getItem<StaffAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, initialStaffAttendance);
  },

  markAttendance: (
    staffId: string,
    date: string,
    status: StaffAttendanceRecord['status'],
    checkIn?: string,
    checkOut?: string
  ): StaffAttendanceRecord => {
    const list = operationsService.getAttendance();
    const existingIndex = list.findIndex((a) => a.staffId === staffId && a.date === date);
    if (existingIndex !== -1) {
      list[existingIndex] = {
        ...list[existingIndex],
        status,
        checkIn: checkIn || list[existingIndex].checkIn,
        checkOut: checkOut || list[existingIndex].checkOut,
      };
      setItem(STORAGE_KEYS.ATTENDANCE, [...list]);
      return list[existingIndex];
    } else {
      const newRec: StaffAttendanceRecord = {
        id: `att-${Date.now()}`,
        staffId,
        date,
        status,
        checkIn: checkIn || '09:00',
        checkOut: checkOut || '18:00',
      };
      setItem(STORAGE_KEYS.ATTENDANCE, [newRec, ...list]);
      return newRec;
    }
  },
};
