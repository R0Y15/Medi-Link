"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader, Libraries } from '@react-google-maps/api';
import { BloodBank, BloodTypeInfo, nearbyBloodBanks as staticBloodBanks, bloodInventoryData } from '@/constants/blood-bank';
// Keep this import for type compatibility
import { Hospital } from '@/constants/hospitals';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaAmbulance, FaHospital, FaHelicopter } from 'react-icons/fa';
import { GiKidneys } from 'react-icons/gi';

interface BloodBankMapProps {
  bloodBanks: BloodBank[];
  userLocation?: { lat: number; lng: number } | null;
  onNearbyBloodBanksUpdate?: (results: any[]) => void;
}

// Extended type for Blood Banks with additional metadata
interface ExtendedBloodBank extends BloodBank {
  source?: string;
  cityMatch?: boolean;
  cityName?: string;
}

// Extended type for Hospitals with additional metadata
interface ExtendedHospital extends Hospital {
  cityMatch?: boolean;
  cityName?: string;
  distance: number;
}

// Ensure we have a consistent type for static blood banks
interface StaticBloodBank extends Omit<BloodBank, 'bloodTypes'> {
  bloodTypes?: Record<string, BloodTypeInfo>;
  source?: string;
}

// Default center (Delhi, India)
const defaultCenter = { lat: 23.077, lng: 76.851 };

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  // Add Map ID for Advanced Markers
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || ''
};

// Define libraries array outside component to prevent re-rendering issues
const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'marker'];

// Define marker icons with absolute paths to ensure they're properly found
const MARKER_ICONS = {
  bloodBank: {
    standard: '/assets/marker-red.svg',
    important: '/assets/marker-important.svg',
    // Add alternative paths in case the file naming is causing issues
    standardAlt: '/assets/markerred.svg',
    importantAlt: '/assets/markerimportant.svg'
  },
  ambulance: '/assets/marker-ambulance.svg',
  ambulanceAlt: '/assets/markerambulance.svg',
  helicopter: '/assets/marker-helicopter.svg',
  helicopterAlt: '/assets/markerhelicopter.svg',
  // Add fallbacks in case the SVG files can't be loaded
  fallback: '/assets/hospital-marker.svg',
  fallbackAlt: '/assets/marker.svg'
};

