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
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";
import {
  setAgentBadges,
  setAgentRecognition,
  setAgentTier,
} from "../redux/features/gamificationSlice";
import { gamificationApi } from "../api/gamification";

const formatDate = (value) => {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
};

const GamificationRecognition = ({ navigation }) => {
  const token = useSelector((state) => state.User?.token);
  const { badges, tier, recognition } = useSelector(
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
        gamificationApi.getBadges(token),
        gamificationApi.getTier(token),
        gamificationApi.getRecognitionFeed(token),
      ])
        .then(([badgeData, tierData, recognitionData]) => {
          dispatch(setAgentBadges(badgeData));
          dispatch(setAgentTier(tierData));
          dispatch(setAgentRecognition(recognitionData));
        })
        .catch((error) => console.error("Error loading recognition:", error))
        .finally(() => setLoading(false));
    }, [dispatch, token])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recognition</Text>
          <View style={{ width: 24 }} />
        </View>

        <GamificationCard
          title="Tier Progress"
          subtitle={tier?.nextTier ? `Next tier: ${tier.nextTier}` : "Your current level"}
        >
          {tier ? (
            <>
              <View style={styles.tierRow}>
                <View>
                  <Text style={styles.tierLabel}>Current tier</Text>
                  <Text style={styles.tierValue}>{tier.currentTier}</Text>
                </View>
                <View style={styles.tierScoreBlock}>
                  <Text style={styles.tierLabel}>Lifetime score</Text>
                  <Text style={styles.tierValue}>{tier.lifetimeScore ?? 0}</Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, tier.progressPercent || 0)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {tier.progressPercent ?? 0}% of the way to {tier.nextTier || "your next tier"}
              </Text>
            </>
          ) : (
            <GamificationEmptyState
              title="No tier data yet"
              message="Keep logging activity to build lifetime momentum."
            />
          )}
        </GamificationCard>

        <GamificationCard title="Badges" subtitle="Recently earned milestones">
          {badges?.length ? (
            <View style={styles.badgeGrid}>
              {badges.slice(0, 8).map((badge, index) => (
                <View key={`${badge.badgeKey}-${index}`} style={styles.badgeCard}>
                  <View style={styles.badgeIcon}>
                    <Ionicons name="ribbon-outline" size={22} color={theme.colors.warning} />
                  </View>
                  <Text style={styles.badgeTitle}>{badge.badgeTitle}</Text>
                  <Text style={styles.badgeMeta}>
                    {badge.badgeCategory || "Milestone"} • {formatDate(badge.awardedAt)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <GamificationEmptyState
              title="No recognitions yet"
              message="Keep logging activity to unlock badges."
            />
          )}
        </GamificationCard>

        <GamificationCard title="Recognition Timeline" subtitle="Your latest wins">
          {recognition?.feed?.length ? (
            recognition.feed.map((item, index) => (
              <View key={`${item.title || item.message}-${index}`} style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineText}>
                  <Text style={styles.timelineTitle}>
                    {item.title || item.badgeTitle || item.type || "Recognition"}
                  </Text>
                  <Text style={styles.timelineMeta}>
                    {item.body || item.message || "Momentum unlocked"}
                  </Text>
                  <Text style={styles.timelineDate}>
                    {formatDate(item.awardedAt || item.createdAt || item.date)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <GamificationEmptyState
              title="No recognitions yet"
              message="Keep logging activity to unlock badges."
            />
          )}
        </GamificationCard>

        <GamificationCard title="Recognition Wall" subtitle="Celebrate company-wide highlights">
          {recognition?.wall?.length ? (
            recognition.wall.map((item, index) => (
              <View key={`${item.title || item.message}-${index}`} style={styles.wallCard}>
                <Text style={styles.wallTitle}>
                  {item.fullName || item.userName || item.title || "Team recognition"}
                </Text>
                <Text style={styles.wallMeta}>
                  {item.body || item.message || item.badgeTitle || "Achievement unlocked"}
                </Text>
              </View>
            ))
          ) : (
            <GamificationEmptyState
              title="Recognition wall is quiet"
              message="Company-wide highlights will appear here as badges and milestones are unlocked."
            />
          )}
        </GamificationCard>
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
  tierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  tierScoreBlock: {
    alignItems: "flex-end",
  },
  tierLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  tierValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(100, 116, 139, 0.18)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
  },
  progressText: {
    marginTop: 8,
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "48%",
    backgroundColor: "rgba(56, 113, 193, 0.06)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(247, 161, 31, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  badgeMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
    marginTop: 6,
    marginRight: 10,
  },
  timelineText: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  timelineMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  timelineDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  wallCard: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  wallTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  wallMeta: {
    marginTop: 5,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});

export default GamificationRecognition;
