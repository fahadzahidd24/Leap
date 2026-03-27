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
import { privateApi } from "./src/api/axios";
import { resetEntries, setEntries } from "./src/redux/features/entriesSlice";
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
import { gamificationApi } from "./src/api/gamification";
import { registerGamificationDevice } from "./src/utils/registerGamificationDevice";
import { buildGamificationNotification } from "./src/utils/gamificationNotifications";
import useSocket from "./src/hooks/useSocket";
LogBox.ignoreAllLogs();

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
  const { sendEvent } = useSocket();
  const [loading, setLoading] = useState(true);
  const appOpenTrackedRef = useRef(false);
  const locationSubscriptionRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const lastMotivationNotificationAtRef = useRef(0);

  const loadUser = useCallback(async () => {
    try {
      const storedUserString = await AsyncStorage.getItem("user");

      if (storedUserString) {
        const parsedUser = JSON.parse(storedUserString);
        dispatch(setUser({ user: parsedUser }));
        
        // Fetch fresh user data from server
        if (parsedUser?.token) {
          try {
            const res = await privateApi(parsedUser.token).get("/profile");
            if (res.data?.user) {
              // Merge server data with stored token
              const updatedUser = { ...res.data.user, token: parsedUser.token };
              dispatch(setUser({ user: updatedUser }));
            }
          } catch (profileError) {
            console.error("Error fetching user profile:", profileError);
          }
        }
      }
    } catch (error) {
      console.error("Error loading user from AsyncStorage:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const loadEntries = useCallback(async () => {
    if (user?.token) {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    }
  }, [user, dispatch]); // Add user as a dependency here

  // useEffect to call loadEntries when user changes
  useEffect(() => {
    loadEntries();
  }, [loadEntries]); // Make sure to call loadEntries when it changes

  useEffect(() => {
    loadUser();
  }, []);

  // Track app open when user is logged in (on app start or after login)
  useEffect(() => {
    if (user?.token && !appOpenTrackedRef.current) {
      appOpenTrackedRef.current = true;
      privateApi(user.token)
        .post("/tracking/app-open")
        .catch((err) => console.error("App-open tracking error:", err));
    }
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token || loading) {
      return;
    }

    registerGamificationDevice(user.token)
      .then((deviceState) => {
        dispatch(setExpoDeviceState(deviceState));
      })
      .catch((error) => {
        console.error("Error registering gamification device:", error);
      });
  }, [dispatch, loading, user?.token]);

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
      if (!user?.token || loading) {
        return;
      }

      const now = Date.now();
      if (now - lastMotivationNotificationAtRef.current < 10000) {
        return;
      }

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
        });

        lastMotivationNotificationAtRef.current = now;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: message.title,
            body: message.body,
            sound: "default",
          },
          trigger: null,
        });
      } catch (error) {
        console.error("Error showing motivation notification:", error);
      }
    };

    maybeShowMotivationNotification();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasBackgrounded =
        appStateRef.current === "background" || appStateRef.current === "inactive";

      appStateRef.current = nextAppState;

      if (wasBackgrounded && nextAppState === "active") {
        maybeShowMotivationNotification();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch, loading, user?.fullName, user?.token]);

  useEffect(() => {
    let isMounted = true;

    const startLocationTracking = async () => {
      if (
        !user?.token ||
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

  return user?.token ? <AppStack /> : <AuthStack />;
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
