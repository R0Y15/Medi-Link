export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  open: boolean;
  openHours: string;
  distance: number;
  latitude: number;
  longitude: number;
  category: 'government' | 'private' | 'specialty';
  services?: string[];
  emergencyServices: boolean;
}

// Static list of hospitals across India with focus on Jamshedpur
export const nearbyHospitals: Hospital[] = [
  // Jamshedpur hospitals
//   {
//     id: "hosp-jamshedpur-1",
//     name: "Tata Main Hospital",
//     address: "C Rd, Northern Town, Bistupur, Jamshedpur, Jharkhand 831001",
//     phone: "+91 6572431101",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 22.7914,
//     longitude: 86.1887, 
//     category: 'private',
//     services: ['Emergency', 'Surgery', 'OPD', 'Radiology', 'Pathology'],
//     emergencyServices: true
//   },
//   {
//     id: "hosp-jamshedpur-2",
//     name: "MGM Medical College and Hospital",
//     address: "Sakchi, Jamshedpur, Jharkhand 831001",
//     phone: "+91 6572231051",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 22.8002,
//     longitude: 86.2037,
//     category: 'government',
//     services: ['Emergency', 'Surgery', 'OPD', 'Trauma Center'],
//     emergencyServices: true
//   },
//   {
//     id: "hosp-jamshedpur-3",
//     name: "Kantilal Gandhi Memorial Hospital",
//     address: "Kasidih, Sakchi, Jamshedpur, Jharkhand 831001",
//     phone: "+91 6572543235",
//     open: true,
//     openHours: "Open 8 AM - 8 PM",
//     distance: 0,
//     latitude: 22.8021,
//     longitude: 86.1955,
//     category: 'private',
//     services: ['Surgery', 'OPD', 'Specialty Care'],
//     emergencyServices: false
//   },
//   {
//     id: "hosp-jamshedpur-4",
//     name: "Mercy Hospital",
//     address: "NH-33, Baridih, Jamshedpur, Jharkhand 831017",
//     phone: "+91 6572482304",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 22.8217,
//     longitude: 86.2402,
//     category: 'private',
//     services: ['Emergency', 'Surgery', 'Maternity', 'Pediatrics'],
//     emergencyServices: true
//   },
//   {
//     id: "hosp-jamshedpur-5",
//     name: "Tata Motors Hospital",
//     address: "Telco Colony, Jamshedpur, Jharkhand 831004",
//     phone: "+91 6576073100",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 22.7654,
//     longitude: 86.1760,
//     category: 'private',
//     services: ['Emergency', 'Surgery', 'OPD', 'Employee Healthcare'],
//     emergencyServices: true
//   },
  
//   // Delhi hospitals
//   {
//     id: "hosp-delhi-1",
//     name: "All India Institute of Medical Sciences (AIIMS)",
//     address: "Ansari Nagar East, New Delhi, Delhi 110029",
//     phone: "+91 1126588500",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 28.5672,
//     longitude: 77.2100,
//     category: 'government',
//     services: ['Emergency', 'Surgery', 'OPD', 'Specialty Care', 'Research'],
//     emergencyServices: true
//   },
  
//   // Mumbai hospitals
//   {
//     id: "hosp-mumbai-1",
//     name: "Lilavati Hospital",
//     address: "A-791, Bandra Reclamation, Bandra West, Mumbai 400050",
//     phone: "+91 2226751000",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 19.0510,
//     longitude: 72.8258,
//     category: 'private',
//     services: ['Emergency', 'Surgery', 'OPD', 'Specialty Care'],
//     emergencyServices: true
//   },
  
//   // Bangalore hospitals
//   {
//     id: "hosp-bangalore-1",
//     name: "Manipal Hospital",
//     address: "98, HAL Airport Road, Bengaluru, Karnataka 560017",
//     phone: "+91 8025023800",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 12.9582,
//     longitude: 77.6484,
//     category: 'private',
//     services: ['Emergency', 'Surgery', 'OPD', 'Specialty Care'],
//     emergencyServices: true
//   },
  
//   // Chennai hospitals
//   {
//     id: "hosp-chennai-1",
//     name: "Apollo Hospitals",
//     address: "21, Greams Lane, Off Greams Road, Chennai 600006",
//     phone: "+91 4428290200",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 13.0614,
//     longitude: 80.2569,
//     category: 'private',
//     services: ['Emergency', 'Surgery', 'OPD', 'Specialty Care'],
//     emergencyServices: true
//   },
  
//   // Kolkata hospitals
//   {
//     id: "hosp-kolkata-1",
//     name: "SSKM Hospital",
//     address: "244, AJC Bose Road, Kolkata 700020",
//     phone: "+91 3322040122",
//     open: true,
//     openHours: "Open 24 hours",
//     distance: 0,
//     latitude: 22.5396,
//     longitude: 88.3421,
//     category: 'government',
//     services: ['Emergency', 'Surgery', 'OPD', 'Specialty Care'],
//     emergencyServices: true
//   }
]; 