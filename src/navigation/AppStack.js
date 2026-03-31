import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React, { useMemo } from "react";
import Home from "../screens/home";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/features/userSlice";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Sales from "../screens/sales";
import { theme } from "../constants/theme";
import { TouchableOpacity, View, Text, StyleSheet, Image, Platform } from "react-native";
import DailyActivity from "../screens/Daily Activity";
import ActivityReports from "../screens/Activity Reports";
import EffectivenessReport from "../screens/Effectiveness Report";
import AnnualProgress from "../screens/Annual Progress";
import Octicons from "@expo/vector-icons/Octicons";
import DailySchedule from "../screens/Daily Schedule";
import Ionicons from "@expo/vector-icons/Ionicons";
import MyAgents from "../screens/My Agents";
import { resetEntries } from "../redux/features/entriesSlice";
import { resetChat } from "../redux/features/chatSlice";
import { resetGamification } from "../redux/features/gamificationSlice";
import ChatCoach from "../screens/AskMyCoach/ChatCoach";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatGpt from "../screens/AskMyCoach/ChatGpt";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Disclaimer from "../screens/AskMyCoach/Disclaimer";
import Profession from "../screens/AskMyCoach/Profession";
import { LinearGradient } from "expo-linear-gradient";
import VideoPlayer from "../screens/VideoPlayer";
import Masterclass from "../screens/Masterclass";
import Profile from "../screens/Profile";
import Inbox from "../screens/Inbox";
import Chat from "../screens/Chat";
import GamificationMissions from "../screens/GamificationMissions";
import GamificationLeaderboard from "../screens/GamificationLeaderboard";
import GamificationRecognition from "../screens/GamificationRecognition";
import AdminGamification from "../screens/AdminGamification";
import GamificationDashboard from "../screens/GamificationDashboard";
import ManagerDashboard from "../screens/ManagerDashboard";
import ManagerLiveMap from "../screens/ManagerLiveMap";
import ModulePicker from "../screens/ModulePicker";
import { getModuleConfig, MODULE_KEYS } from "../constants/moduleConfig";
import { clearSelectedModule } from "../redux/features/moduleSlice";
import QuestSales from "../modules/quest/screens/QuestSales";
import QuestDailyActivity from "../modules/quest/screens/QuestDailyActivity";
import QuestAnnualProgress from "../modules/quest/screens/QuestAnnualProgress";
import QuestEffectivenessReport from "../modules/quest/screens/QuestEffectivenessReport";
import QuestActivityReports from "../modules/quest/screens/QuestActivityReports";
import QuestHome from "../modules/quest/screens/QuestHome";
import QuestProfession from "../modules/quest/screens/QuestProfession";
import QuestMyAgents from "../modules/quest/screens/QuestMyAgents";
import QuestChatCoach from "../modules/quest/screens/AskMyCoach/QuestChatCoach";
import QuestChatGpt from "../modules/quest/screens/AskMyCoach/QuestChatGpt";

const Stack = createStackNavigator();
const NativeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();

// Icon mapping for drawer items
const getIconForRoute = (routeName) => {
  const icons = {
    "GITSA Home": { component: MaterialCommunityIcons, name: "view-grid-outline" },
    Home: { component: Feather, name: "home" },
    tabs: { component: MaterialCommunityIcons, name: "view-dashboard-outline" },
    Sales: { component: Ionicons, name: "stats-chart-outline" },
    "My Agents": { component: Feather, name: "users" },
    Dashboard: {
      component: MaterialCommunityIcons,
      name: "view-dashboard-outline",
    },
    Inbox: { component: Ionicons, name: "mail-outline" },
    Missions: { component: MaterialCommunityIcons, name: "flag-outline" },
    Leaderboard: { component: MaterialCommunityIcons, name: "podium-gold" },
    Recognition: { component: Ionicons, name: "sparkles-outline" },
    "Admin Console": { component: MaterialCommunityIcons, name: "shield-crown-outline" },
    "Live Locations": { component: Ionicons, name: "location-outline" },
    Profession: { component: Feather, name: "briefcase" },
    ChatCoach: { component: Ionicons, name: "chatbubbles-outline" },
    Profile: { component: Feather, name: "user" },
  };
  return icons[routeName] || { component: Feather, name: "circle" };
};

