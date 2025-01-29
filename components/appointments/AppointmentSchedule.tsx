import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Appointment {
  id: string;
  doctorName: string;
  startTime: string;
  endTime: string;
}

interface AppointmentScheduleProps {
  appointments: Appointment[];
  loading: boolean;
}

export function AppointmentSchedule({
  appointments,
  loading
}: AppointmentScheduleProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Today&apos;s Schedule</h3>
      <div className="space-y-4">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div className="flex gap-3" key={i}>
              <Skeleton className="h-12 w-1" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))
        ) : appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments today</p>
        ) : (
          appointments.map((appointment) => (
            <div className="flex gap-3" key={appointment.id}>
              <div className="w-1 bg-blue-500 rounded"></div>
              <div>
                <p className="text-sm font-medium">
                  {appointment.startTime} - {appointment.endTime}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.doctorName}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
} 