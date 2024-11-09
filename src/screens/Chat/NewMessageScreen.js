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
  useMemo,
  memo,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import * as Clipboard from "expo-clipboard";
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
import CustomFonts from '../../constants/CustomFonts';
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
import {useGlobalAlert} from '../../components/SharedComponent/GlobalAlertContext';
import {useNavigation} from '@react-navigation/native';
import SocketStatus from '../../components/ChatCom/SocketStatus';
import Divider from '../../components/SharedComponent/Divider';

const NewMessageScreen = ({selectedChat, setSelectedChat}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  let navigation = useNavigation();
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
  const [limit, setLimit] = useState(5);

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
    // await Clipboard.setStringAsync(message?.text.replace(/<[^>]*>?/gm, "").trim());
  };

  const showAlert = useGlobalAlert();

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
    if (chats && selectedChat?.chatId) {
      let task = InteractionManager.runAfterInteractions(() => {
        let findChat = chats?.find(chat => chat?._id === selectedChat?.chatId);
        setChat(findChat); // This might cause re-renders every time `chats` or `selectedChat.chatId` changes
        dispatch(updateChat(findChat));

        if (findChat && !isSentSync.current) {
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

          socket?.emit('syncMessages', data);
        }
      });
      return () => {
        console.log('cleaning up');

        task?.cancel();
        isSentSync.current = false;
        socket?.off('syncMessages');
      };
    }
  }, [chats, dispatch, limit, selectedChat?.chatId]); // Properly define your dependencies

  useEffect(() => {
    fetchPinned(selectedChat?.chatId);
  }, []);
  const fetchPinned = chatId => {
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

  const fetchMore = page => {
    console.log('fetching more');

    if (isFetching) return;
    setIsFetching(true);

    let options = {
      page: page + 1,
      chat: selectedChat.chatId,
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
    // scrollViewRef?.current?.scrollToOffset({ animated: true, offset: 0 });
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

  // // Optimize grouped messages calculation using useMemo.
  // const groupedMessages = useMemo(() => {
  //   if (!chatMessages[selectedChat?.chatId]) return [];
  //   const arr = [...messages, ...(chatMessages[selectedChat?.chatId] || []), ...messagesPending];
  //   return _.uniqBy(arr.reverse(), "_id");
  // }, [selectedChat, messages, messagesPending, chatMessages]);

  const [groupedMessages, setGroupedMessages] = useState([]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!chatMessages[selectedChat?.chatId]) return [];
      const arr = [
        ...messages,
        ...(chatMessages[selectedChat?.chatId] || []),
        ...messagesPending,
      ];
      setGroupedMessages(_.uniqBy(arr.reverse(), '_id'));
    });
  }, [selectedChat?.chatId, messagesPending, chatMessages, messages]);

  const {bottom, top} = useSafeAreaInsets();

  function formatDynamicDate(dateStr) {
    const momentDate = moment(dateStr);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const startOfWeek = moment().startOf('week');

    // Check if the date is today
    if (momentDate.isSame(today, 'day')) {
      return 'Today';
    }

    // Check if the date is yesterday
    if (momentDate.isSame(yesterday, 'day')) {
      return 'Yesterday';
    }

    // Check if the date is within the current week
    if (momentDate.isSameOrAfter(startOfWeek)) {
      return momentDate.format('dddd'); // Returns day name (e.g., "Monday")
    }

    // Otherwise, return the formatted date
    return momentDate.format('MMM D, YYYY'); // Returns date in "Aug 24, 2024" format
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        paddingBottom: bottom / 2,
        paddingTop: Platform.OS === 'ios' ? top : 0,
      }}>
      <View
        style={{
          minHeight: responsiveScreenHeight(6),
          // paddingBottom: responsiveScreenHeight(1),
        }}>
        <ChatProvider
          route={selectedChat}
          chat={chat}
          image={selectedChat.image}
          name={selectedChat.name}
          pinnedMessages={pinnedMessages}
          setIsPinnedVisible={setIsPinnedVisible}
          setIsDialogueVisible={setIsDialogueVisible}>
          <ChatScreenTopPart
            setStopAudio={setStopAudio}
            navigation={navigation}
            pinnedMessages={pinnedMessages}
            setIsPinnedVisible={setIsPinnedVisible}
            isPinnedVisible={isPinnedVisible}
            setSelectedChat={setSelectedChat}
          />
        </ChatProvider>
      </View>
      <SocketStatus />
      <Provider>
        <Snackbar
          visible={isSnakbarVisible}
          onDismiss={() => setIsSnakbarVisible(false)}
          duration={1000}
          style={{zIndex: 1}}>
          Message Copied to clipboard
        </Snackbar>
        {/* <View style={[styles.container]}>
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
                renderItem={({item, index}) => {
                  const lastSender =
                    item?.sender?._id ===
                    groupedMessages[index - 1]?.sender?._id;
                  const nextSender =
                    item?.sender?._id ===
                    groupedMessages[index + 1]?.sender?._id;
                  const isSameDate =
                    new Date(
                      groupedMessages[index]?.createdAt,
                    ).toDateString() ===
                    new Date(
                      groupedMessages[index + 1]?.createdAt,
                    ).toDateString();
                  return (
                    <>
                      {!index == 0 && (
                        <Divider marginTop={1} marginBottom={1} />
                      )}
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
                      {!isSameDate && (
                        <View
                          style={{
                            backgroundColor: Colors.PrimaryOpacityColor,
                            width: responsiveScreenWidth(24),
                            alignItems: 'center',
                            paddingVertical: 5,
                            borderRadius: 4,
                            alignSelf: 'center',
                          }}>
                          <Text
                            style={{color: Colors.Primary, fontWeight: '600'}}>
                            {formatDynamicDate(
                              item?.updatedAt || item?.createdAt,
                            )}
                          </Text>
                        </View>
                      )}
                    </>
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
                getItemLayout={(data, index) => ({
                  length: 100, // Approximate height of each message item
                  offset: 100 * index,
                  index,
                })}
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
        </View> */}

        <View
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={88}
        >
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
                      fontFamily: CustomFonts.SEMI_BOLD,
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

                {/* <ChatFooter
                  stopAudio={stopAudio}
                  chat={chat}
                  setText={setText}
                  text={text}
                  scrollToBottom={scrollToBottom}
                  messageToEdit={messageToEdit}
                  setMessageToEdit={setMessageToEdit}
                  setMessagesPending={setMessagesPending}
                /> */}
              </>
            )}
          </View>
        </View>
        {/* <JitsiMeetWebView
      roomName={selectedChat.chatId}
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
            setSelectedChat={setSelectedChat}
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
      paddingBottom: responsiveScreenHeight(1),
    },
    footer: {
      width: '100%',
      // padding: 10,
      flexDirection: 'column',
      // backgroundColor: Colors.Red,
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
