"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { Loader2, Plus, Trash2, UploadCloud } from "lucide-react";

// Define form schema
const formSchema = z.object({
  patientName: z.string().min(2, { message: "Patient name is required" }),
  contactNumber: z.string().min(10, { message: "Valid contact number is required" }),
  address: z.string().min(5, { message: "Delivery address is required" }),
  notes: z.string().optional(),
  prescriptionRequired: z.boolean().default(false),
  prescriptionUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Define selected medicine item type
interface SelectedMedicine {
  medicineId: Id<"medicines">;
  medicineName: string;
  quantity: number;
  price: number;
}

export function MedicineOrderForm() {
  // Get all medicines
  const medicines = useQuery(api.medicines.getAll) || [];
  const { user } = useUser();
  
  // Create order mutation
  const createOrder = useMutation(api.medicines.createOrder);
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
  const [currentMedicine, setCurrentMedicine] = useState<Id<"medicines"> | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      contactNumber: "",
      address: "",
      notes: "",
      prescriptionRequired: false,
      prescriptionUrl: "",
    },
  });

  // Update total amount when selected medicines change
  useEffect(() => {
    const total = selectedMedicines.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotalAmount(total);
  }, [selectedMedicines]);

  // Handle adding a medicine to the order
  const handleAddMedicine = () => {
    if (!currentMedicine) return;
    
    const medicineToAdd = medicines.find(med => med._id === currentMedicine);
    
    if (!medicineToAdd) return;
    
    if (medicineToAdd.stock < currentQuantity) {
      toast.error(`Only ${medicineToAdd.stock} units available in stock`);
      return;
    }
    
    // Check if already in list and update quantity
    const existingIndex = selectedMedicines.findIndex(m => m.medicineId === currentMedicine);
    
    if (existingIndex >= 0) {
      const updated = [...selectedMedicines];
      const newQuantity = updated[existingIndex].quantity + currentQuantity;
      
      if (medicineToAdd.stock < newQuantity) {
        toast.error(`Cannot add more. Only ${medicineToAdd.stock} units available in stock`);
        return;
      }
      
      updated[existingIndex].quantity = newQuantity;
      setSelectedMedicines(updated);
    } else {
      // Add new medicine to list
      setSelectedMedicines([
        ...selectedMedicines,
        {
          medicineId: currentMedicine,
          medicineName: medicineToAdd.name,
          quantity: currentQuantity,
          price: medicineToAdd.price,
        },
      ]);
    }
    
    // Reset selection
    setCurrentMedicine(null);
    setCurrentQuantity(1);
  };

  // Handle removing a medicine from the order
  const handleRemoveMedicine = (index: number) => {
    const updated = [...selectedMedicines];
    updated.splice(index, 1);
    setSelectedMedicines(updated);
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (selectedMedicines.length === 0) {
      toast.error("Please add at least one medicine to your order");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the order
      await createOrder({
        userId: user?.id, // Pass Clerk user ID directly as string
        patientName: data.patientName,
        contactNumber: data.contactNumber,
        address: data.address,
        items: selectedMedicines,
        totalAmount,
        notes: data.notes,
        prescriptionRequired: data.prescriptionRequired,
        prescriptionUrl: data.prescriptionUrl || undefined,
      });
      
      toast.success("Your order has been placed successfully");
      
      // Reset form
      form.reset();
      setSelectedMedicines([]);
      setCurrentMedicine(null);
      setCurrentQuantity(1);
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if medicine is available in stock
  const isMedicineAvailable = (id: Id<"medicines">) => {
    const medicine = medicines.find(m => m._id === id);
    return medicine?.stock && medicine.stock > 0;
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
        <CardTitle className="text-lg sm:text-xl">Order Medicines</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Fill in your details and select medicines to order
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="patientName" className="text-xs sm:text-sm">Patient Name</Label>
              <Input
                id="patientName"
                placeholder="Enter patient name"
                {...form.register("patientName")}
                className="mt-1 text-sm h-9"
              />
              {form.formState.errors.patientName && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.patientName.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="contactNumber" className="text-xs sm:text-sm">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="Enter contact number"
                {...form.register("contactNumber")}
                className="mt-1 text-sm h-9"
              />
              {form.formState.errors.contactNumber && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.contactNumber.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="address" className="text-xs sm:text-sm">Delivery Address</Label>
              <Textarea
                id="address"
                placeholder="Enter delivery address"
                {...form.register("address")}
                className="mt-1 text-sm min-h-[60px] sm:min-h-[80px]"
              />
              {form.formState.errors.address && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-xs sm:text-sm">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or notes"
                {...form.register("notes")}
                className="mt-1 text-sm min-h-[60px]"
              />
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="prescriptionRequired" 
                onCheckedChange={(checked) => {
                  form.setValue("prescriptionRequired", checked as boolean);
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="prescriptionRequired" className="text-xs sm:text-sm font-normal">
                This order requires a prescription
              </Label>
            </div>
            
            {form.watch("prescriptionRequired") && (
              <div className="mt-2">
                <Label htmlFor="prescriptionUrl" className="text-xs sm:text-sm">Prescription URL</Label>
                <Input
                  id="prescriptionUrl"
                  placeholder="Enter prescription URL"
                  {...form.register("prescriptionUrl")}
                  className="mt-1 text-sm h-9"
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Upload your prescription to a service like Google Drive and paste the sharing link here
                </p>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium text-sm sm:text-base mb-3">Add Medicines to Order</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-4">
              <div className="flex-1">
                <Label htmlFor="selectMedicine" className="text-xs sm:text-sm">Select Medicine</Label>
                <Select
                  value={currentMedicine?.toString() || ""}
                  onValueChange={(value) => setCurrentMedicine(value as Id<"medicines">)}
                >
                  <SelectTrigger id="selectMedicine" className="mt-1 text-xs sm:text-sm h-9">
                    <SelectValue placeholder="Choose a medicine" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicines
                      .filter(med => med.stock > 0) // Only show medicines in stock
                      .map((medicine) => (
                        <SelectItem 
                          key={medicine._id} 
                          value={medicine._id}
                          disabled={!isMedicineAvailable(medicine._id)}
                          className="text-xs sm:text-sm"
                        >
                          {medicine.name} - ${medicine.price} 
                          {medicine.stock < 10 && ` (Only ${medicine.stock} left)`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-20">
                <Label htmlFor="quantity" className="text-xs sm:text-sm">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1 text-sm h-9"
                />
              </div>
              
              <Button 
                type="button" 
                onClick={handleAddMedicine}
                disabled={!currentMedicine}
                size="icon"
                className="h-9 w-9 sm:h-9 sm:w-9 mt-1 sm:mt-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Selected medicines */}
            <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
              {selectedMedicines.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
                  No medicines added yet
                </p>
              ) : (
                selectedMedicines.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 sm:p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium text-xs sm:text-sm">{item.medicineName}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveMedicine(index)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            {selectedMedicines.length > 0 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-base sm:text-xl font-bold">${totalAmount.toFixed(2)}</p>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || selectedMedicines.length === 0}
                  className="text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      Placing Order
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 