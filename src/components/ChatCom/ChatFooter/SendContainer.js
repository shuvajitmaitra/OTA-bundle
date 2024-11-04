import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import SendIcon from '../../../assets/Icons/SendIcon';
import SendIconTwo from '../../../assets/Icons/SendIconTwo';

const SendContainer = ({sendMessage}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={sendMessage}>
      <SendIcon size={30} />
    </TouchableOpacity>
  );
};

export default SendContainer;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    height: 50,
    justifyContent: 'center',
    minWidth: 40,
    alignItems: 'center',
    zIndex: 100,
  },
});
