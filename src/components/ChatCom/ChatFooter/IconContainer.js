import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import MicIcon from '../../../assets/Icons/MicIcon';
import GalleryIcon from '../../../assets/Icons/GalleryIcon';
import ImageGallery from './ImageGallery';

const IconContainer = ({setStartRecording, selectImage}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={styles.button}>
        <GalleryIcon size={23} />
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
