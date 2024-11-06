import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomeFonts from '../../constants/CustomeFonts';
import {RegularFonts} from '../../constants/Fonts';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch} from 'react-redux';
import {updateMessage} from '../../store/reducer/chatSlice';
import {updateLatestMessage} from '../../store/reducer/chatReducer';
import {onEmojiClick} from '../../actions/apiCall';

const EmojiContainer = ({reacts = [], messageId}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  let emojies = [
    {
      name: 'like',
      symbol: '👍',
    },
    {
      name: 'lovely',
      symbol: '😍',
    },
    {
      name: 'love',
      symbol: '❤️',
    },
    {
      name: 'luffing',
      symbol: '😂',
    },
    {
      name: 'cute',
      symbol: '🥰',
    },
    {
      name: 'wow',
      symbol: '😯',
    },
  ];

  const symbolCountMap = reacts?.reduce((acc, item) => {
    acc[item?.symbol] = (acc[item?.symbol] || 0) + 1;
    return acc;
  }, {});

  const results = emojies?.map(emoji => ({
    name: emoji?.name,
    symbol: emoji?.symbol,
    count: reacts.length > 0 ? symbolCountMap[emoji?.symbol] : 0,
  }));

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onEmojiClick(item.symbol, messageId)}
        style={styles.emojiContainer}>
        <Text>{item?.symbol || '👍'}</Text>
        {item.count !== 0 && <Text style={styles.emojiText}>{item.count}</Text>}
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        ItemSeparatorComponent={<View style={{width: 10}}></View>}
      />
    </View>
  );
};

export default EmojiContainer;

const getStyles = Colors =>
  StyleSheet.create({
    emojiContainer: {
      backgroundColor: Colors.WhiteOpacityColor,
      paddingHorizontal: 5,
      paddingVertical: 3,
      borderRadius: 100,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      marginVertical: 10,
    },
    emojiText: {
      color: Colors.Heading,
      fontSize: RegularFonts.HS,
    },
  });
