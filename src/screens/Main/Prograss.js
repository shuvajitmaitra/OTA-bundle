import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import AnimatedProgressWheel from "react-native-progress-wheel";

import CustomFonts from "../../constants/CustomFonts";
import axiosInstance from "../../utility/axiosInstance";
import Loading from "../../components/SharedComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import ArrowTopRight from "../../assets/Icons/ArrowTopRight";
import TechnicalTestProgress from "../../components/progress/TechnicalTestProgress";
import CalendarProgress from "../../components/progress/CalendarProgress";
import OtherActivitiesProgress from "../../components/progress/OtherActivitiesProgress";
import MessageProgress from "../../components/progress/MessageProgress";
import DocumentsProgress from "../../components/progress/DocumentsProgress";
import { setDashboardData } from "../../store/reducer/dashboardReducer";
import Divider from "../../components/SharedComponent/Divider";

export default function Prograss({ route }) {
  const [myprogress, setMyprogress] = React.useState(null);
  const [totalResults, setTotalResults] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useSelector((state) => state?.auth);
  const dayToday = myprogress?.find((item) => item.id === "day2day");
  const message = myprogress?.find((item) => item.id === "messages");
  const showNTell = myprogress?.find((item) => item.id === "showAndTell");
  const myUploadedDocuments = myprogress?.find((item) => item.id === "uploadedDocuments");

  const [courses, setCourses] = useState(null);
  const [courseData, setData] = useState(null);
  const { review, mockInterview, community } = useSelector((state) => state.dashboard?.dashboardData);
  const [selectedCourse, setSelectedCourse] = useState("");
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  React.useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get("/progress/myprogress")
      .then((res) => {
        setTotalResults(res?.data?.metrics);
        setMyprogress(res.data?.results || []);
        setIsLoading(false);
        // console.log("res.data", JSON.stringify(res.data, null, 1));
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        // Alert.alert(err?.response?.data?.error);
      });
  }, []);

  React.useEffect(() => {
    axiosInstance
      .get("/order/myorder/course")
      .then((res) => {
        // console.log(res.data);
        if (res.data.orders?.length !== 0) {
          setCourses(
            res.data.orders.map((o) => {
              return { label: o.course.title, value: o.course._id };
            })
          );
          setSelectedCourse(res.data.orders[0].course._id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [dayToDay, setDayToDay] = useState("week");

  React.useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .post("/dashboard/portal", {
        familyMember: {},
        lastPasswordUpdate: {},
        review: {},
        template: {},
        community: {},
        mockInterview: {},
        message: {},
        dayToday: { timeFrame: dayToDay },
        myDocument: {},
        documentLab: {},
        calendar: {},
        assignment: {},
        showTell: {},
        course: {
          courseId: selectedCourse,
        },
        bootcamp: {},
      })
      .then((res) => {
        if (res.data.success) {
          dispatch(setDashboardData(res.data.data));
          console.log("Data stored");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        Alert.alert(err?.response?.data?.error);
      });
  }, [selectedCourse]);

  const PrograssItem = ({ title, percentage, details1, details2 }) => {
    return (
      <View style={styles.prograssContainer}>
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: responsiveScreenHeight(1.5),
            paddingRight: responsiveScreenWidth(2.5),
            paddingLeft: responsiveScreenWidth(2),
          }}
        >
          <Text style={styles.heading}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProgramStack", {
                screen: "DayToDayActivities",
              });
            }}
          >
            <ArrowTopRight />
          </TouchableOpacity>
        </View> */}
        <View style={styles.headerContainer}>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              zIndex: -9,
            }}
          >
            <Text style={styles.HeadingText}>{title}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ProgramStack", {
                  screen: "DayToDayActivities",
                });
              }}
            >
              <ArrowTopRight />
            </TouchableOpacity>
          </View>
          <View style={{ zIndex: 9 }}>{/* <CustomDropDownTwo data={data} state={value} setState={setValue} /> */}</View>
        </View>
        <Divider />
        <View style={{ flexGrow: 1 }}></View>
        <View style={styles.progress}>
          <AnimatedProgressWheel
            size={responsiveScreenWidth(50)}
            width={title === "Uploaded Documents" ? responsiveScreenWidth(12) : responsiveScreenWidth(5)}
            color={Colors.Primary}
            progress={percentage || 0}
            backgroundColor={
              title === "Uploaded Documents" || title === "Day to Day Activities/Logs" ? Colors.StarColor : Colors.BorderColor
            }
            // rotation={title === "Reviews" ? "100deg" : "-100deg"}
            rotation="-100deg"
            showProgressLabel={true}
            rounded={title === "Uploaded Documents" || title === "Day to Day Activities/Logs" ? false : true}
            labelStyle={styles.progressLabel}
            showPercentageSymbol={true}
          />
        </View>
        {details1 ? <Text style={styles.details}>{details1}</Text> : null}
        {details2 ? <Text style={styles.details}>{details2}</Text> : null}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.Background_color }}>
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: Colors.Background_color }}>
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
          }}
        >
          <Text style={styles.screenHeading}>Progress</Text>
          <View style={styles.ProfileContainer}>
            <View style={{ maxWidth: responsiveScreenWidth(70) }}>
              <Text style={styles.profileName}>{user?.fullName}</Text>
              <Text style={styles.ProfileText}>
                {totalResults?.totalObtainedMark} out of {totalResults?.totalMark}
              </Text>
              <Text style={styles.ProfileText}>Overall Progress {totalResults?.overallPercentageAllItems}%</Text>
            </View>
            <View style={{ height: "100%", justifyContent: "center" }}>
              <AnimatedProgressWheel
                size={responsiveScreenWidth(20)}
                width={responsiveScreenWidth(2.5)}
                color={Colors.PureWhite}
                progress={totalResults?.overallPercentageAllItems || 0}
                backgroundColor={"#3cb435" || "black"}
                rotation={"-90deg"}
                showProgressLabel={true}
                rounded={true}
                labelStyle={styles.profileProgressLabel}
                showPercentageSymbol={true}
              />
            </View>
          </View>
        </View>
        <View style={styles.dayTwoDayAndReviewContainer}>
          <PrograssItem
            // key={item?._id}
            clickable={"DayToDayActivities"}
            title={"Day-to-Day Activities"}
            percentage={(dayToday?.count / dayToday?.limit) * 100 || 0}
            details1={`${dayToday?.count || 0} out of ${dayToday?.limit || 0}`}
          />
          {/* <PrograssItem
            // key={item?._id}
            title={"Reviews"}
            percentage={(review?.results?.totalReviews / 100) * 100 || 0}
            details1={`${review?.results?.totalReviews} out of ${100}`}
          /> */}
        </View>
        <TechnicalTestProgress />
        <DocumentsProgress myUploadedDocuments={myUploadedDocuments} />
        <CalendarProgress />
        <OtherActivitiesProgress
          showNTell={showNTell}
          community={community}
          mockInterview={mockInterview}
          myUploadedDocuments={myUploadedDocuments}
        />
        <MessageProgress message={message} />

        {/* {myprogress?.map((item) => {
          return (
            <PrograssItem
              key={item?._id}
              title={item.title}
              percentage={item.count}
              details1={`${item.count} out of ${item.limit}`}
            />
          );
        })} */}
      </View>
    </ScrollView>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    dayTwoDayAndReviewContainer: {
      flexDirection: "row",
      gap: 10,
    },
    screenHeading: {
      marginBottom: responsiveScreenHeight(1.5),
      textAlign: "left",
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.3),
      color: Colors.Heading,
    },
    ProfileText: {
      color: Colors.PureWhite,
      marginTop: responsiveScreenHeight(0.3),
      fontFamily: CustomFonts.REGULAR,
    },
    profileProgressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.PureWhite,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(2.5),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.PureWhite,
    },
    ProfileContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: 10,
      justifyContent: "space-between",
      flexDirection: "row",
      gap: responsiveScreenWidth(5),
      height: responsiveScreenHeight(15),
      marginBottom: 10,
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(5),
    },
    container: {
      flex: 1,
      flexDirection: "row", // New property
      flexWrap: "wrap", // New property
      alignItems: "center",
      justifyContent: "space-around", // Ensures even spacing
      paddingBottom: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(3),
      backgroundColor: Colors.Background_color,
      // minHeight: ,
    },
    prograssContainer: {
      width: responsiveScreenWidth(95),
      // height: responsiveScreenHeight(35), // Adjusted width
      // backgroundColor: Colors.White,
      // marginTop: responsiveScreenHeight(1),
      // borderRadius: 10,
      // paddingBottom: responsiveScreenHeight(2),
      backgroundColor: Colors.White,
      marginVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      padding: 20,
      zIndex: -10,
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      // marginTop: responsiveScreenHeight(1.5),
      // marginHorizontal: responsiveScreenWidth(2),
      width: "80%",
      color: Colors.Heading,
      textAlign: "center",
    },
    progress: {
      alignSelf: "center",
      marginTop: responsiveScreenHeight(1),
    },
    progressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.9),
      color: Colors.Primary,
    },
    details: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(0.5),
      textAlign: "center",
    },
    pieSectionContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    pieDetails: {
      width: responsiveScreenWidth(60),
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    circle: {
      width: responsiveScreenWidth(4),
      height: responsiveScreenWidth(4),
      backgroundColor: Colors.Primary,
      borderRadius: 20,
    },
    pieSection: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      // marginLeft: responsiveScreenWidth(2),
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      zIndex: 10,
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
  });
