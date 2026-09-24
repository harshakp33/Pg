import { User } from '@/types/auth';

export const demoUsers: Record<string, User> = {
  admin: {
    id: 'usr-admin',
    name: 'Vikramaditya Roy (Owner / Admin)',
    email: 'admin@pgmanager.com',
    role: 'admin',
    phone: '+91 99000 11223',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  manager: {
    id: 'usr-mgr',
    name: 'Rajesh Kumar (Property Manager)',
    email: 'manager@pgmanager.com',
    role: 'manager',
    propertyId: 'prop-1',
    phone: '+91 98450 12345',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
  },
  accountant: {
    id: 'usr-acc',
    name: 'Meenakshi Sundaram (Senior Accountant)',
    email: 'accountant@pgmanager.com',
    role: 'accountant',
    phone: '+91 98455 67890',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  warden: {
    id: 'usr-wrd',
    name: 'Kavitha Murthy (Head Warden)',
    email: 'warden@pgmanager.com',
    role: 'warden',
    propertyId: 'prop-3',
    phone: '+91 98452 34567',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  tenant: {
    id: 'usr-tnt',
    name: 'Rahul Sharma (Resident Tenant)',
    email: 'tenant@pgmanager.com',
    role: 'tenant',
    propertyId: 'prop-1',
    tenantId: 'tnt-1',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  security: {
    id: 'usr-sec',
    name: 'Mahesh Bahadur (Security Supervisor)',
    email: 'security@pgmanager.com',
    role: 'security',
    propertyId: 'prop-1',
    phone: '+91 98459 66554'
  },
  maintenance: {
    id: 'usr-mnt',
    name: 'Santosh Kumar (Facility Lead)',
    email: 'maintenance@pgmanager.com',
    role: 'maintenance',
    propertyId: 'prop-1',
    phone: '+91 98459 88771'
  }
};
