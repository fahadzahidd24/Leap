import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { theme } from "../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEvent } from "expo";

const { width: screenWidth } = Dimensions.get("window");

const videoSources = {
  P: require("../../assets/videos/P-Pre-Approach.mp4"),
  A: require("../../assets/videos/A-Approach.mp4"),
  PR: require("../../assets/videos/P-Pre-Approach.mp4"),
  S: require("../../assets/videos/S-Closing.mp4"),
};

const videoTitles = {
  P: "Pre-Approach - Prospects Contacted",
  A: "Approach - Appointment Secured",
  PR: "Presentation - Presentations Made",
  S: "Closing - Sales Closed",
};

const VideoPlayer = ({ navigation, route }) => {
  const { videoKey, title } = route.params || { videoKey: "P" };
  const videoSource = videoSources[videoKey] || videoSources.P;
  const videoTitle = title || videoTitles[videoKey] || "Masterclass Video";

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

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
        <Text style={styles.headerTitle} numberOfLines={2}>
          {videoTitle}
        </Text>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
          style={styles.playButton}
        >
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={70}
            color="#ff914d"
          />
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          {isPlaying ? "Tap to pause" : "Tap to play"}
        </Text>
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>{videoKey}</Text>
        </View>
        <Text style={styles.infoText}>
          Learn the best practices and techniques for this stage of your sales process.
        </Text>
      </View>
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
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "white",
    lineHeight: 22,
  },
  videoContainer: {
    width: screenWidth,
    height: screenWidth * 0.5625, // 16:9 aspect ratio
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  playButton: {
    padding: 10,
  },
  instructionText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    marginTop: 10,
  },
  infoContainer: {
    padding: 20,
    alignItems: "center",
  },
  infoBadge: {
    backgroundColor: "#ff914d",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  infoBadgeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});

