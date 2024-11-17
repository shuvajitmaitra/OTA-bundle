import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import Divider from "../SharedComponent/Divider";
import CustomFonts from "../../constants/CustomFonts";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import RainbowPieChart from "../SharedComponent/RainbowPieChart";
import DecreaseIcon from "../../assets/Icons/DecreaseIcon";
import CustomDropDownTwo from "../SharedComponent/CustomDropDownTwo";
import IncreaseIcon from "../../assets/Icons/IncreaseIcon";
import { useSelector } from "react-redux";
import RainbowPieTwo from "./RainbowPieTwo";

// const mockInterview = {
//   totalInterview: 15,
//   completed: 6,
//   submitted: 3,
//   pending: 1,
// };

function convertDataToPercentage(data) {
  const Colors = useTheme();
  const total = data?.totalInterview;
  if (!total || total === 0) {
    return [
      {
        key: 1,
        value: 100,
        svg: { fill: Colors.Gray2 },
      },
    ];
  }

  const fields = [
    { key: "completed", color: "#27AC1F" },
    { key: "submitted", color: "#F34141" },
    { key: "pending", color: "#F90" },
  ];

  const percentageData = [];
  let keyCounter = 1;

  fields.forEach((field) => {
    const value = data[field.key];
    if (value > 0) {
      const percentage = (value / total) * 100;
      percentageData.push({
        key: keyCounter++,
        value: percentage,
        svg: { fill: field.color },
      });
    }
  });

  return percentageData;
}

const MockChart = () => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [value, setValue] = useState("This Year");
  const data = ["This Day", "This Month", "This Year"];
  // const mockInterview = useSelector(
  //   (state) => state.dashboard?.dashboardData?.mockInterview
  // );

  const { mockInterview } = useSelector((state) => state.dashboard);
  console.log("mock", JSON.stringify(mockInterview, null, 1));
  const percentageData = convertDataToPercentage(mockInterview);
  const totalInterviews = (mockInterview?.completed ?? 0) + (mockInterview?.pending ?? 0) + (mockInterview?.submitted ?? 0);
  const completePercentage = (mockInterview?.completed / totalInterviews) * 100 || 0;
  const pendingPercentage = (mockInterview?.pending / totalInterviews) * 100 || 0;
  const submittedPercentage = (mockInterview?.submitted / totalInterviews) * 100 || 0;

  if (!mockInterview) {
    return <ActivityIndicator size="large" color={Colors.Primary} />;
  }

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mock Interviews</Text>
        {/* <CustomDropDownTwo data={data} state={value} setState={setValue} /> */}
      </View>

      <RainbowPieTwo data={percentageData} />
      <View style={styles.cartContainer}>
        <View style={styles.cartContainerLeft}>
          <Text style={styles.cartHeadingText}>Completed</Text>
          <View style={styles.commentsSubContainer}>
            <Text style={styles.values}>{mockInterview?.completed ?? 0}</Text>
            <IncreaseIcon />
            <View style={styles.boxContainer}>
              <Text style={styles.submittedPercentage}>{completePercentage.toFixed()}%</Text>
            </View>
          </View>
        </View>
        <View style={styles.cartContainerRight}>
          <Text style={styles.cartHeadingText}>Pending</Text>
          <View style={styles.commentsSubContainer}>
            <Text style={styles.values}>{mockInterview?.pending ?? 0}</Text>
            <IncreaseIcon color={"#F90"} />
            <View style={[styles.boxContainer, { backgroundColor: "#F90" }]}>
              <Text style={styles.submittedPercentage}>{pendingPercentage.toFixed()}%</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.cartContainerLeft}>
        <Text style={styles.cartHeadingText}>Submitted</Text>
        <View style={styles.commentsSubContainer}>
          <Text style={styles.values}>{mockInterview?.submitted ?? 0}</Text>
          <IncreaseIcon color={Colors.Red} />
          <View style={[styles.boxContainer, { backgroundColor: Colors.Red }]}>
            <Text style={styles.submittedPercentage}>{submittedPercentage.toFixed()}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MockChart;

const getStyles = (Colors) =>
  StyleSheet.create({
    boxContainer: {
      color: Colors.PureWhite,
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      borderRadius: 100,
      paddingVertical: 2,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    submittedPercentage: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    increasePercentage: {
      color: Colors.PureWhite,
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      borderRadius: 100,
      paddingVertical: 2,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    pendingPercentage: {
      color: Colors.PureWhite,
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: "#F90",
      borderRadius: 100,
      paddingVertical: 2,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    values: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },
    cartHeadingText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
      marginBottom: responsiveScreenHeight(1),
    },
    commentsSubContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    cartContainerRight: {
      flex: 1,
      paddingLeft: responsiveScreenWidth(15),
    },
    cartContainerLeft: {
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
      justifyContent: "space-between",
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
      marginBottom: responsiveScreenHeight(2),
      justifyContent: "space-between",
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
