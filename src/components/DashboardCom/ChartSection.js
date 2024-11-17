import React from "react";
import { View } from "react-native";
import MyButton from "../AuthenticationCom/MyButton";
import { StyleSheet } from "react-native";
import CustomFonts from "../../constants/CustomFonts";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";

const ChartSection = ({ onPress, Colors, Component, title, width, height, fontSize }) => {
  const styles = getStyles(Colors);

  return (
    <View style={styles.chartContainer}>
      <Component />
      <View style={styles.btn}>
        <MyButton
          onPress={() => onPress()}
          borderRadius={4}
          title={title}
          bg={Colors.PrimaryOpacityColor}
          colour={Colors.Primary}
          width={width}
          height={height}
          fontSize={fontSize}
        />
      </View>
    </View>
  );
};

export default ChartSection;
const getStyles = (Colors) =>
  StyleSheet.create({
    chartContainer: {
      backgroundColor: Colors.White,
      padding: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(2),
      marginHorizontal: responsiveScreenWidth(2),
    },
    btn: {
      flexDirection: "column",
      alignItems: "center",
      marginTop: responsiveScreenHeight(2),
      paddingTop: responsiveScreenHeight(2),
      borderTopColor: Colors.BorderColor,
      borderTopWidth: 1,
    },
  });
