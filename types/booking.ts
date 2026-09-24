import { RoomType } from './property';

export type ApplicationStatus = 'new' | 'contacted' | 'visit_scheduled' | 'approved' | 'rejected' | 'converted';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Application {
  id: string;
  applicantName: string;
  phone: string;
  email: string;
  preferredPropertyId: string;
  preferredRoomType: RoomType;
  budget: number;
  expectedMoveInDate: string;
  source: 'website' | 'walk_in' | 'referral' | 'google' | 'broker';
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. BKG-2024-001
  applicantName: string;
  phone: string;
  email: string;
  propertyId: string;
  roomId: string;
  bedId: string;
  moveInDate: string;
  tokenDeposit: number;
  monthlyRent: number;
  totalDeposit: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

export interface MoveInRecord {
  id: string;
  tenantId: string;
  propertyId: string;
  roomId: string;
  bedId: string;
  agreementDate: string;
  depositReceived: number;
  firstRentReceived: number;
  inventoryChecked: boolean;
  keysHandedOver: boolean;
  kycCompleted: boolean;
  remarks?: string;
}

export interface MoveOutRecord {
  id: string;
  tenantId: string;
  moveOutDate: string;
  reason: string;
  noticeGivenDate: string;
  outstandingRent: number;
  utilityDues: number;
  damageCharges: number;
  otherDeductions: number;
  depositAmount: number;
  finalRefundAmount: number;
  settlementStatus: 'pending' | 'refunded' | 'settled';
  settledAt?: string;
  settledBy?: string;
}
