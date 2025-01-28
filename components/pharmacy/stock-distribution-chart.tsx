"use client"

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Medicine } from "./columns"

interface StockDistributionChartProps {
  data: Medicine[]
}

export function StockDistributionChart({ data }: StockDistributionChartProps) {
  // Process data to group by category
  const categoryData = data.reduce((acc, med) => {
    const category = med.category
    if (!acc[category]) {
      acc[category] = {
        category,
        totalStock: 0,
        lowStock: 0,
        outOfStock: 0,
        inStock: 0
      }
    }
    acc[category].totalStock += med.stock
    if (med.status === "Low Stock") acc[category].lowStock++
    else if (med.status === "Out of Stock") acc[category].outOfStock++
    else acc[category].inStock++
    return acc
  }, {} as Record<string, { 
    category: string
    totalStock: number
    lowStock: number
    outOfStock: number
    inStock: number 
  }>)

  const chartData = Object.values(categoryData)
    .sort((a, b) => b.totalStock - a.totalStock)
    .slice(0, 8) // Show top 8 categories

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Stock Distribution by Category</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id="inStockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0, 149, 246, 0.5)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgba(0, 149, 246, 0.1)" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="lowStockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(45, 212, 191, 0.5)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgba(45, 212, 191, 0.1)" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="outOfStockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(251, 113, 133, 0.5)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgba(251, 113, 133, 0.1)" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12, fill: 'var(--color-text-1)' }}
            />
            <YAxis 
              tickFormatter={(value) => `${value}`}
              tick={{ fontSize: 12, fill: 'var(--color-text-1)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="inStock" 
              stackId="a" 
              fill="url(#inStockGradient)" 
              name="In Stock"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="lowStock" 
              stackId="a" 
              fill="url(#lowStockGradient)" 
              name="Low Stock"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="outOfStock" 
              stackId="a" 
              fill="url(#outOfStockGradient)" 
              name="Out of Stock"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 