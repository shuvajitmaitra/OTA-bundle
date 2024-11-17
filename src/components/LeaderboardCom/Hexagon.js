import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomFonts from "../../constants/CustomFonts";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";

const Hexagon = ({ text, color = "blue" }) => {
  return (
    <View style={styles.hexagon}>
      <View style={[styles.hexagonInner, { backgroundColor: color }]}>
        <Text style={styles.hexagonText}>{text}</Text>
      </View>
      <View style={[styles.hexagonBefore, { borderBottomColor: color }]} />
      <View style={[styles.hexagonAfter, { borderTopColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  // hexagon: {
  //   width: 40,
  //   height: 20,
  //   marginTop: 13,
  // },
  // hexagonInner: {
  //   width: 40,
  //   height: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // hexagonText: {
  //   color: "white",
  //   fontFamily: CustomFonts.SEMI_BOLD,
  //   fontSize: responsiveScreenFontSize(2.4),
  //   textAlign: "center",
  //   marginTop: -7,
  // },
  // hexagonBefore: {
  //   position: "absolute",
  //   top: -11,
  //   left: 0,
  //   width: 0,
  //   height: 0,
  //   borderLeftWidth: 20, // Adjust borderLeftWidth
  //   borderLeftColor: "transparent",
  //   borderRightWidth: 20, // Adjust borderRightWidth
  //   borderRightColor: "transparent",
  //   borderBottomWidth: 11, // Adjust borderBottomWidth
  // },
  // hexagonAfter: {
  //   position: "absolute",
  //   bottom: -11, // Adjust bottom
  //   left: 0,
  //   width: 0,
  //   height: 0,
  //   borderLeftWidth: 20, // Adjust borderLeftWidth
  //   borderLeftColor: "transparent",
  //   borderRightWidth: 20, // Adjust borderRightWidth
  //   borderRightColor: "transparent",
  //   borderTopWidth: 11, // Adjust borderTopWidth
  // },

  hexagon: {
    width: responsiveScreenWidth(10), // Adjust width
    height: responsiveScreenWidth(8), // Adjust height to match hexagon shape
    marginTop: responsiveScreenHeight(1.3),
  },
  hexagonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  hexagonText: {
    color: "white",
    fontFamily: CustomFonts.SEMI_BOLD,
    fontSize: responsiveScreenFontSize(2.4),
    textAlign: "center",
    // Adjust margin or remove if it's causing misalignment
  },
  hexagonBefore: {
    position: "absolute",
    top: -responsiveScreenWidth(2.7),
    left: 0,
    width: 0,
    height: 0,
    borderLeftWidth: responsiveScreenWidth(5),
    borderLeftColor: "transparent",
    borderRightWidth: responsiveScreenWidth(5),
    borderRightColor: "transparent",
    borderBottomWidth: responsiveScreenWidth(2.7),
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -responsiveScreenWidth(2.6),
    left: 0,
    width: 0,
    height: 0,
    borderLeftWidth: responsiveScreenWidth(5),
    borderLeftColor: "transparent",
    borderRightWidth: responsiveScreenWidth(5),
    borderRightColor: "transparent",
    borderTopWidth: responsiveScreenWidth(2.7),
  },
});

export default Hexagon;
