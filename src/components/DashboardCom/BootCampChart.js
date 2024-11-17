import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { StackedBarChart, YAxis } from "react-native-svg-charts";
import { Text as SVGText, G, Line } from "react-native-svg";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import { useTheme } from "../../context/ThemeContext";
import CustomFonts from "../../constants/CustomFonts";
import { useSelector } from "react-redux";
import CustomDropDownTwo from "../SharedComponent/CustomDropDownTwo";
import { ActivityIndicator } from "react-native";
import Divider from "../SharedComponent/Divider";

// Custom Legend Component
const CustomLegend = ({ colors }) => {
  const Colors = useTheme();
  const styles = getLegendStyles(Colors);
  return (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: colors[0] }]} />
        <Text style={styles.legendLabel}>Completed</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: colors[1] }]} />
        <Text style={styles.legendLabel}>Incomplete</Text>
      </View>
    </View>
  );
};

// Main BootCampChart Component
const BootCampChart = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [selectedOption, setSelectedOption] = useState("Weekly");
  const option = ["Weekly", "Monthly"];
  // const bootcampData = {
  //   success: true,
  //   results: [
  //     {
  //       category: {
  //         name: 'Modules',
  //         slug: 'module'
  //       },
  //       totalItems: 49,
  //       completedItems: 0,
  //       pinnedItems: 0,
  //       incompletedItems: 49
  //     },
  //     {
  //       category: {
  //         name: 'Workshops',
  //         slug: 'module'
  //       },
  //       totalItems: 49,
  //       completedItems: 40,
  //       pinnedItems: 0,
  //       incompletedItems: 9
  //     },
  //     {
  //       category: {
  //         name: 'Interviews',
  //         slug: 'module'
  //       },
  //       totalItems: 49,
  //       completedItems: 20,
  //       pinnedItems: 0,
  //       incompletedItems: 9
  //     },
  //     {
  //       category: {
  //         name: 'Labs',
  //         slug: 'module'
  //       },
  //       totalItems: 49,
  //       completedItems: 10,
  //       pinnedItems: 0,
  //       incompletedItems: 4
  //     },

  //   ]
  // };

  // const transformedData = Array.isArray(bootcampData.results)
  //   ? bootcampData.results.map((item) => ({
  //     category: item.category.name,
  //     completed: (item.completedItems / item.totalItems) * 100,
  //     incomplete: (item.incompletedItems / item.totalItems) * 100,
  //     label: item.category.name,
  //   }))
  //   : [];

  const bootcampData = useSelector((state) => state.dashboard?.dashboardData?.bootcamp);

  const transformedData = Array.isArray(bootcampData?.results)
    ? bootcampData?.results?.map((item) => ({
        category: item.category.name,
        completed: (item.completedItems / item.totalItems) * 100,
        incomplete: (item.incompletedItems / item.totalItems) * 100,
        label: item.category.name.split(" ")[0],
      }))
    : [];
  if (!transformedData) {
    return <ActivityIndicator size="large" color={Colors.Primary} />;
  }

  const colors = ["#5DB34C", "#FF5454"];
  const keys = ["completed", "incomplete"];
  const yAxisData = [0, 20, 40, 60, 80, 100];

  const Labels = ({ x, y, bandwidth, data }) =>
    data.map((item, index) => {
      const completedY = y(item.completed) + 10;
      const incompleteY = y(item.completed + item.incomplete) + 10;
      return (
        <G key={index}>
          <SVGText
            x={x(index) + bandwidth / 2.5}
            y={!isNaN(completedY) ? completedY : 0}
            fontFamily={CustomFonts.REGULAR}
            fontSize={responsiveScreenFontSize(1.4)}
            fill={Colors.PureWhite}
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {`${item.completed.toFixed()}%`}
          </SVGText>
          <SVGText
            x={x(index) + bandwidth / 2.5}
            y={!isNaN(incompleteY) ? incompleteY : 0}
            fontFamily={CustomFonts.REGULAR}
            fontSize={responsiveScreenFontSize(1.4)}
            fill={Colors.PureWhite}
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {`${item.incomplete.toFixed()}%`}
          </SVGText>
        </G>
      );
    });

  const TextLabels = ({ x, y, bandwidth, data }) =>
    data.map((item, index) => (
      <G key={index}>
        <SVGText
          x={x(index) + bandwidth / 1.8}
          y={y(0) + 30}
          fontFamily={CustomFonts.REGULAR}
          fontSize={responsiveScreenFontSize(1.4)}
          fill={Colors.PureWhite}
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {item?.label}
        </SVGText>
      </G>
    ));

  const CustomGrid = ({ x, y, ticks }) => (
    <G>
      {ticks.map((tick) => (
        <Line
          key={tick}
          x1="0%"
          x2="100%"
          y1={y(tick)}
          y2={y(tick)}
          stroke={Colors.WhiteOpacityColor}
          strokeDasharray={[4, 4]}
          strokeWidth={1}
        />
      ))}
    </G>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.heading}>Bootcamps</Text>
        {/* <CustomDropDownTwo
          data={option}
          state={selectedOption}
          setState={setSelectedOption}
        /> */}
      </View>
      <CustomLegend colors={colors} />
      <View
        style={{
          height: responsiveScreenHeight(30),
          flexDirection: "row",
          // backgroundColor: "red",
        }}
      >
        <YAxis
          data={yAxisData}
          contentInset={{ top: 12, bottom: responsiveScreenHeight(5) }}
          svg={{
            fill: Colors.Heading,
            fontSize: responsiveScreenFontSize(1.6),
            fontFamily: CustomFonts.MEDIUM,
          }}
          formatLabel={(value) => `${value}`}
          numberOfTicks={yAxisData?.length}
          min={0}
          max={100}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <StackedBarChart
            style={{ flex: 1 }}
            data={transformedData}
            keys={keys}
            colors={colors}
            showGrid={false}
            contentInset={{ top: 10, bottom: responsiveScreenHeight(5) }}
            horizontal={false}
            spacingInner={0.4}
            spacingOuter={0.2}
          >
            <CustomGrid belowChart={true} ticks={yAxisData} />
            <Labels />
            <TextLabels />
          </StackedBarChart>
        </View>
      </View>

      <View
        style={[
          styles.dataContainer,
          {
            marginTop: responsiveScreenHeight(3),
            flexBasis: "30%",
            flexWrap: "wrap",
            gap: 10,
          },
        ]}
      >
        {bootcampData?.results?.map((item, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.title}>{item?.category?.name || "Untitled"}</Text>
            <Divider marginBottom={1} marginTop={1} />
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Total Item</Text>
              <Text style={styles.text}>{item?.totalItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Completed</Text>
              <Text style={styles.text}>{item?.completedItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Incomplete</Text>
              <Text style={styles.text}>{item?.incompletedItems || 0}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.text}>Pinned</Text>
              <Text style={styles.text}>{item?.pinnedItems || 0}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.White,
    },
    labelsContainer: {
      flexDirection: "row",
      gap: responsiveScreenWidth(3),
      marginLeft: responsiveScreenWidth(10),
    },
    barLabelContainer: {
      alignItems: "center",
      gap: 10,
    },
    label: {
      textAlign: "center",
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
    },
    labsLabel: {
      marginLeft: 3,
    },
    dataContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    box: {
      padding: responsiveScreenWidth(3),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(2),
      width: responsiveScreenWidth(42),
      // marginHorizontal: responsiveScreenWidth(1)
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
      textAlign: "center",
      // paddingBottom: responsiveScreenWidth(2),
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: responsiveScreenHeight(2),
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
  });

const getLegendStyles = (Colors) =>
  StyleSheet.create({
    legendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 10,
    },
    legendColor: {
      width: 15,
      height: 15,
      borderRadius: 5,
      marginRight: 5,
    },
    legendLabel: {
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
    },
  });

export default BootCampChart;
