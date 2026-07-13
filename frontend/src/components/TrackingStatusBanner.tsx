import { Activity, Clock, Coffee } from 'lucide-react';
import { useActivityStore } from '../stores/activityStore';
import { Card, CardContent } from '@/components/ui/card';

export default function TrackingStatusBanner() {
  const { isTracking, isPaused, elapsedTime, breaksTaken, nextBreakTime } = useActivityStore();

  if (!isTracking) {
    return null;
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const displayMinutes = minutes % 60;
    const displaySeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
    }
    return `${displayMinutes}:${displaySeconds.toString().padStart(2, '0')}`;
  };

  const minutesToBreak = nextBreakTime && !isPaused
    ? Math.max(0, Math.ceil((nextBreakTime - Date.now()) / 60000))
    : null;

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardContent className="py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {isPaused ? 'Tracking Paused' : 'Tracking Active'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coffee className="h-4 w-4 text-muted-foreground" />
              <span>{breaksTaken} breaks</span>
            </div>
            {minutesToBreak !== null && (
              <div className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
                Next break in {minutesToBreak}m
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
