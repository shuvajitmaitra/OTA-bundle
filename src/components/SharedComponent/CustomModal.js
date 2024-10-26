import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CustomModal = ({children, customStyles, onPress, parentStyle}) => {
  const Colors = useTheme();
  const {top} = useSafeAreaInsets();
  const styles = getStyles(Colors, top);
  return (
    <Pressable onPress={onPress} style={[styles.container, parentStyle]}>
      <View style={[styles.subContainer, customStyles]}>{children}</View>
    </Pressable>
  );
};

export default CustomModal;

const getStyles = (Colors, top) =>
  StyleSheet.create({
    subContainer: {
      backgroundColor: Colors.White,
      padding: 10,
      borderRadius: 4,
      paddingTop: top,
    },
    container: {
      height: responsiveScreenHeight(100),
      position: 'absolute',
      backgroundColor: Colors.BackDropColor,
      zIndex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
