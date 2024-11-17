import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Divider from "../SharedComponent/Divider";
import ArrowTopRight from "../../assets/Icons/ArrowTopRight";
import CustomDropDownTwo from "../SharedComponent/CustomDropDownTwo";
import CustomFonts from "../../constants/CustomFonts";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import RainbowPieChart from "../SharedComponent/RainbowPieChart";
import DecreaseIcon from "../../assets/Icons/DecreaseIcon";
import { setGestureState } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const DocumentsProgress = ({ myUploadedDocuments }) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.HeadingText}>Documents</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Presentation")}>
          <ArrowTopRight />
        </TouchableOpacity>
      </View>

      <Divider marginBottom={4} />
      <RainbowPieChart total={myUploadedDocuments?.limit} count={myUploadedDocuments?.count} />
      <View style={styles.cartContainer}>
        <View style={styles.cartContainerLeft}>
          <Text style={styles.cartHeadingText}>All Documents</Text>
          <Text style={styles.values}>{myUploadedDocuments?.limit || 0}</Text>
        </View>
        <View style={styles.cartContainerRight}>
          <Text style={styles.cartHeadingText}>Comments</Text>
          <View style={styles.commentsSubContainer}>
            <Text style={styles.values}>{myUploadedDocuments?.count || 0}</Text>
            <DecreaseIcon />
            <Text style={styles.decreasePercentage}>0%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DocumentsProgress;

const getStyles = (Colors) =>
  StyleSheet.create({
    decreasePercentage: {
      color: Colors.PureWhite,
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: Colors.Red,
      borderRadius: 100,
      paddingVertical: 2,
    },
    values: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.6),
      color: Colors.Heading,
    },
    cartHeadingText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.BodyText,
      marginBottom: responsiveScreenHeight(1),
    },
    commentsSubContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    cartContainerRight: {
      // backgroundColor: "yellow",
      flex: 1,
      paddingLeft: responsiveScreenWidth(15),
    },
    cartContainerLeft: {
      // backgroundColor: "yellow",
      flex: 1,
    },
    progress: {
      alignSelf: "center",
      marginTop: responsiveScreenHeight(1),
    },
    details: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1.5),
      textAlign: "center",
    },
    progressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(4),
      color: Colors.Primary,
    },
    container: {
      backgroundColor: Colors.White,
      marginVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      padding: 20,
    },
    headerContainer: {
      flexDirection: "row",
      // justifyContent: "space-between",
      gap: 10,
      alignItems: "center",
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
    cartContainer: {
      minWidth: "100%",
      marginTop: responsiveScreenHeight(-8),
      flexDirection: "row",
      alignItems: "center",
      // backgroundColor: Colors.PrimaryOpacityColor,
      // marginTop: responsiveScreenHeight(2),
      justifyContent: "space-between",
    },
  });
