import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function BranchIcon({size, color, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      fill={color || Colors.Heading}
      stroke={Colors.Heading}
      strokeWidth={5}
      width={size || 25}
      height={size || 25}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M168 108h48a12.013 12.013 0 0012-12V48a12.013 12.013 0 00-12-12h-48a12.013 12.013 0 00-12 12v20h-12a28.031 28.031 0 00-28 28v28H84v-16a12.013 12.013 0 00-12-12H32a12.013 12.013 0 00-12 12v40a12.013 12.013 0 0012 12h40a12.013 12.013 0 0012-12v-16h32v28a28.031 28.031 0 0028 28h12v20a12.013 12.013 0 0012 12h48a12.013 12.013 0 0012-12v-48a12.013 12.013 0 00-12-12h-48a12.013 12.013 0 00-12 12v20h-12a20.022 20.022 0 01-20-20V96a20.022 20.022 0 0120-20h12v20a12.013 12.013 0 0012 12zm-92 40a4.004 4.004 0 01-4 4H32a4.004 4.004 0 01-4-4v-40a4.004 4.004 0 014-4h40a4.004 4.004 0 014 4zm88 12a4.004 4.004 0 014-4h48a4.004 4.004 0 014 4v48a4.004 4.004 0 01-4 4h-48a4.004 4.004 0 01-4-4zm0-112a4.004 4.004 0 014-4h48a4.004 4.004 0 014 4v48a4.004 4.004 0 01-4 4h-48a4.004 4.004 0 01-4-4z" />
    </Svg>
  );
}

export default BranchIcon;
