import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

function TranscribeIcon(props) {
  const { width = 13, height = 13, colors } = props;
  const Colors = useTheme();
  const color = colors || Colors.BodyText;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 518.727 518.728"
      xmlSpace="preserve"
      enableBackground="new 0 0 518.727 518.728"
      {...props}
    >
      <Path
        d="M454.222 56.416c-2.1 0-4.176.123-6.241.278-.51-.124-1.011-.278-1.558-.278H182.764c-40.91 0-74.505 33.595-74.505 74.505v271.51H5.375A6.368 6.368 0 000 397.807c0 40.902 33.595 74.505 74.505 74.505 1.528 0 2.883-.537 3.964-1.324 1.078.787 2.432 1.324 3.963 1.324h264.6c40.91 0 74.505-33.595 74.505-74.505 0-.583-.158-1.125-.272-1.366.114-.523.272-1.022.272-1.37v-268.77h112.883a6.373 6.373 0 006.376-6.375c-.001-40.911-33.595-74.51-74.506-74.51zM335.963 451.561c-34.109 0-61.754-28.105-61.754-61.754a6.369 6.369 0 00-6.375-6.376H129.01v-271.51c0-34.11 28.114-61.754 61.754-61.754h235.877c-20.015 13.562-33.924 36.328-33.924 61.754v274.144c0 .583.156 1.125.272 1.366-.116.523-.272 1.023-.272 1.363 0 34.11-28.115 61.767-61.754 61.767z"
        fill={color}
      />
      <Path
        d="M342.682 345.344H192.171a6.369 6.369 0 00-6.375 6.376 6.369 6.369 0 006.375 6.373h150.511a6.37 6.37 0 006.375-6.373 6.37 6.37 0 00-6.375-6.376zM342.682 291.59H192.171a6.37 6.37 0 00-6.375 6.376 6.369 6.369 0 006.375 6.373h150.511a6.37 6.37 0 006.375-6.373 6.371 6.371 0 00-6.375-6.376zM342.682 237.835H192.171a6.369 6.369 0 00-6.375 6.375 6.37 6.37 0 006.375 6.375h150.511a6.372 6.372 0 006.375-6.375 6.37 6.37 0 00-6.375-6.375zM342.682 184.082H192.171a6.368 6.368 0 00-6.375 6.375 6.37 6.37 0 006.375 6.376h150.511a6.372 6.372 0 006.375-6.376 6.37 6.37 0 00-6.375-6.375zM342.682 130.327H192.171a6.369 6.369 0 00-6.375 6.375 6.37 6.37 0 006.375 6.375h150.511a6.372 6.372 0 006.375-6.375 6.37 6.37 0 00-6.375-6.375z"
        fill={color}
      />
    </Svg>
  );
}

export default TranscribeIcon;