function CustomDrawerContent({ state, navigation, handleLogout, routes }) {
  const user = useSelector((state) => state.User);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const currentRouteName = state?.routes[state?.index]?.name;
  const moduleConfig = getModuleConfig(selectedModule);
  const drawerColors = moduleConfig.drawerColors;
  const drawerStyles = useMemo(
    () => createDrawerStyles(drawerColors),
    [drawerColors]
  );

  const DrawerItem = ({ label, routeName, isActive }) => {
    const iconInfo = getIconForRoute(routeName);
    const IconComponent = iconInfo.component;

    return (
      <TouchableOpacity
        style={[
          drawerStyles.navItem,
          isActive && drawerStyles.navItemActive,
        ]}
        onPress={() => navigation.navigate(routeName)}
        activeOpacity={0.7}
      >
        <View style={[
          drawerStyles.iconContainer,
          isActive && drawerStyles.iconContainerActive,
        ]}>
          <IconComponent
            name={iconInfo.name}
            size={20}
            color={isActive ? theme.colors.white : "rgba(255, 255, 255, 0.7)"}
          />
        </View>
        <Text style={[
          drawerStyles.navItemText,
          isActive && drawerStyles.navItemTextActive,
        ]}>
          {label}
        </Text>
        {isActive && <View style={drawerStyles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[
        drawerColors.gradientStart,
        drawerColors.gradientMiddle,
        drawerColors.gradientEnd,
      ]}
      style={drawerStyles.container}
    >
      {/* Decorative Elements */}
      {/* <View style={drawerStyles.decorCircle1} /> */}
      {/* <View style={drawerStyles.decorCircle2} /> */}

      <DrawerContentScrollView
        contentContainerStyle={drawerStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={drawerStyles.logoSection}>
          <View style={drawerStyles.logoContainer}>
            <Image
              source={moduleConfig.assets.logo}
              style={drawerStyles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* User Profile */}
        <View style={drawerStyles.profileCard}>
          <View style={drawerStyles.avatarWrapper}>
            <View style={drawerStyles.avatarRing}>
              <View style={drawerStyles.avatar}>
                <Text style={drawerStyles.avatarText}>
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
            </View>
            <View style={drawerStyles.onlineDot} />
          </View>
          <View style={drawerStyles.userInfo}>
            <Text style={drawerStyles.userName} numberOfLines={1}>
              {user?.fullName || "User"}
            </Text>
            <Text style={drawerStyles.userRole}>
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Member"}
            </Text>
          </View>
        </View>

        {/* Navigation */}
        <View style={drawerStyles.navSection}>
          <Text style={drawerStyles.sectionLabel}>MENU</Text>
          {routes.map((route, index) => (
            <DrawerItem
              key={index}
              label={route.label}
              routeName={route.name}
              isActive={currentRouteName === route.name}
            />
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Logout */}
      <View style={drawerStyles.footer}>
        <View style={drawerStyles.divider} />
        <TouchableOpacity
          style={drawerStyles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={drawerStyles.logoutIcon}>
            <Feather name="log-out" size={20} color={drawerColors.danger} />
          </View>
          <Text style={drawerStyles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const createDrawerStyles = (drawerColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 40 : 40,
    paddingHorizontal: 20,
  },
  decorCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(247, 161, 31, 0.1)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: 100,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(247, 161, 31, 0.05)",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  logo: {
    width: 120,
    height: 60,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: drawerColors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: drawerColors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: drawerColors.success,
    borderWidth: 2,
    borderColor: drawerColors.gradientMiddle,
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  navSection: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 2,
    fontWeight: "600",
    marginBottom: 16,
    marginLeft: 4,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  navItemActive: {
    backgroundColor: drawerColors.accent,
    shadowColor: drawerColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  navItemText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    flex: 1,
  },
  navItemTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 16,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoutText: {
    fontSize: 15,
    color: drawerColors.danger,
    fontWeight: "600",
  },
});

const TabNav = () => {
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const DailyActivityScreen =
    selectedModule === MODULE_KEYS.QUEST ? QuestDailyActivity : DailyActivity;
  const ActivityReportsScreen =
    selectedModule === MODULE_KEYS.QUEST ? QuestActivityReports : ActivityReports;
  const EffectivenessReportScreen =
    selectedModule === MODULE_KEYS.QUEST
      ? QuestEffectivenessReport
      : EffectivenessReport;
  const AnnualProgressScreen =
    selectedModule === MODULE_KEYS.QUEST ? QuestAnnualProgress : AnnualProgress;

  return (
    <Tabs.Navigator
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    >
      <Tabs.Screen
        name="Daily Activity"
        component={DailyActivityScreen}
        options={{
          tabBarLabel: "Daily Activity",
          tabBarIcon: () => <Feather name="activity" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="Activity Reports"
        component={ActivityReportsScreen}
        options={{
          tabBarIcon: () => (
            <Entypo name="text-document" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="Effectiveness Report"
        component={EffectivenessReportScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Annual Progress"
        component={AnnualProgressScreen}
        options={{
          tabBarIcon: () => (
            <FontAwesome6 name="bars-progress" size={24} color="black" />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

const DrawerNav = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const isQuest = selectedModule === MODULE_KEYS.QUEST;
  const moduleConfig = getModuleConfig(selectedModule);
  const HomeScreen = selectedModule === MODULE_KEYS.QUEST ? QuestHome : Home;
  const SalesScreen = selectedModule === MODULE_KEYS.QUEST ? QuestSales : Sales;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("profession");
    dispatch(logoutUser());
    dispatch(clearSelectedModule());
    dispatch(resetEntries());
    dispatch(resetChat());
    dispatch(resetGamification());
  };

  const agentRoutes = [
    { name: "GITSA Home", label: "GITSA Home" },
    { name: "Home", label: "Home" },
    ...(!isQuest ? [{ name: "Dashboard", label: "Dashboard" }] : []),
    { name: "tabs", label: "Overview" },
    { name: "Sales", label: "Sales Targets" },
    ...(!isQuest
      ? [
          { name: "Missions", label: "Missions" },
          { name: "Leaderboard", label: "Leaderboard" },
          { name: "Recognition", label: "Recognition" },
        ]
      : []),
    { name: "Inbox", label: "Inbox" },
    { name: "Profile", label: "Profile" },
  ];

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          handleLogout={handleLogout}
          routes={agentRoutes}
        />
      )}
      initialRouteName="Home"
      screenOptions={{
        title: "",
        headerStyle: {
          backgroundColor: moduleConfig.colors.background,
        },
        headerShadowVisible: false,
        drawerStyle: {
          width: 300,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Octicons
              name="three-bars"
              size={24}
              color="white"
              style={{ marginLeft: 30 }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="GITSA Home"
        component={ModulePicker}
        options={{
          drawerLabel: "GITSA Home",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={GamificationDashboard}
        options={{
          drawerLabel: "Dashboard",
          title: "",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="tabs"
        component={TabNav}
        options={{
          drawerLabel: "Overview",
        }}
      />
      <Drawer.Screen
        name="Sales"
        component={SalesScreen}
        options={{
          drawerLabel: "Sales Targets",
          title: "",
        }}
      />
      <Drawer.Screen
        name="Missions"
        component={GamificationMissions}
        options={{
          drawerLabel: "Missions",
          title: "",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Leaderboard"
        component={GamificationLeaderboard}
        options={{
          drawerLabel: "Leaderboard",
          title: "",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Recognition"
        component={GamificationRecognition}
        options={{
          drawerLabel: "Recognition",
          title: "",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Inbox"
        component={Inbox}
        options={{
          drawerLabel: "Inbox",
          title: "",
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: "Profile",
          title: "",
        }}
      />
    </Drawer.Navigator>
  );
};

const ManagerDrawerNav = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const isQuest = selectedModule === MODULE_KEYS.QUEST;
  const moduleConfig = getModuleConfig(selectedModule);
  const MyAgentsScreen = isQuest ? QuestMyAgents : MyAgents;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("profession");
    dispatch(logoutUser());
    dispatch(clearSelectedModule());
    dispatch(resetEntries());
    dispatch(resetChat());
    dispatch(resetGamification());
  };

  const managerRoutes = [
    { name: "GITSA Home", label: "GITSA Home" },
    { name: "Dashboard", label: "Dashboard" },
    { name: "My Agents", label: "My Agents" },
    { name: "Live Locations", label: "Live Locations" },
    { name: "Inbox", label: "Inbox" },
    { name: "Profile", label: "Profile" },
  ];

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          handleLogout={handleLogout}
          routes={managerRoutes}
        />
      )}
      initialRouteName="Dashboard"
      screenOptions={{
        title: "",
        headerStyle: {
          backgroundColor: moduleConfig.colors.background,
        },
        headerShadowVisible: false,
        drawerStyle: {
          width: 300,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Octicons
              name="three-bars"
              size={24}
              color="white"
              style={{ marginLeft: 30 }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="GITSA Home"
        component={ModulePicker}
        options={{
          drawerLabel: "GITSA Home",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={ManagerDashboard}
        options={{
          drawerLabel: "Dashboard",
        }}
      />
      <Drawer.Screen
        name="My Agents"
        component={MyAgentsScreen}
        options={{
          drawerLabel: "My Agents",
        }}
      />
      <Drawer.Screen
        name="Live Locations"
        component={ManagerLiveMap}
        options={{
          drawerLabel: "Live Locations",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Inbox"
        component={Inbox}
        options={{
          drawerLabel: "Inbox",
          title: "",
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: "Profile",
          title: "",
        }}
      />
    </Drawer.Navigator>
  );
};

const CoachDrawer = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const moduleConfig = getModuleConfig(selectedModule);
  const HomeScreen = selectedModule === MODULE_KEYS.QUEST ? QuestHome : Home;
  const ProfessionScreen =
    selectedModule === MODULE_KEYS.QUEST ? QuestProfession : Profession;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("profession");
    dispatch(logoutUser());
    dispatch(clearSelectedModule());
    dispatch(resetEntries());
    dispatch(resetChat());
    dispatch(resetGamification());
  };

  const coachRoutes = [
    { name: "GITSA Home", label: "GITSA Home" },
    { name: "Home", label: "Home" },
    { name: "Profession", label: "Profession" },
    { name: "ChatCoach", label: "Chat" },
  ];
  const prof = AsyncStorage.getItem("profession");
  console.log(prof);
  const initialRouteNameV = prof ? "ChatCoach" : "Profession";
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent 
          {...props} 
          handleLogout={handleLogout}
          routes={coachRoutes}
        />
      )}
      initialRouteName={initialRouteNameV}
      screenOptions={{
        title: "",
        headerStyle: {
          backgroundColor: moduleConfig.colors.background,
        },
        headerShadowVisible: false,
        drawerStyle: {
          width: 300,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Octicons
              name="three-bars"
              size={24}
              color="white"
              style={{ marginLeft: 30 }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="GITSA Home"
        component={ModulePicker}
        options={{
          drawerLabel: "GITSA Home",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="Profession"
        component={ProfessionScreen}
        options={{
          drawerLabel: "Profession",
        }}
      />
      <Drawer.Screen
        name="ChatCoach"
        component={CoachStackNavigator}
        options={{
          drawerLabel: "Chat",
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

const AdminDrawerNav = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("profession");
    dispatch(logoutUser());
    dispatch(clearSelectedModule());
    dispatch(resetEntries());
    dispatch(resetChat());
    dispatch(resetGamification());
  };

  const adminRoutes = [
    { name: "GITSA Home", label: "GITSA Home" },
    { name: "Admin Console", label: "Admin Console" },
    { name: "Profile", label: "Profile" },
  ];

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          handleLogout={handleLogout}
          routes={adminRoutes}
        />
      )}
      initialRouteName="Admin Console"
      screenOptions={{
        title: "",
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        drawerStyle: {
          width: 300,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Octicons
              name="three-bars"
              size={24}
              color="white"
              style={{ marginLeft: 30 }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="GITSA Home"
        component={ModulePicker}
        options={{
          drawerLabel: "GITSA Home",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Admin Console"
        component={AdminGamification}
        options={{
          drawerLabel: "Admin Console",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: "Profile",
          title: "",
        }}
      />
    </Drawer.Navigator>
  );
};

const CoachStackNavigator = () => {
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const PromptsScreen =
    selectedModule === MODULE_KEYS.QUEST ? QuestChatCoach : ChatCoach;
  const ChatGptScreen =
    selectedModule === MODULE_KEYS.QUEST ? QuestChatGpt : ChatGpt;

  return (
    <NativeStack.Navigator
      initialRouteName="Prompts"
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <NativeStack.Screen name="Prompts" component={PromptsScreen} />
      <NativeStack.Screen name="ChatGpt" component={ChatGptScreen} />
    </NativeStack.Navigator>
  );
};

export default AppStack = () => {
  const role = useSelector((state) => state.User?.role);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const moduleConfig = getModuleConfig(selectedModule);
  const navigation = useNavigation();
  const AnnualProgressScreen =
    selectedModule === MODULE_KEYS.QUEST ? QuestAnnualProgress : AnnualProgress;

  return (
    <Stack.Navigator
      initialRouteName="GITSA Home"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="GITSA Home"
        component={ModulePicker}
      />
      {role === "agent" && (
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Agent"
            component={DrawerNav}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Coach"
            component={CoachDrawer}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="DailySchedule"
            component={DailySchedule}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Annual Progress"
            component={AnnualProgressScreen}
          />
        </>
      )}
      {role === "manager" && (
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Manager"
            component={ManagerDrawerNav}
          />
          <Stack.Screen
            options={{
              headerTitle: "",
              headerStyle: {
                backgroundColor: moduleConfig.colors.background,
              },
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="white"
                    style={{ marginLeft: 30 }}
                  />
                </TouchableOpacity>
              ),
            }}
            name="DailySchedule"
            component={DailySchedule}
          />
        </>
      )}
      {role === "admin" && (
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Admin"
            component={AdminDrawerNav}
          />
        </>
      )}

      <Stack.Screen
        options={{ headerShown: false }}
        name="Masterclass"
        component={Masterclass}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="VideoPlayer"
        component={VideoPlayer}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Chat"
        component={Chat}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Missions"
        component={GamificationMissions}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Leaderboard"
        component={GamificationLeaderboard}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Recognition"
        component={GamificationRecognition}
      />
    </Stack.Navigator>
  );
};
