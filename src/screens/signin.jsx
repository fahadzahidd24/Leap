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
import React, { useState } from "react";
import { theme } from "../constants/theme.js";
import { Button } from "react-native-paper";
import LeapTextInput from "../components/LeapTextInput.jsx";
import { publicApi } from "../api/axios.js";
import { useDispatch } from "react-redux";
import { setProfession, setUser } from "../redux/features/userSlice.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const signinFunc = () => {
    setLoading(true);
    publicApi
      .post("/login", { email, password })
      .then(async(res) => {
        const user = res.data.user;

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
            paddingVertical: 50,
            paddingHorizontal: 10,
            flexGrow: 1,
            // backgroundColor: "yellow",
          }}
          bounces={false}
          style={styles.scrollViewStyle}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ alignSelf: "center" }}
          />

          <Text
            style={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: "300",
              marginTop: 25,
              color: theme.colors.secondary,
            }}
          >
            My Sales Coach
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 24,
              fontStyle: "italic",
              fontFamily: "",
              marginHorizontal: 5,
              marginTop: 80,
              color: theme.colors.secondary,
            }}
          >
            “My Best Partner In Sales”
          </Text>
          <View
            style={{
              marginTop: 50,
              justifyContent: "space-between",
            }}
          >
            <LeapTextInput
              label="Email"
              value={email}
              keyboardType={"email-address"}
              autoComplete={"email"}
              onChangeText={(text) => setEmail(text)}
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

            <Text
              onPress={() => navigation.navigate("signup")}
              style={{
                textAlign: "left",
                fontFamily: "",
                fontSize: 18,
                marginTop: 20,
                color: theme.colors.secondary,
              }}
            >
              Don’t have an account? Sign Up
            </Text>
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
});
