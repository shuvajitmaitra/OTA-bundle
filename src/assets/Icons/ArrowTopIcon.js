import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function ArrowTopIcon({size, color, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M7 14.5l5-5 5 5"
        stroke={color || Colors.Primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowTopIcon;
