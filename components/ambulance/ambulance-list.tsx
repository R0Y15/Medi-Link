"use client";

import React, { useMemo } from 'react';
import { Phone, MapPin, Clock, Building, CheckCircle, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AmbulanceService } from '@/constants/ambulance';
import { Separator } from '@/components/ui/separator';

interface AmbulanceListProps {
  ambulanceServices: AmbulanceService[];
  userLocation: google.maps.LatLngLiteral | null;
  locationStatus: string;
}

export function AmbulanceList({ ambulanceServices, userLocation, locationStatus }: AmbulanceListProps) {
  // Function to call ambulance service
  const callAmbulance = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Function to open directions
  const getDirections = (latitude: number, longitude: number, address: string) => {
    if (userLocation) {
      // If we have user location, use it as origin
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${latitude},${longitude}`,
        '_blank'
      );
    } else {
      // Otherwise use the address
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
  };

  // Function to render distance indicator
  const renderDistanceIndicator = (distance: number) => {
    let color, text;
    
    if (distance < 2) {
      color = "#10b981"; // Emerald/green-500
      text = "Very nearby";
    } else if (distance < 5) {
      color = "#3b82f6"; // Blue-500
      text = "Nearby";
    } else if (distance < 10) {
      color = "#f59e0b"; // Amber-500
      text = "In your area";
    } else {
      color = "#ef4444"; // Red-500
      text = "Further away";
    }
    
    return (
      <div className="flex items-center gap-2 mt-2">
        <div className="h-2 w-16 rounded-full" style={{ backgroundColor: color }}></div>
        <span className="text-xs text-foreground/70">{text} • {distance} km</span>
      </div>
    );
  };

  // Sort services by distance (memorized to avoid re-sorting on every render)
  const sortedServices = useMemo(() => {
    return [...ambulanceServices].sort((a, b) => a.distance - b.distance);
  }, [ambulanceServices]);

  if (locationStatus === 'loading' && sortedServices.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-foreground">Finding ambulances near you...</p>
          <p className="text-sm mt-1 text-foreground/70">Please wait while we locate the nearest services</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {locationStatus === "denied" && (
        <Card className="bg-amber-950/20 border-amber-800">
          <CardContent className="p-3 text-sm">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-950/40">
                <X className="h-3 w-3" />
              </span>
              <p>Location access needed for precise distances. Please enable location services.</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {sortedServices.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-foreground">No ambulance services found in your area.</p>
            <p className="text-sm mt-1 text-foreground/70">Try changing your location or contact emergency number directly.</p>
          </CardContent>
        </Card>
      ) : (
        sortedServices.map((service) => (
          <Card key={service.id} className="border bg-card shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base text-foreground">{service.name}</h3>
                  {service.available ? (
                    <Badge className="bg-green-500/20 hover:bg-green-500/20 text-green-400 border-green-800/50 px-2">
                      <CheckCircle className="h-3 w-3 mr-1" /> Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-500/20 hover:bg-red-500/20 text-red-400 border-red-800/50 px-2">
                      Unavailable
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mt-1 text-sm text-foreground/70">
                  <Building className="h-3.5 w-3.5" />
                  <span className="capitalize">{service.serviceType}</span>
                  <span className="mx-1">•</span>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{service.operatingHours}</span>
                </div>
                
                <div className="text-sm text-foreground/70 mt-2 flex items-start gap-1">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{service.address}</span>
                </div>
                
                {userLocation && (
                  renderDistanceIndicator(service.distance)
                )}
                
                {service.cityArea && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs py-0.5 bg-card/70 text-foreground border-border">
                      {service.cityArea}
                    </Badge>
                  </div>
                )}
                
                {service.services && service.services.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {service.services.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs py-0.5 bg-background/70 text-foreground border-border">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="p-2 flex items-center gap-2">
                <Button 
                  className="flex-1 h-10" 
                  onClick={() => callAmbulance(service.phone)}
                >
                  <Phone className="h-3.5 w-3.5 mr-1.5" /> Call
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-10"
                  onClick={() => getDirections(service.latitude, service.longitude, service.address)}
                >
                  <MapPin className="h-3.5 w-3.5 mr-1.5" /> Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
} 