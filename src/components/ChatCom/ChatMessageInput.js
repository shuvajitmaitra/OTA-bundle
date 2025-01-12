import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import _ from 'lodash';

import axios from '../../utility/axiosInstance';
import {useTheme} from '../../context/ThemeContext';
import {ScrollView} from 'react-native';
import {MentionInput} from './mention-input';
import UserIconTwo from '../../assets/Icons/UserIconTwo';
import {RegularFonts} from '../../constants/Fonts';

let prevSearchTermRef = 'init';

const handleSearch = _.debounce(
  async (searchTerm, chat, setUsers, setLoading) => {
    if (searchTerm?.query !== prevSearchTermRef) {
      try {
        prevSearchTermRef = searchTerm?.query;
        setLoading(true);
        let res = await axios.post(`/chat/members/${chat}`, searchTerm);
        setLoading(false);

        let filtered = res?.data?.results
          ?.filter(x => x?._id)
          .map(({user}, i) => ({
            id: user?._id,
            name: user?.fullName || '',
            email: user?.email || '',
            username: user?.fulllName || '',
            profilePicture: user?.profilePicture,
          }));

        setUsers([...filtered]);
        // console.log('filtered', JSON.stringify(filtered, null, 2));
      } catch (error) {
        setLoading(false);
        setUsers([]);
      }
    }
  },
  100,
);

const ChatMessageInput = ({
  chat,
  setText,
  text,
  handleKey,
  isChannel,
  maxHeight,
  parentId,
}) => {
  let width = Dimensions.get('window').width;
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  // console.log('Chat Message input rerender');
  useEffect(() => {
    prevSearchTermRef = 'init';
    setLoading(false);
  }, [chat]);

  const renderSuggestions = ({keyword, onSuggestionPress}) => {
    console.log('keyword', JSON.stringify(keyword, null, 1));
    if (!keyword) {
      return null;
    }

    handleSearch(
      {
        query: keyword?.toLowerCase(),
        limit: 4,
      },
      chat,
      setUsers,
      setLoading,
    );

    return (
      <Animated.View
        style={[
          {
            // position: 'absolute',
            // bottom: '140%', // This pushes the view above the reference point
            left: 0,
            right: 0,
            // backgroundColor: Colors.Red,
            zIndex: 999,
            flexDirection: 'column',
            width: width / 1.5,
          },
          styles.shadow,
        ]}>
        <ScrollView contentContainerStyle={{maxHeight: 400}}>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={Colors.Primary}
              style={{margin: 10}}
            />
          ) : (
            [
              ...(users || []),
              {id: 'everyone', name: 'everyone', username: 'everyone'},
            ].map(one => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={one?._id}
                onPress={() => {
                  onSuggestionPress(one);
                  inputRef.current?.focus();
                }}
                style={{
                  padding: 12,
                  // backgroundColor: Colors.Background_color,
                  zIndex: 999,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.BorderColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  overflow: 'hidden',
                  borderRadius: 100,
                }}>
                {one?.profilePicture ? (
                  <Image
                    source={{uri: one?.profilePicture}}
                    height={50}
                    width={50}
                    style={{borderRadius: 100}}
                  />
                ) : (
                  <UserIconTwo size={40} />
                )}
                <Text style={{color: Colors.Heading}}>@{one?.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>
    );
  };

  const inputRef = useRef(); // Added ref here
  return (
    <View style={{position: 'relative', width: '92%'}}>
      <MentionInput
        spellCheck={true}
        autoCorrect={true}
        autoCapitalize="sentences"
        keyboardAppearance={
          Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
        }
        multiline
        verticalAlign="bottom"
        textAlignVertical="bottom"
        value={text}
        style={{
          color: Colors.BodyText,
          width: '100%',
          maxHeight: maxHeight || 400,
          minHeight: 50,
          fontSize: RegularFonts.BR,
          paddingVertical: 15,
          textAlignVertical: 'center',
        }}
        onChange={text => setText(text)}
        placeholder={parentId ? 'Type a reply...' : 'Type a message...'}
        placeholderTextColor={Colors.BodyText}
        inputRef={inputRef}
        onKeyPress={handleKey}
        partTypes={[
          {
            isBottomMentionSuggestionsRender: true,
            trigger: isChannel ? '@' : null,
            renderSuggestions,
            isInsertSpaceAfterMention: true,
            textStyle: {
              fontWeight: 'bold',
              color: Colors.Primary,
              borderBottomWidth: 1,
            },
          },
        ]}
      />
    </View>
  );
};

export default ChatMessageInput;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.White,
    },
    footer: {
      width: '100%',
      //alignItems: "center",
      padding: 10,
      flexDirection: 'column',
      borderWidth: 1,
      overflow: 'hidden',
      borderTopColor: '#ddd',
    },
    footerWrapper: {
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
    },
    textInput: {
      backgroundColor: Colors.White,
      padding: 10,
      color: Colors.Heading,
      borderRadius: 10,
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      marginHorizontal: 5,
      position: 'relative',
    },
    messageItem: {
      flexDirection: 'row',
      marginVertical: 7,
    },
    userImageWrapper: {
      marginRight: 10,
      alignSelf: 'flex-start',
    },
    userImg: {
      height: 45,
      width: 45,
      borderRadius: 5,
    },
    modalWrapper: {
      backgroundColor: '#f0f0f0',
    },
    listItem: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 4,
    },
    contentContainer: {
      backgroundColor: Colors.Primary,
      color: Colors.White,
      paddingVertical: 10,
    },
  });
