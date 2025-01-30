"use client"

import { Medicine } from "../pharmacy/columns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface DeleteMedicineDialogProps {
  medicine: Medicine
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteMedicineDialog({ 
  medicine, 
  open, 
  onOpenChange, 
  onSuccess 
}: DeleteMedicineDialogProps) {
  const [loading, setLoading] = useState(false)
  const deleteMedicine = useMutation(api.medicines.remove)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteMedicine({
        id: medicine._id
      })

      onOpenChange(false)
      toast.success("Medicine deleted successfully")
      onSuccess?.()
    } catch (error) {
      console.error('Failed to delete medicine:', error)
      toast.error("Failed to delete medicine. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Delete Medicine</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete {medicine.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-muted text-foreground hover:bg-muted/90" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 
