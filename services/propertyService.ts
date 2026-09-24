import { Property, Building, Room, Bed } from '@/types/property';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { initialProperties, initialBuildings, initialRooms, initialBeds } from '@/data/properties';

export const propertyService = {
  getProperties: (): Property[] => {
    return getItem<Property[]>(STORAGE_KEYS.PROPERTIES, initialProperties);
  },

  getPropertyById: (id: string): Property | undefined => {
    const list = propertyService.getProperties();
    return list.find((p) => p.id === id);
  },

  createProperty: (data: Omit<Property, 'id' | 'createdAt'>): Property => {
    const list = propertyService.getProperties();
    const newProp: Property = {
      ...data,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setItem(STORAGE_KEYS.PROPERTIES, [newProp, ...list]);
    return newProp;
  },

  updateProperty: (id: string, updates: Partial<Property>): Property | null => {
    const list = propertyService.getProperties();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    setItem(STORAGE_KEYS.PROPERTIES, [...list]);
    return updated;
  },

  deleteProperty: (id: string): boolean => {
    const list = propertyService.getProperties();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;
    setItem(STORAGE_KEYS.PROPERTIES, filtered);
    return true;
  },

  // Buildings
  getBuildings: (propertyId?: string): Building[] => {
    const list = getItem<Building[]>(STORAGE_KEYS.BUILDINGS, initialBuildings);
    if (propertyId) return list.filter((b) => b.propertyId === propertyId);
    return list;
  },

  createBuilding: (data: Omit<Building, 'id'>): Building => {
    const list = propertyService.getBuildings();
    const newBld: Building = { ...data, id: `bld-${Date.now()}` };
    setItem(STORAGE_KEYS.BUILDINGS, [...list, newBld]);
    return newBld;
  },

  updateBuilding: (id: string, updates: Partial<Building>): Building | null => {
    const list = propertyService.getBuildings();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    setItem(STORAGE_KEYS.BUILDINGS, [...list]);
    return updated;
  },

  deleteBuilding: (id: string): boolean => {
    const list = propertyService.getBuildings();
    const filtered = list.filter((b) => b.id !== id);
    if (filtered.length === list.length) return false;
    setItem(STORAGE_KEYS.BUILDINGS, filtered);
    return true;
  },

  // Rooms
  getRooms: (propertyId?: string): Room[] => {
    const list = getItem<Room[]>(STORAGE_KEYS.ROOMS, initialRooms);
    if (propertyId) return list.filter((r) => r.propertyId === propertyId);
    return list;
  },

  getRoomById: (id: string): Room | undefined => {
    const list = propertyService.getRooms();
    return list.find((r) => r.id === id);
  },

  createRoom: (data: Omit<Room, 'id'>): Room => {
    const list = propertyService.getRooms();
    const newRoom: Room = { ...data, id: `room-${Date.now()}` };
    setItem(STORAGE_KEYS.ROOMS, [...list, newRoom]);

    // Automatically generate beds for this room based on capacity
    const beds = propertyService.getBeds();
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const newBeds: Bed[] = [];
    for (let i = 0; i < data.capacity; i++) {
      newBeds.push({
        id: `bed-${newRoom.id}-${letters[i]}`,
        bedNumber: `${data.roomNumber}-${letters[i]}`,
        roomId: newRoom.id,
        propertyId: data.propertyId,
        buildingId: data.buildingId,
        floorId: data.floorId,
        monthlyRent: data.baseRent,
        status: 'available',
        tenantId: null,
        tenantName: null,
      });
    }
    setItem(STORAGE_KEYS.BEDS, [...beds, ...newBeds]);

    return newRoom;
  },

  updateRoom: (id: string, updates: Partial<Room>): Room | null => {
    const list = propertyService.getRooms();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    setItem(STORAGE_KEYS.ROOMS, [...list]);
    return updated;
  },

  deleteRoom: (id: string): boolean => {
    const list = propertyService.getRooms();
    const filtered = list.filter((r) => r.id !== id);
    if (filtered.length === list.length) return false;
    setItem(STORAGE_KEYS.ROOMS, filtered);
    return true;
  },

  // Beds
  getBeds: (propertyId?: string): Bed[] => {
    const list = getItem<Bed[]>(STORAGE_KEYS.BEDS, initialBeds);
    if (propertyId) return list.filter((b) => b.propertyId === propertyId);
    return list;
  },

  getBedById: (id: string): Bed | undefined => {
    const list = propertyService.getBeds();
    return list.find((b) => b.id === id);
  },

  updateBedStatus: (
    id: string,
    status: Bed['status'],
    tenantId?: string | null,
    tenantName?: string | null
  ): Bed | null => {
    const list = propertyService.getBeds();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const updated: Bed = {
      ...list[idx],
      status,
      tenantId: tenantId !== undefined ? tenantId : list[idx].tenantId,
      tenantName: tenantName !== undefined ? tenantName : list[idx].tenantName,
    };
    list[idx] = updated;
    setItem(STORAGE_KEYS.BEDS, [...list]);
    return updated;
  },

  assignBed: (bedId: string, tenantId: string, tenantName: string): Bed | null => {
    return propertyService.updateBedStatus(bedId, 'occupied', tenantId, tenantName);
  },

  releaseBed: (bedId: string): Bed | null => {
    return propertyService.updateBedStatus(bedId, 'available', null, null);
  },

  reserveBed: (bedId: string, applicantName: string): Bed | null => {
    return propertyService.updateBedStatus(bedId, 'reserved', null, `${applicantName} (Reserved)`);
  },

  markBedMaintenance: (bedId: string): Bed | null => {
    return propertyService.updateBedStatus(bedId, 'maintenance', null, null);
  },
};
