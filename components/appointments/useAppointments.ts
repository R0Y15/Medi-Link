import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/constants';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  speciality: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  symptoms: string;
  notes: string;
  type: string;
}

interface NewAppointment {
  doctorName: string;
  speciality: string;
  date: Date;
  time: string;
  notes: string;
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState<string>('all');

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.appointments}`);
      const data = await response.json();
      setAppointments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAppointment = async (newAppointment: NewAppointment) => {
    try {
      const [hours, minutes] = newAppointment.time.split(':');
      const startTime = `${hours}:${minutes}`;
      const endTime = `${parseInt(hours) + 1}:${minutes}`;

      const appointmentToCreate = {
        doctorName: newAppointment.doctorName,
        speciality: newAppointment.speciality,
        appointmentDate: newAppointment.date.toISOString().split('T')[0],
        startTime,
        endTime,
        status: 'upcoming',
        notes: newAppointment.notes,
      };

      const response = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.appointments}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentToCreate),
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      const createdAppointment = await response.json();
      setAppointments(prev => [...prev, createdAppointment]);
      return createdAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.appointments}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      setAppointments(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: 'cancelled' } : app
        )
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  };

  const rescheduleAppointment = async (id: string, newDate: Date, newTime: string) => {
    try {
      const [hours, minutes] = newTime.split(':');
      const startTime = `${hours}:${minutes}`;
      const endTime = `${parseInt(hours) + 1}:${minutes}`;

      const response = await fetch(`${API_ENDPOINTS.baseUrl}${API_ENDPOINTS.appointments}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentDate: newDate.toISOString().split('T')[0],
          startTime,
          endTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule appointment');
      }

      const updatedAppointment = await response.json();
      setAppointments(prev =>
        prev.map(app => (app.id === id ? updatedAppointment : app))
      );
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  };

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
    loading,
    error,
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