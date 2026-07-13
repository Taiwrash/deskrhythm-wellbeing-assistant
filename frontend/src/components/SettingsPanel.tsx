import { useState, useEffect } from 'react';
import { Loader2, Settings, Trash2, Volume2, VolumeX, Mail, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useGetNotificationPreferences,
  useSaveNotificationPreferences,
  useResetWellbeingAssistant,
  useGetCallerUserProfile,
  useUpdateSummaryFrequency,
} from '../hooks/useQueries';
import { SummaryFrequency } from '../backend';
import { toast } from 'sonner';
import { useSound } from '../contexts/SoundContext';
import TrackingStatusBanner from './TrackingStatusBanner';

export default function SettingsPanel() {
  const { data: preferences } = useGetNotificationPreferences();
  const { data: userProfile } = useGetCallerUserProfile();
  const savePreferences = useSaveNotificationPreferences();
  const updateFrequency = useUpdateSummaryFrequency();
  const resetAssistant = useResetWellbeingAssistant();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { volume, isMuted, setVolume, setIsMuted, playBreakSound } = useSound();

  const [standInterval, setStandInterval] = useState('30');
  const [walkInterval, setWalkInterval] = useState('60');
  const [stretchInterval, setStretchInterval] = useState('45');
  const [eyeRestInterval, setEyeRestInterval] = useState('20');
  const [postureResetInterval, setPostureResetInterval] = useState('40');
  const [localVolume, setLocalVolume] = useState([volume]);
  const [localMuted, setLocalMuted] = useState(isMuted);
  const [summaryFrequency, setSummaryFrequency] = useState<SummaryFrequency>(SummaryFrequency.daily);

  useEffect(() => {
    if (preferences) {
      setStandInterval(Number(preferences.standInterval).toString());
      setWalkInterval(Number(preferences.walkInterval).toString());
      setStretchInterval(Number(preferences.stretchInterval).toString());
      setEyeRestInterval(Number(preferences.eyeRestInterval).toString());
      setPostureResetInterval(Number(preferences.postureResetInterval).toString());
      setLocalVolume([Number(preferences.notificationVolume)]);
      setLocalMuted(preferences.notificationMuted);
      setVolume(Number(preferences.notificationVolume));
      setIsMuted(preferences.notificationMuted);
    }
  }, [preferences]);

  useEffect(() => {
    if (userProfile?.summaryFrequency) {
      setSummaryFrequency(userProfile.summaryFrequency);
    }
  }, [userProfile]);

  const handleVolumeChange = (value: number[]) => {
    setLocalVolume(value);
    setVolume(value[0]);
  };

  const handleMuteToggle = (checked: boolean) => {
    setLocalMuted(checked);
    setIsMuted(checked);
  };

  const handleSave = async () => {
    try {
      await savePreferences.mutateAsync({
        standInterval: BigInt(parseInt(standInterval) || 30),
        walkInterval: BigInt(parseInt(walkInterval) || 60),
        stretchInterval: BigInt(parseInt(stretchInterval) || 45),
        eyeRestInterval: BigInt(parseInt(eyeRestInterval) || 20),
        postureResetInterval: BigInt(parseInt(postureResetInterval) || 40),
        notificationVolume: BigInt(localVolume[0]),
        notificationMuted: localMuted,
      });
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Save preferences error:', error);
    }
  };

  const handleSummaryFrequencyChange = async (value: string) => {
    const newFrequency = value as SummaryFrequency;
    setSummaryFrequency(newFrequency);
    
    try {
      await updateFrequency.mutateAsync(newFrequency);
      toast.success('Summary frequency updated');
      
      // Show info about email feature
      toast.info('Email summaries are available for paid users once email is enabled', {
        duration: 5000,
      });
    } catch (error) {
      toast.error('Failed to update summary frequency');
      console.error('Update frequency error:', error);
    }
  };

  const handleReset = async () => {
    try {
      await resetAssistant.mutateAsync();
      toast.success('All data has been reset');
      setResetDialogOpen(false);
    } catch (error) {
      toast.error('Failed to reset data');
      console.error('Reset error:', error);
    }
  };

  const testSound = () => {
    playBreakSound();
  };

  return (
    <>
      <div className="space-y-6">
        <TrackingStatusBanner />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Customize how often you receive break reminders (in minutes)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stand">Stand Reminder</Label>
                <Input
                  id="stand"
                  type="number"
                  min="1"
                  value={standInterval}
                  onChange={(e) => setStandInterval(e.target.value)}
                  disabled={savePreferences.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="walk">Walk Reminder</Label>
                <Input
                  id="walk"
                  type="number"
                  min="1"
                  value={walkInterval}
                  onChange={(e) => setWalkInterval(e.target.value)}
                  disabled={savePreferences.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stretch">Stretch Reminder</Label>
                <Input
                  id="stretch"
                  type="number"
                  min="1"
                  value={stretchInterval}
                  onChange={(e) => setStretchInterval(e.target.value)}
                  disabled={savePreferences.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eyeRest">Eye Rest Reminder</Label>
                <Input
                  id="eyeRest"
                  type="number"
                  min="1"
                  value={eyeRestInterval}
                  onChange={(e) => setEyeRestInterval(e.target.value)}
                  disabled={savePreferences.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postureReset">Posture Reset Reminder</Label>
                <Input
                  id="postureReset"
                  type="number"
                  min="1"
                  value={postureResetInterval}
                  onChange={(e) => setPostureResetInterval(e.target.value)}
                  disabled={savePreferences.isPending}
                />
              </div>
            </div>
            <Button onClick={handleSave} disabled={savePreferences.isPending} className="w-full">
              {savePreferences.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {localMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              Sound Settings
            </CardTitle>
            <CardDescription>
              Control notification and reminder sounds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="mute" className="flex flex-col gap-1">
                <span>Mute Sounds</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Disable all notification sounds
                </span>
              </Label>
              <Switch
                id="mute"
                checked={localMuted}
                onCheckedChange={handleMuteToggle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={localVolume}
                  onValueChange={handleVolumeChange}
                  disabled={localMuted}
                  className="flex-1"
                />
                <span className="w-12 text-sm font-medium">{localVolume[0]}%</span>
              </div>
            </div>
            <Button
              onClick={testSound}
              variant="outline"
              className="w-full"
              disabled={localMuted}
            >
              Test Sound
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              AI Performance Summary
            </CardTitle>
            <CardDescription>
              Receive intelligent curated summaries of your wellbeing performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="summaryFrequency">Summary Frequency</Label>
              <Select
                value={summaryFrequency}
                onValueChange={handleSummaryFrequencyChange}
                disabled={updateFrequency.isPending}
              >
                <SelectTrigger id="summaryFrequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SummaryFrequency.daily}>Daily</SelectItem>
                  <SelectItem value={SummaryFrequency.weekly}>Weekly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how often you'd like to receive intelligent curated summaries analyzing your activity sessions, reflections, and wellbeing data.
              </p>
            </div>
            
            <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-blue-900 dark:text-blue-100">
                Email summaries are available for paid users once email is enabled. Your summary preference is saved and will be used when this feature becomes available.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Reset all your data including sessions, reflections, and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setResetDialogOpen(true)}
              className="w-full"
            >
              Reset All Data
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your sessions,
              reflections, and preferences.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
