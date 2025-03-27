"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pill, Search, SlidersHorizontal } from "lucide-react";

export function MedicineCatalog() {
  // Get all medicines
  const medicines = useQuery(api.medicines.getAll) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // Extract unique categories using a different approach to avoid Set iterator issue
  const uniqueCategories: string[] = [];
  medicines.forEach(med => {
    if (!uniqueCategories.includes(med.category)) {
      uniqueCategories.push(med.category);
    }
  });
  const categories = ["all", ...uniqueCategories];

  // Apply filters to medicines
  const filteredMedicines = medicines.filter(medicine => {
    // Apply search filter
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === "all" || medicine.category === categoryFilter;
    
    // Apply stock filter
    const matchesStock = 
      stockFilter === "all" || 
      (stockFilter === "inStock" && medicine.status === "In Stock") ||
      (stockFilter === "lowStock" && medicine.status === "Low Stock") ||
      (stockFilter === "outOfStock" && medicine.status === "Out of Stock");
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Get badge variant based on stock status
  const getStockBadgeVariant = (status: string) => {
    switch (status) {
      case "In Stock":
        return "success";
      case "Low Stock":
        return "warning";
      case "Out of Stock":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Available Medicines</CardTitle>
        <CardDescription>
          Browse our catalog of medicines and check availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="inStock">In Stock</SelectItem>
                  <SelectItem value="lowStock">Low Stock</SelectItem>
                  <SelectItem value="outOfStock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredMedicines.length} of {medicines.length} medicines
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedicines.map((medicine) => (
            <Card key={medicine._id} className="overflow-hidden border">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{medicine.name}</h3>
                    <p className="text-sm text-muted-foreground">{medicine.category}</p>
                  </div>
                  <Badge variant={getStockBadgeVariant(medicine.status)}>
                    {medicine.status}
                  </Badge>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-bold">${medicine.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p className="font-medium">{medicine.stock} units</p>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 