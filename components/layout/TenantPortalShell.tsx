'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  AlertCircle,
  CalendarDays,
  UtensilsCrossed,
  Megaphone,
  UserCheck,
  Building,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { QuickRoleSwitcher } from '@/components/shared/QuickRoleSwitcher';
import { cn } from '@/lib/utils';

const tenantNavItems = [
  { title: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { title: 'Rent & Dues', href: '/portal/rent', icon: Receipt },
  { title: 'Payment History', href: '/portal/payments', icon: CreditCard },
  { title: 'My Complaints', href: '/portal/complaints', icon: AlertCircle },
  { title: 'Leave Requests', href: '/portal/leave', icon: CalendarDays },
  { title: 'Mess Menu', href: '/portal/food', icon: UtensilsCrossed },
  { title: 'Notice Board', href: '/portal/notices', icon: Megaphone },
  { title: 'My Profile & KYC', href: '/portal/profile', icon: UserCheck },
];

export function TenantPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/90 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/portal/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-foreground block leading-tight">
                PG Resident Portal
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Starlight Luxury Coliving
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Admin Dashboard</span>
            </Button>
          </Link>
          <QuickRoleSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Tenant Horizontal Navigation Tabs */}
      <div className="border-b border-border bg-card px-4 sm:px-8 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 sm:space-x-2 py-2 min-w-max">
          {tenantNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Tenant Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
