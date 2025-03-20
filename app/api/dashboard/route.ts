import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

// Mock data that would normally come from a database
const getDashboardData = async (userId: string | null) => {
  // Start with mock/default data
  const defaultData = {
    user: {
      firstName: "Guest",
      lastName: "User",
      profilePicture: "/assets/avatar.png",
    },
    stats: {
      totalPatients: "200K",
      totalStaff: "120K",
      totalRooms: "160K",
      appointments: "0",
      assignedDoctors: "0",
      hospitalVisits: "0"
    },
    medicines: [
      { id: 1, name: "Amoxicline", date: "12 Jan 2022" },
      { id: 2, name: "Baclofen", date: "13 Feb 2022" },
      { id: 3, name: "Cefuroxime", date: "14 Mar 2022" },
      { id: 4, name: "Diazepam", date: "15 Apr 2022" },
      { id: 5, name: "Estrogen", date: "16 May 2022" },
      { id: 6, name: "Finasteride", date: "17 Jun 2022" },
      { id: 7, name: "Glycerol", date: "18 Jul 2022" },
      { id: 8, name: "Metformin", date: "19 Aug 2022" }
    ],
    prescriptionData: {
      months: ["Jan", "Feb", "Mar", "Apr", "May"],
      values: [160, 240, 190, 70, 190]
    }
  };

  if (!userId) {
    return defaultData;
  }

  try {
    // Attempt to fetch real data from Convex
    
    // Get appointments
    const appointments = await convex.query(api.appointments.getAll);
    if (appointments && Array.isArray(appointments)) {
      defaultData.stats.appointments = appointments.length.toString();
    }
    
    // Get medicines for the runs out section
    const medicinesList = await convex.query(api.medicines.getAll);
    if (medicinesList && Array.isArray(medicinesList)) {
      const lowStockMeds = medicinesList
        .filter(med => med.status === "Low Stock" || med.status === "Out of Stock")
        .map((med, index) => ({
          id: index + 1,
          name: med.name,
          date: new Date(med.expiryDate).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        }))
        .slice(0, 8);  // Limit to 8 items
        
      if (lowStockMeds.length > 0) {
        defaultData.medicines = lowStockMeds;
      }
    }
    
    // For prescription data, normally you would query real data
    // This is a placeholder for actual prescription data
    const prescriptionMonths = ["Jan", "Feb", "Mar", "Apr", "May"];
    const prescriptionValues = [160, 240, 190, 70, 190];
    
    defaultData.prescriptionData = {
      months: prescriptionMonths,
      values: prescriptionValues
    };
    
    return defaultData;
  } catch (error) {
    console.error('Error fetching data from Convex:', error);
    return defaultData;
  }
};

export async function GET() {
  try {
    const user = await currentUser();
    const userId = user?.id || null;
    const dashboardData = await getDashboardData(userId);
    
    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 