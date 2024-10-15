import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';

const Divider = ({marginTop, marginBottom, style}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const dividerMarginTop = marginTop || 2;
  const dividerMarginBottom = marginBottom || 2;
  const Colors = useTheme();
  const styles = getStyles(Colors, dividerMarginTop, dividerMarginBottom);
  return <View style={[styles.dividerMain, style]}></View>;
};

export default Divider;

const getStyles = (Colors, dividerMarginTop, dividerMarginBottom) =>
  StyleSheet.create({
    dividerMain: {
      borderTopWidth: 1,
      borderTopColor: Colors.LineColor,
      marginTop: responsiveScreenHeight(dividerMarginTop),
      marginBottom: responsiveScreenHeight(dividerMarginBottom),
    },
  });
