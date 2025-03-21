// Blood type inventory data with availability status
export interface BloodTypeData {
  bloodType: string;
  available: boolean;
  quantity: number;
  lastUpdated: string;
}

// Interface for blood type info with quantity
export interface BloodTypeInfo {
  available: boolean;
  quantity: number;
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  phone: string;
  open: boolean;
  openHours: string;
  distance: number;
  latitude: number;
  longitude: number;
  bloodTypes?: Record<string, BloodTypeInfo>;
}

export const bloodInventoryData: BloodTypeData[] = [
  { 
    bloodType: "A+", 
    available: true, 
    quantity: 25, 
    lastUpdated: "2023-05-12" 
  },
  { 
    bloodType: "A-", 
    available: true, 
    quantity: 10, 
    lastUpdated: "2023-05-10" 
  },
  { 
    bloodType: "B+", 
    available: true, 
    quantity: 32, 
    lastUpdated: "2023-05-11" 
  },
  { 
    bloodType: "B-", 
    available: false, 
    quantity: 0, 
    lastUpdated: "2023-05-09" 
  },
  { 
    bloodType: "AB+", 
    available: true, 
    quantity: 15, 
    lastUpdated: "2023-05-12" 
  },
  { 
    bloodType: "AB-", 
    available: false, 
    quantity: 0, 
    lastUpdated: "2023-05-08" 
  },
  { 
    bloodType: "O+", 
    available: true, 
    quantity: 45, 
    lastUpdated: "2023-05-12" 
  },
  { 
    bloodType: "O-", 
    available: true, 
    quantity: 8, 
    lastUpdated: "2023-05-11" 
  }
];

