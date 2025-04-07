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
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Loader from "../components/Loader";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

const handleDelete = () => {
  console.log("Deleted");
};

const renderRightActions = () => {
  return (
    <Pressable onPress={handleDelete} style={styles.deleteButton}>
      <Ionicons name={"trash-outline"} size={20} color={"#ffffff"} />
    </Pressable>
  );
};

const Inbox = ({ navigation }) => {
  const { token, _id, role } = useSelector((state) => state.User);
  const [chats, setChats] = useState([]);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        privateApi(token)
          .get(`/inbox`)
          .then((res) => {
            setChats(res.data);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [token])
  );

  const InboxComponent = ({ navigation, id, username, time, message }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("Chat", {
            userId1: _id,
            userId2: id,
            userName2: username,
          })
        }
      >
        {/* <Swipeable renderRightActions={renderRightActions}> */}
        <View style={styles.inboxContainer}>
          <View style={styles.leftSideView}>
            {/* <Image
              source={{ uri: image } || require("../../assets/profile.png")}
              style={styles.avatar}
            /> */}
            <View>
              <Text style={styles.userName}>{username}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          </View>

          <View style={styles.rightSideView}>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
        {/* </Swipeable> */}
      </Pressable>
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
          Inbox
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
            onPress={() => navigation.navigate("Daily Schedule")}
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
        </View> */}

        <View
          style={{
            flexDirection: "row", // Align children in a row
            alignItems: "center", // Center icons vertically in the row
            justifyContent: "center", // Center icons horizontally in the row
            marginTop: 10, // Top margin for the entire row
          }}
        >
          {/* <EvilIcons
            name="calendar"
            onPress={() => navigation.navigate("My Agents")}
            size={34}
            color="white"
            style={{ marginHorizontal: 3 }} // Increase horizontal margin for better spacing
          /> */}
          <MaterialCommunityIcons
            onPress={() =>
              navigation.navigate(
                role === "agent" ? "DailySchedule" : "My Agents"
              )
            }
            style={{ marginHorizontal: 3 }}
            name="calendar-month"
            size={27}
            color="white"
          />
          {/* <AntDesign
            name="message1"
            size={23}
            color="white"
            style={{ marginHorizontal: 3 }}
            onPress={() => navigation.navigate(role === "agent" ? "DailySchedule" :"My Agents")}
          /> */}
          {/* <MaterialCommunityIcons
            name="progress-check"
            onPress={() => navigation.navigate("Annual Progress")}
            size={26}
            color="white"
            style={{ marginHorizontal: 3 }} // Increase horizontal margin for better spacing
          /> */}
        </View>
      </View>

      <View style={styles.inboxContainerTop}>
        <FlatList
          data={chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <InboxComponent
              navigation={navigation}
              time={new Date(item.timestamp)
                .toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .toUpperCase()}
              message={item.lastMessage}
              id={item.otherUserId}
              username={item.otherUserName}
            />
          )}
        />
      </View>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
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
    marginHorizontal: "5%",
  },
  inboxContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
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
    maxWidth:"80%",
    alignItems: "center",
  },
  rightSideView: {
    justifyContent: "center",
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
