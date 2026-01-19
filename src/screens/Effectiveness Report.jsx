import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../constants/theme";
import {
  EvilIcons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { privateApi } from "../api/axios";
import {
  setWeeklyAchieved,
  setYearlyAchieved,
} from "../redux/features/entriesSlice";
import Loader from "../components/Loader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { formatPercentage } from "../utils/formatPercentage";
import { getMalaysianDateString } from "../utils/currentDate&Day";

const Category = ({ goal, achieved, text, backgroundColor }) => {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        flexDirection: "row",
        paddingHorizontal: 40,
        marginVertical: 5,
        borderRadius: 5,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/goal1.png")}
          style={{
            marginRight: 2,
            width: 45,
            height: 45,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.secondary,
            marginLeft: 3,
          }}
        >
          {formatPercentage(goal)}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 60,
          fontWeight: "bold",
          color: theme.colors.secondary,
        }}
      >
        {text}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/achieved1.png")}
          style={{
            marginRight: 2,
            width: 40,
            height: 40,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.secondary,
            marginLeft: 3,
          }}
        >
          {formatPercentage(achieved)}
        </Text>
      </View>
    </View>
  );
};

const EffectivenessReport = () => {
  const entries = useSelector((state) => state.Entries);
  const navigation = useNavigation();
  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        privateApi(token)
          .get("/pas/annual")
          .then((res) => {
            dispatch(setYearlyAchieved({ yearly: res.data.pas }));
          })
          .catch((err) => console.error(err));

        privateApi(token)
          .get(`/pas/weekly?date=${getMalaysianDateString()}`)
          .then((res) => {
            dispatch(setWeeklyAchieved({ weekly: res.data.pas }));
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [token])
  );

  const calculateSalesRatioGoal = (entries) => {
    const salesSubmitted = entries?.SuccessFormula?.salesSubmitted || 0;
    const presentationsHeld = entries?.SuccessFormula?.presentationsHeld || 0;

    // Let division handle 0/0 = NaN naturally for proper display
    return (salesSubmitted / presentationsHeld) * 100;
  };

  const calculateSalesRatioAchieved = (entries) => {
    const yearlyAchievedPR = entries?.yearly_achieved?.pr_yearly || 0;
    const yearlyAchievedS = entries?.yearly_achieved?.s_yearly || 0;

    // Let division handle 0/0 = NaN naturally for proper display
    return (yearlyAchievedS / yearlyAchievedPR) * 100;
  };

  console.log("entries?.SuccessFormula", entries?.SuccessFormula)

  const calculatePresentationRatioGoal = (entries) => {
    const presentationsHeld = entries?.SuccessFormula?.presentationsHeld || 0;
    const appointmentsKept = entries?.SuccessFormula?.appointmentsKept || 0;

    console.log("presentationsHeld", presentationsHeld)
    console.log("appointmentsKept", appointmentsKept)

    // Let division handle 0/0 = NaN naturally for proper display
    return (presentationsHeld / appointmentsKept) * 100;
  };

  console.log("calculatePresentationRatioGoal", entries?.yearly_achieved)

  const calculatePresentationRatioAchieved = (entries) => {
    const yearlyAchievedA = entries?.yearly_achieved?.a_yearly || 0;
    const yearlyAchievedPR = entries?.yearly_achieved?.pr_yearly || 0;

    // Let division handle 0/0 = NaN naturally for proper display
    return (yearlyAchievedPR / yearlyAchievedA) * 100;
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{
          justifyContent: "center",
          paddingBottom: 20,
          flexGrow: 1,
          paddingHorizontal: 10,
          // backgroundColor: "yellow",
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewStyle}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            //   backgroundColor: "black",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              // backgroundColor: "red",
              fontWeight: "300",
              textAlign: "justify",
              flexWrap: "wrap",
              color: theme.colors.secondary,
            }}
          >
            Sales Effectiveness{"\n"}Report
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // backgroundColor: "red",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {/* <EvilIcons
              name="calendar"
              onPress={() => navigation.navigate("DailySchedule")}
              size={34}
              color="white"
              style={{ marginHorizontal: 3 }}
            /> */}
            {/* <MaterialCommunityIcons
              onPress={() => navigation.navigate("DailySchedule")}
              style={{ marginHorizontal: 3 }}
              name="calendar-month"
              size={27}
              color="white"
            /> */}
            <MaterialCommunityIcons
              name="progress-check"
              onPress={() => navigation.navigate("Annual Progress")}
              size={26}
              style={{ marginHorizontal: 3 }}
              color="white"
            />
            {/* <Entypo
              name="dots-three-vertical"
              size={24}
              color="white"
              style={{ marginHorizontal: 3 }}
            /> */}
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Text
            style={{
              fontSize: 21,
              // backgroundColor: "red",
              marginTop: 20,
              marginBottom: 5,
              fontWeight: "bold",
              color: theme.colors.secondary,
            }}
          >
            Appointment Ratio
          </Text>

          <Category
            goal={
              (entries?.SuccessFormula?.appointmentsKept /
                entries?.SuccessFormula?.prospectingApproach) *
                100
            }
            achieved={
              (entries?.yearly_achieved?.a_yearly /
                entries?.yearly_achieved?.p_yearly) *
                100
            }
            backgroundColor={"#ffca08"}
          />

<Text
            style={{
              fontSize: 21,
              // backgroundColor: "red",
              marginTop: 20,
              marginBottom: 5,
              fontWeight: "bold",
              color: theme.colors.secondary,
            }}
          >
            Presentation Ratio
          </Text>

          <Category
            goal={calculatePresentationRatioGoal(entries)}
            achieved={calculatePresentationRatioAchieved(entries)}
            backgroundColor={"#cb6be5"}
          />

          <Text
            style={{
              fontSize: 21,
              // backgroundColor: "red",
              marginTop: 20,
              marginBottom: 5,
              fontWeight: "bold",
              color: theme.colors.secondary,
            }}
          >
            Sales Ratio
          </Text>

          <Category
            goal={calculateSalesRatioGoal(entries)}
            achieved={calculateSalesRatioAchieved(entries)}
            backgroundColor={"#00bf63"}
          />
        </View>
      </ScrollView>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default EffectivenessReport;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 15,
  },
});
