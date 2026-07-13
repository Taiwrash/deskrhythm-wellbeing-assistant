import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface NotificationPreference {
    notificationMuted: boolean;
    eyeRestInterval: bigint;
    notificationVolume: bigint;
    postureResetInterval: bigint;
    stretchInterval: bigint;
    walkInterval: bigint;
    standInterval: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface WellbeingSession {
    startTime: Time;
    duration: bigint;
    endTime: Time;
    suggestedAction: string;
    breaksTaken: bigint;
}
export interface SocialMediaGoal {
    mindfulBreaks: bigint;
    dailyLimit: bigint;
}
export interface ReflectionEntry {
    date: Time;
    bodyFeeling: bigint;
    notes: string;
}
export interface UserProfile {
    name: string;
    createdAt: Time;
    summaryFrequency: SummaryFrequency;
}
export interface http_header {
    value: string;
    name: string;
}
export enum SummaryFrequency {
    daily = "daily",
    weekly = "weekly"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteReflection(reflectionId: bigint): Promise<void>;
    deleteSession(sessionId: bigint): Promise<void>;
    fetchExternalMotivationalQuote(): Promise<string>;
    fetchExternalReflectionPrompt(): Promise<string>;
    getAllReflections(): Promise<Array<ReflectionEntry>>;
    getAllSessions(): Promise<Array<WellbeingSession>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<{
        averageBodyFeeling: bigint;
        averageSittingDuration: bigint;
        socialMediaGoal?: SocialMediaGoal;
        motivationalQuote: string;
        reflectionPromptTemplate: string;
        totalSessions: bigint;
        totalBreaks: bigint;
    }>;
    getNotificationPreferences(): Promise<NotificationPreference | null>;
    getReflection(id: bigint): Promise<ReflectionEntry | null>;
    getReflectionsByDateRange(startDate: Time, endDate: Time): Promise<Array<ReflectionEntry>>;
    getSession(id: bigint): Promise<WellbeingSession | null>;
    getSocialMediaGoal(): Promise<SocialMediaGoal | null>;
    isCallerAdmin(): Promise<boolean>;
    resetWellbeingAssistant(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveNotificationPreferences(standInterval: bigint, walkInterval: bigint, stretchInterval: bigint, eyeRestInterval: bigint, postureResetInterval: bigint, notificationVolume: bigint, notificationMuted: boolean): Promise<void>;
    saveReflection(date: Time, bodyFeeling: bigint, notes: string): Promise<bigint>;
    saveSession(startTime: Time, endTime: Time, duration: bigint, breaksTaken: bigint, suggestedAction: string): Promise<bigint>;
    searchSessionsByAction(action: string): Promise<Array<WellbeingSession>>;
    setSocialMediaGoal(dailyLimit: bigint, mindfulBreaks: bigint): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateSummaryFrequency(newFrequency: SummaryFrequency): Promise<void>;
}
