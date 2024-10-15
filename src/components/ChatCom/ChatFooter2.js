import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import IconContainer from './ChatFooter/IconContainer';
import SendContainer from './ChatFooter/SendContainer';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import ChatMessageInput from './ChatMessageInput';
import {useDispatch, useSelector} from 'react-redux';
import {
  pushMessage,
  setMessages,
  setNewMessages,
  updateSendingInfo,
} from '../../store/reducer/chatReducer';
import axiosInstance from '../../utility/axiosInstance';
const convertLink = text => {
  var exp =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  var text1 = text.replace(exp, '<a target="_blank" href="$1">$1</a>');
  var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
};
const ChatFooter2 = ({chatId}) => {
  const [text, setText] = useState('');
  const {user} = useSelector(state => state.auth);
  const {messages} = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const [messageClicked, setMessageClicked] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isSendingText, setIsSendingText] = useState(false);

  const sendMessage = files => {
    console.log('text', JSON.stringify(text, null, 1));
    // if (!text.trim() && (!allFiles || allFiles.length === 0) && (!files || files.length === 0)) {
    //   return showAlertModal({
    //     title: "Write something",
    //     type: "warning",
    //     message: "Please write something before proceeding",
    //   });
    // }

    Keyboard.dismiss();
    setIsSendingText(true);
    let data = {
      text: convertLink(text),
      //   files: files ? files : allFiles || [],
    };
    // if (parentMessage) {
    //   data['parentMessage'] = parentMessage;
    // }

    let randomId = Math.floor(Math.random() * (999999 - 1111) + 1111);
    let messageData = {
      message: {
        ...data,
        _id: randomId,
        sender: {
          _id: user?._id,
          fullName: user?.firstName + ' ' + user?.lastName,
          profilePicture: user.profilePicture,
        },
        createdAt: Date.now(),
        status: 'sending',
        chat: chatId,
        type: 'message',
      },
    };

    dispatch(pushMessage(messageData));

    setText('');
    // setMessageFocused(false);
    // scrollToBottom();
    axiosInstance
      .put(`/chat/sendmessage/${chatId}`, data)
      .then(res => {
        // console.log('res.data', JSON.stringify(res.data, null, 1));
        //setMessages(prev => [...prev, res.data.message])
        dispatch(setMessages([res.data.message, ...messages]));
        dispatch(
          updateSendingInfo({
            message: res.data.message,
            trackingId: randomId,
          }),
        );
        // clearFields();
        // setAllFiles([]);
        // setSelectedAudio([]);
        // setSelectedImage([]);
        // setSelected([]);
        //scrollToBottom()
        setIsSendingText(false);
      })
      .catch(err => {
        setIsSendingText(false);
        // showAlertModal({
        //   title: 'Error',
        //   type: 'error',
        //   message: err?.response?.data?.error,
        // });
        // setMessagesPending([]);
        console.log(err.response.data);
      });
  };

  return (
    <View style={styles.container}>
      {messageClicked ? (
        <ChatMessageInput text={text} setText={setText} />
      ) : (
        <TouchableOpacity
          onPress={() => {
            setMessageClicked(!messageClicked);
          }}
          style={styles.initialContainer}>
          <Text style={styles.messageText}>{text || 'Message...'}</Text>
        </TouchableOpacity>
      )}
      {text.length > 0 ? (
        <SendContainer sendMessage={sendMessage} />
      ) : (
        <IconContainer />
      )}
    </View>
  );
};

export default ChatFooter2;

const getStyles = Colors =>
  StyleSheet.create({
    messageText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.HS,
    },
    container: {
      backgroundColor: Colors.Background_color,
      minHeight: 50,
      borderRadius: 30,
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      marginTop: 10,
      overflow: 'hidden',
      //   paddingVertical:
    },
    initialContainer: {
      width: '85%',
      //   backgroundColor: 'yellow',
      height: 49,
      justifyContent: 'center',
    },
  });
