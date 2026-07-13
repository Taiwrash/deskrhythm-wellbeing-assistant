import { useState } from 'react';
import { Activity, Coffee, Eye, Heart, Settings, TrendingUp, Sparkles, Smartphone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetDashboardStats, useGetCallerUserProfile } from '../hooks/useQueries';
import LoginButton from '../components/LoginButton';
import ActivityTracker from '../components/ActivityTracker';
import ReflectionHistory from '../components/ReflectionHistory';
import SettingsPanel from '../components/SettingsPanel';
import DailyReflectionDialog from '../components/DailyReflectionDialog';
import AIInsightsCard from '../components/AIInsightsCard';
import SocialMediaTracker from '../components/SocialMediaTracker';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useGetDashboardStats();
  const [showReflectionDialog, setShowReflectionDialog] = useState(false);

  const isAuthenticated = !!identity;

  const formatDuration = (milliseconds: bigint) => {
    const minutes = Number(milliseconds) / (1000 * 60);
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
          <div className="breathing-circle absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="breathing-circle-delayed absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 flex items-center justify-center">
            <img
              src="/assets/generated/meditation-figure.dim_200x200.png"
              alt="Meditation"
              className="h-32 w-32 opacity-80"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Welcome to DeskRhythm
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Your gentle companion for managing sitting time and screen breaks. Take care of your wellbeing, one mindful moment at a time.
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  if (statsLoading && !stats) {
    return <LoadingSpinner message="Loading your dashboard..." timeout={10000} />;
  }

  const showErrorAlert = statsError && !stats;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 text-center md:mb-12">
        <div className="mb-4 flex items-center justify-center gap-2">
          <img
            src="/assets/generated/breathing-icon-transparent.dim_64x64.png"
            alt="Breathing"
            className="breathing-icon h-12 w-12"
          />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
          Hello, {userProfile?.name || 'Friend'}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Let's take care of your wellbeing together
        </p>
      </div>

      <div className="mb-8 text-center">
        <p className="text-xl font-medium tracking-tight text-foreground/90">
          Your health is part of your workflow.
        </p>
      </div>

      {showErrorAlert && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load dashboard statistics</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>There was an error loading your data. You can still use the app, but some stats may not be available.</span>
            <Button variant="outline" size="sm" onClick={() => refetchStats()} className="ml-4">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <AIInsightsCard />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? Number(stats.totalSessions) : 0}</div>
            <p className="text-xs text-muted-foreground">Tracking your rhythm</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Breaks Taken</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? Number(stats.totalBreaks) : 0}</div>
            <p className="text-xs text-muted-foreground">Moments of rest</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sitting Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatDuration(stats.averageSittingDuration) : '0m'}
            </div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Body Feeling</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats && stats.averageBodyFeeling > 0n
                ? `${Number(stats.averageBodyFeeling)}/10`
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tracker">Activity</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="reflections">Reflections</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          <ActivityTracker />
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <SocialMediaTracker />
        </TabsContent>

        <TabsContent value="reflections" className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Your Reflections</h2>
              <p className="text-sm text-muted-foreground">Track how your body feels over time</p>
            </div>
            <Button onClick={() => setShowReflectionDialog(true)} className="gap-2">
              <Eye className="h-4 w-4" />
              Add Reflection
            </Button>
          </div>
          <ReflectionHistory />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SettingsPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Built for marketers, developers, designers, and anyone who forgets to stand.
        </p>
      </div>

      <DailyReflectionDialog open={showReflectionDialog} onOpenChange={setShowReflectionDialog} />
    </div>
  );
}
