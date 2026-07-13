import { Sparkles, Quote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardStats } from '../hooks/useQueries';

export default function AIInsightsCard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const motivationalQuote = stats?.motivationalQuote || 'Keep going. The best is yet to come.';
  const reflectionPrompt = stats?.reflectionPromptTemplate || 'How do you feel after taking regular breaks?';

  return (
    <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img
            src="/assets/generated/ai-insights-icon-transparent.dim_64x64.png"
            alt="Daily Rhythm Insight"
            className="h-6 w-6"
          />
          Daily Rhythm Insight - Ambient Intelligence(AI)
        </CardTitle>
        <CardDescription>Personalized recommendations based on your wellbeing data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Motivational Quote */}
        <div className="rounded-lg border bg-background/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Quote className="h-4 w-4" />
            Daily Motivation
          </div>
          <p className="text-lg font-medium leading-relaxed">{motivationalQuote}</p>
        </div>

        {/* Reflection Prompt */}
        <div className="rounded-lg border bg-background/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            Reflection Prompt
          </div>
          <p className="leading-relaxed text-muted-foreground">{reflectionPrompt}</p>
        </div>

        {/* Adaptive Suggestions */}
        {stats && stats.totalSessions > 0n && (
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <img
                src="/assets/generated/motivation-icon-transparent.dim_64x64.png"
                alt="Motivation"
                className="h-4 w-4"
              />
              Smart Recommendation
            </div>
            <p className="text-sm leading-relaxed">
              {Number(stats.averageSittingDuration) > 3600000
                ? "Your sitting sessions are quite long. Consider taking more frequent breaks to stay energized."
                : Number(stats.totalBreaks) > 5
                ? "Excellent work on taking breaks! Your body appreciates the movement."
                : "You're building great habits. Keep up the momentum with regular breaks."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
