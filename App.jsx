import "react-native-gesture-handler";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { View, Text, ActivityIndicator, Alert, Platform, AppState } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import AppStack from "./src/navigation/AppStack";
import AuthStack from "./src/navigation/AuthStack";
import { logoutUser, setUser } from "./src/redux/features/userSlice";
import { store } from "./src/redux/store";
import { LogBox } from 'react-native';
import { privateApi, privateSharedApi } from "./src/api/axios";
import {
  markEntriesHydrated,
  resetEntries,
  setEntries,
} from "./src/redux/features/entriesSlice";
import * as Linking from "expo-linking";
import { resetChat } from "./src/redux/features/chatSlice";
import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from "expo-tracking-transparency";
import * as Notifications from "expo-notifications";
import {
  resetGamification,
  setAgentDailyMissions,
  setAgentLeaderboard,
  setAgentNotifications,
  setAgentScorecard,
  setAgentTier,
  setExpoDeviceState,
} from "./src/redux/features/gamificationSlice";
import {
  ACTIVE_MODULE_STORAGE_KEY,
  clearSelectedModule,
  setSelectedModule,
} from "./src/redux/features/moduleSlice";
import { gamificationApi } from "./src/api/gamification";
import { registerGamificationDevice } from "./src/utils/registerGamificationDevice";
import { buildGamificationNotification } from "./src/utils/gamificationNotifications";
import { applyModuleTheme } from "./src/constants/theme";
import {
  getEnabledModulesForUser,
  userHasModuleAccess,
} from "./src/constants/moduleConfig";
import useSocket from "./src/hooks/useSocket";
LogBox.ignoreAllLogs();

