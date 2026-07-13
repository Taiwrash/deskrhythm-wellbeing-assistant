import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coffee, X } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';

type BreakType = 'stand' | 'walk' | 'stretch' | 'eyeRest' | 'postureReset';

interface BreakNotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breakType: BreakType;
  onTakeBreak: () => void;
  onSkip: () => void;
}

const breakDetails: Record<
  BreakType,
  { title: string; description: string; image: string; emoji: string }
> = {
  stand: {
    title: 'Time to Stand',
    description: 'Stand up and stretch for 2 minutes. Your body will thank you!',
    image: '/assets/generated/stretching-person.dim_200x200.png',
    emoji: '🧍',
  },
  walk: {
    title: 'Take a Walk',
    description: 'A short 5-minute walk will refresh your mind and body.',
    image: '/assets/generated/stretching-person.dim_200x200.png',
    emoji: '🚶',
  },
  stretch: {
    title: 'Stretch Time',
    description: 'Gentle stretches for 3 minutes to release tension.',
    image: '/assets/generated/stretching-person.dim_200x200.png',
    emoji: '🤸',
  },
  eyeRest: {
    title: 'Rest Your Eyes',
    description: 'Look away from the screen for 1 minute. Try the 20-20-20 rule.',
    image: '/assets/generated/eye-rest-icon-transparent.dim_64x64.png',
    emoji: '👁️',
  },
  postureReset: {
    title: 'Reset Your Posture',
    description: 'Adjust your sitting position and align your spine.',
    image: '/assets/generated/meditation-figure.dim_200x200.png',
    emoji: '🪑',
  },
};

export default function BreakNotification({
  open,
  onOpenChange,
  breakType,
  onTakeBreak,
  onSkip,
}: BreakNotificationProps) {
  const details = breakDetails[breakType];
  const { playBreakSound } = useSound();

  useEffect(() => {
    if (open) {
      playBreakSound();
    }
  }, [open, playBreakSound]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="breathing-icon flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <span className="text-4xl">{details.emoji}</span>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{details.title}</DialogTitle>
          <DialogDescription className="text-center">{details.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onTakeBreak} className="w-full gap-2" size="lg">
            <Coffee className="h-5 w-5" />
            Take a Break
          </Button>
          <Button onClick={onSkip} variant="ghost" className="w-full gap-2">
            <X className="h-4 w-4" />
            Skip for Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
