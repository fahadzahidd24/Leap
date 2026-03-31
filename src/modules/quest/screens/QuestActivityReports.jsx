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
import { theme } from "../../../constants/theme";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import ProgressBar from "../../../components/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import {
  setMonthlyAchieved,
  setWeeklyAchieved,
} from "../../../redux/features/entriesSlice";
import { privateApi } from "../../../api/axios";
import Loader from "../../../components/Loader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getMalaysianDateString } from "../../../utils/currentDate&Day";
import { getModuleConfig, MODULE_KEYS } from "../../../constants/moduleConfig";

const Category = ({
  goals,
  achieved,
  text,
  backgroundColor,
  goalImage,
  achievedImage,
}) => {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        flexDirection: "row",
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
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
          source={goalImage}
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
          {goals}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={achievedImage}
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
          {achieved}
        </Text>
      </View>
      <View>
        <ProgressBar
          percentage={Number((achieved / goals) * 100 || 0).toFixed(0)}
        />
      </View>
    </View>
  );
};

const QuestActivityReports = () => {
  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const entries = useSelector((state) => state.Entries);
  const navigation = useNavigation();
  const moduleConfig = getModuleConfig(MODULE_KEYS.QUEST);

  useFocusEffect(
    React.useCallback(() => {
      if (!token) {
        return;
      }
      const dateStr = getMalaysianDateString();

      privateApi(token)
        .get(`/pas/weekly?date=${dateStr}`)
        .then((res) => {
          dispatch(setWeeklyAchieved({ weekly: res.data.pas }));
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

      privateApi(token)
        .get(`/pas/monthly/app?date=${dateStr}`)
        .then((res) => {
          dispatch(setMonthlyAchieved({ monthly: res.data.pas }));
        })
        .catch((err) => console.error(err));
    }, [dispatch, token])
  );

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={"#3f8e9c"}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 10,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.scrollViewStyle}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "300",
              color: theme.colors.secondary,
            }}
          >
            Activity Reports
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <EvilIcons
              name="calendar"
              onPress={() => navigation.navigate("DailySchedule")}
              size={34}
              color="white"
              style={{ marginHorizontal: 3 }}
            />
            <MaterialCommunityIcons
              name="progress-check"
              onPress={() => navigation.navigate("Annual Progress")}
              size={26}
              style={{ marginHorizontal: 3 }}
              color="white"
            />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: 21,
              marginTop: 20,
              marginBottom: 5,
              fontWeight: "bold",
              color: theme.colors.secondary,
            }}
          >
            Weekly Progress
          </Text>
          <Category
            text={"P"}
            goals={Math.ceil(entries?.weekly_goals?.p_weekly) || 0}
            achieved={entries?.weekly_achieved?.p_weekly || 0}
            backgroundColor={"#ff5757"}
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />
          <Category
            text={"A"}
            goals={Math.ceil(entries?.weekly_goals?.a_weekly) || 0}
            achieved={entries?.weekly_achieved?.a_weekly || 0}
            backgroundColor={"#f5941d"}
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />
          <Category
            text={"P"}
            goals={Math.ceil(entries?.weekly_goals?.pr_weekly) || 0}
            achieved={entries?.weekly_achieved?.pr_weekly || 0}
            backgroundColor={"#36b7ff"}
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />
          <Category
            text={"C"}
            goals={Math.ceil(entries?.weekly_goals?.c_weekly) || 0}
            achieved={entries?.weekly_achieved?.c_weekly || 0}
            backgroundColor={"#00bf63"}
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: 21,
              marginTop: 20,
              marginBottom: 5,
              fontWeight: "bold",
              color: theme.colors.secondary,
            }}
          >
            Monthly Progress
          </Text>
          <Category
            text={"P"}
            goals={Math.ceil(entries?.monthly_goals?.p_monthly_month) || 0}
            achieved={entries?.monthly_achieved?.p_monthly || 0}
            backgroundColor={"#ff5757"}
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />
          <Category
            text={"A"}
            goals={Math.ceil(entries?.monthly_goals?.a_monthly_month) || 0}
            achieved={entries?.monthly_achieved?.a_monthly || 0}
            backgroundColor={"#f5941d"}
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />
          <Category
            text={"P"}
            goals={Math.ceil(entries?.monthly_goals?.pr_monthly_month) || 0}
            achieved={entries?.monthly_achieved?.pr_monthly || 0}
            backgroundColor={"#36b7ff"}
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />
          <Category
            text={"C"}
            goals={Math.ceil(entries?.monthly_goals?.c_monthly_month) || 0}
            achieved={entries?.monthly_achieved?.c_monthly || 0}
            backgroundColor={"#00bf63"}
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />
        </View>
      </ScrollView>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default QuestActivityReports;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: "#3f8e9c",
    flex: 1,
    padding: 15,
  },
});
