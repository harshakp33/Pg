'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { ResetDataButton } from '@/components/shared/ResetDataButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Building2,
  Receipt,
  Bell,
  Palette,
  RotateCcw,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { settingsService } from '@/services/settingsService';
import { PGSettings } from '@/types/settings';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialSettings } from '@/data/settings';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useStorageState<PGSettings>(
    STORAGE_KEYS.SETTINGS,
    initialSettings
  );

  const [appName, setAppName] = useState(settings.appName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [currency, setCurrency] = useState(settings.currency);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);
  const [noticePeriod, setNoticePeriod] = useState(settings.defaultNoticePeriodDays);
  const [lateFee, setLateFee] = useState(settings.lateFeePerDay);
  const [gracePeriod, setGracePeriod] = useState(settings.gracePeriodDays);
  const [electricityRate, setElectricityRate] = useState(settings.electricityRatePerUnit);
  const [upiId, setUpiId] = useState(settings.upiId);
  const [companyPhone, setCompanyPhone] = useState(settings.companyPhone);
  const [companyEmail, setCompanyEmail] = useState(settings.companyEmail);
  const [smsAlerts, setSmsAlerts] = useState(settings.enableSmsNotifications);
  const [emailAlerts, setEmailAlerts] = useState(settings.enableEmailNotifications);
  const [whatsappAlerts, setWhatsappAlerts] = useState(settings.enableWhatsAppAlerts);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    settingsService.updateSettings({
      appName,
      tagline,
      currency,
      dateFormat,
      defaultNoticePeriodDays: noticePeriod,
      lateFeePerDay: lateFee,
      gracePeriodDays: gracePeriod,
      electricityRatePerUnit: electricityRate,
      upiId,
      companyPhone,
      companyEmail,
      enableSmsNotifications: smsAlerts,
      enableEmailNotifications: emailAlerts,
      enableWhatsAppAlerts: whatsappAlerts,
    });
    toast.success('System settings saved successfully!');
  };

  return (
    <AppShell>
      <PageHeader
        title="System Settings & Preferences"
        description="Configure PG defaults, rental policies, late fee penalties, alert gateways, and demo parameters."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Settings' }]}
        actions={
          <div className="flex items-center gap-2">
            <ResetDataButton />
          </div>
        }
      />

      <form onSubmit={handleSaveAll} className="space-y-6 max-w-4xl">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-muted/60 p-1 rounded-xl flex-wrap h-auto">
            <TabsTrigger value="general" className="text-xs rounded-lg">General & Branding</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs rounded-lg">Billing & Late Fees</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs rounded-lg">Alerts & WhatsApp</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs rounded-lg">Appearance & Theme</TabsTrigger>
            <TabsTrigger value="backup" className="text-xs rounded-lg">Data & Storage</TabsTrigger>
          </TabsList>

          {/* TAB 1: General */}
          <TabsContent value="general" className="space-y-4">
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Organization Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Application Name</Label>
                  <Input
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Tagline</Label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Support Phone Number</Label>
                  <Input
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Support Email</Label>
                  <Input
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Currency Display</Label>
                  <Input value="INR (₹) - Indian Rupee" disabled className="h-9 text-xs bg-muted/40" />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: Billing & Late Fees */}
          <TabsContent value="billing" className="space-y-4">
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Rent Run & Tariff Rules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Default Notice Period (Days)</Label>
                  <Input
                    type="number"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Grace Period Days (Before Late Fee)</Label>
                  <Input
                    type="number"
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Late Fee Per Day (₹)</Label>
                  <Input
                    type="number"
                    value={lateFee}
                    onChange={(e) => setLateFee(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Electricity Rate (₹ per unit/kWh)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Business UPI ID (For Invoices)</Label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Notification Channels</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer">
                  <div>
                    <p className="text-xs font-semibold text-foreground">WhatsApp Payment Reminders</p>
                    <p className="text-[11px] text-muted-foreground">Automated WhatsApp message with UPI payment link on 1st of month.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    className="rounded h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer">
                  <div>
                    <p className="text-xs font-semibold text-foreground">SMS Rent Alerts</p>
                    <p className="text-[11px] text-muted-foreground">SMS reminder on invoice generation and payment receipt.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="rounded h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Email Notifications & Invoices</p>
                    <p className="text-[11px] text-muted-foreground">Deliver PDF invoices and rent receipts to resident inboxes.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded h-4 w-4"
                  />
                </label>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: Appearance */}
          <TabsContent value="appearance" className="space-y-4">
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Theme & Display</h3>
              <p className="text-xs text-muted-foreground">
                PG Manager supports sleek Dark mode and crisp Light mode with balanced contrast tailored for Indian commercial operations.
              </p>
              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('pg_theme', 'light');
                    toast.success('Light Mode activated');
                  }}
                  className="text-xs"
                >
                  Light Theme
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('pg_theme', 'dark');
                    toast.success('Dark Mode activated');
                  }}
                  className="text-xs"
                >
                  Dark Theme
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 5: Data & Backup */}
          <TabsContent value="backup" className="space-y-4">
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Demo Data State & Local Storage</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All properties, rooms, beds, tenants, applications, invoices, payments, and complaints are currently persisted in your browser's LocalStorage. You can reset everything to the original pristine Bangalore demonstration dataset anytime.
              </p>
              <div className="pt-2">
                <ResetDataButton />
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="text-xs h-10 px-6 gap-2 shadow-xs">
          <Save className="h-4 w-4" />
          <span>Save System Settings</span>
        </Button>
      </form>
    </AppShell>
  );
}
