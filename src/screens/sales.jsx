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
import React, { useEffect, useState } from "react";
import { theme } from "../constants/theme";
import LeapTextInput from "../components/LeapTextInput";
import { privateApi } from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-paper";
import { setEntries } from "../redux/features/entriesSlice";
import { isEmpty } from "../utils/isEmpty";
import Loader from "../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getModuleConfig } from "../constants/moduleConfig";

const Sales = ({ navigation }) => {
  const token = useSelector((state) => state.User?.token);
  const user = useSelector((state) => state.User);
  const entries = useSelector((state) => state.Entries);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const dispatch = useDispatch();
  const moduleConfig = getModuleConfig(selectedModule);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [selectedDays, setSelectedDays] = useState([]);

  const [formData, setFormData] = useState({
    salesTargets: "",
    averageCaseSize: "",
    numberOfWeeks: "",
    prospectingApproach: "",
    appointmentsKept: "",
    presentationsHeld:"",
    salesSubmitted: "",
  });

  const [formErrors, setFormErrors] = useState({
    salesTargetsError: false,
    averageCaseSizeError: false,
    numberOfWeeksError: false,
    prospectingApproachError: false,
    appointmentsKeptError: false,
    presentationsHeldError: false,
    salesSubmittedError: false,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    // Remove any commas or non-numeric characters except the decimal point
    const numericValue = value.replace(/,/g, "");
    // Check if the resulting value is a valid number
    if (!isNaN(numericValue) && numericValue !== "") {
      // Update the formData state with the numeric value
      setFormData((prevData) => ({
        ...prevData,
        [name]: Number(numericValue),
      }));
    } else if (numericValue === "") {
      // Handle the case where the input is cleared
      setFormData((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    if (entries) {
      setFormData({
        salesTargets: entries?.SalesTargets?.salesTargets || "",
        averageCaseSize: entries?.SalesTargets?.averageCaseSize || "",
        numberOfWeeks: entries?.SalesTargets?.numberOfWeeks || "",
        prospectingApproach: entries?.SuccessFormula?.prospectingApproach || "",
        appointmentsKept: entries?.SuccessFormula?.appointmentsKept || "",
        presentationsHeld: entries?.SuccessFormula?.presentationsHeld || "",
        salesSubmitted: entries?.SuccessFormula?.salesSubmitted || "",
      });
    }
  }, [entries]);

  const validateData = () => {
    const newErrors = {
      salesTargets: formData.salesTargets === "",
      averageCaseSize: formData.averageCaseSize === "",
      numberOfWeeks: formData.numberOfWeeks === "",
      prospectingApproach: formData.prospectingApproach === "",
      appointmentsKept: formData.appointmentsKept === "",
      presentationsHeld: formData.presentationsHeld === "",
      salesSubmitted: formData.salesSubmitted === "",
    };

    setFormErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    return !hasError;
  };

  const saveEntries = async () => {
    if (selectedDays.length === 0) {
      Alert.alert(
        "Please Select Your Working Days.",
        "",
        [{ text: "OK", onPress: () => setShowAlert(false) }],
        { cancelable: false }
      );
      return;
    }
    if (validateData()) {
      setLoading(true);

      if (entries?.SalesTargets?.averageCaseSize) {
        privateApi(token)
          .put("/entries", {
            salesTargets: formData.salesTargets,
            averageCaseSize: formData.averageCaseSize,
            numberOfWeeks: formData.numberOfWeeks,
            prospectingApproach: formData.prospectingApproach,
            appointmentsKept: formData.appointmentsKept,
            presentationsHeld: formData.presentationsHeld,
            salesSubmitted: formData.salesSubmitted,
          })
          .then((res) => {
            dispatch(setEntries({ entries: res.data.entries }));
            navigation.navigate("tabs");
            // router.push("/(app)/(sales)/(tabs)");
          })
          .catch((err) => console.error("put", err))
          .finally(() => setLoading(false));
      } else {
        privateApi(token)
          .post("/entries", {
            salesTargets: formData.salesTargets,
            averageCaseSize: formData.averageCaseSize,
            numberOfWeeks: formData.numberOfWeeks,
            prospectingApproach: formData.prospectingApproach,
            appointmentsKept: formData.appointmentsKept,
            presentationsHeld: formData.presentationsHeld,
            salesSubmitted: formData.salesSubmitted,
          })
          .then((res) => {
            dispatch(setEntries({ entries: res.data.entries }));
            // router.push("/(app)/(sales)/(tabs)");
            navigation.navigate("tabs");
          })
          .catch((err) => console.error("post", err.response.data))
          .finally(() => setLoading(false));
      }
      // Save selected days to AsyncStorage
      await AsyncStorage.setItem(`${user?._id}_working_days`, JSON.stringify(selectedDays));
      
    }
  };

  const handleDayPress = (day) => {
    if (selectedDays?.includes(day)) {
      setSelectedDays(selectedDays?.filter((d) => d !== day));

    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  useEffect(() => {
    console.log("fetching working days", `${user?._id}_working_days`);
    const fetchWorkingDays = async () => {
      try {
        const workingDays = await AsyncStorage.getItem(`${user?._id}_working_days`);
        console.log("workingDays", workingDays);
        if (workingDays) {
          setSelectedDays(JSON.parse(workingDays));
        }
      } catch (error) {
        console.error("Error fetching working days:", error);
      }
    }
    fetchWorkingDays();
  }, []);
    

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
            paddingBottom: 50,
            paddingHorizontal: 10,
            flexGrow: 1,
            // backgroundColor: "yellow",
          }}
          bounces={false}
          style={styles.scrollViewStyle}
        >
          <Image
            source={moduleConfig.assets.logo}
            style={{ alignSelf: "center", width: 220, height: 220 }}
          />

          {/* <Text
            style={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: "300",
              marginTop: 25,
              color: theme.colors.secondary,
            }}
          >
            My Sales Coach
          </Text> */}

          <View
            style={{
              marginTop: 30,
              justifyContent: "space-between",
            }}
          >
            <LeapTextInput
              label="Annual Sales Targets ($) "
              value={Number(formData.salesTargets).toLocaleString()}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange("salesTargets", text)}
              isError={formErrors.salesTargetsError}
            />
            <LeapTextInput
              label={"Average Case Size ($) "}
              value={Number(formData.averageCaseSize).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.averageCaseSizeError}
              onChangeText={(text) =>
                handleInputChange("averageCaseSize", text)
              }
            />
            <LeapTextInput
              label="# of Business Weeks "
              value={Number(formData.numberOfWeeks).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.numberOfWeeksError}
              onChangeText={(text) => handleInputChange("numberOfWeeks", text)}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 28,
                fontWeight: "300",
                marginTop: 25,
                color: "#e8bf27",
              }}
            >
              My Weekly Success Formula
            </Text>

            <LeapTextInput
              label={"# Prospecting (Call/Direct Approach)"}
              value={Number(formData.prospectingApproach).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.prospectingApproachError}
              onChangeText={(text) =>
                handleInputChange("prospectingApproach", text)
              }
            />
            <LeapTextInput
              label="# Appointment Secured"
              value={Number(formData.appointmentsKept).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.appointmentsKeptError}
              onChangeText={(text) =>
                handleInputChange("appointmentsKept", text)
              }
            />
            <LeapTextInput
              label="# Presentation Made"
              value={Number(formData.presentationsHeld).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.presentationsHeldError}
              onChangeText={(text) =>
                handleInputChange("presentationsHeld", text)
              }
            />
            <LeapTextInput
              label={"# Sales Closed"}
              value={Number(formData.salesSubmitted).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.salesSubmittedError}
              onChangeText={(text) => handleInputChange("salesSubmitted", text)}
            />

            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "500",
                marginTop: 30,
                color: theme.colors.secondary,
                marginBottom: 10,
              }}
            >
              Select Your Working Days in a Week
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
            >
              {days.map((day, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleDayPress(day)}
                  style={{
                    width: "28%",
                    marginVertical: 8,
                    marginHorizontal: "2%",
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    alignItems: "center",
                    backgroundColor: selectedDays?.includes(day)
                      ? "#ff914d"
                      : "transparent",
                    borderColor: selectedDays?.includes(day)
                      ? "#ff914d"
                      : "#ff914d",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.15,
                    shadowRadius: 1.41,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      color: selectedDays?.includes(day) ? "#fff" : "#ccc",
                      fontWeight: "500",
                    }}
                  >
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Button
              loading={loading}
              labelStyle={{
                fontSize: 17,
                fontFamily: "",
              }}
              textColor="#FFFFFF"
              mode="contained"
              style={{
                borderRadius: 35,
                paddingVertical: 6,
                marginTop: 30,
                backgroundColor: "#ff914d",
              }}
              onPress={saveEntries}
            >
              Save
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {showAlert && (
        <AlertMessage
          message={errorMessage}
          onPressOk={() => setShowAlert(false)}
        />
      )}
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default Sales;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scrollViewStyle: {
    padding: 15,
  },
});
