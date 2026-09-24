'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Role } from '@/types/auth';
import { authService } from '@/services/authService';
import { initializeStorageIfEmpty } from '@/lib/storage';
import { demoUsers } from '@/data/users';

interface AuthContextType {
  user: User;
  role: Role;
  loginAsRole: (role: Role) => void;
  logout: () => void;
  canAccess: (allowedRoles: Role[]) => boolean;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(demoUsers.admin);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeStorageIfEmpty();
    const storedUser = authService.getCurrentUser();
    setUser(storedUser);
    setIsLoaded(true);

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === 'pg_auth_user') {
        setUser(customEvent.detail.value || demoUsers.admin);
      }
    };

    const handleReset = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener('pg_storage_change', handleStorageChange);
    window.addEventListener('pg_data_reset', handleReset);

    return () => {
      window.removeEventListener('pg_storage_change', handleStorageChange);
      window.removeEventListener('pg_data_reset', handleReset);
    };
  }, []);

  const loginAsRole = (role: Role) => {
    const updatedUser = authService.loginAsRole(role);
    setUser(updatedUser);
  };

  const logout = () => {
    authService.logout();
    setUser(authService.getCurrentUser());
  };

  const canAccess = (allowedRoles: Role[]) => {
    if (user.role === 'admin') return true; // Admin has full access
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        loginAsRole,
        logout,
        canAccess,
        isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
