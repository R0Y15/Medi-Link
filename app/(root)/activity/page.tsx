"use client"

import React from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from '@/convex/_generated/dataModel';

// Define Activity type to match Convex schema and actual data
type Activity = {
  _id: Id<"activities">;
  _creationTime: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  category: string;
  status: string;
  relatedId?: string;
  metadata?: {
    doctorName?: string;
    location?: string;
    speciality?: string;
    prescription?: string[];
    testResults?: string[];
    notes?: string;
  };
};

// Activity Card Component with proper typing
const ActivityCard = ({ activity }: { activity: Activity }) => (
  <Card className="p-4">
    <div className="flex items-start gap-4">
      <div className={cn(
        "mt-1 rounded-full p-2",
        activity.category === "medical" && "bg-blue-100 text-blue-700",
        activity.category === "pharmacy" && "bg-green-100 text-green-700",
        activity.category === "lab" && "bg-purple-100 text-purple-700",
        activity.category === "general" && "bg-gray-100 text-gray-700",
      )}>
        {activity.category === "medical" && "🏥"}
        {activity.category === "pharmacy" && "💊"}
        {activity.category === "lab" && "🔬"}
        {activity.category === "general" && "📝"}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{activity.title}</h3>
          <time className="text-sm text-muted-foreground">
            {activity.timestamp}
          </time>
        </div>
        <p className="mt-1 text-muted-foreground">{activity.description}</p>
        {activity.metadata && (
          <div className="mt-2 text-sm">
            {activity.metadata.doctorName && (
              <p>Doctor: {activity.metadata.doctorName}</p>
            )}
            {activity.metadata.location && (
              <p>Location: {activity.metadata.location}</p>
            )}
            {activity.metadata.notes && (
              <p>Notes: {activity.metadata.notes}</p>
            )}
          </div>
        )}
      </div>
    </div>
  </Card>
);

// Skeleton loading component
const ActivitySkeleton = () => (
  <Card className="p-4">
    <div className="flex items-start gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-[150px]" />
          <Skeleton className="h-3 w-[120px]" />
        </div>
      </div>
    </div>
  </Card>
);

// Loading state component
const LoadingState = () => (
  <div className="space-y-4">
    <ActivitySkeleton />
    <ActivitySkeleton />
    <ActivitySkeleton />
  </div>
);

// Empty state component
const EmptyState = ({ message = "No activities found" }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-muted-foreground">{message}</p>
  </div>
);

const ActivityPage = () => {
  // Fetch all activities with loading state
  const activities = useQuery(api.activities.getAll);

  // Show loading state
  if (activities === undefined) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-card">
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
            <TabsTrigger value="lab">Lab Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <LoadingState />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Filter activities by category (with null check)
  const medicalActivities = activities?.filter(activity => activity.category === "medical") || [];
  const pharmacyActivities = activities?.filter(activity => activity.category === "pharmacy") || [];
  const labActivities = activities?.filter(activity => activity.category === "lab") || [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-card">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          <TabsTrigger value="lab">Lab Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="grid gap-4">
            {medicalActivities.length > 0 ? (
              medicalActivities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))
            ) : (
              <EmptyState message="No medical activities found" />
            )}
          </div>
        </TabsContent>

        <TabsContent value="pharmacy" className="space-y-4">
          <div className="grid gap-4">
            {pharmacyActivities.length > 0 ? (
              pharmacyActivities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))
            ) : (
              <EmptyState message="No pharmacy activities found" />
            )}
          </div>
        </TabsContent>

        <TabsContent value="lab" className="space-y-4">
          <div className="grid gap-4">
            {labActivities.length > 0 ? (
              labActivities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))
            ) : (
              <EmptyState message="No lab activities found" />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ActivityPage