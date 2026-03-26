import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../constants/theme.js";
import { Button } from "react-native-paper";
import LeapTextInput from "../components/LeapTextInput.jsx";
import { publicApi } from "../api/axios.js";
import { useDispatch } from "react-redux";
import { setProfession, setUser } from "../redux/features/userSlice.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRIVACY_POLICY_URL = "https://gitsagroup.com/strides-privacy-policy/";
const TERMS_OF_USE_URL = "https://gitsagroup.com/terms-of-use/";

const SignIn = ({ navigation }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  const signinFunc = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      setEmailError(true);
      return;
    }
    if(!password.trim()) {
      setPasswordError(true);
      return;
    }
    setLoading(true);
    publicApi
      .post("/login", { email: normalizedEmail, password })
      .then(async(res) => {
        const user = res.data.user;
        if (
          user?.role !== "agent" &&
          user?.role !== "manager" &&
          user?.role !== "admin"
        ) {
          Alert.alert(
            "Login Failed",
            "You are not authorized to access this app."
          );
          return;
        }

        dispatch(setUser({ user }));
        await AsyncStorage.setItem("profession", user?.profession);
        // dispatch(setProfession(user?.profession));
      })
      .catch((err) => {
        console.error(err);
        const errorMessage =
          err?.response?.data?.message || "Internal Server Error";
        Alert.alert("Error", errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        enabled
      >
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={theme.colors.background}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{
            justifyContent: "center",
            paddingBottom: 100,
            paddingHorizontal: 10,
            flexGrow: 1,
            // backgroundColor: "yellow",
          }}
          bounces={false}
          style={styles.scrollViewStyle}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ alignSelf: "center", width: 270, height: 270 }}
          />

          {/* <Text
            style={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: "300",
              marginTop: 25,
              color: theme.colors.secondary,
            }}
          >
            My Sales Coach
          </Text> */}
          <Text
            style={{
              textAlign: "center",
              fontSize: 24,
              fontStyle: "italic",
              // fontFamily: "",
              marginHorizontal: 5,
              marginTop: 20,
              color: theme.colors.secondary,
            }}
          >
            You Get What You Track
          </Text>
          <View
            style={{
              marginTop: 50,
              justifyContent: "space-between",
            }}
          >
            {/* <LeapTextInput
              label="Email"
              value={email}
              keyboardType={"email-address"}
              autoComplete={"email"}
              onChangeText={(text) => setEmail(text)}
              isError={emailError}
            /> */}
            <LeapTextInput
              label="Email"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(false);
              }}
              isError={emailError}
            />
            <LeapTextInput
              label={"Password"}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              isError={passwordError}
            />

            <Button
              loading={loading}
              labelStyle={{
                fontSize: 17,
                fontFamily: "",
              }}
              textColor="#FFFFFF"
              mode="contained"
              style={{
                paddingHorizontal: 30,
                borderRadius: 35,
                paddingVertical: 6,
                marginVertical: 20,
                backgroundColor: "#ff914d",
              }}
              onPress={signinFunc}
            >
              Sign In
            </Button>

            {/* <Text
              onPress={() => navigation.navigate("signup")}
              style={{
                textAlign: "left",
                fontFamily: "",
                fontSize: 18,
                marginTop: 20,
                color: theme.colors.secondary,
              }}
            >
              Don't have an account? Sign Up
            </Text>/ */}

            {/* Privacy Policy & Terms of Use Links */}
            <View style={styles.legalLinksContainer}>
              <Text style={styles.legalText}>By signing in, you agree to our</Text>
              <View style={styles.legalLinksRow}>
                <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
                  <Text style={styles.legalLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.legalText}> & </Text>
                <TouchableOpacity onPress={() => Linking.openURL(TERMS_OF_USE_URL)}>
                  <Text style={styles.legalLink}>Terms of Use</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {showAlert && (
        <AlertMessage
          message={errorMessage}
          onPressOk={() => setShowAlert(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scrollViewStyle: {
    padding: 25,
  },
  legalLinksContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  legalLinksRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  legalText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
  },
  legalLink: {
    fontSize: 13,
    color: "#ff914d",
    textDecorationLine: "underline",
  },
});
