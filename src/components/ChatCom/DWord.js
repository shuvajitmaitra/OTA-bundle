import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function DWordIcon(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="iconify iconify--emojione-monotone"
      {...props}
      fill={Colors.BodyText}>
      <Path d="M32.202 22.531h-5.6v18.938h5.6c2.865 0 4.862-1.41 5.993-4.232.617-1.549.927-3.393.927-5.531 0-2.953-.464-5.221-1.39-6.801-.927-1.583-2.77-2.374-5.53-2.374" />
      <Path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2m10.959 39.094c-2.102 3.609-5.346 5.414-9.732 5.414H20.716V17.492h12.511c1.799.025 3.297.236 4.492.629 2.035.67 3.684 1.896 4.944 3.682 1.012 1.443 1.7 3.006 2.068 4.686s.552 3.281.552 4.803c0 3.858-.774 7.126-2.324 9.802" />
    </Svg>
  );
}

export default DWordIcon;
