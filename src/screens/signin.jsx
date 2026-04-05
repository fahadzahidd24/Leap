import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import LeapTextInput from "../components/LeapTextInput.jsx";
import { publicApi } from "../api/axios.js";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice.js";
import { clearSelectedModule } from "../redux/features/moduleSlice.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { LEGAL_DOCUMENT_KEYS } from "../constants/legalDocuments.js";
const GITSA_ACCENT = "#e6634c";
const INPUT_BORDER = "rgba(15, 23, 42, 0.16)";
const TEXT_PRIMARY = "#0f172a";
const TEXT_MUTED = "#64748b";

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

  const openLegalDocument = (documentKey) => {
    navigation.navigate("legalDocument", { documentKey });
  };

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
      .post("/mobile/login", { email: normalizedEmail, password })
      .then(async(res) => {
        const user = res.data.user;
        if (user?.role !== "agent" && user?.role !== "manager") {
          Alert.alert(
            "Login Failed",
            "Only agents and managers can sign in to the mobile app."
          );
          return;
        }

        dispatch(setUser({ user }));
        dispatch(clearSelectedModule());
        await AsyncStorage.setItem("profession", user?.profession);
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
    <LinearGradient
      colors={["#cfe9f6", "#d9eef7", "#f1ddd7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.backgroundStyle}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          enabled
        >
          <StatusBar
            barStyle={"dark-content"}
            backgroundColor={"#cfe9f6"}
          />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={{
              justifyContent: "center",
              paddingBottom: 100,
              paddingHorizontal: 10,
              flexGrow: 1,
            }}
            bounces={false}
            style={styles.scrollViewStyle}
          >
            <View style={styles.topBar}>
              <Pressable
                onPress={() => navigation.navigate("onboarding")}
                style={styles.backButton}
                hitSlop={10}
              >
                <Ionicons name="arrow-back" size={22} color={TEXT_PRIMARY} />
              </Pressable>
            </View>

            <View style={styles.logoCard}>
              <Image
                source={require("../../assets/GitsaLogoBlack.png")}
                style={{ alignSelf: "center", width: 220, height: 120, resizeMode: "contain" }}
              />
            </View>

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
              fontSize: 20,
              fontWeight: "700",
              marginHorizontal: 5,
              marginTop: 10,
              color: TEXT_PRIMARY,
            }}
          >
            Welcome to GITSA!
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 15,
              lineHeight: 22,
              marginHorizontal: 18,
              marginTop: 8,
              color: TEXT_MUTED,
            }}
          >
            Sign in once to access LEAP and QUEST through one shared GITSA shell.
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
              textColor={TEXT_PRIMARY}
              accentColor={TEXT_PRIMARY}
              borderColor={INPUT_BORDER}
              activeBorderColor={TEXT_PRIMARY}
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
              textColor={TEXT_PRIMARY}
              accentColor={TEXT_PRIMARY}
              borderColor={INPUT_BORDER}
              activeBorderColor={TEXT_PRIMARY}
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
                backgroundColor: GITSA_ACCENT,
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
                <TouchableOpacity
                  onPress={() =>
                    openLegalDocument(LEGAL_DOCUMENT_KEYS.PRIVACY_POLICY)
                  }
                >
                  <Text style={styles.legalLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.legalText}> & </Text>
                <TouchableOpacity
                  onPress={() =>
                    openLegalDocument(LEGAL_DOCUMENT_KEYS.TERMS_OF_USE)
                  }
                >
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
    </LinearGradient>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  backgroundStyle: {
    backgroundColor: "transparent",
    flex: 1,
  },
  scrollViewStyle: {
    padding: 25,
  },
  topBar: {
    marginBottom: 8,
    alignItems: "flex-start",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.56)",
  },
  logoCard: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.56)",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginBottom: 8,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
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
    color: "rgba(15, 23, 42, 0.6)",
  },
  legalLink: {
    fontSize: 13,
    color: GITSA_ACCENT,
    textDecorationLine: "underline",
  },
});
