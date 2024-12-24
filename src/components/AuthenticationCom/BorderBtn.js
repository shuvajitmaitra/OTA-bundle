import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';

export default function BorderBtn({handlePress, title}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.btnContainer}
      activeOpacity={0.7}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    btnContainer: {
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(5.5),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.White,
      marginTop: responsiveScreenHeight(3),
      borderRadius: 10,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.Primary,
    },
    btnText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
    },
  });
