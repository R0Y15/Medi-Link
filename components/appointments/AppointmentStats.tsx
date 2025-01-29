import { Skeleton } from '@/components/ui/skeleton';

interface AppointmentStatsProps {
  todayCount: number;
  upcomingCount: number;
  monthlyCount: number;
  loading: boolean;
}

export function AppointmentStats({
  todayCount,
  upcomingCount,
  monthlyCount,
  loading
}: AppointmentStatsProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Today&apos;s Appointments</span>
        <span className="text-2xl font-bold">
          {loading ? <Skeleton className="h-8 w-8" /> : todayCount}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Upcoming</span>
        <span className="text-2xl font-bold">
          {loading ? <Skeleton className="h-8 w-8" /> : upcomingCount}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">This Month</span>
        <span className="text-2xl font-bold">
          {loading ? <Skeleton className="h-8 w-8" /> : monthlyCount}
        </span>
      </div>
    </div>
  );
} 