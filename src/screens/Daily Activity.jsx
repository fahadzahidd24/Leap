import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { theme } from "../constants/theme";
import { formattedDate } from "../utils/currentDate&Day";
import { EvilIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { privateApi } from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setDailyAchieved,
  setWeeklyAchieved,
  setYearlyAchieved,
} from "../redux/features/entriesSlice";
import Loader from "../components/Loader";
import { Video, ResizeMode } from "expo-av";
import { Button } from "react-native-paper";
import * as Linking from "expo-linking";
import { useFocusEffect } from "@react-navigation/native";

const Activity = ({
  text,
  status,
  goals,
  achieved,
  color,
  onPress,
  totalPremium,
  navigation,
}) => {
  const [page, setPage] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const itemSize = page === 0 ? 45 : 50;
  const itemsPerPage = Math.floor(screenWidth / itemSize);
  const itemsPerPageOnS = Math.floor(screenWidth / itemSize / 2);
  const [premiumInput, setPremiumInput] = useState("0");
  const [pressedItem, setPressedItem] = useState(null);
  const InputRef = useRef(null);
  const video = React.useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const videoLinks = {
    S: "https://vimeo.com/988983248/026de08811?share=copy",
    P: "https://vimeo.com/988983018/8475a4b767?share=copy",
    A: "https://vimeo.com/988983632/319a908362?share=copy",
  };

  const data = Array.from({ length: 50 }, (_, index) => index + 1);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {index == 0 && page > 0 && (
          <Ionicons
            onPress={() => setPage(page - 1)}
            name="caret-back"
            size={24}
            color="black"
          />
        )}
        <TouchableOpacity
          key={item}
          onPress={() => {
            if (status === "S") {
              setPressedItem(item);
              InputRef.current?.clear();
              if (item <= achieved.length) {
                setPremiumInput(Number(achieved[item - 1])?.toString());
              }
              InputRef.current?.focus();
            } else {
              onPress(item);
            }
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor:
              item <= (status === "S" ? achieved?.length : achieved)
                ? color
                : "#d9d9d9",
            alignItems: "center",
            justifyContent: "center",
            margin: 2.5,
          }}
        >
          <Text style={{ color: "#585454", fontWeight: "bold" }}>{item}</Text>
        </TouchableOpacity>

        {index == itemsPerPage - 1 && (
          <Ionicons
            onPress={() => setPage(page + 1)}
            name="caret-forward"
            size={24}
            color="black"
          />
        )}

        {status === "S" && index == itemsPerPageOnS - 1 && (
          <Ionicons
            onPress={() => setPage(page + 1)}
            name="caret-forward"
            size={24}
            color="black"
          />
        )}
      </View>
    );
  };

  const paginatedData = data.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const paginatedDataOnS = data.slice(
    page * itemsPerPageOnS,
    (page + 1) * itemsPerPageOnS
  );

  return (
    <>
      <View
        style={{
          backgroundColor: theme.colors.secondary,
          padding: 10,
          marginHorizontal: 15,
          marginVertical: 8,
          borderRadius: 15,
        }}
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
              fontSize: 20,
              fontWeight: "400",
              flexWrap: "wrap",
              maxWidth: "70%",
            }}
          >
            {text}
          </Text>
          <View
            style={{
              backgroundColor: color,
              paddingVertical: 5,
              paddingHorizontal: 20,
              borderRadius: 7,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "justify",
                flexWrap: "wrap",
                color: theme.colors.secondary,
              }}
            >
              {status}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginVertical: 15,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <FlatList
            data={status === "S" ? paginatedDataOnS : paginatedData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: status === "S" ? "flex-start" : "space-around",
              // width:"100%"
            }}
          />

          {status === "S" && (
            <View style={{ alignItems: "center", width: "45%" }}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    backgroundColor: color,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 1,
                    paddingVertical: 7,
                    borderRadius: 8,
                    flexDirection: "row",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                >
                  <Text style={{ fontWeight: "400", fontSize: 20 }}>$ </Text>
                  <TextInput
                    value={premiumInput}
                    onChangeText={(text) => setPremiumInput(text)}
                    style={{ fontSize: 20, maxWidth: "90%" }}
                    keyboardType="number-pad"
                    ref={InputRef}
                    cursorColor={"white"}
                    onSubmitEditing={() => {
                      if (pressedItem && premiumInput.length > 0) {
                        onPress(pressedItem, premiumInput);
                      }
                    }}
                    onBlur={
                      Platform.OS === "ios" &&
                      (() => {
                        if (pressedItem && premiumInput.length > 0) {
                          onPress(pressedItem, premiumInput);
                        }
                      })
                    }
                  />
                </View>
              </View>
            </View>
          )}
        </View>
        {status === "S" && (
          <View
            style={{
              width: "100%",
              maxWidth: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <View style={{ alignItems: "flex-end", marginRight: 5 }}>
              <Text style={{ fontSize: 10 }}>Total Premium</Text>
              <Text style={{ fontSize: 10 }}>YTD</Text>
            </View>
            <View
              style={{
                backgroundColor: color,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 7,
                borderRadius: 8,
                flexDirection: "row",
              }}
            >
              <Text style={{ fontWeight: "400", fontSize: 20 }}>
                $ {totalPremium}
              </Text>
            </View>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 7,
              }}
            >
              <Image
                source={require("../../assets/goal.png")}
                style={{
                  marginRight: 2,
                  width: 25,
                  height: 25,
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 2,
                }}
              >
                {goals}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 7,
              }}
            >
              <Image
                source={require("../../assets/achieved.png")}
                style={{
                  marginRight: 4,
                  width: 20,
                  height: 20,
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 2,
                }}
              >
                {Number(
                  ((status === "S" ? achieved?.length : achieved) / goals) *
                    100 || 0
                ).toFixed(0)}
                %
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center", // Center vertically
              justifyContent: "space-between", // Evenly space icons horizontally
              paddingHorizontal: 10, // Add some horizontal padding to the container
            }}
          >
            <TouchableOpacity
              onPress={() =>
                Linking.canOpenURL(videoLinks[status])
                  .then(() => Linking.openURL(videoLinks[status]))
                  .catch((err) => console.error(err))
              }
              style={{ marginHorizontal: 2 }} // Add horizontal margin to space out the icon
            >
              <SimpleLineIcons name="social-youtube" size={27} color="black" />
              {/* <MaterialCommunityIcons name="youtube" size={27} color="black" /> */}
            </TouchableOpacity>

            <TouchableOpacity // Make EvilIcons touchable
              onPress={() => navigation.navigate("DailySchedule")}
              style={{ marginHorizontal: 2 }} // Add horizontal margin to space out the icon
            >
              {/* <EvilIcons name="calendar" size={35} color="black" /> */}
              <MaterialCommunityIcons
                name="calendar-month"
                size={27}
                color="black"
              />
            </TouchableOpacity>

            <TouchableOpacity // Make MaterialCommunityIcons touchable
              onPress={() => navigation.navigate("Annual Progress")}
              style={{ marginHorizontal: 2 }} // Add horizontal margin to space out the icon
            >
              <MaterialCommunityIcons
                name="progress-check"
                size={27}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: videoLinks[status],
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
          />
          <Button
            onPress={closeModal}
            style={{ zIndex: 99 }}
            labelStyle={{ color: "white", fontSize: 16 }}
          >
            Close
          </Button>
        </View>
      </Modal> */}
    </>
  );
};

