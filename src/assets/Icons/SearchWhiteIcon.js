import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SearchWhiteIcon({ color, ...props }) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 15 15" fill="none" {...props}>
      <Path
        d="M14 14l-3.753-3.753m0 0a5.417 5.417 0 10-7.66-7.66 5.417 5.417 0 007.66 7.66v0z"
        stroke={color || "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SearchWhiteIcon;
