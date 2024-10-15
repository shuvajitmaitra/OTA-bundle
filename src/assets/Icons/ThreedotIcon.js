import * as React from "react";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
const ThreedotIcon = (props) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={4}
      height={18}
      fill="none"
      {...props}
    >
      <Circle cx={2} cy={2} r={2} fill={Colors.BodyText} />
      <Circle cx={2} cy={9} r={2} fill={Colors.BodyText} />
      <Circle cx={2} cy={16} r={2} fill={Colors.BodyText} />
    </Svg>
  );
};
export default ThreedotIcon;
