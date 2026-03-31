import React, { useState } from "react";
import {
  Image,
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";
import {
  getBadgesByKeys,
  getMissionBadgeMeta,
  getMissionDisplayTitle,
  getMissionProgressPercent,
  getMissionProgressLabel,
  getMissionRewardText,
  getMissionTypeLabel,
  MISSION_SHOWCASE_BADGE_KEYS,
} from "../constants/gamificationVisuals";
import {
  setAgentDailyMissions,
  setAgentWeeklyMissions,
} from "../redux/features/gamificationSlice";
import { gamificationApi } from "../api/gamification";

const MissionList = ({ title, subtitle, missions, progressPercent, badgeKeys }) => {
  const showcaseBadges = getBadgesByKeys(badgeKeys);

  return (
    <GamificationCard
      title={title}
      subtitle={`${progressPercent ?? 0}% complete${subtitle ? ` • ${subtitle}` : ""}`}
    >
      <View style={styles.showcaseBadgeRow}>
        {showcaseBadges.map((badge) => (
          <View key={badge.key} style={styles.showcaseBadgeCard}>
            {badge.image ? (
              <Image source={badge.image} style={styles.showcaseBadgeImage} />
            ) : null}
            <Text style={styles.showcaseBadgeText}>{badge.title}</Text>
          </View>
        ))}
      </View>
      {missions?.length ? (
        missions.map((mission, index) => {
          const missionBadge = getMissionBadgeMeta(mission, index);
          const missionTitle = getMissionDisplayTitle(mission, index);
          const missionProgressLabel = getMissionProgressLabel(mission);
          const missionProgressPercent = getMissionProgressPercent(mission);
          const missionRewardText = getMissionRewardText(mission);
          const missionTypeLabel = getMissionTypeLabel(mission, title?.includes("Weekly") ? "weekly" : "daily");

          return (
            <View key={mission.key || `${missionTitle}-${index}`} style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <View style={styles.missionIdentity}>
                  {missionBadge?.image ? (
                    <Image source={missionBadge.image} style={styles.missionBadgeImage} />
                  ) : null}
                  <View style={styles.missionTextBlock}>
                    <Text style={styles.missionTitle}>{missionTitle}</Text>
                    <Text style={styles.missionMeta}>
                      {missionProgressLabel} • {missionTypeLabel}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.rewardPill,
                    mission.completed && styles.rewardPillDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.rewardPillText,
                      mission.completed && styles.rewardPillDoneText,
                    ]}
                  >
                    {missionRewardText}
                  </Text>
                </View>
              </View>
              {!!missionBadge?.description && (
                <Text style={styles.missionBadgeHint}>{missionBadge.description}</Text>
              )}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${missionProgressPercent}%`,
                    },
                  ]}
                />
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
  );
};

const GamificationMissions = ({ navigation, route }) => {
  const token = useSelector((state) => state.User?.token);
  const { dailyMissions, weeklyMissions } = useSelector(
    (state) => state.Gamification.agent
  );
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
        gamificationApi.getDailyMissions(token),
        gamificationApi.getWeeklyMissions(token),
      ])
        .then(([daily, weekly]) => {
          dispatch(setAgentDailyMissions(daily));
          dispatch(setAgentWeeklyMissions(weekly));
        })
        .catch((error) => console.error("Error loading missions:", error))
        .finally(() => setLoading(false));
    }, [dispatch, token])
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate(route?.params?.backTo || "Dashboard")}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Missions</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Leaderboard", { backTo: "Missions" })
            }
          >
            <MaterialCommunityIcons name="podium-gold" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <MissionList
          title="Daily Missions"
          subtitle="Today’s execution priorities"
          missions={dailyMissions?.missions}
          progressPercent={dailyMissions?.progressPercent}
          badgeKeys={MISSION_SHOWCASE_BADGE_KEYS.daily}
        />

        <MissionList
          title="Weekly Missions"
          subtitle="Momentum goals for the week"
          missions={weeklyMissions?.missions}
          progressPercent={weeklyMissions?.progressPercent}
          badgeKeys={MISSION_SHOWCASE_BADGE_KEYS.weekly}
        />
      </ScrollView>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
  },
  showcaseBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  showcaseBadgeCard: {
    width: "31%",
    backgroundColor: "rgba(56, 113, 193, 0.06)",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
  },
  showcaseBadgeImage: {
    width: 42,
    height: 42,
    resizeMode: "contain",
    marginBottom: 6,
  },
  showcaseBadgeText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "700",
    textAlign: "center",
    color: theme.colors.textPrimary,
  },
  missionCard: {
    backgroundColor: "rgba(56, 113, 193, 0.06)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  missionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  missionIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  missionBadgeImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  missionTextBlock: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  missionMeta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 10,
  },
  missionBadgeHint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 10,
    lineHeight: 18,
  },
  rewardPill: {
    borderRadius: 999,
    backgroundColor: "rgba(247, 161, 31, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  rewardPillDone: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  rewardPillText: {
    color: theme.colors.warning,
    fontWeight: "700",
    fontSize: 11,
  },
  rewardPillDoneText: {
    color: theme.colors.success,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(100, 116, 139, 0.18)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.background,
    borderRadius: 999,
  },
});

export default GamificationMissions;
