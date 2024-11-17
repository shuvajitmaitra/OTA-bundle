import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";

import CustomFonts from "../../constants/CustomFonts";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";

export default function PresentationDetails() {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const naviation = useNavigation();

  const PresentationDetailsItem = ({ count, title, details }) => {
    if (details?.length > 95) {
      details = details.slice(0, 95) + "...";
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          naviation.navigate("PresentationDetailsView", {
            title: title,
          });
        }}
        style={styles.itemContainer}
      >
        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
        </View>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDetails}>
          {details}
          {details?.length > 95 ? <Text style={styles.readMore}>Read More</Text> : null}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Product Application Deployment</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PresentationDetailsItem
          details={
            "Lorem Ipsum is simply dummy text of the prin-ting and typesetting industry. Lorem Ipsum has been the Lorem Ipsum has been the"
          }
          count={1}
          title={"Introduction"}
        />
        <PresentationDetailsItem
          details={
            "Lorem Ipsum is simply dummy text of the prin-ting and typesetting industry. Lorem Ipsum has been the Lorem Ipsum has been the"
          }
          count={2}
          title={"Project Roadmap Summary"}
        />
        <PresentationDetailsItem
          details={
            "Lorem Ipsum is simply dummy text of the prin-ting and typesetting industry. Lorem Ipsum has been the Lorem Ipsum has been the"
          }
          count={3}
          title={"Launch an EC2 Instance"}
        />
        <PresentationDetailsItem
          details={
            "Lorem Ipsum is simply dummy text of the prin-ting and typesetting industry. Lorem Ipsum has been the Lorem Ipsum has been the"
          }
          count={4}
          title={"Project Roadmap Summary"}
        />
        <View style={{ marginBottom: responsiveScreenHeight(2) }}></View>
      </ScrollView>
    </View>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: responsiveScreenWidth(6),
    },
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      marginTop: responsiveScreenHeight(2),
    },
    itemContainer: {
      width: "100%",
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(2),
      backgroundColor: Colors.White,
      marginTop: responsiveScreenHeight(2),
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    countContainer: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      borderRadius: responsiveScreenWidth(5),
      backgroundColor: Colors.Primary,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    count: {
      color: Colors.White,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    itemTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      alignSelf: "center",
      marginTop: responsiveScreenHeight(1),
    },
    itemDetails: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      alignSelf: "center",
      marginTop: responsiveScreenHeight(1),
      textAlign: "center",
    },
    readMore: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
  });
