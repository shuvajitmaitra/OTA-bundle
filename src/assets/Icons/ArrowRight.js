import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowRight(props) {
    return (
        <Svg
            width={16}
            height={20}
            viewBox="0 0 16 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M9.89 0L8.816 1.068 12.3 4.543H0v1.514h12.3L8.81 9.532l1.08 1.068 5.325-5.3L9.89 0z"
                fill="#27AC1F"
            />
        </Svg>
    );
}

export default ArrowRight;
