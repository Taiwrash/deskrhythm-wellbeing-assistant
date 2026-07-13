import { Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface LoadingSpinnerProps {
  message?: string;
  timeout?: number;
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  timeout = 10000 
}: LoadingSpinnerProps) {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isTimedOut) {
    return (
      <div className="loading-spinner-overlay fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="loading-spinner-content flex flex-col items-center gap-4 max-w-md text-center px-6">
          <div className="rounded-full bg-destructive/10 p-4">
            <RefreshCw className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading is taking longer than expected</h3>
            <p className="text-sm text-muted-foreground">
              This might be due to a slow network connection or a temporary issue. 
              Please try refreshing the page.
            </p>
          </div>
          <Button onClick={handleRetry} variant="default" className="mt-2">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-spinner-overlay fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="loading-spinner-content flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
