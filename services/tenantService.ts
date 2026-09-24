import { Tenant, KycDetails, TenantDocument, ActivityLog } from '@/types/tenant';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { initialTenants } from '@/data/tenants';
import { propertyService } from './propertyService';

export const tenantService = {
  getTenants: (propertyId?: string): Tenant[] => {
    const list = getItem<Tenant[]>(STORAGE_KEYS.TENANTS, initialTenants);
    if (propertyId) return list.filter((t) => t.propertyId === propertyId);
    return list;
  },

  getTenantById: (id: string): Tenant | undefined => {
    const list = tenantService.getTenants();
    return list.find((t) => t.id === id);
  },

  createTenant: (data: Omit<Tenant, 'id' | 'tenantCode' | 'documents' | 'activities'>): Tenant => {
    const list = tenantService.getTenants();
    const count = list.length + 1;
    const newTenant: Tenant = {
      ...data,
      id: `tnt-${Date.now()}`,
      tenantCode: `TNT-${1000 + count}`,
      documents: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          action: 'Tenant Created',
          details: `Registered in Room bed ${data.bedId}`,
          timestamp: new Date().toLocaleString('en-IN'),
          actor: 'Admin',
        },
      ],
    };

    setItem(STORAGE_KEYS.TENANTS, [newTenant, ...list]);

    // Mark bed as occupied
    if (data.bedId) {
      propertyService.assignBed(data.bedId, newTenant.id, newTenant.name);
    }

    return newTenant;
  },

  updateTenant: (id: string, updates: Partial<Tenant>): Tenant | null => {
    const list = tenantService.getTenants();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const old = list[idx];
    const updated: Tenant = { ...old, ...updates };

    // If bed changed
    if (updates.bedId && updates.bedId !== old.bedId) {
      if (old.bedId) propertyService.releaseBed(old.bedId);
      propertyService.assignBed(updates.bedId, updated.id, updated.name);
    }

    list[idx] = updated;
    setItem(STORAGE_KEYS.TENANTS, [...list]);
    return updated;
  },

  deleteTenant: (id: string): boolean => {
    const list = tenantService.getTenants();
    const target = list.find((t) => t.id === id);
    if (!target) return false;

    // Release allocated bed
    if (target.bedId) {
      propertyService.releaseBed(target.bedId);
    }

    const filtered = list.filter((t) => t.id !== id);
    setItem(STORAGE_KEYS.TENANTS, filtered);
    return true;
  },

  updateKyc: (id: string, kyc: Partial<KycDetails>): Tenant | null => {
    const tenant = tenantService.getTenantById(id);
    if (!tenant) return null;
    const updatedKyc: KycDetails = { ...tenant.kyc, ...kyc };
    return tenantService.updateTenant(id, { kyc: updatedKyc });
  },

  addDocument: (id: string, doc: Omit<TenantDocument, 'id' | 'uploadedAt'>): Tenant | null => {
    const tenant = tenantService.getTenantById(id);
    if (!tenant) return null;
    const newDoc: TenantDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    return tenantService.updateTenant(id, {
      documents: [...(tenant.documents || []), newDoc],
    });
  },

  addActivity: (id: string, action: string, details: string, actor: string = 'Staff'): Tenant | null => {
    const tenant = tenantService.getTenantById(id);
    if (!tenant) return null;
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleString('en-IN'),
      actor,
    };
    return tenantService.updateTenant(id, {
      activities: [newAct, ...(tenant.activities || [])],
    });
  },
};
