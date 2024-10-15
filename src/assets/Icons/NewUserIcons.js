import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function NewUserIcons(props) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={12} cy={8} r={4} fill={Colors.BorderColor3} />
      <Path
        d="M5.338 17.32C5.999 14.528 8.772 13 11.643 13h.714c2.871 0 5.644 1.527 6.305 4.32.128.541.23 1.107.287 1.682.055.55-.397.998-.949.998H6c-.552 0-1.004-.449-.949-.998.057-.575.159-1.14.287-1.681z"
        fill="#2A4157"
        fillOpacity={0.24}
      />
    </Svg>
  );
}

export default NewUserIcons;
