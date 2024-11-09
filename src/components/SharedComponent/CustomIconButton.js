import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';

export default function CustomIconButton({
  handlePress = () => {},
  title = 'Button Title',
  customContainerStyle,
  isLoading = false,
  disable = false,
  icon = null, // Expecting an icon component passed as prop
  iconPosition = 'left', // Option to place icon on left or right
  background = '',
  color = '',
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  /* 
handlePress = {() => {}}
title = "Button Title"
customContainerStyle={{}}
isLoading = {false}
disable = {false}
icon = {null} // Expecting an icon component passed as prop
iconPosition = {"left"}// Option to place icon on left or right


*/
  return (
    <TouchableOpacity
      disabled={isLoading || disable}
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.btnContainer,
        customContainerStyle,
        {
          backgroundColor:
            background || disable
              ? Colors.DisablePrimaryBackgroundColor
              : Colors.Primary,
        },
      ]}>
      {icon && iconPosition === 'left' && <>{icon}</>}

      {isLoading ? (
        <ActivityIndicator
          color={Colors.PureWhite}
          animating={true}
          size="large"
          style={{marginRight: 5}}
        />
      ) : (
        <Text
          style={[
            styles.btnText,
            {
              color:
                color || disable
                  ? Colors.DisablePrimaryButtonTextColor
                  : Colors.PureWhite,
            },
          ]}>
          {title}
        </Text>
      )}

      {icon && iconPosition === 'right' && <>{icon}</>}
    </TouchableOpacity>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    btnContainer: {
      width: '100%',
      height: responsiveScreenHeight(5.5),
      alignSelf: 'center',
      justifyContent: 'center',
      marginTop: responsiveScreenHeight(2),
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
    },
    btnContent: {},
    btnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.HR,
    },
  });
