import {
  Complaint,
  MaintenanceTask,
  Visitor,
  LeaveRequest,
  MealItem,
  Notice,
  Staff,
  StaffAttendanceRecord,
} from '@/types/operations';

export const initialComplaints: Complaint[] = [
  {
    id: 'cmp-1',
    ticketNumber: 'CMP-2024-101',
    tenantId: 'tnt-1', // Rahul Sharma
    propertyId: 'prop-1',
    roomId: 'room-101',
    category: 'internet',
    title: 'WiFi speed dropping during peak hours (8 PM - 11 PM)',
    description: 'Frequent latency spikes on 2nd floor access point during zoom video calls. Speed drops below 5 Mbps.',
    priority: 'medium',
    assignedStaffId: 'stf-3',
    assignedStaffName: 'Santosh Kumar (Maintenance)',
    status: 'in_progress',
    createdDate: '2024-10-18',
    dueDate: '2024-10-21',
    comments: [
      { id: 'cm-1', senderName: 'Rahul Sharma', role: 'Tenant', message: 'Checked router directly, issue seems to be with repeater mesh.', createdAt: '2024-10-18 20:30' },
      { id: 'cm-2', senderName: 'Santosh Kumar', role: 'Maintenance', message: 'Configured new dual-band AP channel today, monitoring speed test.', createdAt: '2024-10-19 11:15' }
    ]
  },
  {
    id: 'cmp-2',
    ticketNumber: 'CMP-2024-102',
    tenantId: 'tnt-2', // Amit Verma
    propertyId: 'prop-1',
    roomId: 'room-102',
    category: 'plumbing',
    title: 'Bathroom geyser takes too long to heat water',
    description: 'Water heating element seems to have calcification. Only lukewarm water available in morning.',
    priority: 'high',
    assignedStaffId: 'stf-3',
    assignedStaffName: 'Santosh Kumar (Maintenance)',
    status: 'assigned',
    createdDate: '2024-10-19',
    dueDate: '2024-10-21',
    comments: [
      { id: 'cm-3', senderName: 'Santosh Kumar', role: 'Maintenance', message: 'Electrician scheduled for Monday 10 AM replacement.', createdAt: '2024-10-20 09:00' }
    ]
  },
  {
    id: 'cmp-3',
    ticketNumber: 'CMP-2024-103',
    tenantId: 'tnt-4', // Vikram Singh
    propertyId: 'prop-1',
    roomId: 'room-201',
    category: 'cleaning',
    title: 'Balcony door glass cleaning requested',
    description: 'Dust accumulation after construction on adjoining plot.',
    priority: 'low',
    assignedStaffId: 'stf-4',
    assignedStaffName: 'Ramu (Housekeeper)',
    status: 'resolved',
    createdDate: '2024-10-14',
    dueDate: '2024-10-16',
    resolvedDate: '2024-10-15',
    resolutionRemarks: 'Balcony and windows thoroughly washed and wiped down.',
    comments: []
  },
  {
    id: 'cmp-4',
    ticketNumber: 'CMP-2024-104',
    tenantId: 'tnt-9', // Priya Patel
    propertyId: 'prop-3',
    roomId: 'room-un-101',
    category: 'electrical',
    title: 'Bedside reading lamp switch sparking slightly',
    description: 'Switch feels loose and made a slight spark noise when plugged in phone charger.',
    priority: 'critical',
    assignedStaffId: 'stf-6',
    assignedStaffName: 'Vikas Sharma (Electrician)',
    status: 'open',
    createdDate: '2024-10-20',
    dueDate: '2024-10-21',
    comments: []
  }
];

