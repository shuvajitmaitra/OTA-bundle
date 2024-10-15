import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomeFonts from '../../constants/CustomeFonts';
import {useTheme} from '../../context/ThemeContext';

export default function CustomeBtn({
  handlePress = () => {},
  title = 'Button Title',
  customeContainerStyle,
  isLoading,
  disable,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  /*
 
handlePress = {() => {} }
title = "Button Title"
customeContainerStyle={{ flex: 0.3, height: 30, borderRadius: 4, marginTop: 0 }}
isLoading={{}}
disable={{}}


 */
  return (
    <TouchableOpacity
      disabled={isLoading ? isLoading : disable ? disable : null}
      onPress={handlePress}
      style={{
        ...styles.btnContainer,
        ...customeContainerStyle,
        ...{
          backgroundColor: disable
            ? Colors.DisablePrimaryBackgroundColor
            : Colors.Primary,
        },
      }}
      activeOpacity={0.7}>
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
              color: disable
                ? Colors.DisablePrimaryButtonTextColor
                : Colors.PureWhite,
            },
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    btnContainer: {
      width: '100%',
      height: responsiveScreenHeight(5.5),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      marginTop: responsiveScreenHeight(2),
      borderRadius: 10,
    },
    btnText: {
      color: Colors.PureWhite,
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
    },
  });
