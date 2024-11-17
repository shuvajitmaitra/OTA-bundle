import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function BusyStatusIcon({size, color, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 15}
      height={size || 15}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M16 8A8 8 0 110 8a8 8 0 0116 0z" fill={color || Colors.Red} />
    </Svg>
  );
}

export default BusyStatusIcon;
