import { Application, Booking, MoveInRecord, MoveOutRecord } from '@/types/booking';

export const initialApplications: Application[] = [
  {
    id: 'app-1',
    applicantName: 'Sneha Reddy',
    phone: '+91 97400 98765',
    email: 'sneha.reddy@gmail.com',
    preferredPropertyId: 'prop-1',
    preferredRoomType: 'double',
    budget: 13000,
    expectedMoveInDate: '2024-11-01',
    source: 'website',
    status: 'approved',
    notes: 'Works at Microsoft, prefers sunny balcony room',
    createdAt: '2024-10-10'
  },
  {
    id: 'app-2',
    applicantName: 'Arjun Nambiar',
    phone: '+91 98450 77889',
    email: 'arjun.nambiar@oracle.com',
    preferredPropertyId: 'prop-2',
    preferredRoomType: 'single',
    budget: 16000,
    expectedMoveInDate: '2024-11-05',
    source: 'google',
    status: 'visit_scheduled',
    notes: 'Scheduled physical visit for Saturday 4 PM',
    createdAt: '2024-10-14'
  },
  {
    id: 'app-3',
    applicantName: 'Megha Sharma',
    phone: '+91 98112 33445',
    email: 'megha.sharma@target.com',
    preferredPropertyId: 'prop-3',
    preferredRoomType: 'double',
    budget: 12000,
    expectedMoveInDate: '2024-11-10',
    source: 'referral',
    status: 'new',
    notes: 'Referred by Priya Patel (Room 101)',
    createdAt: '2024-10-18'
  },
  {
    id: 'app-4',
    applicantName: 'Vivek Kulkarni',
    phone: '+91 98860 11234',
    email: 'vivek.k@cisco.com',
    preferredPropertyId: 'prop-1',
    preferredRoomType: 'triple',
    budget: 10000,
    expectedMoveInDate: '2024-11-15',
    source: 'walk_in',
    status: 'contacted',
    notes: 'Followed up via WhatsApp, sent room video tour',
    createdAt: '2024-10-19'
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'bkg-1',
    bookingCode: 'BKG-2024-001',
    applicantName: 'Sneha Reddy',
    phone: '+91 97400 98765',
    email: 'sneha.reddy@gmail.com',
    propertyId: 'prop-1',
    roomId: 'room-103',
    bedId: 'bed-103-B',
    moveInDate: '2024-11-01',
    tokenDeposit: 5000,
    monthlyRent: 12500,
    totalDeposit: 25000,
    status: 'confirmed',
    createdAt: '2024-10-12',
    notes: 'Token paid via UPI, balance ₹20,000 deposit to be paid on move-in day.'
  },
  {
    id: 'bkg-2',
    bookingCode: 'BKG-2024-002',
    applicantName: 'Harish Sundaram',
    phone: '+91 98200 44556',
    email: 'harish.s@ey.com',
    propertyId: 'prop-2',
    roomId: 'room-gr-201',
    bedId: 'bed-gr-201-A',
    moveInDate: '2024-11-15',
    tokenDeposit: 3000,
    monthlyRent: 10500,
    totalDeposit: 21000,
    status: 'pending',
    createdAt: '2024-10-20',
    notes: 'Awaiting agreement signing'
  }
];

export const initialMoveIns: MoveInRecord[] = [
  {
    id: 'mvi-1',
    tenantId: 'tnt-1',
    propertyId: 'prop-1',
    roomId: 'room-101',
    bedId: 'bed-101-A',
    agreementDate: '2023-09-01',
    depositReceived: 36000,
    firstRentReceived: 18000,
    inventoryChecked: true,
    keysHandedOver: true,
    kycCompleted: true,
    remarks: 'Smooth move-in, welcome kit provided.'
  }
];

export const initialMoveOuts: MoveOutRecord[] = [
  {
    id: 'mvo-1',
    tenantId: 'tnt-5', // Rohan Gupta (notice period)
    moveOutDate: '2024-10-31',
    reason: 'Job relocation to Pune office',
    noticeGivenDate: '2024-09-15',
    outstandingRent: 9500,
    utilityDues: 800,
    damageCharges: 0,
    otherDeductions: 1000, // Deep cleaning
    depositAmount: 19000,
    finalRefundAmount: 7700,
    settlementStatus: 'pending',
  }
];
