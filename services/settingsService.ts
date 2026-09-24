import { PGSettings, NotificationItem } from '@/types/settings';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { initialSettings, initialNotifications } from '@/data/settings';

export const settingsService = {
  getSettings: (): PGSettings => {
    return getItem<PGSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  },

  updateSettings: (updates: Partial<PGSettings>): PGSettings => {
    const current = settingsService.getSettings();
    const updated = { ...current, ...updates };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Notifications
  getNotifications: (): NotificationItem[] => {
    return getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  },

  markAsRead: (id: string): void => {
    const list = settingsService.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllAsRead: (): void => {
    const list = settingsService.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  addNotification: (data: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem => {
    const list = settingsService.getNotifications();
    const newItem: NotificationItem = {
      ...data,
      id: `ntf-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setItem(STORAGE_KEYS.NOTIFICATIONS, [newItem, ...list]);
    return newItem;
  },
};
