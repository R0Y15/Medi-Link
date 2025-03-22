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
    <div className="flex flex-col gap-4 sm:gap-5 px-2">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
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
          logo="clock" 
          color="pink" 
          onViewDetails={() => {
            // We'll filter by medicines expiring within 3 months in the UI
            onFilter({ field: "expiryDate", value: "soon" })
          }}
        />
        <PatientCard 
          cardTitle="Low Stock" 
          cardDetail={lowStock.toString()} 
          logo="alert" 
          color="yellow" 
          onViewDetails={() => onFilter({ field: "status", value: "Low Stock" })}
        />
        <PatientCard 
          cardTitle="Out of Stock" 
          cardDetail={outOfStock.toString()} 
          logo="error" 
          color="red" 
          onViewDetails={() => onFilter({ field: "status", value: "Out of Stock" })}
        />
      </div>
      
      <StockDistributionChart />
    </div>
  )
} 