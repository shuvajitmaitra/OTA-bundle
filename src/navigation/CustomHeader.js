import React from "react";

import { View, StyleSheet, Dimensions } from "react-native";
import DashboardTopPart from "../components/DashboardCom/DashboardTopPart";
const windowWidth = Dimensions.get("window").width;

const CustomHeader = ({ navigation, props }) => {
  return (
    <View style={styles.conatainer}>
      <DashboardTopPart />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  badgeIconView: {
    position: "relative",
    padding: 2,
  },
  badge: {
    color: "#fff",
    position: "absolute",
    zIndex: 10,
    top: 2,
    right: 5,
    padding: 1,
    // backgroundColor: "red",
    borderRadius: 5,
  },
  conatainer: {
    width: windowWidth - 20,
    marginBottom: 10,
  },
});
