"use client"

import { API_ENDPOINTS } from "@/constants"
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
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.prescriptions}/${medicine.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to delete medicine:', error)
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
          <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/90" onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 
