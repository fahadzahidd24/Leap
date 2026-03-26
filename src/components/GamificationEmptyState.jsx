import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

const GamificationEmptyState = ({ title, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: 6,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: theme.colors.textMuted,
  },
});

export default GamificationEmptyState;
