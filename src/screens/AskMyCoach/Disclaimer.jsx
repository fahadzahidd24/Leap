import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../../constants/theme'

const Disclaimer = ({navigation}) => {
  return (
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: theme.colors.background }}
    behavior={Platform.OS === "ios" ? "padding" : "null"}
    enabled
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, width: "100%", alignItems: "center" }}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      bounces={false}
    >
      <View>
        <Image
          source={require("../../../assets/logo.png")}
          style={{ alignSelf: "center" }}
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
          My Sales Coach
        </Text>
      </View>

      <View style={{ width: "80%", marginVertical: "5%" }}>
        <Text style={{
          textAlign: "center",
          fontSize: 22,
          fontWeight: "700",
          marginTop: 5,
          color: "#f6c50e",
        }}>Welcome To The AI-Powered Coach!</Text>
        <Text style={{marginVertical:"5%", color:"#fff", fontWeight:"500", fontSize:20, textAlign:"center", lineHeight:30}}>
            Please note that AI Coach responses are for reference only and may contain errors. Verify important information. Click "Okay" to proceed.
        </Text>
        <Pressable style={{backgroundColor:"#fff", padding:10, borderRadius:10, width:"80%", alignSelf:"center", marginVertical:"10%"}} onPress={()=>navigation.navigate("ChatCoach")}>
            <Text style={{color:"#000", textAlign:"center", fontWeight:"500", fontSize:20}}>Okay</Text>
        </Pressable>
      </View>


    </ScrollView>
  </KeyboardAvoidingView>
  )
}

export default Disclaimer

const styles = StyleSheet.create({})