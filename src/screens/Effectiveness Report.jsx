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
  Entypo,
  MaterialCommunityIcons,
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
import { Button } from "react-native-paper";
import { getModuleConfig } from "../constants/moduleConfig";

const Category = ({
  goal,
  achieved,
  text,
  backgroundColor,
  goalImage,
  achievedImage,
}) => {
  return (
    <View
      style={{
        backgroundColor,
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
          {formatPercentage(achieved)}
        </Text>
      </View>
    </View>
  );
};

const ImprovementPlan = ({ item, deletePlan }) => {
  const [expanded, setExpanded] = useState(false);

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
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          width: "100%",
        }}
        onPress={() => setExpanded((prev) => !prev)}
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
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const navigation = useNavigation();
  const token = useSelector((state) => state.User?.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);
  const [plans, setPlans] = useState([]);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const moduleConfig = getModuleConfig(selectedModule);

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
          .get(`/pas/weekly?date=${getMalaysianDateString()}`)
          .then((res) => {
            dispatch(setWeeklyAchieved({ weekly: res.data.pas }));
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [dispatch, token])
  );

  const calculateSalesRatioGoal = (currentEntries) => {
    const salesSubmitted = currentEntries?.SuccessFormula?.salesSubmitted || 0;
    const presentationsHeld =
      currentEntries?.SuccessFormula?.presentationsHeld || 0;

    return (salesSubmitted / presentationsHeld) * 100;
  };

  const calculateSalesRatioAchieved = (currentEntries) => {
    const yearlyAchievedPR = currentEntries?.yearly_achieved?.pr_yearly || 0;
    const yearlyAchievedS = currentEntries?.yearly_achieved?.s_yearly || 0;

    return (yearlyAchievedS / yearlyAchievedPR) * 100;
  };

  const calculatePresentationRatioGoal = (currentEntries) => {
    const presentationsHeld =
      currentEntries?.SuccessFormula?.presentationsHeld || 0;
    const appointmentsKept =
      currentEntries?.SuccessFormula?.appointmentsKept || 0;

    return (presentationsHeld / appointmentsKept) * 100;
  };

  const calculatePresentationRatioAchieved = (currentEntries) => {
    const yearlyAchievedA = currentEntries?.yearly_achieved?.a_yearly || 0;
    const yearlyAchievedPR = currentEntries?.yearly_achieved?.pr_yearly || 0;

    return (yearlyAchievedPR / yearlyAchievedA) * 100;
  };

  const savePlan = () => {
    if (!title || !subTitle || !description) {
      return;
    }

    privateApi(token)
      .post(`/improvementplan`, { title, subTitle, description })
      .then((res) => {
        setPlans((prevPlans) => [...prevPlans, res.data.plan]);
        setAddEventModalVisible(false);
        setTitle("");
        setSubTitle("");
        setDescription("");
      })
      .catch((err) => console.error(err));
  };

  const deletePlan = (id) => {
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
            privateApi(token)
              .delete(`/improvementplan/${id}`)
              .then(() => {
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

  const closeAddPlanModal = () => {
    setAddEventModalVisible(false);
    setTitle("");
    setSubTitle("");
    setDescription("");
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
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 26,
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
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
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
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Text
            style={{
              fontSize: 21,
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
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />

          <Text
            style={{
              fontSize: 21,
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
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
          />

          <Text
            style={{
              fontSize: 21,
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
            goalImage={moduleConfig.assets.goal}
            achievedImage={moduleConfig.assets.achieved}
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
              onPress={() => setAddEventModalVisible(true)}
              name="add-circle-outline"
              size={30}
              color="black"
            />
          </View>
          <View>
            <FlatList
              data={plans}
              keyExtractor={(item, index) => item?._id || index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ImprovementPlan
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
                  style={styles.textInput}
                  onChangeText={setTitle}
                />
                <TextInput
                  placeholder="Plan Sub Title"
                  multiline
                  numberOfLines={2}
                  maxLength={100}
                  value={subTitle}
                  style={styles.textInput}
                  onChangeText={setSubTitle}
                />
                <TextInput
                  placeholder="Plan Description"
                  value={description}
                  multiline
                  numberOfLines={5}
                  maxLength={300}
                  style={styles.descriptionInput}
                  onChangeText={setDescription}
                />

                <View style={styles.modalActions}>
                  <Button
                    mode="contained"
                    onPress={savePlan}
                    buttonColor="green"
                  >
                    Save Plan
                  </Button>
                  <Button mode="outlined" onPress={closeAddPlanModal}>
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
  textInput: {
    marginVertical: 5,
    padding: "3%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  descriptionInput: {
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
