import { PatientCard } from "@/components/cards"
import { StockDistributionChart } from "./stock-distribution-chart"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface PharmacyOverviewProps {
  onFilter: (filter: { field: string, value: string | null }) => void
}

export function PharmacyOverview({ onFilter }: PharmacyOverviewProps) {
  const data = useQuery(api.medicines.getAll) || []

  // Calculate statistics
  const totalMedicines = data.length
  const lowStock = data.filter(med => med.status === "Low Stock").length
  const outOfStock = data.filter(med => med.status === "Out of Stock").length
  const expiringCount = data.filter(med => {
    const expiryDate = new Date(med.expiryDate)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiryDate <= threeMonthsFromNow
  }).length

  return (
    <div className="flex flex-col gap-5 mb-6 w-full px-2 sm:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        <PatientCard 
          cardTitle="Total Medicines" 
          cardDetail={totalMedicines.toString()} 
          logo="medicine" 
          color="aqua" 
          onViewDetails={() => onFilter({ field: "", value: null })}
        />
        <PatientCard 
          cardTitle="Expiring Soon" 
          cardDetail={expiringCount.toString()} 
          logo="calendar" 
          color="pink" 
          onViewDetails={() => {
            // We'll filter by medicines expiring within 3 months in the UI
            onFilter({ field: "expiryDate", value: "soon" })
          }}
        />
        <PatientCard 
          cardTitle="Low Stock" 
          cardDetail={lowStock.toString()} 
          logo="warning" 
          color="yellow" 
          onViewDetails={() => onFilter({ field: "status", value: "Low Stock" })}
        />
        <PatientCard 
          cardTitle="Out of Stock" 
          cardDetail={outOfStock.toString()} 
          logo="alert" 
          color="red" 
          onViewDetails={() => onFilter({ field: "status", value: "Out of Stock" })}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        <StockDistributionChart />
      </div>
    </div>
  )
} 