import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { useTheme } from "../../context/ThemeContext";
import UpDownIcon from "../../assets/Icons/UpDownIcon";
import CustomeFonts from "../../constants/CustomeFonts";
import CheckMarkIcon from "../../assets/Icons/CheckMarkIcon";

const CustomDropDownTwo = ({
  data,
  state,
  setState,
  width,
  placeholder,
  flex,
  
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [itemVisible, setItemVisible] = useState(false);
  const itemWidth = responsiveScreenWidth(width) || responsiveScreenWidth(30);
  

  return (
    <View style={[styles.mainContainer, { flex: flex }]}>
      <TouchableOpacity
        onPress={() => setItemVisible((pre) => !pre)}
        style={[styles.container]}
      >
        <Text numberOfLines={1} style={styles.dropDownText}>
          {state ? state : placeholder}
        </Text>
        <UpDownIcon size={15} />
      </TouchableOpacity>

      {itemVisible && (
        <View style={[styles.itemContainer, { width: "100%" }]}>
          {data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setState(item);
                setItemVisible((pre) => !pre);
              }}
              style={[
                state === item ? styles.activeText : styles.itemDropDownText,
                ,
              ]}
            >
              {state === item ? <CheckMarkIcon /> : null}
              <Text
                style={{
                  fontFamily: CustomeFonts.REGULAR,
                  color: state === item ? Colors.PureWhite : Colors.BodyText,
                  fontSize: responsiveScreenFontSize(2),
                  textTransform: "capitalize"
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomDropDownTwo;

const getStyles = (Colors) =>
  StyleSheet.create({
    activeText: {
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
      minWidth: 100,
      paddingHorizontal: responsiveScreenWidth(1),
      paddingVertical: responsiveScreenHeight(1),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      textTransform: "capitalize",
    },
    mainContainer: {
      position: "relative",
      zIndex: 1,
      // backgroundColor: "red",
    },
    dropDownText: {
      fontFamily: CustomeFonts.REGULAR,
      color: Colors.BodyText,
      textTransform: "capitalize",
      paddingVertical: responsiveScreenHeight(0.7),
      flex: 0.8,
      fontSize: responsiveScreenFontSize(2),
    },
    itemDropDownText: {
      fontFamily: CustomeFonts.REGULAR,
      color: Colors.BodyText,
      textTransform: "capitalize",
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1),
    },
    container: {
      flex: 1,
      minHeight: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: Colors.White,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    itemContainer: {
      position: "absolute",
      zIndex: 1,
      top: responsiveScreenHeight(5),
      //   marginTop: responsiveScreenHeight(-10),
      flex: 1,
      minHeight: responsiveScreenHeight(2),
      backgroundColor: Colors.White,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      justifyContent: "space-between",
    },
  });