// Static list of blood banks across India for fallback
export const nearbyBloodBanks: BloodBank[] = [
  // Jamshedpur specific blood banks
  {
    id: "bb-jamshedpur-1",
    name: "Jamshedpur Blood Bank",
    address: "R53J+PJ7, Blood Bank Building, Bistupur, Jamshedpur, Jharkhand 831001",
    phone: "+91 6572324456",
    open: true,
    openHours: "Open 24 hours",
    distance: 0,
    latitude: 22.7874,
    longitude: 86.1842,
    bloodTypes: {
      'A+': { available: true, quantity: 32 },
      'B+': { available: true, quantity: 45 },
      'O+': { available: true, quantity: 38 },
      'AB+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 8 },
      'B-': { available: true, quantity: 12 },
      'O-': { available: true, quantity: 10 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  {
    id: "bb-jamshedpur-2",
    name: "Blood Bank Division, Jamshedpur",
    address: "R5XR+8PQ, 0657 660 0607, Jamshedpur, Jharkhand 831001",
    phone: "+91 6576600607",
    open: true,
    openHours: "Open 24 hours",
    distance: 0,
    latitude: 22.8046,
    longitude: 86.2029,
    bloodTypes: {
      'A+': { available: true, quantity: 26 },
      'B+': { available: true, quantity: 32 },
      'O+': { available: true, quantity: 38 },
      'AB+': { available: false, quantity: 0 },
      'A-': { available: true, quantity: 6 },
      'B-': { available: true, quantity: 8 },
      'O-': { available: true, quantity: 10 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  {
    id: "bb-jamshedpur-3",
    name: "Redcliffe Labs - Blood Collection Center",
    address: "Kagal Market, Sakchi, Jamshedpur, Jharkhand 831001",
    phone: "+91 8448170041",
    open: false,
    openHours: "Closes soon • 8 AM to 8 PM",
    distance: 0,
    latitude: 22.7965,
    longitude: 86.2013,
    bloodTypes: {
      'A+': { available: true, quantity: 18 },
      'B+': { available: true, quantity: 22 },
      'O+': { available: true, quantity: 25 },
      'AB+': { available: true, quantity: 8 },
      'A-': { available: false, quantity: 0 },
      'B-': { available: true, quantity: 4 },
      'O-': { available: true, quantity: 6 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  {
    id: "bb-jamshedpur-4",
    name: "Indian Red Cross Society",
    address: "Bistupur, Jamshedpur, Jharkhand 831001",
    phone: "+91 6572211919",
    open: true,
    openHours: "9 AM - 6 PM",
    distance: 0,
    latitude: 22.7920,
    longitude: 86.1890,
    bloodTypes: {
      'A+': { available: true, quantity: 25 },
      'B+': { available: true, quantity: 35 },
      'O+': { available: true, quantity: 40 },
      'AB+': { available: true, quantity: 12 },
      'A-': { available: false, quantity: 0 },
      'B-': { available: true, quantity: 8 },
      'O-': { available: true, quantity: 10 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  // Delhi NCR region
  {
    id: "bb-1",
    name: "Lifeline Blood Bank - Delhi",
    address: "Block C, Connaught Place, New Delhi, Delhi 110001",
    phone: "+91 1123456789",
    open: true,
    openHours: "Open 24 hours",
    distance: 0,
    latitude: 28.6292,
    longitude: 77.2182,
    bloodTypes: {
      'A+': { available: true, quantity: 32 },
      'B+': { available: true, quantity: 45 },
      'O+': { available: true, quantity: 38 },
      'AB+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 8 },
      'B-': { available: true, quantity: 12 },
      'O-': { available: true, quantity: 10 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  {
    id: "bb-delhi-2",
    name: "AIIMS Blood Center",
    address: "AIIMS Campus, Ansari Nagar, New Delhi 110029",
    phone: "+91 1126588500",
    open: true,
    openHours: "Open 9 AM - 5 PM",
    distance: 0,
    latitude: 28.5672,
    longitude: 77.2100,
    bloodTypes: {
      'A+': { available: true, quantity: 45 },
      'B+': { available: true, quantity: 50 },
      'O+': { available: true, quantity: 60 },
      'AB+': { available: true, quantity: 25 },
      'A-': { available: true, quantity: 15 },
      'B-': { available: true, quantity: 18 },
      'O-': { available: true, quantity: 20 },
      'AB-': { available: true, quantity: 8 }
    }
  },
  {
    id: "bb-gurgaon-1",
    name: "Medanta Blood Bank",
    address: "CH Baktawar Singh Rd, Medanta, Gurugram, Haryana 122001",
    phone: "+91 1244141414",
    open: true,
    openHours: "Open 24 hours",
    distance: 0,
    latitude: 28.4395,
    longitude: 77.0266,
    bloodTypes: {
      'A+': { available: true, quantity: 38 },
      'B+': { available: true, quantity: 42 },
      'O+': { available: true, quantity: 50 },
      'AB+': { available: true, quantity: 18 },
      'A-': { available: true, quantity: 12 },
      'B-': { available: true, quantity: 14 },
      'O-': { available: true, quantity: 16 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  {
    id: "bb-noida-1",
    name: "Rotary Blood Bank",
    address: "Sector 12, Noida, Uttar Pradesh 201301",
    phone: "+91 1204284150",
    open: true,
    openHours: "9 AM - 6 PM",
    distance: 0,
    latitude: 28.5921,
    longitude: 77.3118,
    bloodTypes: {
      'A+': { available: true, quantity: 25 },
      'B+': { available: true, quantity: 35 },
      'O+': { available: true, quantity: 40 },
      'AB+': { available: true, quantity: 12 },
      'A-': { available: false, quantity: 0 },
      'B-': { available: true, quantity: 8 },
      'O-': { available: true, quantity: 10 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  
  // Mumbai region
  {
    id: "bb-2",
    name: "City Blood Center - Mumbai",
    address: "Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 2223456789",
    open: true,
    openHours: "9 AM - 9 PM",
    distance: 0,
    latitude: 19.0596,
    longitude: 72.8295,
    bloodTypes: {
      'A+': { available: true, quantity: 28 },
      'B+': { available: true, quantity: 35 },
      'O+': { available: true, quantity: 42 },
      'AB+': { available: true, quantity: 18 },
      'A-': { available: false, quantity: 0 },
      'B-': { available: true, quantity: 5 },
      'O-': { available: true, quantity: 7 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  {
    id: "bb-mumbai-2",
    name: "JJ Hospital Blood Bank",
    address: "JJ Marg, Nagpada, Mumbai, Maharashtra 400008",
    phone: "+91 2223735555",
    open: true,
    openHours: "24 hours",
    distance: 0,
    latitude: 18.9633,
    longitude: 72.8345,
    bloodTypes: {
      'A+': { available: true, quantity: 40 },
      'B+': { available: true, quantity: 45 },
      'O+': { available: true, quantity: 50 },
      'AB+': { available: true, quantity: 20 },
      'A-': { available: true, quantity: 15 },
      'B-': { available: true, quantity: 10 },
      'O-': { available: true, quantity: 12 },
      'AB-': { available: true, quantity: 5 }
    }
  },
  {
    id: "bb-thane-1",
    name: "Thane Blood Bank",
    address: "Gokhale Road, Thane West, Thane, Maharashtra 400602",
    phone: "+91 2225456789",
    open: false,
    openHours: "9 AM - 7 PM",
    distance: 0,
    latitude: 19.1943,
    longitude: 72.9615,
    bloodTypes: {
      'A+': { available: true, quantity: 20 },
      'B+': { available: true, quantity: 30 },
      'O+': { available: true, quantity: 35 },
      'AB+': { available: false, quantity: 0 },
      'A-': { available: true, quantity: 10 },
      'B-': { available: false, quantity: 0 },
      'O-': { available: true, quantity: 12 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  
  // Bangalore region
  {
    id: "bb-3",
    name: "RedCross Blood Bank - Bangalore",
    address: "MG Road, Bangalore, Karnataka 560001",
    phone: "+91 8023456789",
    open: true,
    openHours: "8 AM - 7 PM",
    distance: 0,
    latitude: 12.9716,
    longitude: 77.5946,
    bloodTypes: {
      'A+': { available: true, quantity: 30 },
      'B+': { available: true, quantity: 38 },
      'O+': { available: true, quantity: 45 },
      'AB+': { available: true, quantity: 12 },
      'A-': { available: true, quantity: 6 },
      'B-': { available: false, quantity: 0 },
      'O-': { available: true, quantity: 8 },
      'AB-': { available: true, quantity: 3 }
    }
  },
  {
    id: "bb-bangalore-2",
    name: "Victoria Hospital Blood Bank",
    address: "Fort Road, Krishna Rajendra Market, Bangalore 560002",
    phone: "+91 8026701150",
    open: true,
    openHours: "24 hours",
    distance: 0,
    latitude: 12.9634,
    longitude: 77.5855,
    bloodTypes: {
      'A+': { available: true, quantity: 42 },
      'B+': { available: true, quantity: 38 },
      'O+': { available: true, quantity: 50 },
      'AB+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 12 },
      'B-': { available: true, quantity: 10 },
      'O-': { available: true, quantity: 15 },
      'AB-': { available: true, quantity: 7 }
    }
  },
  {
    id: "bb-whitefield-1",
    name: "Whitefield Blood Donation Center",
    address: "Whitefield Main Road, Bangalore 560066",
    phone: "+91 8041231234",
    open: false,
    openHours: "9 AM - 6 PM",
    distance: 0,
    latitude: 12.9698,
    longitude: 77.7499,
    bloodTypes: {
      'A+': { available: true, quantity: 25 },
      'B+': { available: true, quantity: 30 },
      'O+': { available: true, quantity: 35 },
      'AB+': { available: false, quantity: 0 },
      'A-': { available: false, quantity: 0 },
      'B-': { available: true, quantity: 8 },
      'O-': { available: true, quantity: 10 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  
  // Chennai region
  {
    id: "bb-4",
    name: "Regional Blood Bank - Chennai",
    address: "Anna Salai, Chennai, Tamil Nadu 600002",
    phone: "+91 4423456789",
    open: true,
    openHours: "9 AM - 8 PM",
    distance: 0,
    latitude: 13.0827,
    longitude: 80.2707,
    bloodTypes: {
      'A+': { available: true, quantity: 25 },
      'B+': { available: true, quantity: 42 },
      'O+': { available: true, quantity: 36 },
      'AB+': { available: false, quantity: 0 },
      'A-': { available: true, quantity: 7 },
      'B-': { available: true, quantity: 9 },
      'O-': { available: true, quantity: 11 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  {
    id: "bb-chennai-2",
    name: "Apollo Blood Bank",
    address: "21 Greams Lane, Thousand Lights, Chennai 600006",
    phone: "+91 4428294203",
    open: true,
    openHours: "24 hours",
    distance: 0,
    latitude: 13.0614,
    longitude: 80.2569,
    bloodTypes: {
      'A+': { available: true, quantity: 35 },
      'B+': { available: true, quantity: 40 },
      'O+': { available: true, quantity: 45 },
      'AB+': { available: true, quantity: 20 },
      'A-': { available: true, quantity: 15 },
      'B-': { available: true, quantity: 12 },
      'O-': { available: true, quantity: 18 },
      'AB-': { available: true, quantity: 8 }
    }
  },
  
  // Hyderabad region
  {
    id: "bb-5",
    name: "City Blood Center - Hyderabad",
    address: "Banjara Hills, Hyderabad, Telangana 500034",
    phone: "+91 4023456789",
    open: false,
    openHours: "10 AM - 6 PM",
    distance: 0,
    latitude: 17.3850,
    longitude: 78.4867,
    bloodTypes: {
      'A+': { available: true, quantity: 15 },
      'B+': { available: true, quantity: 25 },
      'O+': { available: true, quantity: 32 },
      'AB+': { available: true, quantity: 11 },
      'A-': { available: false, quantity: 0 },
      'B-': { available: false, quantity: 0 },
      'O-': { available: true, quantity: 5 },
      'AB-': { available: true, quantity: 2 }
    }
  },
  {
    id: "bb-hyderabad-2",
    name: "Osmania Blood Bank",
    address: "Afzal Gunj, Hyderabad, Telangana 500012",
    phone: "+91 4024600122",
    open: true,
    openHours: "24 hours",
    distance: 0,
    latitude: 17.3781,
    longitude: 78.4802,
    bloodTypes: {
      'A+': { available: true, quantity: 30 },
      'B+': { available: true, quantity: 35 },
      'O+': { available: true, quantity: 40 },
      'AB+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 10 },
      'B-': { available: true, quantity: 12 },
      'O-': { available: true, quantity: 14 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  
  // Kolkata region
  {
    id: "bb-6",
    name: "Regional Blood Bank - Kolkata",
    address: "Park Street, Kolkata, West Bengal 700016",
    phone: "+91 3323456789",
    open: true,
    openHours: "8:30 AM - 7 PM",
    distance: 0,
    latitude: 22.5726,
    longitude: 88.3639,
    bloodTypes: {
      'A+': { available: true, quantity: 22 },
      'B+': { available: true, quantity: 35 },
      'O+': { available: true, quantity: 40 },
      'AB+': { available: true, quantity: 10 },
      'A-': { available: true, quantity: 5 },
      'B-': { available: true, quantity: 8 },
      'O-': { available: false, quantity: 0 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  {
    id: "bb-kolkata-2",
    name: "Central Blood Bank",
    address: "Maniktala, Kolkata, West Bengal 700054",
    phone: "+91 3323510619",
    open: true,
    openHours: "24 hours",
    distance: 0,
    latitude: 22.5852,
    longitude: 88.3776,
    bloodTypes: {
      'A+': { available: true, quantity: 32 },
      'B+': { available: true, quantity: 40 },
      'O+': { available: true, quantity: 45 },
      'AB+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 10 },
      'B-': { available: false, quantity: 0 },
      'O-': { available: true, quantity: 12 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  
  // Pune region
  {
    id: "bb-pune-1",
    name: "Jankalyan Blood Bank",
    address: "FC Road, Shivajinagar, Pune, Maharashtra 411005",
    phone: "+91 2025534353",
    open: true,
    openHours: "9 AM - 7 PM",
    distance: 0,
    latitude: 18.5236,
    longitude: 73.8478,
    bloodTypes: {
      'A+': { available: true, quantity: 28 },
      'B+': { available: true, quantity: 32 },
      'O+': { available: true, quantity: 40 },
      'AB+': { available: true, quantity: 12 },
      'A-': { available: true, quantity: 8 },
      'B-': { available: true, quantity: 10 },
      'O-': { available: true, quantity: 15 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  
  // Ahmedabad region
  {
    id: "bb-ahmedabad-1",
    name: "Civil Hospital Blood Bank",
    address: "Asarwa, Ahmedabad, Gujarat 380016",
    phone: "+91 7922682307",
    open: true,
    openHours: "24 hours",
    distance: 0,
    latitude: 23.0527,
    longitude: 72.6043,
    bloodTypes: {
      'A+': { available: true, quantity: 25 },
      'B+': { available: true, quantity: 30 },
      'O+': { available: true, quantity: 38 },
      'AB+': { available: false, quantity: 0 },
      'A-': { available: true, quantity: 10 },
      'B-': { available: true, quantity: 12 },
      'O-': { available: true, quantity: 15 },
      'AB-': { available: false, quantity: 0 }
    }
  },
  
  // Jaipur region
  {
    id: "bb-jaipur-1",
    name: "SMS Medical College Blood Bank",
    address: "JLN Marg, Jaipur, Rajasthan 302004",
    phone: "+91 1412518222",
    open: true,
    openHours: "24 hours",
    distance: 0,
    latitude: 26.9049,
    longitude: 75.8205,
    bloodTypes: {
      'A+': { available: true, quantity: 30 },
      'B+': { available: true, quantity: 35 },
      'O+': { available: true, quantity: 42 },
      'AB+': { available: true, quantity: 15 },
      'A-': { available: true, quantity: 12 },
      'B-': { available: true, quantity: 8 },
      'O-': { available: true, quantity: 10 },
      'AB-': { available: false, quantity: 0 }
    }
  }
]; 