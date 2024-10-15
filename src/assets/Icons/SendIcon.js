import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SendIcon = ({ color }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} fill="none">
    <Path
      stroke={color || "#27AC1F"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M23.755 12.171H10.792M23.754 12.172l-15.91 7.66 2.946-7.66-2.946-7.66 15.91 7.66Z"
    />
  </Svg>
);
export default SendIcon;
