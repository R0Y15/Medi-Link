export interface AmbulanceService {
  id: string;
  name: string;
  address: string;
  phone: string;
  available: boolean;
  operatingHours: string;
  distance: number;
  latitude: number;
  longitude: number;
  serviceType: 'government' | 'private' | 'ngo';
  services?: string[];
  emergencyResponse: boolean;
  cityArea?: string;
}

// Static list of ambulance services across India with focus on major cities
export const nearbyAmbulanceServices: AmbulanceService[] = [
  // Jamshedpur ambulance services
  {
    id: "amb-jamshedpur-1",
    name: "Tata Main Hospital Ambulance Service",
    address: "C Rd, Northern Town, Bistupur, Jamshedpur, Jharkhand 831001",
    phone: "+91 6572431101",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.7914,
    longitude: 86.1887,
    serviceType: 'private',
    services: ['Basic Life Support', 'Advanced Life Support', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Bistupur'
  },
  {
    id: "amb-jamshedpur-2",
    name: "MGM Hospital Ambulance",
    address: "Sakchi, Jamshedpur, Jharkhand 831001",
    phone: "+91 6572231051",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.8002,
    longitude: 86.2037,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Transport', 'Trauma Response'],
    emergencyResponse: true,
    cityArea: 'Sakchi'
  },
  {
    id: "amb-jamshedpur-3",
    name: "108 Emergency Service - Jamshedpur",
    address: "Jamshedpur, Jharkhand 831001",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.8015,
    longitude: 86.2029,
    serviceType: 'government',
    services: ['Emergency Response', 'Basic Life Support', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Jamshedpur'
  },
  {
    id: "amb-jamshedpur-4",
    name: "Red Cross Ambulance Service",
    address: "Bistupur, Jamshedpur, Jharkhand 831001",
    phone: "+91 6572211919",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.7920,
    longitude: 86.1890,
    serviceType: 'ngo',
    services: ['Basic Life Support', 'Patient Transport', 'Disaster Response'],
    emergencyResponse: true,
    cityArea: 'Bistupur'
  },
  {
    id: "amb-jamshedpur-5",
    name: "Mercy Hospital Ambulance",
    address: "NH-33, Baridih, Jamshedpur, Jharkhand 831017",
    phone: "+91 6572482304",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.8217,
    longitude: 86.2402,
    serviceType: 'private',
    services: ['Basic Life Support', 'Advanced Life Support', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Baridih'
  },
  
  // Delhi ambulance services
  {
    id: "amb-delhi-1",
    name: "CATS Ambulance Service",
    address: "Delhi",
    phone: "102",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 28.6139,
    longitude: 77.2090,
    serviceType: 'government',
    services: ['Basic Life Support', 'Advanced Life Support', 'Emergency Transport'],
    emergencyResponse: true,
    cityArea: 'All Delhi'
  },
  {
    id: "amb-delhi-2",
    name: "AIIMS Ambulance Service",
    address: "Ansari Nagar East, New Delhi, Delhi 110029",
    phone: "+91 1126588500",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 28.5672,
    longitude: 77.2100,
    serviceType: 'government',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'South Delhi'
  },
  {
    id: "amb-delhi-3",
    name: "108 Emergency Service - Delhi",
    address: "Delhi",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 28.6129,
    longitude: 77.2295,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Delhi'
  },
  
  // Additional Delhi services
  {
    id: "amb-delhi-4",
    name: "Fortis Hospital Ambulance Service",
    address: "Fortis Hospital, Sector 62, Noida, UP",
    phone: "+91 1204351095",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 28.6139,
    longitude: 77.3682,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Noida'
  },
  {
    id: "amb-delhi-5",
    name: "Max Hospital Ambulance",
    address: "Press Enclave Road, Saket, New Delhi, Delhi 110017",
    phone: "+91 1126515050",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 28.5272,
    longitude: 77.2193,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'South Delhi'
  },
  
  // Mumbai ambulance services
  {
    id: "amb-mumbai-1",
    name: "108 Emergency Service - Mumbai",
    address: "Mumbai, Maharashtra",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 19.0760,
    longitude: 72.8777,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Mumbai'
  },
  {
    id: "amb-mumbai-2",
    name: "Lilavati Hospital Ambulance",
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai 400050",
    phone: "+91 2226751000",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 19.0510,
    longitude: 72.8258,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Bandra'
  },
  {
    id: "amb-mumbai-3",
    name: "1298 Ambulance Service",
    address: "Mumbai, Maharashtra",
    phone: "1298",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 19.0760,
    longitude: 72.8777,
    serviceType: 'private',
    services: ['Basic Life Support', 'Advanced Life Support', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'All Mumbai'
  },
  
  // Additional Mumbai services
  {
    id: "amb-mumbai-4",
    name: "Nanavati Hospital Ambulance",
    address: "S.V. Road, Vile Parle West, Mumbai, Maharashtra 400056",
    phone: "+91 2243479999",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 19.0879,
    longitude: 72.8439,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Vile Parle'
  },
  {
    id: "amb-mumbai-5",
    name: "Hinduja Hospital Ambulance",
    address: "Veer Savarkar Marg, Mahim, Mumbai, Maharashtra 400016",
    phone: "+91 2224452222",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 19.0317,
    longitude: 72.8392,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Mahim'
  },
  
  // Bangalore ambulance services
  {
    id: "amb-bangalore-1",
    name: "108 Emergency Service - Bangalore",
    address: "Bangalore, Karnataka",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 12.9716,
    longitude: 77.5946,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Bangalore'
  },
  {
    id: "amb-bangalore-2",
    name: "Manipal Hospital Ambulance",
    address: "98, HAL Airport Road, Bengaluru, Karnataka 560017",
    phone: "+91 8025023800",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 12.9582,
    longitude: 77.6484,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'HAL Airport Road'
  },
  
  // Additional Bangalore services
  {
    id: "amb-bangalore-3",
    name: "Fortis Hospital Ambulance",
    address: "Bannerghatta Road, Bangalore, Karnataka 560076",
    phone: "+91 8066214444",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 12.8916,
    longitude: 77.5959,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Bannerghatta Road'
  },
  {
    id: "amb-bangalore-4",
    name: "Narayana Health Ambulance",
    address: "258/A, Bommasandra Industrial Area, Anekal Taluk, Bangalore, Karnataka 560099",
    phone: "+91 8067106510",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 12.8081,
    longitude: 77.6979,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Bommasandra'
  },
  
  // Chennai ambulance services
  {
    id: "amb-chennai-1",
    name: "108 Emergency Service - Chennai",
    address: "Chennai, Tamil Nadu",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 13.0827,
    longitude: 80.2707,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Chennai'
  },
  {
    id: "amb-chennai-2",
    name: "Apollo Hospitals Ambulance",
    address: "21, Greams Lane, Off Greams Road, Chennai 600006",
    phone: "+91 4428290200",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 13.0614,
    longitude: 80.2569,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Greams Road'
  },
  
  // Additional Chennai services
  {
    id: "amb-chennai-3",
    name: "Fortis Malar Hospital Ambulance",
    address: "52, 1st Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020",
    phone: "+91 4445890000",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 13.0023,
    longitude: 80.2526,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Adyar'
  },
  {
    id: "amb-chennai-4",
    name: "Stanley Medical College Hospital Ambulance",
    address: "Old Jail Road, Royapuram, Chennai, Tamil Nadu 600001",
    phone: "+91 4425281351",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 13.1011,
    longitude: 80.2923,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'Royapuram'
  },
  
  // Kolkata ambulance services
  {
    id: "amb-kolkata-1",
    name: "108 Emergency Service - Kolkata",
    address: "Kolkata, West Bengal",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.5726,
    longitude: 88.3639,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Kolkata'
  },
  {
    id: "amb-kolkata-2",
    name: "SSKM Hospital Ambulance",
    address: "244, AJC Bose Road, Kolkata 700020",
    phone: "+91 3322040122",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.5396,
    longitude: 88.3421,
    serviceType: 'government',
    services: ['Basic Life Support', 'Advanced Life Support', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'AJC Bose Road'
  },
  
  // Additional Kolkata services
  {
    id: "amb-kolkata-3",
    name: "AMRI Hospital Ambulance",
    address: "JC 16-17, Sector-III, Salt Lake City, Kolkata, West Bengal 700098",
    phone: "+91 3323212228",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.5842,
    longitude: 88.4185,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Salt Lake'
  },
  {
    id: "amb-kolkata-4",
    name: "Fortis Hospital Ambulance",
    address: "730, Anandapur, E.M. Bypass Road, Kolkata, West Bengal 700107",
    phone: "+91 3366284444",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 22.5128,
    longitude: 88.3986,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Anandapur'
  },
  
  // Add services for Pune
  {
    id: "amb-pune-1",
    name: "108 Emergency Service - Pune",
    address: "Pune, Maharashtra",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 18.5204,
    longitude: 73.8567,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Pune'
  },
  {
    id: "amb-pune-2",
    name: "Ruby Hall Clinic Ambulance",
    address: "40, Sassoon Road, Pune, Maharashtra 411001",
    phone: "+91 2026123391",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 18.5338,
    longitude: 73.8771,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Sassoon Road'
  },
  {
    id: "amb-pune-3",
    name: "Jehangir Hospital Ambulance",
    address: "32, Sassoon Road, Pune, Maharashtra 411001",
    phone: "+91 2026128500",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 18.5321,
    longitude: 73.8748,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Sassoon Road'
  },
  
  // Add services for Hyderabad
  {
    id: "amb-hyderabad-1",
    name: "108 Emergency Service - Hyderabad",
    address: "Hyderabad, Telangana",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 17.3850,
    longitude: 78.4867,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Hyderabad'
  },
  {
    id: "amb-hyderabad-2",
    name: "Apollo Hospital Ambulance",
    address: "Film Nagar, Jubilee Hills, Hyderabad, Telangana 500033",
    phone: "+91 4023607777",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 17.4138,
    longitude: 78.4071,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Jubilee Hills'
  },
  {
    id: "amb-hyderabad-3",
    name: "KIMS Hospital Ambulance",
    address: "1-8-31/1, Minister Road, Secunderabad, Telangana 500003",
    phone: "+91 4044885000",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 17.4400,
    longitude: 78.4982,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Secunderabad'
  },
  
  // Add services for Ahmedabad
  {
    id: "amb-ahmedabad-1",
    name: "108 Emergency Service - Ahmedabad",
    address: "Ahmedabad, Gujarat",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 23.0225,
    longitude: 72.5714,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Ahmedabad'
  },
  {
    id: "amb-ahmedabad-2",
    name: "Apollo Hospital Ambulance",
    address: "Plot No.1 A, Bhat, GIDC Estate, Gandhinagar, Gujarat 382428",
    phone: "+91 7966701800",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 23.0973,
    longitude: 72.6309,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Gandhinagar'
  },
  {
    id: "amb-ahmedabad-3",
    name: "Sterling Hospital Ambulance",
    address: "Sterling Hospital Road, Gurukul, Ahmedabad, Gujarat 380052",
    phone: "+91 7966868000",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 23.0467,
    longitude: 72.5416,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Gurukul'
  },
  
  // Add services for Chandigarh
  {
    id: "amb-chandigarh-1",
    name: "108 Emergency Service - Chandigarh",
    address: "Chandigarh",
    phone: "108",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 30.7333,
    longitude: 76.7794,
    serviceType: 'government',
    services: ['Basic Life Support', 'Emergency Response', 'Free Service'],
    emergencyResponse: true,
    cityArea: 'All Chandigarh'
  },
  {
    id: "amb-chandigarh-2",
    name: "PGIMER Ambulance Service",
    address: "Sector 12, Chandigarh, 160012",
    phone: "+91 1722756565",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 30.7659,
    longitude: 76.7764,
    serviceType: 'government',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Emergency Response'],
    emergencyResponse: true,
    cityArea: 'Sector 12'
  },
  {
    id: "amb-chandigarh-3",
    name: "Fortis Hospital Ambulance",
    address: "Fortis Hospital, Phase 8, Mohali, Punjab 160062",
    phone: "+91 1724692222",
    available: true,
    operatingHours: "24 hours",
    distance: 0,
    latitude: 30.7128,
    longitude: 76.7090,
    serviceType: 'private',
    services: ['Advanced Life Support', 'Critical Care Transport', 'Patient Transport'],
    emergencyResponse: true,
    cityArea: 'Mohali'
  },
]; 