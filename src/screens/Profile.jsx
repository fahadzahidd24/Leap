import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { theme } from "../constants/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { privateSharedApi, publicURL } from "../api/axios";
import { logoutUser, updateUserProfile } from "../redux/features/userSlice";
import { resetEntries } from "../redux/features/entriesSlice";
import { resetChat } from "../redux/features/chatSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";
import {
  resetGamification,
  setAgentBadges,
  setAgentNotifications,
  setAgentTier,
} from "../redux/features/gamificationSlice";
import { gamificationApi } from "../api/gamification";
import { getTierMeta } from "../constants/gamificationVisuals";
import { getRoleForModule } from "../constants/moduleConfig";

const preferenceRows = [
  { key: "pushEnabled", label: "Push notifications" },
  { key: "morningReminder", label: "Morning reminders" },
  { key: "middayReminder", label: "Midday reminders" },
  { key: "achievementAlerts", label: "Achievement alerts" },
  { key: "streakProtection", label: "Streak protection" },
  { key: "weeklySummary", label: "Weekly summary" },
  { key: "leaderboardMovement", label: "Leaderboard movement" },
];

const defaultPreferences = {
  pushEnabled: false,
  morningReminder: false,
  middayReminder: false,
  achievementAlerts: true,
  streakProtection: true,
  weeklySummary: true,
  leaderboardMovement: true,
  maxPerDay: 3,
};

