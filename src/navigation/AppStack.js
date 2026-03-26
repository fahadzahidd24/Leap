import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
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

const Stack = createStackNavigator();
const NativeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();

// Drawer-only colors (not affecting other screens)
const DRAWER_COLORS = {
  accent: "#f7a11f",
  accentLight: "#ffc107",
  gradientStart: "#3871c1",
  gradientMiddle: "#2d5a9e",
  gradientEnd: "#1e3a5f",
  success: "#10b981",
  danger: "#ef4444",
};

// Icon mapping for drawer items
const getIconForRoute = (routeName) => {
  const icons = {
    Home: { component: Feather, name: "home" },
    tabs: { component: MaterialCommunityIcons, name: "view-dashboard-outline" },
    Sales: { component: Ionicons, name: "stats-chart-outline" },
    "My Agents": { component: Feather, name: "users" },
    Inbox: { component: Ionicons, name: "mail-outline" },
    Profession: { component: Feather, name: "briefcase" },
    ChatCoach: { component: Ionicons, name: "chatbubbles-outline" },
    Profile: { component: Feather, name: "user" },
  };
  return icons[routeName] || { component: Feather, name: "circle" };
};

function CustomDrawerContent({ state, navigation, handleLogout, routes }) {
  const user = useSelector((state) => state.User);
  const currentRouteName = state?.routes[state?.index]?.name;

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
      colors={[DRAWER_COLORS.gradientStart, DRAWER_COLORS.gradientMiddle, DRAWER_COLORS.gradientEnd]}
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
              source={require("../../assets/logo.png")}
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
            <Feather name="log-out" size={20} color={DRAWER_COLORS.danger} />
          </View>
          <Text style={drawerStyles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const drawerStyles = StyleSheet.create({
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
    borderColor: DRAWER_COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DRAWER_COLORS.accent,
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
    backgroundColor: DRAWER_COLORS.success,
    borderWidth: 2,
    borderColor: DRAWER_COLORS.gradientMiddle,
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
    backgroundColor: DRAWER_COLORS.accent,
    shadowColor: DRAWER_COLORS.accent,
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
    color: DRAWER_COLORS.danger,
    fontWeight: "600",
  },
});

const TabNav = () => {
  return (
    <Tabs.Navigator
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    >
      <Tabs.Screen
        name="Daily Activity"
        component={DailyActivity}
        options={{
          tabBarLabel: "Daily Activity",
          tabBarIcon: () => <Feather name="activity" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="Activity Reports"
        component={ActivityReports}
        options={{
          tabBarIcon: () => (
            <Entypo name="text-document" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="Effectiveness Report"
        component={EffectivenessReport}
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
        component={AnnualProgress}
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
  const entries = useSelector((state) => state.Entries);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("profession");
    dispatch(logoutUser());
    dispatch(resetEntries());
    dispatch(resetChat());
  };

  const agentRoutes = [
    { name: "Home", label: "Home" },
    { name: "tabs", label: "Overview" },
    { name: "Sales", label: "Sales Targets" },
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
      initialRouteName={
        entries?.SalesTargets?.averageCaseSize ? "tabs" : "Sales"
      }
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
        name="Home"
        component={Home}
        options={{
          drawerLabel: "Home",
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
        component={Sales}
        options={{
          drawerLabel: "Sales Targets",
          title: "",
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("profession");
    dispatch(logoutUser());
    dispatch(resetEntries());
    dispatch(resetChat());
  };

  const managerRoutes = [
    { name: "My Agents", label: "My Agents" },
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
      initialRouteName="My Agents"
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
        name="My Agents"
        component={MyAgents}
        options={{
          drawerLabel: "My Agents",
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("profession");
    dispatch(logoutUser());
    dispatch(resetEntries());
    dispatch(resetChat());
  };

  const coachRoutes = [
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
        name="Home"
        component={Home}
        options={{
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="Profession"
        component={Profession}
        options={{
          drawerLabel: "Profession",
        }}
      />
      <Drawer.Screen
        name="ChatCoach"
        component={CoachStack}
        options={{
          drawerLabel: "Chat",
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

const CoachStack = () => {
  return (
    <NativeStack.Navigator
      initialRouteName="Prompts"
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <NativeStack.Screen name="Prompts" component={ChatCoach} />
      <NativeStack.Screen name="ChatGpt" component={ChatGpt} />
    </NativeStack.Navigator>
  );
};

export default AppStack = () => {
  const role = useSelector((state) => state.User?.role);
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {role === "agent" && (
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home"
            component={Home}
          />
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
            component={AnnualProgress}
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
                backgroundColor: theme.colors.background,
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
    </Stack.Navigator>
  );
};
