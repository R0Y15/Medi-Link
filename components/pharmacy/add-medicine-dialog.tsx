import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"
import { API_ENDPOINTS } from "@/constants"

interface AddMedicineDialogProps {
  onSuccess?: () => void
}

export function AddMedicineDialog({ onSuccess }: AddMedicineDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    category: "",
    price: "",
    expiryDate: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.prescriptions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          ...formData,
          stock: parseInt(formData.stock),
          price: parseFloat(formData.price),
          status: parseInt(formData.stock) > 50 ? "In Stock" : 
                 parseInt(formData.stock) > 0 ? "Low Stock" : 
                 "Out of Stock"
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({
          name: "",
          stock: "",
          category: "",
          price: "",
          expiryDate: "",
        })
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to save medicine:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add New Medicine
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 bg-background">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-8 py-6 border-b border-border">
            <DialogTitle className="text-2xl font-semibold text-foreground">Add New Medicine</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Fill in the details of the new medicine. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="px-8 py-6">
            <div className="space-y-6">
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="name" className="text-right text-muted-foreground font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter medicine name"
                  className="col-span-3 border-input focus:ring-ring focus:border-ring"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="stock" className="text-right text-muted-foreground font-medium">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  className="col-span-3 border-input focus:ring-ring focus:border-ring"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="category" className="text-right text-muted-foreground font-medium">
                  Category
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                  className="col-span-3 border-input focus:ring-ring focus:border-ring"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="price" className="text-right text-muted-foreground font-medium">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="col-span-3 border-input focus:ring-ring focus:border-ring"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="expiryDate" className="text-right text-muted-foreground font-medium">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="col-span-3 border-input focus:ring-ring focus:border-ring"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter className="px-8 py-6 bg-muted border-t border-border">
            <div className="flex gap-3 ml-auto">
              <Button type="button" variant="outline" className="border-input" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save Medicine
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 