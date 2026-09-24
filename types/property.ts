export type PropertyStatus = 'active' | 'inactive' | 'maintenance';
export type PropertyType = 'coliving' | 'mens_pg' | 'womens_pg' | 'luxury_pg';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  city: string;
  area: string;
  pincode: string;
  contactNumber: string;
  email: string;
  managerName: string;
  status: PropertyStatus;
  totalFloors: number;
  amenities: string[];
  image?: string;
  createdAt: string;
}

export interface Building {
  id: string;
  propertyId: string;
  name: string;
  numberOfFloors: number;
  description: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface Floor {
  id: string;
  buildingId: string;
  propertyId: string;
  floorNumber: number;
  name: string;
}

export type RoomType = 'single' | 'double' | 'triple' | 'four_sharing' | 'five_sharing' | 'six_sharing';

export interface Room {
  id: string;
  propertyId: string;
  buildingId: string;
  floorId: string;
  roomNumber: string;
  floorNumber: number;
  roomType: RoomType;
  capacity: number;
  baseRent: number;
  hasAttachedWashroom: boolean;
  hasBalcony: boolean;
  hasAc: boolean;
  status: 'available' | 'occupied' | 'maintenance';
  description?: string;
}

export type BedStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface Bed {
  id: string;
  bedNumber: string; // e.g., '101-A', '101-B'
  roomId: string;
  propertyId: string;
  buildingId: string;
  floorId: string;
  monthlyRent: number;
  status: BedStatus;
  tenantId?: string | null;
  tenantName?: string | null;
}
