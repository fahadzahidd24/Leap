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
  textColor,
  accentColor,
  backgroundColor,
  borderColor,
  activeBorderColor,
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const resolvedTextColor = textColor || "#000";
  const resolvedAccentColor = accentColor || theme.colors.background;
  const resolvedBackgroundColor = backgroundColor || "#FFF";
  const resolvedBorderColor = isError
    ? "#F00"
    : borderColor || resolvedBackgroundColor;
  const resolvedActiveBorderColor =
    activeBorderColor || resolvedAccentColor || resolvedBorderColor;

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
            color={resolvedAccentColor}
          />
        ) : (
          <TextInput.Icon
            icon="eye-off"
            onPress={() => setHidePassword(!hidePassword)}
            color={resolvedAccentColor}
          />
        ))
      }
      disabled={isDisabled}
      label={label}
      textColor={resolvedTextColor}
      value={value}
      keyboardType={keyboardType}
      autoCapitalize="sentences"
      autoComplete={autoComplete}
      onChangeText={onChangeText}
      contentStyle={styles.contentStyle}
      theme={{
        colors: {
          onSurfaceVariant: resolvedAccentColor,
          primary: resolvedAccentColor,
        },
      }}
      underlineColor={resolvedAccentColor}
      activeUnderlineColor={resolvedAccentColor}
      underlineStyle={{ opacity: 0 }}
      style={[
        styles.textInputStyle,
        {
          backgroundColor: resolvedBackgroundColor,
          color: resolvedTextColor,
          borderColor: resolvedBorderColor,
          borderWidth: 1,
          shadowColor: resolvedActiveBorderColor,
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
  },
  textInputStyle: {
    fontSize: 18,
    fontFamily: "",
    marginVertical: 13,
  },
});
