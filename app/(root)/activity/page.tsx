"use client"

import React from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const ActivityPage = () => {
  // Fetch all activities
  const activities = useQuery(api.activities.getAll);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          <TabsTrigger value="lab">Lab Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {activities?.map((activity) => (
              <Card key={activity._id} className="p-4">
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
                        {new Date(activity.timestamp).toLocaleDateString()}
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          {/* Filter activities by medical category */}
        </TabsContent>

        <TabsContent value="pharmacy" className="space-y-4">
          {/* Filter activities by pharmacy category */}
        </TabsContent>

        <TabsContent value="lab" className="space-y-4">
          {/* Filter activities by lab category */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ActivityPage