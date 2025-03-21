"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface Medicine {
  id: number;
  name: string;
  date: string;
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  quantity?: number;
}

interface MedicinesDialogProps {
  medicines: Medicine[];
  title?: string;
  description?: string;
}

export function MedicinesDialog({ 
  medicines = [], 
  title = "Medicine Inventory", 
  description = "Comprehensive view of medicines in your inventory" 
}: MedicinesDialogProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  // Segregate medicines by status
  const inStockMedicines = medicines.filter(med => 
    med.status === 'In Stock' || (!med.status && !med.name.includes('(Out)'))
  );
  
  const lowStockMedicines = medicines.filter(med => 
    med.status === 'Low Stock'
  );
  
  const outOfStockMedicines = medicines.filter(med => 
    med.status === 'Out of Stock' || (med.name && med.name.includes('(Out)'))
  );

  // Get medicines based on active tab
  const getMedicines = () => {
    switch (activeTab) {
      case 'in-stock':
        return inStockMedicines;
      case 'low-stock':
        return lowStockMedicines;
      case 'out-of-stock':
        return outOfStockMedicines;
      default:
        return medicines;
    }
  };

  const activeMedicines = getMedicines();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          View More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {/* Custom Tabs */}
        <div className="w-full grid grid-cols-4 gap-1 my-4">
          <Button 
            variant={activeTab === 'all' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('all')}
            className="text-xs h-8"
          >
            All ({medicines.length})
          </Button>
          <Button 
            variant={activeTab === 'in-stock' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('in-stock')}
            className="text-xs h-8"
          >
            In Stock ({inStockMedicines.length})
          </Button>
          <Button 
            variant={activeTab === 'low-stock' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('low-stock')}
            className="text-xs h-8"
          >
            Low Stock ({lowStockMedicines.length})
          </Button>
          <Button 
            variant={activeTab === 'out-of-stock' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('out-of-stock')}
            className="text-xs h-8"
          >
            Out of Stock ({outOfStockMedicines.length})
          </Button>
        </div>
        
        {/* Content */}
        <div className="border rounded-md h-[400px] overflow-auto p-4">
          {activeMedicines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground">
                No medicines found in this category
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MedicineCard({ medicine }: { medicine: Medicine }) {
  // Determine status text
  const getStatus = () => {
    if (medicine.status) {
      return medicine.status;
    } else if (medicine.name.includes('(Out)')) {
      return 'Out of Stock';
    } else {
      return 'In Stock';
    }
  };

  const status = getStatus();
  const isOutOfStock = status === 'Out of Stock';
  const isLowStock = status === 'Low Stock';

  return (
    <div className="flex flex-col p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{medicine.name.replace(' (Out)', '')}</h3>
        <div className={`px-2 py-1 text-xs rounded-full ${
          isOutOfStock 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
            : isLowStock
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        }`}>
          {status}
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Expiry: {medicine.date}</span>
        {medicine.quantity !== undefined && (
          <span>• Qty: {medicine.quantity}</span>
        )}
      </div>
      
      <div className="mt-3 flex items-center text-sm">
        {isOutOfStock ? (
          <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
        )}
        <span className={isOutOfStock ? 'text-red-500' : 'text-green-600'}>
          {isOutOfStock 
            ? 'Need to restock' 
            : isLowStock
              ? 'Running low'
              : 'Sufficient stock'
          }
        </span>
      </div>
    </div>
  );
} 