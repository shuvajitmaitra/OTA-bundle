import * as React from "react";
import Svg, { G, Circle, Path, Defs } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function MessageIconLive(props) {
  const Colors = useTheme();
  return (
    <Svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_d_725_9302)">
        <Circle cx={30} cy={30} r={20} fill={Colors.White} />
      </G>
      <Path
        d="M40 28v3c0 4-2 6-6 6h-.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.53-.4-.8-.4H26c-4 0-6-1-6-6v-5c0-4 2-6 6-6h6"
        stroke={Colors.BodyText}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M37.5 25a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="#27AC1F" />
      <Path
        d="M33.996 29h.01M29.995 29h.01M25.994 29h.01"
        stroke={Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs></Defs>
    </Svg>
  );
}

export default MessageIconLive;
