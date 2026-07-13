import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WellbeingSession, ReflectionEntry, NotificationPreference, UserProfile, SocialMediaGoal, SummaryFrequency } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        const profile = await actor.getCallerUserProfile();
        return profile;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    retryDelay: 1000,
    staleTime: 10000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateSummaryFrequency() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (frequency: SummaryFrequency) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateSummaryFrequency(frequency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSaveSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      startTime,
      endTime,
      duration,
      breaksTaken,
      suggestedAction,
    }: {
      startTime: bigint;
      endTime: bigint;
      duration: bigint;
      breaksTaken: bigint;
      suggestedAction: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveSession(startTime, endTime, duration, breaksTaken, suggestedAction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useGetAllSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<WellbeingSession[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllSessions();
      } catch (error) {
        console.error('Error fetching sessions:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useSaveReflection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      bodyFeeling,
      notes,
    }: {
      date: bigint;
      bodyFeeling: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveReflection(date, bodyFeeling, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useGetAllReflections() {
  const { actor, isFetching } = useActor();

  return useQuery<ReflectionEntry[]>({
    queryKey: ['reflections'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllReflections();
      } catch (error) {
        console.error('Error fetching reflections:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useGetReflectionsByDateRange(startDate: bigint, endDate: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<ReflectionEntry[]>({
    queryKey: ['reflections', 'dateRange', startDate.toString(), endDate.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getReflectionsByDateRange(startDate, endDate);
      } catch (error) {
        console.error('Error fetching reflections by date range:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useSaveNotificationPreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: {
      standInterval: bigint;
      walkInterval: bigint;
      stretchInterval: bigint;
      eyeRestInterval: bigint;
      postureResetInterval: bigint;
      notificationVolume: bigint;
      notificationMuted: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveNotificationPreferences(
        preferences.standInterval,
        preferences.walkInterval,
        preferences.stretchInterval,
        preferences.eyeRestInterval,
        preferences.postureResetInterval,
        preferences.notificationVolume,
        preferences.notificationMuted
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
  });
}

export function useGetNotificationPreferences() {
  const { actor, isFetching } = useActor();

  return useQuery<NotificationPreference | null>({
    queryKey: ['notificationPreferences'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getNotificationPreferences();
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useGetDashboardStats() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    totalSessions: bigint;
    totalBreaks: bigint;
    averageSittingDuration: bigint;
    averageBodyFeeling: bigint;
    socialMediaGoal?: SocialMediaGoal;
    motivationalQuote: string;
    reflectionPromptTemplate: string;
  }>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      if (!actor) {
        return {
          totalSessions: 0n,
          totalBreaks: 0n,
          averageSittingDuration: 0n,
          averageBodyFeeling: 0n,
          motivationalQuote: 'Welcome to DeskRhythm!',
          reflectionPromptTemplate: 'How are you feeling today?',
        };
      }
      try {
        const stats = await actor.getDashboardStats();
        return stats;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
          totalSessions: 0n,
          totalBreaks: 0n,
          averageSittingDuration: 0n,
          averageBodyFeeling: 0n,
          motivationalQuote: 'Welcome to DeskRhythm!',
          reflectionPromptTemplate: 'How are you feeling today?',
        };
      }
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5000,
  });
}

export function useSetSocialMediaGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: { dailyLimit: bigint; mindfulBreaks: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setSocialMediaGoal(goal.dailyLimit, goal.mindfulBreaks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaGoal'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useGetSocialMediaGoal() {
  const { actor, isFetching } = useActor();

  return useQuery<SocialMediaGoal | null>({
    queryKey: ['socialMediaGoal'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getSocialMediaGoal();
      } catch (error) {
        console.error('Error fetching social media goal:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useDeleteSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useDeleteReflection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reflectionId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteReflection(reflectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useResetWellbeingAssistant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.resetWellbeingAssistant();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['socialMediaGoal'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}
