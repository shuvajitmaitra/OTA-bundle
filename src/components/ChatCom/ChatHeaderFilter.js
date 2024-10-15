import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomeFonts from '../../constants/CustomeFonts';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

const ChatHeaderFilter = ({checked, handleRadioChecked}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const tabs = [
    {label: 'Chats', key: 'chats'},
    {label: 'Crowds', key: 'crowds'},
    {label: 'Unread', key: 'unreadMessage'},
    {label: 'Mentioned', key: 'mention'},
  ];

  return (
    <View style={styles.headerTabContainer}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => handleRadioChecked(tab.key)}
          style={[
            styles.tabContainer,
            {
              backgroundColor:
                checked === tab.key
                  ? Colors.Primary
                  : Colors.PrimaryOpacityColor,
            },
          ]}>
          <Text style={styles.tabText}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ChatHeaderFilter;

const getStyles = Colors =>
  StyleSheet.create({
    tabText: {
      color: Colors.PureWhite,
      fontFamily: CustomeFonts.MEDIUM,
    },
    tabContainer: {
      paddingHorizontal: 10,
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: 100,
      paddingVertical: 5,
    },
    headerTabContainer: {
      flexDirection: 'row',
      gap: 10,
      paddingTop: 5,
      paddingHorizontal: responsiveScreenWidth(4),
      marginVertical: 10,
    },
  });
