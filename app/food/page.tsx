'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  UtensilsCrossed,
  Coffee,
  Sun,
  Moon,
  Users,
  Edit2,
  Calendar,
  DollarSign,
  ChefHat,
  Sparkles,
} from 'lucide-react';
import { operationsService } from '@/services/operationsService';
import { tenantService } from '@/services/tenantService';
import { MealItem } from '@/types/operations';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { weeklyFoodMenu } from '@/data/operations';
import { formatINR } from '@/lib/format';
import { toast } from 'sonner';

export default function FoodPage() {
  const [menu, setMenu] = useStorageState<MealItem[]>(
    STORAGE_KEYS.FOOD_MENU,
    weeklyFoodMenu
  );

  const tenants = tenantService.getTenants().filter((t) => t.status === 'active');
  const [editingDay, setEditingDay] = useState<MealItem | null>(null);

  // Form states for editing day
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Daily headcounts
  const totalResidents = tenants.length;
  const estimatedBreakfast = totalResidents - 1;
  const estimatedLunch = Math.round(totalResidents * 0.75); // some at office
  const estimatedDinner = totalResidents;

  // Monthly food charges estimated
  const monthlyFoodCost = 45000;

  const handleOpenEdit = (item: MealItem) => {
    setEditingDay(item);
    setBreakfast(item.breakfast);
    setLunch(item.lunch);
    setDinner(item.dinner);
    setSpecialNotes(item.specialNotes || '');
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;

    operationsService.updateMealItem(editingDay.id, {
      breakfast,
      lunch,
      dinner,
      specialNotes,
    });

    toast.success(`Menu for ${editingDay.day} updated!`);
    setEditingDay(null);
  };

  // Find today's day of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const todayMenu = menu.find((m) => m.day === todayName) || menu[0];

  return (
    <AppShell>
      <PageHeader
        title="Food & Mess Management"
        description="Weekly North & South Indian meal planning, kitchen headcount estimates, and mess grocery accounting."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Food & Mess' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Resident Diners" value={totalResidents} subtitle="Active meal subscribers" icon={Users} />
        <StatCard
          title="Today Breakfast Count"
          value={estimatedBreakfast}
          subtitle="Morning breakfast plates"
          icon={Coffee}
          iconColor="text-amber-600 bg-amber-500/10"
        />
        <StatCard
          title="Today Lunch / Dinner"
          value={`${estimatedLunch} / ${estimatedDinner}`}
          subtitle="Estimated plates required"
          icon={UtensilsCrossed}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Monthly Ration Cost"
          value={formatINR(monthlyFoodCost)}
          subtitle="Grocery & provisions"
          icon={ChefHat}
        />
      </div>

      {/* Today's Special Menu Banner */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/30 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Today's Menu ({todayMenu.day})</h3>
              <p className="text-xs text-muted-foreground">Freshly prepared North & South Indian kitchen meals</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenEdit(todayMenu)}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Today's Menu</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-card border border-border/70 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Coffee className="h-4 w-4" />
              <span>Breakfast (7:30 AM - 10:00 AM)</span>
            </div>
            <p className="text-xs text-foreground font-medium">{todayMenu.breakfast}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/70 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sun className="h-4 w-4" />
              <span>Lunch (12:30 PM - 3:00 PM)</span>
            </div>
            <p className="text-xs text-foreground font-medium">{todayMenu.lunch}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/70 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Moon className="h-4 w-4" />
              <span>Dinner (8:00 PM - 10:30 PM)</span>
            </div>
            <p className="text-xs text-foreground font-medium">{todayMenu.dinner}</p>
          </div>
        </div>
      </Card>

      {/* Weekly Menu Schedule Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground">7-Day Weekly Mess Menu Schedule</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map((dayItem) => {
            const isToday = dayItem.day === todayName;

            return (
              <Card
                key={dayItem.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isToday
                    ? 'border-primary ring-1 ring-primary/40 bg-card shadow-xs'
                    : 'bg-card border-border/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <span>{dayItem.day}</span>
                      {isToday && (
                        <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(dayItem)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <Coffee className="h-3 w-3 text-amber-500" /> Breakfast
                      </p>
                      <p className="font-medium text-foreground mt-0.5">{dayItem.breakfast}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <Sun className="h-3 w-3 text-sky-500" /> Lunch
                      </p>
                      <p className="font-medium text-foreground mt-0.5">{dayItem.lunch}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <Moon className="h-3 w-3 text-violet-500" /> Dinner
                      </p>
                      <p className="font-medium text-foreground mt-0.5">{dayItem.dinner}</p>
                    </div>

                    {dayItem.specialNotes && (
                      <div className="p-2 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-primary font-medium">
                        ★ {dayItem.specialNotes}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Day Menu Dialog */}
      <Dialog open={!!editingDay} onOpenChange={(open) => !open && setEditingDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu for {editingDay?.day}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update dishes served for breakfast, lunch, or dinner.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveMenu} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Breakfast Items</Label>
              <Input
                value={breakfast}
                onChange={(e) => setBreakfast(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Lunch Items</Label>
              <Input
                value={lunch}
                onChange={(e) => setLunch(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Dinner Items</Label>
              <Input
                value={dinner}
                onChange={(e) => setDinner(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Special Weekend Note</Label>
              <Input
                placeholder="e.g. Non-veg chicken biryani & paneer special"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingDay(null)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Update Menu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
