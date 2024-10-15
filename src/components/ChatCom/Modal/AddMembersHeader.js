import React from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import SearchIcon from "../../../assets/Icons/SearchIcon";
import ArrowLeft from "../../../assets/Icons/ArrowLeft";
import CustomeFonts from "../../../constants/CustomeFonts";
import { useTheme } from "../../../context/ThemeContext";

const AddMembersHeader = ({ text, toggleModal }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={toggleModal}>
            <ArrowLeft />
          </TouchableOpacity>
          <Text style={styles.headerText}>{text}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => {}}>
            <SearchIcon />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
    </View>
  );
};

export default AddMembersHeader;

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {},
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: responsiveScreenWidth(2),

      alignItems: "center",
      height: responsiveScreenHeight(8),
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      width: responsiveScreenWidth(70),
    },
    headerRight: {
      width: responsiveScreenWidth(30),
    },

    headerImage: {
      width: responsiveScreenWidth(6),
      height: responsiveScreenHeight(3),
    },
    headerText: {
      fontSize: responsiveScreenFontSize(2.3),
      color: "#474748",
      marginLeft: responsiveScreenWidth(3),
      fontWeight: "500",
      fontFamily: CustomeFonts.MEDIUM,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      width: responsiveScreenWidth(80),
      alignSelf: "center",
    },
  });
