"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { MedicineOrderForm } from "@/components/pharmacy/medicine-order-form"
import { PastOrders } from "@/components/pharmacy/past-orders"
import { Skeleton } from "@/components/ui/skeleton"
import { Pill, ShoppingBag, ReceiptText } from "lucide-react"

export default function PharmacyPage() {
  const medicines = useQuery(api.medicines.getAll);

  // Show loading state while data is being fetched
  if (medicines === undefined) {
    return (
      <div className="flex flex-col gap-5 p-4">
        {/* Loading Header */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[500px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-4 px-2 sm:px-4 max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm sm:text-base font-medium text-muted-foreground">Health Services</h4>
        <h1 className="text-2xl sm:text-3xl font-bold">Pharmacy</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Order medicines and track your deliveries</p>
      </div>
      
      {/* Main content - Order form and past orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-2">
        <div className="w-full">
          <MedicineOrderForm />
        </div>
        <div className="w-full">
          <PastOrders />
        </div>
      </div>
      
      {/* Benefits section */}
      <div className="mt-6 w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Benefits of Online Medicine Ordering</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg border shadow-sm">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Pill className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Wide Range of Medicines</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Access to a comprehensive catalog of prescription and over-the-counter medications</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg border shadow-sm">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Doorstep Delivery</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Convenient home delivery of your medicines with secure packaging</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg border shadow-sm">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <ReceiptText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Prescription Management</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Easy upload and management of your prescriptions for seamless ordering</p>
          </div>
        </div>
      </div>
    </div>
  )
}