export const initialMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'mnt-1',
    taskNumber: 'MNT-2024-001',
    title: 'Room 301 Complete Repainting & Deep Clean',
    propertyId: 'prop-1',
    roomId: 'room-301',
    assignedStaffId: 'stf-3',
    assignedStaffName: 'Santosh Kumar',
    priority: 'medium',
    estimatedCost: 6500,
    status: 'in_progress',
    dueDate: '2024-10-25',
    description: 'Patch wall cracks, apply two coats of Asian Paints Royal White, polish wardrobe doors.'
  },
  {
    id: 'mnt-2',
    taskNumber: 'MNT-2024-002',
    title: 'Rooftop Water Tank UV Sterilization & Chlorination',
    propertyId: 'prop-1',
    assignedStaffId: 'stf-3',
    assignedStaffName: 'Santosh Kumar',
    priority: 'high',
    estimatedCost: 3500,
    status: 'open',
    dueDate: '2024-10-27',
    description: 'Quarterly hygienic water tank cleaning as per municipal safety guidelines.'
  },
  {
    id: 'mnt-3',
    taskNumber: 'MNT-2024-003',
    title: 'Lift AMC Quarterly Inspection & Greasing',
    propertyId: 'prop-1',
    assignedStaffId: 'stf-1',
    assignedStaffName: 'Rajesh Kumar',
    priority: 'critical',
    estimatedCost: 12000,
    actualCost: 12000,
    status: 'completed',
    dueDate: '2024-10-10',
    completedDate: '2024-10-09',
    description: 'KONE Elevator certified technician checked emergency brakes, sensor door alignment, and motor gearbox.'
  }
];

export const initialVisitors: Visitor[] = [
  {
    id: 'vis-1',
    visitorName: 'Nitin Agrawal',
    phone: '+91 98450 11992',
    tenantId: 'tnt-1', // Visiting Rahul
    propertyId: 'prop-1',
    purpose: 'College Friend / Discussion',
    entryTime: '2024-10-20 16:30',
    exitTime: null,
    idVerificationType: 'Driving License',
    idNumber: 'KA-01-2018-9988',
    status: 'inside'
  },
  {
    id: 'vis-2',
    visitorName: 'Sanjay Reddy',
    phone: '+91 97390 44556',
    tenantId: 'tnt-2', // Visiting Amit
    propertyId: 'prop-1',
    purpose: 'Document Delivery',
    entryTime: '2024-10-20 14:10',
    exitTime: '2024-10-20 15:00',
    idVerificationType: 'Aadhaar Card',
    status: 'checked_out'
  },
  {
    id: 'vis-3',
    visitorName: 'Sunita Verma',
    phone: '+91 94150 99887',
    tenantId: 'tnt-2', // Amit's mother
    propertyId: 'prop-1',
    purpose: 'Parent Visit',
    entryTime: '2024-10-18 10:00',
    exitTime: '2024-10-18 18:30',
    idVerificationType: 'Aadhaar Card',
    status: 'checked_out'
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'lev-1',
    tenantId: 'tnt-1', // Rahul Sharma
    propertyId: 'prop-1',
    startDate: '2024-10-29',
    endDate: '2024-11-04',
    reason: 'Diwali Festival celebration with family in Jaipur',
    status: 'approved',
    requestedAt: '2024-10-15',
    reviewedBy: 'Rajesh Kumar (Manager)',
    reviewedAt: '2024-10-16',
    reviewRemarks: 'Approved. Mess billing rebate applied for 6 days.'
  },
  {
    id: 'lev-2',
    tenantId: 'tnt-3', // Karthik Nair
    propertyId: 'prop-1',
    startDate: '2024-10-26',
    endDate: '2024-10-28',
    reason: 'Weekend trek to Chikmagalur',
    status: 'pending',
    requestedAt: '2024-10-19'
  }
];

