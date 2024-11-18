import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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

const MessageScreen2 = () => {
  const dispatch = useDispatch();
  console.log('rerender');
  const {top} = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {singleChat: chat} = useSelector(state => state.chat);
  const {messageOptionData} = useSelector(state => state.modal);
  const {localMessages} = useSelector(state => state.chatSlice);
  // console.log('localMessages', JSON.stringify(localMessages, null, 1));
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [messages = {}, setMessages] = useMMKVObject('allMessages');

  // const [localMessages, setLocalMessages] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [pinnedCount = {}, setPinnedCount] = useMMKVObject('pinCount');
  const [pinnedScreenVisible, setPinnedScreenVisible] = useState(false);
  const [messageEditVisible, setMessageEditVisible] = useState('');
  const LIMIT = 20;

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
      chat: chat._id,
      limit: LIMIT,
    };
    try {
      const res = await axiosInstance.post('/chat/messages', options);
      setPinnedCount({
        ...pinnedCount,
        [chat._id]: res.data.pinnedCount,
      });
      // console.log('res.data', JSON.stringify(res.data, null, 1));
      const newMessages = res.data.messages.reverse();
      setMessages({
        ...messages,
        [chat._id]: newMessages,
      });
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
      setIsLoading(false);
    }
  }, [chat._id, messages, dispatch]);

  useEffect(() => {
    if (chat._id) {
      initialGetMessage();
    }
    return () => {
      dispatch(setLocalMessages([]));
    };
  }, [chat._id]);

  const handleLoadMore = async () => {
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

    return <Message2 item={item} index={index} nextSender={nextSender} />;
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // For iOS and Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.container}>
      <View
        style={[
          ,
          {
            flex: 1,
            // paddingBottom: bottom / 2,
            paddingTop: top / 1.5,
            // backgroundColor: ,
          },
        ]}>
        {messageOptionData?._id && (
          <MessageOptionModal
            handlePin={handlePin}
            setMessageEditVisible={setMessageEditVisible}
            messageOptionData={messageOptionData}
          />
        )}
        {pinnedScreenVisible && (
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
          <FlatList
            data={localMessages?.length ? localMessages : messages[chat._id]}
            renderItem={renderItem}
            keyExtractor={item => item._id.toString()} // Use a stable key
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5} // Adjust as needed
            ListFooterComponent={ListFooterComponent}
            inverted
          />
        </View>
        <ChatFooter2
          chatId={chat._id}
          setMessages={setMessages}
          messageEditVisible={messageEditVisible}
          setMessageEditVisible={setMessageEditVisible}
          messageOptionData={messageOptionData}
        />
        {/* {openGallery && <ImageGallery />} */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen2;

const getStyles = Colors =>
  StyleSheet.create({
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
