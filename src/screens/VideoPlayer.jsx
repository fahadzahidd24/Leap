import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { theme } from "../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width: screenWidth } = Dimensions.get("window");

// Video data mapping for PAPS flow
const videoData = {
  P: {
    title: "Prospecting",
    subtitle: "Asking for Referrals",
    description: "Strengthen your client base by applying structured referral strategies that turn satisfied clients into consistent sources of new prospects.",
    vimeoId: "1156226951",
    vimeoHash: "0b48741c06",
    color: "#ff5757",
  },
  A: {
    title: "Pre-Approach",
    subtitle: "Securing Appointments",
    description: "Sharpen your approach to secure appointment by applying proven techniques that help you initiate confident, effective first contact with potential clients.",
    vimeoId: "1156229686",
    vimeoHash: "2dce48b091",
    color: "#ffca08",
  },
  PR: {
    title: "Presentation",
    subtitle: "Concept Presentation & Time Value of Money (TVM) Calculation",
    description: "Apply concept selling and TVM calculation to build client confidence in decision making.",
    vimeoId: "1156227824",
    vimeoHash: "cb64183cdc",
    color: "#7c3aed",
  },
  S: {
    title: "Handling Concerns",
    subtitle: "Closing the Deal",
    description: "Apply a structured four-step approach to address client concerns with confidence and move conversations decisively toward commitment.",
    vimeoId: "1156226644",
    vimeoHash: "60809c905c",
    color: "#00bf63",
  },
};

const VideoPlayer = ({ navigation, route }) => {
  const { 
    videoKey, 
    title: paramTitle, 
    subtitle: paramSubtitle, 
    description: paramDescription,
    vimeoId: paramVimeoId,
    vimeoHash: paramVimeoHash,
    color: paramColor,
  } = route.params || { videoKey: "P" };
  
  // Use params if provided, otherwise fallback to videoData
  const video = videoData[videoKey] || videoData.P;
  const title = paramTitle || video.title;
  const subtitle = paramSubtitle || video.subtitle;
  const description = paramDescription || video.description;
  const vimeoId = paramVimeoId || video.vimeoId;
  const vimeoHash = paramVimeoHash || video.vimeoHash;
  const color = paramColor || video.color;
  
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);

  // Vimeo embed URL with private hash
  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoId}?h=${vimeoHash}&autoplay=0&title=0&byline=0&portrait=0&responsive=1`;

  // HTML wrapper for better video display
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: #000;
          overflow: hidden;
        }
        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
        }
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      <div class="video-container">
        <iframe 
          src="${vimeoEmbedUrl}"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
      <script src="https://player.vimeo.com/api/player.js"></script>
    </body>
    </html>
  `;

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
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player */}
        <View style={styles.videoContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={color} />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={[styles.video, isLoading && styles.hiddenVideo]}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadEnd={() => setIsLoading(false)}
            onError={(error) => {
              console.error("WebView error:", error);
              setIsLoading(false);
            }}
          />
        </View>

        {/* Video Info */}
        <View style={styles.infoContainer}>
          {/* Title Badge */}
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{videoKey}</Text>
          </View>

          {/* Title */}
          <Text style={styles.videoTitle}>{title}</Text>
          
          {/* Subtitle */}
          <Text style={styles.videoSubtitle}>{subtitle}</Text>
          
          {/* Divider */}
          <View style={styles.divider} />
          
          {/* Description */}
          <Text style={styles.descriptionLabel}>About this video</Text>
          <Text style={styles.videoDescription}>{description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  videoContainer: {
    width: screenWidth,
    height: screenWidth * 0.5625, // 16:9 aspect ratio
    backgroundColor: "#000",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  hiddenVideo: {
    opacity: 0,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    zIndex: 1,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 12,
    fontSize: 14,
  },
  infoContainer: {
    padding: 20,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  videoSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 20,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  videoDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 24,
  },
});