const DailyActivity = ({ navigation }) => {
  const entries = useSelector((state) => state.Entries);
  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        privateApi(token)
          .get(`/pas/daily?date=${new Date().toLocaleDateString("en-GB")}`)
          .then((res) => {
            dispatch(setDailyAchieved({ daily: res.data.pas }));
          })
          .catch((err) => console.error(err));

        privateApi(token)
          .get(`/pas/weekly?date=${new Date().toLocaleDateString("en-GB")}`)
          .then((res) => {
            dispatch(setWeeklyAchieved({ weekly: res.data.pas }));
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [token])
  );

  const updateAchievements = (data, type) => {
    if (entries?.SalesTargets?.averageCaseSize) {
      setLoading(true);
      privateApi(token)
        .post(type ? "/pas/edit" : "/pas", data)
        .then((res) => {
          const daily = res.data.pas;

          privateApi(token)
            .get(`/pas/weekly?date=${new Date().toLocaleDateString("en-GB")}`)
            .then((res) => {
              dispatch(setWeeklyAchieved({ weekly: res.data.pas }));
              dispatch(setDailyAchieved({ daily }));
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={theme.colors.background}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{
            justifyContent: "center",
            paddingBottom: 20,
            flexGrow: 1,
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}
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
              fontSize: 28,
              fontWeight: "bold",
              marginTop: 25,
              color: "#e8bf27",
            }}
          >
            {formattedDate}
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: 28,
              fontWeight: "300",
              marginTop: 30,
              color: "#e8bf27",
            }}
          >
            Daily Activity Achievement
          </Text>

          <View
            style={{ flex: 1, justifyContent: "flex-start", marginTop: 30 }}
          >
            <Activity
              text={"Prospects Reached for Appointments"}
              goals={entries?.daily_goals?.p_daily || 0}
              achieved={entries?.daily_achieved?.p_daily || 0}
              status={"P"}
              color={"#ff5757"}
              onPress={(value) =>
                updateAchievements({
                  p_daily: value,
                  date: new Date().toLocaleDateString("en-GB"),
                })
              }
              navigation={navigation}
            />

            <Activity
              text={"Appointments Kept"}
              goals={entries?.daily_goals?.a_daily || 0}
              achieved={entries?.daily_achieved?.a_daily || 0}
              status={"A"}
              onPress={(value) =>
                updateAchievements({
                  a_daily: value,
                  date: new Date().toLocaleDateString("en-GB"),
                })
              }
              navigation={navigation}
              color={"#ffca08"}
            />

            <Activity
              text={"Sales with Premium"}
              goals={entries?.daily_goals?.s_daily || 0}
              achieved={entries?.daily_achieved?.s_daily || 0}
              navigation={navigation}
              status={"S"}
              onPress={(value, premiumInput) => {
                if (value <= entries?.daily_achieved?.s_daily?.length) {
                  //edit the sale
                  updateAchievements(
                    {
                      index: value - 1,
                      s_daily: premiumInput,
                      date: new Date().toLocaleDateString("en-GB"),
                    },
                    true
                  );
                } else {
                  updateAchievements(
                    {
                      s_daily: premiumInput,
                      date: new Date().toLocaleDateString("en-GB"),
                    },
                    false
                  );
                }
              }}
              color={"#00bf63"}
              totalPremium={
                entries?.weekly_achieved?.totalPremiumWeekly?.toLocaleString() ||
                0
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default DailyActivity;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  video: {
    height: 300,
    width: "90%",
  },
});
