import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { privateApi } from "../api/axios";
import { gamificationApi } from "../api/gamification";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import { useFocusEffect } from "@react-navigation/native";
import { formatPercentage } from "../utils/formatPercentage";
import { Button } from "react-native-paper";
import { getMalaysianDateString } from "../utils/currentDate&Day";

const MyAgents = ({ navigation }) => {
  const { token, _id } = useSelector((state) => state.User);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayReportModal, setDisplayReportModal] = useState(false);
  const [displayCoachingModal, setDisplayCoachingModal] = useState(false);
  const [agentPAS, setAgentPAS] = useState({});
  const [agentEntries, setAgentEntries] = useState({});
  const [selectedAgentName, setSelectedAgentName] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [loadingReportId, setLoadingReportId] = useState(null);
  const [coachingNotes, setCoachingNotes] = useState("");
  const [focusAreas, setFocusAreas] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [submittingCoaching, setSubmittingCoaching] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      privateApi(token)
        .get(`/agents/${_id}`)
        .then((agentsRes) => {
          setAgents(agentsRes.data?.userDetails || []);
        })
        .catch((error) => console.error("Error loading agents:", error))
        .finally(() => setLoading(false));
    }, [token, _id])
  );

  const calculateSalesRatioAchieved = (pasData) => {
    const yearlyAchievedPR = pasData?.pr_yearly || 0;
    const yearlyAchievedS = pasData?.s_yearly || 0;
    return (yearlyAchievedS / yearlyAchievedPR) * 100;
  };

  const fetchAgentReport = (agentId, agentName) => {
    setLoadingReportId(agentId);
    setSelectedAgentName(agentName);

    privateApi(token)
      .get(`/entries/${agentId}`)
      .then((res) => {
        setAgentEntries(res.data?.entries || {});
        setAgentPAS(res.data?.pas || {});
        setDisplayReportModal(true);
      })
      .catch((err) => {
        console.error("Error fetching agent report:", err);
      })
      .finally(() => {
        setLoadingReportId(null);
      });
  };

  const openCoachingModal = (agentId, agentName) => {
    setSelectedAgentId(agentId);
    setSelectedAgentName(agentName);
    setCoachingNotes("");
    setFocusAreas("");
    setOutcomes("");
    setDisplayCoachingModal(true);
  };

  const submitCoachingSession = async () => {
    if (!selectedAgentId || !coachingNotes.trim()) {
      return;
    }

    setSubmittingCoaching(true);

    try {
      await gamificationApi.createCoachingSession(token, {
        agentUserId: selectedAgentId,
        date: getMalaysianDateString(),
        notes: coachingNotes.trim(),
        focusAreas: focusAreas
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        outcomes: outcomes
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setDisplayCoachingModal(false);
    } catch (error) {
      console.error("Error creating coaching session:", error);
    } finally {
      setSubmittingCoaching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>My Agents</Text>
        <TouchableOpacity
          style={styles.liveMapButton}
          onPress={() => navigation.navigate("Live Locations")}
        >
          <Ionicons name="location-outline" size={18} color="white" />
          <Text style={styles.liveMapButtonText}>Live Map</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={agents}
          keyExtractor={(item, index) =>
            String(item.id || item._id || item.email || index)
          }
          renderItem={({ item }) => {
            const agentId = item.id || item._id;
            const isLoading = loadingReportId === agentId;

            return (
              <View style={styles.agentContainer}>
                <View style={styles.leftSideView}>
                  <Text style={styles.userName}>{item.fullName}</Text>
                  <Text style={styles.message}>
                    {item.email || item.utcCode || "No identifier"}
                  </Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.inlineButton,
                      isLoading && styles.inlineButtonLoading,
                    ]}
                    onPress={() =>
                      !isLoading &&
                      fetchAgentReport(agentId, item.fullName)
                    }
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.inlineButtonText}>Report</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.inlineButton, styles.secondaryButton]}
                    onPress={() =>
                      navigation.navigate("Chat", {
                        userId1: _id,
                        userId2: agentId,
                        userName2: item.fullName,
                      })
                    }
                  >
                    <Ionicons name="chatbubble-outline" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No agents found</Text>
                <Text style={styles.emptyText}>
                  Agent roster entries will show up here once your team is linked.
                </Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal animationType="slide" transparent visible={displayReportModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {selectedAgentName}'s Annual Performance
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>YTD Activity Progress</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD P:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.p_yearly /
                        (agentPAS?.total_days * agentEntries?.daily_goals?.p_daily)) *
                        100
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD A:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.a_yearly /
                        (agentPAS?.total_days * agentEntries?.daily_goals?.a_daily)) *
                        100
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD PR:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.pr_yearly /
                        (agentPAS?.total_days * agentEntries?.daily_goals?.pr_daily)) *
                        100
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD S:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.s_yearly /
                        (agentPAS?.total_days * agentEntries?.daily_goals?.s_daily)) *
                        100
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sales Effectiveness Ratios</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Appointments Ratio:</Text>
                  <Text style={styles.value}>
                    {formatPercentage((agentPAS?.a_yearly / agentPAS?.p_yearly) * 100)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Presentations Ratio:</Text>
                  <Text style={styles.value}>
                    {formatPercentage((agentPAS?.pr_yearly / agentPAS?.a_yearly) * 100)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Sales Ratio:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(calculateSalesRatioAchieved(agentPAS))}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Annual Progress</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD Sales:</Text>
                  <Text style={styles.value}>
                    $ {agentPAS?.totalPremiumYearly?.toLocaleString() || 0}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Progress:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.totalPremiumYearly /
                        agentEntries?.SalesTargets?.salesTargets) *
                        100
                    )}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setDisplayReportModal(false);
                setAgentEntries({});
                setAgentPAS({});
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={displayCoachingModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Log Coaching Session</Text>
            <Text style={styles.modalSubtitle}>{selectedAgentName}</Text>
            <TextInput
              value={coachingNotes}
              onChangeText={setCoachingNotes}
              placeholder="Session notes"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              style={styles.textArea}
            />
            <TextInput
              value={focusAreas}
              onChangeText={setFocusAreas}
              placeholder="Focus areas (comma separated)"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={outcomes}
              onChangeText={setOutcomes}
              placeholder="Outcomes (comma separated)"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={submitCoachingSession}
                loading={submittingCoaching}
                disabled={submittingCoaching}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => setDisplayCoachingModal(false)}
                disabled={submittingCoaching}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default MyAgents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
  liveMapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  liveMapButtonText: {
    color: "white",
    fontWeight: "700",
    marginLeft: 6,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  agentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  leftSideView: {
    flex: 1,
    paddingRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  message: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
  },
  inlineButton: {
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 70,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: theme.colors.accent,
  },
  inlineButtonLoading: {
    opacity: 0.8,
  },
  inlineButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    textAlign: "center",
    color: theme.colors.textMuted,
    marginBottom: 12,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: theme.colors.background,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    textAlignVertical: "top",
    color: theme.colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: theme.colors.textPrimary,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
