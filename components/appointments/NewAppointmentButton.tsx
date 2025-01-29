import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppointments } from './useAppointments';
import { toast } from 'sonner';

export function NewAppointmentButton() {
  const { createAppointment } = useAppointments();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    doctorName: '',
    speciality: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    try {
      setLoading(true);
      await createAppointment({
        ...formData,
        date
      });
      
      toast.success('Appointment created successfully');
      setOpen(false);
      setDate(undefined);
      setFormData({
        doctorName: '',
        speciality: '',
        time: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to create appointment');
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary/90">
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a new appointment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select 
                value={formData.doctorName}
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, doctorName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Ashton Cleve">Dr. Ashton Cleve</SelectItem>
                  <SelectItem value="Dr. Kyle Eloise">Dr. Kyle Eloise</SelectItem>
                  <SelectItem value="Dr. Sarah Chen">Dr. Sarah Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speciality">Speciality</Label>
              <Select
                value={formData.speciality}
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, speciality: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select speciality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Neuro">Neuro</SelectItem>
                  <SelectItem value="Lungs">Lungs</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="border rounded-md p-3">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full"
                  classNames={{
                    months: "flex flex-col space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center mb-2",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse",
                    head_row: "flex w-full justify-between",
                    head_cell: "w-8 text-[0.8rem] font-medium text-muted-foreground",
                    row: "flex w-full justify-between mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    day: "h-8 w-8 p-0 font-normal text-sm aria-selected:opacity-100 hover:bg-muted rounded-md flex items-center justify-center",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={formData.time}
                onValueChange={(value: string) => setFormData(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-4">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes..."
                  className="h-[180px] mt-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading || !date || !formData.doctorName || !formData.speciality || !formData.time}
            >
              {loading ? 'Creating...' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 