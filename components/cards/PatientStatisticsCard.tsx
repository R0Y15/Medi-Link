"use client"

import { Area, AreaChart, CartesianGrid, XAxis} from "recharts"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"
import { chartConfig, chartData } from "@/constants"

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



const PatientStatisticsCard = () => {
    const [Month, setMonth] = useState<string>("Month");

    return (
        <Card className="w-full border-none shadow-none">
            <CardHeader className="flex flex-row justify-between items-center">
                <h1 className="text-body2-bold">
                    Patient Statistics
                </h1>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex justify-between gap-2 bg-blue text-white">
                                {Month}
                                <Image
                                    src={'/assets/down.svg'}
                                    width={30}
                                    height={30}
                                    alt="down-arrow"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white w-56">
                            <DropdownMenuLabel>Months</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                {chartData.map((item, idx) => (
                                    <DropdownMenuItem key={idx} onClick={() => setMonth(item.month)}>
                                        <span>{item.month}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className='h-[250px]'>
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tickSize={10}
                                tickFormatter={(value) => value.slice(0, 3)}
                                height={40}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area
                                dataKey="desktop"
                                type="monotone"
                                fill="var(--color-desktop)"
                                fillOpacity={0.4}
                                stroke="var(--color-desktop)"
                                strokeWidth={2.5}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default PatientStatisticsCard