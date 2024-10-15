import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import CustomeBtn from "../../AuthenticationCom/CustomeBtn";
import { responsiveScreenWidth } from "react-native-responsive-dimensions";
import { Colors } from "react-native/Libraries/NewAppScreen";
import CustomeFonts from "../../../constants/CustomeFonts";
import { RegularFonts } from "../../../constants/Fonts";
import { useTheme } from "../../../context/ThemeContext";

const AiButtonContainer = ({ onCancelPress, generatePrompt }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <TouchableOpacity
        onPress={() => {
          generatePrompt();
        }}
        style={[styles.buttonContainer, { backgroundColor: Colors.PrimaryOpacityColor }]}
      >
        <Text style={[styles.buttonText, { color: Colors.Primary }]}>Generate</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onCancelPress();
        }}
        style={[styles.buttonContainer, { backgroundColor: Colors.Red }]}
      >
        <Text style={[styles.buttonText, { color: Colors.PureWhite }]}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={[styles.buttonContainer, { backgroundColor: Colors.LightRed }]}>
        <Text style={[styles.buttonText, { color: Colors.Red }]}>Undo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={[styles.buttonContainer, { backgroundColor: Colors.Primary }]}>
        <Text style={[styles.buttonText, { color: Colors.PureWhite }]}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AiButtonContainer;

const getStyles = (Colors) =>
  StyleSheet.create({
    buttonContainer: {
      flex: 1,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
      backgroundColor: Colors.Primary,
    },
    buttonText: {
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: RegularFonts.HS,
      color: Colors.PureWhite,
    },
  });
