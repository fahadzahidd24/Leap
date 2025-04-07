import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useSelector } from 'react-redux';
import { privateApi } from '../../api/axios';

const ChatGpt = ({ navigation, route }) => {
  const { prompt } = route.params;
  const [chatQuery, setChatQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [promptToSend, setPromptToSend] = useState(prompt ? prompt : "");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  const token = useSelector((state) => state.User.token);

  useEffect(() => {
    if (promptToSend) {
      sendMessage(promptToSend);
    }
  }, [promptToSend]);

  const handleChat = (text) => {
    setChatQuery(text);
  };

  const sendMessage = async (messageText) => {
    try {

      
      if (messageText.trim()) {
        // Add the user message to the chat
        setMessages((prevMessages) => [...prevMessages, { text: messageText, type: 'sent' }]);
        setChatQuery('');

        console.log("Message sent: ", messageText);
        console.log("Messages: ", messages.map((message) => message.text));


        // Scroll to the bottom after the new message is sent
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Set loading to true to show the loader
        setLoading(true);

        // Simulate receiving a message from the bot
        const response = await privateApi(token).post("/ask-coach", {
          prompt: messageText,
          messages: messages,
        });

        setLoading(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response.data.message.content, type: 'received' }
        ]);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', 'Network Error. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'null'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      enabled
    >
      <Pressable style={{ marginTop: '15%', width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
        <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>Coach</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, width: '100%', padding: 10 }}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        bounces={false}
        ref={scrollViewRef}
      >
        {/* Displaying Chat Messages */}
        <View style={styles.messageContainer}>
          {messages.map((message, index) => (
            <View key={index} style={message.type === 'sent' ? styles.sentMessage : styles.receivedMessage}>

              {message.type === 'received' && <View style={{
                padding: 10, borderRadius: 50, backgroundColor: "#fff", height: 35,
              }}>
                <Ionicons name="star" size={15} color={theme.colors.background} />
                <View style={{ position: "absolute", top: "130%", left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ fontSize: 10, color: theme.colors.background }}>---</Text>
                </View>
              </View>}

              <Text style={message.type === 'sent' ? styles.sentText : styles.receivedText}>{message.text}</Text>
            </View>
          ))}

          {/* Displaying loader when loading */}
          {loading && (
            <View style={styles.receivedMessage}>
              <Image source={require('../../../assets/messageLoader.gif')} style={{ height: 10, width: 60 }} />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={{ width: '100%', alignItems: 'center', marginVertical: '2%', marginBottom: 20, gap: 10 }}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ask Me Anything..."
            value={chatQuery}
            onChangeText={handleChat}
          />
          <TouchableOpacity onPress={() => sendMessage(chatQuery)}>
            {chatQuery.trim() ? (
              <View style={{ borderRadius: 50, padding: 5, backgroundColor: 'green' }}>
                <Ionicons name="chatbubble-ellipses" size={20} color="white" />
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 8, maxWidth: "80%" }}>LEAP AI coach can make mistakes. Check important info.</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatGpt;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  messageContainer: {
    width: '100%',
    marginVertical: 20,
  },
  receivedMessage: {
    // alignSelf: 'flex-start',
    backgroundColor: '#e5e5e50',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '90%',
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#43a4ff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '90%',
  },
  receivedText: {
    color: '#fff',
    fontWeight: '500',
  },
  sentText: {
    color: '#fff',
    fontWeight: '500',
  },
});
