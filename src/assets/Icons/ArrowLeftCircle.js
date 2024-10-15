import * as React from "react";
import Svg, { G, Circle, Path, Defs } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function ArrowLeftCircle(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_d_3_50427)">
        <Circle cx={20} cy={20} r={12} fill={Colors.BodyTextOpacity} />
      </G>
      <Path
        d="M19.333 23.33L16 19.998l3.333-3.333M23.997 23.33l-3.333-3.333 3.333-3.333"
        stroke={Colors.BodyText}
        strokeOpacity={0.5}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default ArrowLeftCircle;
