import { Button } from '@/components/ui/button';

interface AppointmentFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function AppointmentFilters({
  currentFilter,
  onFilterChange
}: AppointmentFiltersProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant={currentFilter === 'all' ? 'default' : 'outline'} 
        onClick={() => onFilterChange('all')}
        className={`hover:bg-muted ${currentFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
        size="sm"
      >
        All
      </Button>
      <Button 
        variant={currentFilter === 'upcoming' ? 'default' : 'outline'}
        onClick={() => onFilterChange('upcoming')}
        className={`hover:bg-muted ${currentFilter === 'upcoming' ? 'bg-primary text-primary-foreground' : ''}`}
        size="sm"
      >
        Upcoming
      </Button>
      <Button 
        variant={currentFilter === 'completed' ? 'default' : 'outline'}
        onClick={() => onFilterChange('completed')}
        className={`hover:bg-muted ${currentFilter === 'completed' ? 'bg-primary text-primary-foreground' : ''}`}
        size="sm"
      >
        Completed
      </Button>
      <Button 
        variant={currentFilter === 'cancelled' ? 'default' : 'outline'}
        onClick={() => onFilterChange('cancelled')}
        className={`hover:bg-muted ${currentFilter === 'cancelled' ? 'bg-primary text-primary-foreground' : ''}`}
        size="sm"
      >
        Cancelled
      </Button>
    </div>
  );
} 