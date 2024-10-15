import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
  InteractionManager,
} from 'react-native';
import {ActivityIndicator, Provider, Snackbar} from 'react-native-paper';
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as Notifications from 'expo-notifications';
import * as Clipboard from 'expo-clipboard';
import moment from 'moment';

import axios, {isCancel} from '../../utility/axiosInstance';
import color from '../../constants/color';
import Message from '../../components/ChatCom/Message';
import ChatFooter from '../../components/ChatCom/ChatFooter';
import {
  markRead,
  pushHistoryMessages,
  setPinned,
  syncMessage,
  updateChat,
  updateLatestMessage,
  updateMessage,
} from '../../store/reducer/chatReducer';
import ChatScreenTopPart from '../../components/ChatCom/ChatScreenTopPart';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomeFonts from '../../constants/CustomeFonts';
import ChatProvider from './ChatProvider';

import PinMessage from '../../components/ChatCom/PinMessage';
import {useTheme} from '../../context/ThemeContext';
import Loading from '../../components/SharedComponent/Loading';
import JitsiMeetWebView from '../../components/ChatCom/Meet';
import {isPinned} from '../../store/reducer/pinReducer';
import MessageOptionModal from '../../components/ChatCom/MessageOptionModal';
import {socket} from '../../utility/socketManager';
import _ from 'lodash';
import {showToast} from '../../components/HelperFunction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function formatDateForDisplay(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const inputDate = new Date(date);

  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    return 'Today';
  } else if (
    inputDate.getDate() === yesterday.getDate() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  } else {
    return inputDate.toLocaleDateString(); // Adjust this format as needed
  }
}

