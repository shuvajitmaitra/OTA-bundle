import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setThreadMessages} from '../../store/reducer/chatSlice';
import Message2 from '../../components/ChatCom/Message2';
import ChatFooter2 from '../../components/ChatCom/ChatFooter2';
import ScreenHeader from '../../components/SharedComponent/ScreenHeader';
import ThreadMessageItem from '../../components/ChatCom/ThreadMessageItem';
import MessageOptionModal from '../../components/ChatCom/Modal/MessageOptionModal';
import Loading from '../../components/SharedComponent/Loading';
import axiosInstance from '../../utility/axiosInstance';
import {getSingleMessage} from '../../actions/apiCall';

const ThreadScreen = ({route}) => {
  const {parentMessage, chat} = route.params;
  const dispatch = useDispatch();
  const {threadMessages} = useSelector(state => state.chatSlice);
  const {messageOptionData} = useSelector(state => state.modal);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageEditVisible, setMessageEditVisible] = useState(false);

  useEffect(() => {
    getReplies({
      parentMessage,
      chat,
      page: 1,
    });
    getSingleMessage(parentMessage);

    return () => {
      dispatch(setThreadMessages([]));
    };
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [threadMessages]);

  const getReplies = () => {
    setIsLoading(true);
    let options = {
      page: 1,
      parentMessage,
      chat,
    };
    axiosInstance
      .post('/chat/messages', options)
      .then(res => {
        dispatch(setThreadMessages(res.data.messages));
      })
      .catch(error => {
        console.log('error getting replies', JSON.stringify(error, null, 1));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        paddingTop: top,
        paddingBottom: 20,
      }}>
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: Colors.White}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        {messageOptionData?._id && (
          <MessageOptionModal
            handlePin={() => {}}
            setMessageEditVisible={setMessageEditVisible}
            messageOptionData={messageOptionData}
            isThread={parentMessage}
          />
        )}
        <ScreenHeader />
        {/* <ThreadMessageItem
          message={chatMessage}
          replyCount={
            threadMessages.length
              ? threadMessages.length
              : chatMessage.replyCount
          }
        /> */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.flatListContainer}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }>
          {isLoading ? (
            <View style={{height: 500}}>
              <Loading backgroundColor={'transparent'} />
            </View>
          ) : (
            threadMessages.map((item, index) => {
              const nextMessage = threadMessages[index - 1];
              const isSameDate =
                new Date(item?.createdAt).toDateString() ===
                new Date(nextMessage?.createdAt).toDateString();

              const nextSender = nextMessage
                ? item?.sender?._id !== nextMessage?.sender?._id
                : false;
              return (
                <Message2
                  key={index}
                  item={{...item, isSameDate}}
                  index={index}
                  nextSender={nextSender}
                />
              );
            })
          )}
        </ScrollView>
        <ChatFooter2
          parentId={parentMessage}
          chatId={chat}
          messageEditVisible={messageEditVisible}
          setMessageEditVisible={setMessageEditVisible}
          messageOptionData={{chat, parentMessage}}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ThreadScreen;

const getStyles = Colors =>
  StyleSheet.create({
    flatListContainer: {
      backgroundColor: Colors.White,
      flex: 1,
    },
  });
