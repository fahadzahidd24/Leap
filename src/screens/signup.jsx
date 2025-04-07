import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { theme } from "../constants/theme.js";
import LeapTextInput from "../components/LeapTextInput.jsx";
import { publicApi } from "../api/axios.js";
import { setUser } from "../redux/features/userSlice.js";
import LeapRadioButton from "../components/LeapRadioButtons.jsx";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { pickImageFromGallery } from "../utils/pickImageFromGallery.js";

const SignUp = ({ navigation }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
    companyName: "",
  });
  const [image, setImage] = useState(null);
  const [pickedImage, setPickedImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: false });
  };

  const validateFields = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = true;
    if (!formData.role) errors.role = true;
    if (!formData.companyName.trim()) errors.companyName = true;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = true;
    if (!formData.password.trim() || formData.password.length < 8)
      errors.password = true;
    if (!image) {
      setImageError(true);
      return false;
    }

    setFormErrors(errors);

    return !Object.values(errors).some(Boolean);
  };

  const signupFunc = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      // Create a new FormData instance
      const formData1 = new FormData();

      formData1.append("email", formData.email);
      formData1.append("password", formData.password);
      formData1.append("fullName", formData.name);
      formData1.append("role", formData.role);
      formData1.append("companyName", formData.companyName);
      formData1.append("profilePic", image);

      // Make the POST request with multipart/form-data content type
      const response = await publicApi.post("/signup", formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const user = response.data.user;
      dispatch(setUser({ user }));
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Internal Server Error";
      Alert.alert(message);
      // setErrorMessage(message);
      // setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    setImageError(false);
    await pickImageFromGallery({
      setImage,
      setPickedImage,
    });
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
        enabled
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.background}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
          bounces={false}
          style={styles.scrollViewStyle}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>My Sales Coach</Text>
          <Text style={styles.subtitle}>“My Best Partner In Sales”</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: imageError ? "red" : "white",
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                marginBottom: 15,
              }}
              onPress={uploadImage}
            >
              {pickedImage ? (
                <Image
                  source={{ uri: pickedImage }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                />
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={40}
                  color={imageError ? "red" : "white"}
                />
              )}
            </TouchableOpacity>

            <LeapTextInput
              label="Full Name"
              value={formData.name}
              keyboardType="default"
              autoComplete="name"
              onChangeText={(text) => handleInputChange("name", text)}
              isError={formErrors.name}
            />
            <LeapTextInput
              label="Company Name"
              value={formData.companyName}
              keyboardType="default"
              autoComplete="name"
              onChangeText={(text) => handleInputChange("companyName", text)}
              isError={formErrors.companyName}
            />
            <LeapTextInput
              label="Email"
              value={formData.email}
              keyboardType="email-address"
              autoComplete="email"
              onChangeText={(text) => handleInputChange("email", text)}
              isError={formErrors.email}
            />
            <LeapTextInput
              label="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              isError={formErrors.password}
            />

            <LeapRadioButton
              options={[
                { label: "Agent", value: "agent" },
                { label: "Manager", value: "manager" },
              ]}
              selectedOption={formData.role}
              onSelect={(text) => handleInputChange("role", text)}
            />

            <Button
              labelStyle={styles.buttonLabel}
              textColor="#FFFFFF"
              mode="contained"
              style={styles.signupButton}
              onPress={signupFunc}
              loading={loading}
            >
              Sign Up
            </Button>
            <Text
              onPress={() => navigation.navigate("signin")}
              style={styles.signinText}
            >
              Already have an account? Sign In
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollViewStyle: {
    padding: 25,
  },
  scrollViewContent: {
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  logo: {
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "300",
    marginTop: 25,
    color: theme.colors.secondary,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 24,
    fontStyle: "italic",
    marginHorizontal: 5,
    marginTop: 80,
    color: theme.colors.secondary,
  },
  inputContainer: {
    marginVertical: 50,
    justifyContent: "space-between",
  },
  buttonLabel: {
    fontSize: 17,
  },
  signupButton: {
    paddingHorizontal: 30,
    borderRadius: 35,
    paddingVertical: 6,
    marginVertical: 20,
    backgroundColor: "#ff914d",
  },
  signinText: {
    textAlign: "left",
    fontSize: 18,
    marginTop: 15,
    color: theme.colors.secondary,
  },
});
