import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CustomModal = ({children, customStyles, onPress}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  return (
    <Pressable onPress={onPress} style={[styles.container, {paddingTop: top}]}>
      <View style={[styles.subContainer, customStyles]}>{children}</View>
    </Pressable>
  );
};

export default CustomModal;

const getStyles = Colors =>
  StyleSheet.create({
    subContainer: {
      backgroundColor: Colors.White,
      padding: 10,
      borderRadius: 4,
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
