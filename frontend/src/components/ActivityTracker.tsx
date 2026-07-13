import { useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSaveSession, useGetNotificationPreferences } from '../hooks/useQueries';
import { toast } from 'sonner';
import BreakNotification from './BreakNotification';
import { useActivityStore } from '../stores/activityStore';
import { useSound } from '../contexts/SoundContext';

type BreakType = 'stand' | 'walk' | 'stretch' | 'eyeRest' | 'postureReset';

const breakActions: Record<BreakType, { label: string; duration: number; icon: string }> = {
  stand: { label: 'Stand for 2 minutes', duration: 2, icon: '🧍' },
  walk: { label: 'Take a short walk', duration: 5, icon: '🚶' },
  stretch: { label: 'Stretch your body', duration: 3, icon: '🤸' },
  eyeRest: { label: 'Rest your eyes', duration: 1, icon: '👁️' },
  postureReset: { label: 'Reset your posture', duration: 1, icon: '🪑' },
};

export default function ActivityTracker() {
  const {
    isTracking,
    isPaused,
    sessionStart,
    elapsedTime,
    pausedTime,
    breaksTaken,
    nextBreakTime,
    suggestedBreak,
    aiSuggestion,
    showBreakNotification,
    setIsTracking,
    setIsPaused,
    setSessionStart,
    setElapsedTime,
    setPausedTime,
    incrementBreaksTaken,
    setLastActivityTime,
    setNextBreakTime,
    setSuggestedBreak,
    setAiSuggestion,
    setShowBreakNotification,
    resetSession,
  } = useActivityStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { playBreakSound } = useSound();

  const saveSession = useSaveSession();
  const { data: preferences } = useGetNotificationPreferences();

  const defaultIntervals = {
    stand: 30,
    walk: 60,
    stretch: 45,
    eyeRest: 20,
    postureReset: 40,
  };

  const getInterval = (type: BreakType): number => {
    if (!preferences) return defaultIntervals[type];
    const intervalMap: Record<BreakType, bigint> = {
      stand: preferences.standInterval,
      walk: preferences.walkInterval,
      stretch: preferences.stretchInterval,
      eyeRest: preferences.eyeRestInterval,
      postureReset: preferences.postureResetInterval,
    };
    return Number(intervalMap[type]);
  };

  const generateAISuggestion = useCallback(() => {
    const minutes = Math.floor(elapsedTime / 60000);
    
    if (minutes >= 45 && breaksTaken === 0) {
      return "Stretch now — your body's been still for 45 min";
    } else if (minutes >= 60) {
      return "Take a mindful walk — you've done great today";
    } else if (breaksTaken >= 3) {
      return "Excellent work on taking breaks! Keep it up";
    } else if (minutes >= 30) {
      return "Consider a quick break to refresh your mind";
    }
    return "Stay mindful of your posture and take breaks";
  }, [elapsedTime, breaksTaken]);

  useEffect(() => {
    if (isTracking && !isPaused) {
      setAiSuggestion(generateAISuggestion());
    }
  }, [isTracking, isPaused, elapsedTime, breaksTaken, generateAISuggestion, setAiSuggestion]);

  const determineNextBreak = useCallback((): BreakType => {
    const breaks: BreakType[] = ['stand', 'walk', 'stretch', 'eyeRest', 'postureReset'];
    return breaks[Math.floor(Math.random() * breaks.length)];
  }, []);

  const scheduleNextBreak = useCallback(() => {
    const nextBreak = determineNextBreak();
    const interval = getInterval(nextBreak);
    const nextTime = Date.now() + interval * 60 * 1000;
    setSuggestedBreak(nextBreak);
    setNextBreakTime(nextTime);
  }, [determineNextBreak, setSuggestedBreak, setNextBreakTime]);

  useEffect(() => {
    if (isTracking && !isPaused && !nextBreakTime) {
      scheduleNextBreak();
    }
  }, [isTracking, isPaused, nextBreakTime, scheduleNextBreak]);

  // Global timer that runs continuously when tracking - persists across tab switches
  useEffect(() => {
    if (!isTracking || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Sync elapsed time immediately when component mounts
    if (sessionStart) {
      setElapsedTime(Date.now() - sessionStart - pausedTime);
    }

    timerRef.current = setInterval(() => {
      if (sessionStart) {
        const currentElapsed = Date.now() - sessionStart - pausedTime;
        setElapsedTime(currentElapsed);
      }

      // Check if it's time for a break notification
      if (nextBreakTime && Date.now() >= nextBreakTime && !showBreakNotification) {
        setShowBreakNotification(true);
        playBreakSound();
        setNextBreakTime(null);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTracking, isPaused, sessionStart, pausedTime, nextBreakTime, showBreakNotification, setElapsedTime, setNextBreakTime, setShowBreakNotification, playBreakSound]);

  // Activity tracking listeners - continue across all tabs
  useEffect(() => {
    if (!isTracking) return;

    const handleActivity = () => {
      setLastActivityTime(Date.now());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isTracking, setLastActivityTime]);

  const startTracking = () => {
    setIsTracking(true);
    setIsPaused(false);
    setSessionStart(Date.now());
    setElapsedTime(0);
    setPausedTime(0);
    setLastActivityTime(Date.now());
    scheduleNextBreak();
    toast.success('Activity tracking started');
  };

  const pauseTracking = () => {
    setIsPaused(true);
    const pauseStart = Date.now();
    setPausedTime(pausedTime + (pauseStart - (sessionStart || 0) - elapsedTime));
    toast.info('Activity tracking paused');
  };

  const resumeTracking = () => {
    setIsPaused(false);
    if (!nextBreakTime) {
      scheduleNextBreak();
    }
    toast.success('Activity tracking resumed');
  };

  const endSession = async () => {
    if (!sessionStart) return;

    const endTime = Date.now();
    const duration = elapsedTime;

    try {
      await saveSession.mutateAsync({
        startTime: BigInt(sessionStart * 1_000_000),
        endTime: BigInt(endTime * 1_000_000),
        duration: BigInt(duration),
        breaksTaken: BigInt(breaksTaken),
        suggestedAction: breakActions[suggestedBreak].label,
      });

      toast.success('Session saved successfully');
      resetSession();
    } catch (error) {
      toast.error('Failed to save session');
      console.error('Save session error:', error);
    }
  };

  const handleBreakTaken = () => {
    incrementBreaksTaken();
    setShowBreakNotification(false);
    scheduleNextBreak();
    toast.success('Great job taking a break!');
  };

  const handleBreakSkipped = () => {
    setShowBreakNotification(false);
    scheduleNextBreak();
  };

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

  const getProgressPercentage = () => {
    if (!nextBreakTime || !sessionStart) return 0;
    const totalInterval = nextBreakTime - (sessionStart + elapsedTime - (Date.now() - sessionStart));
    const elapsed = Date.now() - (nextBreakTime - totalInterval);
    return Math.min((elapsed / totalInterval) * 100, 100);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Activity Tracker</CardTitle>
          <CardDescription>Monitor your sitting time and take regular breaks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="mb-2 text-6xl font-bold tabular-nums tracking-tight">
              {formatTime(elapsedTime)}
            </div>
            <p className="text-sm text-muted-foreground">
              {isTracking
                ? isPaused
                  ? 'Tracking paused'
                  : 'Current session time'
                : 'Ready to start tracking'}
            </p>
          </div>

          {/* AI Suggestion */}
          {isTracking && !isPaused && aiSuggestion && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed">{aiSuggestion}</p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isTracking && !isPaused && nextBreakTime && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next break:</span>
                <span className="font-medium">{breakActions[suggestedBreak].label}</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{breaksTaken}</div>
              <p className="text-xs text-muted-foreground">Breaks taken</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {nextBreakTime && isTracking && !isPaused
                  ? Math.max(0, Math.ceil((nextBreakTime - Date.now()) / 60000))
                  : '-'}
              </div>
              <p className="text-xs text-muted-foreground">Minutes to break</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isTracking ? (
              <Button onClick={startTracking} className="flex-1 gap-2" size="lg">
                <Play className="h-5 w-5" />
                Start Tracking
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button onClick={resumeTracking} className="flex-1 gap-2" size="lg">
                    <Play className="h-5 w-5" />
                    Resume
                  </Button>
                ) : (
                  <Button onClick={pauseTracking} variant="outline" className="flex-1 gap-2" size="lg">
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                )}
                <Button
                  onClick={endSession}
                  variant="default"
                  className="flex-1 gap-2"
                  size="lg"
                  disabled={saveSession.isPending}
                >
                  <RotateCcw className="h-5 w-5" />
                  End Session
                </Button>
              </>
            )}
          </div>

          {isTracking && !isPaused && (
            <Button
              onClick={handleBreakTaken}
              variant="secondary"
              className="w-full gap-2"
              size="lg"
            >
              <Coffee className="h-5 w-5" />
              I Took a Break
            </Button>
          )}
        </CardContent>
      </Card>

      <BreakNotification
        open={showBreakNotification}
        onOpenChange={setShowBreakNotification}
        breakType={suggestedBreak}
        onTakeBreak={handleBreakTaken}
        onSkip={handleBreakSkipped}
      />
    </>
  );
}
