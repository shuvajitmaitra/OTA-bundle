import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowTopIcon(props) {
  return (
    <Svg
      width={14}
      height={8}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1 7l6-6 6 6"
        stroke="#27AC1F"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowTopIcon;
