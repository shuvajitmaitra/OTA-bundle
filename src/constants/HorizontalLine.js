import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from '../context/ThemeContext';

const HorizontalLine = ({
  width = '100%',
  color,
  borderWidth = 1,
  marginVertical,
}) => {
  const Colors = useTheme();
  const styles = getStyles({
    Colors,
    width,
    color,
    borderWidth,
    marginVertical,
  });

  return <View style={styles.horizontalLine} />;
};

export default HorizontalLine;

const getStyles = ({Colors, width, color, borderWidth, marginVertical}) =>
  StyleSheet.create({
    horizontalLine: {
      borderBottomWidth: borderWidth,
      width: width,
      marginVertical: marginVertical || 20,
      alignSelf: 'center',
      borderColor: color || Colors.BodyTextOpacity,
    },
  });