const MOBILE_ALLOWED_ROLES = ["agent", "manager"];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function StartUp() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.User);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const { sendEvent } = useSocket();
  const [loading, setLoading] = useState(true);
  const appOpenTrackedRef = useRef("");
  const appOpenSessionRef = useRef(0);
  const previousTokenRef = useRef(null);
  const locationSubscriptionRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const hasShownMotivationForActiveStateRef = useRef(false);
  const isShowingMotivationNotificationRef = useRef(false);
  const deniedModuleAlertRef = useRef("");

  const loadUser = useCallback(async () => {
    try {
      const storedUserString = await AsyncStorage.getItem("user");

      if (storedUserString) {
        const parsedUser = JSON.parse(storedUserString);
        dispatch(setUser({ user: parsedUser }));

        const storedModule = await AsyncStorage.getItem(ACTIVE_MODULE_STORAGE_KEY);
        let effectiveUser = parsedUser;

        // Fetch fresh user data from server
        if (parsedUser?.token) {
          try {
            const res = await privateSharedApi(parsedUser.token).get("/profile");
            if (res.data?.user) {
              // Merge server data with stored token
              const updatedUser = { ...res.data.user, token: parsedUser.token };
              effectiveUser = updatedUser;
              dispatch(setUser({ user: updatedUser }));
            }
          } catch (profileError) {
            console.error("Error fetching user profile:", profileError);
          }
        }

        if (storedModule && userHasModuleAccess(effectiveUser, storedModule)) {
          dispatch(setSelectedModule(storedModule));
        } else {
          dispatch(clearSelectedModule());
        }
      }
    } catch (error) {
      console.error("Error loading user from AsyncStorage:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!user?.token || !user?.role || MOBILE_ALLOWED_ROLES.includes(user.role)) {
      return;
    }

    Alert.alert(
      "Mobile Access Restricted",
      "Only agents and managers can use the mobile app. Admins must sign in through the web portal.",
      [
        {
          text: "OK",
          onPress: () => {
            dispatch(logoutUser());
            dispatch(clearSelectedModule());
            dispatch(resetEntries());
            dispatch(resetChat());
            dispatch(resetGamification());
          },
        },
      ],
      { cancelable: false }
    );
  }, [dispatch, user?.role, user?.token]);

  useEffect(() => {
    if (!user?.token || !MOBILE_ALLOWED_ROLES.includes(user?.role)) {
      deniedModuleAlertRef.current = "";
      return;
    }

    if (!selectedModule || userHasModuleAccess(user, selectedModule)) {
      deniedModuleAlertRef.current = "";
      return;
    }

    if (deniedModuleAlertRef.current === selectedModule) {
      return;
    }

    deniedModuleAlertRef.current = selectedModule;
    dispatch(clearSelectedModule());
    dispatch(resetEntries());
    dispatch(resetChat());
    dispatch(resetGamification());
    navigation.navigate("GITSA Home");

    Alert.alert(
      "No Access",
      `You do not have access to the ${selectedModule} module.`
    );
  }, [dispatch, navigation, selectedModule, user]);

  const loadEntries = useCallback(async () => {
    if (user?.token && selectedModule) {
      try {
        const [entriesRes, scorecard, dailyMissions, notifications] =
          await Promise.all([
            privateApi(user.token).get("/entries"),
            gamificationApi.getScorecard(user.token).catch(() => null),
            gamificationApi.getDailyMissions(user.token).catch(() => ({
              progressPercent: 0,
              missions: [],
            })),
            gamificationApi.getNotifications(user.token).catch(() => ({
              notifications: [],
              preferences: null,
            })),
          ]);

        dispatch(setEntries({ entries: entriesRes.data.entries }));
        dispatch(setAgentScorecard(scorecard));
        dispatch(setAgentDailyMissions(dailyMissions));
        dispatch(setAgentNotifications(notifications));
      } catch (err) {
        console.error("Error fetching entries", err.response?.data);

        if (err.response?.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please log in again.",
            [
              {
                text: "OK",
                onPress: () => {
                  dispatch(logoutUser());
                  dispatch(resetEntries());
                  dispatch(resetChat());
                  dispatch(resetGamification());
                },
              },
            ],
            { cancelable: false } // Prevent closing the alert without user action
          );
        }
      } finally {
        dispatch(markEntriesHydrated());
      }
    }
  }, [dispatch, selectedModule, user]); // Add user as a dependency here

  // useEffect to call loadEntries when user changes
  useEffect(() => {
    loadEntries();
  }, [loadEntries]); // Make sure to call loadEntries when it changes

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    applyModuleTheme(selectedModule);
  }, [selectedModule]);

  useEffect(() => {
    const currentToken = user?.token || null;

    if (currentToken && previousTokenRef.current !== currentToken) {
      appOpenSessionRef.current += 1;
      appOpenTrackedRef.current = "";
    }

    if (!currentToken && previousTokenRef.current) {
      appOpenTrackedRef.current = "";
    }

    previousTokenRef.current = currentToken;
  }, [user?.token]);

  // Track app open once per login/app-open session for the active module.
  useEffect(() => {
    if (!user?.token || !selectedModule || loading) {
      return;
    }

    const trackingKey = `${user.token}:${selectedModule}:${appOpenSessionRef.current}`;
    if (appOpenTrackedRef.current === trackingKey) {
      return;
    }

    appOpenTrackedRef.current = trackingKey;
    privateApi(user.token)
      .post("/tracking/app-open")
      .catch((err) => console.error("App-open tracking error:", err));
  }, [loading, selectedModule, user?.token]);

  useEffect(() => {
    if (!user?.token || !selectedModule || loading) {
      return;
    }

    registerGamificationDevice(user.token)
      .then((deviceState) => {
        dispatch(setExpoDeviceState(deviceState));
      })
      .catch((error) => {
        console.error("Error registering gamification device:", error);
      });
  }, [dispatch, loading, selectedModule, user?.token]);

  useEffect(() => {
    const ensureNotificationPermission = async () => {
      const permissions = await Notifications.getPermissionsAsync();
      let status = permissions.status;

      if (status === "undetermined") {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
      }

      return status === "granted";
    };

    const maybeShowMotivationNotification = async () => {
      if (
        !user?.token ||
        !selectedModule ||
        loading ||
        hasShownMotivationForActiveStateRef.current ||
        isShowingMotivationNotificationRef.current
      ) {
        return;
      }

      isShowingMotivationNotificationRef.current = true;
      hasShownMotivationForActiveStateRef.current = true;

      try {
        const granted = await ensureNotificationPermission();
        if (!granted) {
          return;
        }

        const [scorecard, dailyMissions, leaderboard, tier] = await Promise.all([
          gamificationApi.getScorecard(user.token).catch(() => null),
          gamificationApi.getDailyMissions(user.token).catch(() => ({
            progressPercent: 0,
            missions: [],
          })),
          gamificationApi.getLeaderboard(user.token).catch(() => null),
          gamificationApi.getTier(user.token).catch(() => null),
        ]);

        dispatch(setAgentScorecard(scorecard));
        dispatch(setAgentDailyMissions(dailyMissions));
        dispatch(setAgentLeaderboard(leaderboard));
        dispatch(setAgentTier(tier));

        const message = buildGamificationNotification({
          user,
          scorecard,
          dailyMissions,
          leaderboard,
          tier,
          selectedModule,
        });

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${selectedModule}: ${message.title}`,
            body: message.body,
            sound: "default",
          },
          trigger: null,
        });
      } catch (error) {
        console.error("Error showing motivation notification:", error);
      } finally {
        isShowingMotivationNotificationRef.current = false;
      }
    };

    maybeShowMotivationNotification();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasBackgrounded =
        appStateRef.current === "background" || appStateRef.current === "inactive";

      appStateRef.current = nextAppState;

      if (wasBackgrounded && nextAppState === "active") {
        appOpenSessionRef.current += 1;
        appOpenTrackedRef.current = "";
        hasShownMotivationForActiveStateRef.current = false;
        maybeShowMotivationNotification();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch, loading, selectedModule, user?.fullName, user?.token]);

  useEffect(() => {
    let isMounted = true;

    const startLocationTracking = async () => {
      if (
        !user?.token ||
        !selectedModule ||
        user?.role !== "agent" ||
        !user?._id ||
        !user?.companyName
      ) {
        if (locationSubscriptionRef.current) {
          locationSubscriptionRef.current.remove();
          locationSubscriptionRef.current = null;
        }
        return;
      }

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted" || !isMounted) {
          return;
        }

        if (locationSubscriptionRef.current) {
          locationSubscriptionRef.current.remove();
          locationSubscriptionRef.current = null;
        }

        locationSubscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 60000,
            distanceInterval: 50,
          },
          async ({ coords }) => {
            const payload = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              agentId: user._id,
              agentName: user.fullName || "Agent",
              companyName: user.companyName,
              profilePic: user.profilePic || "profile-placeholder",
            };

            try {
              await privateApi(user.token).post("/location", payload);
              sendEvent("agentLocation", payload);
            } catch (error) {
              console.error("Error sending live location:", error);
            }
          }
        );
      } catch (error) {
        console.error("Error starting location tracking:", error);
      }
    };

    startLocationTracking();

    return () => {
      isMounted = false;
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }
    };
  }, [
    loading,
    sendEvent,
    user?._id,
    user?.companyName,
    user?.fullName,
    user?.profilePic,
    user?.role,
    selectedModule,
    user?.token,
  ]);

  // Request App Tracking Transparency permission on iOS
  useEffect(() => {
    if (Platform.OS !== "ios" || loading) {
      return;
    }

    const requestTrackingPermission = async () => {
      try {
        // Check the current status first
        const { status: currentStatus } = await getTrackingPermissionsAsync();
        console.log("Current tracking permission status:", currentStatus);
        
        // Only request if status is undetermined (not yet asked)
        if (currentStatus === "undetermined") {
          // Wait a bit for the app to be fully ready before showing the prompt
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            const { status } = await requestTrackingPermissionsAsync();
            console.log("Tracking permission requested, new status:", status);
          } catch (error) {
            console.error("Error requesting tracking permission:", error);
          }
        } else {
          console.log("Tracking permission already determined:", currentStatus);
        }
      } catch (error) {
        console.error("Error checking/requesting tracking permission:", error);
      }
    };

    // Request after app is loaded
    requestTrackingPermission();
  }, [loading]);

  useEffect(() => {
    const handleDeepLink = (event) => {
      const data = Linking.parse(event.url);
      const state = data.queryParams.state;
      if (!state) {
        Alert.alert(
          "Internal Server Error",
          "An Unexpected error occurred while authorizing to Google",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("DailySchedule", { state });
              },
            },
          ],
          { cancelable: false } // Prevent closing the alert without user action
        );
      } else {
        navigation.navigate("DailySchedule", { state });
      }
    };
    // Add the event listener for deep linking
    const linkingListener = Linking.addEventListener("url", handleDeepLink);

    // Cleanup the event listener when component unmounts
    return () => {
      linkingListener.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return user?.token && MOBILE_ALLOWED_ROLES.includes(user?.role)
    ? <AppStack />
    : <AuthStack />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <StartUp />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
