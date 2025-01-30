import { useState, useCallback } from 'react';
import { useAppointments as useConvexAppointments } from '@/hooks/useAppointments';
import { Id } from '@/convex/_generated/dataModel';

export interface Appointment {
  _id: Id<"appointments">;
  patientName: string;
  doctorName: string;
  speciality: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  symptoms?: string;
  notes?: string;
  type?: string;
}

interface NewAppointment {
  doctorName: string;
  speciality: string;
  date: Date;
  time: string;
  notes: string;
}

export function useAppointments() {
  const convexAppointments = useConvexAppointments();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState<string>('all');

  // No need for fetchAppointments as Convex automatically syncs data
  const fetchAppointments = useCallback(() => {
    // This is now a no-op as Convex handles data syncing
  }, []);

  const createAppointment = async (newAppointment: NewAppointment) => {
    try {
      const [hours, minutes] = newAppointment.time.split(':');
      const startTime = `${hours}:${minutes}`;
      const endTime = `${parseInt(hours) + 1}:${minutes}`;

      return await convexAppointments.createAppointment({
        doctorName: newAppointment.doctorName,
        speciality: newAppointment.speciality,
        appointmentDate: newAppointment.date.toISOString().split('T')[0],
        startTime,
        endTime,
        patientName: "Test Patient", // TODO: Get from auth context
        status: 'upcoming',
        notes: newAppointment.notes,
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const cancelAppointment = async (id: Id<"appointments">) => {
    try {
      await convexAppointments.updateAppointment(id, { status: 'cancelled' });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  };

  const rescheduleAppointment = async (id: Id<"appointments">, newDate: Date, newTime: string) => {
    try {
      const [hours, minutes] = newTime.split(':');
      const startTime = `${hours}:${minutes}`;
      const endTime = `${parseInt(hours) + 1}:${minutes}`;

      await convexAppointments.updateAppointment(id, {
        appointmentDate: newDate.toISOString().split('T')[0],
        startTime,
        endTime,
      });
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  };

  const appointments = convexAppointments.appointments || [];

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status.toLowerCase() === filter.toLowerCase();
  });

  const todaysAppointments = appointments.filter(appointment => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.appointmentDate === today;
  });

  const upcomingAppointments = appointments.filter(appointment => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.appointmentDate > today;
  });

  const selectedDateAppointments = appointments.filter(appointment => {
    if (!selectedDate) return false;
    return appointment.appointmentDate === selectedDate.toISOString().split('T')[0];
  });

  return {
    appointments: filteredAppointments,
    todaysAppointments,
    upcomingAppointments,
    selectedDateAppointments,
    loading: false, // Convex handles loading states
    error: null, // Convex handles errors
    selectedDate,
    setSelectedDate,
    filter,
    setFilter,
    fetchAppointments,
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
  };
} 