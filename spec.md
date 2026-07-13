# DeskRhythm Wellbeing Assistant

## Overview
A wellbeing assistant application that helps computer users manage sitting and screen time through gentle monitoring, smart recommendations, and personal reflection tracking. Features AI-powered insights, optional social media usage tracking, intelligent curated summaries, and starts with an engaging, marketable landing page for user onboarding.

## Core Features
- Engaging, marketable startup landing page with Internet Identity authentication
- Background activity tracking based on user interaction intervals that continues across tab switches
- AI-powered personalized insights and recommendations
- Smart interval recommendations with adjustable timing
- Friendly pop-up notifications for break suggestions with ambient sound alerts
- Personal wellbeing dashboard with daily statistics
- End-of-day reflection logging and historical summaries
- Optional social media usage tracking and reduction goals
- Intelligent curated summaries with daily/weekly frequency options
- Calm, minimal UI with breathing animations
- Notification and reminder sounds with user-controllable volume settings
- Global infinite spinner with smooth fade transitions for loading states
- Robust loading state management with error handling and timeout fallbacks
- Reliable dashboard initialization after authentication with proper error handling

## Startup Landing Page
- Hero section with animated DeskRhythm logo and tagline "Work rhythmically. Feel better."
- Enhanced tagline "Powered by Ambient Intelligence, DeskRhythm understands your work patterns and gently guides you toward healthier rhythms—without breaking your focus." positioned prominently below or near the main headline and above the primary call-to-action buttons
- Tagline styled with calm, minimalist typography consistent with the page theme
- Fade-in animation for the enhanced tagline to harmonize with the landing page's serene animated visuals
- Responsive layout for desktop and mobile views maintaining readability and elegant alignment
- Call-to-action button that smoothly transitions to Internet Identity login
- Value proposition section highlighting three key benefits:
  - "Gentle posture reminders" with stretching-person icon
  - "Mindful breaks" with eye-rest-icon
  - "Feel better by the end of your workday" with motivation-icon
- Subtle scroll or parallax effects for enhanced engagement
- Soft, breathable colors matching the app's calm gradient theme
- Ambient breathing animations consistent with overall app design
- Smooth loading and graceful fade transition to main dashboard after authentication
- Marketable and engaging design while maintaining minimalist aesthetic
- Eliminates incomplete loading feeling with seamless transitions

## Activity Tracking
- Monitor sitting/screen time duration through user interaction detection
- Continue tracking across all app sections (Social Media Tracker, Reflection, etc.)
- Pause tracking only when user explicitly stops or closes the application
- Track idle periods to determine activity patterns
- Optional social media usage tracking with time logging
- Calculate total sitting duration and break intervals
- Generate smart recommendations based on usage patterns
- Maintain persistent countdown timer state across all tab navigation within the dashboard
- Store timer state globally to prevent resets when switching between Activity, Social Media, Reflection, and Settings tabs
- Ensure timer synchronization with real elapsed time when returning to Activity tab
- Guarantee seamless timer continuity even when components are unmounted and remounted during navigation
- Maintain timer accuracy and state persistence in Zustand store regardless of component lifecycle
- Continue countdown uninterrupted during loading spinner displays

## AI-Powered Insights System
- Analyze user sitting sessions, reflections, and notification preferences
- Generate personalized wellbeing advice based on tracked data
- Provide adaptive suggestions like "Stretch now — your body's been still for 45 min"
- Surface motivational quotes and reflections tailored to user's daily patterns
- Deliver contextual recommendations based on current activity and historical data

## Intelligent Curated Summaries
- Analyze users' activity sessions, reflections, social media usage, and wellbeing data
- Generate concise, motivational summaries of daily or weekly performance
- Create personalized insights highlighting achievements, patterns, and areas for improvement
- Provide encouraging feedback based on user's wellbeing journey and progress
- Integrate summary data with existing AI insights system for comprehensive analysis

## Social Media Integration Module
- Optional tracking of social media usage time
- Allow users to set reduction goals (e.g., "limit to 30 minutes")
- Track "mindful scroll breaks" as part of activity monitoring
- Display social media metrics alongside other activity data on dashboard
- Provide insights and recommendations for healthy social media habits

## Notification System
- Display subtle pop-up notifications for break suggestions
- Play soft ambient notification sounds for break reminders and motivational prompts
- Provide adjustable timing for recommendations
- Offer various break types: stand, walk, stretch, eye rest, posture reset
- Allow users to customize notification frequency, types, and sound settings
- Include AI-generated motivational messages in notifications
- Support mute and volume control options
- Continue background notifications and reminders across all tab navigation
- Ensure sound notifications trigger at correct intervals regardless of active tab
- Maintain SoundContext functionality during tab switches and component remounting

