'use client';

import React, { useState } from 'react';
import { TenantPortalShell } from '@/components/layout/TenantPortalShell';
import { useAuth } from '@/hooks/useAuth';
import { useStorageState } from '@/hooks/useStorageState';
import { operationsService } from '@/services/operationsService';
import { tenantService } from '@/services/tenantService';
import { propertyService } from '@/services/propertyService';
import { Complaint, ComplaintCategory, Priority } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Filter,
  Wrench,
  Wifi,
  Sparkles,
  Zap,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export default function TenantComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useStorageState<Complaint[]>(
    'pg_complaints',
    operationsService.getComplaints()
  );
  const tenants = tenantService.getTenants();
  const currentTenant = tenants.find(t => t.email === user?.email) || tenants[0];
  const room = currentTenant ? propertyService.getRoomById(currentTenant.roomId) : null;

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ComplaintCategory>('plumbing');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDescription, setNewDescription] = useState('');

  // Filter complaints for this tenant
  const tenantComplaints = complaints.filter(c => c.tenantId === currentTenant?.id);

  const filtered = tenantComplaints.filter(c => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    return true;
  });

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !currentTenant) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      operationsService.createComplaint({
        propertyId: currentTenant.propertyId,
        roomId: currentTenant.roomId,
        tenantId: currentTenant.id,
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        priority: newPriority,
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        status: 'open',
      });

      setComplaints(operationsService.getComplaints());
      toast.success('Complaint ticket raised successfully. PG staff has been notified.');
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
    } catch {
      toast.error('Failed to submit complaint');
    }
  };

  const getCategoryIcon = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'electrical': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'plumbing': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'internet': return <Wifi className="w-4 h-4 text-indigo-500" />;
      case 'cleaning': return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'security': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <TenantPortalShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Helpdesk & Maintenance</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Raise maintenance requests, report room issues, and track live resolution updates.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Raise New Ticket
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Total Tickets</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{tenantComplaints.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-medium text-amber-500">In Progress</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {tenantComplaints.filter(c => c.status === 'in_progress' || c.status === 'open' || c.status === 'assigned').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-medium text-emerald-500">Resolved</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {tenantComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Avg Response Time</span>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">&lt; 3.5 hrs</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium">
            <Filter className="w-4 h-4 text-slate-400 ml-1" />
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Categories
            </button>
            {(['electrical', 'plumbing', 'internet', 'cleaning', 'furniture', 'food', 'security'] as ComplaintCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">All Clear! No complaints found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Everything in your room seems to be in order. Click below if you need any repairs or room assistance.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"
              >
                Raise a Request
              </button>
            </div>
          ) : (
            filtered.map(complaint => (
              <div 
                key={complaint.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {getCategoryIcon(complaint.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{complaint.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                          {complaint.ticketNumber || complaint.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5">
                        <span className="capitalize">{complaint.category}</span>
                        <span>•</span>
                        <span>Room {room?.roomNumber || 'Assigned'}</span>
                        <span>•</span>
                        <span>Logged {formatDate(complaint.createdDate)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <StatusBadge status={complaint.priority} />
                    <StatusBadge status={complaint.status} />
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  {complaint.description}
                </p>

                {/* Assignment & Comments status */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Assigned to: <strong className="text-slate-700 dark:text-slate-300 font-medium">{complaint.assignedStaffName || 'PG Caretaker / Warden'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{complaint.comments?.length || 1} update(s)</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Raise Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Raise Maintenance Issue</h3>
                  <p className="text-xs text-slate-500">Your PG supervisor will attend to this ticket shortly.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateComplaint} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Issue Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Geyser not heating, WiFi router disconnected"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ComplaintCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="internet">WiFi / Internet</option>
                      <option value="cleaning">Housekeeping / Cleaning</option>
                      <option value="furniture">Furniture & Bed</option>
                      <option value="food">Mess / Food</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Urgency / Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as Priority)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low (General)</option>
                      <option value="medium">Medium (Standard)</option>
                      <option value="high">High (Urgent)</option>
                      <option value="critical">Critical (Immediate Attention)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the issue in detail, including time of occurrence or any specifics..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TenantPortalShell>
  );
}
