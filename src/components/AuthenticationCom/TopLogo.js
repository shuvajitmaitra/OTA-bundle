import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomeFonts from '../../constants/CustomeFonts';
import {useTheme} from '../../context/ThemeContext';

export default function TopLogo({title = 'Write the Tittle', height}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <>
      <View
        style={[
          styles.logoContainer,
          {
            minHeight:
              responsiveScreenHeight(height) || responsiveScreenHeight(30),
          },
        ]}>
        <Image
          source={
            Colors.Background_color === '#F5F5F5'
              ? require('../../assets/ApplicationImage/logo-regular.png')
              : require('../../assets/ApplicationImage/logo-dark.png')
          }
          style={styles.logo}
        />
        <Text style={styles.text}>{title}</Text>
      </View>
    </>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    logoContainer: {
      alignSelf: 'center',
      // backgroundColor: "red",
      // position: "relative",
      // marginTop: responsiveScreenHeight(-5),
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: responsiveScreenFontSize(35),
      height: responsiveScreenFontSize(10),
      resizeMode: 'contain',
      marginBottom: responsiveScreenHeight(2),
    },
    text: {
      alignSelf: 'center',
      // position: "absolute",
      color: Colors.Heading,
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.7),
      // marginTop: responsiveScreenHeight(1),
      // marginBottom: responsiveScreenHeight(2),
      // top: "65%",
    },
  });
