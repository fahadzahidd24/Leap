import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { theme } from "../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";
import {
  DASHBOARD_SHOWCASE_BADGE_KEYS,
  getBadgesByKeys,
  getLeaderboardBadgeMeta,
  getMissionBadgeMeta,
} from "../constants/gamificationVisuals";
import {
  setAgentDailyMissions,
  setAgentLeaderboard,
  setAgentNotifications,
  setAgentScorecard,
} from "../redux/features/gamificationSlice";
import { gamificationApi } from "../api/gamification";

const QuickAction = ({ icon, label, onPress, accentColor }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View
      style={[
        styles.quickActionIcon,
        { backgroundColor: accentColor || "rgba(56, 113, 193, 0.12)" },
      ]}
    >
      {icon}
    </View>
    <Text style={styles.quickActionText}>{label}</Text>
  </TouchableOpacity>
);

const GamificationDashboard = ({ navigation }) => {
  const {
    scorecard,
    dailyMissions,
    leaderboard,
    notifications,
  } = useSelector((state) => state.Gamification.agent);
  const user = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.token || user?.role !== "agent") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadingError("");

      Promise.all([
        gamificationApi.getScorecard(user.token),
        gamificationApi.getDailyMissions(user.token),
        gamificationApi.getLeaderboard(user.token),
        gamificationApi.getNotifications(user.token),
      ])
        .then(
          ([
            scorecardData,
            dailyMissionData,
            leaderboardData,
            notificationData,
          ]) => {
            dispatch(setAgentScorecard(scorecardData));
            dispatch(setAgentDailyMissions(dailyMissionData));
            dispatch(setAgentLeaderboard(leaderboardData));
            dispatch(setAgentNotifications(notificationData));
          }
        )
        .catch((error) => {
          console.error("Error loading gamification dashboard:", error);
          setLoadingError(
            "Unable to refresh your gamification dashboard right now."
          );
        })
        .finally(() => setLoading(false));
    }, [dispatch, user?.role, user?.token])
  );

  const topLeaderboardEntries = leaderboard?.entries?.slice(0, 3) || [];
  const recentNotifications = notifications?.slice(0, 3) || [];
  const dailyStats = scorecard?.daily?.stats || {};
  const streak = scorecard?.streak || {};
  const weeklyTrend = scorecard?.weekly?.trend || [];
  const dailyGoals = scorecard?.daily?.goals || {};
  const dailyRatios = scorecard?.daily?.ratios || {};
  const prospectingRatioPercent = dailyGoals?.p_daily
    ? Math.round(((dailyStats?.prospects ?? 0) / dailyGoals.p_daily) * 100)
    : 0;
  const showcaseBadges = getBadgesByKeys(DASHBOARD_SHOWCASE_BADGE_KEYS);

  const encouragementText = useMemo(() => {
    if (scorecard?.daily?.score > 0) {
      return null;
    }

    return "Start with your first prospect today.";
  }, [scorecard?.daily?.score]);

  const openOverviewScreen = (screenName) => {
    navigation.navigate("tabs", {
      screen: screenName,
    });
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        enabled
      >
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={theme.colors.background}
        />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={styles.contentContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.welcomeText}>
            Welcome back, {user?.fullName?.split(" ")?.[0] || "Agent"}
          </Text>

          <GamificationCard
            title="Execution Score"
            subtitle={
              scorecard?.daily?.label || "Your daily momentum snapshot"
            }
            rightContent={
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreBadgeText}>
                  {scorecard?.daily?.score ?? "--"}
                </Text>
              </View>
            }
          >
            {loading ? (
              <Text style={styles.helperText}>Loading your scorecard...</Text>
            ) : loadingError ? (
              <Text style={styles.errorText}>{loadingError}</Text>
            ) : (
              <>
                {encouragementText ? (
                  <Text style={styles.encouragementText}>
                    {encouragementText}
                  </Text>
                ) : null}
                <View style={styles.statRow}>
                  <View style={styles.statChip}>
                    <Text style={styles.statValue}>
                      {dailyStats?.prospects ?? 0}/{dailyGoals?.p_daily ?? 0}
                    </Text>
                    <Text style={styles.statLabel}>Prospecting</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Text style={styles.statValue}>
                      {dailyStats?.appointments ?? 0}/{dailyGoals?.a_daily ?? 0}
                    </Text>
                    <Text style={styles.statLabel}>Appointments</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Text style={styles.statValue}>
                      {dailyStats?.presentations ?? 0}/{dailyGoals?.pr_daily ?? 0}
                    </Text>
                    <Text style={styles.statLabel}>Presentations</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Text style={styles.statValue}>
                      {dailyStats?.salesCount ?? 0}/{dailyGoals?.s_daily ?? 0}
                    </Text>
                    <Text style={styles.statLabel}>Sales</Text>
                  </View>
                </View>
                <View style={styles.trendRow}>
                  <Text style={styles.streakText}>
                    {streak?.current ?? 0} day streak
                  </Text>
                  <Text style={styles.streakSubtext}>
                    Best: {streak?.longest ?? 0}
                  </Text>
                </View>
                <View style={styles.trendChipRow}>
                  {(weeklyTrend.length
                    ? weeklyTrend
                    : [{ date: "Today", score: 0 }]
                  ).map((trendItem, index) => (
                    <View
                      key={`${trendItem.date}-${index}`}
                      style={styles.trendChip}
                    >
                      <Text style={styles.trendChipDate}>
                        {trendItem.date?.slice?.(0, 5) || "Today"}
                      </Text>
                      <Text style={styles.trendChipScore}>
                        {trendItem.score ?? 0}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={styles.ratioRow}>
                  <Text style={styles.ratioText}>
                    P: {prospectingRatioPercent}%
                  </Text>
                  <Text style={styles.ratioText}>
                    A: {dailyRatios?.appointmentRatioPercent ?? 0}%
                  </Text>
                  <Text style={styles.ratioText}>
                    P: {dailyRatios?.presentationRatioPercent ?? 0}%
                  </Text>
                  <Text style={styles.ratioText}>
                    S: {dailyRatios?.salesRatioPercent ?? 0}%
                  </Text>
                </View>
              </>
            )}
          </GamificationCard>

          <GamificationCard
            title="Quick Actions"
            subtitle="Jump into the next high-impact task"
          >
            <View style={styles.quickActionRow}>
              <QuickAction
                label="Log Activity"
                accentColor="rgba(247, 161, 31, 0.15)"
                icon={
                  <Ionicons
                    name="flash-outline"
                    size={20}
                    color={theme.colors.accent}
                  />
                }
                onPress={() => openOverviewScreen("Daily Activity")}
              />
              <QuickAction
                label="Missions"
                accentColor="rgba(16, 185, 129, 0.15)"
                icon={
                  <MaterialCommunityIcons
                    name="flag-outline"
                    size={20}
                    color={theme.colors.success}
                  />
                }
                onPress={() => navigation.navigate("Missions")}
              />
              <QuickAction
                label="Leaderboard"
                accentColor="rgba(96, 165, 250, 0.15)"
                icon={
                  <MaterialCommunityIcons
                    name="podium-gold"
                    size={20}
                    color={theme.colors.info}
                  />
                }
                onPress={() => navigation.navigate("Leaderboard")}
              />
              <QuickAction
                label="Recognition"
                accentColor="rgba(255, 202, 8, 0.18)"
                icon={
                  <Ionicons
                    name="sparkles-outline"
                    size={20}
                    color={theme.colors.warning}
                  />
                }
                onPress={() => navigation.navigate("Recognition")}
              />
            </View>
          </GamificationCard>

          <GamificationCard
            title="Badges In Play"
            subtitle="Keep these milestones moving"
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgeRail}
            >
              {showcaseBadges.map((badge) => (
                <View key={badge.key} style={styles.showcaseBadgeCard}>
                  {badge.image ? (
                    <Image source={badge.image} style={styles.showcaseBadgeImage} />
                  ) : null}
                  <Text style={styles.showcaseBadgeTitle}>{badge.title}</Text>
                </View>
              ))}
            </ScrollView>
          </GamificationCard>

          <GamificationCard
            title="Today’s Missions"
            subtitle={`${dailyMissions?.progressPercent ?? 0}% complete`}
            rightContent={
              <TouchableOpacity onPress={() => navigation.navigate("Missions")}>
                <Text style={styles.linkText}>View all</Text>
              </TouchableOpacity>
            }
          >
            {dailyMissions?.missions?.length ? (
              dailyMissions.missions.slice(0, 3).map((mission, index) => {
                const missionBadge = getMissionBadgeMeta(mission, index);

                return (
                  <View key={mission.key} style={styles.listRow}>
                    {missionBadge?.image ? (
                      <Image source={missionBadge.image} style={styles.inlineBadgeImage} />
                    ) : null}
                    <View style={styles.listRowText}>
                      <Text style={styles.listRowTitle}>{mission.title}</Text>
                      <Text style={styles.listRowSubtitle}>
                        {mission.progressLabel} • {mission.rewardPoints} pts
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        mission.completed && styles.statusPillSuccess,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          mission.completed && styles.statusPillTextSuccess,
                        ]}
                      >
                        {mission.completed ? "Done" : "Active"}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <GamificationEmptyState
                title="No missions yet"
                message="Set your targets to generate missions."
              />
            )}
          </GamificationCard>

          <GamificationCard
            title="Mini Leaderboard"
            subtitle="This week’s top momentum"
            rightContent={
              <TouchableOpacity
                onPress={() => navigation.navigate("Leaderboard")}
              >
                <Text style={styles.linkText}>Open</Text>
              </TouchableOpacity>
            }
          >
            {topLeaderboardEntries.length ? (
              <>
                {topLeaderboardEntries.map((entry) => {
                  const leaderboardBadge = getLeaderboardBadgeMeta(entry.rank);

                  return (
                    <View
                      key={`${entry.userId}-${entry.rank}`}
                      style={styles.listRow}
                    >
                      {leaderboardBadge?.image ? (
                        <Image
                          source={leaderboardBadge.image}
                          style={styles.inlineBadgeImage}
                        />
                      ) : (
                        <View style={styles.rankBadge}>
                          <Text style={styles.rankBadgeText}>#{entry.rank}</Text>
                        </View>
                      )}
                      <View style={styles.listRowText}>
                        <Text style={styles.listRowTitle}>{entry.fullName}</Text>
                        <Text style={styles.listRowSubtitle}>
                          {entry.label} • {entry.score} pts
                        </Text>
                      </View>
                      <Text style={styles.movementText}>
                        {entry.movement > 0
                          ? `+${entry.movement}`
                          : entry.movement || 0}
                      </Text>
                    </View>
                  );
                })}
                {leaderboard?.currentUserRank ? (
                  <View style={[styles.listRow, styles.currentRankRow]}>
                    <Text style={styles.currentRankText}>
                      Your rank: #{leaderboard.currentUserRank.rank}
                    </Text>
                  </View>
                ) : null}
              </>
            ) : (
              <GamificationEmptyState
                title="No ranked activity yet this week"
                message="Keep logging activity to appear on the leaderboard."
              />
            )}
          </GamificationCard>

          <GamificationCard
            title="Recent Notifications"
            subtitle="Keep an eye on reminders and recognition"
          >
            {recentNotifications.length ? (
              recentNotifications.map((item, index) => (
                <View key={`${item.title}-${index}`} style={styles.notificationRow}>
                  <Ionicons
                    name={
                      item.status === "sent"
                        ? "notifications"
                        : "notifications-outline"
                    }
                    size={18}
                    color={theme.colors.background}
                  />
                  <View style={styles.listRowText}>
                    <Text style={styles.listRowTitle}>{item.title}</Text>
                    <Text style={styles.listRowSubtitle}>{item.body}</Text>
                  </View>
                </View>
              ))
            ) : (
              <GamificationEmptyState
                title="No notifications yet"
                message="Reminders, streak alerts, and weekly updates will show here."
              />
            )}
          </GamificationCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GamificationDashboard;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    justifyContent: "center",
    paddingBottom: 20,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 18,
  },
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreBadgeText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  encouragementText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  statChip: {
    width: "50%",
    padding: 4,
  },
  statValue: {
    backgroundColor: "rgba(56, 113, 193, 0.08)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  trendRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  streakText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  streakSubtext: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  trendChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  trendChip: {
    backgroundColor: "rgba(247, 161, 31, 0.14)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  trendChipDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  trendChipScore: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  ratioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ratioText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  quickActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAction: {
    width: "48%",
    borderRadius: 14,
    backgroundColor: "rgba(15, 23, 42, 0.03)",
    padding: 12,
    marginBottom: 10,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  badgeRail: {
    paddingRight: 8,
  },
  showcaseBadgeCard: {
    width: 96,
    backgroundColor: "rgba(56, 113, 193, 0.06)",
    borderRadius: 14,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
  },
  showcaseBadgeImage: {
    width: 54,
    height: 54,
    resizeMode: "contain",
    marginBottom: 8,
  },
  showcaseBadgeTitle: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  linkText: {
    color: theme.colors.background,
    fontWeight: "700",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.12)",
  },
  listRowText: {
    flex: 1,
    paddingRight: 8,
  },
  inlineBadgeImage: {
    width: 38,
    height: 38,
    resizeMode: "contain",
    marginRight: 10,
  },
  listRowTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  listRowSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 3,
  },
  statusPill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "rgba(56, 113, 193, 0.1)",
  },
  statusPillSuccess: {
    backgroundColor: "rgba(16, 185, 129, 0.14)",
  },
  statusPillText: {
    color: theme.colors.background,
    fontSize: 11,
    fontWeight: "700",
  },
  statusPillTextSuccess: {
    color: theme.colors.success,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(247, 161, 31, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rankBadgeText: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  movementText: {
    color: theme.colors.success,
    fontSize: 13,
    fontWeight: "700",
  },
  currentRankRow: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  currentRankText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.background,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.12)",
  },
});
