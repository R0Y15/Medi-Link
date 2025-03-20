import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface Medicine {
  id: number;
  name: string;
  date: string;
}

interface PrescriptionData {
  months: string[];
  values: number[];
}

interface DashboardStats {
  totalPatients: string;
  totalStaff: string;
  totalRooms: string;
  appointments: string;
  assignedDoctors: string;
  hospitalVisits: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  profilePicture: string;
}

interface DashboardData {
  user: UserData;
  stats: DashboardStats;
  medicines: Medicine[];
  prescriptionData: PrescriptionData;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, user, isLoaded: isUserLoaded } = useUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Only fetch if user is authenticated and loaded
      if (!isUserLoaded) return;
      if (isUserLoaded && !isSignedIn) {
        setError('User is not authenticated. Please sign in.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Include user ID in the request for personalized data
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const dashboardData = await response.json();
        
        // Merge Clerk user data with dashboard data
        if (user) {
          dashboardData.user = {
            ...dashboardData.user,
            firstName: user.firstName || dashboardData.user.firstName,
            lastName: user.lastName || dashboardData.user.lastName,
            profilePicture: user.imageUrl || dashboardData.user.profilePicture,
          };
        }
        
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isUserLoaded, isSignedIn, user]);

  return { data, isLoading, error };
}; 