import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      fill="#ffff"
      width={20}
      height={20}
      viewBox="0 -11.95 122.88 122.88"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      enableBackground="new 0 0 122.88 98.97"
      {...props}
    >
      <Path d="M37.71 39.99V93.4h5.48l7.22-7.94h-3.83v-4.85h11.86L45.06 65.78l3.6-3.24 8.1 8.97v-.35h19.83c.87 0 1.64.46 2.07 1.15l5.86 8.29h11.01c.73 0 1.39.32 1.83.84l12.06 11.96h13.46v5.57H.7V93.4h31.8V39.99H1.89C.85 39.99 0 39.15 0 38.1c0-.06 0-.12.01-.19.08-9.42 4.01-17.93 10.32-24.1A35.312 35.312 0 0134.54 3.8a1.964 1.964 0 011.17 0c9.39.17 17.87 3.97 24.07 10.02 6.35 6.21 10.29 14.79 10.32 24.28 0 1.04-.84 1.88-1.88 1.88v.01H37.71zM91.48 4.24c-.35-.6-.14-1.38.46-1.73.6-.35 1.38-.15 1.73.46l1.62 2.81c.35.6.14 1.38-.46 1.73-.6.35-1.38.14-1.72-.46l-1.63-2.81zm10.08 4.16c3.12 0 5.95 1.26 7.99 3.31 2.04 2.04 3.31 4.87 3.31 7.99s-1.26 5.94-3.31 7.99a11.235 11.235 0 01-7.99 3.31c-3.12 0-5.94-1.26-7.99-3.31-2.04-2.04-3.31-4.87-3.31-7.99s1.26-5.94 3.31-7.99c2.05-2.04 4.88-3.31 7.99-3.31zm-1-7.13c0-.7.57-1.27 1.27-1.27s1.27.57 1.27 1.27v3.24c0 .7-.57 1.27-1.27 1.27s-1.27-.57-1.27-1.27V1.27zm9.36 1.97a1.26 1.26 0 012.18 1.26l-1.62 2.81c-.35.6-1.12.81-1.72.47a1.26 1.26 0 01-.46-1.72l1.62-2.82zm7.11 6.38c.6-.35 1.38-.14 1.72.46s.14 1.38-.46 1.73l-2.8 1.62c-.6.35-1.38.14-1.73-.46-.35-.6-.14-1.38.46-1.73l2.81-1.62zm2.97 9.07c.7 0 1.27.57 1.27 1.27 0 .7-.57 1.27-1.27 1.27h-3.24c-.7 0-1.27-.57-1.27-1.27 0-.7.57-1.27 1.27-1.27H120zm-1.97 9.36a1.26 1.26 0 01-1.26 2.18l-2.81-1.62a1.26 1.26 0 011.26-2.18l2.81 1.62zm-6.38 7.11c.35.6.14 1.38-.46 1.73-.6.35-1.38.15-1.72-.46l-1.62-2.81c-.35-.6-.14-1.38.46-1.73.6-.35 1.38-.14 1.73.46l1.61 2.81zm-9.08 2.97c0 .7-.57 1.27-1.27 1.27-.7 0-1.26-.57-1.26-1.27v-3.24c0-.7.57-1.27 1.26-1.27.7 0 1.27.57 1.27 1.27v3.24zm-9.36-1.97a1.26 1.26 0 01-2.18-1.26l1.62-2.81c.35-.6 1.12-.81 1.72-.47.6.35.81 1.12.46 1.72l-1.62 2.82zm-7.11-6.38c-.6.35-1.38.14-1.73-.46-.35-.6-.14-1.38.46-1.73l2.81-1.62c.6-.35 1.38-.14 1.72.46.35.6.14 1.38-.46 1.73l-2.8 1.62zm-2.97-9.08c-.7 0-1.27-.57-1.27-1.27 0-.7.57-1.27 1.27-1.27h3.24c.7 0 1.27.57 1.27 1.27 0 .7-.57 1.27-1.27 1.27h-3.24zm1.97-9.35a1.26 1.26 0 011.26-2.18l2.81 1.62a1.26 1.26 0 01-1.26 2.18l-2.81-1.62zM49.74 93.41h52.8l-8.01-7.94H56.96l-7.22 7.94zm15.23-12.8h13.61l-3.24-4.59H60.83l4.14 4.59zm-7.82-64.09c-2.56-2.5-5.57-4.58-8.89-6.09 1.28 1.85 2.36 3.96 3.24 6.29 2.05 5.41 3.05 12.06 3.15 19.5h11.62c-.5-7.68-3.89-14.59-9.12-19.7zM40.58 8.05c-1.17-.2-2.36-.34-3.57-.42v28.59h13.88c-.09-6.98-1.02-13.18-2.91-18.17-1.68-4.45-4.12-7.9-7.4-10zm-7.35-.43c-1.19.07-2.37.2-3.52.39-3.32 2.11-5.79 5.59-7.48 10.1-1.87 4.97-2.79 11.16-2.88 18.1h13.88V7.62zm-11.18 2.72a31.35 31.35 0 00-9.09 6.19c-5.23 5.11-8.62 12.02-9.12 19.69H15.6c.09-7.4 1.09-14.03 3.12-19.43.89-2.4 2-4.57 3.33-6.45z" />
    </Svg>
  );
}

export default SvgComponent;
