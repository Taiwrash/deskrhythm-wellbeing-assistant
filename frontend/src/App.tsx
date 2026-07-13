import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetup from './components/ProfileSetup';
import LoadingSpinner from './components/LoadingSpinner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { SoundProvider } from './contexts/SoundContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { 
    data: userProfile, 
    isLoading: profileLoading, 
    isFetched,
    isError 
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return <LoadingSpinner message="Initializing..." />;
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (profileLoading && !isFetched) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (isFetched && (userProfile === null || isError)) {
    return <ProfileSetup />;
  }

  if (userProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <DashboardPage />
        </main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  return <LoadingSpinner message="Loading..." />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SoundProvider>
          <AppContent />
        </SoundProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
