import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import MicIcon from '../../../assets/Icons/MicIcon';
import GallaryIcon from '../../../assets/Icons/GallaryIcon';
import ImageGallery from './ImageGallery';

const IconContainer = ({setOpenGallery, selectImage}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // onPress={() => setOpenGallery(true)}
        style={styles.button}>
        <MicIcon size={25} />
      </TouchableOpacity>
      <TouchableOpacity onPress={selectImage} style={styles.button}>
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
