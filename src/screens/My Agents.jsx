import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { privateApi } from "../api/axios";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import { useFocusEffect } from "@react-navigation/native";
import { formatPercentage } from "../utils/formatPercentage";

const MyAgents = ({ navigation }) => {
  const { token, _id } = useSelector((state) => state.User);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayModal, setDisplayModal] = useState(false);
  const [agentPAS, setAgentPAS] = useState({});
  const [agentEntries, setAgentEntries] = useState({});
  const [selectedAgentName, setSelectedAgentName] = useState("");
  const [loadingReportId, setLoadingReportId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        privateApi(token)
          .get(`/agents/${_id}`)
          .then((res) => {
            console.log("Agents data:", res.data.userDetails);
            setAgents(res.data.userDetails);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [token])
  );

  const calculateSalesRatioAchieved = (agentPAS) => {
    const yearlyAchievedPR = agentPAS?.pr_yearly || 0;
    const yearlyAchievedS = agentPAS?.s_yearly || 0;
    return (yearlyAchievedS / yearlyAchievedPR) * 100;
  };

  const fetchAgentReport = (agentId, agentName) => {
    setLoadingReportId(agentId);
    setSelectedAgentName(agentName);
    
    // Fetch agent's entries and PAS data
    privateApi(token)
      .get(`/entries/${agentId}`)
      .then((res) => {
        console.log("Agent report data:", res.data);
        setAgentEntries(res.data?.entries);
        setAgentPAS(res.data?.pas);
        setDisplayModal(true);
      })
      .catch((err) => {
        console.error("Error fetching agent report:", err);
      })
      .finally(() => {
        setLoadingReportId(null);
      });
  };

  const AgentComponent = ({ id, fullName, utcCode }) => {
    const isLoading = loadingReportId === id;
    
    return (
      <View style={styles.agentContainer}>
        <View style={styles.leftSideView}>
          <View>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.message}>{utcCode}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.reportButton, isLoading && styles.reportButtonLoading]}
          onPress={() => {
            if (!isLoading) {
              fetchAgentReport(id, fullName);
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="stats-chart" size={16} color="white" />
              <Text style={styles.reportButtonText}>Report</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={{ backgroundColor: "#000" }} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: "5%",
          width: "90%",
          //   backgroundColor: "black",
        }}
      >
        <Text
          style={{
            fontSize: 26,
            // backgroundColor: "red",
            fontWeight: "300",
            textAlign: "justify",
            flexWrap: "wrap",
            color: theme.colors.secondary,
          }}
        >
          My Agents
        </Text>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "red",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <EvilIcons
            name="calendar"
            size={34}
            color="white"
            style={{ marginHorizontal: 3 }}
          />
          <MaterialCommunityIcons
            name="progress-check"
            size={28}
            style={{ marginHorizontal: 3 }}
            color="white"
          />
        
        </View> */}
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={agents}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <AgentComponent
              id={item.id || item._id}
              fullName={item.fullName}
              utcCode={item.utcCode}
            />
          )}
        />
      </View>

      {/* Agent Performance Report Modal */}
      <Modal animationType="slide" transparent={true} visible={displayModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {selectedAgentName}'s Annual Performance
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>YTD Progress</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD P:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.p_yearly /
                        (agentPAS?.total_days *
                          agentEntries?.daily_goals?.p_daily)) *
                        100
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD A:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.a_yearly /
                        (agentPAS?.total_days *
                          agentEntries?.daily_goals?.a_daily)) *
                        100
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD PR:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.pr_yearly /
                        (agentPAS?.total_days *
                          agentEntries?.daily_goals?.pr_daily)) *
                        100
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD S:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.s_yearly /
                        (agentPAS?.total_days *
                          agentEntries?.daily_goals?.s_daily)) *
                        100
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ratios</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Appointments Ratio:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.a_yearly / agentPAS?.p_yearly) * 100
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Presentations Ratio:</Text>
                  <Text style={styles.value}>
                    {formatPercentage(
                      (agentPAS?.pr_yearly / agentPAS?.a_yearly) * 100
                    )}
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
                <Text style={styles.sectionTitle}>Financials</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>YTD Premium:</Text>
                  <Text style={styles.value}>
                    RM {agentPAS?.totalPremiumYearly?.toLocaleString() || 0}
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
                setDisplayModal(false);
                setAgentEntries({});
                setAgentPAS({});
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    justifyContent: "flex-start",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  listContainer: {
    width: "90%",
    marginTop: 15,
    flex: 1,
  },
  agentContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 13,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
  },
  leftSideView: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  message: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 85,
  },
  reportButtonLoading: {
    opacity: 0.8,
  },
  reportButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 5,
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
});
