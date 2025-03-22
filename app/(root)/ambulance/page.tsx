"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AmbulanceList } from '@/components/ambulance/ambulance-list';
import { nearbyAmbulanceServices as staticAmbulanceServices, AmbulanceService } from '@/constants/ambulance';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, PhoneCall, MapPin, LocateIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

// Function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Function to get the user's location
const getUserLocation = (): Promise<google.maps.LatLngLiteral> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  });
};

// Emergency Action Bar component
function EmergencyActionBar() {
  return (
    <Card className="bg-[#1a1a1a] border-red-800 mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-400">Emergency Helplines</h3>
              <p className="text-sm text-red-400/90">Call these numbers for immediate assistance</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => window.location.href = "tel:102"}
            >
              <PhoneCall className="h-4 w-4" /> 102 - Ambulance
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-red-800 text-red-400 hover:bg-red-900/30"
              onClick={() => window.location.href = "tel:108"}
            >
              <PhoneCall className="h-4 w-4" /> 108 - Emergency
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Important Guidelines component
function ImportantGuidelines() {
  return (
    <Card className="rounded-xl overflow-hidden border border-border">
      <div className="bg-card p-4 border-b border-border">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600/20 text-blue-500">
            <AlertTriangle className="h-3 w-3" />
          </span>
          Important Guidelines
        </h3>
      </div>
      
      <div className="p-4 space-y-5">
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600/20 text-red-500">
              <AlertTriangle className="h-3 w-3" />
            </span>
            When to Call an Ambulance
          </h4>
          <p className="text-sm text-foreground/80 ml-8">
            Call immediately for breathing difficulties, severe bleeding, chest pain, stroke symptoms, or major injuries.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M14 9l-5 5.5 5 5.5"></path>
                <path d="M9 9l-5 5.5L9 20"></path>
                <path d="M20 9l-5 5.5 5 5.5"></path>
              </svg>
            </span>
            Right of Way
          </h4>
          <p className="text-sm text-foreground/80 ml-8">
            Always give ambulances the right of way. Pull over safely to let them pass.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600/20 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </span>
            Basic First Aid
          </h4>
          <p className="text-sm text-foreground/80 ml-8">
            Learn basic CPR and first aid. The first few minutes are critical in emergencies.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600/20 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
            Response Time
          </h4>
          <p className="text-sm text-foreground/80 ml-8">
            Average ambulance response time is 8-15 minutes. Stay calm and provide clear information when calling.
          </p>
        </div>
      </div>
    </Card>
  );
}

// Function to get a city name from Google Maps API using reverse geocoding
const getUserCity = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }
    
    // Try to find the city name from address components
    for (const result of data.results) {
      for (const component of result.address_components) {
        if (
          component.types.includes('locality') || 
          component.types.includes('administrative_area_level_2')
        ) {
          return component.long_name;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting city name:', error);
    return null;
  }
};

// Function to filter ambulance services based on location
const getRelevantAmbulanceServices = (
  location: google.maps.LatLngLiteral,
  cityName: string | null,
  allServices: AmbulanceService[]
): AmbulanceService[] => {
  // Calculate distance for all services
  const servicesWithDistance = allServices.map(service => {
    const distance = calculateDistance(
      location.lat,
      location.lng,
      service.latitude,
      service.longitude
    );
    return { ...service, distance };
  });
  
  // Filter services either by city match or by distance (within 50km)
  let filteredServices = servicesWithDistance.filter(service => {
    // If we have city name, prefer services in the same city
    if (cityName && service.cityArea && service.cityArea.includes(cityName)) {
      return true;
    }
    
    // Otherwise include services within 50km
    return service.distance <= 50;
  });
  
  // If no services in the city or nearby, return all with distance
  if (filteredServices.length === 0) {
    filteredServices = servicesWithDistance;
  }
  
  // Sort by distance
  filteredServices.sort((a, b) => a.distance - b.distance);
  
  // Limit to 10 nearest services
  return filteredServices.slice(0, 10);
};

export default function AmbulancePage() {
  const { toast } = useToast();
  const [ambulanceServices, setAmbulanceServices] = useState<AmbulanceService[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('loading');
  const [cityName, setCityName] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Function to update ambulance services based on location
  const updateAmbulanceServices = useCallback(async (location: google.maps.LatLngLiteral) => {
    try {
      // Get city name for better filtering
      const city = await getUserCity(location.lat, location.lng);
      setCityName(city);
      
      // Get relevant ambulance services
      const services = getRelevantAmbulanceServices(
        location,
        city,
        staticAmbulanceServices
      );
      
      setAmbulanceServices(services);
    } catch (error) {
      console.error('Error updating ambulance services:', error);
      // Fallback to static data
      const servicesWithDistance = staticAmbulanceServices.map(service => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          service.latitude,
          service.longitude
        );
        return { ...service, distance };
      }).sort((a, b) => a.distance - b.distance);
      
      setAmbulanceServices(servicesWithDistance);
    }
  }, []);

  // Function to get user location and update services
  const getLocation = useCallback(async (showToast = false) => {
    setLocationStatus('loading');
    if (showToast) {
      setIsRefreshing(true);
    }
    
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      setLocationStatus('granted');
      
      // Update ambulance services with new location
      await updateAmbulanceServices(location);
      
      if (showToast) {
        toast({
          title: "Location updated",
          description: "Ambulance services have been refreshed based on your current location.",
        });
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationStatus('denied');
      
      // Show static ambulance services without location
      setAmbulanceServices(staticAmbulanceServices);
      
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Location access denied",
          description: "Please enable location services to find nearby ambulances.",
        });
        setIsRefreshing(false);
      }
    }
  }, [toast, updateAmbulanceServices]);

  // Get user location on component mount
  useEffect(() => {
    getLocation();
    
    // Set up a watch position to update location in real-time
    let watchId: number | null = null;
    
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Only update if location has changed significantly (more than 0.5km)
          if (userLocation) {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              newLocation.lat,
              newLocation.lng
            );
            
            if (distance > 0.5) {
              setUserLocation(newLocation);
              updateAmbulanceServices(newLocation);
            }
          } else {
            setUserLocation(newLocation);
            updateAmbulanceServices(newLocation);
          }
          setLocationStatus('granted');
        },
        (error) => {
          console.error('Error watching position:', error);
          setLocationStatus('denied');
        },
        { enableHighAccuracy: true }
      );
    }
    
    // Clean up watch position on unmount
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [getLocation, updateAmbulanceServices, userLocation]);

  // Handle refresh button click
  const handleRefreshLocation = () => {
    getLocation(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <EmergencyActionBar />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <div className="mb-3 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold mb-1 text-foreground">Ambulance Services</h2>
              <p className="text-foreground/80 text-sm">
                {cityName 
                  ? `Showing ambulances near ${cityName}`
                  : 'Find and contact nearby ambulance services for emergency medical transportation'}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshLocation}
              disabled={isRefreshing}
              className="h-8 gap-1"
            >
              <LocateIcon className="h-3.5 w-3.5" />
              {isRefreshing ? 'Updating...' : 'Update Location'}
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-300px)]">
            <AmbulanceList 
              ambulanceServices={ambulanceServices} 
              userLocation={userLocation}
              locationStatus={locationStatus}
            />
          </ScrollArea>
        </div>
        
        <div className="md:col-span-7">
          <ImportantGuidelines />
        </div>
      </div>
    </div>
  );
} 