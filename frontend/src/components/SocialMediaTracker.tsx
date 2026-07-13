import { useState, useEffect } from 'react';
import { Smartphone, Target, TrendingDown, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useGetSocialMediaGoal, useSetSocialMediaGoal } from '../hooks/useQueries';
import { toast } from 'sonner';
import TrackingStatusBanner from './TrackingStatusBanner';

export default function SocialMediaTracker() {
  const { data: goal } = useGetSocialMediaGoal();
  const setGoal = useSetSocialMediaGoal();

  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [dailyLimit, setDailyLimit] = useState('30');
  const [mindfulBreaks, setMindfulBreaks] = useState('3');
  const [currentUsage, setCurrentUsage] = useState(0);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  useEffect(() => {
    if (goal) {
      setDailyLimit(Number(goal.dailyLimit).toString());
      setMindfulBreaks(Number(goal.mindfulBreaks).toString());
      setTrackingEnabled(true);
    }
  }, [goal]);

  useEffect(() => {
    if (!trackingEnabled || !sessionStart) return;

    const interval = setInterval(() => {
      setCurrentUsage(Math.floor((Date.now() - sessionStart) / 60000));
    }, 1000);

    return () => clearInterval(interval);
  }, [trackingEnabled, sessionStart]);

  const handleSaveGoal = async () => {
    try {
      await setGoal.mutateAsync({
        dailyLimit: BigInt(parseInt(dailyLimit) || 30),
        mindfulBreaks: BigInt(parseInt(mindfulBreaks) || 3),
      });
      toast.success('Social media goal saved successfully');
    } catch (error) {
      toast.error('Failed to save goal');
      console.error('Save goal error:', error);
    }
  };

  const handleToggleTracking = () => {
    if (!trackingEnabled) {
      setSessionStart(Date.now());
      setCurrentUsage(0);
      toast.success('Social media tracking started');
    } else {
      setSessionStart(null);
      setCurrentUsage(0);
      toast.info('Social media tracking stopped');
    }
    setTrackingEnabled(!trackingEnabled);
  };

  const usagePercentage = goal ? (currentUsage / Number(goal.dailyLimit)) * 100 : 0;
  const isOverLimit = goal && currentUsage >= Number(goal.dailyLimit);

  return (
    <div className="space-y-6">
      {/* Activity Tracking Status Banner */}
      <TrackingStatusBanner />

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Social Media Tracking
              </CardTitle>
              <CardDescription>
                Monitor and reduce your social media usage for better wellbeing
              </CardDescription>
            </div>
            <img
              src="/assets/generated/social-media-tracking.dim_200x200.png"
              alt="Social Media"
              className="h-16 w-16 opacity-80"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="tracking-toggle" className="text-base font-medium">
                Enable Tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                Track your social media usage time
              </p>
            </div>
            <Switch
              id="tracking-toggle"
              checked={trackingEnabled}
              onCheckedChange={handleToggleTracking}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Usage Card */}
      {trackingEnabled && (
        <Card className={isOverLimit ? 'border-destructive/50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Usage
            </CardTitle>
            <CardDescription>
              {isOverLimit
                ? 'You have exceeded your daily limit. Time for a mindful break!'
                : 'Keep track of your screen time'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold tabular-nums">
                {currentUsage}
                <span className="text-2xl text-muted-foreground"> min</span>
              </div>
              <p className="text-sm text-muted-foreground">
                of {goal ? Number(goal.dailyLimit) : dailyLimit} minutes daily limit
              </p>
            </div>
            <Progress
              value={Math.min(usagePercentage, 100)}
              className={`h-3 ${isOverLimit ? '[&>div]:bg-destructive' : ''}`}
            />
            {isOverLimit && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm">
                <img
                  src="/assets/generated/mindful-phone-break.dim_200x200.png"
                  alt="Mindful Break"
                  className="h-12 w-12"
                />
                <p className="flex-1">
                  <strong>Mindful moment:</strong> Consider taking a break from social media. Your wellbeing matters!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Goal Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Reduction Goals
          </CardTitle>
          <CardDescription>Set your daily limits and mindful break targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit (minutes)</Label>
              <Input
                id="dailyLimit"
                type="number"
                min="1"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                disabled={setGoal.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Maximum social media time per day
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mindfulBreaks">Mindful Breaks</Label>
              <Input
                id="mindfulBreaks"
                type="number"
                min="1"
                value={mindfulBreaks}
                onChange={(e) => setMindfulBreaks(e.target.value)}
                disabled={setGoal.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Number of breaks to take during usage
              </p>
            </div>
          </div>
          <Button onClick={handleSaveGoal} disabled={setGoal.isPending} className="w-full">
            {setGoal.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Goals
          </Button>

          {/* Tips Section */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <TrendingDown className="h-4 w-4" />
              Tips for Healthy Social Media Habits
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Set specific times for checking social media</li>
              <li>• Take mindful breaks every 15-20 minutes</li>
              <li>• Replace scrolling time with physical activity</li>
              <li>• Use app timers to enforce your limits</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
