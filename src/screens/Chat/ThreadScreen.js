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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeFonts from '../../constants/CustomeFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../utility/axiosInstance';
import Message2 from '../../components/ChatCom/Message2';
import ChatFooter2 from '../../components/ChatCom/ChatFooter2';

const ThreadScreen = routes => {
  const chatMessage = routes.route.params.params;
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const [localMessages, setLocalMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getReplies({
      parentMessage: chatMessage._id,
      chat: chatMessage.chat,
      page,
    });
  }, []);

  const getReplies = ({parentMessage, chat, page}) => {
    setIsLoading(true);
    let options = {
      page,
      parentMessage,
      chat,
    };
    axiosInstance
      .post(`/chat/messages`, options)
      .then(res => {
        console.log('res.data', JSON.stringify(res.data, null, 1));
        setLocalMessages(pre => [...pre, ...res.data.messages]);
        setPage(pre => pre + 1);
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
      <View style={[styles.footer, page === 1 && styles.initialFooter]}>
        <ActivityIndicator size="small" color={Colors.Primary} />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <Message2 item={item} index={index} nextSender={true} />
      </>
    );
  };
  return (
    <View
      style={{
        paddingTop: top,
        flex: 1,
        backgroundColor: Colors.White,
        paddingBottom: 20,
      }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}>
          <ArrowLeft color={Colors.BodyText} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={localMessages}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          onEndReached={() =>
            getReplies({
              parentMessage: chatMessage._id,
              chat: chatMessage.chat,
              page,
            })
          }
          onEndReachedThreshold={0.5}
          //   ListFooterComponent={ListFooterComponent}
          inverted
        />
      </View>
      <ChatFooter2 chatId={{}} setMessages={() => {}} />
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
    headerContainer: {
      height: 50,
      justifyContent: 'center',
      paddingHorizontal: 10,
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    backButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      marginLeft: 10,
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
    },
  });
