import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
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
import { Button } from "react-native-paper";

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
          {goal}%
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
          {achieved}%
        </Text>
      </View>
    </View>
  );
};

// const ImprovementPlan = ({ item }) => {
//   return (
//     <View
//       style={{
//         borderWidth: 2.5,
//         borderRadius: 5,
//         borderColor: "#b2b2b2",
//         backgroundColor: theme.colors.secondary,
//         marginHorizontal: 15,
//         marginVertical: 5,
//         paddingVertical: 15,
//         flexDirection: "row",
//         alignItems: "flex-start",
//         // flexWrap:"wrap",
//         maxWidth: "100%",
//         // width:"100%",
//       }}
//     >
//       <Entypo
//         name="triangle-right"
//         size={36}
//         color={theme.colors.background}
//         style={{ marginTop: -5 }}
//       />
//       <View style={{ alignItems: "flex-start", width: "85%" }}>
//         <Text
//           style={{
//             fontSize: 14,
//             color: "black",
//             fontWeight: "bold",
//             marginBottom: 5,
//           }}
//         >
//           {item.heading}
//         </Text>
//         <Text
//           style={{
//             fontSize: 12,
//             color: "black",
//             flexWrap: "wrap",
//           }}
//         >
//           {item.subheading}
//         </Text>
//       </View>
//     </View>
//   );
// };

const ImprovementPlan = ({ item, deletePlan }) => {
  const [expanded, setExpanded] = useState(false);

  // Toggle accordion state
  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={{
        borderWidth: 2.5,
        borderRadius: 5,
        borderColor: "#b2b2b2",
        backgroundColor: theme.colors.secondary,
        marginHorizontal: 15,
        marginVertical: 5,
        paddingVertical: 15,
        paddingHorizontal: 10,
      }}
    >
      {/* Touchable component for toggle */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          width: "100%",
        }}
        onPress={toggleAccordion}
        onLongPress={deletePlan}
        activeOpacity={0.7}
      >
        <Entypo
          name={expanded ? "triangle-down" : "triangle-right"}
          size={36}
          color={theme.colors.background}
          style={{ marginTop: -5 }}
        />
        <View style={{ flexShrink: 1, paddingLeft: 10 }}>
          <Text
            style={{
              fontSize: 14,
              color: "black",
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "black",
              flexWrap: "wrap",
            }}
          >
            {item.subTitle}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Render description conditionally based on expanded state */}
      {expanded && (
        <View style={{ marginTop: 10, paddingLeft: 36 }}>
          <Text
            style={{
              fontSize: 12,
              color: "black",
            }}
          >
            {item.description}
          </Text>
        </View>
      )}
    </View>
  );
};

