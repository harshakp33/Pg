export type Role = 'admin' | 'manager' | 'accountant' | 'warden' | 'security' | 'maintenance' | 'tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  propertyId?: string; // Optional assignment to specific property
  tenantId?: string;   // Linked tenant ID if role is tenant
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
