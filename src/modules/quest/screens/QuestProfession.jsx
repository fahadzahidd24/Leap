import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "../../../constants/theme";
import { roles } from "../constants/roles";
import { privateApi } from "../../../api/axios";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getModuleConfig, MODULE_KEYS } from "../../../constants/moduleConfig";

const QuestProfession = ({ navigation }) => {
  const token = useSelector((state) => state.User?.token);
  const [selectedProfession, setSelectedProfession] = useState("");
  const moduleConfig = getModuleConfig(MODULE_KEYS.QUEST);

  useEffect(() => {
    const getProfession = async () => {
      const prof = await AsyncStorage.getItem("profession");
      setSelectedProfession(prof);
    };
    getProfession();
  }, []);

  const [loading, setLoading] = useState(false);

  const changeProfession = async (name) => {
    setSelectedProfession(name);
    setLoading(true);

    try {
      const response = await privateApi(token).post("/set-profession", {
        profession: name,
      });
      const user = response.data.user;
      await AsyncStorage.setItem("profession", user.profession);
      navigation.navigate("ChatCoach");
    } catch (error) {
      console.error("Failed to set profession:", error);
      Alert.alert("Error", "Failed to set profession. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#3f8e9c" }}
      behavior={Platform.OS === "ios" ? "padding" : "null"}
      enabled
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          width: "100%",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        bounces={false}
      >
        {loading && <Loader />}
        <View>
          <Image
            source={moduleConfig.assets.logo}
            style={{ alignSelf: "center", height: 200, resizeMode: "contain" }}
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: 28,
              fontWeight: "300",
              marginTop: 5,
              color: theme.colors.secondary,
            }}
          >
            My Recruiting Coach
          </Text>
        </View>

        <View style={{ width: "80%", marginVertical: "5%" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: "800",
              marginTop: 5,
              color: "#f6c50e",
            }}
          >
            Let Us Find The Right Coach For You
          </Text>
        </View>
        <View style={{ width: "80%", marginVertical: "5%" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "600",
              marginTop: 5,
              color: "#f6c50e",
            }}
          >
            What is your profession?
          </Text>
        </View>

        <View
          style={{ width: "100%", alignItems: "center", marginBottom: "10%" }}
        >
          {roles.map((role) => (
            <Pressable
              key={role.id}
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 30,
                width: "90%",
                marginVertical: "3%",
                borderWidth: selectedProfession === role.name ? 7 : 0,
                borderColor:
                  selectedProfession === role.name ? "#f9a200" : "#fff",
              }}
              onPress={() => changeProfession(role.name)}
            >
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "300",
                    color: "#000",
                  }}
                >
                  {role.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default QuestProfession;

const styles = StyleSheet.create({});
