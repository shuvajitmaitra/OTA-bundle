import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';

const SectionHeading = ({heading, text}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      {text && <Text style={styles.description}>{text}</Text>}
    </View>
  );
};

export default SectionHeading;

const getStyles = Colors =>
  StyleSheet.create({
    description: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    heading: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    container: {
      backgroundColor: Colors.PrimaryOpacityColor,
      //   backgroundColor: "red",
      padding: 10,
      borderRadius: 4,
    },
  });
