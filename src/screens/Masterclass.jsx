import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { theme } from "../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const videos = [
  {
    key: "P",
    title: "Pre-Approach",
    subtitle: "Prospects Contacted",
    description: "Learn effective techniques for reaching out to prospects and making first contact.",
    color: "#ff5757",
    icon: "account-search",
  },
  {
    key: "A",
    title: "Approach",
    subtitle: "Appointment Secured",
    description: "Master the art of securing appointments and building initial rapport.",
    color: "#ffca08",
    icon: "calendar-check",
  },
  {
    key: "S",
    title: "Closing",
    subtitle: "Sales Closed",
    description: "Discover proven closing techniques to seal the deal confidently.",
    color: "#00bf63",
    icon: "handshake",
  },
];

const VideoCard = ({ video, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: video.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: video.color }]}>
          <MaterialCommunityIcons name={video.icon} size={30} color="white" />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{video.title}</Text>
            <View style={[styles.badge, { backgroundColor: video.color }]}>
              <Text style={styles.badgeText}>{video.key}</Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle}>{video.subtitle}</Text>
          <Text style={styles.cardDescription}>{video.description}</Text>
        </View>
      </View>
      <View style={styles.playIconContainer}>
        <Ionicons name="play-circle" size={40} color={video.color} />
      </View>
    </TouchableOpacity>
  );
};

const Masterclass = ({ navigation }) => {
  const handleVideoPress = (video) => {
    navigation.navigate("VideoPlayer", {
      videoKey: video.key,
      title: `${video.title} - ${video.subtitle}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Masterclass</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>Sales Masterclass</Text>
          <Text style={styles.heroSubtitle}>
            Watch and learn from our expert training videos
          </Text>
        </View>

        {/* Video List */}
        <View style={styles.videoList}>
          <Text style={styles.sectionTitle}>Training Videos</Text>
          {videos.map((video) => (
            <VideoCard
              key={video.key}
              video={video}
              onPress={() => handleVideoPress(video)}
            />
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={24}
            color="#ffca08"
          />
          <Text style={styles.infoText}>
            Tip: Watch all videos to master the complete PAPS sales methodology.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Masterclass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 8,
    textAlign: "center",
  },
  videoList: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
  playIconContainer: {
    marginLeft: 10,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 202, 8, 0.1)",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginLeft: 12,
    lineHeight: 20,
  },
});

