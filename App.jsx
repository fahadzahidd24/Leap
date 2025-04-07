import "react-native-gesture-handler";
import React, { useEffect, useState, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppStack from "./src/navigation/AppStack";
import AuthStack from "./src/navigation/AuthStack";
import { logoutUser, setUser } from "./src/redux/features/userSlice";
import * as Location from "expo-location";
import { store } from "./src/redux/store";
import useSocket from "./src/hooks/useSocket";
import { LogBox } from 'react-native';
import {
  resetCurrentCoordinates,
  setCurrentCoordinates,
} from "./src/redux/features/locationSlice";
import { privateApi } from "./src/api/axios";
import { resetEntries, setEntries } from "./src/redux/features/entriesSlice";
import { debounce } from "lodash";
import * as Linking from "expo-linking";
import { resetChat } from "./src/redux/features/chatSlice";
LogBox.ignoreAllLogs();
// Define the function to send the agent location
const sendAgentLocation = async (latitude, longitude, user) => {
  try {
    if (!user) {
      return;
    }
    const response = await privateApi(user?.token).post("/location", {
      latitude,
      longitude,
      agentId: user?._id,
      agentName: user?.fullName,
      companyName: user?.companyName,
      profilePic: user?.profilePic,
    });
  } catch (error) {
    console.error("Failed to send location:", error);
  }
};

// Debounce the function with a 2-second delay
const debouncedSendAgentLocation = debounce(sendAgentLocation, 10000);

function StartUp() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.User);
  const [loading, setLoading] = useState(true);
  const { sendEvent, socket } = useSocket();

  const loadUser = useCallback(async () => {
    try {
      const storedUserString = await AsyncStorage.getItem("user");

      if (storedUserString) {
        const parsedUser = JSON.parse(storedUserString);
        dispatch(setUser({ user: parsedUser }));
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
                  dispatch(resetCurrentCoordinates());
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

  useEffect(() => {
    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        const { status: status1 } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted" || status1 !== "granted") {
          console.log("Permission to access location was denied");
          Alert.alert("Error", "Permission to access location was denied");
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 20000,
          },
          (location) => {
            const { latitude, longitude } = location.coords;

            if (user?.token && user?.role === "agent") {
              debouncedSendAgentLocation(latitude, longitude, user);

              sendEvent("agentLocation", {
                latitude,
                longitude,
                agentId: user?._id,
                agentName: user?.fullName,
                companyName: user?.companyName,
                profilePic: user?.profilePic,
              });
            }
            dispatch(setCurrentCoordinates({ latitude, longitude }));
          }
        );

        return () => {
          subscription?.remove();
        };
      } catch (error) {
        console.error("Error starting location updates:", error);
      }
    };

    if (socket && user?.companyName) {
      sendEvent("joinCompanyRoom", user?.companyName);

      startLocationUpdates();
    }
  }, [socket, user, dispatch]);

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
