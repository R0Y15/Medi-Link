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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {medicine.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            variant="destructive" 
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 
