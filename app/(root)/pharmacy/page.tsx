"use client"

import { Medicine, columns } from "../../../components/pharmacy/columns"
import { DataTable } from "../../../components/ui/data-table"
import { API_ENDPOINTS } from "@/constants"
import { useEffect, useState } from "react"
import { PharmacyOverview } from "../../../components/pharmacy/pharmacy-overview"

export default function PharmacyPage() {
  const [data, setData] = useState<Medicine[]>([])
  const [filter, setFilter] = useState<{ field: string, value: string | null } | undefined>()

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.prescriptions}`)
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      const newData = await res.json()
      setData(newData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="flex-1 w-full space-y-6">
      <PharmacyOverview 
        data={data} 
        onFilter={(newFilter) => setFilter(newFilter)} 
      />
      <DataTable 
        columns={columns} 
        data={data} 
        onRefresh={fetchData}
        filter={filter}
      />
    </div>
  )
}