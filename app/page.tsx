'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  CreditCard,
  Wrench,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BedDouble,
  UtensilsCrossed,
  FileCheck,
  Star,
  ChevronDown,
  HelpCircle,
  Zap,
  Lock,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-foreground">PG Manager</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-muted-foreground font-medium border-l border-border pl-2">
              Complete PG & Property Management
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Log in
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="text-xs gap-1.5 shadow-sm">
              <span>Live Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 text-xs font-medium text-muted-foreground mb-6 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Next-Generation Property & Coliving Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]">
            Run Your PG & Coliving Business on <span className="text-primary underline decoration-primary/40 underline-offset-8">Autopilot</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From bed allocation and Aadhaar KYC to automatic UPI rent collection, mess tracking, and visitor security logs. Built specifically for modern Indian PG owners and coliving operators.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-semibold gap-2 shadow-md">
                <span>Start Managing Your PG</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-semibold">
                Explore Demo Roles
              </Button>
            </Link>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-border/60 text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">98.4%</p>
              <p className="text-xs text-muted-foreground mt-1">Average PG Occupancy Rate</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">₹2.4 Cr+</p>
              <p className="text-xs text-muted-foreground mt-1">Monthly Rent Processed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">&lt; 4 hrs</p>
              <p className="text-xs text-muted-foreground mt-1">Average Complaint Resolution</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground mt-1">Digital KYC & Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 bg-muted/20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Everything Included</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-2">
              Engineered For Every Aspect of PG Operations
            </h2>
            <p className="text-sm text-muted-foreground mt-3">
              Replace disorganized WhatsApp groups, paper registers, and complex Excel sheets with one unified dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                <BedDouble className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Visual Bed Allocation Matrix</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Real-time bird's-eye view of every building, floor, room, and bed. Color-coded states for Occupied, Available, Reserved, and Maintenance with 1-click check-ins.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Single, Double, Triple sharing configs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Instant bed swap & transfer workflow</li>
              </ul>
            </Card>

            {/* Card 2 */}
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Smart Rent Billing & UPI</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Auto-generate monthly rent invoices on the 1st of every month. Add electricity meter submetering, food charges, and generate printable PDF-ready receipts with QR codes.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> WhatsApp & SMS payment links</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Automated overdue late fee calculation</li>
              </ul>
            </Card>

            {/* Card 3 */}
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 w-fit mb-4">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Digital KYC & Verification</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Streamlined tenant onboarding with Aadhaar, PAN card verification, police station submission documents, and emergency family contact records.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Digital 11-month agreement tracker</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Secure encrypted document repository</li>
              </ul>
            </Card>

            {/* Card 4 */}
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-4">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Complaint & Maintenance SLA</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Helpdesk ticketing with categories (Plumbing, Wi-Fi, Electrical, AC) and Kanban task boards. Assign staff members with due dates and resolution remarks.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Priority escalations (Low to Critical)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Maintenance cost tracking per task</li>
              </ul>
            </Card>

            {/* Card 5 */}
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 w-fit mb-4">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Food & Mess Management</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Publish weekly breakfast, lunch, and dinner menus. Residents register leave in advance so the kitchen cook knows exact daily headcounts to eliminate food waste.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Weekly North & South Indian menu schedule</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Automated mess bill rebate for approved leaves</li>
              </ul>
            </Card>

            {/* Card 6 */}
            <Card className="p-6 bg-card border-border/80 rounded-2xl shadow-xs hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 w-fit mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Security & Visitor Check-In</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Front desk visitor registration with ID verification, host resident linking, entry timestamping, and 1-click checkout for maximum property security.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Real-time "Inside Building" counter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Staff biometric attendance log</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Simplicity First</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-2">
              Up and Running in 3 Easy Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h3 className="text-base font-bold text-foreground">Configure Properties & Rooms</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Add your buildings, floors, room configurations (Single, Twin, Triple), and establish base rents and security deposit policies.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-foreground">Onboard Residents & KYC</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Convert incoming leads, allocate vacant beds, and collect digital Aadhaar/PAN proofs with emergency contacts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-foreground">Collect Rent & Track Growth</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Automate monthly rent collection, track expenses, handle complaints, and analyze occupancy trends from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Transparent Pricing</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-2">
              Plans Scaled to Your Bed Capacity
            </h2>
            <p className="text-sm text-muted-foreground mt-3">
              Simple per-bed pricing with zero hidden maintenance fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="p-6 bg-card border-border/80 rounded-2xl flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Starter PG</p>
                <p className="text-xs text-muted-foreground mt-1">For single property owners</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-foreground">₹1,999</span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Up to 30 Beds</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Digital Rent Invoicing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Tenant KYC & Agreements</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Complaint Management</li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8">
                <Button variant="outline" className="w-full text-xs">Choose Starter</Button>
              </Link>
            </Card>

            {/* Growth (Featured) */}
            <Card className="p-6 bg-card border-primary rounded-2xl relative shadow-lg flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Growth PG</p>
                <p className="text-xs text-muted-foreground mt-1">For scaling coliving spaces</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-foreground">₹3,999</span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Up to 100 Beds (Multi-property)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Tenant Self-Service Portal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Food & Mess Headcount Tracker</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Visitor & Gate Security Log</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Staff Attendance & Payroll</li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8">
                <Button className="w-full text-xs shadow-md">Choose Growth</Button>
              </Link>
            </Card>

            {/* Enterprise */}
            <Card className="p-6 bg-card border-border/80 rounded-2xl flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Enterprise Coliving</p>
                <p className="text-xs text-muted-foreground mt-1">For multi-city property chains</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-foreground">₹7,999</span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Unlimited Beds & Properties</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Role-Based Access Control</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Advanced Financial Reports & CSV</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 24x7 Dedicated Account Manager</li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8">
                <Button variant="outline" className="w-full text-xs">Contact Sales</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Customer Stories</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-2">
              Loved by PG Owners Across Bengaluru & Hyderabad
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border/80 rounded-2xl">
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "Before PG Manager, tracking rent from 65 tenants across Koramangala was a nightmare. Now automated invoices go out on the 1st and over 90% pay via UPI within 3 days."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  RK
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Rajesh Kumar</p>
                  <p className="text-[11px] text-muted-foreground">Owner, Starlight Coliving (120 beds)</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/80 rounded-2xl">
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "The mess management and leave request system saved us over ₹35,000 monthly in grocery wastage alone. The tenants love seeing the weekly menu on their portal."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center">
                  SR
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Suresh Reddy</p>
                  <p className="text-[11px] text-muted-foreground">Managing Partner, Greenfield Executive PGs</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/80 rounded-2xl">
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "The bed allocation matrix makes it so easy to see vacant beds instantly when someone walks in. Clean, reliable, and looks just like modern Silicon Valley software."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-sky-500/10 text-sky-600 font-bold text-xs flex items-center justify-center">
                  KM
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Kavitha Murthy</p>
                  <p className="text-[11px] text-muted-foreground">Director, UrbanNest Women Coliving</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted/20 border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Frequently Asked Questions</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-2">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="p-5 bg-card border-border/80 rounded-xl">
              <h4 className="text-sm font-semibold text-foreground">Can I manage multiple PG buildings and locations under one account?</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Yes! PG Manager is built from the ground up to support multiple properties, buildings, floors, and rooms. You can filter data by individual property or view consolidated business analytics.
              </p>
            </Card>

            <Card className="p-5 bg-card border-border/80 rounded-xl">
              <h4 className="text-sm font-semibold text-foreground">How does tenant rent collection work?</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Invoices are generated on the 1st of each month with custom electricity and utility meter charges. Payments can be recorded via UPI, Cash, Bank Transfer, or Card, and printable payment receipts with reference IDs are produced instantly.
              </p>
            </Card>

            <Card className="p-5 bg-card border-border/80 rounded-xl">
              <h4 className="text-sm font-semibold text-foreground">Do tenants get their own login portal?</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Yes! Residents have access to a dedicated Tenant Portal where they can view due rent, download payment receipts, submit maintenance tickets with photos, view the daily mess menu, and request festival leaves.
              </p>
            </Card>

            <Card className="p-5 bg-card border-border/80 rounded-xl">
              <h4 className="text-sm font-semibold text-foreground">Is my data backed up and private?</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                All records, documents, and tenant logs are securely stored and protected with role-based access control, ensuring only authorized staff can view sensitive financial or personal details.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Ready to Modernize Your PG Business?
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto">
            Experience our complete, interactive frontend demonstration right now. Zero setup required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-sm font-semibold shadow-md gap-2">
                <span>Start Managing Your PG</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-sm font-semibold">
                Sign In to Demo Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/80 py-8 bg-card px-4 sm:px-8 text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">PG Manager</span>
            <span>— Complete PG & Property Management</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-foreground">Demo Accounts</Link>
            <Link href="/dashboard" className="hover:text-foreground">Admin Dashboard</Link>
            <Link href="/portal/dashboard" className="hover:text-foreground">Tenant Portal</Link>
            <span>© {new Date().getFullYear()} PG Manager. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
