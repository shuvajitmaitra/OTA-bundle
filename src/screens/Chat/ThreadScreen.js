// useEffect(() => {
//     if (messageId) {
//       setIsLoading(true);
//       setCurrentPage(1);
//       setCount(0);
//       let options = {
//         page: currentPage,
//         parentMessage: messageId,
//         chat: chatId,
//       };
//       axios
//         .post(`/chat/messages`, options)
//         .then(res => {
//           setIsLoading(false);
//           // setChat(res.data.chat)
//           setCount(res.data.count);
//           // fetchPinned(res.data.chat?._id)

//           // setReplies(res.data.messages)

//           dispatch(
//             updateMessage({
//               message: {
//                 _id: message?._id,
//                 chat: chat?._id,
//                 replies: res.data.messages,
//               },
//             }),
//           );
//         })
//         .catch(err => {
//           setIsLoading(false);
//           err && err.response && setError(err.response?.data);
//           console.log(err);
//         });
//     }
//   }, [message]);

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../utility/axiosInstance';
import Message2 from '../../components/ChatCom/Message2';
import ChatFooter2 from '../../components/ChatCom/ChatFooter2';
import ScreenHeader from '../../components/SharedComponent/ScreenHeader';
import ThreadMessageItem from '../../components/ChatCom/ThreadMessageItem';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {useDispatch, useSelector} from 'react-redux';
import {setThreadMessages} from '../../store/reducer/chatSlice';
import MessageOptionModal from '../../components/ChatCom/Modal/MessageOptionModal';

const ThreadScreen = ({route}) => {
  const {chatMessage} = route.params;
  const dispatch = useDispatch();
  const {threadMessages} = useSelector(state => state.chatSlice);
  const {messageOptionData} = useSelector(state => state.modal);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [messageEditVisible, setMessageEditVisible] = useState(false);
  useEffect(() => {
    getReplies({
      parentMessage: chatMessage._id,
      chat: chatMessage.chat,
      page,
    });
    return () => {
      dispatch(setThreadMessages([]));
    };
  }, []);

  const getReplies = ({parentMessage, chat, page}) => {
    setIsLoading(true);
    let options = {
      page,
      parentMessage,
      chat,
    };
    axiosInstance
      .post('/chat/messages', options)
      .then(res => {
        dispatch(setThreadMessages(res.data.messages.reverse()));
        // setLocalMessages(pre => [...pre, ...res.data.messages.reverse()]);
        // if(threadMessages.length  )
        // setPage(pre => pre + 1);
      })
      .catch(error => {
        console.log('error getting replies', JSON.stringify(error, null, 1));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const ListFooterComponent = () => {
    if (!isLoading) return null;
    return (
      <View style={[styles.footer]}>
        <ActivityIndicator size="small" color={Colors.Primary} />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return <></>;
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
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        {messageOptionData?._id && (
          <MessageOptionModal
            handlePin={() => {}}
            setMessageEditVisible={setMessageEditVisible}
            messageOptionData={messageOptionData}
            isThread={chatMessage._id}
          />
        )}
        <ScreenHeader />
        <ScrollView style={styles.flatListContainer}>
          <ThreadMessageItem
            message={chatMessage}
            replyCount={
              threadMessages.length
                ? threadMessages.length
                : chatMessage.replyCount
            }
          />
          {threadMessages.map((item, index) => (
            <Message2 item={item} index={index} nextSender={true} />
          ))}
          {/* <FlatList
            data={threadMessages}
            renderItem={renderItem}
            keyExtractor={item => item._id.toString()}
            // onEndReached={() =>
            //   getReplies({
            //     parentMessage: chatMessage._id,
            //     chat: chatMessage.chat,
            //     page,
            //   })
            // }
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoading && ListFooterComponent}
            inverted={threadMessages.length === 0 ? false : true}
            ListEmptyComponent={
              threadMessages.length === 0 && !isLoading && <NoDataAvailable />
            }
          /> */}
        </ScrollView>
        <ChatFooter2
          parentId={chatMessage._id}
          chatId={chatMessage.chat}
          messageEditVisible={messageEditVisible}
          setMessageEditVisible={setMessageEditVisible}
          messageOptionData={chatMessage}
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
    footer: {
      height: 300,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
