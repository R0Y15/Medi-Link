import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentCard } from './AppointmentCard';
import { Id } from '@/convex/_generated/dataModel';

interface Appointment {
  _id: Id<"appointments">;
  doctorName: string;
  speciality: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  loading: boolean;
  onReschedule: (id: Id<"appointments">) => void;
  onCancel: (id: Id<"appointments">) => void;
  onViewDetails: (id: Id<"appointments">) => void;
}

export function AppointmentList({ 
  appointments,
  loading,
  onReschedule,
  onCancel,
  onViewDetails
}: AppointmentListProps) {
  if (loading) {
    return (
      <div className="flex-[0.7] space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card className="p-4" key={i}>
            <div className="space-y-3">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-lg font-medium mb-2">No appointments found</h3>
        <p className="text-sm text-muted-foreground">
          There are no appointments matching your current filters.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex-[0.7] space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          onReschedule={onReschedule}
          onCancel={onCancel}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
} 