function groupMessagesByDate(messages) {
  return messages.reduce((groups, message) => {
    const dateKey = formatDateForDisplay(message.createdAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});
}

function truncateString(text, num) {
  //console.log(text);
  let str = text.replace(/<[^>]*>?/gm, '').trim();
  //console.log(str);
  if (str?.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NewMessageScreen = ({route, navigation}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  let scrollViewRef = useRef();
  let dispatch = useDispatch();
  const {chats, chatMessages} = useSelector(state => state.chat);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messagesPending, setMessagesPending] = useState([]);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState('');

  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const [isDialogVisible, setIsDialogueVisible] = useState(false);
  const [selecetedMessage, setSelectedMessage] = useState(null);
  const [messageToEdit, setMessageToEdit] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [selectedForwardMessage, setSelectedForwardMessage] = useState({});

  const [isSnakbarVisible, setIsSnakbarVisible] = useState(false);
  const [stopAudio, setStopAudio] = useState(true);

  const [pinnedMessages, setPinnedMessages] = useState([]);

  const [isPinnedVisible, setIsPinnedVisible] = useState(false);

  const [isMessageOptionsVisible, setIsMessageOptionsVisible] = useState(false);
  const toggleMessageOptions = useCallback(() => {
    setIsMessageOptionsVisible(!isMessageOptionsVisible);
  }, [isMessageOptionsVisible]);

  const copyToClipboard = async message => {
    setIsSnakbarVisible(true);
    await Clipboard.setStringAsync(
      message?.text.replace(/<[^>]*>?/gm, '').trim(),
    );
  };

  const handleSetEdit = message => {
    setMessageToEdit(message);
    setText(message?.text?.replace(/<[^>]*>?/gm, '').trim());
  };
  const handleSetDelete = message => {
    setMessageToDelete(message);
  };

  const handleMessageOption = useCallback(
    message => {
      setSelectedMessage(message);
    },
    [selecetedMessage],
  );

  const isSentSync = useRef(false);

  useEffect(() => {
    if (chats && route?.params?.chatId) {
      let findChat = chats?.find(chat => chat?._id === route?.params?.chatId);
      setChat(findChat);
      // if (!findChat) {
      //   setIsLoading(true);
      // }
      dispatch(updateChat(findChat));
      // setCurrentPage(1);
      // let options = {
      //   page: 1,
      //   chat: route?.params?.chatId,
      //   limit,
      // };

      // axios
      //   .post(`/chat/messages`, options, {
      //     params: {
      //       channel: "ws"
      //     }
      //   })
      //   // .then((res) => { })
      //   .catch((err) => {
      //     Alert.alert(err?.response?.data?.error || "Error");
      //   });

      // setHasMore(true);

      if (findChat && !isSentSync.current) {
        const task = InteractionManager.runAfterInteractions(() => {
          setCurrentPage(1);

          setHasMore(true);

          let data = {
            chatId: findChat?._id,
            limit,
          };

          if (findChat?.lastSync) {
            data.lastSync = findChat?.lastSync;
          }

          isSentSync.current = true;
          console.log('syncMessages', data);

          socket.emit('syncMessages', data);
        });

        return () => {
          isSentSync.current = false;
          task.cancel();
          console.log('returning...');
        };
      }
    }
  }, [chats, route]);

  useEffect(() => {
    // console.log("fetchPinned function called");
    fetchPinned(route?.params?.chatId);
  }, []);
  const fetchPinned = chatId => {
    return;
    if (!chatId) return console.log('Chat id is missing');
    axios
      .get(`/chat/fetchpinned/${chatId}`)
      .then(res => {
        // console.log(res.data.pinnedMessages);
        if (res.data?.pinnedMessages?.length === 0) setIsPinnedVisible(false);
        dispatch(setPinned(res.data.pinnedMessages));
        setPinnedMessages(res.data.pinnedMessages);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useLayoutEffect(() => {
    if (route?.params?.name) {
      navigation.setOptions({
        title: 'Chat',
        headerBackTitleVisible: false,
        headerTitleAlign: 'left',

        headerTitle: () => (
          <View
            style={{
              minHeight: responsiveScreenHeight(6),
            }}>
            <ChatProvider
              route={route}
              chat={chat}
              image={route.params.image}
              name={route.params.name}
              pinnedMessages={pinnedMessages}
              setIsPinnedVisible={setIsPinnedVisible}
              setIsDialogueVisible={setIsDialogueVisible}>
              <ChatScreenTopPart
                setStopAudio={setStopAudio}
                navigation={navigation}
                pinnedMessages={pinnedMessages}
                setIsPinnedVisible={setIsPinnedVisible}
                isPinnedVisible={isPinnedVisible}
              />
            </ChatProvider>
          </View>
        ),
      });
    }
  }, [route, navigation, chat]);

  const fetchMessages = options => {
    axios(options)
      .then(res => {
        console.log(res?.data?.messages?.length);
        dispatch(
          syncMessage({
            chat: res.data.chat?._id,
            messages: res.data.messages,
            lastSync: moment().toISOString(),
          }),
        );
        if (res.data?.messages?.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setIsLoading(false);
        dispatch(markRead({chatId: res.data.chat?._id}));

        console.log(res?.data?.pinnedCount);
        if (res?.data?.pinnedCount && res?.data?.pinnedCount > 0) {
          fetchPinned(res.data.chat?._id);
        }
        console.log('messages fetched successfully');
      })
      .catch(err => {
        if (isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          setIsLoading(false);
          Alert.alert(err.response?.data?.error);
          console.log(err.response?.data);
        }
      });
  };

  const fetchMore = page => {
    if (isFetching) return;
    setIsFetching(true);

    let options = {
      page: page + 1,
      chat: route.params.chatId,
      limit,
    };

    axios
      .post(`/chat/messages`, options)
      .then(res => {
        dispatch(markRead({chatId: res.data.chat?._id}));
        dispatch(
          pushHistoryMessages({
            chat: res.data.chat?._id,
            messages: res.data.messages || [],
          }),
        );
        setCurrentPage(page + 1);
        if (res.data?.messages?.length < limit) {
          setHasMore(false);
        }
        setHasMore(false);
        setIsFetching(false);
      })
      .catch(err => {
        console.log(err?.response);
        setIsFetching(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (messagesPending?.length > 0) {
      setMessagesPending(prev => prev.slice(0, -1));
    }
  }, [messages]);

  useEffect(() => {
    dispatch(isPinned(isPinnedVisible));
  }, [isPinnedVisible]);

  const handleDelete = message => {
    // setIsDeleting(true);

    axios
      .delete(`/chat/delete/message/${message?._id}`)
      .then(res => {
        handleUpdateMessage(res.data.message);

        const isItPinned = pinnedMessages?.filter(
          item => item._id === message._id,
        );
        if (isItPinned?.length) {
          axios
            .patch(`/chat/pin/${message?._id}`)
            .then(res => {
              if (res.data.message) {
                handleUpdateMessage(res.data.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
        dispatch(
          updateLatestMessage({
            chatId: chat?._id,
            latestMessage: {text: ''},
            counter: 1,
          }),
        );
        setMessageToDelete(null);
      })
      .catch(err => {
        console.log(err);
        Alert.alert(err?.response?.data?.error || 'Error');
      });
  };

  const scrollToBottom = () => {
    scrollViewRef?.current?.scrollToOffset({animated: true, offset: 0});
  };

  const handleUpdateMessage = message => {
    dispatch(updateMessage({chat: chat?._id, message}));
    if (message?.pinnedBy === null || message?.pinnedBy?._id) {
      fetchPinned(chat?._id);
    }
  };
  const handlePin = id => {
    axios
      .patch(`/chat/pin/${id}`)
      .then(res => {
        if (res.data.message) {
          handleUpdateMessage(res.data.message);

          if (res.data.message?.pinnedBy === null) {
            showToast('Unpinned successfully...', Colors.Primary);
            return;
          } else {
            showToast('Pinned successfully...');
            return;
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const [groupedMessages, setGroupedMessages] = useState([]);

  useEffect(() => {
    if (chatMessages[route?.params?.chatId]) {
      let arr = [
        ...messages,
        ...(chatMessages[route?.params?.chatId] || undefined),
        ...messagesPending,
      ];
      setGroupedMessages(_.uniqBy(arr.reverse(), '_id'));
    } else {
      setGroupedMessages([]);
    }
  }, [route, messages, messagesPending, chatMessages]);

  const {bottom, top} = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        paddingBottom: bottom / 2,
        paddingTop: top,
      }}>
      <View
        style={{
          minHeight: responsiveScreenHeight(6),
          // paddingBottom: responsiveScreenHeight(1),
        }}>
        <ChatProvider
          route={route}
          chat={chat}
          image={route.params.image}
          name={route.params.name}
          pinnedMessages={pinnedMessages}
          setIsPinnedVisible={setIsPinnedVisible}
          setIsDialogueVisible={setIsDialogueVisible}>
          <ChatScreenTopPart
            setStopAudio={setStopAudio}
            navigation={navigation}
            pinnedMessages={pinnedMessages}
            setIsPinnedVisible={setIsPinnedVisible}
            isPinnedVisible={isPinnedVisible}
          />
        </ChatProvider>
      </View>
      <Provider>
        <Snackbar
          visible={isSnakbarVisible}
          onDismiss={() => setIsSnakbarVisible(false)}
          duration={1000}
          style={{zIndex: 1}}>
          Message Copied to clipboard
        </Snackbar>
        <View style={[{}, styles.container]}>
          {isLoading ? (
            <Loading />
          ) : isPinnedVisible && pinnedMessages?.length ? (
            <FlatList
              data={[...pinnedMessages].reverse()}
              renderItem={({item, index, separators}) => (
                <PinMessage
                  handleLongPress={message => handleMessageOption(message)}
                  handlePin={handlePin}
                  handleUpdateMessage={handleUpdateMessage}
                  message={item}
                  chat={chat}
                  key={index}
                />
              )}
              keyExtractor={(item, index) =>
                item?._id ? `${item._id}` : index.toString()
              }
              inverted
            />
          ) : (
            groupedMessages?.length > 0 && (
              <FlatList
                data={groupedMessages}
                renderItem={({item, index, separators}) => {
                  const lastSender =
                    item?.sender?._id ===
                    groupedMessages[index - 1]?.sender?._id;
                  const nextSender =
                    item?.sender?._id ===
                    groupedMessages[index + 1]?.sender?._id;

                  return (
                    <Message
                      handleLongPress={message => {
                        handleMessageOption(message);
                      }}
                      handleSetDelete={handleSetDelete}
                      lastSender={lastSender}
                      nextSender={nextSender}
                      handleSetEdit={handleSetEdit}
                      handlePin={handlePin}
                      copyToClipboard={copyToClipboard}
                      message={item}
                      chat={chat}
                      navigation={navigation}
                      key={index}
                    />
                  );
                }}
                keyExtractor={(item, index) =>
                  item?._id ? `${item._id}` : index.toString()
                }
                inverted
                ref={scrollViewRef}
                initialNumToRender={1}
                onEndReachedThreshold={0.5}
                onEndReached={distanceFromEnd => {
                  fetchMore(currentPage);
                }}
                ListFooterComponent={
                  <>
                    {hasMore && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.MediumGreen,
                          paddingHorizontal: 3,
                          paddingVertical: 10,
                          borderRadius: 3,
                          color: Colors.Primary,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: responsiveScreenWidth(2),
                        }}
                        activeOpacity={0.5}
                        disabled={isFetching}
                        onPress={() => fetchMore(currentPage)}>
                        {isFetching && (
                          <ActivityIndicator color={Colors.Primary} size={20} />
                        )}
                        <Text
                          style={{textAlign: 'center', color: Colors.Primary}}>
                          Fetch More
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                }
              />
            )
          )}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={88}>
          <View style={styles.footer}>
            {isPinnedVisible && pinnedMessages?.length ? (
              <View
                style={{
                  backgroundColor: Colors.Background_color,
                  paddingBottom: 5,
                }}>
                <TouchableOpacity
                  onPress={() => setIsPinnedVisible(prev => !prev)}
                  style={{
                    width: '98%',
                    alignSelf: 'center',
                    minHeight: responsiveScreenHeight(5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    backgroundColor: Colors.White,
                  }}>
                  <Text
                    style={{
                      color: Colors.BodyText,
                      textAlign: 'center',
                      fontFamily: CustomeFonts.SEMI_BOLD,
                    }}>
                    Exit pin messages
                  </Text>
                </TouchableOpacity>
              </View>
            ) : chat?.myData?.mute?.isMuted ? (
              <View>
                {chat?.myData?.mute?.isMuted && (
                  <Text
                    style={{
                      color: 'red',
                      textAlign: 'center',
                      fontSize: 18,
                      marginVertical: 20,
                      fontWeight: 'bold',
                    }}>
                    You have been muted from this channel
                    {chat?.myData?.mute?.date && (
                      <>
                        {' '}
                        - untill (
                        {moment(chat?.myData?.mute?.date).format(
                          'D MMM, YYYY HH:MM a',
                        )}
                        )
                      </>
                    )}
                  </Text>
                )}
              </View>
            ) : chat && chat.readOnly ? (
              <View>
                <Text
                  style={{
                    color: 'red',
                    textAlign: 'center',
                    fontSize: 18,
                    marginVertical: 10,
                    fontWeight: 'bold',
                  }}>
                  This is a read only channel
                </Text>
              </View>
            ) : (
              <>
                {messageToEdit && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      backgroundColor: Colors.White,
                      paddingTop: responsiveScreenHeight(1),
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: 3,
                        color: Colors.Heading,
                      }}>
                      Editing message:
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setMessageToEdit(null);
                        setText('');
                      }}
                      style={{marginLeft: 10}}
                      activeOpacity={0.5}>
                      <Text style={{color: 'red', fontWeight: 'bold'}}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <ChatFooter
                  stopAudio={stopAudio}
                  chat={chat}
                  setText={setText}
                  text={text}
                  scrollToBottom={scrollToBottom}
                  messageToEdit={messageToEdit}
                  setMessageToEdit={setMessageToEdit}
                  setMessagesPending={setMessagesPending}
                />
              </>
            )}
          </View>
        </KeyboardAvoidingView>
        {/* <JitsiMeetWebView
      roomName={route.params.chatId}
      onConferenceTerminated={(data) => console.log("terminated", data)}
      onConferenceJoined={(data) => console.log("joined", data)}
      onConferenceWillJoin={(data) => console.log("joining", data)}
     /> */}

        {selecetedMessage && (
          <MessageOptionModal
            handleDelete={handleDelete}
            messageToDelete={messageToDelete}
            setMessageToDelete={setMessageToDelete}
            navigation={navigation}
            message={selecetedMessage}
            copyToClipboard={copyToClipboard}
            chat={chat}
            handleSetEdit={handleSetEdit}
            handleSetDelete={handleSetDelete}
            handlePin={handlePin}
            setSelectedMessage={setSelectedMessage}
          />
        )}
      </Provider>
    </View>
  );
};

export default NewMessageScreen;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      zIndex: 0,
      paddingHorizontal: 10,
      position: 'relative',
    },
    footer: {
      width: '100%',
      // padding: 10,
      flexDirection: 'column',
      // backgroundColor: Colors.White,
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
      width: '70%',
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

      elevation: 5,
    },
    contentContainer: {
      backgroundColor: color.bg,
      color: Colors.White,
      paddingVertical: 10,
    },

    modalStyle: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(19),
      paddingHorizontal: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(8),
    },
  });
