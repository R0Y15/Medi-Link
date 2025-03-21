"use client"

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { chartData } from '@/constants'
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useRouter } from "next/navigation"

const chartConfig = {
  desktop: {
    label: "Prescriptions",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig

interface PrescriptionCardProps {
  data?: {
    months: string[];
    values: number[];
  }
}

const PrescriptionCard = ({ data }: PrescriptionCardProps) => {
  const router = useRouter();
  
  // Use provided data or fallback to default
  const slicedChartData = data 
    ? data.months.map((month, index) => ({
        month,
        desktop: data.values[index]
      }))
    : chartData.slice(0, 5);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">Monthly Overview</div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-xs"
          onClick={() => router.push('/report')}
        >
          <FileText className="h-3.5 w-3.5" />
          View Reports
        </Button>
      </div>
      <ChartContainer config={chartConfig} className="h-[240px] w-full">
        <BarChart accessibilityLayer data={slicedChartData} barCategoryGap={'25%'}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            vertical={false} 
            strokeDasharray="8" 
            stroke="hsl(var(--border))" 
          />
          <YAxis
            dataKey="desktop"
            tickLine={false}
            tickMargin={20}
            axisLine={false}
            tickSize={10}
            tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', height: 90 }}
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickSize={10}
            tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', width: 10 }}
            tickFormatter={(value) => value.slice(0, 3)}
            height={55}
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                className="bg-card border border-border shadow-sm rounded-lg p-2" 
              />
            } 
            cursor={{ fill: 'transparent' }} 
          />
          <Bar 
            dataKey="desktop" 
            fill="url(#barGradient)" 
            radius={[8, 8, 0, 0]} 
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default PrescriptionCard