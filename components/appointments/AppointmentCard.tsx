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

interface Appointment {
  id: string;
  doctorName: string;
  speciality: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function AppointmentCard({ 
  appointment,
  onReschedule,
  onCancel,
  onViewDetails
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
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
            <Badge 
              className={`border-0 ${getStatusColor(appointment.status)}`}
            >
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
              onClick={() => onReschedule?.(appointment.id)}
            >
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onViewDetails?.(appointment.id)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-500 focus:text-red-500"
              onClick={() => onCancel?.(appointment.id)}
            >
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
} 