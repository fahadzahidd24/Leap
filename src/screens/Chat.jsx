import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import useSocket from "../hooks/useSocket";
import { addMessage, setChat } from "../redux/features/chatSlice";
import { theme } from "../constants/theme";
import { privateApi } from "../api/axios";
import Loader from "../components/Loader";
import { useFocusEffect } from "@react-navigation/native";

const Chat = ({ navigation, route }) => {
  const { userId1, userId2, userName2 } = route?.params || {};

  const { token } = useSelector((state) => state.User);
  const [loading, setLoading] = useState(true);

  const scrollViewRef = useRef();
  const dispatch = useDispatch();
  const { onEvent, sendEvent, socket } = useSocket();
  const [messageText, setMessageText] = useState("");
  const messages = useSelector((state) => state.Chat.messages);

  useFocusEffect(
    React.useCallback(() => {
      if (socket && userId1 && userId2) {
        sendEvent("join", { userId1, userId2 });

        const handleMessageReceive = (newMessage) => {
          if (newMessage?.sender != userId1) {
            const date = new Date();
            const formattedTime = date
              .toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              .toUpperCase();

            const msgObj = {
              id: Date.now(),
              message: newMessage?.content,
              time: formattedTime,
              type: "receiver",
            };

            dispatch(addMessage({ message: msgObj, unread: 1 }));
          }
        };

        onEvent("receive_message", handleMessageReceive);

        return () => {
          socket.off("receive_message", handleMessageReceive);
        };
      }
    }, [socket, userId1, userId2, sendEvent, onEvent])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (token && userId1 && userId2) {
        privateApi(token)
          .get(`/chat/${userId1}/${userId2}`)
          .then((res) => {
            const newMessages = res.data.map((msg) => {
              const formattedTime = new Date(msg.timestamp)
                .toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .toUpperCase();
              let type = "";
              if (msg.sender === userId1) {
                type = "sender";
              } else {
                type = "receiver";
              }

              const msgObj = {
                id: Date.now(),
                message: msg.content,
                time: formattedTime,
                type,
              };

              return msgObj;
            });

            dispatch(
              setChat({
                messages: newMessages,
                unread: 0,
              })
            );
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [token, userId1, userId2])
  );

  useEffect(() => {
    // dispatch(resetUnread());
    const timeoutId = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, [messages]);

  const sendMessage = () => {
    if (messageText.trim()) {
      const formattedTime = new Date()
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase();

      const msgObj = {
        id: Date.now(),
        message: messageText,
        time: formattedTime,
        type: "sender",
      };

      dispatch(addMessage({ message: msgObj }));
      setMessageText("");

      sendEvent("send_message", {
        userId1,
        userId2,
        sender: userId1,
        content: msgObj.message,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust offset if needed
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerLeftSide}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="white"
                style={styles.goBack}
              />
            </Pressable>

            <View style={styles.nameContainer}>
              <Text style={{ fontSize: 15, color: "white" }}>{userName2}</Text>
              <Text style={{ fontSize: 12, color: "white" }}>Online</Text>
            </View>
          </View>
        </View>

        <View style={styles.chatContainer}>
          <ScrollView
            contentContainerStyle={{ padding: 20, width: "100%" }}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {messages?.map((msg, index) => {
              return (
                <View
                  key={index}
                  style={
                    msg.type === "sender"
                      ? styles.senderMsgContainer
                      : styles.receiverMsgContainer
                  }
                >
                  <Text style={styles.time}>{msg.time}</Text>
                  <View
                    style={
                      msg.type === "sender"
                        ? styles.senderMsg
                        : styles.receiverMsg
                    }
                  >
                    <Text
                      style={
                        msg.type === "sender"
                          ? styles.msgText
                          : [styles.msgText, { color: "#000" }]
                      }
                    >
                      {msg.message}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.inputContainer}>
            <View style={styles.inputX}>
              <TextInput
                style={styles.input}
                placeholder="Type a message here"
                onChangeText={setMessageText}
                value={messageText}
              />
              <TouchableOpacity onPress={sendMessage}>
                <Feather name="send" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {loading && <Loader />}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Chat;
const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  goBack: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerLeftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: {
    marginLeft: 10,
    elevation: 2,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
  },
  headerRightSide: {
    marginRight: 20,
    justifyContent: "center",
  },
  iconRound: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f6eef6",
    alignItems: "center",
    justifyContent: "center",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "flex-end",
  },
  inputContainer: {
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    justifyContent: "center",
  },
  inputX: {
    width: "95%",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    width: "90%",
    padding: 0,
    paddingLeft: 10,
    fontSize: 16,
  },
  senderMsgContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  receiverMsgContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  senderMsg: {
    padding: 15,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    borderBottomStartRadius: 16,
    backgroundColor: "#ffffff",
    elevation: 2,
    opacity: 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    marginBottom: 15,
    maxWidth: "70%",
  },
  receiverMsg: {
    padding: 15,
    borderTopEndRadius: 16,
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
    backgroundColor: "#fff",
    opacity: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    marginBottom: 15,
    maxWidth: "70%",
  },
  msgText: {
    fontSize: 16,
    color: "black",
  },
  time: {
    fontSize: 12,
    marginBottom: 5,
    color: "#A3A3A3",
  },
});
