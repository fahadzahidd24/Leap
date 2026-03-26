import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Crypto from "expo-crypto";
import { gamificationApi } from "../api/gamification";

const DEVICE_ID_KEY = "gamification-device-id";

export const registerGamificationDevice = async (token) => {
  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;

  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  let expoPushToken = null;
  let registered = false;
  let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = Crypto.randomUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  if (status === "granted" && Device.isDevice) {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ||
      Constants?.easConfig?.projectId;

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    expoPushToken = tokenResponse?.data || null;

    if (expoPushToken) {
      await gamificationApi.registerExpoDevice(token, {
        deviceId,
        platform: Platform.OS,
        appVersion: Constants?.expoConfig?.version || "1.0.0",
        expoPushToken,
      });
      registered = true;
    }
  }

  return {
    permissionStatus: status,
    token: expoPushToken,
    deviceId,
    registered,
  };
};
