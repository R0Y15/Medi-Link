import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Clock } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';

interface Appointment {
  _id: Id<"appointments">;
  doctorName: string;
  speciality: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule?: (id: Id<"appointments">) => void;
  onCancel?: (id: Id<"appointments">) => void;
  onViewDetails?: (id: Id<"appointments">) => void;
}

export function AppointmentCard({ 
  appointment,
  onReschedule,
  onCancel,
  onViewDetails
}: AppointmentCardProps) {
  // Get a variant name based on status
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

  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
            <p className="text-sm text-muted-foreground">{appointment.speciality}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{appointment.startTime} - {appointment.endTime}</span>
            </div>
            <Badge variant={getStatusVariant(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onReschedule?.(appointment._id)}
            >
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onViewDetails?.(appointment._id)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-500 focus:text-red-500"
              onClick={() => onCancel?.(appointment._id)}
            >
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
} 