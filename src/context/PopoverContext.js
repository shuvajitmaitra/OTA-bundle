// PopoverContext.js
import React, {createContext, useState, useRef} from 'react';
import Popover from '../components/SharedComponent/Popover/Popover';

export const PopoverContext = createContext();

export const PopoverProvider = ({children}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [popoverContent, setPopoverContent] = useState(null);
  const [position, setPosition] = useState({top: 0, left: 0});
  const popoverRef = useRef();
  console.log('isVisible', JSON.stringify(isVisible, null, 1));
  const showPopover = (content, ref) => {
    ref.current.measure((fx, fy, width, height, px, py) => {
      setPosition({top: py + height, left: px});
      setPopoverContent(content);
      setIsVisible(!isVisible);
    });
  };

  const hidePopover = () => {
    setIsVisible(!isVisible);
    setPopoverContent(null);
  };

  return (
    <PopoverContext.Provider value={{showPopover, hidePopover}}>
      {children}
      {isVisible && (
        <Popover
          isVisible={isVisible}
          from={popoverRef.current}
          onRequestClose={hidePopover}
          position={position}
          content={popoverContent}
        />
      )}
    </PopoverContext.Provider>
  );
};
