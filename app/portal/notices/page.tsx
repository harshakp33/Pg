'use client';

import React, { useState } from 'react';
import { TenantPortalShell } from '@/components/layout/TenantPortalShell';
import { useStorageState } from '@/hooks/useStorageState';
import { operationsService } from '@/services/operationsService';
import { Notice } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/format';
import { 
  BellRing, 
  Pin, 
  Calendar, 
  AlertTriangle, 
  Search
} from 'lucide-react';

export default function TenantNoticesPage() {
  const [notices] = useStorageState<Notice[]>(
    'pg_notices',
    operationsService.getNotices()
  );

  const [search, setSearch] = useState('');

  // Filter only published notices that target tenants or all
  const visibleNotices = notices.filter(n => {
    if (!n.isPublished) return false;
    if (n.audience === 'staff') return false; // Hide staff-only notices from tenants
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <TenantPortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Notice Board & Announcements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Official announcements, maintenance schedules, Wi-Fi upgrades, and community events.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars and notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Notices Cards Grid */}
        <div className="space-y-4">
          {visibleNotices.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8">
              <BellRing className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">No Announcements Currently</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Management has not published any notices right now. Check back later for updates.
              </p>
            </div>
          ) : (
            visibleNotices.map(notice => {
              const isUrgent = notice.priority === 'critical' || notice.priority === 'high';
              return (
                <div
                  key={notice.id}
                  className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                    isUrgent 
                      ? 'border-amber-300/80 dark:border-amber-700/60 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm shadow-amber-500/5' 
                      : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-2xl mt-0.5 ${
                        isUrgent 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' 
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                      }`}>
                        {isUrgent ? <AlertTriangle className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {notice.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Published {formatDate(notice.publishedDate)}
                          </span>
                          <span>•</span>
                          <span>By {notice.authorName}</span>
                          {notice.expiryDate && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 dark:text-amber-400">Valid until {formatDate(notice.expiryDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start">
                      <StatusBadge status={notice.priority} />
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium capitalize">
                        {notice.audience === 'all' ? 'All Residents' : notice.audience}
                      </span>
                    </div>
                  </div>

                  <div className="pl-0 sm:pl-12">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      {notice.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </TenantPortalShell>
  );
}
