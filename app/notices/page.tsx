'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Megaphone,
  Plus,
  Search,
  Trash2,
  Edit2,
  Calendar,
  Users,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { operationsService } from '@/services/operationsService';
import { propertyService } from '@/services/propertyService';
import { Notice, Priority } from '@/types/operations';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialNotices } from '@/data/operations';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function NoticesPage() {
  const [notices, setNotices] = useStorageState<Notice[]>(
    STORAGE_KEYS.NOTICES,
    initialNotices
  );

  const properties = propertyService.getProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [propertyId, setPropertyId] = useState('all');
  const [audience, setAudience] = useState<Notice['audience']>('all');
  const [priority, setPriority] = useState<Priority>('medium');
  const [expiryDate, setExpiryDate] = useState('2024-11-15');
  const [authorName, setAuthorName] = useState('Management Team');

  const filtered = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = audienceFilter === 'all' || n.audience === audienceFilter;
    return matchesSearch && matchesAudience;
  });

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setTitle('');
    setContent('');
    setPropertyId('all');
    setAudience('all');
    setPriority('medium');
    setExpiryDate('2024-11-15');
    setAuthorName('Management Team');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (n: Notice) => {
    setEditingNotice(n);
    setTitle(n.title);
    setContent(n.content);
    setPropertyId(n.propertyId);
    setAudience(n.audience);
    setPriority(n.priority);
    setExpiryDate(n.expiryDate || '');
    setAuthorName(n.authorName);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Please enter title and notice body');
      return;
    }

    if (editingNotice) {
      operationsService.updateNotice(editingNotice.id, {
        title,
        content,
        propertyId,
        audience,
        priority,
        expiryDate,
        authorName,
      });
      toast.success('Notice announcement updated');
    } else {
      operationsService.createNotice({
        title,
        content,
        propertyId,
        audience,
        priority,
        isPublished: true,
        expiryDate,
        authorName,
      });
      toast.success('Notice published to resident board!');
    }

    setIsDialogOpen(false);
  };

  const handleTogglePublish = (id: string, currentState: boolean) => {
    operationsService.updateNotice(id, { isPublished: !currentState });
    toast.success(currentState ? 'Notice unpublished' : 'Notice broadcasted live');
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      operationsService.deleteNotice(deleteTargetId);
      toast.success('Notice deleted');
      setDeleteTargetId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Notice Board & Broadcasts"
        description="Publish announcements, holiday notifications, and building policies to resident portals."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Notices' }]}
        actions={
          <Button onClick={handleOpenAdd} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Create Notice</span>
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Notices" value={notices.length} subtitle="Announcements on record" icon={Megaphone} />
        <StatCard
          title="Active Live"
          value={notices.filter((n) => n.isPublished).length}
          subtitle="Visible on resident portal"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-500/10"
        />
        <StatCard
          title="Tenant Audience"
          value={notices.filter((n) => n.audience === 'tenants' || n.audience === 'all').length}
          subtitle="Resident broadcasts"
          icon={Users}
          iconColor="text-sky-600 bg-sky-500/10"
        />
        <StatCard title="High Priority" value={notices.filter((n) => n.priority === 'high' || n.priority === 'critical').length} subtitle="Urgent bulletins" icon={Calendar} />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notice title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Select value={audienceFilter} onValueChange={setAudienceFilter}>
          <SelectTrigger className="h-9 text-xs w-44">
            <SelectValue placeholder="All Audiences" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Audiences</SelectItem>
            <SelectItem value="tenants">Tenants Only</SelectItem>
            <SelectItem value="staff">Staff Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notice Cards List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No notices found"
          description="Adjust your search criteria or compose a new notice."
          actionLabel="Create Notice"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                n.isPublished
                  ? 'bg-card border-border/80 shadow-xs'
                  : 'bg-muted/30 border-dashed border-border/60 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-muted-foreground">{n.noticeCode}</span>
                    <StatusBadge status={n.priority} />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Audience: {n.audience}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(n)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTargetId(n.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground">{n.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{n.content}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>By {n.authorName} • {formatDate(n.publishedDate)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTogglePublish(n.id, n.isPublished)}
                  className={`h-7 text-xs rounded-lg ${
                    n.isPublished ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  {n.isPublished ? 'Unpublish' : 'Publish Live'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNotice ? 'Edit Notice' : 'Compose Notice'}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Broadcast announcements to residents and staff.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Notice Headline *</Label>
              <Input
                required
                placeholder="e.g. Festive Diwali Dinner Timings"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Audience</Label>
                <Select value={audience} onValueChange={(val: any) => setAudience(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="tenants">Tenants Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Priority</Label>
                <Select value={priority} onValueChange={(val: Priority) => setPriority(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Author Byline</Label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Notice Content *</Label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs rounded-xl border border-input bg-transparent p-2.5 outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Type the full announcement message here..."
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                {editingNotice ? 'Update Notice' : 'Publish Notice'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Notice?"
        description="Are you sure you want to remove this notice? It will no longer appear on resident dashboards."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </AppShell>
  );
}
