import { Medicine } from "./columns"
import { PatientCard } from "@/components/cards"
import { StockDistributionChart } from "./stock-distribution-chart"

interface PharmacyOverviewProps {
  data: Medicine[]
  onFilter: (filter: { field: string, value: string | null }) => void
}

export function PharmacyOverview({ data, onFilter }: PharmacyOverviewProps) {
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
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row gap-2 justify-between items-center">
        <PatientCard 
          cardTitle="Total Medicines" 
          cardDetail={totalMedicines.toString()} 
          logo="medicine" 
          color="blue" 
          onViewDetails={() => onFilter({ field: 'status', value: null })}
        />
        <PatientCard 
          cardTitle="Low Stock Items" 
          cardDetail={lowStock.toString()} 
          logo="alert" 
          color="aqua" 
          onViewDetails={() => onFilter({ field: 'status', value: 'Low Stock' })}
        />
        <PatientCard 
          cardTitle="Out of Stock" 
          cardDetail={outOfStock.toString()} 
          logo="error" 
          color="peach" 
          onViewDetails={() => onFilter({ field: 'status', value: 'Out of Stock' })}
        />
        <PatientCard 
          cardTitle="Expiring Soon" 
          cardDetail={expiringCount.toString()} 
          logo="clock" 
          color="blue" 
          onViewDetails={() => {
            const threeMonthsFromNow = new Date()
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
            onFilter({ field: 'expiryDate', value: threeMonthsFromNow.toISOString() })
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5">
        <StockDistributionChart data={data} />
      </div>
    </div>
  )
} 