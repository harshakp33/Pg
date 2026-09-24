'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Building,
  DoorOpen,
  BedDouble,
  Users,
  UserPlus,
  CalendarCheck,
  ArrowRightLeft,
  Receipt,
  CreditCard,
  PiggyBank,
  TrendingDown,
  AlertCircle,
  Wrench,
  UserCheck2,
  CalendarDays,
  UtensilsCrossed,
  ShieldCheck,
  Clock,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building as PGLogoIcon,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { demoUsers } from '@/data/users';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: Role[];
  badge?: string | number;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    section: 'OVERVIEW',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'PROPERTY',
    items: [
      { title: 'Properties', href: '/properties', icon: Building2, roles: ['admin', 'manager'] },
      { title: 'Buildings', href: '/buildings', icon: Building, roles: ['admin', 'manager'] },
      { title: 'Rooms', href: '/rooms', icon: DoorOpen, roles: ['admin', 'manager', 'warden'] },
      { title: 'Beds', href: '/beds', icon: BedDouble, roles: ['admin', 'manager', 'warden'] },
    ],
  },
  {
    section: 'RESIDENTS',
    items: [
      { title: 'Tenants', href: '/tenants', icon: Users, roles: ['admin', 'manager', 'warden'] },
      { title: 'Applications', href: '/applications', icon: UserPlus, roles: ['admin', 'manager'] },
      { title: 'Bookings', href: '/bookings', icon: CalendarCheck, roles: ['admin', 'manager'] },
      { title: 'Move In / Out', href: '/move-in', icon: ArrowRightLeft, roles: ['admin', 'manager', 'warden'] },
    ],
  },
  {
    section: 'FINANCE',
    items: [
      { title: 'Billing', href: '/billing', icon: Receipt, roles: ['admin', 'accountant', 'manager'] },
      { title: 'Payments', href: '/payments', icon: CreditCard, roles: ['admin', 'accountant'] },
      { title: 'Deposits', href: '/deposits', icon: PiggyBank, roles: ['admin', 'accountant'] },
      { title: 'Expenses', href: '/expenses', icon: TrendingDown, roles: ['admin', 'accountant'] },
    ],
  },
  {
    section: 'OPERATIONS',
    items: [
      { title: 'Complaints', href: '/complaints', icon: AlertCircle, roles: ['admin', 'manager', 'warden', 'maintenance'] },
      { title: 'Maintenance', href: '/maintenance', icon: Wrench, roles: ['admin', 'manager', 'maintenance'] },
      { title: 'Visitors', href: '/visitors', icon: UserCheck2, roles: ['admin', 'manager', 'warden', 'security'] },
      { title: 'Leave Requests', href: '/leave', icon: CalendarDays, roles: ['admin', 'manager', 'warden'] },
      { title: 'Food / Mess', href: '/food', icon: UtensilsCrossed, roles: ['admin', 'manager', 'warden'] },
    ],
  },
  {
    section: 'PEOPLE',
    items: [
      { title: 'Staff', href: '/staff', icon: ShieldCheck, roles: ['admin', 'manager'] },
      { title: 'Attendance', href: '/attendance', icon: Clock, roles: ['admin', 'manager', 'warden'] },
    ],
  },
  {
    section: 'COMMUNICATION',
    items: [
      { title: 'Notices', href: '/notices', icon: Megaphone },
    ],
  },
  {
    section: 'ANALYTICS',
    items: [
      { title: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'manager', 'accountant'] },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      { title: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { role, user, logout, isLoaded } = useAuth();

  const handleLinkClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  // During SSR and initial client hydration, default to admin to match server-rendered HTML
  const currentRole = isLoaded ? role : 'admin';
  const currentUser = isLoaded ? user : demoUsers.admin;

  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/80">
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <PGLogoIcon className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold tracking-tight text-foreground truncate">
                PG Manager
              </span>
              <span className="text-[10px] text-muted-foreground truncate font-medium">
                Complete Property SaaS
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 scrollbar-thin">
        {navSections.map((sec) => {
          // Filter items based on user role
          const visibleItems = sec.items.filter((item) => {
            if (currentRole === 'admin') return true;
            if (!item.roles) return true;
            return item.roles.includes(currentRole);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={sec.section} className="space-y-1">
              {!collapsed && (
                <p className="px-2.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                  {sec.section}
                </p>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {!collapsed && <span className="truncate flex-1">{item.title}</span>}
                    {!collapsed && item.badge && (
                      <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}

        {/* Tenant Portal Shortcut */}
        <div className="pt-2 border-t border-border/80">
          <Link
            href="/portal/dashboard"
            onClick={handleLinkClick}
            className={cn(
              'group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 transition-all',
              collapsed && 'justify-center px-0'
            )}
            title="Tenant Self-Service Portal"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="truncate flex-1">Tenant Portal</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </>
            )}
          </Link>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-border/80">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-xl bg-muted/40 border border-border/60',
            collapsed && 'justify-center p-1.5'
          )}
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{currentUser.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize truncate">{currentRole} Account</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