## Personal Dashboard
- Show total sitting duration for current session
- Display number of breaks taken today
- Present AI-generated insights and personalized recommendations with updated terminology "Daily Rhythm Insight - Ambient Intelligence(AI)"
- Show social media usage data when tracking is enabled
- Display daily motivational quote or reflection
- Provide visual indicators for wellbeing status
- Track progress toward social media reduction goals
- Display ongoing tracking progress with visual feedback in each tab
- Show timer status and countdown information consistently across all navigation tabs
- Include motivational message "Your health is part of your workflow." positioned above the stats or AI insights section for maximum visibility
- Display tagline "Built for marketers, developers, designers, and anyone who forgets to stand." near the bottom of the dashboard in subtle but readable text style
- Reliable initialization after authentication with proper error handling and retry mechanisms
- Graceful fallback when dashboard data fails to load with user-friendly error messages

## Reflection System
- Present end-of-day reflection form prompting body feeling assessment
- Allow users to log daily wellbeing notes and physical comfort levels
- Display summaries of recent reflection entries
- Track wellbeing trends over time
- Feed reflection data into AI insights system
- Support gentle reminder sounds for reflection prompts
- Display active tracking session progress within reflection interface

## Settings Panel
- Notification sound controls (mute, volume adjustment)
- Customizable notification frequency and types
- Social media tracking enable/disable options
- User preference management for personalized experience
- Sound settings for break reminders and reflection prompts
- Display current tracking session status and timer information
- Summary email frequency setting with toggle or dropdown for "Daily" or "Weekly" options
- Clear explanatory text for email summary feature using "intelligent curated summaries" terminology
- On-screen notification when users attempt to enable email summaries: "Email summaries are available for paid users once email is enabled"

## Profile Setup System
- Profile setup component for new users when no profile exists
- Seamless transition from authentication to profile creation
- Default profile handling when user data is unavailable
- Graceful fallback to profile setup instead of infinite loading

## Global Loading System
- Infinite spinner component with smooth fade-in and fade-out transitions
- Integrated at app root level for global loading state management
- Displays during data fetching operations (user data, session data, AI insights)
- Shows during page transitions and initial dashboard setup
- Maintains calm visual identity with consistent design language
- Ensures persistent countdown timer continues uninterrupted during spinner display
- Provides seamless user experience during loading states
- Includes timeout fallback mechanism (10 seconds) to prevent indefinite loading
- Shows helpful retry message when loading hangs or times out
- Graceful error handling for network and authorization failures

## Authentication and Login Flow Fixes
- Ensure seamless transition from Internet Identity sign-in completion to dashboard
- Implement robust dashboard data fetching with proper error handling and retry logic
- Eliminate infinite loading spinners after successful authentication
- Provide fallback handling for user profile loading failures
- Remove "loading taking longer" messages through improved data fetch reliability
- Guarantee proper initialization of dashboard components after login
- Handle authentication state changes smoothly without UI interruptions

## Backend Requirements
- Handle Internet Identity authentication for user login
- Store user activity sessions with timestamps and duration data
- Persist daily reflection entries with body feeling assessments and notes
- Store social media usage data and reduction goals when enabled
- Generate AI-powered insights based on user data patterns
- Provide personalized recommendations and motivational content
- Maintain user preferences for social media tracking and sound settings
- Return reflection summaries and AI insights for dashboard display
- Maintain user-specific data storage for personalized tracking
- Store user sound and notification preferences
- Handle null or undefined profile data gracefully without causing infinite loading
- Provide proper error responses for failed profile queries
- Support timeout handling for slow or failed network requests
- Ensure all Motoko actor functions are properly defined and exported with exact naming
- Validate all backend method signatures match frontend calls precisely
- Implement proper error handling for all backend operations
- Return consistent data structures for dashboard statistics and user profiles
- Provide reliable fallback responses when data queries fail
- Handle empty user data scenarios without runtime errors or traps
- Ensure backend functions return appropriate default values for new users
- Store user preferences for summary email frequency (Daily/Weekly)
- Generate intelligent curated summaries using existing wellbeing and reflection data
- Provide summary data for dashboard display and future email functionality

