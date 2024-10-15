import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import SendIcon from '../../../assets/Icons/SendIcon';

const SendContainer = ({sendMessage}) => {
  return (
    <TouchableOpacity onPress={sendMessage}>
      <SendIcon />
    </TouchableOpacity>
  );
};

export default SendContainer;

const styles = StyleSheet.create({});
