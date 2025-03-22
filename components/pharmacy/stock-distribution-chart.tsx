"use client"

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StockDistributionChart() {
  const data = useQuery(api.medicines.getAll) || []

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
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 px-6 pt-5">
        <CardTitle className="text-xl">Stock Distribution by Category</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <defs>
                <linearGradient id="inStockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="lowStockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="outOfStockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                tickFormatter={(value) => `${value}`}
                tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
                stroke="hsl(var(--border))"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar 
                dataKey="inStock" 
                stackId="a" 
                fill="url(#inStockGradient)" 
                name="In Stock"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="lowStock" 
                stackId="a" 
                fill="url(#lowStockGradient)" 
                name="Low Stock"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="outOfStock" 
                stackId="a" 
                fill="url(#outOfStockGradient)" 
                name="Out of Stock"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 