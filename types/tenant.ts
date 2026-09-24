export type Gender = 'male' | 'female' | 'other';
export type KycStatus = 'pending' | 'verified' | 'rejected';
export type TenantStatus = 'active' | 'notice_period' | 'vacated' | 'suspended';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface KycDetails {
  status: KycStatus;
  aadhaarNumber?: string;
  aadhaarStatus: KycStatus;
  panNumber?: string;
  panStatus: KycStatus;
  idProofUrl?: string;
  addressProofUrl?: string;
  photoUrl?: string;
  policeVerificationStatus: 'pending' | 'completed' | 'not_required';
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface TenantDocument {
  id: string;
  title: string;
  type: 'aadhaar' | 'pan' | 'agreement' | 'police_form' | 'other';
  fileUrl: string;
  uploadedAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  actor: string;
}

export interface Tenant {
  id: string;
  tenantCode: string; // e.g. TNT-1001
  name: string;
  phone: string;
  email: string;
  gender: Gender;
  dob?: string;
  occupation?: string;
  companyOrCollege?: string;
  propertyId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  moveInDate: string;
  agreementEndDate?: string;
  noticePeriodDays: number;
  monthlyRent: number;
  securityDeposit: number;
  depositPaid: number;
  paymentStatus: 'paid' | 'pending' | 'partially_paid' | 'overdue';
  status: TenantStatus;
  emergencyContact: EmergencyContact;
  kyc: KycDetails;
  documents: TenantDocument[];
  activities: ActivityLog[];
  avatar?: string;
}
