import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function CrossIcon({ size, color, ...props }) {
  const Colors = useTheme();
  const iconSize = size || 11;
  const iconColor = color || Colors.BodyText;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9.48 1.16L1.16 9.48M9.48 9.48L1.16 1.16"
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default CrossIcon;
