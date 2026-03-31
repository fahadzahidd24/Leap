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
import { useSelector } from "react-redux";
import { getModuleConfig } from "../constants/moduleConfig";
import Loader from "../components/Loader";

const Module = ({ navigation, text, bg, fg, routeName, onPress }) => {
  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }

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
  const user = useSelector((state) => state.User);
  const entries = useSelector((state) => state.Entries);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const moduleConfig = getModuleConfig(selectedModule);
  const isEntriesLoading = selectedModule && entries?.__loaded !== true;

  const openSalesActivity = () => {
    const hasSalesTargetEntries = Boolean(
      entries?.SalesTargets?.salesTargets &&
        entries?.SalesTargets?.averageCaseSize &&
        entries?.SalesTargets?.numberOfWeeks
    );

    if (hasSalesTargetEntries) {
      navigation.navigate("tabs", { screen: "Daily Activity" });
      return;
    }

    navigation.navigate("Sales");
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <Loader loading={isEntriesLoading} />
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
            source={moduleConfig.assets.logo}
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
          <Image
            source={moduleConfig.assets.welcome}
            style={{ alignSelf: "center" }}
          />

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

          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() =>
              navigation.navigate("Agent", {
                screen: "Dashboard",
              })
            }
          >
            <Text style={styles.dashboardButtonText}>Open Dashboard</Text>
          </TouchableOpacity>

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
            ({user?.email})
          </Text> */}

          <View style={{ marginTop: 30 }}>
            <Module
              bg={moduleConfig.assets.homeCards.salesBg}
              fg={moduleConfig.assets.homeCards.salesFg}
              text={"Track sales activity"}
              navigation={navigation}
              onPress={openSalesActivity}
            />
            <Module
              bg={moduleConfig.assets.homeCards.coachBg}
              fg={moduleConfig.assets.homeCards.coachFg}
              text={"Ask my coach"}
              navigation={navigation}
              routeName={"Coach"}
            />
            <Module
              bg={moduleConfig.assets.homeCards.masterclassBg}
              fg={moduleConfig.assets.homeCards.masterclassFg}
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
    alignSelf: "flex-start",
  },
  dashboardButton: {
    marginHorizontal: 10,
    marginTop: 25,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dashboardButtonText: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: "700",
  },
});
