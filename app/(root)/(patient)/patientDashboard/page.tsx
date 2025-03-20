"use client";

import { InfoCard, PatientCard, PatientStatisticsCard, PrescriptionCard, StatCard } from "@/components/cards";
import { useDashboard } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const PatientDashboardPage = () => {
    const { data, isLoading, error } = useDashboard();
    const { user, isLoaded: isUserLoaded } = useUser();
    
    // Fetch appointment count from Convex
    const appointments = useQuery(api.appointments.getAll) || [];
    const appointmentCount = appointments?.length || 0;
    
    // Fetch activities for stats
    const activities = useQuery(api.activities.getAll) || [];
    const hospitalVisits = activities?.filter(a => a.type === 'visit')?.length || 0;
    
    // Since we don't have direct patients API, use a placeholder
    // In real app, this would be fetched from backend
    const assignedDoctors = 3; // Placeholder value

    // Loading state
    if (isLoading || !isUserLoaded) {
        return (
            <div className="flex flex-col gap-5">
                {/* Loading User Info */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-9 w-64" />
                </div>

                {/* Loading Cards */}
                <div className="flex flex-col lg:flex-row gap-2 justify-between items-center">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>

                {/* Loading Content */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                    <Skeleton className="h-72 w-full lg:w-1/2" />
                    <Skeleton className="h-72 w-full lg:w-1/2" />
                </div>
                
                {/* Loading Statistics */}
                <Skeleton className="hidden md:block h-80 w-full" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg max-w-lg text-center">
                    <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-red-200 dark:bg-red-800/40 hover:bg-red-300 dark:hover:bg-red-700/40 text-red-800 dark:text-red-200 px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* User Info */}
            <div className="flex flex-col gap-2">
                <h4 className="text-base1-semibold text-muted-foreground">Welcome Back,</h4>
                <h1 className="text-heading2-semibold text-foreground">
                    {user?.firstName || ""} {user?.lastName || ""}
                </h1>
            </div>

            {/* Availability */}
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-stretch">
                <PatientCard 
                    cardTitle="My Appointments" 
                    cardDetail={appointmentCount.toString()} 
                    logo="users" 
                    color='blue' 
                    detailedInfo={[
                        { title: "Total Appointments", value: appointmentCount.toString(), icon: "users" },
                        { title: "Upcoming", value: "3", icon: "appoint" },
                        { title: "Completed", value: (appointmentCount - 3).toString(), icon: "pharmacy" },
                        { title: "Change", value: "+2 this month", icon: "activity" },
                    ]}
                    onViewDetails={() => window.location.href = '/appointments'}
                />
                <PatientCard 
                    cardTitle="Assigned Doctor(s)" 
                    cardDetail={assignedDoctors.toString()} 
                    logo="staff" 
                    color='aqua' 
                    detailedInfo={[
                        { title: "Total Doctors", value: assignedDoctors.toString(), icon: "staff" },
                        { title: "Primary Care", value: "1", icon: "h-room" },
                        { title: "Specialists", value: "2", icon: "pharmacy" },
                        { title: "Last Visit", value: "12 Mar 2023", icon: "clock" },
                    ]}
                />
                <PatientCard 
                    cardTitle="Hospital Visits" 
                    cardDetail={hospitalVisits.toString()} 
                    logo="h-room" 
                    color='peach' 
                    detailedInfo={[
                        { title: "Total Visits", value: hospitalVisits.toString(), icon: "h-room" },
                        { title: "Emergency", value: "2", icon: "alert" },
                        { title: "Regular", value: (hospitalVisits - 2).toString(), icon: "pharmacy" },
                        { title: "Upcoming", value: "1 scheduled", icon: "appoint" },
                    ]}
                />
            </div>

            {/* Prescription and Medicine */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4 h-[350px]">
                <div className="flex flex-col w-full lg:w-1/2 gap-3 p-5 bg-card rounded-xl shadow-sm h-full border">
                    <h1 className="text-body2-bold text-foreground">Patient Prescription</h1>
                    <div className="flex-1 h-full">
                        <PrescriptionCard data={data?.prescriptionData} />
                    </div>
                </div>

                {/* Medicine RunsOut */}
                <div className="flex flex-col w-full lg:w-1/2 bg-card rounded-xl shadow-sm p-5 gap-3 h-full border">
                    <h1 className="text-body2-bold text-foreground">Medicine Runs Out</h1>
                    <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto pr-1 content-start">
                        {data?.medicines.map((item) => (
                            <InfoCard 
                                key={item.id} 
                                img={item.id} 
                                time={item.date} 
                                title={item.name} 
                                highlight={item.id === 1} 
                                className="w-full"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="hidden md:flex flex-col bg-card rounded-xl shadow-sm border">
                <PatientStatisticsCard />
            </div>
        </div>
    )
}

export default PatientDashboardPage;