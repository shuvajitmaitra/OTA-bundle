import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ArrowLeft from '../../assets/Icons/ArrowLeft';

const GlobalBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backButton}>
      <ArrowLeft />
      <Text>Back</Text>
    </TouchableOpacity>
  );
};

export default GlobalBackButton;

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 20,
    // backgroundColor: 'red',
    width: responsiveScreenWidth(25),
  },
});
