import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  Image,
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

const videoThumbnails = {
  P: require("../../assets/pre-approach-thumbnail.png"),
  A: require("../../assets/approach-thumbnail.png"),
  PR: require("../../assets/pre-approach-thumbnail.png"),
  S: require("../../assets/sales-thumbnail.png"),
};

const videoTitles = {
  P: "Pre-Approach - Prospecting (Call/Direct Approach)",
  A: "Approach - Appointment Secured",
  PR: "Presentation - Presentations Made",
  S: "Closing - Sales Closed",
};

const VideoPlayer = ({ navigation, route }) => {
  const { videoKey, title } = route.params || { videoKey: "P" };
  const videoSource = videoSources[videoKey] || videoSources.P;
  const videoThumbnail = videoThumbnails[videoKey] || videoThumbnails.P;
  const videoTitle = title || videoTitles[videoKey] || "Masterclass Video";
  
  const [hasStarted, setHasStarted] = useState(false);

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handlePlay = () => {
    setHasStarted(true);
    player.play();
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
        <Text style={styles.headerTitle} numberOfLines={2}>
          {videoTitle}
        </Text>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {!hasStarted ? (
          // Show thumbnail before video starts
          <TouchableOpacity 
            style={styles.thumbnailContainer}
            onPress={handlePlay}
            activeOpacity={0.9}
          >
            <Image
              source={videoThumbnail}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.thumbnailOverlay}>
              <View style={styles.thumbnailPlayButton}>
                <Ionicons name="play" size={40} color="white" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.tapToPlayText}>Tap to play</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        )}
      </View>

      {/* Controls - only show after video has started */}
      {hasStarted && (
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
            <View style={styles.playButtonInner}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="#000"
                style={isPlaying ? {} : { marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.instructionText}>
            {isPlaying ? "Tap to pause" : "Tap to play"}
          </Text>
        </View>
      )}
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
  thumbnailContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailPlayButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(246, 148, 29, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  tapToPlayText: {
    color: "white",
    fontSize: 14,
    marginTop: 12,
    fontWeight: "500",
  },
  controlsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  playButton: {
    padding: 10,
  },
  playButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    // borderWidth: 2,
    // borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    marginTop: 15,
  },
});