const EffectivenessReport = () => {
  const entries = useSelector((state) => state.Entries);
  const navigation = useNavigation();
  const token = useSelector((state) => state.User?.token);
  const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);
  const [plans, setPlans] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");

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
          .get(`/improvementplan`)
          .then((res) => {
            setPlans(res.data.plans);
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

  const calculateSalesRatioGoal = (entries) => {
    const salesSubmitted = entries?.SuccessFormula?.salesSubmitted || 0;
    const appointmentsKept = entries?.SuccessFormula?.appointmentsKept || 0;

    return Math.floor((salesSubmitted / appointmentsKept) * 100) || 0;
  };

  const calculateSalesRatioAchieved = (entries) => {
    const yearlyAchievedA = entries?.yearly_achieved?.a_yearly;
    const yearlyAchievedS = entries?.yearly_achieved?.s_yearly;

    if (!yearlyAchievedA || !yearlyAchievedS) return 0;

    const SalesRatio = yearlyAchievedS / yearlyAchievedA;

    if (SalesRatio === 0 || isNaN(SalesRatio) || SalesRatio === Infinity) {
      return 0;
    }

    return Math.ceil(SalesRatio * 100);
  };

  const AddNewPlan = () => {
    setAddEventModalVisible(true);
  };

  const savePlan = () => {
    if (!title || !subTitle || !description) {
      return;
    }

    privateApi(token)
      .post(`/improvementplan`, { title, subTitle, description })
      .then((res) => {
        setPlans([...plans, res.data.plan]);
        // Close the modal
        setAddEventModalVisible(false);

        // Clear the input fields
        setTitle("");
        setSubTitle("");
        setDescription("");
      })
      .catch((err) => console.error(err));
  };

  const deletePlan = (id) => {
    // Show a confirmation alert to the user
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this improvement plan?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            // Proceed with the API call to delete the plan
            privateApi(token)
              .delete(`/improvementplan/${id}`)
              .then((res) => {
                // On success, filter out the deleted plan from the `plans` array
                setPlans((prevPlans) =>
                  prevPlans.filter((plan) => plan._id !== id)
                );
              })
              .catch((err) => console.error(err));
          },
        },
      ],
      { cancelable: false }
    );
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
            <MaterialCommunityIcons
              onPress={() => navigation.navigate("DailySchedule")}
              style={{ marginHorizontal: 3 }}
              name="calendar-month"
              size={27}
              color="white"
            />
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
              Math.floor(
                (entries?.SuccessFormula?.appointmentsKept /
                  entries?.SuccessFormula?.prospectingApproach) *
                  100
              ) || 0
            }
            achieved={Math.ceil(
              (entries?.yearly_achieved?.a_yearly /
                entries?.yearly_achieved?.p_yearly) *
                100 || 0
            )}
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
            Sales Ratio
          </Text>

          <Category
            goal={calculateSalesRatioGoal(entries)}
            achieved={calculateSalesRatioAchieved(entries)}
            backgroundColor={"#00bf63"}
          />
        </View>

        <View
          style={{
            backgroundColor: theme.colors.secondary,
            borderRadius: 5,
            paddingVertical: 10,
            marginTop: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                color: "black",
                textAlign: "center",
              }}
            >
              Improvement Plan
            </Text>
            <Ionicons
              onPress={AddNewPlan}
              name="add-circle-outline"
              size={30}
              color="black"
              // style={{ position: "absolute", right: 10, top: 5 }}
            />
          </View>
          <View>
            <FlatList
              data={plans}
              renderItem={({ item, index }) => (
                <ImprovementPlan
                  key={index}
                  item={item}
                  deletePlan={() => deletePlan(item._id)}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
      {loading && <Loader />}

      <Modal
        visible={isAddEventModalVisible}
        transparent={true}
        animationType="slide"
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"} enabled>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  placeholder="Plan Title"
                  multiline
                  numberOfLines={2}
                  maxLength={100}
                  value={title}
                  style={{
                    marginVertical: 5,
                    padding: "3%",
                    borderColor: "gray",
                    borderWidth: 1,
                    borderRadius: 5,
                    textAlignVertical: "top", // Ensure text starts from top-left corner
                  }}
                  onChangeText={setTitle}
                />
                <TextInput
                  placeholder="Plan Sub Title"
                  multiline
                  numberOfLines={2}
                  maxLength={100}
                  value={subTitle}
                  style={{
                    marginVertical: 5,
                    padding: "3%",

                    borderColor: "gray",
                    borderWidth: 1,
                    borderRadius: 5,
                    textAlignVertical: "top", // Ensure text starts from top-left corner
                  }}
                  onChangeText={setSubTitle}
                />
                <TextInput
                  placeholder="Plan Description"
                  value={description}
                  multiline
                  numberOfLines={5}
                  maxLength={300}
                  style={{
                    marginVertical: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    borderColor: "gray",
                    borderWidth: 1,
                    borderRadius: 5,
                    textAlignVertical: "top", // Ensure text starts from top-left corner
                  }}
                  onChangeText={setDescription}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 15,
                  }}
                >
                  <Button
                    mode="contained"
                    onPress={savePlan}
                    buttonColor="green"
                  >
                    Save Plan
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setAddEventModalVisible(false);
                      setTitle("");
                      setSubTitle("");
                      setDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 10,
  },
});
