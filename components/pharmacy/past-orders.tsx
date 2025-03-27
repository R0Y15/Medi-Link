"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, Clock, CheckCircle, Package, MapPin, Pill, Calendar, FileClock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface OrderItem {
  medicineId: Id<"medicines">;
  medicineName: string;
  quantity: number;
  price: number;
}

interface MedicineOrder {
  _id: Id<"medicineOrders">;
  userId?: string;
  patientName: string;
  contactNumber: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
  prescriptionRequired: boolean;
  prescriptionUrl?: string;
}

// Sample prescribed medicines for demonstration
interface PrescribedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: string;
  doctorName: string;
  notes?: string;
  isActive: boolean;
}

const SAMPLE_PRESCRIPTIONS: PrescribedMedicine[] = [
  {
    id: "presc-1",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times a day",
    duration: "7 days",
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    doctorName: "Dr. Sarah Johnson",
    notes: "Take with food to avoid stomach upset",
    isActive: true
  },
  {
    id: "presc-2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    duration: "30 days",
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    doctorName: "Dr. Robert Chen",
    notes: "For blood pressure management",
    isActive: true
  },
  {
    id: "presc-3",
    name: "Cetirizine",
    dosage: "10mg",
    frequency: "Once daily",
    duration: "As needed",
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    doctorName: "Dr. Maria Garcia",
    notes: "Take for allergy symptoms",
    isActive: true
  },
  {
    id: "presc-4",
    name: "Ibuprofen",
    dosage: "400mg",
    frequency: "Every 6 hours as needed",
    duration: "5 days",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    doctorName: "Dr. Sarah Johnson",
    isActive: false
  },
  {
    id: "presc-5",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    duration: "Ongoing",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    doctorName: "Dr. Robert Chen",
    notes: "Take with meals",
    isActive: true
  }
];

export function PastOrders() {
  const { user, isSignedIn } = useUser();
  
  // Now we can pass the Clerk userId as a string
  // The backend will handle it appropriately
  const orders = useQuery(api.medicines.getUserOrders, { 
    userId: isSignedIn ? user?.id : undefined
  }) || [];
  
  // Use query results directly since our backend function filters properly now
  const ordersToShow = orders;
  
  const [selectedTab, setSelectedTab] = useState<string>("prescribed");
  
  // Filter orders based on selected tab
  const filteredOrders = ordersToShow.filter(order => {
    if (selectedTab === "completed") {
      return order.status === "Delivered";
    } else if (selectedTab === "cancelled") {
      return order.status === "Cancelled";
    }
    return false;
  });

  // Filter prescribed medicines
  const filteredPrescriptions = selectedTab === "prescribed" 
    ? SAMPLE_PRESCRIPTIONS
    : [];
  
  // Get badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Processing":
        return "warning";
      case "Shipped":
        return "default";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };
  
  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Processing":
        return <Loader2 className="h-4 w-4" />;
      case "Shipped":
        return <Package className="h-4 w-4" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get time ago for display
  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
        <CardTitle className="text-lg sm:text-xl">Your Medicine Orders</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          View your order history, prescriptions, and track current orders
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        <Tabs defaultValue="prescribed" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4 w-full grid grid-cols-3 h-auto">
            <TabsTrigger className="text-xs sm:text-sm py-2" value="prescribed">Prescribed</TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm py-2" value="completed">Completed</TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm py-2" value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            {selectedTab !== "prescribed" ? (
              filteredOrders.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed rounded-md">
                  <p className="text-sm text-muted-foreground">No {selectedTab} orders found</p>
                  {!isSignedIn && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Please sign in to view your personal order history
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredOrders.map((order, index) => (
                      <AccordionItem key={index} value={order._id}>
                        <AccordionTrigger className="hover:no-underline px-3 py-3 sm:py-4">
                          <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center text-left">
                            <div className="flex-1 mb-2 sm:mb-0">
                              <div className="font-medium text-sm sm:text-base">Order for {order.patientName}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" /> {getTimeAgo(order.orderDate)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                              <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1 text-xs py-1">
                                {getStatusIcon(order.status)}
                                <span className="hidden xs:inline">{order.status}</span>
                              </Badge>
                              <span className="font-medium text-sm sm:text-base">${order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 sm:px-4">
                          <div className="space-y-4 pt-2 pb-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs sm:text-sm font-medium mb-1">Order Details</h4>
                                <div className="text-xs sm:text-sm">
                                  <p className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Ordered:</span> {formatDate(order.orderDate)}
                                  </p>
                                  {order.deliveryDate && (
                                    <p className="flex items-center gap-1 mt-1">
                                      <CheckCircle className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-muted-foreground">Delivered:</span> {formatDate(order.deliveryDate)}
                                    </p>
                                  )}
                                  <p className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Delivery Address:</span>
                                  </p>
                                  <p className="mt-1 ml-4 text-xs">{order.address}</p>
                                </div>
                              </div>
                              
                              {order.notes && (
                                <div>
                                  <h4 className="text-xs sm:text-sm font-medium mb-1">Notes</h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground">{order.notes}</p>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="text-xs sm:text-sm font-medium mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-xs sm:text-sm py-2 border-b last:border-0">
                                    <div>
                                      <span className="font-medium">{item.medicineName}</span>
                                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                                      <p className="text-xs text-muted-foreground">${item.price} each</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between pt-2 border-t text-xs sm:text-sm">
                              <span className="font-medium">Total Amount</span>
                              <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )
            ) : (
              // Prescribed Medicines Tab Content
              <div className="space-y-4">
                {filteredPrescriptions.length === 0 ? (
                  <div className="text-center py-8 px-4 border border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground">No prescribed medicines found</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredPrescriptions.map((prescription) => (
                      <AccordionItem key={prescription.id} value={prescription.id}>
                        <AccordionTrigger className="hover:no-underline px-3 py-3 sm:py-4">
                          <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center text-left">
                            <div className="flex-1 mb-2 sm:mb-0">
                              <div className="font-medium text-sm sm:text-base">{prescription.name} ({prescription.dosage})</div>
                              <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" /> Prescribed {getTimeAgo(prescription.startDate)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                              <Badge variant={prescription.isActive ? "success" : "secondary"} className="flex items-center gap-1 text-xs py-1">
                                {prescription.isActive ? <CheckCircle className="h-3 w-3" /> : <FileClock className="h-3 w-3" />}
                                {prescription.isActive ? "Active" : "Completed"}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 sm:px-4">
                          <div className="space-y-4 pt-2 pb-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs sm:text-sm font-medium mb-1">Prescription Details</h4>
                                <div className="text-xs sm:text-sm space-y-2">
                                  <p className="flex items-center gap-1">
                                    <Pill className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Dosage:</span> {prescription.dosage}
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Frequency:</span> {prescription.frequency}
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <FileClock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Duration:</span> {prescription.duration}
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Start Date:</span> {new Date(prescription.startDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-xs sm:text-sm font-medium mb-1">Doctor Information</h4>
                                <p className="text-xs sm:text-sm">{prescription.doctorName}</p>
                                
                                {prescription.notes && (
                                  <div className="mt-3">
                                    <h4 className="text-xs sm:text-sm font-medium mb-1">Notes</h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{prescription.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 