import * as React from "react";
import Svg, { Path } from "react-native-svg";

function FileIcon(props) {
  return (
    <Svg
      width={50}
      height={50}
      viewBox="0 0 1024 1024"
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M576 102.4H268.8c-14.08 0-25.6 11.52-25.6 25.6v742.4c0 14.08 11.52 25.6 25.6 25.6h512c14.08 0 25.6-11.52 25.6-25.6V332.8L576 102.4z"
        fill="#00B2AE"
      />
      <Path
        d="M780.8 908.8h-512c-21.76 0-38.4-16.64-38.4-38.4V128c0-21.76 16.64-38.4 38.4-38.4h312.32L819.2 327.68V870.4c0 21.76-16.64 38.4-38.4 38.4zm-512-793.6c-7.68 0-12.8 5.12-12.8 12.8v742.4c0 7.68 5.12 12.8 12.8 12.8h512c7.68 0 12.8-5.12 12.8-12.8V337.92L570.88 115.2H268.8z"
        fill="#231C1C"
      />
      <Path
        d="M576 307.2c0 14.08 11.52 25.6 25.6 25.6h204.8L576 102.4v204.8z"
        fill="#008181"
      />
      <Path
        d="M806.4 345.6H601.6c-21.76 0-38.4-16.64-38.4-38.4V102.4c0-5.12 2.56-10.24 7.68-11.52 5.12-2.56 10.24-1.28 14.08 2.56l230.4 230.4c3.84 3.84 5.12 8.96 2.56 14.08-1.28 5.12-6.4 7.68-11.52 7.68zM588.8 133.12V307.2c0 7.68 5.12 12.8 12.8 12.8h174.08L588.8 133.12zm-256 302.08H704v25.6H332.8zm0 89.6H704v25.6H332.8zM332.8 614.4H704V640H332.8zM332.8 716.8H704v25.6H332.8z"
        fill="#231C1C"
      />
    </Svg>
  );
}

export default FileIcon;
