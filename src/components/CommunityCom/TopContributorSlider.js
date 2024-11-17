import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import ArrowLeft from "../../assets/Icons/ArrowLeft";
import ArrowRightWhite from "../../assets/Icons/ArrowRightWhite";
import ArrowLeftCircle from "../../assets/Icons/ArrowLeftCircle";
import ArrowRightCircle from "../../assets/Icons/ArrowRightCircle";
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useTheme } from "../../context/ThemeContext";
import { Image } from "react-native";
import CustomFonts from "../../constants/CustomFonts";
import axiosInstance from "../../utility/axiosInstance";
import Images from "../../constants/Images";

const TopContributorSlider = ({ handleTopContributor }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [contributors, setContributors] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    axiosInstance
      .get("/content/community/top-users")
      .then((res) => {
        if (res.data.success) {
          setContributors(res.data.users);
        }
      })
      .catch((error) => {
        console.log("error.response.data", JSON.stringify(error.response.data, null, 1));
      });
  }, []);
  const contributor = contributors[index];
  const n = contributor?.user?.fullName || "New User";
  let name = n.split(" ").slice(0, 3).join(" ");
  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };
  const handleNext = () => {
    if (index < contributors?.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <View style={styles.contributorsContainer}>
      <View style={styles.arrowContainer}>
        <TouchableOpacity activeOpacity={index == 0 ? 1 : 0} onPress={handlePrevious}>
          <ArrowLeftCircle />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={index == contributors.length - 1 ? 1 : 0} onPress={handleNext}>
          <ArrowRightCircle />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleTopContributor(contributor?.user?._id)} style={styles.dataContainer}>
        <Image
          source={
            contributor?.user?.profilePicture
              ? {
                  uri: contributor?.user?.profilePicture,
                }
              : Images.DEFAULT_IMAGE
          }
          style={styles.userImg}
        />
        <View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.time}>{`Total Posts: ${contributor?.count || 0}`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(TopContributorSlider);

const getStyles = (Colors) =>
  StyleSheet.create({
    time: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
    userName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(1),
    },
    dataContainer: {
      width: "100%",
      paddingVertical: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(5),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenFontSize(1),
      flexDirection: "row",
      gap: responsiveScreenWidth(4),
      // backgroundColor: "green",
    },
    userImg: {
      height: responsiveScreenFontSize(8),
      width: responsiveScreenFontSize(8),
      borderRadius: responsiveScreenFontSize(1),
      alignSelf: "flex-start",
    },
    contributorsContainer: {
      minHeight: responsiveScreenHeight(10),
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    arrowContainer: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      // backgroundColor: "pink",
      width: "110%",
      marginHorizontal: -100,
      zIndex: 10,
    },
  });
