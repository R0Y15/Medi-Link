"use client";

import React, { useEffect, useState } from 'react';
import { useAppointments } from '../../../components/appointments/useAppointments';
import { AppointmentList } from '../../../components/appointments/AppointmentList';
import { AppointmentStats } from '../../../components/appointments/AppointmentStats';
import { AppointmentCalendar } from '../../../components/appointments/AppointmentCalendar';
import { AppointmentSchedule } from '../../../components/appointments/AppointmentSchedule';
import { AppointmentFilters } from '../../../components/appointments/AppointmentFilters';
import { NewAppointmentButton } from '../../../components/appointments/NewAppointmentButton';
import { toast } from 'react-hot-toast';
import { AppointmentDetailsModal } from '../../../components/appointments/AppointmentDetailsModal';

interface Appointment {
  id: string;
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

const AppointmentsPage = () => {
  const {
    appointments,
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
    cancelAppointment,
    rescheduleAppointment,
  } = useAppointments();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleReschedule = async (id: string) => {
    try {
      // For now, we'll just reschedule to next day at same time
      const appointment = appointments.find(app => app.id === id);
      if (!appointment) return;

      const currentDate = new Date(appointment.appointmentDate);
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);

      await rescheduleAppointment(id, nextDay, appointment.startTime);
      toast.success('Appointment rescheduled successfully');
    } catch (error) {
      toast.error('Failed to reschedule appointment');
      console.error('Error rescheduling:', error);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error('Error cancelling:', error);
    }
  };

  const handleViewDetails = (id: string) => {
    const appointment = appointments.find(app => app.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setDetailsModalOpen(true);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Appointments</h1>
          <AppointmentStats
            todayCount={todaysAppointments.length}
            upcomingCount={upcomingAppointments.length}
            monthlyCount={appointments.length}
            loading={loading}
          />
        </div>
        
        <div className="flex gap-4 items-center">
          <AppointmentFilters
            currentFilter={filter}
            onFilterChange={setFilter}
          />
          <NewAppointmentButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        <AppointmentList
          appointments={appointments}
          loading={loading}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
          onViewDetails={handleViewDetails}
        />

        {/* Right Side */}
        <div className="flex-[0.3] space-y-6">
          <AppointmentCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedDateAppointments={selectedDateAppointments}
          />
          <AppointmentSchedule
            appointments={todaysAppointments}
            loading={loading}
          />
        </div>
      </div>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </div>
  );
};

export default AppointmentsPage;