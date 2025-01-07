import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import {onEmojiClick} from '../../actions/apiCall';

const EmojiContainer = ({reacts, messageId, my, myReactions}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors, my);
  // let emojies = [
  //   {
  //     name: 'like',
  //     symbol: '👍',
  //   },
  //   {
  //     name: 'lovely',
  //     symbol: '😍',
  //   },
  //   {
  //     name: 'love',
  //     symbol: '❤️',
  //   },
  //   {
  //     name: 'luffing',
  //     symbol: '😂',
  //   },
  //   {
  //     name: 'cute',
  //     symbol: '🥰',
  //   },
  //   {
  //     name: 'wow',
  //     symbol: '😯',
  //   },
  // ];

  // const symbolCountMap = reacts?.reduce((acc, item) => {
  //   acc[item?.symbol] = (acc[item?.symbol] || 0) + 1;
  //   return acc;
  // }, {});
  // const groupBy = (key, array) => {
  //   return array.reduce(function (r, a) {
  //     r[a.symbol] = r[a.symbol] || [];
  //     r[a.symbol].push(a);
  //     return r;
  //   }, Object.create(null));
  // };

  // return (
  //   <View style={styles.container}>
  //     {Object.keys(groupBy('symbil', reacts)).map((key, index) => (
  //       <TouchableOpacity
  //         onPress={() => onEmojiClick(key, messageId)}
  //         style={styles.emojiContainer}
  //         key={index}>
  //         <Text>{key}</Text>
  //         <Text style={[styles.emojiText, {color: Colors.BodyText}]}>
  //           {/* {groupBy('symbil', reacts)[key]?.length} */}
  //         </Text>
  //       </TouchableOpacity>
  //     ))}
  //   </View>
  // );

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onEmojiClick(item.symbol, messageId)}
        style={[
          styles.emojiContainer,
          myReactions === item.symbol && {backgroundColor: Colors.CyanOpacity},
        ]}>
        <Text style={{fontSize: 20}}>{item?.symbol || '👍'}</Text>
        {myReactions === item.symbol && (
          <Text style={styles.emojiText}>{item.count}</Text>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={reacts}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal={true}
      ItemSeparatorComponent={<View style={{width: 10}}></View>}
      contentContainerStyle={styles.container}
    />
  );
};

export default EmojiContainer;

const getStyles = (Colors, my) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      // backgroundColor: 'skyblue',
      marginLeft: my ? 40 : 20,
    },
    emojiContainer: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: 5,
      paddingVertical: 3,
      borderRadius: 100,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      // marginVertical: 10,
      // width: responsiveScreenWidth(10),
      marginTop: 5,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    emojiText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
  });
