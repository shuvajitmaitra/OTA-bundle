import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CertificationImageBg(props) {
  return (
    <Svg
      width={360}
      height={264}
      viewBox="0 0 360 264"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M72.125 218.601c-14.564-8.825 11.679-49.139-4.77-52.148-15.248-2.808-43.005-15.243-54.142-28.882-19.19-23.266-17.99-74.211 10.966-90.458 33.24-18.653 75.045-1.604 111.197 4.012 55.685 8.624 67.678-41.719 121.82-50.343 20.732-3.41 50.202 4.011 60.311 28.681 12.85 31.29-4.284 67.392 15.077 97.076 7.196 11.032 53.971 57.765 6.168 76.217-17.133 6.619-34.609 10.831-52.086 15.845-16.791 4.613-33.068 10.229-48.145 20.258-20.047 13.238-42.32 33.094-65.451 19.856-29.641-17.65-73.874-23.867-100.945-40.114z"
        fill="#fff"
      />
    </Svg>
  );
}

export default CertificationImageBg;
