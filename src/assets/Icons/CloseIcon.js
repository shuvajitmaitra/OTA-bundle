import * as React from "react";
import Svg, { G, Circle, Path, Defs } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function CloseIcon(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg
      width={28}
      height={28}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G opacity={0.15} filter="url(#filter0_b_529_3335)">
        <Circle cx={16} cy={16} r={16} fill={Colors.BodyText} />
      </G>
      <Path
        d="M20.48 12.16l-8.32 8.32M20.48 20.48l-8.32-8.32"
        stroke={Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default CloseIcon;
