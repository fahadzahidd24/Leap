import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { theme } from "../constants/theme";

const LeapTextInput = ({
  label,
  value,
  keyboardType,
  autoComplete,
  onChangeText,
  secureTextEntry,
  isError,
  isMultiline,
  isDisabled,
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <TextInput
      mode="flat"
      multiline={isMultiline}
      numberOfLines={isMultiline ? 3 : 1}
      secureTextEntry={secureTextEntry && hidePassword}
      right={
        secureTextEntry &&
        (hidePassword ? (
          <TextInput.Icon
            icon="eye"
            onPress={() => setHidePassword(!hidePassword)}
            color={"#888888"}
          />
        ) : (
          <TextInput.Icon
            icon="eye-off"
            onPress={() => setHidePassword(!hidePassword)}
            color={"#888888"}
          />
        ))
      }
      disabled={isDisabled}
      label={label}
      textColor="#000"
      value={value}
      keyboardType={keyboardType}
      autoCapitalize="sentences"
      autoComplete={autoComplete}
      onChangeText={onChangeText}
      contentStyle={styles.contentStyle}
      theme={{
        colors: {
          onSurfaceVariant: "#b2b2b2",
        },
      }}
      underlineColor={theme.colors.background}
      activeUnderlineColor={theme.colors.background}
      underlineStyle={{ opacity: 0 }}
      style={[
        styles.textInputStyle,
        {
          backgroundColor: "#FFF",
          borderColor: isError ? "#F00" : "#FFF",
          borderWidth: isError ? 1 : 0,
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          borderBottomLeftRadius: 35,
          borderBottomRightRadius: 35,
        },
      ]}
    />
  );
};

export default LeapTextInput;

const styles = StyleSheet.create({
  contentStyle: {
    fontSize: 18,
    fontFamily: "",
    color: "#000",
  },
  textInputStyle: {
    fontSize: 18,
    fontFamily: "",
    marginVertical: 13,
    color: "#000",
  },
});
