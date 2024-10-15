import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MicIcon from '../../../assets/Icons/MicIcon';
import GallaryIcon from '../../../assets/Icons/GallaryIcon';

const IconContainer = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <MicIcon size={25} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <GallaryIcon size={23} />
      </TouchableOpacity>
    </View>
  );
};

export default IconContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 5,
    // backgroundColor: 'blue',
  },
});
