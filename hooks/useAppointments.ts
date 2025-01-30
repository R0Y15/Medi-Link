import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useAppointments = () => {
  // Queries
  const appointments = useQuery(api.appointments.getAll);

  // Mutations
  const createAppointment = useMutation(api.appointments.create);
  const updateAppointment = useMutation(api.appointments.update);
  const deleteAppointment = useMutation(api.appointments.remove);

  return {
    // Data
    appointments,
    
    // Mutations
    createAppointment: async (data: {
      appointmentDate: string;
      doctorName: string;
      startTime: string;
      endTime: string;
      patientName: string;
      speciality: string;
      status: string;
      symptoms?: string;
      type?: string;
      notes?: string;
    }) => {
      return await createAppointment(data);
    },

    updateAppointment: async (id: Id<"appointments">, data: Partial<{
      appointmentDate: string;
      doctorName: string;
      startTime: string;
      endTime: string;
      patientName: string;
      speciality: string;
      status: string;
      symptoms: string;
      type: string;
      notes: string;
    }>) => {
      return await updateAppointment({ id, ...data });
    },

    deleteAppointment: async (id: Id<"appointments">) => {
      return await deleteAppointment({ id });
    }
  };
}; 