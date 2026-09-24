'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Users,
  Building,
  Bed,
  CreditCard,
  FileText,
  AlertTriangle,
  DoorOpen,
  Calendar,
  Settings,
  LayoutDashboard,
  Shield,
  UtensilsCrossed,
} from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { propertyService } from '@/services/propertyService';
import { financeService } from '@/services/financeService';
import { operationsService } from '@/services/operationsService';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const tenants = tenantService.getTenants();
  const properties = propertyService.getProperties();
  const rooms = propertyService.getRooms();
  const invoices = financeService.getInvoices();
  const complaints = operationsService.getComplaints();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-sm items-center justify-between rounded-xl border border-border bg-card/60 px-3 text-xs text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground hover:border-border sm:w-64"
      >
        <div className="flex items-center gap-2">
          <span>Search PG Manager...</span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search tenants, rooms, invoices..." />
        <CommandList className="max-h-96">
          <CommandEmpty>No matching results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/properties'))}>
              <Building className="mr-2 h-4 w-4" />
              <span>Properties</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/rooms'))}>
              <DoorOpen className="mr-2 h-4 w-4" />
              <span>Rooms</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/beds'))}>
              <Bed className="mr-2 h-4 w-4" />
              <span>Bed Allocation Matrix</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/tenants'))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Tenants Directory</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/billing'))}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing & Invoices</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/food'))}>
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              <span>Food & Mess Planner</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Tenants">
            {tenants.slice(0, 5).map((t) => (
              <CommandItem
                key={t.id}
                onSelect={() => runCommand(() => router.push(`/tenants/${t.id}`))}
              >
                <Users className="mr-2 h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span>{t.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {t.phone} • {t.tenantCode}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Properties">
            {properties.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => runCommand(() => router.push(`/properties/${p.id}`))}
              >
                <Building className="mr-2 h-4 w-4 text-emerald-500" />
                <div className="flex flex-col">
                  <span>{p.name}</span>
                  <span className="text-[10px] text-muted-foreground">{p.area}, {p.city}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Complaints">
            {complaints.slice(0, 4).map((c) => (
              <CommandItem
                key={c.id}
                onSelect={() => runCommand(() => router.push('/complaints'))}
              >
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                <div className="flex flex-col truncate">
                  <span className="truncate">{c.title}</span>
                  <span className="text-[10px] text-muted-foreground">{c.ticketNumber} • {c.priority} priority</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
