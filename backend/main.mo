import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type WellbeingSession = {
    startTime : Time.Time;
    endTime : Time.Time;
    duration : Nat;
    breaksTaken : Nat;
    suggestedAction : Text;
  };

  type ReflectionEntry = {
    date : Time.Time;
    bodyFeeling : Nat;
    notes : Text;
  };

  type NotificationPreference = {
    standInterval : Nat;
    walkInterval : Nat;
    stretchInterval : Nat;
    eyeRestInterval : Nat;
    postureResetInterval : Nat;
    notificationVolume : Nat;
    notificationMuted : Bool;
  };

  type SocialMediaGoal = {
    dailyLimit : Nat;
    mindfulBreaks : Nat;
  };

  public type SummaryFrequency = { #daily; #weekly };

  public type UserProfile = {
    name : Text;
    createdAt : Time.Time;
    summaryFrequency : SummaryFrequency;
  };

  module WellbeingSession {
    public func compareByNewest(session1 : WellbeingSession, session2 : WellbeingSession) : Order.Order {
      Int.compare(session2.startTime, session1.startTime);
    };
  };

  module ReflectionEntry {
    public func compareByNewest(entry1 : ReflectionEntry, entry2 : ReflectionEntry) : Order.Order {
      Int.compare(entry2.date, entry1.date);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userSessions = Map.empty<Principal, Map.Map<Nat, WellbeingSession>>();
  let userReflections = Map.empty<Principal, Map.Map<Nat, ReflectionEntry>>();
  let userNotificationPreferences = Map.empty<Principal, NotificationPreference>();
  let userSocialMediaGoals = Map.empty<Principal, SocialMediaGoal>();
  let userNextSessionId = Map.empty<Principal, Nat>();
  let userNextReflectionId = Map.empty<Principal, Nat>();

  let motivationalQuotes = [
    "Your future is created by what you do today, not tomorrow.",
    "Small habits compound into massive results.",
    "Consistency is the key to transformation.",
    "You only grow when you get outside of your comfort zone.",
    "Keep going. The best is yet to come.",
    "Progress, not perfection.",
    "Believe in yourself and all you are.",
    "Every small change leads to big results.",
    "Fall in love with the process, and the results will come.",
    "Your best days are still ahead of you.",
  ];

  let reflectionPromptTemplates = [
    "Describe one positive change you experienced today.",
    "What is the biggest challenge you overcame this week?",
    "How has your productivity improved with breaks?",
    "Share a moment today when you felt energized.",
    "Reflect on a time you prioritized your health.",
    "What well-being tip made the biggest difference?",
    "Recall a time your mood improved after exercise.",
    "How does taking regular breaks help your focus?",
    "Write about a positive transformation from your habits.",
    "Describe a time much you accomplished after a break.",
  ];

  private func getUserSessionMap(user : Principal) : Map.Map<Nat, WellbeingSession> {
    switch (userSessions.get(user)) {
      case (?sessions) { sessions };
      case (null) {
        let newMap = Map.empty<Nat, WellbeingSession>();
        userSessions.add(user, newMap);
        newMap;
      };
    };
  };

  private func getUserReflectionMap(user : Principal) : Map.Map<Nat, ReflectionEntry> {
    switch (userReflections.get(user)) {
      case (?reflections) { reflections };
      case (null) {
        let newMap = Map.empty<Nat, ReflectionEntry>();
        userReflections.add(user, newMap);
        newMap;
      };
    };
  };

  private func getNextSessionId(user : Principal) : Nat {
    switch (userNextSessionId.get(user)) {
      case (?id) { id };
      case (null) { 0 };
    };
  };

  private func incrementSessionId(user : Principal) {
    let currentId = getNextSessionId(user);
    userNextSessionId.add(user, currentId + 1);
  };

  private func getNextReflectionId(user : Principal) : Nat {
    switch (userNextReflectionId.get(user)) {
      case (?id) { id };
      case (null) { 0 };
    };
  };

  private func incrementReflectionId(user : Principal) {
    let currentId = getNextReflectionId(user);
    userNextReflectionId.add(user, currentId + 1);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func updateSummaryFrequency(newFrequency : SummaryFrequency) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update summary frequency");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found. Please create a profile first.");
      };
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          createdAt = profile.createdAt;
          summaryFrequency = newFrequency;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func saveSession(startTime : Time.Time, endTime : Time.Time, duration : Nat, breaksTaken : Nat, suggestedAction : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save sessions");
    };

    let session : WellbeingSession = {
      startTime;
      endTime;
      duration;
      breaksTaken;
      suggestedAction;
    };

    let sessions = getUserSessionMap(caller);
    let sessionId = getNextSessionId(caller);
    sessions.add(sessionId, session);
    incrementSessionId(caller);
    sessionId;
  };

  public query ({ caller }) func getSession(id : Nat) : async ?WellbeingSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };

    let sessions = getUserSessionMap(caller);
    sessions.get(id);
  };

  public query ({ caller }) func getAllSessions() : async [WellbeingSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };

    let sessions = getUserSessionMap(caller);
    sessions.values().toArray().sort(WellbeingSession.compareByNewest);
  };

  public shared ({ caller }) func saveReflection(date : Time.Time, bodyFeeling : Nat, notes : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save reflections");
    };

    let reflection : ReflectionEntry = {
      date;
      bodyFeeling;
      notes;
    };

    let reflections = getUserReflectionMap(caller);
    let reflectionId = getNextReflectionId(caller);
    reflections.add(reflectionId, reflection);
    incrementReflectionId(caller);
    reflectionId;
  };

  public query ({ caller }) func getReflection(id : Nat) : async ?ReflectionEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reflections");
    };

    let reflections = getUserReflectionMap(caller);
    reflections.get(id);
  };

  public query ({ caller }) func getAllReflections() : async [ReflectionEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reflections");
    };

    let reflections = getUserReflectionMap(caller);
    reflections.values().toArray().sort(ReflectionEntry.compareByNewest);
  };

  public query ({ caller }) func getReflectionsByDateRange(startDate : Time.Time, endDate : Time.Time) : async [ReflectionEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reflections");
    };

    let reflections = getUserReflectionMap(caller);
    let filteredReflections = reflections.values().toArray().filter(
      func(reflection) {
        reflection.date >= startDate and reflection.date <= endDate
      }
    );
    filteredReflections.sort(ReflectionEntry.compareByNewest);
  };

  public shared ({ caller }) func saveNotificationPreferences(
    standInterval : Nat,
    walkInterval : Nat,
    stretchInterval : Nat,
    eyeRestInterval : Nat,
    postureResetInterval : Nat,
    notificationVolume : Nat,
    notificationMuted : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save notification preferences");
    };

    let preferences : NotificationPreference = {
      standInterval;
      walkInterval;
      stretchInterval;
      eyeRestInterval;
      postureResetInterval;
      notificationVolume;
      notificationMuted;
    };

    userNotificationPreferences.add(caller, preferences);
  };

  public query ({ caller }) func getNotificationPreferences() : async ?NotificationPreference {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notification preferences");
    };

    userNotificationPreferences.get(caller);
  };

  public shared ({ caller }) func setSocialMediaGoal(dailyLimit : Nat, mindfulBreaks : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set social media goals");
    };

    let goal : SocialMediaGoal = {
      dailyLimit;
      mindfulBreaks;
    };

    userSocialMediaGoals.add(caller, goal);
  };

  public query ({ caller }) func getSocialMediaGoal() : async ?SocialMediaGoal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view social media goals");
    };

    userSocialMediaGoals.get(caller);
  };

  public query ({ caller }) func getDashboardStats() : async {
    totalSessions : Nat;
    totalBreaks : Nat;
    averageSittingDuration : Nat;
    averageBodyFeeling : Nat;
    socialMediaGoal : ?SocialMediaGoal;
    motivationalQuote : Text;
    reflectionPromptTemplate : Text;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard stats");
    };

    let sessions = getUserSessionMap(caller);
    let reflections = getUserReflectionMap(caller);

    let sessionValues = sessions.values().toArray();
    let reflectionValues = reflections.values().toArray();

    let totalSessions = sessionValues.size();
    let totalBreaks = sessionValues.foldLeft(
      0,
      func(acc, session) {
        acc + session.breaksTaken;
      },
    );

    let totalSittingDuration = sessionValues.foldLeft(
      0,
      func(acc, session) {
        acc + session.duration;
      },
    );

    let averageSittingDuration = if (totalSessions > 0) {
      totalSittingDuration / totalSessions;
    } else {
      0;
    };

    let bodyFeelingSum = reflectionValues.foldLeft(
      0,
      func(acc, reflection) {
        acc + reflection.bodyFeeling;
      },
    );

    let averageBodyFeeling = if (reflectionValues.size() > 0) {
      bodyFeelingSum / reflectionValues.size();
    } else {
      0;
    };

    let quoteIndex = Time.now() % 10;
    let motivationalQuote = if (quoteIndex >= 0 and quoteIndex < 10) {
      motivationalQuotes[Int.abs(quoteIndex.toNat())];
    } else { "You are doing great. Keep going!" };

    let reflectionIndex = Time.now() % 10;
    let reflectionPromptTemplate = if (reflectionIndex >= 0 and reflectionIndex < 10) {
      reflectionPromptTemplates[Int.abs(reflectionIndex.toNat())];
    } else { "How do you feel after taking regular breaks?" };

    {
      totalSessions;
      totalBreaks;
      averageSittingDuration;
      averageBodyFeeling;
      socialMediaGoal = userSocialMediaGoals.get(caller);
      motivationalQuote;
      reflectionPromptTemplate;
    };
  };

  public shared ({ caller }) func deleteSession(sessionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete sessions");
    };

    let sessions = getUserSessionMap(caller);
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("The requested session does not exist.") };
      case (?_) {
        sessions.remove(sessionId);
      };
    };
  };

  public shared ({ caller }) func deleteReflection(reflectionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete reflections");
    };

    let reflections = getUserReflectionMap(caller);
    switch (reflections.get(reflectionId)) {
      case (null) { Runtime.trap("The requested reflection does not exist.") };
      case (?_) {
        reflections.remove(reflectionId);
      };
    };
  };

  public shared ({ caller }) func resetWellbeingAssistant() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset their data");
    };

    let sessions = getUserSessionMap(caller);
    let reflections = getUserReflectionMap(caller);

    sessions.clear();
    reflections.clear();
    userNotificationPreferences.remove(caller);
    userSocialMediaGoals.remove(caller);
    userNextSessionId.add(caller, 0);
    userNextReflectionId.add(caller, 0);
  };

  public query ({ caller }) func searchSessionsByAction(action : Text) : async [WellbeingSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search sessions");
    };

    let sessions = getUserSessionMap(caller);
    let matchingSessions = sessions.values().toArray().filter(
      func(session) {
        session.suggestedAction.toLower().contains(#text(action.toLower()));
      }
    );
    matchingSessions.sort(WellbeingSession.compareByNewest);
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func fetchExternalMotivationalQuote() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch motivational quotes");
    };
    let apiUrl = "https://external-motivation-api.com/api/quote";
    await OutCall.httpGetRequest(apiUrl, [], transform);
  };

  public shared ({ caller }) func fetchExternalReflectionPrompt() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch reflection prompts");
    };
    let apiUrl = "https://external-reflection-api.com/api/prompt";
    await OutCall.httpGetRequest(apiUrl, [], transform);
  };
};
