import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "../constants/theme";
import { EvilIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import ProgressBar from "../components/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { setYearlyAchieved } from "../redux/features/entriesSlice";
import { privateApi } from "../api/axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const AnnualProgress = () => {
  const entries = useSelector((state) => state.Entries);
  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        privateApi(token)
          .get("/pas/annual")
          .then((res) => {
            dispatch(setYearlyAchieved({ yearly: res.data.pas }));
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [token])
  );

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
          paddingBottom: 50,
          flexGrow: 1,
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
            Annual Goal{"\n"}Summary
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
            <MaterialCommunityIcons
              onPress={() => navigation.navigate("DailySchedule")}
              style={{ marginHorizontal: 3 }}
              name="calendar-month"
              size={27}
              color="white"
            />
            {/* <MaterialCommunityIcons
              name="progress-check"
              size={28}
              style={{ marginHorizontal: 3 }}
              color="white"
            /> */}
            {/* <Entypo
              name="dots-three-vertical"
              size={24}
              color="white"
              style={{ marginHorizontal: 3 }}
            /> */}
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.secondary,
            borderWidth: 2,
            borderColor: "#d9d9d9",
            padding: 20,
            marginVertical: 30,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: "black",
              textAlign: "center",
            }}
          >
            Sales Targets
          </Text>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "300",
              color: "red",
              marginVertical: 15,
              textAlign: "center",
            }}
          >
            $
            {(
              entries?.SalesTargets?.salesTargets -
                entries?.yearly_achieved?.totalPremiumYearly || 0
            )?.toLocaleString()}{" "}
            To Go
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-evenly",
              marginVertical: 15,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "700",
                  color: "black",
                  textAlign: "center",
                }}
              >
                $
                {entries?.yearly_achieved?.totalPremiumYearly?.toLocaleString() ||
                  0}
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "300",
                  color: "#b2b2b2",
                  textAlign: "center",
                }}
              >
                Current
              </Text>
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                color: "black",
                textAlign: "center",
              }}
            >
              /
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "700",
                  color: "#00bf63",
                  textAlign: "center",
                }}
              >
                {(
                  (entries?.yearly_achieved?.totalPremiumYearly /
                    entries?.SalesTargets?.salesTargets) *
                    100 || 0
                ).toFixed(0)}
                %
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "300",
                  color: "#b2b2b2",
                  textAlign: "center",
                }}
              >
                Progress
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              marginVertical: 15,
              gap: 10,
            }}
          >
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "300",
                  color: "black",
                  fontStyle: "italic",
                  // textAlign: "justify",
                  flexWrap: "wrap",
                  maxWidth: 160,
                }}
              >
                "Don't watch the clock; do what it does. Keep going."
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "300",
                  color: "black",
                  fontStyle: "italic",
                  // textAlign: "justify",
                  flexWrap: "wrap",
                  maxWidth: 160,
                }}
              >
                - Sam Levenson
              </Text>
            </View>
            <Image
              source={require("../../assets/mountain.png")}
              style={{
                alignSelf: "center",
                maxHeight: 150,
                maxWidth: 150,
                marginTop: 50,
              }}
            />
          </View>
        </View>

        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 26,
              fontWeight: "300",
              color: theme.colors.secondary,
            }}
          >
            YTD Activity Progress
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: 20,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                  marginBottom: 25,
                }}
              >
                P
              </Text>
              <ProgressBar
                percentage={(
                  (entries?.yearly_achieved?.p_yearly /
                    (entries?.yearly_achieved?.total_days *
                      entries?.daily_goals?.p_daily)) *
                    100 || 0
                ).toFixed(0)}
                sx={"large"}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                  marginBottom: 25,
                }}
              >
                A
              </Text>
              <ProgressBar
                percentage={(
                  (entries?.yearly_achieved?.a_yearly /
                    (entries?.yearly_achieved?.total_days *
                      entries?.daily_goals?.a_daily)) *
                    100 || 0
                ).toFixed(0)}
                sx={"large"}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                  marginBottom: 25,
                }}
              >
                S
              </Text>
              <ProgressBar
                percentage={(
                  (entries?.yearly_achieved?.s_yearly /
                    (entries?.yearly_achieved?.total_days *
                      entries?.daily_goals?.s_daily)) *
                    100 || 0
                ).toFixed(0)}
                sx={"large"}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default AnnualProgress;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scrollViewStyle: {
    padding: 16,
  },
});
