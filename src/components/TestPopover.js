// TestPopover.js
import React, {useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {PopoverContext} from '../context/PopoverContext';

const TestPopover = () => {
  const buttonRef = useRef();
  const {showPopover, hidePopover} = useContext(PopoverContext);

  const handleShowPopover = () => {
    showPopover(
      <View>
        <Text>This is a global popojhdgjkl; \'ver!</Text>
      </View>,
      buttonRef,
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.button}
        onPress={handleShowPopover}>
        <Text style={styles.buttonText}>Show Global Popover</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#FF9500',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TestPopover;
