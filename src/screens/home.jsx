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
  View,
} from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { useDispatch, useSelector } from "react-redux";

const Module = ({ navigation, text, bg, fg, href, routeName }) => {
  return (
    <Pressable
      onPress={() => navigation.navigate(routeName)}
      style={{
        backgroundColor: "orange",
        marginVertical: 25,
        marginHorizontal: 10,
        height: 150,
        justifyContent: "flex-end",
        borderRadius: 25,
      }}
    >
      <Image
        source={bg}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          borderRadius: 25,
        }}
        resizeMode="cover"
      />

      <Image
        source={fg}
        style={{
          width: "40%",
          height: "130%",
          position: "absolute",
          right: -5,
          bottom: -20,
          zIndex: 999,
        }}
      />

      <Text
        style={{
          color: theme.colors.secondary,
          fontStyle: "italic",
          fontWeight: "bold",
          padding: 20,
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const Home = ({ navigation }) => {
  const entries = useSelector((state) => state.Entries);

  // const href = entries?.SalesTargets?.salesTargets
  //   ? "/(sales)/(tabs)"
  //   : "/(sales)";

  // const href = "/(manager)";

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
            paddingTop: 50,
            paddingBottom: 10,
            paddingHorizontal: 10,
            flexGrow: 1,
          }}
          bounces={false}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ alignSelf: "center" }}
          />

          <Text
            style={{
              textAlign: "center",
              fontSize: 28,
              fontWeight: "300",
              marginTop: 5,
              color: theme.colors.secondary,
            }}
          >
            My Sales Coach
          </Text>
          <Image
            source={require("../../assets/welcome.png")}
            style={{ alignSelf: "center", marginTop: 20 }}
          />

          <View style={{ marginTop: 30 }}>
            <Module
              bg={require("../../assets/1.png")}
              fg={require("../../assets/1a.png")}
              text={"Track sales activity"}
              navigation={navigation}
              routeName={"Agent"}
            />
            <Module
              bg={require("../../assets/2.png")}
              fg={require("../../assets/2a.png")}
              text={"Ask my coach"}
              navigation={navigation}
              routeName={"Coach"}
            />
            <Module
              bg={require("../../assets/3.png")}
              fg={require("../../assets/3a.png")}
              text={"Watch masterclass"}
              navigation={navigation}
              routeName={"Agent"}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scrollViewStyle: {},
});
