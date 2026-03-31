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
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { theme } from "../../../constants/theme";
import LeapTextInput from "../../../components/LeapTextInput";
import { privateApi } from "../../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-paper";
import { setEntries } from "../../../redux/features/entriesSlice";
import { isEmpty } from "../../../utils/isEmpty";
import Loader from "../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getModuleConfig, MODULE_KEYS } from "../../../constants/moduleConfig";

const compactLabelStyle = { fontSize: 14 };

const QuestLabelInput = (props) => (
  <LeapTextInput {...props} labelStyle={compactLabelStyle} />
);

const Sales = ({ navigation }) => {
  const moduleConfig = getModuleConfig(MODULE_KEYS.QUEST);
  const token = useSelector((state) => state.User?.token);
  const user = useSelector((state) => state.User);
  const entries = useSelector((state) => state.Entries);
  const dispatch = useDispatch();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [selectedDays, setSelectedDays] = useState([]);

  const [formData, setFormData] = useState({
    annualProductionGoal: "", //a
    totalCurrentNumberOfActiveAgents: "", //b
    avgProductionPerActiveAgent: "", //c
    avgProductionPerNewAgent: "", //e
    // totalNumberOfNewAgents: "",
    // sixMonthSurvivalRate: "",
    numberOfWeeks: "",
    prospectingApproach: "",
    appointmentsKept: "",
    presentationsHeld: "",
    contractsSigned: "",
  });

  const [formData2, setFormData2] = useState({
    jan: "0",
    feb: "0",
    mar: "0",
    apr: "0",
    may: "0",
    jun: "0",
    jul: "0",
    aug: "0",
    sep: "0",
    oct: "0",
    nov: "0",
    dec: "0",
  });

  let productionFromExistingAgents = +(
    Number(formData.totalCurrentNumberOfActiveAgents || 0) *
    Number(formData.avgProductionPerActiveAgent || 0)
  ); //d

  let productionFromNewAgents = +(
    Number(formData.annualProductionGoal || 0) -
    Number(productionFromExistingAgents || 0)
  ); //f

  let newNumberOfAgentSurvivorsNeeded = +(
    Number(productionFromNewAgents || 0) /
    Number(formData.avgProductionPerNewAgent || 0)
  ); //g

  let sixMonthSurvivalRate = +(
    Number(newNumberOfAgentSurvivorsNeeded || 0) / 0.5
  ); //h

  // let sixMonthSurvivalRateTemp = sixMonthSurvivalRate;

  // useEffect(()=> {
  //   const formData2KeysSum = Object.values(formData2).reduce((acc, val) => acc + Number(val), 0)
  //   if(formData2KeysSum > sixMonthSurvivalRateTemp) {
  //     console.log("YESSS!!!!")
  //     sixMonthSurvivalRateTemp = formData2KeysSum;
  //   }
  // }, [formData2])
  
  // console.log("sixMonthSurvivalRateTemp >>", sixMonthSurvivalRateTemp)

  const formData2KeysSum = useMemo(() => {
    return Object.values(formData2).reduce((acc, val) => acc + Number(val), 0);
  }, [formData2]);

  const sixMonthSurvivalRateTemp = useMemo(() => {
    return formData2KeysSum;
  }, [formData2KeysSum, sixMonthSurvivalRate]);

  console.log("sixMonthSurvivalRateTemp >>", sixMonthSurvivalRateTemp)
  

  const [formErrors, setFormErrors] = useState({
    annualProductionGoal: false,
    totalCurrentNumberOfActiveAgents: false,
    avgProductionPerActiveAgent: false,
    avgProductionPerNewAgent: false,
    totalNumberOfNewAgents: false,
    sixMonthSurvivalRate: false,
    numberOfWeeks: false,
    prospectingApproach: false,
    appointmentsKept: false,
    presentationsHeld: false,
    contractsSigned: false,
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

  const handleInputChange2 = (name, value) => {
    // Remove any commas or non-numeric characters except the decimal point
    const numericValue = value.replace(/,/g, "");
    // Check if the resulting value is a valid number
    if (!isNaN(numericValue) && numericValue !== "") {
      // Update the formData state with the numeric value
      setFormData2((prevData) => ({
        ...prevData,
        [name]: Number(numericValue),
      }));
    } else if (numericValue === "") {
      // Handle the case where the input is cleared
      setFormData2((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    if (entries) {
      console.log("entries", entries);
      setFormData({
        annualProductionGoal:
          entries?.RecruitmentsTargets?.annualProductionGoal || "",
        avgProductionPerActiveAgent:
          entries?.RecruitmentsTargets?.avgProductionPerActiveAgent || "",
        avgProductionPerNewAgent:
          entries?.RecruitmentsTargets?.avgProductionPerNewAgent || "",
        totalCurrentNumberOfActiveAgents:
          entries?.RecruitmentsTargets?.totalCurrentNumberOfActiveAgents || "",
        totalNumberOfNewAgents:
          entries?.RecruitmentsTargets?.totalNumberOfNewAgents || "",
        sixMonthSurvivalRate:
          entries?.RecruitmentsTargets?.sixMonthSurvivalRate || "",
        numberOfWeeks: entries?.RecruitmentsTargets?.numberOfWeeks || "",
        prospectingApproach: entries?.SuccessFormula?.prospectingApproach || "",
        appointmentsKept: entries?.SuccessFormula?.appointmentsKept || "",
        presentationsHeld: entries?.SuccessFormula?.presentationsHeld || "",
        contractsSigned: entries?.SuccessFormula?.contractsSigned || "",
      });
      setFormData2({
        jan: entries?.RecruitmentsTargets?.jan || "0",
        feb: entries?.RecruitmentsTargets?.feb || "0",
        mar: entries?.RecruitmentsTargets?.mar || "0",
        apr: entries?.RecruitmentsTargets?.apr || "0",
        may: entries?.RecruitmentsTargets?.may || "0",
        jun: entries?.RecruitmentsTargets?.jun || "0",
        jul: entries?.RecruitmentsTargets?.jul || "0",
        aug: entries?.RecruitmentsTargets?.aug || "0",
        sep: entries?.RecruitmentsTargets?.sep || "0",
        oct: entries?.RecruitmentsTargets?.oct || "0",
        nov: entries?.RecruitmentsTargets?.nov || "0",
        dec: entries?.RecruitmentsTargets?.dec || "0",
      })
    }
  }, [entries]);

  const validateData = () => {
    const newErrors = {
      annualProductionGoal: formData.annualProductionGoal === "",
      totalCurrentNumberOfActiveAgents:
        formData.totalCurrentNumberOfActiveAgents === "",
      avgProductionPerActiveAgent: formData.avgProductionPerActiveAgent === "",
      avgProductionPerNewAgent: formData.avgProductionPerNewAgent === "",
      totalNumberOfNewAgents: newNumberOfAgentSurvivorsNeeded === "",
      sixMonthSurvivalRate: sixMonthSurvivalRate === "",
      numberOfWeeks: formData.numberOfWeeks === "",
      prospectingApproach: formData.prospectingApproach === "",
      appointmentsKept: formData.appointmentsKept === "",
      presentationsHeld: formData.presentationsHeld === "",
      contractsSigned: formData.contractsSigned === "",
    };

    // if sum of all formData2 keys is less than sixMonthSurvivalRate
    if (formData2KeysSum < sixMonthSurvivalRate) {
      // newErrors.sixMonthSurvivalRate = true;
      return Alert.alert(
        "Recruiting Target cannot be less than the 50% Six-Month Survival Rate. Please fill in the yellow boxes"
      );
    }

    setFormErrors(newErrors);

    console.log("formErrors", newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    if (hasError) {
      Alert.alert("Please fill all the fields.");
    }
    return !hasError;
  };

  console.log("sixMonthSurvivalRateTemp >>><><><>", sixMonthSurvivalRateTemp);

  const saveEntries = async () => {
    // if (selectedDays.length === 0) {
    //   Alert.alert(
    //     "Please Select Your Working Days.",
    //     "",
    //     [{ text: "OK", onPress: () => setShowAlert(false) }],
    //     { cancelable: false }
    //   );
    //   return;
    // }
    if (validateData()) {
      setLoading(true);

      if (entries?.RecruitmentsTargets?.annualProductionGoal) {
        privateApi(token)
          .put("/entries", {
            annualProductionGoal: formData.annualProductionGoal,
            totalCurrentNumberOfActiveAgents:
              formData.totalCurrentNumberOfActiveAgents,
            avgProductionPerActiveAgent: formData.avgProductionPerActiveAgent,
            avgProductionPerNewAgent: formData.avgProductionPerNewAgent,
            totalNumberOfNewAgents: newNumberOfAgentSurvivorsNeeded,
            sixMonthSurvivalRate: sixMonthSurvivalRate,
            numberOfWeeks: formData.numberOfWeeks,
            prospectingApproach: formData.prospectingApproach,
            appointmentsKept: formData.appointmentsKept,
            presentationsHeld: formData.presentationsHeld,
            contractsSigned: formData.contractsSigned,
            finalRecruitmentRate: sixMonthSurvivalRateTemp,
            jan: formData2.jan,
            feb: formData2.feb,
            mar: formData2.mar,
            apr: formData2.apr,
            may: formData2.may,
            jun: formData2.jun,
            jul: formData2.jul,
            aug: formData2.aug,
            sep: formData2.sep,
            oct: formData2.oct,
            nov: formData2.nov,
            dec: formData2.dec,
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
            annualProductionGoal: formData.annualProductionGoal,
            totalCurrentNumberOfActiveAgents:
              formData.totalCurrentNumberOfActiveAgents,
            avgProductionPerActiveAgent: formData.avgProductionPerActiveAgent,
            avgProductionPerNewAgent: formData.avgProductionPerNewAgent,
            totalNumberOfNewAgents: newNumberOfAgentSurvivorsNeeded,
            sixMonthSurvivalRate: sixMonthSurvivalRate,
            numberOfWeeks: formData.numberOfWeeks,
            prospectingApproach: formData.prospectingApproach,
            appointmentsKept: formData.appointmentsKept,
            presentationsHeld: formData.presentationsHeld,
            contractsSigned: formData.contractsSigned,
            finalRecruitmentRate: sixMonthSurvivalRateTemp,
            jan: formData2.jan,
            feb: formData2.feb,
            mar: formData2.mar,
            apr: formData2.apr,
            may: formData2.may,
            jun: formData2.jun,
            jul: formData2.jul,
            aug: formData2.aug,
            sep: formData2.sep,
            oct: formData2.oct,
            nov: formData2.nov,
            dec: formData2.dec,
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
      await AsyncStorage.setItem(
        `${user?._id}_working_days`,
        JSON.stringify(selectedDays)
      );
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
        const workingDays = await AsyncStorage.getItem(
          `${user?._id}_working_days`
        );
        console.log("workingDays", workingDays);
        if (workingDays) {
          setSelectedDays(JSON.parse(workingDays));
        }
      } catch (error) {
        console.error("Error fetching working days:", error);
      }
    };
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
          backgroundColor={"#3f8e9c"}
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
            source={require("../../../../assets/quest/logo.png")}
            style={{
              alignSelf: "center",
              width: "100%",
              height: 150,
              resizeMode: "contain",
            }}
          />

          <Text
            style={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: "300",
              // marginTop: 25,
              color: theme.colors.secondary,
            }}
          >
            My Recruiting Coach
          </Text>

          <View
            style={{
              marginTop: 30,
              justifyContent: "space-between",
            }}
          >
            <QuestLabelInput
              label="Annual Production Goal $"
              value={Number(formData.annualProductionGoal).toLocaleString()}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleInputChange("annualProductionGoal", text)
              }
              isError={formErrors.annualProductionGoal}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 28,
                fontWeight: "300",
                color: "#e8bf27",
              }}
            >
              Active Agent
            </Text>
            <QuestLabelInput
              label={"Total Current Number of Active Agents"}
              value={Number(
                formData.totalCurrentNumberOfActiveAgents
              ).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.totalCurrentNumberOfActiveAgents}
              onChangeText={(text) =>
                handleInputChange("totalCurrentNumberOfActiveAgents", text)
              }
            />
            <QuestLabelInput
              label="Average Production Per Active Agent $"
              value={Number(
                formData.avgProductionPerActiveAgent
              ).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.avgProductionPerActiveAgent}
              onChangeText={(text) =>
                handleInputChange("avgProductionPerActiveAgent", text)
              }
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 28,
                fontWeight: "300",
                color: "#e8bf27",
              }}
            >
              New Agent
            </Text>
            <QuestLabelInput
              label="Average Production Per New Agent $"
              value={Number(formData.avgProductionPerNewAgent).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.avgProductionPerNewAgent}
              onChangeText={(text) =>
                handleInputChange("avgProductionPerNewAgent", text)
              }
            />
            <QuestLabelInput
              label="Total Number of New Agent"
              value={(Math.ceil(Number(newNumberOfAgentSurvivorsNeeded)))?.toLocaleString()}
              keyboardType="numeric"
              // isError={formErrors.totalNumberOfNewAgents}
              isDisabled={true}
              // onChangeText={(text) =>
              //   handleInputChange("totalNumberOfNewAgents", text)
              // }
            />
            <QuestLabelInput
              label="50% Six-Month Survival Rate"
              value={(Math.ceil(Number(sixMonthSurvivalRate)))?.toLocaleString()}
              keyboardType="numeric"
              // isError={formErrors.sixMonthSurvivalRate}
              isDisabled={true}
              // onChangeText={(text) =>
              //   handleInputChange("sixMonthSurvivalRate", text)
              // }
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 28,
                fontWeight: "300",
                color: "#e8bf27",
              }}
            >
              Recruiting Targets
            </Text>

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                borderRadius: 35,
                padding: 10,
                alignItems: "center",
                marginTop: 20,
                justifyContent: "space-between",
              }}
            >
              {/* color like placeholder  */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "300",
                  color: "#8e8e8e",
                  maxWidth: "70%",
                }}
              >
                Annual Recruitment Target
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "300",
                  color: "#000",
                  paddingRight: 10,
                }}
              >
                {(Math.ceil(Number(sixMonthSurvivalRateTemp)))?.toLocaleString()}
              </Text>
            </View>

            <View style={{ width: "100%" }}>
              {/* months row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                  gap: 5,
                }}
              >
                <View
                  style={{
                    width: "70%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      JAN
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.jan).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("jan", text)}
                    />
                  </View>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      FEB
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.feb).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("feb", text)}
                    />
                  </View>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      MAR
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.mar).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("mar", text)}
                    />
                  </View>
                </View>
                <View style={{ width: "30%" }}>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Q1 Total
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      {(
                        Number(formData2?.jan) +
                        Number(formData2?.feb) +
                        Number(formData2?.mar)
                      ).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* second row  */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                  gap: 5,
                }}
              >
                <View
                  style={{
                    width: "70%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      APR
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.apr).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("apr", text)}
                    />
                  </View>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      MAY
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.may).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("may", text)}
                    />
                  </View>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      JUN
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.jun).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("jun", text)}
                    />
                  </View>
                </View>
                <View style={{ width: "30%" }}>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Q2 Total
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      {(
                        Number(formData2?.apr) +
                        Number(formData2?.may) +
                        Number(formData2?.jun)
                      ).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
              {/* third row  */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                  gap: 5,
                }}
              >
                <View
                  style={{
                    width: "70%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      JUL
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.jul).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("jul", text)}
                    />
                  </View>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      AUG
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.aug).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("aug", text)}
                    />
                  </View>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      SEP
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.sep).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("sep", text)}
                    />
                  </View>
                </View>
                <View style={{ width: "30%" }}>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Q3 Total
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      {(
                        Number(formData2?.jul) +
                        Number(formData2?.aug) +
                        Number(formData2?.sep)
                      ).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
              {/* fourth row  */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                  gap: 5,
                }}
              >
                <View
                  style={{
                    width: "70%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      OCT
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.oct).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("oct", text)}
                    />
                  </View>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      NOV
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.nov).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("nov", text)}
                    />
                  </View>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      DEC
                    </Text>
                    <TextInput
                      mode="flat"
                      multiline={false}
                      numberOfLines={1}
                      secureTextEntry={false}
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      value={Number(formData2.dec).toLocaleString()}
                      onChangeText={(text) => handleInputChange2("dec", text)}
                    />
                  </View>
                </View>
                <View style={{ width: "30%" }}>
                  <View
                    style={{
                      minWidth: "20%",
                      backgroundColor: "#fcce56",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Q4 Total
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      {(
                        Number(formData2?.oct) +
                        Number(formData2?.nov) +
                        Number(formData2?.dec)
                      ).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <QuestLabelInput
              label="Number of Weeks"
              value={Number(formData.numberOfWeeks).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.numberOfWeeks}
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

            <QuestLabelInput
              label={"Prospects Contacted"}
              value={Number(formData.prospectingApproach).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.prospectingApproach}
              onChangeText={(text) =>
                handleInputChange("prospectingApproach", text)
              }
            />
            <QuestLabelInput
              label="Appointments Secured"
              value={Number(formData.appointmentsKept).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.appointmentsKept}
              onChangeText={(text) =>
                handleInputChange("appointmentsKept", text)
              }
            />
            <QuestLabelInput
              label="Presentations Held"
              value={Number(formData.presentationsHeld).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.presentationsHeld}
              onChangeText={(text) =>
                handleInputChange("presentationsHeld", text)
              }
            />
            <QuestLabelInput
              label={"Contracts Signed"}
              value={Number(formData.contractsSigned).toLocaleString()}
              keyboardType="numeric"
              isError={formErrors.contractsSigned}
              onChangeText={(text) =>
                handleInputChange("contractsSigned", text)
              }
            />

            {/* <Text
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
            </View> */}

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
    backgroundColor: "#3f8e9c",
    flex: 1,
  },
  scrollViewStyle: {
    padding: 15,
  },
});
