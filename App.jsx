import "react-native-gesture-handler";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { View, Text, ActivityIndicator, Alert, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
LogBox.ignoreAllLogs();

function StartUp() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.User);
  const [loading, setLoading] = useState(true);
  const appOpenTrackedRef = useRef(false);

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
        const res = await privateApi(user.token).get("/entries");
        dispatch(setEntries({ entries: res.data.entries }));
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
