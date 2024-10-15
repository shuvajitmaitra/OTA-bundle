import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import ReactNativeModal from "react-native-modal";
import { useTheme } from "../../context/ThemeContext";
import { responsiveHeight } from "react-native-responsive-dimensions";

const FullScreenModal = ({ isVisible, children }) => {
  const Colors = useTheme();
  return (
    <ReactNativeModal
      isVisible={isVisible}
      // backdropColor={Colors.Red}
      backdropOpacity={1}
      style={{
        margin: 0,
        // minHeight: responsiveHeight(120),
        // flexDirection: "column",
        // justifyContent: "flex-start",
        // alignItems: "center",
      }}
    >
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={
          Colors.Background_color === "#F5F5F5"
            ? "dark-content"
            : "light-content"
        }
      />

      {children}
      {/* <View
        style={{
          backgroundColor: "green",
        }}
      >
      </View> */}
    </ReactNativeModal>
  );
};

export default FullScreenModal;
