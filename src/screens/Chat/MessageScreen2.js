import React, {useEffect, useState, useCallback, useRef} from 'react';
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
import {setMessages} from '../../store/reducer/chatReducer';
import MessageTopPart from '../../components/ChatCom/MessageTopPart';
import Message2 from '../../components/ChatCom/Message2';
import {formatDynamicDate} from '../../utility/commonFunction';
import Loading from '../../components/SharedComponent/Loading';

const MessageScreen2 = () => {
  const {bottom, top} = useSafeAreaInsets();
  const {messages} = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {selectedMessageScreen: selectedChat} = useSelector(
    state => state.modal,
  );
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const isLoadingRef = useRef(isLoading);
  const hasMoreRef = useRef(hasMore);
  const messagesRef = useRef(messages);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const getMessages = useCallback(
    async (pageNumber = 1) => {
      if (isLoadingRef.current || !hasMoreRef.current) {
        return;
      }
      console.log('pageNumber', JSON.stringify(pageNumber, null, 1));
      setIsLoading(true);
      const options = {
        page: pageNumber,
        chat: selectedChat.chatId,
        limit: 10,
      };

      try {
        const res = await axiosInstance.post('/chat/messages', options);
        const newMessages = res.data.messages.reverse();
        dispatch(
          setMessages(
            pageNumber === 1
              ? newMessages
              : [...messagesRef.current, ...newMessages],
          ),
        );
        if (newMessages.length < options.limit) {
          setHasMore(false);
        } else {
          setPage(prevPage => prevPage + 1);
        }
      } catch (err) {
        console.log(
          'error to getting message',
          JSON.stringify(err?.response?.data, null, 1),
        );
        // Optionally, handle error state here
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, selectedChat.chatId],
  );

  /**
   * Fetch initial messages when component mounts or when selectedChat changes.
   * Resets messages, page, and hasMore state.
   */
  useEffect(() => {
    dispatch(setMessages([])); // Correctly dispatch the action to reset messages
    setPage(1);
    setHasMore(true);
    getMessages(1);
  }, [dispatch, getMessages, selectedChat.chatId]);

  /**
   * Handles loading more messages when the user scrolls to the end.
   */
  const handleLoadMore = () => {
    console.log('HandleLoadMore called.....');
    if (!isLoadingRef.current && hasMoreRef.current) {
      getMessages(page);
    }
  };

  /**
   * Renders the footer component with an ActivityIndicator when loading.
   */
  const ListFooterComponent = () => {
    return (
      <>
        {isLoading ? (
          <View style={[styles.footer, page === 1 && styles.initialFooter]}>
            <ActivityIndicator size="small" color={Colors.Primary} />
          </View>
        ) : null}
      </>
    );
  };
  const renderItem = ({item, index}) => {
    const isSameDate =
      new Date(messages[index]?.createdAt).toDateString() ===
      new Date(messages[index + 1]?.createdAt).toDateString();
    return (
      <>
        <Message2 item={item} />
        {!isSameDate && (
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
        )}
      </>
    );
  };

  return (
    <>
      {isLoading && page == 1 ? (
        <Loading backgroundColor={'transparent'} />
      ) : (
        <View
          style={[
            styles.container,
            {paddingBottom: bottom, paddingTop: top / 1.5},
          ]}>
          <MessageTopPart />
          <View style={styles.flatListContainer}>
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={item => item?._id?.toString()}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={ListFooterComponent}
              inverted
            />
          </View>
          <ChatFooter2 chatId={selectedChat.chatId} getMessages={getMessages} />
        </View>
      )}
    </>
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
    // Optional styles for error handling
    /*
    errorContainer: {
      padding: 20,
      alignItems: 'center',
    },
    errorText: {
      color: Colors.Error,
      marginBottom: 10,
    },
    retryText: {
      color: Colors.Primary,
      fontWeight: 'bold',
    },
    */
  });
