import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { privateApi } from "../api/axios";
import { theme } from "../constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Loader from "../components/Loader";
import { useFocusEffect } from "@react-navigation/native";

const MyAgents = ({ navigation }) => {
  const { token, _id } = useSelector((state) => state.User);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        privateApi(token)
          .get(`/agents`)
          .then((res) => {
            setAgents(res.data);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [token])
  );

  const AgentComponent = ({ navigation, id, fullName, email }) => {
    return (
      <View style={styles.inboxContainer}>
        <View style={styles.leftSideView}>
          <View>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.message}>{email}</Text>
          </View>
        </View>

        <View style={styles.rightSideView}>
          {/* <EvilIcons
            name="calendar"
            size={38}
            color="black"
            style={{ marginHorizontal: 6 }}
            onPress={() =>
              navigation.navigate("DailySchedule1", {
                userId: id,
              })
            }
          /> */}

          <MaterialCommunityIcons
            onPress={() =>
              navigation.navigate("DailySchedule1", {
                userId: id,
              })
            }
            style={{ marginHorizontal: 6 }}
            name="calendar-month"
            size={30}
            color="black"
          />

          <AntDesign
            name="message1"
            size={26}
            color="black"
            onPress={() =>
              navigation.navigate("Chat", {
                userId1: _id,
                userId2: id,
                userName2: fullName,
              })
            }
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={{ backgroundColor: "#000" }} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: "5%",
          width: "90%",
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
          My Agents
        </Text>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "red",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <EvilIcons
            name="calendar"
            size={34}
            color="white"
            style={{ marginHorizontal: 3 }}
          />
          <MaterialCommunityIcons
            name="progress-check"
            size={28}
            style={{ marginHorizontal: 3 }}
            color="white"
          />
        
        </View> */}
      </View>

      <View style={styles.inboxContainerTop}>
        <FlatList
          data={agents}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <AgentComponent
              navigation={navigation}
              id={item.id}
              fullName={item.fullName}
              email={item.email}
            />
          )}
        />
      </View>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default MyAgents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  goBack: {
    marginLeft: 20,
    alignItems: "flex-start",
    // marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  inboxText: {
    fontSize: 24,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  inboxContainerTop: {
    width: "90%",
    alignItems: "flex-end",
    marginTop: 15,
  },
  inboxContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    marginBottom: 13,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
  },
  leftSideView: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSideView: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  userName: {
    fontSize: 14,
    // fontFamily: "SFPro-700",
  },
  message: {
    fontSize: 14,
    // fontFamily: "SFPro-400",
    // color: "#3C3C3C",
    color: "gray",
  },
  time: {
    fontSize: 12,
    color: "gray",
    // fontFamily: "SFPro-400",
  },
  deleteButton: {
    backgroundColor: "#C64B31",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "85%",
    marginRight: 15,
    borderRadius: 10,
  },
});
