"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { DeleteMedicineDialog } from "./delete-medicine-dialog"
import { EditMedicineDialog } from "./edit-medicine-dialog"
import { Id } from "@/convex/_generated/dataModel"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    onRefresh?: () => void
  }
}

export type Medicine = {
  _id: Id<"medicines">;
  name: string;
  stock: number;
  category: string;
  price: number;
  expiryDate: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface ColumnActionsProps {
  medicine: Medicine;
}

function ColumnActions({ medicine }: ColumnActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {
            navigator.clipboard.writeText(medicine._id)
            setDropdownOpen(false)
          }}>
            Copy medicine ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            setEditDialogOpen(true)
            setDropdownOpen(false)
          }}>
            Edit details
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              setDeleteDialogOpen(true)
              setDropdownOpen(false)
            }}
            className="text-destructive"
          >
            Delete medicine
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditMedicineDialog 
        medicine={medicine}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DeleteMedicineDialog
        medicine={medicine}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}

export const columns: ColumnDef<Medicine>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-4"
        >
          Medicine Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="pl-4">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("stock")}</div>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="bg-secondary/50 text-foreground">
          {row.getValue("category")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right pr-14">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <div className="text-right font-medium pr-12">{formatted}</div>
    },
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiryDate"))
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "In Stock" ? "success" :
            status === "Low Stock" ? "warning" :
            "destructive"
          }
        >
          {status}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const medicine = row.original;
      return <ColumnActions medicine={medicine} />;
    },
  },
] 