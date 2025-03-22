import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, Stethoscope, FileText } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';

interface Appointment {
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

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsModal({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const getStatusVariant = (status: string): "default" | "outline" | "secondary" | "destructive" | "success" | "warning" => {
    // Normalize the status by trimming whitespace and converting to lowercase
    const normalizedStatus = status.trim().toLowerCase();
    
    switch (normalizedStatus) {
      case 'upcoming':
        return 'default'; // Blue is the default variant (primary color)
      case 'scheduled':
        return 'warning'; // Yellow variant
      case 'completed':
        return 'success'; // Green variant
      case 'cancelled':
      case 'canceled':
        return 'destructive'; // Red variant
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <Badge variant={getStatusVariant(appointment.status)}>
              {appointment.status}
            </Badge>
            {appointment.type && (
              <Badge variant="outline">
                {appointment.type}
              </Badge>
            )}
          </div>

          {/* Doctor Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">Patient</span>
            </div>
            <p className="text-lg font-medium pl-6">{appointment.patientName}</p>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Stethoscope className="h-4 w-4" />
              <span className="text-sm">Doctor</span>
            </div>
            <div className="pl-6">
              <p className="text-lg font-medium">{appointment.doctorName}</p>
              <p className="text-sm text-muted-foreground">{appointment.speciality}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Date</span>
            </div>
            <p className="text-base pl-6">{formatDate(appointment.appointmentDate)}</p>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Time</span>
            </div>
            <p className="text-base pl-6">{appointment.startTime} - {appointment.endTime}</p>
          </div>

          {/* Additional Info */}
          {(appointment.symptoms || appointment.notes) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Additional Information</span>
              </div>
              <div className="pl-6 space-y-2">
                {appointment.symptoms && (
                  <div>
                    <p className="text-sm text-muted-foreground">Symptoms</p>
                    <p className="text-base">{appointment.symptoms}</p>
                  </div>
                )}
                {appointment.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-base">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 