export function BloodBankMap({ bloodBanks, userLocation, onNearbyBloodBanksUpdate }: BloodBankMapProps) {
  const [selectedBloodBank, setSelectedBloodBank] = useState<ExtendedBloodBank | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [nearbyBloodBanks, setNearbyBloodBanks] = useState<ExtendedBloodBank[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState<ExtendedHospital[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<ExtendedBloodBank | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [facilityType, setFacilityType] = useState<'bloodBank' | null>(null);
  const [placesLibrary, setPlacesLibrary] = useState<google.maps.PlacesLibrary | null>(null);
  const [markerLibrary, setMarkerLibrary] = useState<google.maps.MarkerLibrary | null>(null);
  
  // Add ref for tracking component mounting state
  const isMountedRef = useRef(true);
  
  // Load Google Maps API with marker library
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    // Ensure that Places API loads correctly
    version: "weekly",
    language: "en",
    nonce: undefined,
    // Disable CSP test to avoid net::ERR_BLOCKED_BY_CLIENT error
    preventGoogleFontsLoading: true,
  });
  
  // Track mounting state for cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Add a check for API key at the component level
  useEffect(() => {
    // Check if the API key is set
    console.log("Google Maps API key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "Set (correct)" : "Not set (problem)");
    console.log("Map ID:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ? "Set" : "Not set");
    
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is not set. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.");
      setSearchError("Google Maps API key is missing. Please check your environment configuration.");
    }
  }, []);

  // Load the Places and Marker libraries when Maps API is loaded
  useEffect(() => {
    if (!isLoaded) return;
    
    const loadLibraries = async () => {
      try {
        // Import the places library once the Maps API is loaded
        const placesLib = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        setPlacesLibrary(placesLib);
        
        // Import the marker library for Advanced Markers
        const markerLib = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        setMarkerLibrary(markerLib);
      } catch (error) {
        console.error("Error loading Google Maps libraries:", error);
      }
    };
    
    loadLibraries();
  }, [isLoaded]);
  
  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }, []);
  
  // Enhanced function to work with static data when Places API fails
  const getStaticBloodBanks = useCallback((userLat: number, userLng: number) => {
    return bloodBanks.map(bank => ({
      ...bank,
      distance: Number(calculateDistance(
        userLat,
        userLng,
        bank.latitude,
        bank.longitude
      ).toFixed(1)),
      source: 'static'
    })).sort((a, b) => a.distance - b.distance).filter(bank => bank.distance <= 100); // Show banks within 100km
  }, [bloodBanks, calculateDistance]);
  
  // Process static hospitals - kept for type compatibility but not used
  const getStaticHospitals = useCallback((userLat: number, userLng: number, cityName?: string): ExtendedHospital[] => {
    return [];
  }, []);
  
  // Main effect to update blood banks when user location changes
  useEffect(() => {
    if (!isLoaded || !bloodBanks.length || !userLocation) return;
    
    const updateBloodBanks = async () => {
      console.log("=== DEBUG: Starting updateBloodBanks function ===");
      setIsLoading(true);
      setSearchError(null);
      
      try {
        // First attempt to get location details using the Geocoder API
        let cityName = "";
        let administrativeArea = "";
        
        try {
          console.log("Getting location details from coordinates...", userLocation);
          const geocoder = new window.google.maps.Geocoder();
          const geocodeResponse = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode(
              { location: { lat: userLocation.lat, lng: userLocation.lng } },
              (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                  resolve(results);
                } else {
                  reject(`Geocoder failed: ${status}`);
                }
              }
            );
          });
          
          // Extract location information from geocode results
          if (geocodeResponse && geocodeResponse.length > 0) {
            console.log("Geocoder response:", geocodeResponse[0]);
            
            for (const component of geocodeResponse[0].address_components) {
              if (component.types.includes("locality")) {
                cityName = component.long_name;
              } else if (component.types.includes("administrative_area_level_1")) {
                administrativeArea = component.long_name;
              }
            }
            
            console.log(`Location context: ${cityName}, ${administrativeArea}`);
          }
        } catch (geocodeError) {
          console.warn("Failed to get city information:", geocodeError);
        }
        
        // Detect Jamshedpur or nearby area based on coordinates
        const isNearJamshedpur = 
          (userLocation.lat > 22.7 && userLocation.lat < 22.9 && 
           userLocation.lng > 86.1 && userLocation.lng < 86.3) ||
          cityName.toLowerCase().includes('jamshedpur') ||
          (administrativeArea.toLowerCase() === 'jharkhand' && 
           calculateDistance(userLocation.lat, userLocation.lng, 22.8046, 86.2029) < 50);
        
        if (isNearJamshedpur) {
          console.log("Location identified as Jamshedpur or nearby area");
          cityName = cityName || "Jamshedpur";
        }
        
        // Detect Indore or nearby area based on coordinates
        const isNearIndore = 
          (userLocation.lat > 22.65 && userLocation.lat < 22.85 && 
           userLocation.lng > 75.75 && userLocation.lng < 75.95) ||
          cityName.toLowerCase().includes('indore') ||
          (administrativeArea.toLowerCase() === 'madhya pradesh' && 
           calculateDistance(userLocation.lat, userLocation.lng, 22.7196, 75.8577) < 50);
        
        if (isNearIndore) {
          console.log("Location identified as Indore or nearby area");
          cityName = cityName || "Indore";
        }
        
        // Detect Bhopal or nearby area based on coordinates
        const isNearBhopal = 
          (userLocation.lat > 23.15 && userLocation.lat < 23.35 && 
           userLocation.lng > 77.35 && userLocation.lng < 77.55) ||
          cityName.toLowerCase().includes('bhopal') ||
          (administrativeArea.toLowerCase() === 'madhya pradesh' && 
           calculateDistance(userLocation.lat, userLocation.lng, 23.2599, 77.4126) < 50);
        
        if (isNearBhopal) {
          console.log("Location identified as Bhopal or nearby area");
          cityName = cityName || "Bhopal";
        }
        
        // Detect the user-provided special location (23.077°N 76.851°E)
        const isNearSpecialLocation = 
          calculateDistance(userLocation.lat, userLocation.lng, 23.077, 76.851) < 30; // Within 30km
        
        if (isNearSpecialLocation) {
          console.log("Location identified as near the special blood bank location");
          // If we don't have a more specific city name, use a generic name
          if (!cityName) {
            cityName = "Blood Services Center";
          }
        }
        
        // Detect Ujjain area based on coordinates
        const isNearUjjain = 
          (userLocation.lat > 23.15 && userLocation.lat < 23.22 && 
           userLocation.lng > 75.75 && userLocation.lng < 75.82) ||
          cityName.toLowerCase().includes('ujjain') ||
          (administrativeArea.toLowerCase() === 'madhya pradesh' && 
           calculateDistance(userLocation.lat, userLocation.lng, 23.1793, 75.7849) < 40);
        
        if (isNearUjjain) {
          console.log("Location identified as Ujjain or nearby area");
          cityName = cityName || "Ujjain";
        }
        
        // Detect Dewas area based on coordinates
        const isNearDewas = 
          (userLocation.lat > 22.95 && userLocation.lat < 23.00 && 
           userLocation.lng > 76.02 && userLocation.lng < 76.08) ||
          cityName.toLowerCase().includes('dewas') ||
          (administrativeArea.toLowerCase() === 'madhya pradesh' && 
           calculateDistance(userLocation.lat, userLocation.lng, 22.9676, 76.0534) < 35);
        
        if (isNearDewas) {
          console.log("Location identified as Dewas or nearby area");
          cityName = cityName || "Dewas";
        }
        
        // Update userCity state when we have a city name
        if (cityName) {
          setUserCity(cityName);
        }
        
        // Try to search for nearby blood banks using the new Places API
        const center = new google.maps.LatLng(userLocation.lat, userLocation.lng);
        let placesResults: ExtendedBloodBank[] = [];
        
        // Try to use the new Places API if available
        if (window.google && window.google.maps && placesLibrary && placesLibrary.Place) {
          try {
            console.log("Searching for blood banks using new Places API...");
            
            // Set search radius based on detected city
            const searchRadius = 
              (isNearJamshedpur || isNearIndore || isNearBhopal || isNearSpecialLocation || 
               isNearUjjain || isNearDewas) ? 8000 : 5000; // Larger radius for specific cities
            
            console.log(`Using search radius of ${searchRadius}m for ${cityName || "unknown location"}`);
            
            // Search for blood banks
            const bloodBankRequest = {
              fields: ['displayName', 'formattedAddress', 'location', 'id', 'types', 'businessStatus', 'openingHours'],
              locationRestriction: {
                center: center,
                radius: searchRadius, // Dynamic radius based on city
              },
              includedPrimaryTypes: ['blood_bank', 'medical_lab'],
              maxResultCount: 20,
              rankPreference: google.maps.places.SearchNearbyRankPreference.DISTANCE
            };
            
            console.log("DEBUG: Blood bank search includes types:", bloodBankRequest.includedPrimaryTypes);
            console.log("Sending blood bank search request:", bloodBankRequest);
            
            // Use the new searchNearby method
            const { places: bloodBankPlaces } = await placesLibrary.Place.searchNearby(bloodBankRequest);
            
            console.log("Found blood bank places:", bloodBankPlaces);
            
            if (bloodBankPlaces && bloodBankPlaces.length > 0) {
              // Convert Places API results to our ExtendedBloodBank format
              placesResults = await Promise.all(bloodBankPlaces.map(async (place) => {
                // Try to fetch more details about each place
                try {
                  await place.fetchFields({ 
                    fields: ['displayName', 'formattedAddress', 'location', 'types', 'id', 'businessStatus', 'openingHours', 'nationalPhoneNumber']
                  });
                } catch (detailsError) {
                  console.warn(`Could not fetch details for ${place.displayName}:`, detailsError);
                }
                
                const placeLocation = place.location as google.maps.LatLng;
                
                return {
                  id: place.id || `place-${Math.random().toString(36).substr(2, 9)}`,
                  name: place.displayName || "Unknown Blood Bank",
                  address: place.formattedAddress || "",
                  phone: place.nationalPhoneNumber || "",
                  open: place.businessStatus === "OPERATIONAL",
                  openHours: place.openingHours?.weekdayDescriptions?.join(", ") || "Hours not available",
                  distance: calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    placeLocation.lat(),
                    placeLocation.lng()
                  ),
                  latitude: placeLocation.lat(),
                  longitude: placeLocation.lng(),
                  source: 'places',
                  cityMatch: cityName ? (
                    (place.formattedAddress || "").toLowerCase().includes(cityName.toLowerCase()) ||
                    // Special checks for Indore
                    (cityName.toLowerCase() === 'indore' && (
                      (place.formattedAddress || "").toLowerCase().includes('m.y. hospital') ||
                      (place.formattedAddress || "").toLowerCase().includes('maharaja yeshwantrao') ||
                      (place.displayName || "").toLowerCase().includes('maharaja') ||
                      (place.formattedAddress || "").toLowerCase().includes('m p')
                    )) ||
                    // Special checks for Bhopal
                    (cityName.toLowerCase() === 'bhopal' && (
                      (place.formattedAddress || "").toLowerCase().includes('aiims') ||
                      (place.formattedAddress || "").toLowerCase().includes('hamidia') ||
                      (place.displayName || "").toLowerCase().includes('hamidia') ||
                      (place.formattedAddress || "").toLowerCase().includes('m p')
                    )) ||
                    // Special checks for Jamshedpur
                    (cityName.toLowerCase() === 'jamshedpur' && (
                      (place.formattedAddress || "").toLowerCase().includes('tata') ||
                      (place.formattedAddress || "").toLowerCase().includes('jharkhand') ||
                      (place.displayName || "").toLowerCase().includes('tata')
                    )) ||
                    // Special checks for Ujjain
                    (cityName.toLowerCase() === 'ujjain' && (
                      (place.formattedAddress || "").toLowerCase().includes('rd gardi') ||
                      (place.formattedAddress || "").toLowerCase().includes('district hospital') ||
                      (place.displayName || "").toLowerCase().includes('gardi') ||
                      (place.formattedAddress || "").toLowerCase().includes('madhya pradesh') ||
                      (place.formattedAddress || "").toLowerCase().includes('m p')
                    )) ||
                    // Special checks for Dewas
                    (cityName.toLowerCase() === 'dewas' && (
                      (place.formattedAddress || "").toLowerCase().includes('district hospital') ||
                      (place.displayName || "").toLowerCase().includes('civil hospital') ||
                      (place.formattedAddress || "").toLowerCase().includes('madhya pradesh') ||
                      (place.formattedAddress || "").toLowerCase().includes('m p')
                    ))
                  ) : false,
                  bloodTypes: { 
                    // Default empty blood types - we don't know from Places API
                    'A+': { available: false, quantity: 0 },
                    'B+': { available: false, quantity: 0 },
                    'O+': { available: false, quantity: 0 },
                    'AB+': { available: false, quantity: 0 },
                    'A-': { available: false, quantity: 0 },
                    'B-': { available: false, quantity: 0 },
                    'O-': { available: false, quantity: 0 },
                    'AB-': { available: false, quantity: 0 }
                  }
                };
              }));
              
              console.log("Converted blood bank places:", placesResults);
            }
          } catch (placesError) {
            console.error("Error using Places API:", placesError);
            // Continue with static data fallback
          }
        } else {
          console.warn("New Places API not available, using static data only");
        }
        
        // Process static blood banks
        const staticBanksWithDistance = staticBloodBanks.map(bank => {
            const distance = Number(calculateDistance(
              userLocation.lat,
              userLocation.lng,
              bank.latitude,
              bank.longitude
            ).toFixed(1));
            
            return {
              ...bank,
              distance,
              source: 'static',
              cityMatch: cityName ? (
                bank.address.toLowerCase().includes(cityName.toLowerCase()) ||
                // Special checks for Indore
                (cityName.toLowerCase() === 'indore' && (
                  bank.address.toLowerCase().includes('m.y. hospital') ||
                  bank.address.toLowerCase().includes('maharaja yeshwantrao') ||
                  bank.name.toLowerCase().includes('maharaja') ||
                  bank.address.toLowerCase().includes('m p')
                )) ||
                // Special checks for Bhopal
                (cityName.toLowerCase() === 'bhopal' && (
                  bank.address.toLowerCase().includes('aiims') ||
                  bank.address.toLowerCase().includes('hamidia') ||
                  bank.name.toLowerCase().includes('hamidia') ||
                  bank.address.toLowerCase().includes('m p')
                )) ||
                // Special checks for Jamshedpur
                (cityName.toLowerCase() === 'jamshedpur' && (
                  bank.address.toLowerCase().includes('tata') ||
                  bank.address.toLowerCase().includes('jharkhand') ||
                  bank.name.toLowerCase().includes('tata')
                )) ||
                // Special checks for Ujjain
                (cityName.toLowerCase() === 'ujjain' && (
                  bank.address.toLowerCase().includes('rd gardi') ||
                  bank.address.toLowerCase().includes('district hospital') ||
                  bank.name.toLowerCase().includes('gardi') ||
                  bank.address.toLowerCase().includes('madhya pradesh') ||
                  bank.address.toLowerCase().includes('m p')
                )) ||
                // Special checks for Dewas
                (cityName.toLowerCase() === 'dewas' && (
                  bank.address.toLowerCase().includes('district hospital') ||
                  bank.name.toLowerCase().includes('civil hospital') ||
                  bank.address.toLowerCase().includes('madhya pradesh') ||
                  bank.address.toLowerCase().includes('m p')
                ))
              ) : false,
            };
        }).sort((a, b) => a.distance - b.distance);
        
        console.log(`DEBUG: Found ${staticBanksWithDistance.length} static blood banks`);
        
        // Combine Places API results with static data
        let combinedBanks = [...placesResults];
        
        // Add static banks that don't duplicate places results
        staticBanksWithDistance.forEach(staticBank => {
          // Check if this static bank might be a duplicate of a Places API result
          const isDuplicate = combinedBanks.some(existingBank => 
            calculateDistance(staticBank.latitude, staticBank.longitude, existingBank.latitude, existingBank.longitude) < 0.2
          );
          
          if (!isDuplicate) {
            combinedBanks.push(staticBank);
          }
        });
        
        // Sort by distance
        combinedBanks = combinedBanks.sort((a, b) => a.distance - b.distance);
        
        console.log(`DEBUG: Final combined banks count: ${combinedBanks.length}`);
        
        // Filter blood banks by city or distance
        const citySpecificBanks = cityName 
          ? combinedBanks.filter(bank => bank.cityMatch)
          : [];
          
        // Use a larger radius for specific cities
        const nearbyDistanceThreshold = 
          (isNearJamshedpur || isNearIndore || isNearBhopal || isNearSpecialLocation || 
           isNearUjjain || isNearDewas) ? 60 : 50;
        
        console.log(`Using nearby distance threshold of ${nearbyDistanceThreshold}km for ${cityName || "unknown location"}`);
        
        const nearbyBanks = combinedBanks.filter(bank => bank.distance <= nearbyDistanceThreshold);
        
        // Select final blood banks to display
        let finalBanks = [];
        if (citySpecificBanks.length > 0) {
          finalBanks = [...citySpecificBanks];
          // Add nearby banks that are not city-specific
          const extraBanks = nearbyBanks.filter(
            bank => !citySpecificBanks.some(cityBank => cityBank.id === bank.id)
          ).slice(0, 10); // Limit to 10 additional banks
          finalBanks = [...finalBanks, ...extraBanks];
        } else {
          finalBanks = nearbyBanks;
        }
        
        console.log(`DEBUG: Final blood banks to display: ${finalBanks.length}`);
        
        // Update state with the static data
        if (isMountedRef.current) {
          setNearbyBloodBanks(finalBanks);
          // Set empty array for hospitals to ensure none are displayed
          setNearbyHospitals([]);
          
          if (onNearbyBloodBanksUpdate) {
            onNearbyBloodBanksUpdate(finalBanks);
          }
          
          // Set message
          if (cityName) {
            // Special message for our target cities
            if (cityName.toLowerCase() === 'indore' || 
                cityName.toLowerCase() === 'bhopal' || 
                cityName.toLowerCase() === 'jamshedpur' ||
                cityName.toLowerCase() === 'ujjain' ||
                cityName.toLowerCase() === 'dewas' ||
                isNearSpecialLocation) {
              
              const banksInCity = finalBanks.filter(bank => bank.cityMatch).length;
              const totalBanks = finalBanks.length;
              
              if (banksInCity > 0) {
                if (isNearSpecialLocation) {
                  setSearchError(`Found ${banksInCity} blood banks near the central blood services location and ${totalBanks - banksInCity} in surrounding areas.`);
                } else {
                  setSearchError(`Found ${banksInCity} blood banks in ${cityName} and ${totalBanks - banksInCity} in nearby areas.`);
                }
              } else {
                if (isNearSpecialLocation) {
                  setSearchError(`Showing blood banks near the central blood services location. This area has enhanced coverage.`);
                } else {
                  setSearchError(`Showing blood banks near ${cityName}. Our database has been enhanced for this city.`);
                }
              }
            } else {
              setSearchError(`Showing blood banks in ${cityName} and nearby areas.`);
            }
            
            // Auto-hide message after 3 seconds
            setTimeout(() => {
              if (isMountedRef.current) {
                setSearchError(null);
              }
            }, 3000);
          } else {
            setSearchError("Showing nearby blood banks.");
            
            // Auto-hide message after 3 seconds
            setTimeout(() => {
              if (isMountedRef.current) {
                setSearchError(null);
              }
            }, 3000);
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading facilities:", error);
        
        if (isMountedRef.current && userLocation) {
          setSearchError("Error finding facilities. Showing nearby blood banks from our database.");
          
          // Calculate distances for static banks as fallback
          const fallbackBanks = bloodBanks
            .map(bank => ({
              ...bank,
              distance: Number(calculateDistance(
                userLocation.lat,
                userLocation.lng,
                bank.latitude,
                bank.longitude
              ).toFixed(1)),
              source: 'static'
            }))
            .filter(bank => bank.distance <= 50)
            .sort((a, b) => a.distance - b.distance);
          
          console.log(`DEBUG: Using fallback blood banks: ${fallbackBanks.length}`);
          
          setNearbyBloodBanks(fallbackBanks);
          // Set empty array for hospitals to ensure none are displayed
          setNearbyHospitals([]);
          
          if (onNearbyBloodBanksUpdate) {
            onNearbyBloodBanksUpdate(fallbackBanks);
          }
          
          // Auto-hide message after 3 seconds
          setTimeout(() => {
            if (isMountedRef.current) {
              setSearchError(null);
            }
          }, 3000);
          
          setIsLoading(false);
        }
      }
    };
    
    // Call the function to update blood banks
    updateBloodBanks();
    
  }, [userLocation, isLoaded, bloodBanks, calculateDistance, onNearbyBloodBanksUpdate, map, placesLibrary]);
  
  // Function to set map reference
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Center map on user location if available
    if (userLocation) {
      map.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
      map.setZoom(13);
    }
  }, [userLocation]);
  
  // Handle blood bank marker click
  const onBloodBankClick = useCallback((bloodBank: ExtendedBloodBank) => {
    setSelectedFacility(bloodBank);
    setFacilityType('bloodBank');
  }, []);
  
  // Handle map click to close info window
  const onMapClick = useCallback(() => {
    setSelectedFacility(null);
    setFacilityType(null);
  }, []);
  
  // Render function with marker fallback if Advanced Markers aren't available
  const renderMap = () => {
    // Check if Map ID is available for Advanced Markers
    const hasValidMapId = !!mapOptions.mapId;
    // IMPORTANT: Force hasAdvancedMarkers to false to ensure standard markers are always used
    const hasAdvancedMarkers = false; // Temporarily disable advanced markers to ensure standard ones work
    
    console.log("DEBUG: Rendering map with:");
    console.log(`DEBUG: - ${nearbyBloodBanks.length} blood banks`);
    console.log("DEBUG: Using advanced markers:", hasAdvancedMarkers);
    
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || defaultCenter}
        zoom={userLocation ? 13 : 5}
        options={mapOptions}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {/* Blood bank markers */}
        <>
          {/* Always render standard markers */}
          {nearbyBloodBanks.map(bank => (
            <MarkerF
              key={bank.id}
              position={{ lat: bank.latitude, lng: bank.longitude }}
              icon={{
                url: getMarkerIcon(bank),
                scaledSize: new google.maps.Size(32, 32) // Adjust size to match Google's default markers
              }}
              onClick={() => onBloodBankClick(bank)}
            />
          ))}
        </>
        
        {/* Static markers - always visible */}
        {[
          // User-provided fixed coordinate location (23.077°N 76.851°E)
          { id: 'static-primary', name: 'Central Blood Bank Services', latitude: 23.077, longitude: 76.851 },
          // Major blood banks in Indore
          { id: 'indore-my', name: 'Blood Bank, M Y Hospital & MGM Medical College', latitude: 22.7196, longitude: 75.8577 },
          { id: 'indore-choithram', name: 'Choithram Hospital & Research Centre Blood Bank', latitude: 22.6868, longitude: 75.8641 },
          { id: 'indore-bombay', name: 'Bombay Hospital Trust Indore', latitude: 22.7522, longitude: 75.8948 },
          { id: 'indore-vishesh', name: 'Vishesh Hospital Blood Bank', latitude: 22.7276, longitude: 75.8537 },
          { id: 'indore-satya', name: 'Satya Sai Blood Bank', latitude: 22.7236, longitude: 75.8617 },
          // Major blood banks in Bhopal
          { id: 'bhopal-hamidia', name: 'Blood Bank, Hamidia Hospital & Gandhi Medical College', latitude: 23.2599, longitude: 77.4126 },
          { id: 'bhopal-memorial', name: 'Bhopal Memorial Hospital & Research Centre Blood Bank', latitude: 23.2857, longitude: 77.4633 },
          { id: 'bhopal-redcross', name: 'Indian Red Cross Society Blood Bank', latitude: 23.2579, longitude: 77.4106 },
          // Major blood banks in Ujjain
          { id: 'ujjain-district', name: 'Blood Bank, District Hospital Ujjain', latitude: 23.1765, longitude: 75.7885 },
          { id: 'ujjain-gardi', name: 'CR Gardi Hospital And RD Blood Bank', latitude: 23.1793, longitude: 75.7849 },
          // Major blood banks in Dewas
          { id: 'dewas-district', name: 'Blood Bank, District Hospital Dewas', latitude: 22.9659, longitude: 76.0555 },
          { id: 'dewas-vishnu', name: 'Vishnuprabha Charitable Trust Blood Bank', latitude: 22.9679, longitude: 76.0575 },
          // Standard Ambulance Services
          { id: 'ambulance-indore', name: '108 Ambulance Service Indore', latitude: 22.7244, longitude: 75.8678 },
          { id: 'ambulance-bhopal', name: '108 Ambulance Service Bhopal', latitude: 23.2532, longitude: 77.4030 },
          { id: 'ambulance-ujjain', name: '108 Ambulance Service Ujjain', latitude: 23.1765, longitude: 75.7885 },
          { id: 'ambulance-dewas', name: '108 Ambulance Service Dewas', latitude: 22.9623, longitude: 76.0551 },
          // New Ambulance Services
          { id: 'goaid-indore', name: 'GoAid Ambulance Service - Indore', latitude: 22.7286, longitude: 75.8637 },
          { id: 'goaid-bhopal', name: 'GoAid Ambulance Service - Bhopal', latitude: 23.2619, longitude: 77.4220 },
          { id: 'medcab-all', name: 'MedCab Ambulance Service', latitude: 22.7200, longitude: 75.8500 },
          { id: 'helicopter-dewas', name: 'Urgent Helicopter Service - Dewas', latitude: 22.9650, longitude: 76.0510 }
        ].map(staticLoc => (
          <MarkerF
            key={staticLoc.id}
            position={{ lat: staticLoc.latitude, lng: staticLoc.longitude }}
            icon={{
              url: getMarkerIcon(staticLoc),
              scaledSize: new google.maps.Size(32, 32) // Match the other markers
            }}
            onClick={() => {
              // Handle click on static marker - create a synthetic blood bank entry
              const syntheticBloodBank: ExtendedBloodBank = {
                id: `static-${staticLoc.latitude}-${staticLoc.longitude}`,
                name: staticLoc.name,
                address: staticLoc.name,
                latitude: staticLoc.latitude,
                longitude: staticLoc.longitude,
                phone: "",
                open: true,
                openHours: "24/7 Service Available",
                distance: userLocation ? 
                  calculateDistance(userLocation.lat, userLocation.lng, staticLoc.latitude, staticLoc.longitude) : 0,
                source: 'static',
                bloodTypes: {
                  'A+': { available: true, quantity: 10 },
                  'B+': { available: true, quantity: 15 },
                  'O+': { available: true, quantity: 20 },
                  'AB+': { available: true, quantity: 5 },
                  'A-': { available: false, quantity: 0 },
                  'B-': { available: false, quantity: 0 },
                  'O-': { available: true, quantity: 8 },
                  'AB-': { available: false, quantity: 0 }
                }
              };
              
              setSelectedFacility(syntheticBloodBank);
              setFacilityType('bloodBank');
            }}
            zIndex={200} // Higher zIndex to ensure visibility
          />
        ))}
      </GoogleMap>
    );
  };
  
  // Show error if Maps API fails to load
  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 border-2 border-dashed border-muted rounded-lg">
        <div className="text-center p-4">
          <p className="text-destructive font-medium">Error loading Google Maps</p>
          <p className="text-sm text-muted-foreground mt-1">
            {loadError.message || 'Please check your API key or try again later.'}
          </p>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 border-2 border-dashed border-muted rounded-lg">
        <div className="text-center p-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
            <p className="text-xs text-destructive mt-2">
              Warning: API key not found. Map functionality may be limited.
            </p>
          )}
        </div>
      </div>
    );
  }
  
  // Define isImportantBloodBank function within component - before any return statements
  const isImportantBloodBank = (bank: ExtendedBloodBank, cityName: string | null, userLocation: { lat: number; lng: number } | null): boolean => {
    // Consider a blood bank important if ANY of these are true:
    // 1. It's very close to the user (within 25km) - increased from 15km
    // 2. It has available blood types
    // 3. OR it has a specific naming pattern that indicates it's a primary blood bank
    
    // Check if bank is in one of our special cities
    const isInSpecialCity = bank.cityMatch && (
      (cityName?.toLowerCase() === 'jamshedpur') || 
      (cityName?.toLowerCase() === 'indore') || 
      (cityName?.toLowerCase() === 'bhopal') ||
      (cityName?.toLowerCase() === 'ujjain') ||
      (cityName?.toLowerCase() === 'dewas')
    );
    
    // Use a larger distance threshold for special cities
    const closeDistanceThreshold = isInSpecialCity ? 35 : 25;
    
    const isVeryClose = bank.distance <= closeDistanceThreshold;
    const isFromPlacesAPI = bank.source === 'places';
    
    const isPrimaryBloodBank = bank.name.toLowerCase().includes('blood bank') || 
                             bank.name.toLowerCase().includes('red cross') ||
                             bank.name.toLowerCase().includes('donation');
    
    // Check for special blood banks in specific cities
    const isSpecialCityBloodBank = 
      // Indore special blood banks
      (cityName?.toLowerCase() === 'indore' && (
        bank.name.toLowerCase().includes('m.y. hospital') ||
        bank.name.toLowerCase().includes('maharaja yeshwantrao') ||
        bank.name.toLowerCase().includes('choithram')
      )) ||
      // Bhopal special blood banks
      (cityName?.toLowerCase() === 'bhopal' && (
        bank.name.toLowerCase().includes('aiims') ||
        bank.name.toLowerCase().includes('hamidia') ||
        bank.name.toLowerCase().includes('gandhi')
      )) ||
      // Jamshedpur special blood banks
      (cityName?.toLowerCase() === 'jamshedpur' && (
        bank.name.toLowerCase().includes('tata main') ||
        bank.name.toLowerCase().includes('tmc') ||
        bank.name.toLowerCase().includes('mgm')
      )) ||
      // Ujjain special blood banks
      (cityName?.toLowerCase() === 'ujjain' && (
        bank.name.toLowerCase().includes('rd gardi') ||
        bank.name.toLowerCase().includes('district hospital') ||
        bank.name.toLowerCase().includes('civil hospital')
      )) ||
      // Dewas special blood banks
      (cityName?.toLowerCase() === 'dewas' && (
        bank.name.toLowerCase().includes('district hospital') ||
        bank.name.toLowerCase().includes('civil hospital')
      ));
    
    // Count number of available blood types
    let availableBloodTypesCount = 0;
    
    if (bank.bloodTypes) {
      Object.entries(bank.bloodTypes).forEach(([_, info]) => {
        if (info.available) availableBloodTypesCount++;
      });
    }
    
    const hasBloodTypes = availableBloodTypesCount > 0;
    
    // Show most blood banks to ensure users see all options (less filtering)
    return isVeryClose || isPrimaryBloodBank || hasBloodTypes || isFromPlacesAPI || isSpecialCityBloodBank;
  };
  
  // Function to determine the appropriate marker icon based on the facility type
  const getMarkerIcon = (facility: BloodBank | any): string => {
    // Add debugging
    console.log(`Getting marker icon for: ${facility.name}`);
    
    try {
      if (!facility || !facility.name) {
        console.warn('Invalid facility passed to getMarkerIcon');
        return MARKER_ICONS.fallback;
      }
      
      // For debugging, return a known working image URL
      // This will help us determine if the issue is with the paths or something else
      return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      
      /*
      if (facility.name.toLowerCase().includes('helicopter')) {
        console.log(`Using helicopter icon for ${facility.name}`);
        return MARKER_ICONS.helicopter;
      }
      
      if (facility.name.toLowerCase().includes('ambulance') || facility.name.toLowerCase().includes('medcab')) {
        console.log(`Using ambulance icon for ${facility.name}`);
        return MARKER_ICONS.ambulance;
      }
      
      // Check if it's an important blood bank
      try {
        if (isImportantBloodBank(facility, userCity, userLocation || null)) {
          console.log(`Using important blood bank icon for ${facility.name}`);
          return MARKER_ICONS.bloodBank.important;
        }
      } catch (e) {
        // If there's an error determining importance, use standard marker
        console.warn('Error determining marker importance:', e);
      }
      
      console.log(`Using standard blood bank icon for ${facility.name}`);
      return MARKER_ICONS.bloodBank.standard;
      */
    } catch (error) {
      console.error('Error in getMarkerIcon:', error);
      return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'; // Use Google's hosted marker as a failsafe
    }
  };
  
  return (
    <div className="h-full relative">
      {isLoaded ? renderMap() : null}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm font-medium">Loading blood banks...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {searchError && (
        <div className="absolute bottom-4 left-4 right-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg text-xs">
          <p className="font-medium mb-1">{searchError}</p>
          
          {/* Show API key troubleshooting tips if relevant */}
          {searchError.includes("request was denied") && (
            <ul className="list-disc list-inside text-[10px] space-y-1 mt-2">
              <li>Your Google Maps API key might have restrictions</li>
              <li>Places API (New) might not be enabled for your project</li>
              <li>Make sure billing is enabled on your Google Cloud Console</li>
              <li>We're showing you blood banks from our database in the meanwhile</li>
            </ul>
          )}
          
          {/* Generic API issues */}
          {searchError.includes("not available") && (
            <ul className="list-disc list-inside text-[10px] space-y-1 mt-2">
              <li>Check your internet connection</li>
              <li>Make sure you're using a supported browser</li>
              <li>Try refreshing the page</li>
              <li>Meanwhile, we're showing blood banks from our database</li>
            </ul>
          )}
          
          {/* For no results found */}
          {searchError.includes("Could not find blood banks") && (
            <ul className="list-disc list-inside text-[10px] space-y-1 mt-2">
              <li>Try allowing precise location access</li>
              <li>Blood banks might be outside the search radius</li>
              <li>Try zooming out on the map to see more options</li>
            </ul>
          )}
        </div>
      )}
      
      {/* Map attribution */}
      <div className="absolute bottom-1 right-1 text-[8px] text-muted-foreground bg-background/50 px-1 rounded">
        Map data ©2023 Google
      </div>
    </div>
  );
} 