export const weeklyFoodMenu: MealItem[] = [
  {
    id: 'm-mon',
    day: 'Monday',
    breakfast: 'Idli, Medu Vada, Coconut Chutney, Sambar, Tea/Coffee',
    lunch: 'Steamed Rice, Dal Tadka, Aloo Gobi Dry, Phulka, Curd, Pickle',
    dinner: 'Jeera Rice, Paneer Butter Masala, Roti, Mixed Salad, Gulab Jamun',
    specialNotes: 'Fresh fruit juice available on request'
  },
  {
    id: 'm-tue',
    day: 'Tuesday',
    breakfast: 'Aloo Paratha with Butter, Curd, Green Mint Chutney, Tea/Coffee',
    lunch: 'Veg Pulao, Rajma Masala, Roti, Cucumber Raita, Papad',
    dinner: 'Chapati, Mix Veg Curry, Moong Dal, Steamed Rice, Rasam, Kheer'
  },
  {
    id: 'm-wed',
    day: 'Wednesday',
    breakfast: 'Poha with Roasted Peanuts, Sev, Boiled Eggs / Banana, Tea/Coffee',
    lunch: 'Lemon Rice, Sambar, Bhindi Fry, Steamed Rice, Buttermilk',
    dinner: 'Chicken Curry / Kadai Paneer, Chapati, Ghee Rice, Dal Fry, Ice Cream',
    specialNotes: 'Non-veg (Chicken) & Paneer day'
  },
  {
    id: 'm-thu',
    day: 'Thursday',
    breakfast: 'Masala Dosa, Potato Palya, Tomato Chutney, Sambar, Tea/Coffee',
    lunch: 'Jeera Rice, Chole Masala, Bhature / Roti, Onion Salad, Boondi Raita',
    dinner: 'Phulka, Palak Paneer, Yellow Dal Fry, Rice, Curd'
  },
  {
    id: 'm-fri',
    day: 'Friday',
    breakfast: 'Poori Bhaji, Halwa, Pickle, Tea/Coffee',
    lunch: 'South Indian Thali: Rice, Drumstick Sambar, Cabbage Poriyal, Rasam, Curd',
    dinner: 'Veg / Egg Biryani, Mirchi Ka Salan, Raita, Sweet Paan',
    specialNotes: 'Biryani Special Night'
  },
  {
    id: 'm-sat',
    day: 'Saturday',
    breakfast: 'Upma with Coconut Chutney & Kesari Bath (Chow Chow Bath), Tea/Coffee',
    lunch: 'Khichdi, Kadhi Pakora, Roasted Papad, Achar, Ghee',
    dinner: 'Paneer Do Pyaza, Butter Naan / Tandoori Roti, Dal Makhani, Pulao'
  },
  {
    id: 'm-sun',
    day: 'Sunday',
    breakfast: 'Chole Bhature with Pickled Onions, Sweet Lassi, Tea/Coffee',
    lunch: 'Special Hyderabadi Chicken Dum Biryani / Paneer Dum Biryani, Salan, Raita, Shahi Tukda',
    dinner: 'Light Dinner: Khichdi, Tomato Soup, Garlic Toast, Steamed Veggies',
    specialNotes: 'Sunday Feast Lunch'
  }
];

export const initialNotices: Notice[] = [
  {
    id: 'not-1',
    noticeCode: 'NTC-2024-01',
    title: 'Festive Diwali Holidays & Mess Timings Update',
    content: 'Dear Residents, on occasion of Diwali (Oct 31 - Nov 02), special festive dinner will be served at 8:00 PM. Please update your leave applications on the app before Oct 25 to help the kitchen staff avoid food wastage.',
    propertyId: 'all',
    audience: 'all',
    priority: 'high',
    isPublished: true,
    publishedDate: '2024-10-15',
    expiryDate: '2024-11-03',
    authorName: 'Rajesh Kumar (Operations Manager)'
  },
  {
    id: 'not-2',
    noticeCode: 'NTC-2024-02',
    title: 'Gigabit Fiber Internet Upgrade Completed',
    content: 'All Wi-Fi Access Points across Floor 1, 2 and 3 have been upgraded to Wi-Fi 6 mesh routers. Password remains the same. If you experience dropouts, kindly submit a complaint ticket under Internet category.',
    propertyId: 'prop-1',
    audience: 'tenants',
    priority: 'medium',
    isPublished: true,
    publishedDate: '2024-10-10',
    authorName: 'Network Engineering Team'
  },
  {
    id: 'not-3',
    noticeCode: 'NTC-2024-03',
    title: 'Biometric Access Mandatory After 11:00 PM',
    content: 'For resident safety, the main gate will lock automatically at 11 PM. Entrance is strictly via biometric fingerprint or RFID keycards. Overnight guests must be registered at the security desk beforehand.',
    propertyId: 'all',
    audience: 'tenants',
    priority: 'high',
    isPublished: true,
    publishedDate: '2024-09-28',
    authorName: 'Head of Security'
  }
];

