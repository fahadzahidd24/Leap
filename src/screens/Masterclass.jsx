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
    title: "Prospecting",
    subtitle: "Asking for Referrals",
    description: "Strengthen your client base by applying structured referral strategies that turn satisfied clients into consistent sources of new prospects.",
    color: "#ff5757",
    icon: "account-search",
    vimeoId: "1156226951",
    vimeoHash: "0b48741c06",
    isPAPS: true,
    thumbnail: require("../../assets/1-video.png"),
  },
  {
    key: "A",
    title: "Pre-Approach",
    subtitle: "Securing Appointments",
    description: "Sharpen your approach to secure appointment by applying proven techniques that help you initiate confident, effective first contact with potential clients.",
    color: "#ffca08",
    icon: "calendar-check",
    vimeoId: "1156229686",
    vimeoHash: "2dce48b091",
    isPAPS: true,
    thumbnail: require("../../assets/2-video.png"),
  },
  {
    key: "FF",
    title: "Fact Findings",
    subtitle: "Asking Right Questions to Understand Your Client",
    description: "Uncover financial needs, priorities, and long-term goals of your client through effective Situation-Shocking-Action (SSA) questioning techniques.",
    color: "#5271ff",
    icon: "clipboard-text-search",
    vimeoId: "1156229245",
    vimeoHash: "d252ecc674",
    isPAPS: false,
    thumbnail: require("../../assets/3-video.png"),
  },
  {
    key: "PR",
    title: "Presentation",
    subtitle: "Concept Presentation & Time Value of Money (TVM) Calculation",
    description: "Apply concept selling and TVM calculation to build client confidence in decision making.",
    color: "#7c3aed",
    icon: "presentation",
    vimeoId: "1156227824",
    vimeoHash: "cb64183cdc",
    isPAPS: true,
    thumbnail: require("../../assets/4-video.png"),
  },
  {
    key: "S",
    title: "Handling Concerns",
    subtitle: "Closing the Deal",
    description: "Apply a structured four-step approach to address client concerns with confidence and move conversations decisively toward commitment.",
    color: "#00bf63",
    icon: "handshake",
    vimeoId: "1156226644",
    vimeoHash: "60809c905c",
    isPAPS: true,
    thumbnail: require("../../assets/5-video.png"),
  },
];

const VideoCard = ({ video, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={video.thumbnail}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {/* Play button overlay */}
        <View style={styles.playOverlay}>
          <View style={[styles.playButton, { backgroundColor: video.color }]}>
            <Ionicons name="play" size={24} color="white" />
          </View>
        </View>
        {/* Badge */}
        <View style={[styles.thumbnailBadge, { backgroundColor: video.color }]}>
          <Text style={styles.badgeText}>{video.key}</Text>
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{video.title}</Text>
        <Text style={styles.cardSubtitle}>{video.subtitle}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{video.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Masterclass = ({ navigation }) => {
  const handleVideoPress = (video) => {
    navigation.navigate("VideoPlayer", {
      videoKey: video.key,
      title: video.title,
      subtitle: video.subtitle,
      description: video.description,
      vimeoId: video.vimeoId,
      vimeoHash: video.vimeoHash,
      color: video.color,
      thumbnail: video.thumbnail,
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
    overflow: "hidden",
  },
  thumbnailContainer: {
    position: "relative",
    height: 180,
    width: "100%",
    backgroundColor: "#1a1a2e",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 4,
  },
  thumbnailBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
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
