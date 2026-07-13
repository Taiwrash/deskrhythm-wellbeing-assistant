import { useState, useEffect } from 'react';
import { Loader2, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useSaveReflection } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useSound } from '../contexts/SoundContext';

interface DailyReflectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DailyReflectionDialog({ open, onOpenChange }: DailyReflectionDialogProps) {
  const [bodyFeeling, setBodyFeeling] = useState([5]);
  const [notes, setNotes] = useState('');
  const saveReflection = useSaveReflection();
  const { playReflectionSound } = useSound();

  useEffect(() => {
    if (open) {
      playReflectionSound();
    }
  }, [open, playReflectionSound]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await saveReflection.mutateAsync({
        date: BigInt(Date.now() * 1_000_000),
        bodyFeeling: BigInt(bodyFeeling[0]),
        notes: notes.trim(),
      });
      toast.success('Reflection saved successfully');
      setBodyFeeling([5]);
      setNotes('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save reflection');
      console.error('Save reflection error:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !saveReflection.isPending) {
      setBodyFeeling([5]);
      setNotes('');
    }
    onOpenChange(newOpen);
  };

  const getFeelingEmoji = (value: number) => {
    if (value <= 2) return '😣';
    if (value <= 4) return '😕';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '😊';
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Daily Reflection
            </DialogTitle>
            <DialogDescription>How does your body feel today?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-4">
              <Label htmlFor="feeling">Body Feeling (1-10)</Label>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{getFeelingEmoji(bodyFeeling[0])}</span>
                <div className="flex-1">
                  <Slider
                    id="feeling"
                    min={1}
                    max={10}
                    step={1}
                    value={bodyFeeling}
                    onValueChange={setBodyFeeling}
                    disabled={saveReflection.isPending}
                    className="w-full"
                  />
                  <div className="mt-2 text-center text-2xl font-bold">{bodyFeeling[0]}/10</div>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How are you feeling? Any aches or pains?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={saveReflection.isPending}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={saveReflection.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saveReflection.isPending}>
              {saveReflection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Reflection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
