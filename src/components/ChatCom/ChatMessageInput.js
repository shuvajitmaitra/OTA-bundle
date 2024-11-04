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
// import {ActivityIndicator, Avatar} from 'react-native-paper';
import _ from 'lodash';

import color from '../../constants/color';
import axios from '../../utility/axiosInstance';
import userIcon from '../../assets/Images/user.png';
import {useTheme} from '../../context/ThemeContext';
import {ScrollView} from 'react-native';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {MentionInput} from './mention-input';
import UserIconTwo from '../../assets/Icons/UserIconTwo';

let prevSearchTermRef = 'init';

const handleSearch = _.debounce(
  async (searchTerm, chat, setUsers, setLoading) => {
    if (searchTerm?.query !== prevSearchTermRef) {
      try {
        prevSearchTermRef = searchTerm?.query;
        setLoading(true);
        let res = await axios.post(`/chat/members/${chat}`, searchTerm);
        setLoading(false);
        console.log('res.data', JSON.stringify(res.data, null, 1));

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
      } catch (error) {
        setLoading(false);
        setUsers([]);
      }
    }
  },
  400,
);

const ChatMessageInput = ({chat, setText, text, handleKey, isChannel}) => {
  let width = Dimensions.get('window').width;
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  useEffect(() => {
    prevSearchTermRef = 'init';
    setLoading(false);
  }, [chat]);

  const renderSuggestions = ({keyword, onSuggestionPress}) => {
    console.log('keyword', JSON.stringify(keyword, null, 1));
    if (keyword == null) {
      return null;
    }

    //setLoading(true)

    //prevSearchTermRef = keyword?.toLowerCase();
    handleSearch(
      {
        query: keyword?.toLowerCase(),
        limit: 4,
      },
      chat,
      setUsers,
      setLoading,
    );
    //prevSearchTermRef = keyword?.toLowerCase();

    return (
      <Animated.View
        style={[
          {
            // position: 'absolute',
            // bottom: '140%', // This pushes the view above the reference point
            left: 0,
            right: 0,
            // backgroundColor: Colors.White,
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
              color={color.primary}
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
                  gap: 10,
                }}>
                {one?.profilePicture ? (
                  <Image
                    source={{uri: one?.profilePicture}}
                    height={50}
                    width={50}
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
    <View style={{position: 'relative', maxWidth: '93%', minWidth: '50%'}}>
      <MentionInput
        value={text}
        style={{
          color: Colors.Heading,
          // backgroundColor: "red",
          width: '100%',
          maxHeight: 100,
          fontSize: responsiveScreenFontSize(2),
          // alignItems: "flex-start",
        }}
        onChange={text => setText(text)}
        placeholder="Type a message..."
        placeholderTextColor={Colors.BodyText}
        inputRef={inputRef}
        onKeyPress={handleKey}
        partTypes={[
          {
            isBottomMentionSuggestionsRender: true,
            trigger: isChannel ? '@' : null, // Should be a single character like '@' or '#'
            renderSuggestions,
            isInsertSpaceAfterMention: true,
            textStyle: {
              fontWeight: 'bold',
              color: Colors.Primary,
              borderBottomWidth: 1,
            }, // The mention style in the input
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
      backgroundColor: color.primary,
      color: Colors.White,
      paddingVertical: 10,
    },
  });
