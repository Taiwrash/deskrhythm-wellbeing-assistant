import { create } from 'zustand';

type BreakType = 'stand' | 'walk' | 'stretch' | 'eyeRest' | 'postureReset';

interface ActivityState {
  isTracking: boolean;
  isPaused: boolean;
  sessionStart: number | null;
  elapsedTime: number;
  pausedTime: number;
  breaksTaken: number;
  lastActivityTime: number;
  nextBreakTime: number | null;
  suggestedBreak: BreakType;
  aiSuggestion: string;
  showBreakNotification: boolean;
  
  // Actions
  setIsTracking: (isTracking: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setSessionStart: (sessionStart: number | null) => void;
  setElapsedTime: (elapsedTime: number) => void;
  setPausedTime: (pausedTime: number) => void;
  setBreaksTaken: (breaksTaken: number) => void;
  incrementBreaksTaken: () => void;
  setLastActivityTime: (lastActivityTime: number) => void;
  setNextBreakTime: (nextBreakTime: number | null) => void;
  setSuggestedBreak: (suggestedBreak: BreakType) => void;
  setAiSuggestion: (aiSuggestion: string) => void;
  setShowBreakNotification: (show: boolean) => void;
  resetSession: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  isTracking: false,
  isPaused: false,
  sessionStart: null,
  elapsedTime: 0,
  pausedTime: 0,
  breaksTaken: 0,
  lastActivityTime: Date.now(),
  nextBreakTime: null,
  suggestedBreak: 'stand',
  aiSuggestion: '',
  showBreakNotification: false,

  setIsTracking: (isTracking) => set({ isTracking }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setSessionStart: (sessionStart) => set({ sessionStart }),
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),
  setPausedTime: (pausedTime) => set({ pausedTime }),
  setBreaksTaken: (breaksTaken) => set({ breaksTaken }),
  incrementBreaksTaken: () => set((state) => ({ breaksTaken: state.breaksTaken + 1 })),
  setLastActivityTime: (lastActivityTime) => set({ lastActivityTime }),
  setNextBreakTime: (nextBreakTime) => set({ nextBreakTime }),
  setSuggestedBreak: (suggestedBreak) => set({ suggestedBreak }),
  setAiSuggestion: (aiSuggestion) => set({ aiSuggestion }),
  setShowBreakNotification: (show) => set({ showBreakNotification: show }),
  resetSession: () =>
    set({
      isTracking: false,
      isPaused: false,
      sessionStart: null,
      elapsedTime: 0,
      pausedTime: 0,
      breaksTaken: 0,
      nextBreakTime: null,
      aiSuggestion: '',
      showBreakNotification: false,
    }),
}));
