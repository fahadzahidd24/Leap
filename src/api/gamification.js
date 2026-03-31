import { privateApi } from "./axios";
import { normalizeTierData } from "../constants/gamificationVisuals";

export const gamificationApi = {
  getScorecard: async (token) => {
    const res = await privateApi(token).get("/gamification/me/scorecard");
    return res.data?.scorecard || null;
  },
  getDailyMissions: async (token) => {
    const res = await privateApi(token).get("/gamification/me/missions/daily");
    return res.data || { progressPercent: 0, missions: [] };
  },
  getWeeklyMissions: async (token) => {
    const res = await privateApi(token).get("/gamification/me/missions/weekly");
    return res.data || { progressPercent: 0, missions: [] };
  },
  getLeaderboard: async (token, params = {}) => {
    const res = await privateApi(token).get("/gamification/me/leaderboard", {
      params,
    });
    return res.data?.leaderboard || null;
  },
  getBadges: async (token) => {
    const res = await privateApi(token).get("/gamification/me/badges");
    return res.data?.badges || res.data || [];
  },
  getTier: async (token) => {
    const res = await privateApi(token).get("/gamification/me/tier");
    return normalizeTierData(res.data?.tier || null);
  },
  getRecognitionFeed: async (token) => {
    const res = await privateApi(token).get("/gamification/me/recognition-feed");
    return {
      feed: res.data?.feed || [],
      wall: res.data?.wall || [],
    };
  },
  getNotifications: async (token) => {
    const res = await privateApi(token).get("/gamification/me/notifications");
    return {
      notifications: res.data?.notifications || [],
      preferences: res.data?.preferences || null,
    };
  },
  updatePreferences: async (token, preferences) => {
    const res = await privateApi(token).put(
      "/gamification/me/preferences",
      preferences
    );
    return res.data?.preferences || preferences;
  },
  registerExpoDevice: async (token, payload) => {
    const res = await privateApi(token).post(
      "/gamification/me/expo-device",
      payload
    );
    return res.data;
  },
  getManagerDashboard: async (token) => {
    const res = await privateApi(token).get("/gamification/manager/dashboard");
    return res.data;
  },
  getManagerLeaderboard: async (token) => {
    const res = await privateApi(token).get(
      "/gamification/manager/team-leaderboard"
    );
    return res.data?.leaderboard || res.data || null;
  },
  getManagerAlerts: async (token) => {
    const res = await privateApi(token).get("/gamification/manager/alerts");
    return res.data?.alerts || res.data || [];
  },
  getManagerCoachingPrompts: async (token) => {
    const res = await privateApi(token).get(
      "/gamification/manager/coaching-prompts"
    );
    return {
      prompts: res.data?.coachingPrompts || res.data?.prompts || [],
      missions: res.data?.managerMissions || res.data?.missions || [],
    };
  },
  getManagerMissions: async (token) => {
    const res = await privateApi(token).get("/gamification/manager/missions");
    return res.data?.missions || res.data || [];
  },
  createCoachingSession: async (token, payload) => {
    const res = await privateApi(token).post(
      "/gamification/manager/coaching-sessions",
      payload
    );
    return res.data;
  },
  getAdminConfig: async (token) => {
    const res = await privateApi(token).get("/gamification/admin/config");
    return res.data?.config || res.data || null;
  },
  updateAdminConfig: async (token, payload) => {
    const res = await privateApi(token).put(
      "/gamification/admin/config",
      payload
    );
    return res.data?.config || res.data || payload;
  },
  getAdminAnalytics: async (token) => {
    const res = await privateApi(token).get("/gamification/admin/analytics");
    return res.data?.analytics || res.data || null;
  },
  getAdminAudit: async (token, userId) => {
    const res = await privateApi(token).get(`/gamification/admin/audits/${userId}`);
    return res.data?.audits || res.data?.rows || res.data || [];
  },
  getAdminCampaigns: async (token) => {
    const res = await privateApi(token).get("/gamification/admin/campaigns");
    return res.data?.campaigns || res.data || [];
  },
  createAdminCampaign: async (token, payload) => {
    const res = await privateApi(token).post(
      "/gamification/admin/campaigns",
      payload
    );
    return res.data?.campaign || res.data;
  },
  recomputeAdminState: async (token) => {
    const res = await privateApi(token).post("/gamification/admin/recompute");
    return res.data;
  },
};
