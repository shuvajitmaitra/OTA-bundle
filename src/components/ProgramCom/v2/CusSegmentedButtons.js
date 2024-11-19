// CustomTabView.js
import React, {useEffect, useState, useCallback, memo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts'; // Ensure this path is correct
import {useTheme} from '../../../context/ThemeContext'; // Ensure this path is correct
import ContentList from './ContentList'; // Ensure this path is correct

// Memoized ContentList Component to prevent unnecessary re-renders
const ContentListComp = memo(({course, category}) => {
  return <ContentList course={course} category={category} />;
});

const CustomTabBar = ({routes, activeIndex, onTabPress, Colors}) => {
  return (
    <View style={styles.tabContainerOuter(Colors)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarContainer}>
        {routes.map((route, index) => {
          const isActive = activeIndex === index;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => onTabPress(index)}
              style={[
                styles.tabItemContainer,
                isActive && styles.activeTabContainer(Colors),
              ]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.tabText(Colors),
                  isActive && styles.activeTabText(Colors),
                ]}>
                {route.title === 'Module' ? 'Modules' : route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Main Custom Tab View Component
export default function CusSegmentedButtons({category, course}) {
  const Colors = useTheme();

  const [activeIndex, setActiveIndex] = useState(0);
  const [routes, setRoutes] = useState([]);

  // Generate the routes based on active categories
  useEffect(() => {
    if (category?.categories) {
      const newRoutes = category.categories
        .filter(item => item.isActive)
        .map(item => ({
          key: item._id,
          title: item.name,
        }));
      setRoutes(newRoutes);
      // Reset active index if current index is out of bounds
      if (activeIndex >= newRoutes.length) {
        setActiveIndex(0);
      }
    } else {
      setRoutes([]);
    }
  }, [category, activeIndex]);

  // Render content based on active tab
  const renderContent = useCallback(() => {
    if (routes.length === 0) {
      return (
        <View style={styles.noContentContainer}>
          <Text style={[styles.noContentText, {color: Colors.Heading}]}>
            No Content Found
          </Text>
        </View>
      );
    }

    return (
      <ContentListComp course={course} category={routes[activeIndex]?.key} />
    );
  }, [routes, activeIndex, course, Colors]);

  return (
    <View style={styles.container}>
      <View>
        {routes.length > 0 && (
          <CustomTabBar
            routes={routes}
            activeIndex={activeIndex}
            onTabPress={setActiveIndex}
            Colors={Colors}
          />
        )}
      </View>
      <View style={{flex: 1}}>{renderContent()}</View>
    </View>
  );
}

// Stylesheet for better organization and readability
const styles = StyleSheet.create({
  tabContainerOuter: Colors => ({
    backgroundColor: Colors.White, // Active tab background color
    marginHorizontal: responsiveScreenWidth(4),
    borderRadius: 100,
    // overflow: "hidden",
  }),
  container: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    // paddingHorizontal: responsiveScreenWidth(4),
    // paddingVertical: responsiveScreenHeight(1),
    // backgroundColor: "#fff", // Default background color, adjust as needed
    // flex: 1,
    height: 50,
    alignItems: 'center',
  },
  tabItemContainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1),
    // borderRadius: 50,
    // backgroundColor: "#f0f0f0", // Inactive tab background color
    // marginRight: responsiveScreenWidth(2),
    borderRadius: 50,
  },
  activeTabContainer: Colors => ({
    backgroundColor: Colors.Primary, // Active tab background color
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  tabText: Colors => ({
    fontSize: responsiveScreenFontSize(1.7),
    color: Colors.Primary, // Inactive tab text color
    fontFamily: CustomFonts.SEMI_BOLD,
    textAlign: 'center',
  }),
  activeTabText: Colors => ({
    color: Colors.PureWhite, // Active tab text color
  }),
  contentContainer: {
    flex: 1,
    // padding: responsiveScreenWidth(4),
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentText: {
    fontSize: responsiveScreenFontSize(2),
    fontFamily: CustomFonts.REGULAR,
  },
});
