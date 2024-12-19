import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function BranchIcon({size, color, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="iconify iconify--emojione-monotone"
      fill={color || Colors.BodyText}
      {...props}>
      <Path d="M36.929 34.225c-.688-.315-1.654-.479-2.899-.492h-7.143v7.736h7.045c1.258 0 2.238-.171 2.938-.512 1.271-.631 1.907-1.838 1.907-3.623 0-1.509-.616-2.545-1.848-3.109M37.008 28.211c.785-.479 1.179-1.329 1.179-2.55 0-1.352-.52-2.244-1.558-2.677-.896-.303-2.04-.453-3.43-.453h-6.313v6.397h7.053c1.26.001 2.284-.239 3.069-.717" />
      <Path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2m11.607 40.374a7.996 7.996 0 01-2.055 2.283c-.927.709-2.02 1.194-3.279 1.457-1.259.263-2.625.394-4.1.394H21.1V17.492h14.023c3.537.052 6.044 1.082 7.52 3.09.888 1.234 1.332 2.71 1.332 4.43 0 1.771-.449 3.195-1.344 4.271-.502.604-1.238 1.154-2.214 1.653 1.481.538 2.599 1.392 3.353 2.56.753 1.168 1.13 2.585 1.13 4.252-.001 1.719-.431 3.261-1.293 4.626" />
    </Svg>
  );
}

export default BranchIcon;
