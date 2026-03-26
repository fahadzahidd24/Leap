import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  agent: {
    scorecard: null,
    dailyMissions: { progressPercent: 0, missions: [] },
    weeklyMissions: { progressPercent: 0, missions: [] },
    leaderboard: null,
    badges: [],
    tier: null,
    recognition: { feed: [], wall: [] },
    notifications: [],
    preferences: null,
  },
  manager: {
    dashboard: null,
    leaderboard: null,
    alerts: [],
    coachingPrompts: [],
    missions: [],
  },
  admin: {
    config: null,
    analytics: null,
    campaigns: [],
    auditRows: [],
    auditUserId: "",
  },
  expoDevice: {
    permissionStatus: "unknown",
    token: null,
    deviceId: null,
    registered: false,
  },
};

const gamificationSlice = createSlice({
  name: "Gamification",
  initialState,
  reducers: {
    setAgentScorecard: (state, action) => {
      state.agent.scorecard = action.payload;
    },
    setAgentDailyMissions: (state, action) => {
      state.agent.dailyMissions = action.payload || {
        progressPercent: 0,
        missions: [],
      };
    },
    setAgentWeeklyMissions: (state, action) => {
      state.agent.weeklyMissions = action.payload || {
        progressPercent: 0,
        missions: [],
      };
    },
    setAgentLeaderboard: (state, action) => {
      state.agent.leaderboard = action.payload;
    },
    setAgentBadges: (state, action) => {
      state.agent.badges = action.payload || [];
    },
    setAgentTier: (state, action) => {
      state.agent.tier = action.payload;
    },
    setAgentRecognition: (state, action) => {
      state.agent.recognition = action.payload || { feed: [], wall: [] };
    },
    setAgentNotifications: (state, action) => {
      state.agent.notifications = action.payload?.notifications || [];
      state.agent.preferences = action.payload?.preferences || null;
    },
    setAgentPreferences: (state, action) => {
      state.agent.preferences = action.payload;
    },
    setManagerDashboard: (state, action) => {
      state.manager.dashboard = action.payload;
    },
    setManagerLeaderboard: (state, action) => {
      state.manager.leaderboard = action.payload;
    },
    setManagerAlerts: (state, action) => {
      state.manager.alerts = action.payload || [];
    },
    setManagerCoachingPrompts: (state, action) => {
      state.manager.coachingPrompts = action.payload || [];
    },
    setManagerMissions: (state, action) => {
      state.manager.missions = action.payload || [];
    },
    setAdminConfig: (state, action) => {
      state.admin.config = action.payload;
    },
    setAdminAnalytics: (state, action) => {
      state.admin.analytics = action.payload;
    },
    setAdminCampaigns: (state, action) => {
      state.admin.campaigns = action.payload || [];
    },
    setAdminAuditRows: (state, action) => {
      state.admin.auditRows = action.payload?.rows || [];
      state.admin.auditUserId = action.payload?.userId || state.admin.auditUserId;
    },
    setExpoDeviceState: (state, action) => {
      state.expoDevice = {
        ...state.expoDevice,
        ...action.payload,
      };
    },
    resetGamification: () => initialState,
  },
});

export const {
  setAgentScorecard,
  setAgentDailyMissions,
  setAgentWeeklyMissions,
  setAgentLeaderboard,
  setAgentBadges,
  setAgentTier,
  setAgentRecognition,
  setAgentNotifications,
  setAgentPreferences,
  setManagerDashboard,
  setManagerLeaderboard,
  setManagerAlerts,
  setManagerCoachingPrompts,
  setManagerMissions,
  setAdminConfig,
  setAdminAnalytics,
  setAdminCampaigns,
  setAdminAuditRows,
  setExpoDeviceState,
  resetGamification,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
