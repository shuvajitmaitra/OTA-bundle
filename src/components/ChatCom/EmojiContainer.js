import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch} from 'react-redux';
import {updateMessage} from '../../store/reducer/chatSlice';
import {updateLatestMessage} from '../../store/reducer/chatReducer';
import {onEmojiClick} from '../../actions/apiCall';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

const EmojiContainer = ({reacts = [], messageId, my}) => {
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
  const groupBy = (key, array) => {
    return array.reduce(function (r, a) {
      r[a.symbol] = r[a.symbol] || [];
      r[a.symbol].push(a);
      return r;
    }, Object.create(null));
  };

  return (
    <View style={styles.container}>
      {Object.keys(groupBy('symbil', reacts)).map((key, index) => (
        <TouchableOpacity
          onPress={() => onEmojiClick(key, messageId)}
          style={styles.emojiContainer}
          key={index}>
          <Text>{key}</Text>
          <Text
            style={[
              styles.emojiText,
              {color: my ? Colors.PureWhite : Colors.BodyText},
            ]}>
            {groupBy('symbil', reacts)[key]?.length}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
        <Text style={{fontSize: 20}}>{item?.symbol || '👍'}</Text>
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
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    emojiContainer: {
      backgroundColor: Colors.WhiteOpacityColor,
      paddingHorizontal: 5,
      paddingVertical: 3,
      borderRadius: 100,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      marginVertical: 10,
      width: responsiveScreenWidth(10),
    },
    emojiText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
  });
