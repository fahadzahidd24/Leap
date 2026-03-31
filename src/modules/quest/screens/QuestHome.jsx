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
import { theme } from "../../../constants/theme";
import { useSelector } from "react-redux";
import { hasCompletedSalesTargets } from "../../../utils/hasCompletedSalesTargets";
import { getModuleConfig, MODULE_KEYS } from "../../../constants/moduleConfig";
import Loader from "../../../components/Loader";

const Module = ({
  navigation,
  text,
  fg,
  routeName,
  onPress,
  cardColor,
}) => {
  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }

        if (text === "Watch masterclass") {
          navigation.getParent()?.navigate("Masterclass");
          return;
        }

        if (routeName === "Coach") {
          navigation.getParent()?.navigate("Coach");
          return;
        }

        navigation.navigate(routeName);
      }}
      style={{
        backgroundColor: cardColor,
        marginVertical: 18,
        marginHorizontal: 14,
        height: 150,
        justifyContent: "flex-end",
        borderRadius: 25,
        overflow: "visible",
      }}
    >
      <Image
        source={fg}
        style={{
          width: "53%",
          height: "126%",
          position: "absolute",
          right: -4,
          top: -18,
        }}
        resizeMode="contain"
      />

      <Text
        style={{
          color: theme.colors.secondary,
          fontStyle: "italic",
          fontWeight: "800",
          paddingHorizontal: 24,
          paddingVertical: 22,
          fontSize: 15,
          maxWidth: "56%",
          textTransform: "uppercase",
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const QuestHome = ({ navigation }) => {
  const entries = useSelector((state) => state.Entries);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const moduleConfig = getModuleConfig(MODULE_KEYS.QUEST);
  const isEntriesLoading = selectedModule && entries?.__loaded !== true;

  const openSalesActivity = () => {
    if (hasCompletedSalesTargets(entries)) {
      navigation.navigate("tabs", { screen: "Daily Activity" });
      return;
    }

    navigation.navigate("Sales");
  };

  return (
    <SafeAreaView
      style={[
        styles.backgroundStyle,
        { backgroundColor: "#3f8e9c" },
      ]}
    >
      <Loader loading={isEntriesLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        enabled
      >
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={"#3f8e9c"}
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
            paddingBottom: 28,
            paddingHorizontal: 10,
            flexGrow: 1,
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={moduleConfig.assets.logo}
            style={styles.logo}
          />

          <Text style={styles.coachTitle}>My Recruiting Coach</Text>

          <Image
            source={moduleConfig.assets.welcome}
            style={{
              alignSelf: "center",
              marginTop: 24,
              width: 180,
              height: 72,
              resizeMode: "contain",
            }}
          />

          <View style={styles.moduleList}>
            <Module
              fg={moduleConfig.assets.homeCards.salesFg}
              text={"Track recruitment activity"}
              navigation={navigation}
              onPress={openSalesActivity}
              cardColor="#1856b5"
            />
            <Module
              fg={moduleConfig.assets.homeCards.coachFg}
              text={"Ask my coach"}
              navigation={navigation}
              routeName={"Coach"}
              cardColor="#b765dd"
            />
            <Module
              fg={moduleConfig.assets.homeCards.masterclassFg}
              text={"Watch masterclass"}
              navigation={navigation}
              routeName={"Agent"}
              cardColor="#0bc864"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default QuestHome;

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  coachTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
    color: theme.colors.secondary,
    marginTop: 10,
  },
  logo: {
    alignSelf: "center",
    width: 250,
    height: 182,
    resizeMode: "contain",
    marginTop: 6,
  },
  drawerButton: {
    alignSelf: "flex-start",
  },
  moduleList: {
    marginTop: 34,
  },
});
