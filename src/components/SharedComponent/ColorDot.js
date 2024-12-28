import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { responsiveScreenWidth } from "react-native-responsive-dimensions";

const ColorDot = ({ background }) => {
  const Colors = useTheme();
  return (
    <View
      style={{
        width: 13,
        height: 13,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: Colors.White,
        backgroundColor: background || Colors.Primary,
      }}
    ></View>
  );
};

export default ColorDot;