## Frontend Requirements
- Engaging, marketable startup landing page with hero section, animated logo, and value proposition
- Enhanced tagline "Powered by Ambient Intelligence, DeskRhythm understands your work patterns and gently guides you toward healthier rhythms—without breaking your focus." with prominent placement, calm typography, fade-in animation, and responsive design
- Smooth transitions and parallax effects on landing page
- Seamless fade transition from landing page to dashboard after authentication
- Background tracking system monitoring user interaction across all app sections
- Continuous activity tracking that persists during tab navigation
- Optional social media usage tracking interface
- AI insights display with personalized recommendations using updated terminology "Daily Rhythm Insight - Ambient Intelligence(AI)"
- Notification system with ambient sound alerts and customizable settings
- Dashboard interface displaying daily statistics, AI insights, and social media data
- Social media goal setting and progress tracking interface
- Reflection form interface for end-of-day logging with sound reminders
- Historical view for reflection summaries and insights
- Settings panel for sound controls, notification preferences, and social media tracking
- Calm, minimal design with soft colors and breathing animations
- Sound management system with mute and volume controls
- Global state management for activity timer to maintain countdown state across all dashboard tabs
- Timer synchronization system to ensure accurate elapsed time tracking when switching between tabs
- Persistent background timer updates for countdown progress, reminders, and notifications during tab navigation
- Maintain pause/resume functionality and sound cues across all tab switches
- Robust Zustand store implementation that preserves timer state during component unmounting and remounting
- Visual feedback system displaying ongoing tracking progress within each tab interface
- Smooth UI responsiveness during tab transitions with no state resets
- Continuous SoundContext integration ensuring notification sounds trigger correctly regardless of active tab
- Global infinite spinner component with fade transitions integrated at app root level
- Loading state management for data fetching, page transitions, and dashboard initialization
- Uninterrupted timer functionality during loading spinner displays
- Consistent calm visual design for loading states
- Profile setup component rendering when no user profile exists
- Conditional rendering logic to prevent infinite loading on null/undefined profile data
- Error handling in query hooks with proper loading state completion
- Timeout fallback mechanism in LoadingSpinner component with retry functionality
- Proper initialization checks for query client and theme provider
- Graceful handling of network errors and authorization failures in profile loading
- Replace all instances of "AI Powered Insight" with "Daily Rhythm Insight - Ambient Intelligence(AI)" while maintaining consistent typography and design alignment
- Add motivational message "Your health is part of your workflow." positioned strategically above stats or AI insights section
- Include tagline "Built for marketers, developers, designers, and anyone who forgets to stand." near the bottom of dashboard in subtle, readable text style
- Ensure all new text elements inherit consistent font styles, spacing, and maintain visual harmony with the app's serene aesthetic
- All components must be properly exported and imported with correct file paths
- All TypeScript interfaces and types must be properly defined and imported
- All React hooks must be properly implemented with correct dependencies
- All context providers must be properly wrapped and accessible to child components
- All state management must be properly initialized and accessible across components
- Implement reliable dashboard initialization flow with proper error handling and retry mechanisms
- Configure React Query hooks with error handling, retry logic, and proper loading state management
- Ensure App.tsx correctly handles authentication state transitions and dashboard loading
- Implement fallback UI components for failed data loading scenarios
- Test and verify complete sign-in to dashboard flow works without interruption
- Fix all broken imports, missing exports, and mismatched types in React components
- Ensure DashboardPage.tsx, useQueries.ts, and data hooks have proper error handling
- Verify dashboard data loads correctly with fallback data when backend responses are delayed
- Correct all queryKey and fetch function references to match backend function names exactly
- Ensure seamless navigation between all tabs without infinite spinners or stalled states
- Add summary email frequency setting in SettingsPanel with toggle/dropdown for Daily/Weekly options
- Display explanatory text for email summary feature using "intelligent curated summaries" terminology
- Show on-screen notification when users attempt to enable email summaries about paid user requirement
- Integrate intelligent curated summary display in dashboard or dedicated section
- Replace all occurrences of "AI-generated summaries" with "intelligent curated summaries" throughout the app
- Ensure consistent typography and styling for "intelligent curated summaries" phrase aligned with existing branded phrases
- Maintain accessibility and readability across light and dark modes for updated terminology

## Data Storage
The backend must persist user authentication data, activity sessions, reflection entries, social media usage data, reduction goals, user preferences including sound settings, summary email frequency preferences, and AI-generated insights and intelligent curated summaries for personalized wellbeing tracking.

## UI Design Theme
- Soft, calming color palette
- Minimal, clean interface design
- Breathing animations for relaxation cues
- Gentle transitions and subtle visual feedback
- Focus on reducing visual stress and promoting calm interaction
- Integrated display of AI insights without overwhelming the interface
- Marketable and engaging landing page design while maintaining calm aesthetic
- Ambient sound integration that complements the calm visual experience
- Smooth parallax and scroll effects on landing page
- Seamless transitions between landing page and main application
- Responsive interface design that maintains smooth performance during tab navigation
- Consistent loading spinner design with smooth fade transitions
- Error state designs that maintain the calm aesthetic while providing helpful feedback
- Consistent typography and spacing for all text elements including new motivational messages and taglines

## Language
- All application content and interface text in English
