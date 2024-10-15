import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';

const Loading = ({backgroundColor}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  if (backgroundColor) {
  }
  return (
    <View
      style={{
        flex: 1,
        minHeight: responsiveScreenHeight(30),
        maxHeight: responsiveScreenHeight(80),
        borderRadius: 10,
        minWidth: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: backgroundColor ? backgroundColor : Colors.White,
      }}>
      <ActivityIndicator size={50} animating={true} color={Colors.Primary} />
    </View>
  );
};

export default Loading;
