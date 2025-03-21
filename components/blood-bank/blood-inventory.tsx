"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BloodTypeData } from '@/constants/blood-bank';
import { Badge } from '@/components/ui/badge';

interface BloodInventoryProps {
  data: BloodTypeData[];
}

export function BloodInventory({ data }: BloodInventoryProps) {
  // Calculate total available units
  const totalUnits = data.reduce((sum, item) => sum + item.quantity, 0);
  const criticalTypes = data.filter(item => item.available && item.quantity < 10).map(item => item.bloodType);
  const unavailableTypes = data.filter(item => !item.available).map(item => item.bloodType);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">Total Units</span>
            <span className="text-3xl font-bold">{totalUnits}</span>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-sm text-yellow-800 dark:text-yellow-300">Critical</span>
            <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
              {criticalTypes.length > 0 ? criticalTypes.join(', ') : 'None'}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-sm text-red-800 dark:text-red-300">Unavailable</span>
            <span className="text-3xl font-bold text-red-700 dark:text-red-400">
              {unavailableTypes.length > 0 ? unavailableTypes.join(', ') : 'None'}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item) => (
          <BloodTypeCard key={item.bloodType} data={item} />
        ))}
      </div>
    </div>
  );
}

function BloodTypeCard({ data }: { data: BloodTypeData }) {
  const getStatusColor = () => {
    if (!data.available) return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    if (data.quantity < 10) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
  };

  const getQuantityColor = () => {
    if (!data.available) return "text-red-700 dark:text-red-400";
    if (data.quantity < 10) return "text-yellow-700 dark:text-yellow-400";
    return "text-green-700 dark:text-green-400";
  };

  return (
    <Card className={`${getStatusColor()} transition-colors`}>
      <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
        <div className="text-3xl font-bold">{data.bloodType}</div>
        <div className={`text-xl font-semibold ${getQuantityColor()}`}>
          {data.quantity} Units
        </div>
        <Badge variant={data.available ? (data.quantity < 10 ? "outline" : "secondary") : "destructive"}>
          {!data.available ? "Not Available" : data.quantity < 10 ? "Low Stock" : "Available"}
        </Badge>
        <div className="text-xs text-muted-foreground">
          Updated: {new Date(data.lastUpdated).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
} 