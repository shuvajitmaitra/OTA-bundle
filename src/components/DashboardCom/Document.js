import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import DocumentIconThree from '../../assets/Icons/DocumentIconThree';
import DocumentIconFour from '../../assets/Icons/DocumentIconFour';
import {useSelector} from 'react-redux';

const DocumentBox = ({icon: Icon, title, count, description}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.box}>
      <View style={{flex: 0.25}}>
        <Icon />
      </View>
      <View style={{flex: 0.75}}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.number}>{count}</Text>
        <Text style={styles.text}>{description}</Text>
      </View>
    </View>
  );
};

export default function Document() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {dashboardData} = useSelector(state => state.dashboard);
  const myDocumentCount = dashboardData?.myDocument?.results?.myDocument || 0;
  const documentLabCount =
    dashboardData?.documentLab?.results?.documentLab || 0;

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Documents</Text>
      </View>
      <View style={styles.container}>
        <DocumentBox
          icon={DocumentIconThree}
          title="My Documents"
          count={myDocumentCount}
          description="(All Documents)"
        />
        <DocumentBox
          icon={DocumentIconFour}
          title="Documents & Labs"
          count={documentLabCount}
          description="(Total)"
        />
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 1,
      gap: 10,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: responsiveScreenHeight(2),
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    box: {
      flex: 0.5,
      padding: responsiveScreenWidth(2.5),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(2),
      width: responsiveScreenWidth(40),
      height: responsiveScreenHeight(15),
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
      marginTop: responsiveScreenHeight(0.5),
    },
    number: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(3.6),
      color: Colors.Heading,
    },
    text: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.Heading,
    },
  });
