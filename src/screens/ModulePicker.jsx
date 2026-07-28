import React from "react";
import {
  Alert,
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  GITSA_BRAND,
  getEnabledModulesForUser,
  getInitialRouteForRole,
  getModuleLandingRouteForRole,
  getModuleConfig,
  MODULE_KEYS,
  userHasModuleAccess,
} from "../constants/moduleConfig";
import { clearSelectedModule, setSelectedModule } from "../redux/features/moduleSlice";
import { logoutUser } from "../redux/features/userSlice";
import { resetEntries } from "../redux/features/entriesSlice";
import { resetChat } from "../redux/features/chatSlice";
import { resetGamification } from "../redux/features/gamificationSlice";

const moduleOrder = [MODULE_KEYS.LEAP, MODULE_KEYS.QUEST];
const GITSA_ACCENT = "#e6634c";
const TEXT_PRIMARY = "#0f172a";
const TEXT_MUTED = "#64748b";

const ModuleCard = ({ moduleKey, enabled, onPress }) => {
  const module = getModuleConfig(moduleKey);
  // QUEST's stock logo is landscape; use the square version so both module
  // logos render as identical square tiles (matches the onboarding screen).
  const cardLogoSource =
    moduleKey === MODULE_KEYS.QUEST
      ? require("../../assets/quest-logo-square.png")
      : module.assets.logo;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: enabled
            ? "rgba(230, 99, 76, 0.42)"
            : "rgba(148, 163, 184, 0.18)",
        },
        !enabled && styles.cardLocked,
      ]}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLogoWrap}>
          <Image source={cardLogoSource} style={styles.cardLogo} resizeMode="cover" />
        </View>
        {enabled ? (
          <View style={[styles.stateBadge, styles.stateBadgeActive]}>
            <Text style={styles.stateBadgeText}>Active</Text>
          </View>
        ) : (
          <View style={[styles.stateBadge, styles.stateBadgeLocked]}>
            <Ionicons name="lock-closed" size={13} color="#f8fafc" />
            <Text style={[styles.stateBadgeText, styles.stateBadgeTextLocked]}>
              Locked
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.cardTitle}>{module.label}</Text>
      <Text style={styles.cardSubtitle}>{module.subtitle}</Text>

      <View style={styles.cardFooter}>
        <View style={[styles.colorDot, { backgroundColor: module.colors.background }]} />
        <Text style={styles.cardFooterText}>
          {enabled ? "Tap to enter module" : "You're not enrolled in this module"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ModulePicker = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const enabledModules = getEnabledModulesForUser(user);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearSelectedModule());
    dispatch(resetEntries());
    dispatch(resetChat());
    dispatch(resetGamification());
  };

  const openModule = (moduleKey) => {
    if (!userHasModuleAccess(user, moduleKey)) {
      const module = getModuleConfig(moduleKey);
      Alert.alert(
        "No Access",
        module.lockedMessage ||
          "This module is not assigned to your account. Please contact your admin."
      );
      return;
    }

    if (selectedModule !== moduleKey) {
      dispatch(resetEntries());
      dispatch(resetChat());
      dispatch(resetGamification());
    }

    dispatch(setSelectedModule(moduleKey));
    const stackDestination = getInitialRouteForRole(user?.role);
    const landingRoute = getModuleLandingRouteForRole(user?.role);
    const parentNavigation = navigation.getParent?.();

    if (parentNavigation) {
      navigation.navigate(landingRoute);
      return;
    }

    navigation.navigate(stackDestination, { screen: landingRoute });
  };

  return (
    <LinearGradient
      colors={["#cfe9f6", "#d9eef7", "#f1ddd7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#cfe9f6" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.logoCard}>
            <Image source={GITSA_BRAND.logo} style={styles.brandLogo} resizeMode="contain" />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={GITSA_ACCENT} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Welcome to GITSA</Text>
          <Text style={styles.subtitle}>
          Choose your module. Your access is based on the modules assigned to your account.
          </Text>

          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <MaterialCommunityIcons
                name="office-building-outline"
                size={20}
                color={GITSA_ACCENT}
              />
              <Text style={styles.profileText}>
                {user?.company?.name || user?.companyName || "-"}
              </Text>
            </View>
            <View style={styles.profileRow}>
              <Ionicons name="person-outline" size={20} color={GITSA_ACCENT} />
              <Text style={styles.profileText}>
                {user?.fullName || "User"}
                {user?.role ? ` • ${user.role}` : ""}
              </Text>
            </View>
            {user?.subscriptionStatus ? (
              <View style={styles.profileRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={GITSA_ACCENT}
                />
                <Text style={styles.profileText}>
                  Subscription: {String(user.subscriptionStatus).replace(/_/g, " ")}
                </Text>
              </View>
            ) : null}
            {selectedModule ? (
              <View style={styles.profileRow}>
                <Ionicons name="apps-outline" size={20} color={GITSA_ACCENT} />
                <Text style={styles.profileText}>Last selected: {selectedModule}</Text>
              </View>
            ) : null}
          </View>

          {!enabledModules.length ? (
            <View style={styles.noticeCard}>
              <Ionicons name="alert-circle-outline" size={18} color={GITSA_ACCENT} />
              <Text style={styles.noticeText}>
                No modules are currently assigned to your account. Please contact your admin.
              </Text>
            </View>
          ) : null}

          <View style={styles.moduleList}>
            {moduleOrder.map((moduleKey) => (
              <ModuleCard
                key={moduleKey}
                moduleKey={moduleKey}
                enabled={userHasModuleAccess(user, moduleKey)}
                onPress={() => openModule(moduleKey)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logoCard: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.56)",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 18,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
  },
  brandLogo: {
    width: 180,
    height: 88,
    alignSelf: "center",
  },
  logoutButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(230, 99, 76, 0.2)",
    marginBottom: 14,
  },
  logoutText: {
    marginLeft: 6,
    color: GITSA_ACCENT,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "rgba(255,255,255,0.58)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(115, 188, 224, 0.36)",
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileText: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  moduleList: {
    gap: 14,
  },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.66)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(230, 99, 76, 0.16)",
    marginBottom: 18,
  },
  noticeText: {
    flex: 1,
    marginLeft: 10,
    color: TEXT_PRIMARY,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 3,
  },
  cardLocked: {
    backgroundColor: "rgba(241, 245, 249, 0.68)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardLogoWrap: {
    backgroundColor: "rgba(255,255,255,0.62)",
    padding: 8,
    borderRadius: 16,
  },
  cardLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  stateBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stateBadgeActive: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  stateBadgeLocked: {
    backgroundColor: "#94a3b8",
  },
  stateBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  stateBadgeTextLocked: {
    color: "#f8fafc",
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_MUTED,
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  cardFooterText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
});

export default ModulePicker;
