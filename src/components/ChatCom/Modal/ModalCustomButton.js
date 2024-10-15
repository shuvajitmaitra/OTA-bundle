import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import CustomeFonts from "../../../constants/CustomeFonts";
import { useTheme } from "../../../context/ThemeContext";

export default function ModalCustomButton({
  textColor,
  backgroundColor,
  buttonText,
  toggleModal,
}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <TouchableOpacity
      onPress={toggleModal}
      style={[styles.button, { backgroundColor: backgroundColor }]}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    button: {
      flex: 1,
      backgroundColor: Colors.Primary,
      minWidth: responsiveScreenWidth(35),
      alignItems: "center",
      borderRadius: 10,
      padding: responsiveScreenWidth(2.5),
    },
    buttonText: {
      color: Colors.White,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomeFonts.MEDIUM,
    },
  });
