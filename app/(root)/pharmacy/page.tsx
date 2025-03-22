"use client";

import { columns } from "../../../components/pharmacy/columns";
import { DataTable } from "../../../components/ui/data-table";
import { useState } from "react";
import { PharmacyOverview } from "../../../components/pharmacy/pharmacy-overview";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function PharmacyPage() {
	const medicines = useQuery(api.medicines.getAll);
	const [filter, setFilter] = useState<
		{ field: string; value: string | null } | undefined
	>();

	// Show loading state while data is being fetched
	if (medicines === undefined) {
		return (
			<div className="w-full space-y-4 sm:space-y-6 p-2 sm:p-4">
				{/* Loading Header */}
				<div className="flex flex-col gap-2">
					<Skeleton className="h-5 w-48" />
					<Skeleton className="h-9 w-64" />
					<Skeleton className="h-5 w-96" />
				</div>

				{/* Loading Cards */}
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-[100px] sm:h-[120px]" />
					))}
				</div>
				<Skeleton className="h-[300px] sm:h-[350px] md:h-[400px] w-full" />
				<Skeleton className="h-[400px] sm:h-[500px] w-full rounded-xl" />
			</div>
		);
	}

	// Filter data based on the filter criteria
	const filteredData = filter
		? medicines.filter((medicine) => {
				if (!filter.value) return true;
				const fieldValue = medicine[filter.field as keyof typeof medicine];
				return fieldValue
					?.toString()
					.toLowerCase()
					.includes(filter.value.toLowerCase());
		  })
		: medicines;

	return (
		<div className="flex flex-col gap-5 py-4">
			{/* Header Section */}
			<div className="flex flex-col gap-2 px-2">
				<h4 className="text-base1-semibold text-muted-foreground">
					Health Services
				</h4>
				<h1 className="text-heading2-semibold text-foreground">
					Pharmacy Management
				</h1>
			</div>

			{/* Overview Cards */}
			<PharmacyOverview onFilter={(newFilter) => setFilter(newFilter)} />

			{/* Data Table Section */}
			<div className="px-2 sm:px-4">
				<Card className="border shadow-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-xl">Medicines Inventory</CardTitle>
						<CardDescription>
							Complete list of all medicines with details and stock status
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DataTable
							columns={columns}
							data={filteredData}
							filter={filter}
							onRefresh={() => {
								// No need to manually refresh since Convex will automatically update the UI
								// when the data changes in the backend
							}}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
