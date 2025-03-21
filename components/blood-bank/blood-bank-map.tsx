"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, InfoWindowF, CircleF, MarkerF, useJsApiLoader, Libraries } from '@react-google-maps/api';
import { BloodBank, BloodTypeInfo, nearbyBloodBanks as staticBloodBanks, bloodInventoryData } from '@/constants/blood-bank';
import { Hospital, nearbyHospitals as staticHospitals } from '@/constants/hospitals';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BloodBankMapProps {
  bloodBanks: BloodBank[];
  userLocation?: { lat: number; lng: number } | null;
  onNearbyBloodBanksUpdate?: (results: any[]) => void;
}

// Extended type for Blood Banks with additional metadata
interface ExtendedBloodBank extends BloodBank {
  placeDetails?: google.maps.places.PlaceResult | null;
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
  placeDetails?: null;
  source?: string;
}

// Default center (Delhi, India)
const defaultCenter = { lat: 28.6139, lng: 77.2090 };

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

export function BloodBankMap({ bloodBanks, userLocation, onNearbyBloodBanksUpdate }: BloodBankMapProps) {
  const [selectedBloodBank, setSelectedBloodBank] = useState<ExtendedBloodBank | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [nearbyBloodBanks, setNearbyBloodBanks] = useState<ExtendedBloodBank[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState<ExtendedHospital[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<ExtendedBloodBank | ExtendedHospital | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [facilityType, setFacilityType] = useState<'bloodBank' | 'hospital' | null>(null);
  
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
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is not set. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.");
      setSearchError("Google Maps API key is missing. Please check your environment configuration.");
    }
  }, []);
  
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
      placeDetails: null,
      source: 'static'
    })).sort((a, b) => a.distance - b.distance).filter(bank => bank.distance <= 100); // Show banks within 100km
  }, [bloodBanks, calculateDistance]);
  
  // Process static hospitals
  const getStaticHospitals = useCallback((userLat: number, userLng: number, cityName?: string): ExtendedHospital[] => {
    const hospitalsWithDistance = staticHospitals.map(hospital => {
      const distance = calculateDistance(
        userLat,
        userLng,
        hospital.latitude,
        hospital.longitude
      );
      
      return {
        ...hospital,
        distance,
        cityMatch: cityName ? hospital.address.toLowerCase().includes(cityName.toLowerCase()) : false,
        cityName: cityName || undefined
      };
    });
    
    // Filter to show hospitals within reasonable distance (50km) or matching city name
    return hospitalsWithDistance
      .filter(hospital => hospital.cityMatch || hospital.distance <= 50)
      .sort((a, b) => a.distance - b.distance);
  }, [calculateDistance]);
  
  // Main effect to update blood banks when user location changes
  useEffect(() => {
    if (!isLoaded || !bloodBanks.length || !userLocation) return;
    
    const updateBloodBanks = async () => {
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
              placeDetails: null,
              source: 'static',
              cityMatch: cityName ? bank.address.toLowerCase().includes(cityName.toLowerCase()) : false,
            };
        }).sort((a, b) => a.distance - b.distance);
        
        // Process static hospitals
        const staticHospitalsWithDistance = staticHospitals.map(hospital => {
          const distance = Number(calculateDistance(
            userLocation.lat,
            userLocation.lng,
            hospital.latitude,
            hospital.longitude
          ).toFixed(1));
          
          return {
            ...hospital,
            distance,
            cityMatch: cityName ? hospital.address.toLowerCase().includes(cityName.toLowerCase()) : false,
          };
        }).sort((a, b) => a.distance - b.distance);
        
        // Filter blood banks by city or distance
        const citySpecificBanks = cityName 
          ? staticBanksWithDistance.filter(bank => bank.cityMatch)
          : [];
          
        const nearbyBanks = staticBanksWithDistance.filter(bank => bank.distance <= 50);
        
        // Filter hospitals by city or distance
        const citySpecificHospitals = cityName
          ? staticHospitalsWithDistance.filter(hospital => hospital.cityMatch)
          : [];
          
        const nearbyHospitals = staticHospitalsWithDistance.filter(hospital => hospital.distance <= 50);
        
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
        
        // Select hospitals to display
        let finalHospitals = [];
        if (citySpecificHospitals.length > 0) {
          finalHospitals = [...citySpecificHospitals];
          // Add nearby hospitals that are not city-specific
          const extraHospitals = nearbyHospitals.filter(
            hospital => !citySpecificHospitals.some(cityHospital => cityHospital.id === hospital.id)
          ).slice(0, 10); // Limit to 10 additional hospitals
          finalHospitals = [...finalHospitals, ...extraHospitals];
        } else {
          finalHospitals = nearbyHospitals;
        }
        
        // Update state with the static data
        if (isMountedRef.current) {
          setNearbyBloodBanks(finalBanks);
          setNearbyHospitals(finalHospitals);
          
          if (onNearbyBloodBanksUpdate) {
            onNearbyBloodBanksUpdate(finalBanks);
          }
          
          // Set message
          if (cityName) {
            setSearchError(`Showing blood banks and hospitals in ${cityName} and nearby areas.`);
            
            // Auto-hide message after 3 seconds
            setTimeout(() => {
              if (isMountedRef.current) {
                setSearchError(null);
              }
            }, 3000);
          } else {
            setSearchError("Showing nearby blood banks and hospitals.");
            
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
          setSearchError("Error finding facilities. Showing nearby blood banks and hospitals from our database.");
          
          // Calculate distances for static banks and hospitals as fallback
          const fallbackBanks = bloodBanks
            .map(bank => ({
              ...bank,
              distance: Number(calculateDistance(
                userLocation.lat,
                userLocation.lng,
                bank.latitude,
                bank.longitude
              ).toFixed(1)),
              placeDetails: null,
              source: 'static'
            }))
            .filter(bank => bank.distance <= 50)
            .sort((a, b) => a.distance - b.distance);
          
          const fallbackHospitals = staticHospitals
            .map(hospital => ({
              ...hospital,
              distance: Number(calculateDistance(
                userLocation.lat,
                userLocation.lng,
                hospital.latitude,
                hospital.longitude
              ).toFixed(1))
            }))
            .filter(hospital => hospital.distance <= 50)
            .sort((a, b) => a.distance - b.distance);
          
          setNearbyBloodBanks(fallbackBanks);
          setNearbyHospitals(fallbackHospitals);
          
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
    
  }, [userLocation, isLoaded, bloodBanks, calculateDistance, onNearbyBloodBanksUpdate, map]);
  
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
  
  // Handle hospital marker click
  const onHospitalClick = useCallback((hospital: ExtendedHospital) => {
    setSelectedFacility(hospital);
    setFacilityType('hospital');
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
    const hasAdvancedMarkers = hasValidMapId && window.google && window.google.maps && window.google.maps.marker;
    
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
        {nearbyBloodBanks.map((bank) => (
          <React.Fragment key={bank.id}>
            {/* Use standard marker without Advanced Markers */}
            {!hasAdvancedMarkers && (
              <MarkerF
                position={{ lat: bank.latitude, lng: bank.longitude }}
                title={bank.name}
                icon={{
                  url: '/assets/marker-red.svg',
                  scaledSize: new google.maps.Size(30, 40),
                }}
                onClick={() => onBloodBankClick(bank)}
                zIndex={bank.distance <= 15 ? 100 : 10}
              />
            )}
            
            {/* Show info window for selected blood bank */}
            {selectedFacility && facilityType === 'bloodBank' && selectedFacility.id === bank.id && (
              <InfoWindowF
                position={{ lat: bank.latitude, lng: bank.longitude }}
                onCloseClick={() => { setSelectedFacility(null); setFacilityType(null); }}
                options={{
                  maxWidth: 320,
                  pixelOffset: new google.maps.Size(0, -35),
                  disableAutoPan: false
                }}
              >
                <div className="p-3 max-w-[300px] bg-white rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{bank.name}</h3>
                  <p className="text-sm text-gray-700 mb-2 border-b pb-2">{bank.address}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${bank.open ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm">{bank.open ? 'Open Now' : 'Closed'}</span>
                    </div>
                    <div className="text-sm font-medium">{bank.distance.toFixed(1)} km away</div>
                  </div>
                  
                  {bank.bloodTypes && Object.keys(bank.bloodTypes).length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-1">Available Blood Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(bank.bloodTypes).map(([type, info]) => (
                          <span 
                            key={type} 
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              info.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {type} {info.available ? `(${info.quantity})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${bank.latitude},${bank.longitude}`,
                          '_blank'
                        );
                      }}
                      size="sm"
                      variant="default"
                      className="text-xs flex-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                      </svg>
                      Get Directions
                    </Button>
                    
                    {bank.phone && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${bank.phone}`, '_blank');
                        }}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Call
                      </Button>
                    )}
                  </div>
                  
                  {bank.openHours && (
                    <p className="text-xs text-gray-500 mt-2">Hours: {bank.openHours}</p>
                  )}
                </div>
              </InfoWindowF>
            )}
          </React.Fragment>
        ))}
        
        {/* Hospital markers */}
        {nearbyHospitals.map((hospital) => (
          <React.Fragment key={hospital.id}>
            {/* Use standard marker without Advanced Markers */}
            {!hasAdvancedMarkers && (
              <MarkerF
                position={{ lat: hospital.latitude, lng: hospital.longitude }}
                title={hospital.name}
                icon={{
                  url: '/assets/hospital-marker.svg',
                  scaledSize: new google.maps.Size(30, 40),
                }}
                onClick={() => onHospitalClick(hospital)}
                zIndex={hospital.distance <= 15 ? 100 : 10}
              />
            )}
            
            {/* Show info window for selected hospital */}
            {selectedFacility && facilityType === 'hospital' && selectedFacility.id === hospital.id && (
              <InfoWindowF
                position={{ lat: hospital.latitude, lng: hospital.longitude }}
                onCloseClick={() => { setSelectedFacility(null); setFacilityType(null); }}
                options={{
                  maxWidth: 320,
                  pixelOffset: new google.maps.Size(0, -35),
                  disableAutoPan: false
                }}
              >
                <div className="p-3 max-w-[300px] bg-white rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{hospital.name}</h3>
                  <p className="text-sm text-gray-700 mb-2 border-b pb-2">{hospital.address}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${hospital.open ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm">{hospital.open ? 'Open Now' : 'Closed'}</span>
                    </div>
                    <div className="text-sm font-medium">{hospital.distance.toFixed(1)} km away</div>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium mr-1">Category:</span>
                    <span className="text-sm">{hospital.category}</span>
                    {hospital.emergencyServices && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full ml-2">Emergency</span>
                    )}
                  </div>
                  
                  {hospital.services && hospital.services.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-1">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {hospital.services.slice(0, 5).map((service, index) => (
                          <span 
                            key={index}
                            className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-800"
                          >
                            {service}
                          </span>
                        ))}
                        {hospital.services.length > 5 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                            +{hospital.services.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`,
                          '_blank'
                        );
                      }}
                      size="sm"
                      variant="default"
                      className="text-xs flex-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                      </svg>
                      Get Directions
                    </Button>
                    
                    {hospital.phone && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${hospital.phone}`, '_blank');
                        }}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Call
                      </Button>
                    )}
                  </div>
                  
                  {hospital.openHours && (
                    <p className="text-xs text-gray-500 mt-2">Hours: {hospital.openHours}</p>
                  )}
                </div>
              </InfoWindowF>
            )}
          </React.Fragment>
        ))}
        
        {/* Create Advanced Markers imperatively if we can use them */}
        {hasAdvancedMarkers && map && (() => {
          // Create blood bank markers
          nearbyBloodBanks.forEach(bank => {
            const markerElement = document.createElement('div');
            markerElement.innerHTML = `
              <img src="/assets/marker-red.svg" style="width: 30px; height: 40px; cursor: pointer;" alt="Blood Bank" />
            `;
            
            const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
              map,
              position: { lat: bank.latitude, lng: bank.longitude },
              content: markerElement,
              zIndex: bank.distance <= 15 ? 100 : 10,
              title: bank.name
            });
            
            advancedMarker.addListener('click', () => {
              onBloodBankClick(bank);
            });
          });
          
          // Create hospital markers
          nearbyHospitals.forEach(hospital => {
            const markerElement = document.createElement('div');
            markerElement.innerHTML = `
              <img src="/assets/hospital-marker.svg" style="width: 30px; height: 40px; cursor: pointer;" alt="Hospital" />
            `;
            
            const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
              map,
              position: { lat: hospital.latitude, lng: hospital.longitude },
              content: markerElement,
              zIndex: hospital.distance <= 15 ? 100 : 10,
              title: hospital.name
            });
            
            advancedMarker.addListener('click', () => {
              onHospitalClick(hospital);
            });
          });
          
          // Return null as we've created markers imperatively
          return null;
        })()}
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
  
  // Update the isImportantBloodBank function and the rendering of markers to reduce confusion
  const isImportantBloodBank = (bank: ExtendedBloodBank): boolean => {
    // Consider a blood bank important if ANY of these are true:
    // 1. It's very close to the user (within 25km) - increased from 15km
    // 2. It has available blood types
    // 3. OR it has a specific naming pattern that indicates it's a primary blood bank
    const isVeryClose = bank.distance <= 25; // Increased from 15km
    const isFromPlacesAPI = bank.source === 'places';
    const isPrimaryBloodBank = bank.name.toLowerCase().includes('blood bank') || 
                             bank.name.toLowerCase().includes('red cross') ||
                             bank.name.toLowerCase().includes('hospital') ||
                             bank.name.toLowerCase().includes('donation');
    
    // Count number of available blood types
    let availableBloodTypesCount = 0;
    
    if (bank.bloodTypes) {
      Object.entries(bank.bloodTypes).forEach(([_, info]) => {
        if (info.available) availableBloodTypesCount++;
      });
    }
    
    const hasBloodTypes = availableBloodTypesCount > 0;
    
    // Show most blood banks to ensure users see all options (less filtering)
    return isVeryClose || isPrimaryBloodBank || hasBloodTypes || isFromPlacesAPI;
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
              <li>Places API might not be enabled for your project</li>
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