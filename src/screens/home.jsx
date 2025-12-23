import {
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
import React from "react";
import { theme } from "../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import Octicons from "@expo/vector-icons/Octicons";

const Module = ({ navigation, text, bg, fg, href, routeName }) => {
  return (
    <Pressable
      onPress={() => {
        if (text === "Watch masterclass") {
          navigation.navigate("Masterclass");
          return;
        } else {
          navigation.replace(routeName);
        }
      }}
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
  const user = useSelector((state) => state.User);
  console.log(user);

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

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.drawerButton}
          />
        </View>

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{
            justifyContent: "center",
            // padding: 50,
            paddingBottom: 10,
            paddingHorizontal: 10,
            flexGrow: 1,
          }}
          bounces={false}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ alignSelf: "center", width: 220, height: 220 }}
          />

          {/* <Text
            style={{
              textAlign: "center",
              fontSize: 28,
              fontWeight: "300",
              marginTop: 5,
              color: theme.colors.secondary,
            }}
          >
            My Sales Coach
          </Text> */}
          {/* <Image
            source={require("../../assets/welcome.png")}
            style={{ alignSelf: "center", marginTop: 20 }}
          /> */}

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

          {/* <Text
            style={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: "700",
              marginTop: 5,
              color: theme.colors.secondary,
            }}
          >
            {user?.fullName}
          </Text> */}
          {/* <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "400",
              marginTop: 5,
              color: theme.colors.secondary,
            }}
          >
            ({user?.utcCode})
          </Text> */}

          <View style={{ marginTop: 30 }}>
            <Module
              bg={require("../../assets/1.png")}
              fg={require("../../assets/1a.png")}
              text={"Track sales activity"}
              navigation={navigation}
              routeName={"Agent"}
            />
            {/* <Module
              bg={require("../../assets/2.png")}
              fg={require("../../assets/2a.png")}
              text={"Ask my coach"}
              navigation={navigation}
              routeName={"Coach"}
            /> */}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  drawerButton: {
    // padding: 10,
    alignSelf: "flex-start",
  },
});
