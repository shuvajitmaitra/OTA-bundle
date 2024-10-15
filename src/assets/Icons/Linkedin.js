import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

function Linkedin(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28.87 28.87"
      {...props}
    >
      <Rect width={28.87} height={28.87} fill="#0b86ca" rx={6.48} ry={6.48} />
      <Path
        fill="#fff"
        d="M8 12h3v9.68H8zm1.53-4.81a1.74 1.74 0 11-1.74 1.75 1.74 1.74 0 011.74-1.75M12.92 12h2.89v1.32a3.16 3.16 0 012.85-1.56c3 0 3.61 2 3.61 4.61v5.31h-3V17c0-1.12 0-2.57-1.56-2.57s-1.8 1.22-1.8 2.48v4.79h-3z"
      />
    </Svg>
  );
}

export default Linkedin;
