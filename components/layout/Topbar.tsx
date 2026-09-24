'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, LogOut, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommandMenu } from '@/components/shared/CommandMenu';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { QuickRoleSwitcher } from '@/components/shared/QuickRoleSwitcher';
import { ResetDataButton } from '@/components/shared/ResetDataButton';
import { useAuth } from '@/hooks/useAuth';
import { demoUsers } from '@/data/users';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const { user, isLoaded, logout } = useAuth();
  const currentUser = isLoaded ? user : demoUsers.admin;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/85 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <div className="hidden sm:block">
          <CommandMenu />
        </div>
      </div>

      {/* Right side: Role Switcher, Reset, Notifications, Theme, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Reset Data Button (hidden on tiny screens) */}
        <div className="hidden lg:block">
          <ResetDataButton />
        </div>

        {/* Quick Role Switcher */}
        <QuickRoleSwitcher />

        {/* Notification Center */}
        <NotificationCenter />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs ring-2 ring-background shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <DropdownMenuLabel className="font-normal px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold leading-none text-foreground">{currentUser.name}</p>
                <p className="text-[11px] leading-none text-muted-foreground">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Link href="/settings" className="flex w-full items-center gap-2 px-1.5 py-1 cursor-pointer">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Settings & Preferences</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link href="/portal/dashboard" className="flex w-full items-center gap-2 px-1.5 py-1 cursor-pointer">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Switch to Tenant Portal</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
