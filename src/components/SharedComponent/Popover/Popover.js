// Popover.js
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

const Popover = ({isVisible, from, onRequestClose, position, content}) => {
  return (
    <ReactNativeModal
      visible={isVisible}
      //   transparent
      //   animationType="fade"
      style={{margin: 0}}>
      <TouchableOpacity style={styles.modalBackground} onPress={onRequestClose}>
        <View
          style={[
            styles.popover,
            {top: position.top, left: position.left - 60},
          ]}>
          <View style={styles.arrow} />
          <View style={styles.popoverContent}>{content}</View>
        </View>
      </TouchableOpacity>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popover: {
    // position: 'absolute',
    // paddingTop: 10,
    width: responsiveScreenWidth(30),
  },
  arrow: {
    position: 'absolute',
    top: -10, // Position the arrow above the popover
    left: '50%', // Center the arrow (adjust based on popover width)
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  popoverContent: {
    // Additional styling if needed
    // backgroundColor: 'red',
  },
  closeText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
});

export default Popover;
