'use client';

import React, { useState } from 'react';
import { TenantPortalShell } from '@/components/layout/TenantPortalShell';
import { useStorageState } from '@/hooks/useStorageState';
import { operationsService } from '@/services/operationsService';
import { MealItem } from '@/types';
import { 
  UtensilsCrossed, 
  Coffee, 
  Sun, 
  Moon, 
  Clock, 
  Sparkles, 
  Check, 
  ThumbsUp,
  MessageSquareHeart
} from 'lucide-react';
import { toast } from 'sonner';

export default function TenantFoodPage() {
  const [weeklyMenu] = useStorageState<MealItem[]>(
    'pg_food_menu',
    operationsService.getFoodMenu()
  );

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayName = daysOfWeek[(new Date().getDay() + 6) % 7];
  const [activeDay, setActiveDay] = useState(todayName);
  const [feedback, setFeedback] = useState('');

  const currentDayMenu = weeklyMenu.find(m => m.day.toLowerCase() === activeDay.toLowerCase()) || weeklyMenu[0];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    toast.success('Thank you! Your feedback has been sent to the PG Head Cook.');
    setFeedback('');
  };

  return (
    <TenantPortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Mess & Dining Menu</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Freshly prepared home-style meals, hygienic dining timings, and weekly meal rotation.
          </p>
        </div>

        {/* Timings Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Breakfast</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">7:30 AM - 10:00 AM</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Lunch</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">12:30 PM - 3:00 PM</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Dinner</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">8:00 PM - 10:30 PM</p>
            </div>
          </div>
        </div>

        {/* Days selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {daysOfWeek.map(day => {
            const isToday = day.toLowerCase() === todayName.toLowerCase();
            const isSelected = day.toLowerCase() === activeDay.toLowerCase();
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {day}
                {isToday && (
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'}`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Meals Grid */}
        {currentDayMenu ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Breakfast Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Breakfast</h3>
                    <span className="text-xs text-slate-400">7:30 AM - 10:00 AM</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-sm font-medium text-slate-800 dark:text-slate-200 min-h-[90px] flex items-center">
                {currentDayMenu.breakfast || 'Idli, Sambar, Coconut Chutney, Tea & Coffee'}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Unlimited Filter Coffee & Milk</span>
              </div>
            </div>

            {/* Lunch Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Lunch</h3>
                    <span className="text-xs text-slate-400">12:30 PM - 3:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-sm font-medium text-slate-800 dark:text-slate-200 min-h-[90px] flex items-center">
                {currentDayMenu.lunch || 'Basmati Rice, Dal Tadka, Seasonal Sabzi, Phulkas, Curd, Salad'}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Fresh curd and roasted papad daily</span>
              </div>
            </div>

            {/* Dinner Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Dinner</h3>
                    <span className="text-xs text-slate-400">8:00 PM - 10:30 PM</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-sm font-medium text-slate-800 dark:text-slate-200 min-h-[90px] flex items-center">
                {currentDayMenu.dinner || 'Paneer Butter Masala, Butter Roti, Jeera Rice, Gulab Jamun'}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Special dessert served on weekends</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">No menu data available.</div>
        )}

        {/* Feedback Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-rose-500" />
              Mess Feedback & Meal Suggestions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Have suggestions on spice levels, special festival cravings, or kitchen hygiene? Share directly with the cook.
            </p>
          </div>
          <form onSubmit={handleSendFeedback} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g. Less spicy dal on Mondays please"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-sm whitespace-nowrap"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </TenantPortalShell>
  );
}
