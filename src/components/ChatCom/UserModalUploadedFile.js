import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

import ArrowRight from "../../assets/Icons/ArrowRight";
import ArrowDown from "../../assets/Icons/ArrowDown";
import CustomeFonts from "../../constants/CustomeFonts";
import axiosInstance from "../../utility/axiosInstance";
import NoDataIcon from "../../assets/Icons/NotDataIcon";
import { useTheme } from "../../context/ThemeContext";
import FileIcon from "../../assets/Icons/FileIcon";
import Loading from "../SharedComponent/Loading";
import NoDataAvailable from "../SharedComponent/NoDataAvailable";
import { bytesToSize } from "./MessageHelper";

const timeFormate = (timestamp) => {
  const date = new Date(timestamp);
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const formattedTime = timeFormatter.format(date);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const formattedDate = dateFormatter.format(date);

  const result = `${formattedDate.replace(/\//g, ".")} at ${formattedTime}`;

  return result;
};

export default function UserModalUploadedFile({ chat }) {
  const [file, setFile] = React.useState();
  const [isLoading, setLoading] = useState(true);
  const [seeMoreClicked, setSeeMoreClicked] = useState(false);

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ensure loading state is true when starting to fetch data
      try {
        const response = await axiosInstance.post(`/chat/media/${chat?._id}`, {
          limit: 50,
          type: "file",
        });
        if (response.data && Array.isArray(response.data.medias)) {
          const reversedMedias = [...response.data.medias].reverse();
          setFile(reversedMedias);
        } else {
          setFile([]);
        }
      } catch (error) {
        console.error("Failed to fetch media:", error.message);
        setFile([]); // Optionally set media to an empty array or handle differently
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chat?._id]);

  const newFile = file?.length > 4 ? file.slice(0, 4) : file;
  const allFile = seeMoreClicked ? file : newFile;
  return (
    <View>
      {isLoading ? (
        <Loading />
      ) : (
        <View>
          {file?.length ? (
            allFile?.map((item, index) => (
              <View key={index} style={styles.subContainer}>
                <FileIcon />
                {/* <Image source={item.url} style={styles.image} /> */}
                <View style={styles.textContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.fileName}
                  >
                    {item.name}
                  </Text>
                  <View style={styles.sizeAndDateContainer}>
                    <ArrowDown />
                    <Text style={styles.sizeTimeText}>
                      {bytesToSize(item?.size)}
                    </Text>
                    <Text style={styles.sizeTimeText}>
                      {timeFormate(item?.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                minHeight: responsiveScreenHeight(30),
                minWidth: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.LightGreen,
                borderRadius: 10,
                marginBottom: responsiveScreenHeight(2),
              }}
            >
              <NoDataIcon />
            </View>
          )}
        </View>
      )}
      {file?.length > 4 && (
        <TouchableOpacity
          onPress={() => setSeeMoreClicked((prev) => !prev)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: responsiveScreenWidth(2),
          }}
        >
          <Text
            style={{
              color: "rgba(39, 172, 31, 1)",
              fontFamily: CustomeFonts.SEMI_BOLD,
              fontSize: responsiveScreenFontSize(1.8),
            }}
          >
            {seeMoreClicked ? "See Less" : "See More"}
          </Text>
          <ArrowRight />
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    subContainer: {
      flexDirection: "row",
      gap: responsiveScreenWidth(3),
      borderTopWidth: 1,
      borderTopColor: Colors.BorderColor,
      paddingVertical: responsiveScreenHeight(2.1),
      // backgroundColor: "green",
    },
    image: {
      width: responsiveScreenWidth(15),
      height: responsiveScreenWidth(15),
    },
    textContainer: {
      gap: responsiveScreenHeight(1),
    },
    fileName: {
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      width: responsiveScreenWidth(60),
      color: Colors.Heading,
      flexBasis: "40%",
    },
    sizeAndDateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsiveScreenWidth(1),
      width: responsiveScreenWidth(60),
      fontSize: responsiveScreenFontSize(1),
      flexWrap: "wrap",
    },
    sizeTimeText: {
      color: Colors.BodyText,
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
    },
  });