const Profile = ({ navigation }) => {
  const user = useSelector((state) => state.User);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const moduleRole = getRoleForModule(user, selectedModule);
  const { tier, notifications, preferences } = useSelector(
    (state) => state.Gamification.agent
  );
  const expoDevice = useSelector((state) => state.Gamification.expoDevice);
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(defaultPreferences);
  const currentTierMeta = getTierMeta(tier?.currentTier, selectedModule);
  const nextTierMeta = getTierMeta(tier?.nextTier, selectedModule);
  const formattedTierProgress = Number(tier?.progressPercent || 0).toFixed(1);

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.token) {
        return;
      }

      Promise.all([
        gamificationApi.getTier(user.token),
        gamificationApi.getBadges(user.token),
        gamificationApi.getNotifications(user.token),
      ])
        .then(([tierData, badgeData, notificationData]) => {
          dispatch(setAgentTier(tierData));
          dispatch(setAgentBadges(badgeData));
          dispatch(setAgentNotifications(notificationData));
          setLocalPreferences(notificationData?.preferences || defaultPreferences);
        })
        .catch((error) => console.error("Error loading profile gamification:", error));
    }, [dispatch, user?.token])
  );

  const profileImage = useMemo(() => {
    if (!user?.profilePic) {
      return null;
    }

    const picPath = user.profilePic.startsWith("/")
      ? user.profilePic.slice(1)
      : user.profilePic;
    return { uri: `${publicURL}/${picPath}` };
  }, [user?.profilePic]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadProfilePicture(result.assets[0]);
    }
  };

  const uploadProfilePicture = async (image) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("profilePic", {
      uri: image.uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    try {
      await privateSharedApi(user.token).put("/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const profileResponse = await privateSharedApi(user.token).get("/profile");
      if (profileResponse.data?.user) {
        dispatch(updateUserProfile(profileResponse.data.user));
        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile picture."
      );
    } finally {
      setUploading(false);
    }
  };

  const savePreferenceChange = async (key, value) => {
    const updatedPreferences = {
      ...(localPreferences || defaultPreferences),
      [key]: value,
    };

    setLocalPreferences(updatedPreferences);
    setSavingPreferences(true);

    try {
      const savedPreferences = await gamificationApi.updatePreferences(
        user.token,
        updatedPreferences
      );
      setLocalPreferences(savedPreferences);
      dispatch(setAgentNotifications({ notifications, preferences: savedPreferences }));
    } catch (error) {
      console.error("Error updating preferences:", error);
      Alert.alert("Error", "Unable to update notification preferences.");
      setLocalPreferences(localPreferences || defaultPreferences);
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDeleteAccount(),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteAccount = async () => {
    setDeleting(true);

    try {
      await privateSharedApi(user.token).delete("/profile/delete");
      await AsyncStorage.removeItem("profession");
      dispatch(logoutUser());
      dispatch(resetEntries());
      dispatch(resetChat());
      dispatch(resetGamification());

      Alert.alert(
        "Account Deleted",
        "Your account has been successfully deleted."
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete account."
      );
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={profileImage} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.editButton}
              onPress={pickImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="camera" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.fullName || "User"}</Text>
          <Text style={styles.userRole}>
            {moduleRole
              ? moduleRole.charAt(0).toUpperCase() + moduleRole.slice(1)
              : "Member"}
          </Text>
        </View>

        <GamificationCard
          title="Tier & Momentum"
          subtitle={
            tier?.nextTier ? `Next tier: ${tier.nextTier}` : "Gamification summary"
          }
          rightContent={
            <TouchableOpacity onPress={() => navigation.navigate("Recognition")}>
              <Text style={styles.linkText}>Open</Text>
            </TouchableOpacity>
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
                    <Text style={styles.tierLabel}>Current</Text>
                    <Text style={styles.tierValue}>{tier.currentTier}</Text>
                  </View>
                </View>
                <View style={styles.tierAlignRight}>
                  {nextTierMeta?.image ? (
                    <Image source={nextTierMeta.image} style={styles.nextTierImage} />
                  ) : null}
                  <Text style={styles.tierLabel}>Lifetime score</Text>
                  <Text style={styles.tierValue}>{tier.lifetimeScore ?? 0}</Text>
                </View>
              </View>
              <View style={styles.nextTierPill}>
                <Text style={styles.nextTierPillText}>
                  {tier.nextTier ? `Next unlock: ${tier.nextTier}` : "Top tier unlocked"}
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
                {formattedTierProgress}% progress toward{" "}
                {tier.nextTier || "the next tier"}
              </Text>
            </>
          ) : (
            <GamificationEmptyState
              title="No tier data yet"
              message="Keep logging activity to build momentum."
            />
          )}
        </GamificationCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="person-outline"
                size={22}
                color={theme.colors.background}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user?.fullName || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons
                name="business-outline"
                size={22}
                color={theme.colors.background}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Company</Text>
                <Text style={styles.infoValue}>
                  {user?.companyName || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons
                name="mail-outline"
                size={22}
                color={theme.colors.background}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        <>
          <GamificationCard
            title="Notification Preferences"
            subtitle={
              expoDevice?.permissionStatus === "granted"
                ? "Push registration active"
                : "Push permission not granted yet"
            }
          >
            <View style={styles.preferenceMetaRow}>
              <Text style={styles.preferenceMeta}>
                Device status: {expoDevice?.permissionStatus || "unknown"}
              </Text>
              {savingPreferences ? (
                <ActivityIndicator size="small" color={theme.colors.background} />
              ) : null}
            </View>

            {preferenceRows.map((preference) => (
              <View key={preference.key} style={styles.preferenceRow}>
                <Text style={styles.preferenceLabel}>{preference.label}</Text>
                <Switch
                  value={Boolean(localPreferences?.[preference.key])}
                  onValueChange={(value) => savePreferenceChange(preference.key, value)}
                  trackColor={{
                    false: "rgba(100, 116, 139, 0.3)",
                    true: "rgba(56, 113, 193, 0.4)",
                  }}
                  thumbColor={
                    localPreferences?.[preference.key]
                      ? theme.colors.background
                      : "#f4f4f5"
                  }
                />
              </View>
            ))}
          </GamificationCard>

          <GamificationCard
            title="Recent Notifications"
            subtitle="Latest reminders and updates"
          >
            {notifications?.length ? (
              notifications.slice(0, 5).map((item, index) => (
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
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationBody}>{item.body}</Text>
                  </View>
                </View>
              ))
            ) : (
              <GamificationEmptyState
                title="No notifications yet"
                message="Weekly summaries, streak alerts, and achievements will appear here."
              />
            )}
          </GamificationCard>
        </>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialIcons name="delete-forever" size={24} color="white" />
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.warningText}>
            This will permanently delete your account and all associated data.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: theme.colors.secondary,
    marginBottom: 24,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.secondary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.secondary,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.secondary,
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: "500",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.secondary,
    marginBottom: 12,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  linkText: {
    color: theme.colors.background,
    fontWeight: "700",
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
    width: 64,
    height: 64,
    resizeMode: "contain",
    marginRight: 12,
  },
  tierTextBlock: {
    flex: 1,
  },
  tierAlignRight: {
    alignItems: "flex-end",
  },
  nextTierImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginBottom: 6,
  },
  nextTierPill: {
    backgroundColor: "rgba(247, 161, 31, 0.12)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  nextTierPillText: {
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
  preferenceMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  preferenceMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.12)",
  },
  preferenceLabel: {
    flex: 1,
    marginRight: 12,
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.12)",
  },
  notificationText: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  notificationBody: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  warningText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});
