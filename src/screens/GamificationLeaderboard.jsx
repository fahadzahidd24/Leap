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
  getBadgesByKeys,
  getLeaderboardBadgeMeta,
} from "../constants/gamificationVisuals";
import { setAgentLeaderboard } from "../redux/features/gamificationSlice";
import { gamificationApi } from "../api/gamification";

const scopes = [
  { key: "company", label: "Company" },
  // { key: "team", label: "Team" },
  // { key: "role", label: "Role" },
];

const GamificationLeaderboard = ({ navigation }) => {
  const token = useSelector((state) => state.User?.token);
  const leaderboard = useSelector((state) => state.Gamification.agent.leaderboard);
  const dispatch = useDispatch();
  const [scopeType, setScopeType] = useState("company");
  const [loading, setLoading] = useState(true);
  const leaderboardBadges = getBadgesByKeys([
    "role_model_signal",
    "execution_machine",
    "rising_performer",
  ]);

  useFocusEffect(
    React.useCallback(() => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      gamificationApi
        .getLeaderboard(token, { scopeType })
        .then((data) => dispatch(setAgentLeaderboard(data)))
        .catch((error) => console.error("Error loading leaderboard:", error))
        .finally(() => setLoading(false));
    }, [dispatch, scopeType, token])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.scopeRow}>
          {scopes.map((scope) => (
            <TouchableOpacity
              key={scope.key}
              onPress={() => setScopeType(scope.key)}
              style={[
                styles.scopePill,
                scopeType === scope.key && styles.scopePillActive,
              ]}
            >
              <Text
                style={[
                  styles.scopePillText,
                  scopeType === scope.key && styles.scopePillTextActive,
                ]}
              >
                {scope.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <GamificationCard
          title="Competitive Badges"
          subtitle="The momentum marks to chase this week"
        >
          <View style={styles.badgeStrip}>
            {leaderboardBadges.map((badge) => (
              <View key={badge.key} style={styles.badgeStripCard}>
                {badge.image ? (
                  <Image source={badge.image} style={styles.badgeStripImage} />
                ) : null}
                <Text style={styles.badgeStripTitle}>{badge.title}</Text>
              </View>
            ))}
          </View>
        </GamificationCard>

        {leaderboard?.currentUserRank ? (
          <GamificationCard title="Your Position">
            <Text style={styles.currentRank}>
              You are currently ranked #{leaderboard.currentUserRank.rank}.
            </Text>
          </GamificationCard>
        ) : null}

        <GamificationCard
          title="Weekly Rankings"
          subtitle={
            leaderboard?.weekKey
              ? `${leaderboard.weekKey} • ${leaderboard.scopeType || scopeType}`
              : "Current week"
          }
        >
          {leaderboard?.entries?.length ? (
            leaderboard.entries.map((entry) => {
              const rankBadge = getLeaderboardBadgeMeta(entry.rank);

              return (
                <View key={`${entry.userId}-${entry.rank}`} style={styles.row}>
                  {rankBadge?.image ? (
                    <Image source={rankBadge.image} style={styles.rankBadgeImage} />
                  ) : (
                    <View style={styles.rankCircle}>
                      <Text style={styles.rankCircleText}>#{entry.rank}</Text>
                    </View>
                  )}
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{entry.fullName}</Text>
                    <Text style={styles.rowSubtitle}>
                      {entry.label} • {entry.score} pts
                    </Text>
                  </View>
                  <View style={styles.rowMeta}>
                    <Text style={styles.scoreText}>{entry.salesCount || 0} sales</Text>
                    <Text
                      style={[
                        styles.movementText,
                        {
                          color:
                            entry.movement > 0
                              ? theme.colors.success
                              : entry.movement < 0
                              ? theme.colors.danger
                              : theme.colors.textMuted,
                        },
                      ]}
                    >
                      {entry.movement > 0 ? `+${entry.movement}` : entry.movement || 0}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <GamificationEmptyState
              title="No ranked activity yet this week"
              message="Keep logging activity to move up the rankings."
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
  scopeRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  scopePill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginRight: 8,
  },
  scopePillActive: {
    backgroundColor: "white",
  },
  scopePillText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },
  scopePillTextActive: {
    color: theme.colors.background,
  },
  badgeStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badgeStripCard: {
    width: "31%",
    backgroundColor: "rgba(56, 113, 193, 0.06)",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },
  badgeStripImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    marginBottom: 8,
  },
  badgeStripTitle: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    color: theme.colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.12)",
  },
  rankBadgeImage: {
    width: 42,
    height: 42,
    resizeMode: "contain",
    marginRight: 12,
  },
  rankCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(247, 161, 31, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankCircleText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 3,
  },
  rowMeta: {
    alignItems: "flex-end",
  },
  scoreText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  movementText: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  currentRank: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
});

export default GamificationLeaderboard;
