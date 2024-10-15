import { PieChart } from "react-native-svg-charts";
import {
  Text,
  G,
  Circle,
  Filter,
  FeGaussianBlur,
  FeOffset,
  FeBlend,
  Defs,
} from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

const RainbowPieChart = ({ total, count }) => {
  const Colors = useTheme();
  const data = [
    {
      key: 1,
      value: total - count,
      svg: { fill: Colors.Primary },
    },
    // {
    //   key: 3,
    //   value: 25,
    //   svg: { fill: "#F90" },
    // },
    {
      key: 2,
      value: count,
      svg: { fill: Colors.Red },
    },
  ];

  return (
    <PieChart
      style={{ height: 280 }}
      data={data}
      valueAccessor={({ item }) => item.value}
      outerRadius="100%"
      innerRadius="78%"
      startAngle={-Math.PI / 2} // Start at the top
      endAngle={Math.PI / 2} // End at the bottom
      padAngle={0.02}
    >
      {/* <Labels /> */}
      {/* <Defs>
        <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <FeOffset in="SourceAlpha" dx="5" dy="5" result="offset" />
          <FeGaussianBlur in="offset" stdDeviation="5" result="blur" />
          <FeBlend in="SourceGraphic" in2="blur" />
        </Filter>
      </Defs> */}
      <Circle
        filter="url(#shadow)"
        cx={0}
        cy={-20}
        r={50}
        fill={Colors.MediumGreen}
        stroke={Colors.ModalBoxColor}
        strokeOpacity={1}
        strokeWidth={10}
      />
      <Text
        x="0"
        y={-20}
        fill={Colors.Heading}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={22}
        stroke={Colors.Heading}
        strokeWidth={1}
      >
        {"100%"}
      </Text>
    </PieChart>
  );
};

export default RainbowPieChart;