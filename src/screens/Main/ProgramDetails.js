import {StyleSheet, View, Text} from 'react-native';
import React, {useState} from 'react';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import axiosInstance from '../../utility/axiosInstance';
import CusSegmentedButtons from '../../components/ProgramCom/v2/CusSegmentedButtons';
import CustomFonts from '../../constants/CustomFonts';
import Loading from '../../components/SharedComponent/Loading';
import {useTheme} from '../../context/ThemeContext';

export default function ProgramDetails({route, navigation}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = React.useState(false);
  const [category, setCategory] = useState('');
  const [course, setCourse] = React.useState('');

  const getAllData = async slug => {
    try {
      setIsLoading(true);
      let allCourses = await axiosInstance.get(`/course/contentv2/${slug}`);
      allCourses = allCourses.data;

      setCourse(allCourses?.course);
      setCategory(allCourses?.category);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error program details', error);
    }
  };

  React.useEffect(() => {
    if (route?.params?.slug) {
      getAllData(route?.params?.slug);
    }
  }, [route]);

  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
        <Loading backgroundColor={'transparent'} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.programNameText}>{course.title}</Text>
      {category?.categories?.length > 0 && (
        <CusSegmentedButtons category={category} course={course} />
      )}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: responsiveScreenHeight(1),
      backgroundColor: Colors.Background_color,
    },
    programNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.7),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(1.5),
      color: Colors.Heading,
    },
  });
