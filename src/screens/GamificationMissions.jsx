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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";
import {
  setAgentDailyMissions,
  setAgentWeeklyMissions,
} from "../redux/features/gamificationSlice";
import { gamificationApi } from "../api/gamification";

const MissionList = ({ title, subtitle, missions, progressPercent }) => {
  return (
    <GamificationCard
      title={title}
      subtitle={`${progressPercent ?? 0}% complete${subtitle ? ` • ${subtitle}` : ""}`}
    >
      {missions?.length ? (
        missions.map((mission) => (
          <View key={mission.key} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <Text style={styles.missionTitle}>{mission.title}</Text>
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
                  {mission.completed ? "Completed" : `${mission.rewardPoints} pts`}
                </Text>
              </View>
            </View>
            <Text style={styles.missionMeta}>
              {mission.progressLabel} • {mission.type}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      100,
                      mission.target ? (mission.progress / mission.target) * 100 : 0
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))
      ) : (
        <GamificationEmptyState
          title="No missions yet"
          message="Set your targets to generate missions."
        />
      )}
    </GamificationCard>
  );
};

const GamificationMissions = ({ navigation }) => {
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Missions</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Leaderboard")}>
            <MaterialCommunityIcons name="podium-gold" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <MissionList
          title="Daily Missions"
          subtitle="Today’s execution priorities"
          missions={dailyMissions?.missions}
          progressPercent={dailyMissions?.progressPercent}
        />

        <MissionList
          title="Weekly Missions"
          subtitle="Momentum goals for the week"
          missions={weeklyMissions?.missions}
          progressPercent={weeklyMissions?.progressPercent}
        />
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
  missionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    paddingRight: 12,
  },
  missionMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 10,
  },
  rewardPill: {
    borderRadius: 999,
    backgroundColor: "rgba(247, 161, 31, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rewardPillDone: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  rewardPillText: {
    color: theme.colors.warning,
    fontWeight: "700",
    fontSize: 12,
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
