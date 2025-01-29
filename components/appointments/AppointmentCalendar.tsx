import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

interface Appointment {
  id: string;
  doctorName: string;
  startTime: string;
}

interface AppointmentCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  selectedDateAppointments: Appointment[];
}

export function AppointmentCalendar({
  selectedDate,
  onSelectDate,
  selectedDateAppointments
}: AppointmentCalendarProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Select Date</h3>
      <Calendar 
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="w-full"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center mb-4",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
          head_row: "flex justify-between w-full",
          head_cell: "w-9 text-[13px] font-medium text-muted-foreground",
          row: "flex w-full justify-between mt-1",
          cell: "relative p-0 text-center",
          day: "h-9 w-9 p-0 font-normal text-[13px] aria-selected:opacity-100 hover:bg-muted rounded-md flex items-center justify-center",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
      />
      {selectedDate && selectedDateAppointments.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Appointments for {selectedDate.toLocaleDateString()}</h4>
          {selectedDateAppointments.map((appointment) => (
            <div key={appointment.id} className="text-sm text-muted-foreground">
              {appointment.startTime} - {appointment.doctorName}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
} 