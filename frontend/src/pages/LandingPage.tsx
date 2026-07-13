import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();
  const [showContent, setShowContent] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    // Fade in content on mount
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Parallax scroll effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Calm gradient background with breathing animations */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="breathing-circle absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="breathing-circle-delayed absolute right-1/4 bottom-1/4 h-[32rem] w-[32rem] rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center transition-all duration-1000 ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        {/* Animated Logo */}
        <div className="mb-8 flex items-center justify-center">
          <img
            src="/assets/generated/deskrhythm-logo-transparent.dim_200x100.png"
            alt="DeskRhythm Logo"
            className="h-28 w-auto breathing-icon drop-shadow-lg md:h-32"
          />
        </div>

        {/* Hero Title */}
        <h1 className="mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
          DeskRhythm
        </h1>
        
        {/* Tagline */}
        <p className="mb-6 text-2xl font-light text-muted-foreground md:text-3xl lg:text-4xl">
          Work rhythmically. Feel better.
        </p>

        {/* Enhanced Tagline with fade-in animation */}
        <p
          className={`mb-12 max-w-3xl px-4 text-base font-normal leading-relaxed text-foreground/70 transition-all duration-1000 delay-500 md:text-lg lg:text-xl ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Powered by Ambient Intelligence, DeskRhythm understands your work patterns and gently guides you toward healthier rhythms—without breaking your focus.
        </p>

        {/* CTA Button */}
        <Button
          onClick={handleLogin}
          disabled={isLoggingIn}
          size="lg"
          className="group mb-4 gap-2 px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Start Your Journey
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground/60">
          Secure login with Internet Identity
        </p>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <div className="h-8 w-0.5 rounded-full bg-primary/40" />
        </div>
      </section>

      {/* Value Proposition Section */}
      <section
        className={`relative z-10 px-4 py-24 transition-all duration-1000 delay-300 ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-3xl font-semibold md:text-4xl">
            Why DeskRhythm?
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="group flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 shadow-lg transition-all group-hover:bg-primary/20 group-hover:shadow-xl">
                <img
                  src="/assets/generated/stretching-person.dim_200x200.png"
                  alt="Gentle posture reminders"
                  className="h-20 w-20 breathing-icon"
                />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Gentle Posture Reminders</h3>
              <p className="text-muted-foreground">
                Stay comfortable with timely nudges to adjust your posture and stretch throughout the day.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="group flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-accent/10 shadow-lg transition-all group-hover:bg-accent/20 group-hover:shadow-xl">
                <img
                  src="/assets/generated/eye-rest-icon-transparent.dim_64x64.png"
                  alt="Mindful breaks"
                  className="h-20 w-20 breathing-icon"
                />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Mindful Breaks</h3>
              <p className="text-muted-foreground">
                Take intentional pauses to rest your eyes, walk around, and reset your focus for better productivity.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="group flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-secondary/10 shadow-lg transition-all group-hover:bg-secondary/20 group-hover:shadow-xl">
                <img
                  src="/assets/generated/motivation-icon-transparent.dim_64x64.png"
                  alt="Feel better"
                  className="h-20 w-20 breathing-icon"
                />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Feel Better by Day's End</h3>
              <p className="text-muted-foreground">
                End your workday energized, not exhausted. Track your wellbeing and build healthier habits over time.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-20 rounded-2xl bg-card/50 p-8 shadow-xl backdrop-blur-sm md:p-12">
            <h3 className="mb-8 text-center text-2xl font-semibold">
              Everything You Need for Wellbeing
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <img
                    src="/assets/generated/ai-insights-icon-transparent.dim_64x64.png"
                    alt="AI Insights"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">AI-Powered Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Get personalized recommendations based on your activity patterns and wellbeing data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <img
                    src="/assets/generated/breathing-icon-transparent.dim_64x64.png"
                    alt="Activity Tracking"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Smart Activity Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic monitoring of your sitting time with intelligent break suggestions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                  <img
                    src="/assets/generated/mindful-phone-break.dim_200x200.png"
                    alt="Social Media"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Social Media Balance</h4>
                  <p className="text-sm text-muted-foreground">
                    Optional tracking to help you maintain healthy digital habits and mindful scrolling.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <img
                    src="/assets/generated/meditation-figure.dim_200x200.png"
                    alt="Reflections"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Daily Reflections</h4>
                  <p className="text-sm text-muted-foreground">
                    Log how you feel and track your wellbeing journey over time with meaningful insights.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
              className="group gap-2 px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Get Started Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="relative z-10 h-24" />
    </div>
  );
}
