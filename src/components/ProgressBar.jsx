import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const ProgressBar = ({ percentage, sx }) => {
  const size = sx === "large" ? 100 : 70;
  const emptyStrokeWidth = sx === "large" ? 4 : 2;
  const filledStrokWidth = sx === "large" ? 10 : 6;
  const radius = (size - filledStrokWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const halfCircle = size / 2;

  // Handle percentage display following the rules:
  // If Target = 0 and Actual > 0 → "100%+" (Infinity)
  // If Target = 0 and Actual = 0 → "—%" (NaN)
  // If Target > 0 → Display Actual ÷ Target
  const numPercentage = Number(percentage);
  
  let displayPercentage;
  let visualPercentage;
  
  if (isNaN(numPercentage)) {
    // Target = 0, Actual = 0 → display —%
    displayPercentage = "—%";
    visualPercentage = 0;
  } else if (!isFinite(numPercentage)) {
    // Target = 0, Actual > 0 → display 100%+
    displayPercentage = "100%+";
    visualPercentage = 100;
  } else if (numPercentage > 100) {
    // Over 100 - show actual percentage with ceil
    displayPercentage = `${Math.ceil(numPercentage)}%`;
    visualPercentage = 100;
  } else {
    // Normal case - show rounded percentage
    displayPercentage = `${Math.round(numPercentage)}%`;
    visualPercentage = Math.max(0, numPercentage);
  }

  const strokeDashoffset =
    circumference - (circumference * visualPercentage) / 100;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: sx === "large" ? 40 : 30,
          height: sx === "large" ? 70 : 50,
          width: sx === "large" ? 70 : 50,
          // paddingHorizontal: sx === "large" ? 16 : 6,
          // paddingVertical: sx === "large" ? 20 : percentage >= 100 ? 10 : 11,
        },
      ]}
    >
      <Svg
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#5ce1e6"
            strokeWidth={emptyStrokeWidth}
            fill="none"
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="orange"
            strokeWidth={filledStrokWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="none"
          />
        </G>
      </Svg>
      <Text style={styles.percentageText}>{displayPercentage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6941d",
  },
  svg: {
    position: "absolute",
  },
  percentageText: {
    textAlign:"center",
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});

export default ProgressBar;
