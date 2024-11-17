import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { responsiveScreenFontSize, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";

const CustomButton = ({ textColor, backgroundColor, buttonText, toggleModal }) => {
  return (
    <TouchableOpacity onPress={toggleModal} style={[styles.button, { backgroundColor: backgroundColor }]}>
      <Text style={[styles.buttonText, { color: textColor }]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: "#27ac1f",
    minWidth: responsiveScreenWidth(35),
    alignItems: "center",
    borderRadius: 10,
    padding: responsiveScreenWidth(3),
  },
  buttonText: {
    color: "white",
    fontSize: responsiveScreenFontSize(2.2),
    fontFamily: CustomFonts.MEDIUM,
  },
});
