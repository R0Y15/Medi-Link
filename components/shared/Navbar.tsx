"use client";

// import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs'
// import { dark } from '@clerk/themes'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, Clock, Calendar, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useAppointments } from '@/hooks/useAppointments';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Id } from "@/convex/_generated/dataModel";

// Define appointment interface based on data model
interface Appointment {
  _id: Id<"appointments">;
  appointmentDate: string;
  doctorName: string;
  startTime: string;
  endTime: string;
  patientName: string;
  speciality: string;
  status: string;
  symptoms?: string;
  type?: string;
  notes?: string;
}

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { appointments } = useAppointments();
  const { isSignedIn, user } = useUser();

  // Fix for hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR issues

  // Filter for upcoming and scheduled appointments only
  const upcomingAppointments = appointments?.filter(
    (app) => app.status.toLowerCase() === 'upcoming' || 
             app.status.toLowerCase() === 'scheduled'
  ) || [];

  // Get a variant name based on status
  const getStatusVariant = (status: string): "default" | "outline" | "secondary" | "destructive" | "success" | "warning" => {
    // Normalize the status by trimming whitespace and converting to lowercase
    const normalizedStatus = status.trim().toLowerCase();
    
    switch (normalizedStatus) {
      case 'upcoming':
        return 'default'; // Blue is the default variant (primary color)
      case 'scheduled':
        return 'warning'; // Yellow variant
      case 'completed':
        return 'success'; // Green variant
      case 'cancelled':
      case 'canceled':
        return 'destructive'; // Red variant
      default:
        return 'secondary';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <nav className='fixed top-0 z-30 w-full flex items-center justify-between px-4 md:px-6 lg:px-10 py-4 h-16 bg-background shadow-sm'>
      {/* Left side - Empty space to help with centering */}
      <div className="flex items-center z-40 md:w-[120px]">
        {/* Empty div for spacing */}
      </div>
      
      {/* Centered Logo */}
      <div className="flex justify-center items-center">
        <Link 
          href='/patientDashboard' 
          className='flex items-center gap-3 z-40'
        >
          <div className="relative h-8 w-8">
            <Image
              src={'/logo.svg'}
              alt='logo'
              fill
              className="object-contain"
            />
          </div>
          <p className="text-lg font-bold">Medi-Link</p>
        </Link>
      </div>

      {/* Right side - User Actions */}
      <div className="flex items-center justify-end gap-3 z-40 md:w-[120px]">
        {/* Notifications Popover - Only show when user is signed in */}
        {isSignedIn && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-all">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {upcomingAppointments.length > 0 && (
                  <span className="absolute top-1 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {upcomingAppointments.length > 0 
                    ? `You have ${upcomingAppointments.length} upcoming appointment${upcomingAppointments.length > 1 ? 's' : ''}` 
                    : "You have no upcoming appointments"}
                </p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div 
                      key={appointment._id} 
                      className="p-3 border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium">{appointment.doctorName}</p>
                        <Badge variant={getStatusVariant(appointment.status)} className="text-xs">
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{appointment.speciality}</p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-muted-foreground gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 px-4 text-center">
                    <p className="text-muted-foreground">No upcoming appointments</p>
                  </div>
                )}
              </div>
              {upcomingAppointments.length > 0 && (
                <div className="p-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between"
                    asChild
                  >
                    <Link href="/appointments">
                      View all appointments
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
        
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9"
            }
          }}
        />
      </div>
    </nav>
  )
}

export default Navbar