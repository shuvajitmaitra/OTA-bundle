import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";

import { useTheme } from "../../context/ThemeContext";

export default function ProgramTextDetails({ route }) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const params = route.params;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{params?.title}</Text>
      </View>
    </ScrollView>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: responsiveScreenWidth(5),
      marginBottom: responsiveScreenHeight(2),
    },
    title: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
      marginTop: responsiveScreenHeight(2),
      lineHeight: responsiveScreenHeight(2.5),
    },
  });
