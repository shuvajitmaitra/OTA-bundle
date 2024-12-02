import React, {useState, useRef} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Popover from 'react-native-popover-view';

function TestPopover() {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverRect, setPopoverRect] = useState(null);
  const buttonRef = useRef(null); // Create a ref to the button

  // Function to handle the button's layout and calculate its position
  const showPopoverWithPosition = () => {
    if (buttonRef.current) {
      // Use the measure method to get the button's position and size
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Calculate the position relative to the screen
        setPopoverRect({
          x: pageX,
          y: pageY + height, // Position popover just below the button
          width: width,
          height: height,
        });
      });
    }
    setShowPopover(true); // Show the popover after positioning
  };

  return (
    <View>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>

      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <TouchableOpacity ref={buttonRef} onPress={showPopoverWithPosition}>
        <Text>Press here to open popover!</Text>
      </TouchableOpacity>

      {popoverRect && (
        <Popover
          from={{
            x: popoverRect.x,
            y: popoverRect.y,
            width: popoverRect.width,
            height: popoverRect.height,
          }}
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}>
          <Text>This is the contents of the popover</Text>
        </Popover>
      )}
    </View>
  );
}

export default TestPopover;
