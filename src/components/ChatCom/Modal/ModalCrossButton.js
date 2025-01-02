import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CrossCircle from '../../../assets/Icons/CrossCircle';

const ModalCrossButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <CrossCircle size={35} />
    </TouchableOpacity>
  );
};

export default ModalCrossButton;

const styles = StyleSheet.create({});
