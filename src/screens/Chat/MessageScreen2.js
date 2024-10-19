import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';
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
import {useMainContext} from '../../context/MainContext';

const MessageScreen2 = () => {
  const {bottom, top} = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const {setAllMessages, allMessages} = useMainContext();
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
      setIsLoading(true);
      const options = {
        page: pageNumber,
        chat: selectedChat.chatId,
        limit: 10,
      };

      try {
        const res = await axiosInstance.post('/chat/messages', options);
        const fetchedMessages = res.data.messages;

        if (!Array.isArray(fetchedMessages)) {
          throw new Error('Invalid messages format received from API');
        }

        const newMessages = fetchedMessages.reverse();

        setAllMessages(pre => ({
          ...pre,
          [selectedChat.chatId]: [
            ...(pre[selectedChat.chatId] || []),
            ...newMessages,
          ],
        }));

        if (newMessages.length < options.limit) {
          setHasMore(false);
        } else {
          setPage(prevPage => prevPage + 1);
        }
      } catch (err) {
        console.error(
          'Error fetching messages:',
          err.response?.data || err.message,
        );
        // Optionally, set an error state here to inform the user
      } finally {
        setIsLoading(false);
      }
    },
    [selectedChat.chatId],
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    getMessages(1);
  }, [getMessages, selectedChat.chatId]);

  const handleLoadMore = () => {
    console.log('HandleLoadMore called.....');
    if (!isLoadingRef.current && hasMoreRef.current) {
      getMessages(page);
    }
  };

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
    <View
      style={[
        styles.container,
        {paddingBottom: bottom, paddingTop: top / 1.5},
      ]}>
      <MessageTopPart />
      <View style={styles.flatListContainer}>
        <FlatList
          data={allMessages[selectedChat.chatId]}
          renderItem={renderItem}
          keyExtractor={item => Math.random()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
