import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useTheme} from '../../context/ThemeContext';

const DeleteMessageContainer = ({item = {}, my}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors, my);
  return (
    <View style={styles.messagesContainer}>
      <Text style={styles.text}>This message has been deleted</Text>
      <Text style={styles.timeText}>
        {moment(item?.createdAt).format('MMM DD, 2024')}
        {' at '}
        {moment(item?.createdAt).format('h:m A')}
      </Text>
    </View>
  );
};

export default DeleteMessageContainer;

const getStyles = (Colors, my) =>
  StyleSheet.create({
    text: {
      color: Colors.Red,
    },
    messagesContainer: {
      backgroundColor: Colors.LightRed,
      padding: 3,
      // paddingVertical: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginTop: my ? 10 : 5,
      width: '60%',
      minWidth: '25%',
      alignSelf: my ? 'flex-end' : 'flex-start',
      minHeight: 30,
      //   gap: -1,
    },
    timeText: {
      color: Colors.Red,
      alignSelf: 'flex-end',
      //   position: 'absolute',
      //   bottom: 0,
      //   right: 0,
      //   height: 10
      //   marginTop: -5,
    },
  });
