"use client"

import { columns } from "../../../components/pharmacy/columns"
import { DataTable } from "../../../components/ui/data-table"
import { useState } from "react"
import { PharmacyOverview } from "../../../components/pharmacy/pharmacy-overview"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function PharmacyPage() {
  const medicines = useQuery(api.medicines.getAll);
  const [filter, setFilter] = useState<{ field: string, value: string | null } | undefined>();

  // Show loading state while data is being fetched
  if (medicines === undefined) {
    return (
      <div className="flex-1 w-full space-y-6">
        <div className="flex flex-col lg:flex-row gap-2 justify-between items-center">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full lg:w-[250px]" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  // Filter data based on the filter criteria
  const filteredData = filter 
    ? medicines.filter(medicine => {
        if (!filter.value) return true;
        const fieldValue = medicine[filter.field as keyof typeof medicine];
        return fieldValue?.toString().toLowerCase().includes(filter.value.toLowerCase());
      })
    : medicines;

  return (
    <div className="flex-1 w-full space-y-6">
      <PharmacyOverview 
        onFilter={(newFilter) => setFilter(newFilter)} 
      />
      <DataTable 
        columns={columns} 
        data={filteredData}
        filter={filter}
        onRefresh={() => {
          // No need to manually refresh since Convex will automatically update the UI
          // when the data changes in the backend
        }}
      />
    </div>
  )
}