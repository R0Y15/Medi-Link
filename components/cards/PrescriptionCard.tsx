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

const chartConfig = {
  desktop: {
    label: "Prescriptions",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig

const PrescriptionCard = () => {
  const slicedChartData = chartData.slice(0, 5);
  return (
    <div className="flex flex-col w-full">
      <ChartContainer config={chartConfig} className="lg:min-h-[300px] w-full">
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