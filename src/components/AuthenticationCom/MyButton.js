import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import color from '../../constants/color';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
// import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const MyButton = ({
  bg,
  colour,
  onPress,
  title,
  width,
  activeOpacity,
  height,
  borderRadius,
  fontSize,
  flex,
  disable,
}) => {
  const buttonWidth = width || '48%';
  const buttonActiveOpacity = activeOpacity || 0.5;
  return (
    <TouchableOpacity
      style={[
        {
          flex: flex || 1,
          height: height || 48,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: borderRadius || 10,
          flexDirection: 'row',
          backgroundColor: bg,
          width: buttonWidth,
        },
      ]}
      disabled={disable}
      onPress={onPress}
      activeOpacity={buttonActiveOpacity}>
      <Text
        style={[
          styles.buttonText,
          {color: colour, fontSize: fontSize || responsiveScreenFontSize(2)},
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: CustomFonts.MEDIUM,
  },
  buttonOulined: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    color: color.primary,
    borderColor: color.primary,
    borderWidth: 1,
    marginTop: 15,
  },
});
export default MyButton;
