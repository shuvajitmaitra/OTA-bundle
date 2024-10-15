import * as React from "react";
import Svg, { Rect } from "react-native-svg";

function UnCheckIcon(props) {
  return (
    <Svg
      width={23}
      height={22}
      viewBox="0 0 23 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={1.26465}
        y={0.5}
        width={21}
        height={21}
        rx={5.5}
        stroke="#546A7E"
        strokeOpacity={0.5}
      />
    </Svg>
  );
}

export default UnCheckIcon;
