import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";
import Divider from "../../components/SharedComponent/Divider";
import { useTheme } from "../../context/ThemeContext";
import CustomTabView from "../../components/PurchasedCom/CustomTabView";
import Header from "../../components/SharedComponent/Header";

const PurchasedScreen = () => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={Colors.Background_color === "#F5F5F5" ? "dark-content" : "light-content"}
      />
      <Text style={styles.headingText}>Purchased Item</Text>
      <Text style={styles.subHeading}>Explore Your Learning and Services</Text>
      {/* <Divider /> */}
      <CustomTabView />
    </View>
  );
};

export default PurchasedScreen;

const getStyles = (Colors) =>
  StyleSheet.create({
    headingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      // paddingBottom: responsiveScreenHeight(1),
    },
    container: {
      flex: 1,
      paddingHorizontal: responsiveScreenWidth(4.5),
      // paddingVertical: responsiveScreenWidth(3),
      backgroundColor: Colors.Background_color,
      // minHeight: "100%",
    },
    subHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      paddingBottom: responsiveScreenHeight(1.5),
    },
  });
