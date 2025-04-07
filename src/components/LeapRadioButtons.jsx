import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const LeapRadioButton = ({ options, selectedOption, onSelect }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionContainer}
          onPress={() => onSelect(option.value)}
        >
          <View style={styles.radioCircle}>
            {selectedOption === option.value && (
              <View style={styles.selectedDot} />
            )}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#ff914d",
  },
  label: {
    fontSize: 16,
    color: "#fff",
  },
});

export default LeapRadioButton;
