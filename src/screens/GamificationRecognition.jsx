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
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";
import {
  getBadgeMeta,
  getTierMeta,
} from "../constants/gamificationVisuals";
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

const formatCategoryLabel = (value) => {
  const normalized = (value || "Milestone").replace(/_/g, " ").toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const GamificationRecognition = ({ navigation }) => {
  const token = useSelector((state) => state.User?.token);
  const { badges, tier, recognition } = useSelector(
    (state) => state.Gamification.agent
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const currentTierMeta = getTierMeta(tier?.currentTier);
  const nextTierMeta = getTierMeta(tier?.nextTier);
  const formattedTierProgress = Number(tier?.progressPercent || 0).toFixed(1);

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recognition</Text>
          <View style={{ width: 24 }} />
        </View>

        <GamificationCard
          title="Tier Progress"
          subtitle={
            tier?.nextTier ? `Next tier: ${tier.nextTier}` : "Your current level"
          }
        >
          {tier ? (
            <>
              <View style={styles.tierRow}>
                <View style={styles.tierIdentity}>
                  {currentTierMeta?.image ? (
                    <Image source={currentTierMeta.image} style={styles.tierImage} />
                  ) : null}
                  <View style={styles.tierTextBlock}>
                    <Text style={styles.tierLabel}>Current tier</Text>
                    <Text style={styles.tierValue}>{tier.currentTier}</Text>
                  </View>
                </View>
                <View style={styles.tierScoreBlock}>
                  {nextTierMeta?.image ? (
                    <Image source={nextTierMeta.image} style={styles.nextTierImage} />
                  ) : null}
                  <Text style={styles.tierLabel}>Lifetime score</Text>
                  <Text style={styles.tierValue}>{tier.lifetimeScore ?? 0}</Text>
                </View>
              </View>
              <View style={styles.nextTierBanner}>
                <Text style={styles.nextTierBannerText}>
                  {tier.nextTier
                    ? `Next unlock: ${tier.nextTier}`
                    : "Top tier unlocked"}
                </Text>
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
                {formattedTierProgress}% of the way to{" "}
                {tier.nextTier || "your next tier"}
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
              {badges.slice(0, 8).map((badge, index) => {
                const badgeMeta = getBadgeMeta(
                  badge.badgeKey,
                  badge.badgeTitle,
                  badge.badgeCategory
                );

                return (
                  <View key={`${badge.badgeKey}-${index}`} style={styles.badgeCard}>
                    {badgeMeta.image ? (
                      <Image source={badgeMeta.image} style={styles.badgeImage} />
                    ) : (
                      <View style={styles.badgeIcon}>
                        <Ionicons
                          name="ribbon-outline"
                          size={22}
                          color={theme.colors.warning}
                        />
                      </View>
                    )}
                    <Text style={styles.badgeTitle}>{badgeMeta.title}</Text>
                    {!!badgeMeta.description && (
                      <Text style={styles.badgeDescription}>
                        {badgeMeta.description}
                      </Text>
                    )}
                    {/* horizontalDivider */}
                    <View style={styles.horizontalDivider} />
                    <Text style={styles.badgeMeta}>
                      {formatCategoryLabel(badgeMeta.category)}{" "}
                      {formatDate(badge.awardedAt)}
                    </Text>
                  </View>
                );
              })}
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
            recognition.feed.map((item, index) => {
              const badgeMeta = getBadgeMeta(
                item.badgeKey,
                item.title || item.badgeTitle,
                item.badgeCategory
              );

              return (
                <View key={`${item.title || item.message}-${index}`} style={styles.timelineRow}>
                  {badgeMeta.image ? (
                    <Image source={badgeMeta.image} style={styles.timelineImage} />
                  ) : (
                    <View style={styles.timelineDot} />
                  )}
                  <View style={styles.timelineText}>
                    <Text style={styles.timelineTitle}>
                      {badgeMeta.title || item.type || "Recognition"}
                    </Text>
                    <Text style={styles.timelineMeta}>
                      {badgeMeta.description ||
                        item.body ||
                        item.message ||
                        "Momentum unlocked"}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {formatDate(item.awardedAt || item.createdAt || item.date)}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <GamificationEmptyState
              title="No recognitions yet"
              message="Keep logging activity to unlock badges."
            />
          )}
        </GamificationCard>

        <GamificationCard
          title="Recognition Wall"
          subtitle="Celebrate company-wide highlights"
        >
          {recognition?.wall?.length ? (
            recognition.wall.map((item, index) => {
              const badgeMeta = getBadgeMeta(
                item.badgeKey,
                item.title || item.badgeTitle,
                item.badgeCategory
              );

              return (
                <View key={`${item.title || item.message}-${index}`} style={styles.wallCard}>
                  <View style={styles.wallHeader}>
                    {badgeMeta.image ? (
                      <Image source={badgeMeta.image} style={styles.wallImage} />
                    ) : null}
                    <View style={styles.wallHeaderText}>
                      <Text style={styles.wallTitle}>
                        {item.fullName || item.userName || badgeMeta.title || "Team recognition"}
                      </Text>
                      <Text style={styles.wallMeta}>
                        {badgeMeta.title || "Achievement unlocked"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.wallBody}>
                    {badgeMeta.description ||
                      item.body ||
                      item.message ||
                      item.badgeTitle ||
                      "Achievement unlocked"}
                  </Text>
                </View>
              );
            })
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
    alignItems: "flex-start",
    marginBottom: 14,
  },
  tierIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 12,
  },
  tierImage: {
    width: 68,
    height: 68,
    resizeMode: "contain",
    marginRight: 12,
  },
  tierTextBlock: {
    flex: 1,
  },
  tierScoreBlock: {
    alignItems: "flex-end",
  },
  nextTierImage: {
    width: 34,
    height: 34,
    resizeMode: "contain",
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  nextTierBanner: {
    backgroundColor: "rgba(247, 161, 31, 0.12)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  nextTierBannerText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
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
  badgeImage: {
    width: 72,
    height: 72,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
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
  badgeDescription: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 14,
    marginBottom: 6,
  },
  badgeMeta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    lineHeight: 14,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  timelineImage: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    marginRight: 10,
    marginTop: 2,
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
  wallHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  wallImage: {
    width: 42,
    height: 42,
    resizeMode: "contain",
    marginRight: 10,
  },
  wallHeaderText: {
    flex: 1,
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
  wallBody: {
    marginTop: 10,
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: "rgba(100, 116, 139, 0.18)",
    marginVertical: 12,
  },
});

export default GamificationRecognition;
