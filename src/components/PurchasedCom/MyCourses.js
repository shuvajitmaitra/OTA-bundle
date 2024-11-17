import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";
import axiosInstance from "../../utility/axiosInstance";
import Loading from "../SharedComponent/Loading";
import CoursesCard from "./CoursesCard";
import NoDataAvailable from "../SharedComponent/NoDataAvailable";

const MyCourses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const Colors = useTheme();
  const styles = getStyles(Colors);
  React.useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get("/order/myorder/course")
      .then((res) => {
        if (res.data.orders?.length !== 0) {
          setCourses(res.data.orders);
          setSelectedCourse(res.data.orders[0].course._id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("You got error", JSON.stringify(err, null, 1));
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Courses</Text>
      {isLoading ? (
        <View style={{ flex: 1, height: responsiveScreenHeight(60) }}>
          <Loading backgroundColor={"transparent"} />
        </View>
      ) : (
        <>
          {!courses.length ? (
            <View
              style={{
                // backgroundColor: "red",
                height: responsiveScreenHeight(60),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NoDataAvailable />
            </View>
          ) : (
            <View style={styles.cardContainer}>
              {courses.map((item) => (
                <CoursesCard key={item?._id} item={item} />
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default MyCourses;

const getStyles = (Colors) =>
  StyleSheet.create({
    cardContainer: {
      gap: 15,
    },
    container: {
      borderRadius: 10,
      minHeight: "100vh",
    },
    headingText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      marginBottom: responsiveScreenWidth(2),
    },
  });
