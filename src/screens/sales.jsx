import {
  Image,
  KeyboardAvoidingView,
  Platform,
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

const Sales = ({ navigation }) => {
  const token = useSelector((state) => state.User?.token);
  const entries = useSelector((state) => state.Entries);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    salesTargets: "",
    averageCaseSize: "",
    numberOfWeeks: "",
    prospectingApproach: "",
    appointmentsKept: "",
    salesSubmitted: "",
  });

  const [formErrors, setFormErrors] = useState({
    salesTargetsError: false,
    averageCaseSizeError: false,
    numberOfWeeksError: false,
    prospectingApproachError: false,
    appointmentsKeptError: false,
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
      salesSubmitted: formData.salesSubmitted === "",
    };

    setFormErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    return !hasError;
  };

  const saveEntries = () => {
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
    }
  };

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

          <View
            style={{
              marginTop: 30,
              justifyContent: "space-between",
            }}
          >
            <LeapTextInput
              label="Annual Sales Targets $ "
              value={Number(formData.salesTargets).toLocaleString()}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange("salesTargets", text)}
              isError={formErrors.salesTargetsError}
            />
            <LeapTextInput
              label={"Average Case Size $ "}
              value={Number(formData.averageCaseSize).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.averageCaseSizeError}
              onChangeText={(text) =>
                handleInputChange("averageCaseSize", text)
              }
            />
            <LeapTextInput
              label="# of Weeks "
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
              My Success Formula
            </Text>

            <LeapTextInput
              label={"# Prospecting Approach"}
              value={Number(formData.prospectingApproach).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.prospectingApproachError}
              onChangeText={(text) =>
                handleInputChange("prospectingApproach", text)
              }
            />
            <LeapTextInput
              label="# Appointments Kept"
              value={Number(formData.appointmentsKept).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.appointmentsKeptError}
              onChangeText={(text) =>
                handleInputChange("appointmentsKept", text)
              }
            />
            <LeapTextInput
              label={"# Sales Submitted"}
              value={Number(formData.salesSubmitted).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.salesSubmittedError}
              onChangeText={(text) => handleInputChange("salesSubmitted", text)}
            />

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
