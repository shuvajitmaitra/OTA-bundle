import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../utility/axiosInstance';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ChatFooter2 from '../../components/ChatCom/ChatFooter2';
import MessageTopPart from '../../components/ChatCom/MessageTopPart';
import Message2 from '../../components/ChatCom/Message2';
import {formatDynamicDate} from '../../utility/commonFunction';
import {useMMKVObject} from 'react-native-mmkv';
import {setLocalMessages} from '../../store/reducer/chatSlice';

const MessageScreen2 = () => {
  const dispatch = useDispatch();
  const {bottom, top} = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [totalMessage, setTotalMessage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {selectedMessageScreen: selectedChat} = useSelector(
    state => state.modal,
  );
  const {localMessages} = useSelector(state => state.chatSlice);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [messages = {}, setMessages] = useMMKVObject('allMessages');
  // const [localMessages, setLocalMessages] = useState([]);

  const LIMIT = 20;

  const initialGetMessage = useCallback(async () => {
    setIsLoading(true);
    const options = {
      page: 1,
      chat: selectedChat.chatId,
      limit: LIMIT,
    };
    try {
      const res = await axiosInstance.post('/chat/messages', options);
      const newMessages = res.data.messages.reverse();
      setMessages({
        ...messages,
        [selectedChat.chatId]: newMessages,
      });
      dispatch(setLocalMessages(newMessages));
      setTotalMessage(res.data.count || 0);
      console.log('Initial call done');
      if (newMessages.length < options.limit) {
        setHasMore(false);
      } else {
        setPage(2);
      }
    } catch (error) {
      console.log(
        'Error loading initial messages:',
        JSON.stringify(error, null, 1),
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedChat.chatId, messages, setMessages]);

  useEffect(() => {
    if (selectedChat.chatId) {
      initialGetMessage();
    }
  }, [selectedChat.chatId]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }
    setIsLoading(true);
    const options = {
      page: page,
      chat: selectedChat.chatId,
      limit: LIMIT,
    };
    try {
      const res = await axiosInstance.post('/chat/messages', options);
      const newMessages = res.data.messages.reverse();
      dispatch(setLocalMessages([...localMessages, ...newMessages]));
      // setLocalMessages(prev => [...prev, ...newMessages]);
      // Update MMKV storage
      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedChat.chatId]: [
          ...(prevMessages[selectedChat.chatId] || []),
          ...newMessages,
        ],
      }));
      if (newMessages.length < options.limit) {
        setHasMore(false);
      } else {
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.log(
        'Error loading more messages:',
        JSON.stringify(error, null, 1),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, selectedChat.chatId]);

  const ListFooterComponent = () => {
    if (!isLoading) return null;
    return (
      <View style={[styles.footer, page === 1 && styles.initialFooter]}>
        <ActivityIndicator size="small" color={Colors.Primary} />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    // const currentMessageDate = new Date(
    //   item?.createdAt || item?.updatedAt,
    // ).toDateString();
    const nextMessage = localMessages[index + 1];
    // const nextMessageDate = nextMessage
    //   ? new Date(
    //       nextMessage?.createdAt || nextMessage?.updatedAt,
    //     ).toDateString()
    //   : null;
    // const isSameDate = currentMessageDate === nextMessageDate;

    const nextSender = nextMessage
      ? item.sender._id !== nextMessage.sender._id
      : false;

    return (
      <>
        <Message2 item={item} index={index} nextSender={nextSender} />
        {/* {!isSameDate && (
          <View
            style={{
              backgroundColor: Colors.PrimaryOpacityColor,
              width: responsiveScreenWidth(24),
              alignItems: 'center',
              paddingVertical: 5,
              borderRadius: 4,
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <Text style={{color: Colors.Primary, fontWeight: '600'}}>
              {formatDynamicDate(item?.updatedAt || item?.createdAt)}
            </Text>
          </View>
        )} */}
      </>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {paddingBottom: bottom, paddingTop: top / 1.5},
      ]}>
      <MessageTopPart />
      <View style={styles.flatListContainer}>
        <FlatList
          data={
            localMessages.length
              ? localMessages
              : messages[selectedChat?.chatId]
          }
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()} // Use a stable key
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // Adjust as needed
          ListFooterComponent={ListFooterComponent}
          inverted
        />
      </View>
      <ChatFooter2 chatId={selectedChat.chatId} setMessages={setMessages} />
    </View>
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