export const initialStaff: Staff[] = [
  {
    id: 'stf-1',
    staffCode: 'STF-01',
    name: 'Rajesh Kumar',
    phone: '+91 98450 12345',
    email: 'rajesh.k@starlightpg.in',
    role: 'manager',
    propertyId: 'prop-1',
    joiningDate: '2022-01-10',
    salary: 45000,
    status: 'active',
    shift: 'general'
  },
  {
    id: 'stf-2',
    staffCode: 'STF-02',
    name: 'Suresh Reddy',
    phone: '+91 98451 23456',
    email: 'suresh.r@greenfieldpg.com',
    role: 'warden',
    propertyId: 'prop-2',
    joiningDate: '2022-04-15',
    salary: 28000,
    status: 'active',
    shift: 'general'
  },
  {
    id: 'stf-3',
    staffCode: 'STF-03',
    name: 'Santosh Kumar',
    phone: '+91 98459 88771',
    email: 'santosh.tech@starlightpg.in',
    role: 'maintenance',
    propertyId: 'prop-1',
    joiningDate: '2022-08-01',
    salary: 24000,
    status: 'active',
    shift: 'day'
  },
  {
    id: 'stf-4',
    staffCode: 'STF-04',
    name: 'Ramu Gowda',
    phone: '+91 98459 33221',
    email: 'ramu@starlightpg.in',
    role: 'cleaner',
    propertyId: 'prop-1',
    joiningDate: '2023-01-05',
    salary: 16000,
    status: 'active',
    shift: 'day'
  },
  {
    id: 'stf-5',
    staffCode: 'STF-05',
    name: 'Mahesh Bahadur',
    phone: '+91 98459 66554',
    email: 'mahesh.sec@starlightpg.in',
    role: 'security',
    propertyId: 'prop-1',
    joiningDate: '2022-06-20',
    salary: 18000,
    status: 'active',
    shift: 'night'
  },
  {
    id: 'stf-6',
    staffCode: 'STF-06',
    name: 'Chef Bhimsen',
    phone: '+91 98459 11990',
    email: 'bhimsen.kitchen@starlightpg.in',
    role: 'cook',
    propertyId: 'prop-1',
    joiningDate: '2022-02-15',
    salary: 32000,
    status: 'active',
    shift: 'general'
  },
  {
    id: 'stf-7',
    staffCode: 'STF-07',
    name: 'Kavitha Murthy',
    phone: '+91 98452 34567',
    email: 'kavitha@urbannest.in',
    role: 'warden',
    propertyId: 'prop-3',
    joiningDate: '2023-08-15',
    salary: 30000,
    status: 'active',
    shift: 'general'
  }
];

export const initialStaffAttendance: StaffAttendanceRecord[] = [
  { id: 'att-1', staffId: 'stf-1', date: '2024-10-20', status: 'present', checkIn: '09:00', checkOut: '18:30' },
  { id: 'att-2', staffId: 'stf-2', date: '2024-10-20', status: 'present', checkIn: '08:45', checkOut: '19:00' },
  { id: 'att-3', staffId: 'stf-3', date: '2024-10-20', status: 'present', checkIn: '09:30', checkOut: '18:00' },
  { id: 'att-4', staffId: 'stf-4', date: '2024-10-20', status: 'present', checkIn: '07:30', checkOut: '16:00' },
  { id: 'att-5', staffId: 'stf-5', date: '2024-10-20', status: 'present', checkIn: '20:00', checkOut: '08:00' },
  { id: 'att-6', staffId: 'stf-6', date: '2024-10-20', status: 'present', checkIn: '06:00', checkOut: '21:30' },
  { id: 'att-7', staffId: 'stf-7', date: '2024-10-20', status: 'present', checkIn: '09:00', checkOut: '18:00' }
];
