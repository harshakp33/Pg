import { Property, Building, Room, Bed } from '@/types/property';

export const initialProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Starlight Luxury Coliving',
    type: 'coliving',
    address: '142, 5th Main, 4th Block, Near Sony World Signal',
    city: 'Bengaluru',
    area: 'Koramangala',
    pincode: '560034',
    contactNumber: '+91 98450 12345',
    email: 'koramangala@starlightpg.in',
    managerName: 'Rajesh Kumar',
    status: 'active',
    totalFloors: 4,
    amenities: ['High Speed WiFi', 'Daily Housekeeping', '3-Time Meals', 'AC', 'Gym & Gaming', 'Biometric Access', 'Power Backup'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-01-15',
  },
  {
    id: 'prop-2',
    name: 'Greenfield Executive PG',
    type: 'mens_pg',
    address: '88, 14th Cross, 9th Main, Sector 2, Behind BDA Complex',
    city: 'Bengaluru',
    area: 'HSR Layout',
    pincode: '560102',
    contactNumber: '+91 98451 23456',
    email: 'hsr@greenfieldpg.com',
    managerName: 'Suresh Reddy',
    status: 'active',
    totalFloors: 3,
    amenities: ['High Speed WiFi', 'North/South Mess', 'Laundry Service', 'Lift', '24x7 Security', 'RO Drinking Water'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-04-10',
  },
  {
    id: 'prop-3',
    name: 'UrbanNest Women Luxury PG',
    type: 'womens_pg',
    address: '24, ITPL Main Road, Near Prestige Shantiniketan',
    city: 'Bengaluru',
    area: 'Whitefield',
    pincode: '560066',
    contactNumber: '+91 98452 34567',
    email: 'whitefield@urbannest.in',
    managerName: 'Kavitha Murthy',
    status: 'active',
    totalFloors: 4,
    amenities: ['Female Warden', 'CCTV & Biometric', 'Attached Balcony', 'Induction Kitchenette', 'High Speed WiFi', 'Washing Machines'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-08-20',
  },
  {
    id: 'prop-4',
    name: 'CyberHeights Tech PG',
    type: 'coliving',
    address: 'Plot 45, Cyber Park Road, Phase 1, Opposite Infosys Gate 2',
    city: 'Bengaluru',
    area: 'Electronic City',
    pincode: '560100',
    contactNumber: '+91 98453 45678',
    email: 'ecity@cyberheights.com',
    managerName: 'Venkatesh Rao',
    status: 'active',
    totalFloors: 3,
    amenities: ['Co-working Space', 'High Speed Fiber WiFi', 'Daily Cleaning', 'Recreation Room', 'Power Backup'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-11-05',
  }
];

export const initialBuildings: Building[] = [
  { id: 'bld-1', propertyId: 'prop-1', name: 'Main Wing', numberOfFloors: 4, description: 'Premium coliving wing with lift and rooftop lounge', status: 'active' },
  { id: 'bld-2', propertyId: 'prop-1', name: 'Annex Block', numberOfFloors: 3, description: 'Quiet executive rooms', status: 'active' },
  { id: 'bld-3', propertyId: 'prop-2', name: 'Tower A', numberOfFloors: 3, description: 'Men executive suites', status: 'active' },
  { id: 'bld-4', propertyId: 'prop-3', name: 'Sapphire Wing', numberOfFloors: 4, description: 'Secure women coliving building with warden desk', status: 'active' },
  { id: 'bld-5', propertyId: 'prop-4', name: 'Tech Block 1', numberOfFloors: 3, description: 'Modern rooms with workstation desks', status: 'active' },
];

export const initialRooms: Room[] = [
  // Starlight Koramangala
  { id: 'room-101', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-1', roomNumber: '101', floorNumber: 1, roomType: 'single', capacity: 1, baseRent: 18000, hasAttachedWashroom: true, hasBalcony: true, hasAc: true, status: 'occupied', description: 'Deluxe Private Suite with workstation and balcony' },
  { id: 'room-102', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-1', roomNumber: '102', floorNumber: 1, roomType: 'double', capacity: 2, baseRent: 13000, hasAttachedWashroom: true, hasBalcony: false, hasAc: true, status: 'occupied', description: 'Twin Sharing Room with AC and wardrobe' },
  { id: 'room-103', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-1', roomNumber: '103', floorNumber: 1, roomType: 'double', capacity: 2, baseRent: 12500, hasAttachedWashroom: true, hasBalcony: true, hasAc: false, status: 'available', description: 'Twin Sharing Room with road-facing balcony' },
  { id: 'room-201', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', roomNumber: '201', floorNumber: 2, roomType: 'triple', capacity: 3, baseRent: 9500, hasAttachedWashroom: true, hasBalcony: false, hasAc: false, status: 'occupied', description: 'Spacious Triple Sharing room with study tables' },
  { id: 'room-202', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', roomNumber: '202', floorNumber: 2, roomType: 'four_sharing', capacity: 4, baseRent: 8000, hasAttachedWashroom: true, hasBalcony: false, hasAc: false, status: 'available', description: 'Four Sharing budget executive room' },
  { id: 'room-301', propertyId: 'prop-1', buildingId: 'bld-2', floorId: 'flr-3', roomNumber: '301', floorNumber: 3, roomType: 'single', capacity: 1, baseRent: 17500, hasAttachedWashroom: true, hasBalcony: true, hasAc: true, status: 'maintenance', description: 'Single private room under repainting' },

  // Greenfield HSR Layout
  { id: 'room-gr-101', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-1', roomNumber: '101', floorNumber: 1, roomType: 'double', capacity: 2, baseRent: 11000, hasAttachedWashroom: true, hasBalcony: false, hasAc: true, status: 'occupied', description: 'HSR Double AC Room' },
  { id: 'room-gr-102', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-1', roomNumber: '102', floorNumber: 1, roomType: 'triple', capacity: 3, baseRent: 8500, hasAttachedWashroom: true, hasBalcony: false, hasAc: false, status: 'occupied', description: 'HSR Triple Room' },
  { id: 'room-gr-201', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-2', roomNumber: '201', floorNumber: 2, roomType: 'double', capacity: 2, baseRent: 10500, hasAttachedWashroom: true, hasBalcony: true, hasAc: false, status: 'available', description: 'Sunny balcony double room' },

  // UrbanNest Whitefield
  { id: 'room-un-101', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-1', roomNumber: '101', floorNumber: 1, roomType: 'single', capacity: 1, baseRent: 16000, hasAttachedWashroom: true, hasBalcony: true, hasAc: true, status: 'occupied', description: 'Studio single with pantry counter' },
  { id: 'room-un-102', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-1', roomNumber: '102', floorNumber: 1, roomType: 'double', capacity: 2, baseRent: 12000, hasAttachedWashroom: true, hasBalcony: false, hasAc: true, status: 'occupied', description: 'Double sharing with individual storage' },
  { id: 'room-un-201', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-2', roomNumber: '201', floorNumber: 2, roomType: 'triple', capacity: 3, baseRent: 9000, hasAttachedWashroom: true, hasBalcony: true, hasAc: false, status: 'available', description: 'Spacious triple with garden view' },

  // CyberHeights Electronic City
  { id: 'room-ch-101', propertyId: 'prop-4', buildingId: 'bld-5', floorId: 'flr-ch-1', roomNumber: '101', floorNumber: 1, roomType: 'single', capacity: 1, baseRent: 14000, hasAttachedWashroom: true, hasBalcony: false, hasAc: true, status: 'occupied', description: 'Quiet coder single room with ergonomic chair' },
  { id: 'room-ch-102', propertyId: 'prop-4', buildingId: 'bld-5', floorId: 'flr-ch-1', roomNumber: '102', floorNumber: 1, roomType: 'double', capacity: 2, baseRent: 9500, hasAttachedWashroom: true, hasBalcony: false, hasAc: false, status: 'available', description: 'Double room near workspace' },
];

export const initialBeds: Bed[] = [
  // Room 101 (Single)
  { id: 'bed-101-A', bedNumber: '101-A', roomId: 'room-101', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-1', monthlyRent: 18000, status: 'occupied', tenantId: 'tnt-1', tenantName: 'Rahul Sharma' },

  // Room 102 (Double)
  { id: 'bed-102-A', bedNumber: '102-A', roomId: 'room-102', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-1', monthlyRent: 13000, status: 'occupied', tenantId: 'tnt-2', tenantName: 'Amit Verma' },
  { id: 'bed-102-B', bedNumber: '102-B', roomId: 'room-102', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-1', monthlyRent: 13000, status: 'occupied', tenantId: 'tnt-3', tenantName: 'Karthik Nair' },

  // Room 103 (Double)
  { id: 'bed-103-A', bedNumber: '103-A', roomId: 'room-103', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-1', monthlyRent: 12500, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-103-B', bedNumber: '103-B', roomId: 'room-103', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-1', monthlyRent: 12500, status: 'reserved', tenantId: null, tenantName: 'Sneha Reddy (Reserved)' },

  // Room 201 (Triple)
  { id: 'bed-201-A', bedNumber: '201-A', roomId: 'room-201', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', monthlyRent: 9500, status: 'occupied', tenantId: 'tnt-4', tenantName: 'Vikram Singh' },
  { id: 'bed-201-B', bedNumber: '201-B', roomId: 'room-201', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', monthlyRent: 9500, status: 'occupied', tenantId: 'tnt-5', tenantName: 'Rohan Gupta' },
  { id: 'bed-201-C', bedNumber: '201-C', roomId: 'room-201', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', monthlyRent: 9500, status: 'available', tenantId: null, tenantName: null },

  // Room 202 (Four Sharing)
  { id: 'bed-202-A', bedNumber: '202-A', roomId: 'room-202', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', monthlyRent: 8000, status: 'occupied', tenantId: 'tnt-6', tenantName: 'Aditya Joshi' },
  { id: 'bed-202-B', bedNumber: '202-B', roomId: 'room-202', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', monthlyRent: 8000, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-202-C', bedNumber: '202-C', roomId: 'room-202', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', monthlyRent: 8000, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-202-D', bedNumber: '202-D', roomId: 'room-202', propertyId: 'prop-1', buildingId: 'bld-1', floorId: 'flr-2', monthlyRent: 8000, status: 'maintenance', tenantId: null, tenantName: null },

  // Room 301
  { id: 'bed-301-A', bedNumber: '301-A', roomId: 'room-301', propertyId: 'prop-1', buildingId: 'bld-2', floorId: 'flr-3', monthlyRent: 17500, status: 'maintenance', tenantId: null, tenantName: null },

  // Greenfield HSR Layout Beds
  { id: 'bed-gr-101-A', bedNumber: '101-A', roomId: 'room-gr-101', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-1', monthlyRent: 11000, status: 'occupied', tenantId: 'tnt-7', tenantName: 'Manish Tiwari' },
  { id: 'bed-gr-101-B', bedNumber: '101-B', roomId: 'room-gr-101', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-1', monthlyRent: 11000, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-gr-102-A', bedNumber: '102-A', roomId: 'room-gr-102', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-1', monthlyRent: 8500, status: 'occupied', tenantId: 'tnt-8', tenantName: 'Pranav Rao' },
  { id: 'bed-gr-102-B', bedNumber: '102-B', roomId: 'room-gr-102', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-1', monthlyRent: 8500, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-gr-102-C', bedNumber: '102-C', roomId: 'room-gr-102', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-1', monthlyRent: 8500, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-gr-201-A', bedNumber: '201-A', roomId: 'room-gr-201', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-2', monthlyRent: 10500, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-gr-201-B', bedNumber: '201-B', roomId: 'room-gr-201', propertyId: 'prop-2', buildingId: 'bld-3', floorId: 'flr-gr-2', monthlyRent: 10500, status: 'available', tenantId: null, tenantName: null },

  // UrbanNest Whitefield Beds
  { id: 'bed-un-101-A', bedNumber: '101-A', roomId: 'room-un-101', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-1', monthlyRent: 16000, status: 'occupied', tenantId: 'tnt-9', tenantName: 'Priya Patel' },
  { id: 'bed-un-102-A', bedNumber: '102-A', roomId: 'room-un-102', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-1', monthlyRent: 12000, status: 'occupied', tenantId: 'tnt-10', tenantName: 'Ananya Iyer' },
  { id: 'bed-un-102-B', bedNumber: '102-B', roomId: 'room-un-102', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-1', monthlyRent: 12000, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-un-201-A', bedNumber: '201-A', roomId: 'room-un-201', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-2', monthlyRent: 9000, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-un-201-B', bedNumber: '201-B', roomId: 'room-un-201', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-2', monthlyRent: 9000, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-un-201-C', bedNumber: '201-C', roomId: 'room-un-201', propertyId: 'prop-3', buildingId: 'bld-4', floorId: 'flr-un-2', monthlyRent: 9000, status: 'available', tenantId: null, tenantName: null },

  // CyberHeights Electronic City Beds
  { id: 'bed-ch-101-A', bedNumber: '101-A', roomId: 'room-ch-101', propertyId: 'prop-4', buildingId: 'bld-5', floorId: 'flr-ch-1', monthlyRent: 14000, status: 'occupied', tenantId: 'tnt-11', tenantName: 'Deepak Chawla' },
  { id: 'bed-ch-102-A', bedNumber: '102-A', roomId: 'room-ch-102', propertyId: 'prop-4', buildingId: 'bld-5', floorId: 'flr-ch-1', monthlyRent: 9500, status: 'available', tenantId: null, tenantName: null },
  { id: 'bed-ch-102-B', bedNumber: '102-B', roomId: 'room-ch-102', propertyId: 'prop-4', buildingId: 'bld-5', floorId: 'flr-ch-1', monthlyRent: 9500, status: 'available', tenantId: null, tenantName: null },
];
