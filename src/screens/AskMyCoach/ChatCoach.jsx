import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme'
import { coachingPrompts } from '../../constants/coachingPrompts';
import { simulationPrompts } from '../../constants/simulationPrompts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ChatCoach = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuerySimulation, setSearchQuerySimulation] = useState('');
  const [chatQuery, setChatQuery] = useState('');
  const [profession, setProfession] = useState("");

  useFocusEffect(
    useCallback(() => {
      const getProfession = async () => {
        const prof = await AsyncStorage.getItem("profession");
        setProfession(prof);
        if (!prof) {
          navigation.navigate("Profession");
        }
      };
      getProfession();

      return () => { };
    }, [navigation])
  );

  // Filter data based on search query
  const filteredPrompts = coachingPrompts
    .filter(item => {
      if (profession)
        return item.title.toLowerCase() === profession.toLowerCase();
    })
    .flatMap(item => item.prompts)
    .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredSimulationPrompts = simulationPrompts
    .filter(item => {
      if (profession)
        return item.title.toLowerCase() === profession.toLowerCase();
    })
    .flatMap(item => item.prompts)
    .filter(item => item.title.toLowerCase().includes(searchQuerySimulation.toLowerCase()));


  // Update search query and reset page
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleSearchSimulation = (text) => {
    setSearchQuerySimulation(text);
  };
  const handleChat = (text) => {
    setChatQuery(text);
  };

  const goToChatScreen = (prompt, type) => {
    navigation.navigate("ChatGpt", { prompt: prompt })
  }

  const sendCustomMessage = (message) => {
    navigation.navigate("ChatGpt", { prompt: message });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "null"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      enabled
    >
      <Pressable style={{ marginTop: "15%", width: "100%" }} onPress={() => {
        navigation.openDrawer();
      }}>
        <Ionicons name="menu" size={30} color="white" style={{ marginLeft: 20 }} />
      </Pressable>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, width: "100%", alignItems: "center" }}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        bounces={false}
      >
        <Image source={require('../../../assets/logo.png')} style={{ width: 220, height: 220 }} />
        <View style={{ width: "80%", marginVertical: "5%" }}>
          <Text style={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: "800",
            marginTop: 5,
            color: "#f6c50e",
          }}>Personalized
            Sales Coaching</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="1-Click Guidance Search..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery && <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={20} color="black" />
          </TouchableOpacity>}
        </View>

        <View style={{ width: "90%", alignItems: "center", marginBottom: "10%" }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: "10%", justifyContent: "center", width: "100%" }}>
            {/* Left Arrow */}
            {/* {filteredPrompts.length > 0 && <View>
              <Ionicons name="chevron-back" size={34} color="#eaeaea70" />
            </View>} */}

            <View style={{ flexDirection: 'row', justifyContent: 'center', maxWidth: "90%" }}>
              {filteredPrompts.length != 0 && <FlatList
                data={filteredPrompts}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable onPress={() => goToChatScreen(item.description, "Ready Prompt")} key={item.step} style={{
                    backgroundColor: theme.colors.white,
                    paddingVertical: 15,
                    paddingHorizontal: 5,
                    width: 140,
                    height: 130,
                    borderRadius: 20,
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    <Ionicons style={{ marginBottom: "10%" }} name={item.icon} size={30} color={item.color} />
                    <Text style={{ textAlign: "center", fontWeight: 600, fontSize: 12 }}>{item.title}</Text>
                  </Pressable>
                )}
                keyExtractor={item => item.step}
              />}

              {filteredPrompts.length === 0 && (
                <Text style={{ color: theme.colors.secondary, fontSize: 16, textAlign: "center" }}>No results found</Text>
              )}
            </View>

            {/* Right Arrow */}
            {/* {filteredPrompts.length > 0 && <View>
              <Ionicons name="chevron-forward" size={34} color="#eaeaea70" />
            </View>} */}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="1-Click Sales Simulation Search..."
            value={searchQuerySimulation}
            onChangeText={handleSearchSimulation}
          />
          {searchQuerySimulation && <TouchableOpacity onPress={() => setSearchQuerySimulation('')}>
            <Ionicons name="close" size={20} color="black" />
          </TouchableOpacity>}
        </View>

        <View style={{ width: "90%", alignItems: "center", marginBottom: "10%" }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: "10%", justifyContent: "center", width: "100%" }}>
            {/* Left Arrow */}
            {/* {filteredSimulationPrompts.length > 0 && <View>
              <Ionicons name="chevron-back" size={34} color="#eaeaea70" />
            </View>} */}

            <View style={{ flexDirection: "row", width: "90%", alignItems: "center", justifyContent: "center" }}>
              {filteredSimulationPrompts.length != 0 && <FlatList
                data={filteredSimulationPrompts}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable onPress={() => goToChatScreen(item.description, "Ready Prompt")} key={item.step} style={{
                    backgroundColor: theme.colors.white,
                    paddingVertical: 15,
                    paddingHorizontal: 5,
                    width: 140,
                    height: 130,
                    borderRadius: 20,
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    <Ionicons style={{ marginBottom: "10%" }} name={item.icon} size={30} color={item.color} />
                    <Text style={{ textAlign: "center", fontWeight: 600, fontSize: 12 }}>{item.title}</Text>
                  </Pressable>
                )}
                keyExtractor={item => item.step}
              />}

              {filteredSimulationPrompts.length === 0 && (
                <Text style={{ color: theme.colors.secondary, fontSize: 16, textAlign: "center" }}>No results found</Text>
              )}
            </View>
            {/* {filteredSimulationPrompts.length > 0 && <View>
              <Ionicons name="chevron-forward" size={34} color="#eaeaea70" />
            </View>} */}

          </View>
        </View>
      </ScrollView>
      <View style={{ width: "100%", alignItems: "center", marginVertical: "2%", marginBottom: 20, gap: 10 }}>
        <View style={[styles.searchContainer2]}>
          <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ask Me Anything..."
            value={chatQuery}
            onChangeText={handleChat}
          />
          <TouchableOpacity onPress={() => setSearchQuerySimulation('')}>
            {chatQuery && <Pressable onPress={() => sendCustomMessage(chatQuery)} style={{ borderRadius: 50, padding: 5, backgroundColor: "green" }}>
              <Ionicons name="chatbubble-ellipses" size={20} color="white" />
            </Pressable>}
          </TouchableOpacity>
        </View>
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 8, maxWidth: "80%" }}>LEAP AI coach can make mistakes. Check important info.</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ChatCoach;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  searchContainer2: {
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
});
