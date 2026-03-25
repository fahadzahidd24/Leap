import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../constants/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { privateApi, publicURL } from "../api/axios";
import { logoutUser, updateUserProfile } from "../redux/features/userSlice";
import { resetEntries } from "../redux/features/entriesSlice";
import { resetChat } from "../redux/features/chatSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
  const user = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadProfilePicture(result.assets[0]);
    }
  };

  const uploadProfilePicture = async (image) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append("profilePic", {
      uri: image.uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    try {
      const response = await privateApi(user.token).put("/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // After upload, fetch fresh user data from server to get correct profilePic path
      const profileResponse = await privateApi(user.token).get("/profile");
      if (profileResponse.data?.user) {
        dispatch(updateUserProfile(profileResponse.data.user));
        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDeleteAccount(),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteAccount = async () => {
    setDeleting(true);
    
    try {
      await privateApi(user.token).delete("/profile/delete");
      
      // Clear all data and logout
      await AsyncStorage.removeItem("profession");
      dispatch(logoutUser());
      dispatch(resetEntries());
      dispatch(resetChat());
      
      Alert.alert("Account Deleted", "Your account has been successfully deleted.");
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to delete account.");
      setDeleting(false);
    }
  };

  const getProfileImage = () => {
    if (user?.profilePic) {
      // Handle both cases: with or without leading slash
      const picPath = user.profilePic.startsWith('/') ? user.profilePic.slice(1) : user.profilePic;
      return { uri: `${publicURL}/${picPath}` };
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {getProfileImage() ? (
              <Image source={getProfileImage()} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={pickImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="camera" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.fullName || "User"}</Text>
          {/* <Text style={styles.userEmail}>{user?.email || ""}</Text> */}
          <Text style={styles.userRole}>
            {/* if role is manager show leader else show role */}
            {user?.role === "manager" ? "Leader" : user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Member"}
            {/* {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Member"} */}
          </Text>
        </View>

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={22} color={theme.colors.background} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user?.fullName || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.background} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
              </View>
            </View> */}

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={22} color={theme.colors.background} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Company</Text>
                <Text style={styles.infoValue}>{user?.companyName || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.background} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          {/* <Text style={[styles.sectionTitle, { color: "#ef4444" }]}>Danger Zone</Text> */}
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialIcons name="delete-forever" size={24} color="white" />
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.warningText}>
            This will permanently delete your account and all associated data.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: theme.colors.secondary,
    marginBottom: 30,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.secondary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f7a11f",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.secondary,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.secondary,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: "#f7a11f",
    fontWeight: "500",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.secondary,
    marginBottom: 12,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  warningText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});
