"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BloodBankMap } from "@/components/blood-bank/blood-bank-map";
import { BloodInventory } from "@/components/blood-bank/blood-inventory";
import { EnquiryForm } from "@/components/blood-bank/enquiry-form";
import { BloodBank, BloodTypeInfo, bloodInventoryData, nearbyBloodBanks } from "@/constants/blood-bank";
import { Locate, Phone, Navigation, Info, Activity, Droplet, AlertCircle } from 'lucide-react';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return Number(d.toFixed(1));
};

export default function BloodBankPage() {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyResults, setNearbyResults] = useState<BloodBank[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Enable location to see blood banks near you");
  
  // Get user location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        toast({
          title: "Location Found",
          description: "We're showing blood banks near your location.",
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Failed to get your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };
  
  // Automatically try to get location when page loads
  useEffect(() => {
    getUserLocation();
  }, []);
  
  // Handle map component notifying us of nearby blood banks
  const handleNearbyBloodBanksUpdate = useCallback((results: BloodBank[]) => {
    console.log(`Received ${results.length} blood banks from map component`);
    
    if (!results || results.length === 0) {
      console.warn("No blood banks received from map component");
      setNearbyResults([]);
      setStatusMessage("No blood banks found. Please try again or check your connection.");
      return;
    }
    
    // First prioritize nearby blood banks (within 25km) for local city area
    const veryNearbyBanks = results.filter(bank => {
      if (typeof bank.distance !== 'number') return false;
      return bank.distance <= 25; // Very nearby (same city/locality)
    });
    
    // Then consider blood banks up to 50km away (wider city region)
    const nearbyBanks = results.filter(bank => {
      if (typeof bank.distance !== 'number') return false;
      return bank.distance <= 50; // Reasonable city/region area radius
    });
    
    console.log(`Found ${veryNearbyBanks.length} blood banks within 25km (local area)`);
    console.log(`Found ${nearbyBanks.length} blood banks within 50km (wider city region)`);
    
    // Determine which set of blood banks to show
    let banksToShow: BloodBank[] = [];
    let displayMessage = "";
    
    if (veryNearbyBanks.length >= 3) {
      // If we have at least 3 very nearby banks, show only those
      banksToShow = veryNearbyBanks;
      displayMessage = `Showing ${veryNearbyBanks.length} blood banks in your local area`;
    } else if (nearbyBanks.length >= 1) {
      // If we have banks within 50km, show those
      banksToShow = nearbyBanks;
      displayMessage = `Showing blood banks in your city and nearby areas (within 50km)`;
    } else {
      // If no nearby banks, show everything sorted by distance, limited to 10
      banksToShow = results
        .filter(bank => typeof bank.distance === 'number')
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
      
      if (banksToShow.length > 0) {
        const maxDistance = Math.max(...banksToShow.map(bank => bank.distance));
        displayMessage = `No blood banks found in your immediate area. Showing banks up to ${Math.ceil(maxDistance)}km away.`;
      } else {
        displayMessage = "No blood banks found nearby. Please try changing your location.";
      }
    }
    
    // Update the status message
    setStatusMessage(displayMessage);
    
    // Make sure each bank has a valid bloodTypes field
    const processedResults = banksToShow.map(bank => {
      // Ensure we have a valid bloodTypes object even if it's empty
      if (!bank.bloodTypes) {
        console.warn(`Blood bank ${bank.name} is missing bloodTypes`);
      }
      
      // Return the processed bank
      return {
        ...bank,
        bloodTypes: bank.bloodTypes || {},
        // Make sure we have a valid distance
        distance: typeof bank.distance === 'number' ? bank.distance : 0
      };
    });
    
    // Sort by distance to show closest first
    const sortedResults = [...processedResults].sort((a, b) => a.distance - b.distance);
    
    // Update state with the processed results
    setNearbyResults(sortedResults);
  }, []);
  
  // Open Google Maps directions
  const openDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };
  
  // Format phone number for call link
  const formatPhoneForCall = (phone: string) => {
    return phone.replace(/\s+/g, '');
  };
  
  return (
    <div className="flex flex-col gap-5 py-4 overflow-y-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-2 px-2">
        <h4 className="text-base1-semibold text-muted-foreground">Health Services</h4>
        <h1 className="text-heading2-semibold text-foreground">Blood Bank Locator</h1>
        <p className="text-muted-foreground">Find blood banks near you and check availability of blood types</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 px-2">
        <Card className="flex-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
              <Droplet className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Blood Banks</p>
              <h3 className="text-2xl font-bold">{nearbyResults.length || '0'}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Within Range</p>
              <h3 className="text-2xl font-bold">
                {userLocation && nearbyResults.length > 0 
                  ? `${Math.ceil(Math.max(...nearbyResults.map(b => b.distance)))} km` 
                  : 'N/A'}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emergency Access</p>
              <h3 className="text-2xl font-bold">
                {nearbyResults.filter(bank => bank.open).length || '0'} Open
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content - Map takes full width */}
      <div className="flex flex-col gap-4">
        {/* Top half - Full width Map */}
        <Card className="overflow-hidden border">
          <CardHeader className="pb-2 px-4 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Blood Banks Map</CardTitle>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={getUserLocation}
                disabled={isLoadingLocation}
              >
                <Locate className="h-4 w-4 mr-2" />
                {isLoadingLocation ? 'Finding location...' : 'Get my location'}
              </Button>
            </div>
            <CardDescription className="text-sm mt-2">
              View blood banks and hospitals on the map
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[450px] md:h-[500px]">
            <BloodBankMap 
              bloodBanks={nearbyBloodBanks}
              userLocation={userLocation}
              onNearbyBloodBanksUpdate={handleNearbyBloodBanksUpdate}
            />
          </CardContent>
        </Card>
        
        {/* Bottom half - 40% Blood Banks List and 60% Enquiry Form */}
        <div className="grid grid-cols-10 gap-4">
          {/* Blood Banks List - 40% width */}
          <div className="col-span-4">
            <Card className="border h-full">
              <CardHeader className="pt-4 pb-2 px-4">
                <CardTitle className="text-xl">Blood Banks Near You</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {nearbyResults.length > 0 
                    ? `${nearbyResults.length} blood banks found${userLocation ? ` within ${Math.ceil(Math.max(...nearbyResults.map(b => b.distance)))}km` : ''}`
                    : userLocation 
                      ? "No blood banks found in your area. Try allowing precise location or searching wider."
                      : "Enable location to see blood banks near you"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {nearbyResults.length > 0 ? (
                  <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-3">
                      {nearbyResults.map((bank) => (
                        <Card key={bank.id} className="overflow-hidden border shadow-xs">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-base">{bank.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{bank.address}</p>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${bank.open 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}>
                                {bank.open ? 'Open' : 'Closed'}
                              </div>
                            </div>
                            
                            {/* Distance indicator */}
                            <div className="mt-2 mb-2">
                              <div className="bg-muted/30 rounded-full h-1.5 w-full">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    bank.distance <= 5 ? 'bg-green-500 dark:bg-green-400' : 
                                    bank.distance <= 15 ? 'bg-blue-500 dark:bg-blue-400' :
                                    bank.distance <= 30 ? 'bg-amber-500 dark:bg-amber-400' :
                                    'bg-red-500 dark:bg-red-400'
                                  }`}
                                  style={{ width: `${Math.max(5, Math.min(100, 100 - (bank.distance * 2)))}%` }}
                                />
                              </div>
                              <p className="text-xs mt-1 flex justify-between">
                                <span className={`font-medium ${
                                  bank.distance <= 5 ? 'text-green-600 dark:text-green-500' : 
                                  bank.distance <= 15 ? 'text-blue-600 dark:text-blue-500' :
                                  bank.distance <= 30 ? 'text-amber-600 dark:text-amber-500' :
                                  'text-red-600 dark:text-red-500'
                                }`}>
                                  {bank.distance <= 5 ? 'Very nearby' : 
                                  bank.distance <= 15 ? 'Nearby' : 
                                  bank.distance <= 30 ? 'In your region' : 
                                  'Further away'} 
                                </span>
                                <span className="text-muted-foreground">{bank.distance} km</span>
                              </p>
                            </div>
                            
                            {bank.bloodTypes && Object.entries(bank.bloodTypes).length > 0 && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs font-medium mb-1">Available Blood Types:</p>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(bank.bloodTypes as Record<string, BloodTypeInfo>)
                                    .filter(([_, info]) => info && info.available)
                                    .map(([type, info]) => (
                                      <span 
                                        key={type} 
                                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                                      >
                                        {type}
                                      </span>
                                    ))}
                                  {Object.entries(bank.bloodTypes as Record<string, BloodTypeInfo>)
                                    .filter(([_, info]) => info && info.available).length === 0 && (
                                      <span className="text-xs text-muted-foreground">None available</span>
                                    )}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2 mt-3">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs flex-1"
                                onClick={() => window.open(`tel:${formatPhoneForCall(bank.phone)}`, '_blank')}
                              >
                                <Phone className="h-3 w-3 mr-1" /> Call
                              </Button>
                              <Button 
                                size="sm" 
                                className="text-xs flex-1"
                                onClick={() => openDirections(bank.latitude, bank.longitude)}
                              >
                                <Navigation className="h-3 w-3 mr-1" /> Directions
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 px-3 bg-muted/20 rounded-lg border-2 border-dashed">
                    <p className="text-muted-foreground">
                      {statusMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {userLocation ? "Please try allowing precise location or searching wider." : "Enable location to see blood banks near you."}
                    </p>
                    <Button 
                      className="mt-3" 
                      variant="outline" 
                      size="sm"
                      onClick={getUserLocation}
                      disabled={isLoadingLocation}
                    >
                      <Locate className="h-4 w-4 mr-1" />
                      {isLoadingLocation ? 'Finding...' : 'Get my location'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Enquiry Form - 60% width */}
          <div className="col-span-6">
            <Card className="border h-full">
              <CardHeader className="pt-4 pb-2 px-4">
                <CardTitle className="text-xl">Blood Enquiry</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Request or donate blood through this quick form
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <EnquiryForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 