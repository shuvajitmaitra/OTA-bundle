import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";

import ArrowLeft from "../../../assets/Icons/ArrowLeft";
import CustomeFonts from "../../../constants/CustomeFonts";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from "react-native-responsive-dimensions";
import { useTheme } from "../../../context/ThemeContext";

export default function ModalBackBtn({ setIsGroupModalVisible }) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setIsGroupModalVisible(false);
        }}
        style={styles.modalArrowIcon}
      >
        <ArrowLeft />
        <Text style={styles.text}>Back</Text>
      </TouchableOpacity>
      {/* <Divider
        bold={false}
        style={{
          marginBottom: responsiveScreenHeight(2),
          marginTop: responsiveScreenHeight(1),
          width: "100%",
        }}
      /> */}
    </>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    modalArrowIcon: {
      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(1),
      fontSize: responsiveScreenFontSize(2.5),
      paddingBottom: responsiveScreenHeight(0.8),
      color: "rgba(71, 71, 72, 1)",
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      fontFamily: CustomeFonts.REGULAR,
      paddingLeft: 8,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.BodyText,
    },
  });
