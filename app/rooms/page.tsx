'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { DoorOpen, Plus, Search, BedDouble, ArrowRight, Trash2, Wind, Eye } from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { Room, RoomType } from '@/types/property';
import { useStorageState } from '@/hooks/useStorageState';
import { STORAGE_KEYS } from '@/lib/storage';
import { initialRooms } from '@/data/properties';
import { formatINR } from '@/lib/format';
import { toast } from 'sonner';

export default function RoomsPage() {
  const [rooms, setRooms] = useStorageState<Room[]>(STORAGE_KEYS.ROOMS, initialRooms);
  const properties = propertyService.getProperties();
  const buildings = propertyService.getBuildings();
  const beds = propertyService.getBeds();

  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [roomNumber, setRoomNumber] = useState('');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [buildingId, setBuildingId] = useState(buildings[0]?.id || '');
  const [floorNumber, setFloorNumber] = useState(1);
  const [roomType, setRoomType] = useState<RoomType>('double');
  const [baseRent, setBaseRent] = useState(12000);
  const [hasAc, setHasAc] = useState(true);
  const [hasAttachedWashroom, setHasAttachedWashroom] = useState(true);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [description, setDescription] = useState('');

  const getCapacityFromType = (type: RoomType): number => {
    switch (type) {
      case 'single': return 1;
      case 'double': return 2;
      case 'triple': return 3;
      case 'four_sharing': return 4;
      case 'five_sharing': return 5;
      case 'six_sharing': return 6;
      default: return 2;
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch = r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProp = propertyFilter === 'all' || r.propertyId === propertyFilter;
    const matchesType = typeFilter === 'all' || r.roomType === typeFilter;
    return matchesSearch && matchesProp && matchesType;
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || !propertyId) {
      toast.error('Please enter room number and select a property');
      return;
    }

    const capacity = getCapacityFromType(roomType);

    propertyService.createRoom({
      roomNumber,
      propertyId,
      buildingId: buildingId || buildings[0]?.id || 'bld-1',
      floorId: `flr-${floorNumber}`,
      floorNumber,
      roomType,
      capacity,
      baseRent,
      hasAc,
      hasAttachedWashroom,
      hasBalcony,
      status: 'available',
      description,
    });

    setIsAddOpen(false);
    toast.success(`Room ${roomNumber} created with ${capacity} auto-generated beds!`);
    setRoomNumber('');
    setDescription('');
  };

  const handleDeleteRoom = () => {
    if (deleteTargetId) {
      propertyService.deleteRoom(deleteTargetId);
      toast.success('Room removed');
      setDeleteTargetId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Rooms Directory"
        description="Comprehensive list of single, twin, triple, and multi-sharing rooms across floors."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Rooms' }]}
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Add Room</span>
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="h-9 text-xs w-48">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 text-xs w-44">
              <SelectValue placeholder="All Sharing Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sharing Types</SelectItem>
              <SelectItem value="single">Single Room</SelectItem>
              <SelectItem value="double">Double Sharing</SelectItem>
              <SelectItem value="triple">Triple Sharing</SelectItem>
              <SelectItem value="four_sharing">Four Sharing</SelectItem>
              <SelectItem value="five_sharing">Five Sharing</SelectItem>
              <SelectItem value="six_sharing">Six Sharing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Room Table / Grid */}
      {filteredRooms.length === 0 ? (
        <EmptyState
          title="No rooms found"
          description="Adjust your search criteria or register a new room configuration."
          actionLabel="Add Room"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground">
                <th className="p-3.5 font-semibold">Room #</th>
                <th className="p-3.5 font-semibold">Property & Wing</th>
                <th className="p-3.5 font-semibold">Floor</th>
                <th className="p-3.5 font-semibold">Room Type</th>
                <th className="p-3.5 font-semibold">Capacity</th>
                <th className="p-3.5 font-semibold">Occupancy</th>
                <th className="p-3.5 font-semibold">Rent / Bed</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRooms.map((room) => {
                const prop = properties.find((p) => p.id === room.propertyId);
                const bld = buildings.find((b) => b.id === room.buildingId);
                const roomBeds = beds.filter((b) => b.roomId === room.id);
                const occupiedCount = roomBeds.filter((b) => b.status === 'occupied').length;
                const availableCount = roomBeds.filter((b) => b.status === 'available').length;

                return (
                  <tr key={room.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      <Link href={`/rooms/${room.id}`} className="hover:underline text-primary flex items-center gap-1.5">
                        <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Room {room.roomNumber}</span>
                      </Link>
                    </td>
                    <td className="p-3.5">
                      <p className="font-medium text-foreground">{prop?.name || 'PG'}</p>
                      <p className="text-[10px] text-muted-foreground">{bld?.name || 'Main Wing'}</p>
                    </td>
                    <td className="p-3.5 font-medium text-foreground">
                      Floor {room.floorNumber}
                    </td>
                    <td className="p-3.5 capitalize font-medium text-foreground">
                      {room.roomType.replace('_', ' ')}
                    </td>
                    <td className="p-3.5 font-medium text-foreground">
                      {room.capacity} Beds
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-foreground">{occupiedCount} Occupied</span>
                      <span className="text-muted-foreground text-[10px]"> / {availableCount} Vacant</span>
                    </td>
                    <td className="p-3.5 font-bold text-foreground">
                      {formatINR(room.baseRent)}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={room.status} />
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <Link href={`/rooms/${room.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTargetId(room.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Room Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the room number, capacity, and rental rate. Beds will be auto-generated.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Room Number *</Label>
                <Input
                  required
                  placeholder="e.g. 104"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Floor Number</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Property Location *</Label>
                <Select value={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
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

              <div className="space-y-1">
                <Label className="text-xs">Room Sharing Type</Label>
                <Select value={roomType} onValueChange={(val: RoomType) => setRoomType(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Private (1 Bed)</SelectItem>
                    <SelectItem value="double">Double Sharing (2 Beds)</SelectItem>
                    <SelectItem value="triple">Triple Sharing (3 Beds)</SelectItem>
                    <SelectItem value="four_sharing">Four Sharing (4 Beds)</SelectItem>
                    <SelectItem value="five_sharing">Five Sharing (5 Beds)</SelectItem>
                    <SelectItem value="six_sharing">Six Sharing (6 Beds)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Base Monthly Rent (₹)</Label>
                <Input
                  type="number"
                  step={500}
                  value={baseRent}
                  onChange={(e) => setBaseRent(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="col-span-2 pt-2 flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAc}
                    onChange={(e) => setHasAc(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Air Conditioned (AC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAttachedWashroom}
                    onChange={(e) => setHasAttachedWashroom(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Attached Bathroom</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBalcony}
                    onChange={(e) => setHasBalcony(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Attached Balcony</span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Create Room & Beds
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Room?"
        description="Are you sure you want to delete this room? Associated beds will also be removed."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteRoom}
      />
    </AppShell>
  );
}
