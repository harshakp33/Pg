import {
  initialProperties,
  initialBuildings,
  initialRooms,
  initialBeds,
  initialTenants,
  initialApplications,
  initialBookings,
  initialMoveIns,
  initialMoveOuts,
  initialInvoices,
  initialPayments,
  initialDeposits,
  initialExpenses,
  initialComplaints,
  initialMaintenanceTasks,
  initialVisitors,
  initialLeaveRequests,
  weeklyFoodMenu,
  initialNotices,
  initialStaff,
  initialStaffAttendance,
  initialSettings,
  initialNotifications,
  demoUsers,
} from '@/data';

const STORAGE_KEYS = {
  PROPERTIES: 'pg_properties',
  BUILDINGS: 'pg_buildings',
  ROOMS: 'pg_rooms',
  BEDS: 'pg_beds',
  TENANTS: 'pg_tenants',
  APPLICATIONS: 'pg_applications',
  BOOKINGS: 'pg_bookings',
  MOVE_INS: 'pg_moveins',
  MOVE_OUTS: 'pg_moveouts',
  INVOICES: 'pg_invoices',
  PAYMENTS: 'pg_payments',
  DEPOSITS: 'pg_deposits',
  EXPENSES: 'pg_expenses',
  COMPLAINTS: 'pg_complaints',
  MAINTENANCE: 'pg_maintenance',
  VISITORS: 'pg_visitors',
  LEAVE: 'pg_leave',
  FOOD_MENU: 'pg_food_menu',
  NOTICES: 'pg_notices',
  STAFF: 'pg_staff',
  ATTENDANCE: 'pg_attendance',
  SETTINGS: 'pg_settings',
  NOTIFICATIONS: 'pg_notifications',
  AUTH_USER: 'pg_auth_user',
  THEME: 'pg_theme',
} as const;

export { STORAGE_KEYS };

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      setItem(key, defaultValue);
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent('pg_storage_change', {
        detail: { key, value },
      })
    );
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function removeItem(key: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent('pg_storage_change', {
        detail: { key, value: null },
      })
    );
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * Resets all demo data to the initial pristine seed
 */
export function resetDemoData(): void {
  if (!isBrowser()) return;
  setItem(STORAGE_KEYS.PROPERTIES, initialProperties);
  setItem(STORAGE_KEYS.BUILDINGS, initialBuildings);
  setItem(STORAGE_KEYS.ROOMS, initialRooms);
  setItem(STORAGE_KEYS.BEDS, initialBeds);
  setItem(STORAGE_KEYS.TENANTS, initialTenants);
  setItem(STORAGE_KEYS.APPLICATIONS, initialApplications);
  setItem(STORAGE_KEYS.BOOKINGS, initialBookings);
  setItem(STORAGE_KEYS.MOVE_INS, initialMoveIns);
  setItem(STORAGE_KEYS.MOVE_OUTS, initialMoveOuts);
  setItem(STORAGE_KEYS.INVOICES, initialInvoices);
  setItem(STORAGE_KEYS.PAYMENTS, initialPayments);
  setItem(STORAGE_KEYS.DEPOSITS, initialDeposits);
  setItem(STORAGE_KEYS.EXPENSES, initialExpenses);
  setItem(STORAGE_KEYS.COMPLAINTS, initialComplaints);
  setItem(STORAGE_KEYS.MAINTENANCE, initialMaintenanceTasks);
  setItem(STORAGE_KEYS.VISITORS, initialVisitors);
  setItem(STORAGE_KEYS.LEAVE, initialLeaveRequests);
  setItem(STORAGE_KEYS.FOOD_MENU, weeklyFoodMenu);
  setItem(STORAGE_KEYS.NOTICES, initialNotices);
  setItem(STORAGE_KEYS.STAFF, initialStaff);
  setItem(STORAGE_KEYS.ATTENDANCE, initialStaffAttendance);
  setItem(STORAGE_KEYS.SETTINGS, initialSettings);
  setItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  setItem(STORAGE_KEYS.AUTH_USER, demoUsers.admin);

  window.dispatchEvent(new Event('pg_data_reset'));
}

/**
 * Ensures initial seed data is loaded into localStorage on initial application mount
 */
export function initializeStorageIfEmpty(): void {
  if (!isBrowser()) return;
  if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
    resetDemoData();
  }
}
