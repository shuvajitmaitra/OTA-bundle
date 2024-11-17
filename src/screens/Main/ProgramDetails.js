import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";

import axiosInstance from "../../utility/axiosInstance";
import ProgramDetailsCard from "../../components/ProgramCom/v2/ProgramDetailsCard";
import CusSegmentedButtons from "../../components/ProgramCom/v2/CusSegmentedButtons";
import ProgramTimeTracker from "../../components/ProgramCom/v2/ProgramTimeTracker";
import ProgramFiles from "../../components/ProgramCom/v2/ProgramFiles";
import { seconds2time } from "../../utility";
import VideoPlayer from "../../components/ProgramCom/v2/VideoPlayer";
import CustomFonts from "../../constants/CustomFonts";
import Loading from "../../components/SharedComponent/Loading";
import { useTheme } from "../../context/ThemeContext";

export default function ProgramDetails({ route, navigation }) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = React.useState(false);
  const [category, setCategory] = useState("");
  const [course, setCourse] = React.useState("");

  const getAllData = async (slug) => {
    try {
      setIsLoading(true);
      let allCourses = await axiosInstance.get(`/course/contentv2/${slug}`);
      allCourses = allCourses.data;

      setCourse(allCourses?.course);
      setCategory(allCourses?.category);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error program details", error);
    }
  };

  React.useEffect(() => {
    if (route?.params?.slug) {
      getAllData(route?.params?.slug);
    }
  }, [route]);

  const handleCollapse = (item) => {
    setExpanded((state) => (state.includes(item) ? state?.filter((i) => i !== item) : [...state, item]));
  };
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.Background_color }}>
        <Loading backgroundColor={"transparent"} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.programNameText}>{course.title}</Text>
      {category?.categories?.length > 0 && <CusSegmentedButtons category={category} course={course} />}

      {/* <ProgramTimeTracker /> */}
      {/* <CourseContent /> */}
    </View>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: responsiveScreenHeight(1),
      backgroundColor: Colors.Background_color,
    },
    programNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.7),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(1.5),
      color: Colors.Heading,
    },
    icon: {
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(0.5),
    },
    checkicon: {
      color: Colors.Primary,
      marginTop: responsiveScreenHeight(0.5),
    },
    videoTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      marginHorizontal: responsiveScreenWidth(4),
      marginTop: responsiveScreenHeight(2),
    },
    videoTypeContainer: {
      marginHorizontal: responsiveScreenWidth(4),
      marginTop: responsiveScreenHeight(2),
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      rowGap: responsiveScreenHeight(1.5),
    },
    videoType: {
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(44),
      height: responsiveScreenHeight(6),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    videoTypeTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Primary,
    },
  });
