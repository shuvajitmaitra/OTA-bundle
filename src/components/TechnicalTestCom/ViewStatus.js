import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
  FlatListComponent,
  TextInput,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import CustomFonts from "../../constants/CustomFonts";

export default function ViewStatus(route) {
  const assignments = useSelector((state) => state.technicalTest.assignments);
  const totalAssignment = route?.route?.params?.assignments?.length;
  const totalAnswer = route?.route?.params?.assignments?.filter((item) => item.submission);
  console.log("assignments", JSON.stringify(route?.route?.params?.assignments, null, 1));
  const notAnswered = route?.route?.params?.assignments?.filter((item) => !item?.submission?.status);
  const accepted = route?.route?.params?.assignments?.filter((item) => item?.submission?.status == "accepted");
  const rejected = route?.route?.params?.assignments?.filter((item) => item?.submission?.status == "rejected");
  const pending = route?.route?.params?.assignments?.filter((item) => item?.submission?.status == "pending");
  const technicalTask = route?.route?.params?.assignments?.filter((item) => item?.category == "task");
  const technicalQuestion = route?.route?.params?.assignments?.filter((item) => item?.category == "question");

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const { user } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.White}
        barStyle={Colors.Background_color === "#F5F5F5" ? "dark-content" : "light-content"}
      />
      <View>
        {/* ---------
                    ---------Heading-------
                    --------------------------- */}
        <View style={styles.statusContainer}>
          <Text style={styles.title}>Overall Status</Text>
          <View style={styles.line}></View>

          {/* ---------
                    ---------Total Assessments-------
                    --------------------------- */}
          <View style={styles.assessmentContainer}>
            <Text style={styles.heading}>Total Assessments</Text>
            <Text style={styles.text}>This is the statistics of technical assignments</Text>

            <View>
              <View style={styles.statisticsContainer}>
                <View style={styles.stateBox}>
                  <Text style={styles.statusText}>Total Assignments</Text>
                  <Text style={[styles.number, { color: "#27AC1F" }]}>{totalAssignment}</Text>
                </View>
                <View style={styles.stateBox}>
                  <Text style={styles.statusText}>Not Answered</Text>
                  <Text style={[styles.number, { color: "#097EF2" }]}>{notAnswered?.length}</Text>
                </View>
              </View>
              <View style={styles.statisticsContainer}>
                <View style={styles.stateBox}>
                  <Text style={styles.statusText}>Technical Task</Text>
                  <Text style={[styles.number, { color: "#F37004" }]}>{technicalTask?.length}</Text>
                </View>
                <View style={styles.stateBox}>
                  <Text style={styles.statusText}>Technical Question</Text>
                  <Text style={[styles.number, { color: "#0CA9B2" }]}>{technicalQuestion?.length}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* ---------
                    ---------Assessments Statistics-------
                    --------------------------- */}
          <View style={styles.assessmentContainer}>
            <Text style={styles.heading}>Assessments Statistics</Text>
            <Text style={styles.text}>This is the statistics of all answered assignments you made</Text>

            <View>
              <View style={styles.statisticsContainer}>
                <View style={styles.stateBox}>
                  <Text style={styles.statusText}>Total Answers</Text>
                  <Text style={[styles.number, { color: "#27AC1F" }]}>{totalAnswer?.length}</Text>
                </View>
                <View style={styles.stateBox}>
                  <Text style={styles.statusText}>Accepted</Text>
                  <Text style={[styles.number, { color: "#00D7C4" }]}>{accepted?.length}</Text>
                </View>
              </View>
              <View style={styles.statisticsContainer}>
                <View style={styles.stateBox}>
                  <Text style={styles.statusText}>Pending</Text>
                  <Text style={[styles.number, { color: "#FF9900" }]}>{pending?.length}</Text>
                </View>
                <View style={styles.stateBox}>
                  <Text style={styles.statusText}>Rejected</Text>
                  <Text style={[styles.number, { color: "#F34141" }]}>{rejected?.length}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(5),
    },

    statusContainer: {
      backgroundColor: Colors.White,
      padding: responsiveScreenWidth(5),
      marginVertical: responsiveScreenHeight(2),
      borderRadius: responsiveScreenWidth(3),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    line: {
      marginTop: responsiveScreenHeight(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      width: "100%",
      alignSelf: "center",
    },
    assessmentContainer: {
      marginTop: responsiveScreenWidth(5),
      padding: responsiveScreenWidth(4),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
    },
    heading: {
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    text: {
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      marginBottom: responsiveScreenHeight(1),
    },
    statisticsContainer: {
      flexDirection: "row",
      gap: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1.5),
    },
    stateBox: {
      backgroundColor: Colors.White,
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      width: responsiveScreenWidth(35),
    },
    statusText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
    },
    number: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.6),
    },
  });
