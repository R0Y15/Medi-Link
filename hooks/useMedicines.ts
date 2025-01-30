import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export type Medicine = {
  _id: Id<"medicines">;
  name: string;
  stock: number;
  category: string;
  price: number;
  expiryDate: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

export type NewMedicine = Omit<Medicine, "_id">;

export function useMedicines() {
  // Queries
  const medicines = useQuery(api.medicines.getAll);
  const lowStockMedicines = useQuery(api.medicines.getLowStock);

  // Mutations
  const createMedicine = useMutation(api.medicines.create);
  const updateMedicine = useMutation(api.medicines.update);
  const deleteMedicine = useMutation(api.medicines.remove);
  const updateStock = useMutation(api.medicines.updateStock);

  return {
    // Data
    medicines: medicines || [],
    lowStockMedicines: lowStockMedicines || [],
    loading: medicines === undefined,
    
    // Mutations
    createMedicine: async (data: NewMedicine) => {
      return await createMedicine(data);
    },

    updateMedicine: async (id: Id<"medicines">, data: Partial<NewMedicine>) => {
      return await updateMedicine({ id, ...data });
    },

    deleteMedicine: async (id: Id<"medicines">) => {
      return await deleteMedicine({ id });
    },

    updateStock: async (id: Id<"medicines">, stock: number) => {
      return await updateStock({ id, stock });
    },

    // Helpers
    getMedicinesByCategory: (category: string) => {
      return medicines?.filter(med => med.category === category) || [];
    },

    getTotalStock: () => {
      return medicines?.reduce((total, med) => total + med.stock, 0) || 0;
    },

    getStockValue: () => {
      return medicines?.reduce((total, med) => total + (med.stock * med.price), 0) || 0;
    },

    getCategories: () => {
      const categories = new Set(medicines?.map(med => med.category));
      return Array.from(categories);
    },
  };
} 