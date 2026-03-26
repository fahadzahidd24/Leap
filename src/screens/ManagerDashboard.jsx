import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { gamificationApi } from "../api/gamification";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";
import {
  setManagerAlerts,
  setManagerCoachingPrompts,
  setManagerDashboard,
  setManagerLeaderboard,
  setManagerMissions,
} from "../redux/features/gamificationSlice";

const ManagerDashboard = ({ navigation }) => {
  const token = useSelector((state) => state.User?.token);
  const { dashboard, leaderboard, alerts, coachingPrompts, missions } =
    useSelector((state) => state.Gamification.manager);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      Promise.all([
        gamificationApi.getManagerDashboard(token),
        gamificationApi.getManagerLeaderboard(token),
        gamificationApi.getManagerAlerts(token),
        gamificationApi.getManagerCoachingPrompts(token),
        gamificationApi.getManagerMissions(token),
      ])
        .then(
          ([
            dashboardRes,
            leaderboardRes,
            alertsRes,
            promptsRes,
            missionsRes,
          ]) => {
            dispatch(setManagerDashboard(dashboardRes));
            dispatch(setManagerLeaderboard(leaderboardRes));
            dispatch(setManagerAlerts(alertsRes));
            dispatch(setManagerCoachingPrompts(promptsRes?.prompts || []));
            dispatch(
              setManagerMissions(
                missionsRes?.length ? missionsRes : promptsRes?.missions || []
              )
            );
          }
        )
        .catch((error) =>
          console.error("Error loading manager dashboard:", error)
        )
        .finally(() => setLoading(false));
    }, [dispatch, token])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Manager Dashboard</Text>

        <GamificationCard title="Quick Access" subtitle="Jump to the action">
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => navigation.navigate("My Agents")}
            >
              <Text style={styles.quickButtonTitle}>My Agents</Text>
              <Text style={styles.quickButtonText}>
                Open reports and coaching
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => navigation.navigate("Live Locations")}
            >
              <Text style={styles.quickButtonTitle}>Live Locations</Text>
              <Text style={styles.quickButtonText}>
                Track your field team on map
              </Text>
            </TouchableOpacity>
          </View>
        </GamificationCard>

        {/* <GamificationCard title="Summary" subtitle="Live team snapshot">
          {dashboard?.summary ? (
            <View style={styles.summaryGrid}>
              {Object.entries(dashboard.summary)
                .slice(0, 4)
                .map(([key, value]) => (
                  <View key={key} style={styles.summaryCard}>
                    <Text style={styles.summaryKey}>{key}</Text>
                    <Text style={styles.summaryValue}>{String(value)}</Text>
                  </View>
                ))}
            </View>
          ) : (
            <GamificationEmptyState
              title="No team members found in your hierarchy yet"
              message="Manager summary metrics will appear once your team data is available."
            />
          )}
        </GamificationCard> */}
{/* 
        <GamificationCard
          title="Manager Missions"
          subtitle="Weekly leadership focus"
        >
          {missions?.length ? (
            missions.map((mission, index) => (
              <View
                key={`${mission.key || mission.title}-${index}`}
                style={styles.simpleListRow}
              >
                <Text style={styles.simpleListTitle}>
                  {mission.title || mission.name || "Mission"}
                </Text>
                <Text style={styles.simpleListMeta}>
                  {mission.progressLabel ||
                    mission.status ||
                    `${mission.rewardPoints || 0} pts`}
                </Text>
              </View>
            ))
          ) : (
            <GamificationEmptyState
              title="No manager missions yet"
              message="Leadership missions will appear here when available."
            />
          )}
        </GamificationCard> */}

        <GamificationCard
          title="Team Leaderboard"
          subtitle="Who is carrying momentum this week"
        >
          {leaderboard?.entries?.length ? (
            leaderboard.entries.slice(0, 5).map((entry) => (
              <View
                key={`${entry.userId}-${entry.rank}`}
                style={styles.simpleListRow}
              >
                <Text style={styles.simpleListTitle}>
                  #{entry.rank} {entry.fullName}
                </Text>
                <Text style={styles.simpleListMeta}>
                  {entry.score} pts • {entry.label}
                </Text>
              </View>
            ))
          ) : (
            <GamificationEmptyState
              title="No ranked team activity yet"
              message="Leaderboard entries will appear as your team logs activity."
            />
          )}
        </GamificationCard>

        <GamificationCard
          title="Alerts"
          subtitle="Low-engagement follow-ups that need attention"
        >
          {(alerts?.length || dashboard?.lowEngagement?.length) ? (
            (alerts?.length ? alerts : dashboard?.lowEngagement || []).map(
              (alert, index) => (
                <View
                  key={`${alert.userId || alert.fullName}-${index}`}
                  style={styles.alertCard}
                >
                  <Text style={styles.alertTitle}>
                    {alert.fullName || alert.userName || "Team member"}
                  </Text>
                  <Text style={styles.alertMeta}>
                    {alert.reason || alert.message || "Low engagement detected"}
                  </Text>
                </View>
              )
            )
          ) : (
            <GamificationEmptyState
              title="No alerts right now"
              message="Low-engagement members will appear here when follow-up is needed."
            />
          )}
        </GamificationCard>

        {/* <GamificationCard
          title="Coaching Prompts"
          subtitle="Suggested talking points from the backend"
        >
          {coachingPrompts?.length ? (
            coachingPrompts.map((prompt, index) => (
              <View
                key={`${prompt.title || prompt.prompt}-${index}`}
                style={styles.promptCard}
              >
                <Text style={styles.simpleListTitle}>
                  {prompt.title || prompt.prompt || "Coaching prompt"}
                </Text>
                <Text style={styles.simpleListMeta}>
                  {prompt.body || prompt.description || "Prompt details"}
                </Text>
              </View>
            ))
          ) : (
            <GamificationEmptyState
              title="No coaching prompts yet"
              message="Prompt suggestions will show up once the backend starts generating them."
            />
          )}
        </GamificationCard> */}
      </ScrollView>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 18,
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickButton: {
    width: "48%",
    backgroundColor: "rgba(56, 113, 193, 0.06)",
    borderRadius: 14,
    padding: 14,
  },
  quickButtonTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  quickButtonText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "rgba(56, 113, 193, 0.06)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  summaryKey: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  simpleListRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.12)",
  },
  simpleListTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  simpleListMeta: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  alertCard: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  alertMeta: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  promptCard: {
    backgroundColor: "rgba(247, 161, 31, 0.12)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
});

export default ManagerDashboard;
