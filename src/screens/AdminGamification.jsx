import React, { useMemo, useState } from "react";
import {
  Alert,
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
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";
import {
  setAdminAnalytics,
  setAdminAuditRows,
  setAdminCampaigns,
  setAdminConfig,
} from "../redux/features/gamificationSlice";
import { gamificationApi } from "../api/gamification";

const AdminGamification = () => {
  const token = useSelector((state) => state.User?.token);
  const { config, analytics, campaigns, auditRows } = useSelector(
    (state) => state.Gamification.admin
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [configText, setConfigText] = useState("");
  const [auditUserId, setAuditUserId] = useState("");
  const [campaignModalVisible, setCampaignModalVisible] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    bonusBadge: "",
    active: true,
  });

  const analyticsRows = useMemo(() => {
    if (!analytics) {
      return [];
    }

    return Object.entries(analytics);
  }, [analytics]);

  useFocusEffect(
    React.useCallback(() => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      Promise.all([
        gamificationApi.getAdminConfig(token),
        gamificationApi.getAdminAnalytics(token),
        gamificationApi.getAdminCampaigns(token),
      ])
        .then(([configData, analyticsData, campaignsData]) => {
          dispatch(setAdminConfig(configData));
          dispatch(setAdminAnalytics(analyticsData));
          dispatch(setAdminCampaigns(campaignsData));
          setConfigText(JSON.stringify(configData || {}, null, 2));
        })
        .catch((error) => console.error("Error loading admin gamification:", error))
        .finally(() => setLoading(false));
    }, [dispatch, token])
  );

  const saveConfig = async () => {
    try {
      const parsed = JSON.parse(configText || "{}");
      const updated = await gamificationApi.updateAdminConfig(token, parsed);
      dispatch(setAdminConfig(updated));
      setConfigText(JSON.stringify(updated || parsed, null, 2));
      Alert.alert("Saved", "Gamification config updated.");
    } catch (error) {
      console.error("Error updating config:", error);
      Alert.alert("Invalid JSON", "Please review the configuration format.");
    }
  };

  const fetchAudit = async () => {
    if (!auditUserId.trim()) {
      return;
    }

    try {
      const rows = await gamificationApi.getAdminAudit(token, auditUserId.trim());
      dispatch(setAdminAuditRows({ rows, userId: auditUserId.trim() }));
    } catch (error) {
      console.error("Error loading audit rows:", error);
      Alert.alert("Error", "Unable to load audit rows for this user.");
    }
  };

  const createCampaign = async () => {
    if (
      !campaignForm.name.trim() ||
      !campaignForm.description.trim() ||
      !campaignForm.startDate.trim() ||
      !campaignForm.endDate.trim()
    ) {
      Alert.alert("Missing details", "Please complete all campaign fields.");
      return;
    }

    try {
      const payload = {
        name: campaignForm.name.trim(),
        description: campaignForm.description.trim(),
        startDate: campaignForm.startDate.trim(),
        endDate: campaignForm.endDate.trim(),
        config: campaignForm.bonusBadge
          ? { bonusBadge: campaignForm.bonusBadge.trim() }
          : {},
        active: campaignForm.active,
      };
      const campaign = await gamificationApi.createAdminCampaign(token, payload);
      dispatch(setAdminCampaigns([campaign, ...(campaigns || [])]));
      setCampaignModalVisible(false);
      setCampaignForm({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        bonusBadge: "",
        active: true,
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      Alert.alert("Error", "Unable to create campaign right now.");
    }
  };

  const recomputeState = async () => {
    try {
      await gamificationApi.recomputeAdminState(token);
      Alert.alert("Recompute started", "Gamification state recompute has been triggered.");
    } catch (error) {
      console.error("Error recomputing state:", error);
      Alert.alert("Error", "Unable to trigger recompute.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gamification Admin</Text>

        <GamificationCard
          title="Analytics Snapshot"
          subtitle="Live overview from the backend"
          rightContent={
            <TouchableOpacity onPress={recomputeState}>
              <Ionicons name="refresh" size={22} color={theme.colors.background} />
            </TouchableOpacity>
          }
        >
          {analyticsRows.length ? (
            analyticsRows.map(([key, value]) => (
              <View key={key} style={styles.analyticsRow}>
                <Text style={styles.analyticsKey}>{key}</Text>
                <Text style={styles.analyticsValue}>
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </Text>
              </View>
            ))
          ) : (
            <GamificationEmptyState
              title="No analytics available"
              message="Admin analytics will appear here once tracking data is available."
            />
          )}
        </GamificationCard>

        <GamificationCard title="Config" subtitle="Adjust backend gamification settings">
          <TextInput
            multiline
            value={configText}
            onChangeText={setConfigText}
            style={styles.codeInput}
            placeholder="{}"
            placeholderTextColor={theme.colors.textMuted}
          />
          <Button mode="contained" onPress={saveConfig} buttonColor={theme.colors.background}>
            Save Config
          </Button>
        </GamificationCard>

        <GamificationCard
          title="Campaigns"
          subtitle="Manage live gamification pushes"
          rightContent={
            <TouchableOpacity onPress={() => setCampaignModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.background} />
            </TouchableOpacity>
          }
        >
          {campaigns?.length ? (
            campaigns.map((campaign, index) => (
              <View key={`${campaign.name}-${index}`} style={styles.campaignCard}>
                <Text style={styles.campaignTitle}>{campaign.name}</Text>
                <Text style={styles.campaignMeta}>
                  {campaign.description}
                </Text>
                <Text style={styles.campaignMeta}>
                  {campaign.startDate} - {campaign.endDate}
                </Text>
              </View>
            ))
          ) : (
            <GamificationEmptyState
              title="No campaigns yet"
              message="Create a campaign to run bonus badge or momentum pushes."
            />
          )}
        </GamificationCard>

        <GamificationCard title="User Audits" subtitle="Lookup award and recompute history">
          <TextInput
            value={auditUserId}
            onChangeText={setAuditUserId}
            placeholder="Enter user ID"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.singleInput}
          />
          <Button mode="contained-tonal" onPress={fetchAudit}>
            Load Audit
          </Button>

          {auditRows?.length ? (
            <View style={styles.auditList}>
              {auditRows.map((row, index) => (
                <View key={`${row.type || row.action}-${index}`} style={styles.auditRow}>
                  <Text style={styles.auditTitle}>
                    {row.type || row.action || "Audit row"}
                  </Text>
                  <Text style={styles.auditMeta}>
                    {row.message || row.description || JSON.stringify(row)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <GamificationEmptyState
              title="No audit rows loaded"
              message="Search for a user ID to inspect gamification audit history."
            />
          )}
        </GamificationCard>
      </ScrollView>

      <Modal visible={campaignModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create Campaign</Text>
            <TextInput
              value={campaignForm.name}
              onChangeText={(text) => setCampaignForm((prev) => ({ ...prev, name: text }))}
              placeholder="Campaign name"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.singleInput}
            />
            <TextInput
              value={campaignForm.description}
              onChangeText={(text) =>
                setCampaignForm((prev) => ({ ...prev, description: text }))
              }
              placeholder="Description"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.singleInput}
            />
            <TextInput
              value={campaignForm.startDate}
              onChangeText={(text) =>
                setCampaignForm((prev) => ({ ...prev, startDate: text }))
              }
              placeholder="Start date DD/MM/YYYY"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.singleInput}
            />
            <TextInput
              value={campaignForm.endDate}
              onChangeText={(text) =>
                setCampaignForm((prev) => ({ ...prev, endDate: text }))
              }
              placeholder="End date DD/MM/YYYY"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.singleInput}
            />
            <TextInput
              value={campaignForm.bonusBadge}
              onChangeText={(text) =>
                setCampaignForm((prev) => ({ ...prev, bonusBadge: text }))
              }
              placeholder="Bonus badge key"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.singleInput}
            />

            <View style={styles.modalActions}>
              <Button mode="contained" onPress={createCampaign}>
                Create
              </Button>
              <Button mode="outlined" onPress={() => setCampaignModalVisible(false)}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 18,
  },
  analyticsRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.12)",
  },
  analyticsKey: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  analyticsValue: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  codeInput: {
    minHeight: 180,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    padding: 12,
    fontSize: 13,
    color: theme.colors.textPrimary,
    backgroundColor: "rgba(56, 113, 193, 0.04)",
    marginBottom: 12,
    textAlignVertical: "top",
  },
  campaignCard: {
    backgroundColor: "rgba(56, 113, 193, 0.06)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  campaignTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  campaignMeta: {
    marginTop: 5,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  singleInput: {
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: theme.colors.textPrimary,
    backgroundColor: "rgba(56, 113, 193, 0.04)",
  },
  auditList: {
    marginTop: 14,
  },
  auditRow: {
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    padding: 12,
    marginBottom: 10,
  },
  auditTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  auditMeta: {
    marginTop: 5,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

export default AdminGamification;
