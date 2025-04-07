import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Modal, StyleSheet, Text, Pressable } from "react-native";

const AlertMessage = ({ visible, message, onPressOk }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={styles.modalBackground}>
      <View style={styles.alertWrapper}>
        <Text
          style={{
            color: "#000",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {message}
        </Text>
        <Pressable onPress={onPressOk} style={styles.okButton}>
          <LinearGradient
            colors={["#9F5F91", "#582C57"]}
            style={styles.okButton}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>OK</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.432)",
  },
  alertWrapper: {
    backgroundColor: "#efefef",
    borderRadius: 30,
    padding: 20,
    display: "flex",
    alignItems: "center",
    width: "70%",
    // height: "10%",
  },
  okButton: {
    // marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
});

export default AlertMessage;
