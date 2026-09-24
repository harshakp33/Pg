'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
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
import { Building2, Plus, Search, Layers, Edit2, Trash2, DoorOpen, BedDouble } from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { Building } from '@/types/property';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialBuildings } from '@/data/properties';
import { toast } from 'sonner';

export default function BuildingsPage() {
  const [buildings, setBuildings] = useStorageState<Building[]>(
    STORAGE_KEYS.BUILDINGS,
    initialBuildings
  );

  const properties = propertyService.getProperties();
  const rooms = propertyService.getRooms();
  const beds = propertyService.getBeds();

  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [numberOfFloors, setNumberOfFloors] = useState(3);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Building['status']>('active');

  const filteredBuildings = buildings.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProp = propertyFilter === 'all' || b.propertyId === propertyFilter;
    return matchesSearch && matchesProp;
  });

  const handleOpenAdd = () => {
    setEditingBuilding(null);
    setName('');
    setPropertyId(properties[0]?.id || '');
    setNumberOfFloors(3);
    setDescription('');
    setStatus('active');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (bld: Building) => {
    setEditingBuilding(bld);
    setName(bld.name);
    setPropertyId(bld.propertyId);
    setNumberOfFloors(bld.numberOfFloors);
    setDescription(bld.description);
    setStatus(bld.status);
    setIsDialogOpen(true);
  };

  const handleSaveBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !propertyId) {
      toast.error('Please enter building name and select a property.');
      return;
    }

    if (editingBuilding) {
      propertyService.updateBuilding(editingBuilding.id, {
        name,
        propertyId,
        numberOfFloors,
        description,
        status,
      });
      toast.success('Building updated successfully');
    } else {
      propertyService.createBuilding({
        name,
        propertyId,
        numberOfFloors,
        description,
        status,
      });
      toast.success('New building registered!');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      propertyService.deleteBuilding(deleteTargetId);
      toast.success('Building removed.');
      setDeleteTargetId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Buildings & Floors"
        description="Organize physical blocks, wings, and towers across your property locations."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Buildings' }]}
        actions={
          <Button onClick={handleOpenAdd} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Add Building</span>
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buildings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="h-9 text-xs w-56">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredBuildings.length === 0 ? (
        <EmptyState
          title="No buildings found"
          description="Try changing filters or add a new building block."
          actionLabel="Add Building"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBuildings.map((bld) => {
            const prop = properties.find((p) => p.id === bld.propertyId);
            const bldRooms = rooms.filter((r) => r.buildingId === bld.id);
            const bldBeds = beds.filter((b) => b.buildingId === bld.id);
            const occupied = bldBeds.filter((b) => b.status === 'occupied').length;
            const occupancyPct = bldBeds.length > 0 ? Math.round((occupied / bldBeds.length) * 100) : 0;

            // Generate Floor Breakdown
            const floorArray = Array.from({ length: bld.numberOfFloors }, (_, i) => i + 1);

            return (
              <Card
                key={bld.id}
                className="p-5 bg-card border-border/80 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">{bld.name}</h3>
                        <StatusBadge status={bld.status} />
                      </div>
                      <p className="text-xs text-primary font-medium mt-0.5">
                        {prop ? prop.name : 'Unknown Property'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{bld.description}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(bld)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Edit Building"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTargetId(bld.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete Building"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Summary Metric Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs p-2.5 rounded-xl bg-muted/40 border border-border/60">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Floors</span>
                      <p className="text-sm font-bold text-foreground mt-0.5">{bld.numberOfFloors}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Rooms</span>
                      <p className="text-sm font-bold text-foreground mt-0.5">{bldRooms.length}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Occupancy</span>
                      <p className="text-sm font-bold text-primary mt-0.5">{occupancyPct}%</p>
                    </div>
                  </div>

                  {/* Floor by floor breakdown list */}
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Floor Breakdown
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {floorArray.map((flr) => {
                        const floorRooms = bldRooms.filter((r) => r.floorNumber === flr);
                        const floorBeds = bldBeds.filter((b) => {
                          const room = rooms.find((r) => r.id === b.roomId);
                          return room?.floorNumber === flr && room?.buildingId === bld.id;
                        });
                        const floorOcc = floorBeds.filter((b) => b.status === 'occupied').length;

                        return (
                          <div
                            key={flr}
                            className="p-2 rounded-lg border border-border/60 flex items-center justify-between text-xs bg-card"
                          >
                            <span className="font-semibold text-foreground flex items-center gap-1.5">
                              <Layers className="h-3 w-3 text-muted-foreground" /> Floor {flr}
                            </span>
                            <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                              <span>{floorRooms.length} Rooms</span>
                              <span>{floorBeds.length} Beds</span>
                              <span className="font-medium text-foreground">
                                {floorBeds.length > 0 ? `${floorOcc}/${floorBeds.length} Occupied` : '0 Beds'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBuilding ? 'Edit Building' : 'Add New Building'}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the building wing, property location, and floor count.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveBuilding} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Building Name *</Label>
              <Input
                required
                placeholder="e.g. Tower A or Main Wing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Property Location *</Label>
              <Select value={propertyId} onValueChange={setPropertyId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.area})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Number of Floors</Label>
                <Input
                  type="number"
                  min={1}
                  max={25}
                  value={numberOfFloors}
                  onChange={(e) => setNumberOfFloors(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select value={status} onValueChange={(val: Building['status']) => setStatus(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input
                placeholder="e.g. Executive wing with lift and rooftop cafeteria"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                {editingBuilding ? 'Update Building' : 'Save Building'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Building?"
        description="Are you sure you want to remove this building block? Rooms assigned to it should be relocated first."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </AppShell>
  );
}
