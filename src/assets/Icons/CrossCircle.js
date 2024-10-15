import * as React from "react";
import Svg, { G, Circle, Path, Defs } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function CrossCircle({ color, size, ...props }) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const iconSize = size || 24;

  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_b_3125_7899)">
        <Circle
          cx={14}
          cy={14}
          r={14}
          fill={color || Colors.BodyText}
          fillOpacity={0.1}
        />
      </G>
      <Path
        d="M17.92 10.64l-7.28 7.28M17.922 17.92l-7.28-7.28"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default CrossCircle;
