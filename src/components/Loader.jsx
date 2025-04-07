import React from "react";
import { View, Modal, ActivityIndicator, StyleSheet } from "react-native";

const Loader = ({ loading }) => (
  <Modal transparent animationType="none" visible={loading}>
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator
          animating={loading}
          size={"large"}
          color={"#6c6c6c"}
        />
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
  activityIndicatorWrapper: {
    backgroundColor: "#bdbdbd",
    borderRadius: 10,
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loader;
