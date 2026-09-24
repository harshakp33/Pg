import { User, Role } from '@/types/auth';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { demoUsers } from '@/data/users';

export const authService = {
  getCurrentUser: (): User => {
    return getItem<User>(STORAGE_KEYS.AUTH_USER, demoUsers.admin);
  },

  setCurrentUser: (user: User): void => {
    setItem(STORAGE_KEYS.AUTH_USER, user);
  },

  loginAsRole: (role: Role): User => {
    const user = demoUsers[role] || demoUsers.admin;
    setItem(STORAGE_KEYS.AUTH_USER, user);
    return user;
  },

  loginWithEmail: (email: string): User | null => {
    const found = Object.values(demoUsers).find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (found) {
      setItem(STORAGE_KEYS.AUTH_USER, found);
      return found;
    }
    // Fallback: create mock user
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'admin',
    };
    setItem(STORAGE_KEYS.AUTH_USER, fallbackUser);
    return fallbackUser;
  },

  logout: (): void => {
    setItem(STORAGE_KEYS.AUTH_USER, demoUsers.admin);
  },
};
