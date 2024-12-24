import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';

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
  const Colors = useTheme();
  const styles = getStyles(Colors);
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

const getStyles = Colors =>
  StyleSheet.create({
    buttonText: {
      fontFamily: CustomFonts.MEDIUM,
    },
    buttonOulined: {
      width: '50%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      color: Colors.Primary,
      borderColor: Colors.Primary,
      borderWidth: 1,
      overFlow: 'hidden',
      marginTop: 15,
    },
  });
export default MyButton;
