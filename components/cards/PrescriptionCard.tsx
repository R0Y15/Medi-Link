"use client"

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, LabelList, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { chartData } from '@/constants'

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#0095F6",
  }
} satisfies ChartConfig

const PrescriptionCard = () => {
  const slicedChartData = chartData.slice(0, 5);
  return (
    <>
      <div className="flex flex-col w-full">
        <ChartContainer config={chartConfig} className="lg:min-h-[300px] w-full">
          <BarChart accessibilityLayer data={slicedChartData} barCategoryGap={'25%'}>
            <CartesianGrid vertical={false} strokeDasharray="8" />
            <YAxis
              dataKey="desktop"
              tickLine={false}
              tickMargin={20}
              axisLine={false}
              tickSize={10}
              tick={{ fontSize: 12, fill: 'var(--color-text-1)', height: 90 }}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickSize={10}
              tick={{ fontSize: 12, fill: 'var(--color-text-1)', width: 10 }}
              tickFormatter={(value) => value.slice(0, 3)}
              height={55}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="desktop" fill={`var(--color-desktop)`} radius={8}>
              {/* <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </>
  )
}

export default PrescriptionCard