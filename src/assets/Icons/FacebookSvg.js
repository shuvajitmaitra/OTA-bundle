import * as React from "react";
import Svg, { Path } from "react-native-svg";

function FacebookSvg(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <Path
        fill="#1976D2"
        fillRule="evenodd"
        d="M12 5.5H9v-2a1 1 0 011-1h1V0H9a3 3 0 00-3 3v2.5H4V8h2v8h3V8h2l1-2.5z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default FacebookSvg;
