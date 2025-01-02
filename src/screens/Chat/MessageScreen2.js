import React, {useEffect, useState, useCallback, useLayoutEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../utility/axiosInstance';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import ChatFooter2 from '../../components/ChatCom/ChatFooter2';
import MessageTopPart from '../../components/ChatCom/MessageTopPart';
import Message2 from '../../components/ChatCom/Message2';
import {useMMKVObject} from 'react-native-mmkv';
import {
  setLocalMessages,
  updatePinnedMessage,
} from '../../store/reducer/chatSlice';
import {setMessageOptionData} from '../../store/reducer/ModalReducer';
import PinnedMessagesScreen from './PinnedMessagesScreen';
import MessageOptionModal from '../../components/ChatCom/Modal/MessageOptionModal';
import EmptyMessageContainer from '../../components/ChatCom/EmptyMessageContainer';
import Message3 from '../../components/ChatCom/Message3';

const MessageScreen2 = () => {
  const dispatch = useDispatch();
  console.log('rerender');
  const {top, bottom} = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {singleChat: chat} = useSelector(state => state.chat);
  const {messageOptionData} = useSelector(state => state.modal);
  const {localMessages} = useSelector(state => state.chatSlice);
  const [viewImage, setViewImage] = useState([]);
  // console.log('viewImage', JSON.stringify(viewImage, null, 2));
  // console.log('localMessages', JSON.stringify(localMessages, null, 1));
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [messages = {}, setMessages] = useMMKVObject('allMessages');

  // const [localMessages, setLocalMessages] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [pinnedCount = {}, setPinnedCount] = useMMKVObject('pinCount');
  const [pinnedScreenVisible, setPinnedScreenVisible] = useState(false);
  const [messageEditVisible, setMessageEditVisible] = useState('');
  const [viewInitialMessage, setViewInitialMessage] = useState(false);
  const LIMIT = 15;

  const fetchPinned = chatId => {
    if (!chatId) {
      return console.log('Chat id is missing');
    }
    axiosInstance
      .get(`/chat/fetchpinned/${chatId}`)
      .then(res => {
        // console.log('res.data', JSON.stringify(res.data, null, 1));
        // if (res.data?.pinnedMessages?.length === 0)
        // dispatch(setPinnedMessages(res.data.pinnedMessages));
        setPinned(res?.data?.pinnedMessages);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const initialGetMessage = useCallback(async () => {
    setIsLoading(true);
    const options = {
      page: 1,
      chat: chat?._id,
      limit: LIMIT,
    };
    try {
      const res = await axiosInstance.post('/chat/messages', options);
      setPinnedCount({
        ...pinnedCount,
        [chat._id]: res.data.pinnedCount,
      });
      const newMessages = res.data.messages.reverse();
      setMessages({
        ...messages,
        [chat._id]: newMessages,
      });
      if (res.data.messages.length <= 1) {
        setViewInitialMessage(true);
      }
      dispatch(setLocalMessages(newMessages));
      if (newMessages.length < options.limit) {
        setHasMore(false);
      } else {
        setPage(2);
      }
    } catch (error) {
      console.log(
        'Error loading initial messages:',
        JSON.stringify(error.response.data, null, 1),
      );
    } finally {
      console.log('initial Message Calling completed');
      setIsLoading(false);
    }
  }, [chat?._id]);

  useEffect(() => {
    if (chat._id) {
      initialGetMessage();
    }
    return () => {
      dispatch(setLocalMessages([]));
    };
  }, [chat._id, dispatch, initialGetMessage]);

  const handleLoadMore = async () => {
    // console.log('handleLoadMore', hasMore);
    if (isLoading || !hasMore) {
      return;
    }
    setIsLoading(true);
    const options = {
      page: page,
      chat: chat._id,
      limit: LIMIT,
    };
    try {
      const res = await axiosInstance.post('/chat/messages', options);
      const newMessages = res.data.messages.reverse();
      dispatch(setLocalMessages([...localMessages, ...newMessages]));
      setMessages(prevMessages => ({
        ...prevMessages,
        [chat._id]: [...(prevMessages[chat._id] || []), ...newMessages],
      }));
      if (newMessages.length < options.limit) {
        setHasMore(false);
      } else {
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.log(
        'Error loading more messages:',
        JSON.stringify(error.response.data, null, 1),
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handlePin = id => {
    axiosInstance
      .patch(`/chat/pin/${id}`)
      .then(res => {
        console.log('res.data', JSON.stringify(res.data, null, 1));
        if (res.data.message) {
          if (res.data.message.pinnedBy) {
            setPinned(pre => [messageOptionData, ...pre]);
            setPinnedCount({
              ...pinnedCount,
              [chat._id]: pinnedCount[chat._id] + 1,
            });
          } else {
            setPinned(pre =>
              pre.filter(item => item._id !== res.data.message._id),
            );

            setPinnedCount({
              ...pinnedCount,
              [chat._id]: pinnedCount[chat._id] - 1,
            });
          }
          dispatch(updatePinnedMessage(res.data.message));
          dispatch(setMessageOptionData(null));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const ListFooterComponent = () => {
    if (!isLoading) {
      return null;
    }
    return (
      <View style={[styles.footer, page === 1 && styles.initialFooter]}>
        <ActivityIndicator size="small" color={Colors.Primary} />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const nextMessage = localMessages?.length
      ? localMessages[index + 1]
      : messages[chat._id][index + 1];

    const nextSender = nextMessage
      ? item?.sender?._id !== nextMessage?.sender?._id
      : false;
    const isSameDate =
      new Date(item?.createdAt).toDateString() ===
      new Date(nextMessage?.createdAt).toDateString();
    return (
      <Message3
        item={{...item, isSameDate}}
        index={index}
        nextSender={nextSender}
        setViewImage={setViewImage}
      />
    );
  };

  // useEffect(() => {
  //   // Define the behavior when the back button is pressed
  //   const backAction = () => {
  //     // You can handle custom logic here, e.g., show a confirmation dialog
  //     console.log('Back button pressed!');

  //     // Return true to prevent the default behavior (going back)
  //     // Return false to allow default back button behavior (going back)
  //     return true;
  //   };

  //   // Add the back button listener
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   // Cleanup the listener when the component unmounts
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  //   };
  // }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.container}>
      <View
        style={[
          {
            flex: 1,
            // paddingBottom: bottom / 2,
            paddingTop: top / 1.5,
            // backgroundColor: Colors.Red,
            // marginBottom: bottom / 1.5,
          },
        ]}>
        {messageOptionData?._id && (
          <MessageOptionModal
            handlePin={handlePin}
            setMessageEditVisible={setMessageEditVisible}
            messageOptionData={messageOptionData}
          />
        )}
        {pinnedScreenVisible && pinned.length && (
          <PinnedMessagesScreen
            pinned={pinned}
            setPinnedScreenVisible={setPinnedScreenVisible}
          />
        )}
        <MessageTopPart
          fetchPinned={fetchPinned}
          setPinnedScreenVisible={setPinnedScreenVisible}
        />
        <View style={styles.flatListContainer}>
          {viewInitialMessage && !localMessages.length && (
            <EmptyMessageContainer chat={chat} />
          )}

          <FlatList
            data={localMessages?.length ? localMessages : messages[chat?._id]}
            renderItem={renderItem}
            keyExtractor={(item, index) => item?._id?.toString() || index} // Use a stable key
            onEndReached={!chat.isArchived && handleLoadMore}
            onEndReachedThreshold={0.5} // Adjust as needed
            ListFooterComponent={ListFooterComponent}
            inverted
          />
        </View>
        {chat?.myData?.role !== 'owner' && chat?.isReadOnly ? (
          <View style={styles.readOnlyContainer}>
            <Text style={styles.readOnlyText}>This is read only crowd</Text>
          </View>
        ) : (
          <ChatFooter2
            chatId={chat._id}
            setMessages={setMessages}
            messageEditVisible={messageEditVisible}
            setMessageEditVisible={setMessageEditVisible}
            messageOptionData={messageOptionData}
          />
        )}
        {/* {openGallery && <ImageGallery />} */}
        <ImageView
          images={viewImage}
          imageIndex={0}
          visible={viewImage?.length !== 0}
          onRequestClose={() => setViewImage([])}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen2;

const getStyles = Colors =>
  StyleSheet.create({
    readOnlyText: {
      color: Colors.Red,
    },
    readOnlyContainer: {
      backgroundColor: Colors.LightRed,
      padding: 10,
      borderRadius: 10,
      margin: 10,
      marginBottom: 20,
      alignItems: 'center',
    },
    flatListContainer: {
      backgroundColor: Colors.White,
      flex: 1,
    },

    container: {
      flex: 1,
      backgroundColor: Colors.White,
    },

    footer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    initialFooter: {
      height: responsiveScreenHeight(80),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
