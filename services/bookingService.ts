import { Application, Booking, MoveInRecord, MoveOutRecord } from '@/types/booking';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { initialApplications, initialBookings, initialMoveIns, initialMoveOuts } from '@/data/bookings';
import { propertyService } from './propertyService';
import { tenantService } from './tenantService';

export const bookingService = {
  // Applications
  getApplications: (): Application[] => {
    return getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, initialApplications);
  },

  createApplication: (data: Omit<Application, 'id' | 'createdAt'>): Application => {
    const list = bookingService.getApplications();
    const newApp: Application = {
      ...data,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setItem(STORAGE_KEYS.APPLICATIONS, [newApp, ...list]);
    return newApp;
  },

  updateApplicationStatus: (id: string, status: Application['status']): Application | null => {
    const list = bookingService.getApplications();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], status };
    setItem(STORAGE_KEYS.APPLICATIONS, [...list]);
    return list[idx];
  },

  deleteApplication: (id: string): boolean => {
    const list = bookingService.getApplications();
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length === list.length) return false;
    setItem(STORAGE_KEYS.APPLICATIONS, filtered);
    return true;
  },

  // Bookings
  getBookings: (): Booking[] => {
    return getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
  },

  getBookingById: (id: string): Booking | undefined => {
    const list = bookingService.getBookings();
    return list.find((b) => b.id === id);
  },

  createBooking: (data: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>): Booking => {
    const list = bookingService.getBookings();
    const count = list.length + 1;
    const newBooking: Booking = {
      ...data,
      id: `bkg-${Date.now()}`,
      bookingCode: `BKG-2024-${String(count).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setItem(STORAGE_KEYS.BOOKINGS, [newBooking, ...list]);

    // Reserve bed if provided
    if (data.bedId) {
      propertyService.reserveBed(data.bedId, data.applicantName);
    }

    return newBooking;
  },

  updateBookingStatus: (id: string, status: Booking['status']): Booking | null => {
    const list = bookingService.getBookings();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const old = list[idx];
    list[idx] = { ...old, status };
    setItem(STORAGE_KEYS.BOOKINGS, [...list]);

    if (status === 'cancelled' && old.bedId) {
      propertyService.releaseBed(old.bedId);
    }

    return list[idx];
  },

  deleteBooking: (id: string): boolean => {
    const list = bookingService.getBookings();
    const target = list.find((b) => b.id === id);
    if (!target) return false;
    if (target.bedId) {
      propertyService.releaseBed(target.bedId);
    }
    const filtered = list.filter((b) => b.id !== id);
    setItem(STORAGE_KEYS.BOOKINGS, filtered);
    return true;
  },

  // Move-in
  getMoveIns: (): MoveInRecord[] => {
    return getItem<MoveInRecord[]>(STORAGE_KEYS.MOVE_INS, initialMoveIns);
  },

  createMoveIn: (record: Omit<MoveInRecord, 'id'>): MoveInRecord => {
    const list = bookingService.getMoveIns();
    const newRecord: MoveInRecord = { ...record, id: `mvi-${Date.now()}` };
    setItem(STORAGE_KEYS.MOVE_INS, [newRecord, ...list]);

    tenantService.addActivity(
      record.tenantId,
      'Move-In Check-In Completed',
      'Inventory checked and keys handed over.',
      'Manager'
    );

    return newRecord;
  },

  // Move-out
  getMoveOuts: (): MoveOutRecord[] => {
    return getItem<MoveOutRecord[]>(STORAGE_KEYS.MOVE_OUTS, initialMoveOuts);
  },

  createMoveOut: (record: Omit<MoveOutRecord, 'id'>): MoveOutRecord => {
    const list = bookingService.getMoveOuts();
    const newRecord: MoveOutRecord = { ...record, id: `mvo-${Date.now()}` };
    setItem(STORAGE_KEYS.MOVE_OUTS, [newRecord, ...list]);

    // Update tenant status to vacated
    tenantService.updateTenant(record.tenantId, {
      status: 'vacated',
    });

    // Release tenant's bed
    const tenant = tenantService.getTenantById(record.tenantId);
    if (tenant && tenant.bedId) {
      propertyService.releaseBed(tenant.bedId);
    }

    tenantService.addActivity(
      record.tenantId,
      'Move-Out Completed',
      `Vacated with net refund ₹${record.finalRefundAmount}. Settlement status: ${record.settlementStatus}`,
      'Manager'
    );

    return newRecord;
  },
};
