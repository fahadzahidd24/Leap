import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { privateApi } from "../api/axios";
import useSocket from "../hooks/useSocket";
import { theme } from "../constants/theme";
import Loader from "../components/Loader";
import GamificationCard from "../components/GamificationCard";
import GamificationEmptyState from "../components/GamificationEmptyState";

const formatTimestamp = (value) => {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
};

const formatAddress = (address) => {
  if (!address) {
    return "Location unavailable";
  }

  const parts = [
    address.streetNumber,
    address.street,
    address.district,
    address.city,
    address.region,
    address.country,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "Location unavailable";
};

const buildMapHtml = (markers) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <style>
      html, body, #map {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
      body {
        background: #ffffff;
      }
      .popup-title {
        font-weight: 700;
        margin-bottom: 4px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const markers = ${JSON.stringify(markers)};
      const first = markers[0] || { latitude: 3.139, longitude: 101.6869 };
      const map = L.map('map').setView([first.latitude, first.longitude], markers.length ? 10 : 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const bounds = [];
      markers.forEach((marker) => {
        const latLng = [marker.latitude, marker.longitude];
        bounds.push(latLng);
        L.marker(latLng)
          .addTo(map)
          .bindPopup(
            '<div class="popup-title">' + marker.agentName + '</div>' +
            '<div>Updated: ' + marker.timestamp + '</div>'
          );
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    </script>
  </body>
</html>
`;

const ManagerLiveMap = ({ navigation }) => {
  const user = useSelector((state) => state.User);
  const { socket, sendEvent, onEvent } = useSocket();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressMap, setAddressMap] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.token || !user?.companyName) {
        setLoading(false);
        return;
      }

      setLoading(true);
      privateApi(user.token)
        .get(`/location?companyName=${encodeURIComponent(user.companyName)}`)
        .then((res) => {
          setLocations(res.data || []);
        })
        .catch((error) => console.error("Error loading locations:", error))
        .finally(() => setLoading(false));
    }, [user?.companyName, user?.token])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!socket || !user?.companyName) {
        return undefined;
      }

      sendEvent("joinCompanyRoom", user.companyName);

      const unsubscribe = onEvent("managerReceiveLocation", (locationData) => {
        setLocations((prev) => {
          const next = [...prev];
          const index = next.findIndex(
            (item) => String(item.agentId) === String(locationData.agentId)
          );

          if (index >= 0) {
            next[index] = {
              ...next[index],
              ...locationData,
              timestamp: new Date().toISOString(),
            };
          } else {
            next.unshift({
              ...locationData,
              timestamp: new Date().toISOString(),
            });
          }

          return next;
        });
      });

      return unsubscribe;
    }, [onEvent, sendEvent, socket, user?.companyName])
  );

  useEffect(() => {
    let isMounted = true;

    const reverseGeocodeLocations = async () => {
      const pendingLocations = locations.filter((item) => {
        if (
          typeof item.latitude !== "number" ||
          typeof item.longitude !== "number"
        ) {
          return false;
        }

        return !addressMap[String(item.agentId || item.agentName)];
      });

      if (!pendingLocations.length) {
        return;
      }

      for (const item of pendingLocations) {
        try {
          const result = await Location.reverseGeocodeAsync({
            latitude: item.latitude,
            longitude: item.longitude,
          });

          if (!isMounted) {
            return;
          }

          setAddressMap((prev) => ({
            ...prev,
            [String(item.agentId || item.agentName)]: formatAddress(result?.[0]),
          }));
        } catch (error) {
          if (!isMounted) {
            return;
          }

          setAddressMap((prev) => ({
            ...prev,
            [String(item.agentId || item.agentName)]: "Location unavailable",
          }));
          console.error("Error reverse geocoding location:", error);
        }
      }
    };

    reverseGeocodeLocations();

    return () => {
      isMounted = false;
    };
  }, [addressMap, locations]);

  const markers = useMemo(
    () =>
      locations
        .filter(
          (item) =>
            typeof item.latitude === "number" && typeof item.longitude === "number"
        )
        .map((item) => ({
          agentId: item.agentId,
          agentName: item.agentName || "Agent",
          latitude: item.latitude,
          longitude: item.longitude,
          timestamp: formatTimestamp(item.timestamp),
        })),
    [locations]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Live Locations</Text>
          <View style={styles.headerSpacer} />
        </View>

        <GamificationCard
          title="Field Map"
          subtitle="Live team positions for your company"
          rightContent={
            <TouchableOpacity
              onPress={() => {
                if (user?.token && user?.companyName) {
                  setLoading(true);
                  privateApi(user.token)
                    .get(`/location?companyName=${encodeURIComponent(user.companyName)}`)
                    .then((res) => setLocations(res.data || []))
                    .catch((error) =>
                      console.error("Error refreshing locations:", error)
                    )
                    .finally(() => setLoading(false));
                }
              }}
            >
              <Ionicons name="refresh" size={22} color={theme.colors.background} />
            </TouchableOpacity>
          }
        >
          {markers.length ? (
            <View style={styles.mapContainer}>
              <WebView
                originWhitelist={["*"]}
                source={{ html: buildMapHtml(markers) }}
                style={styles.webview}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <GamificationEmptyState
              title="No live locations yet"
              message="Open the app on an agent device and allow location access to see markers here."
            />
          )}
        </GamificationCard>

        <GamificationCard title="Latest Updates" subtitle="Most recent agent positions">
          {locations.length ? (
            locations.map((item, index) => (
              <View
                key={`${item.agentId || item.agentName}-${index}`}
                style={styles.locationRow}
              >
                <View style={styles.locationText}>
                  <Text style={styles.agentName}>{item.agentName || "Agent"}</Text>
                  <Text style={styles.agentMeta}>
                    {addressMap[String(item.agentId || item.agentName)] ||
                      "Resolving address..."}
                  </Text>
                </View>
                <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
              </View>
            ))
          ) : (
            <GamificationEmptyState
              title="No locations available"
              message="Agent positions will appear here once location updates are received."
            />
          )}
        </GamificationCard>
      </ScrollView>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  mapContainer: {
    height: 340,
    overflow: "hidden",
    borderRadius: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.12)",
  },
  locationText: {
    flex: 1,
    paddingRight: 10,
  },
  agentName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  agentMeta: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  timestamp: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textAlign: "right",
  },
});

export default ManagerLiveMap;
