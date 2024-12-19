import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const LockIcon = ({size, color, ...props}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      fill="none"
      {...props}>
      <Path
        stroke={color || '#fff'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2M12 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      />
      <Path
        stroke={color || '#fff'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 22H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5Z"
      />
    </Svg>
  );
};
export default LockIcon;
