'use client';

import React, { useState } from 'react';
import { TenantPortalShell } from '@/components/layout/TenantPortalShell';
import { useAuth } from '@/hooks/useAuth';
import { useStorageState } from '@/hooks/useStorageState';
import { tenantService } from '@/services/tenantService';
import { propertyService } from '@/services/propertyService';
import { Tenant } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatINR, formatDate } from '@/lib/format';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Building2, 
  QrCode,
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';

export default function TenantProfilePage() {
  const { user } = useAuth();
  const [tenants, setTenants] = useStorageState<Tenant[]>(
    'pg_tenants',
    tenantService.getTenants()
  );

  const tenant = tenants.find(t => t.email === user?.email) || tenants[0];
  const property = tenant ? propertyService.getPropertyById(tenant.propertyId) : null;
  const room = tenant ? propertyService.getRoomById(tenant.roomId) : null;
  const bed = tenant ? propertyService.getBedById(tenant.bedId) : null;

  const [isEditingEmergency, setIsEditingEmergency] = useState(false);
  const [emergencyName, setEmergencyName] = useState(tenant?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(tenant?.emergencyContact?.phone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(tenant?.emergencyContact?.relation || '');

  const handleSaveEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    try {
      tenantService.updateTenant(tenant.id, {
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relation: emergencyRelation
        }
      });
      setTenants(tenantService.getTenants());
      setIsEditingEmergency(false);
      toast.success('Emergency contact updated successfully');
    } catch {
      toast.error('Failed to update contact');
    }
  };

  if (!tenant) {
    return (
      <TenantPortalShell>
        <div className="p-8 text-center">Tenant record not found.</div>
      </TenantPortalShell>
    );
  }

  return (
    <TenantPortalShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Resident Profile & Digital Pass</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Verified identity credentials, room allocation details, and contact directory.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4" /> KYC Verified Resident
            </span>
          </div>
        </div>

        {/* Digital ID Badge Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-extrabold border border-white/30 text-white shadow-inner">
                {tenant.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{tenant.name}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm font-mono tracking-wider">
                    {tenant.id}
                  </span>
                </div>
                <p className="text-sm text-blue-100 mt-1 flex items-center gap-3">
                  <span>{tenant.email}</span>
                  <span>•</span>
                  <span>{tenant.phone}</span>
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-blue-200">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{property?.name || 'Assigned PG'}</span>
                  <span>|</span>
                  <span>Room {room?.roomNumber || 'N/A'} (Bed {bed?.bedNumber || 'A'})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-start md:self-auto">
              <QrCode className="w-12 h-12 text-white/90" />
              <div className="text-xs">
                <span className="text-blue-200 block text-[10px] uppercase font-bold tracking-wider">Gate Entry Pass</span>
                <span className="font-semibold text-white">Scan for Biometric / Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room & Tenancy Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Stay & Room Details</h3>
                <span className="text-xs text-slate-400">Current allocation agreement</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Property</span>
                <strong className="text-sm font-semibold text-slate-800 dark:text-slate-200">{property?.name || 'Main Property'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Room & Bed</span>
                <strong className="text-sm font-semibold text-slate-800 dark:text-slate-200">Room {room?.roomNumber || 'N/A'} • Bed {bed?.bedNumber || 'A'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Monthly Rent</span>
                <strong className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatINR(tenant.monthlyRent)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Deposit Paid</span>
                <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatINR(tenant.securityDeposit)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Move-In Date</span>
                <strong className="text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(tenant.moveInDate)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Tenancy Status</span>
                <div className="pt-0.5"><StatusBadge status={tenant.status} /></div>
              </div>
            </div>
          </div>

          {/* KYC Credentials */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">KYC & Verification</h3>
                <span className="text-xs text-slate-400">Government identity verification</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Aadhaar Card</span>
                    <span className="text-[11px] text-slate-400 font-mono">XXXX-XXXX-{tenant.kyc?.aadhaarNumber?.slice(-4) || '8821'}</span>
                  </div>
                </div>
                <StatusBadge status={tenant.kyc?.aadhaarStatus || 'verified'} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">PAN Card</span>
                    <span className="text-[11px] text-slate-400 font-mono">XXXXX{tenant.kyc?.panNumber?.slice(-4) || '729K'}</span>
                  </div>
                </div>
                <StatusBadge status={tenant.kyc?.panStatus || 'verified'} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Police Verification</span>
                    <span className="text-[11px] text-slate-400">Filed with local jurisdiction</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  Approved
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Emergency Contact</h3>
                  <span className="text-xs text-slate-400">Guardian / Next of kin</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditingEmergency(!isEditingEmergency)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> {isEditingEmergency ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingEmergency ? (
              <form onSubmit={handleSaveEmergency} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Father, Mother"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm"
                >
                  Save Emergency Contact
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact Person</span>
                  <strong className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tenant.emergencyContact?.name || 'Not provided'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Relationship</span>
                  <strong className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tenant.emergencyContact?.relation || 'Guardian'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Emergency Phone</span>
                  <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">{tenant.emergencyContact?.phone || 'Not provided'}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Quick House Rules */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Resident Policy & Rules</h3>
                <span className="text-xs text-slate-400">Building safety code of conduct</span>
              </div>
            </div>

            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>Main gate closes at 10:30 PM (Biometric or warden entry afterwards).</li>
              <li>Outside visitors allowed in reception / lobby area until 8:00 PM.</li>
              <li>Strict no-smoking and no-substance policy across all premises.</li>
              <li>Rent is due on or before the 5th of every calendar month.</li>
            </ul>
          </div>
        </div>
      </div>
    </TenantPortalShell>
  );
}
