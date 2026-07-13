import { Calendar, Heart, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllReflections, useDeleteReflection } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useState } from 'react';
import TrackingStatusBanner from './TrackingStatusBanner';
import type { ReflectionEntry } from '../backend';

export default function ReflectionHistory() {
  const { data: reflections, isLoading } = useGetAllReflections();
  const deleteReflection = useDeleteReflection();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState<{ id: bigint; index: number } | null>(null);

  const handleDelete = async () => {
    if (!selectedReflection) return;

    try {
      await deleteReflection.mutateAsync(selectedReflection.id);
      toast.success('Reflection deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedReflection(null);
    } catch (error) {
      toast.error('Failed to delete reflection');
      console.error('Delete error:', error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getFeelingEmoji = (value: bigint) => {
    const num = Number(value);
    if (num <= 2) return '😣';
    if (num <= 4) return '😕';
    if (num <= 6) return '😐';
    if (num <= 8) return '🙂';
    return '😊';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TrackingStatusBanner />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!reflections || reflections.length === 0) {
    return (
      <div className="space-y-4">
        <TrackingStatusBanner />
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No reflections yet</h3>
            <p className="text-muted-foreground">
              Start tracking how your body feels by adding your first reflection
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <TrackingStatusBanner />
        {reflections.map((reflection, index) => (
          <Card key={`reflection-${index}-${reflection.date}`} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">{getFeelingEmoji(reflection.bodyFeeling)}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Feeling: {Number(reflection.bodyFeeling)}/10
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(reflection.date)}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedReflection({ id: BigInt(index), index });
                    setDeleteDialogOpen(true);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {reflection.notes && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{reflection.notes}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reflection?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this reflection entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
