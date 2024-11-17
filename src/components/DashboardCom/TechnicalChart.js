import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import CalendarProgressCart from "../progress/CalendarProgressCart";
import CustomFonts from "../../constants/CustomFonts";
import CustomDropDownTwo from "../SharedComponent/CustomDropDownTwo";

export default function TechnicalChart() {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const assignmentData = useSelector((state) => state.dashboard?.dashboardData?.assignment?.results);
  // console.log("technical test data", JSON.stringify(assignmentData, null, 2));

  const progressData = [
    {
      title: "Accepted",
      value: assignmentData?.acceptedItems ?? 0,
      percentage: (assignmentData?.acceptedItems / assignmentData?.totalItems) * 100 || 0,
      color: Colors.Primary,
    },
    {
      title: "Denied",
      value: assignmentData?.rejectedItems ?? 0,
      percentage: (assignmentData?.rejectedItems / assignmentData?.totalItems) * 100 || 0,
      color: Colors.Red,
    },
    {
      title: "Pending",
      value: assignmentData?.pendingItems ?? 0,
      percentage: (assignmentData?.pendingItems / assignmentData?.totalItems) * 100 || 0,
      color: "#FFB800",
    },
    {
      title: "Unanswered",
      value: assignmentData?.totalItems - assignmentData?.pendingItems - assignmentData?.rejectedItems - assignmentData?.acceptedItems ?? 0,
      percentage:
        ((assignmentData?.totalItems - assignmentData?.pendingItems - assignmentData?.rejectedItems - assignmentData?.acceptedItems) /
          assignmentData?.totalItems) *
          100 || 0,
      color: Colors.Primary,
    },
  ];

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Technical Test</Text>
        {/* <CustomDropDownTwo
                data={option}
                state={selectedOption}
                setState={setSelectedOption}
              /> */}
      </View>
      <View style={styles.container}>
        {progressData.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.box}>
            <CalendarProgressCart title={item.title} value={item.value.toString()} percentage={item.percentage} color={item.color} />
          </View>
        ))}
      </View>

      <View style={[styles.container, styles.bottom]}>
        {progressData.slice(2, 4).map((item, index) => (
          <View key={index} style={styles.box}>
            <CalendarProgressCart title={item.title} value={item.value.toString()} percentage={item.percentage} color={item.color} />
          </View>
        ))}
      </View>
    </View>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    box: {
      // width: responsiveScreenWidth(37),
    },
    bottom: {
      marginTop: responsiveScreenHeight(2),
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: responsiveScreenHeight(2),
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
  });
