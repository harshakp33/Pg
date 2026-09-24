'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, AlertCircle, Calendar, CreditCard, Wrench, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { settingsService } from '@/services/settingsService';
import { useStorageState } from '@/hooks/useStorageState';
import { NotificationItem } from '@/types/settings';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialNotifications } from '@/data/settings';

export function NotificationCenter() {
  const router = useRouter();
  const [notifications] = useStorageState<NotificationItem[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    initialNotifications
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleItemClick = (item: NotificationItem) => {
    settingsService.markAsRead(item.id);
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleMarkAllRead = () => {
    settingsService.markAllAsRead();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'rent':
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case 'booking':
        return <Calendar className="h-4 w-4 text-sky-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'complaint':
        return <Wrench className="h-4 w-4 text-amber-500" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            {unreadCount}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-2">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications ({unreadCount} unread)
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-7 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto space-y-1 py-1">
          {notifications.length === 0 ? (
            <p className="text-center py-6 text-xs text-muted-foreground">
              No notifications at this time
            </p>
          ) : (
            notifications.slice(0, 6).map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer ${
                  !item.read ? 'bg-muted/50 font-medium' : 'opacity-80'
                }`}
              >
                <div className="mt-0.5 p-1 rounded-md bg-background border border-border">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                      {item.createdAt.split(' ')[1] || item.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>
                {!item.read && (
                  <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
