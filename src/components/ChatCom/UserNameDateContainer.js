import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {RegularFonts} from '../../constants/Fonts';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';

const UserNameDateContainer = ({name, date}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.date}>{moment(date).format('h:mm A')}</Text>
    </View>
  );
};

export default UserNameDateContainer;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 10,
      alignItems: 'center',
    },
    name: {
      fontSize: RegularFonts.BR,
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    date: {
      fontSize: RegularFonts.BR,
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
  });
