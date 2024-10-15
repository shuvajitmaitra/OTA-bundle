import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

function NewIcon(props) {
  return (
    <Svg
      width={26}
      height={13}
      viewBox="0 0 26 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={26} height={13} rx={6.5} fill="#27AC1F" />
      <Path
        d="M9.985 3.72V9h-.792L6.985 5.464l-.56-.992h-.008l.032.8V9H5.84V3.72h.792l2.2 3.52.568 1.016h.008l-.032-.808V3.72h.608zm3.22 5.36c-.379 0-.717-.083-1.016-.248a1.736 1.736 0 01-.688-.712c-.165-.315-.248-.688-.248-1.12 0-.432.083-.803.248-1.112a1.74 1.74 0 01.68-.72 1.94 1.94 0 01.984-.248c.373 0 .69.08.952.24.267.16.47.379.608.656.139.272.208.579.208.92 0 .09-.003.173-.008.248a1.908 1.908 0 01-.024.2H11.67v-.568h2.952l-.328.064c0-.384-.107-.68-.32-.888-.208-.208-.483-.312-.824-.312-.261 0-.488.061-.68.184-.187.117-.333.29-.44.52a1.971 1.971 0 00-.152.816c0 .315.053.587.16.816.107.23.256.405.448.528.197.117.432.176.704.176.293 0 .53-.056.712-.168.187-.112.336-.264.448-.456l.504.296a1.67 1.67 0 01-.392.472 1.691 1.691 0 01-.552.312 2.22 2.22 0 01-.704.104zM21.073 5h.712l-1.393 4h-.64l-1.127-3.184L17.56 9h-.64l-1.393-4h.713l1.008 3.256L18.337 5h.64l1.087 3.256L21.073 5z"
        fill="#fff"
      />
    </Svg>
  );
}

export default NewIcon;
