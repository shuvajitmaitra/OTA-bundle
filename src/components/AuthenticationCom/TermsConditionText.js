import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';

export default function TermsConditionText({text}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return <Text style={styles.terms}>{text}</Text>;
}

const getStyles = Colors =>
  StyleSheet.create({
    terms: {
      width: responsiveScreenWidth(75),
      alignSelf: 'center',
      textAlign: 'center',
      marginTop: responsiveScreenHeight(3),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      marginBottom: responsiveScreenHeight(3),
    },
  });
