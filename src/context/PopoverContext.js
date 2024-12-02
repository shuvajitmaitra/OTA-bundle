import React, {createContext, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

export const PopoverContext = createContext();

export const PopoverProvider = ({children}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [popoverContent, setPopoverContent] = useState(null);
  const [position, setPosition] = useState({top: 0, left: 0});

  const showPopover = (content, ref, placement = 'bottom') => {
    // Hide any existing popover before showing the new one
    setPopoverContent(null); // Clear the previous content
    setIsVisible(false); // Hide the current modal if it's visible

    // Wait a small moment for the modal to hide before showing the new one
    setTimeout(() => {
      ref.current.measure((fx, fy, width, height, px, py) => {
        let newPosition = {top: 0, left: 0};
        console.log('fx', JSON.stringify(fx, null, 1));
        console.log('fy', JSON.stringify(fy, null, 1));
        console.log('width', JSON.stringify(width, null, 1));
        console.log('height', JSON.stringify(height, null, 1));
        console.log('px', JSON.stringify(px, null, 1));
        console.log('py', JSON.stringify(py, null, 1));

        // Determine the popover position based on placement
        switch (placement) {
          case 'top':
            newPosition = {top: py, left: px};
            break;
          case 'bottom':
            newPosition = {top: py + height, left: px};
            break;
          case 'left':
            newPosition = {top: py, left: px};
            break;
          case 'right':
            newPosition = {top: py, left: px + width};
            break;
          default:
            newPosition = {top: py + height, left: px};
            break;
        }

        setPosition(newPosition);
        setPopoverContent(content);
        setIsVisible(true);
      });
    }, 10);
  };

  const hidePopover = () => {
    // Hide popover immediately, and reset content for next show
    setIsVisible(false);
    setPopoverContent(null);
  };

  return (
    <PopoverContext.Provider value={{showPopover, hidePopover}}>
      {children}
      {
        <ReactNativeModal
          visible={isVisible}
          transparent
          animationType="fade"
          style={{margin: 0}}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={hidePopover}>
            <View
              style={[
                styles.popover,
                {top: position.top, left: position.left},
              ]}>
              <View style={styles.arrow} />
              <View style={styles.popoverContent}>{popoverContent}</View>
            </View>
          </TouchableOpacity>
        </ReactNativeModal>
      }
    </PopoverContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popover: {
    position: 'absolute',
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
    backgroundColor: '#fff', // Set the background color or any other styling you need
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
});
