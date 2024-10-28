// ChatFooter2.js

import React, {useState, useCallback} from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import IconContainer from './ChatFooter/IconContainer';
import SendContainer from './ChatFooter/SendContainer';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import ChatMessageInput from './ChatMessageInput';
import {pushMessage, updateSendingInfo} from '../../store/reducer/chatReducer';
import axiosInstance from '../../utility/axiosInstance';
import {setLocalMessages} from '../../store/reducer/chatSlice';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageGallery from './ChatFooter/ImageGallery';
import AudioRecorder from './ChatFooter/AudioRecorder';

// Precompiled regular expressions outside the component for performance
const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
const WWW_REGEX = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

/**
 * Converts URLs in the text to clickable anchor tags.
 *
 * @param {string} text - The input text containing URLs.
 * @returns {string} - The text with URLs converted to anchor tags.
 */
const convertLink = text => {
  let textWithLinks = text.replace(
    URL_REGEX,
    '<a target="_blank" href="$1">$1</a>',
  );
  return textWithLinks.replace(
    WWW_REGEX,
    '$1<a target="_blank" href="http://$2">$2</a>',
  );
};

/**
 * ChatFooter2 Component
 *
 * @param {object} props
 * @param {string} props.chatId - The ID of the current chat.
 * @param {function} props.setMessages - Function to update messages state.
 * @returns {JSX.Element}
 */
const ChatFooter2 = ({chatId, setMessages}) => {
  // Local state for the message text
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  console.log('selectedImages', JSON.stringify(selectedImages, null, 1));
  const {user} = useSelector(state => state.auth);

  const {localMessages} = useSelector(state => state.chatSlice);

  const dispatch = useDispatch();

  const [messageClicked, setMessageClicked] = useState(false);
  const [startRecording, setStartRecording] = useState(false);

  // Theme context
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Local state to indicate if a message is being sent
  const [isSendingText, setIsSendingText] = useState(false);

  /**
   * Handles sending a message.
   *
   * @param {Array} files - Optional files to send with the message.
   */
  const sendMessage = useCallback(
    async (text, files) => {
      if (!text.trim()) {
        // Optionally, show a warning to the user
        // Example:
        // showAlertModal({
        //   title: "Write something",
        //   type: "warning",
        //   message: "Please write something before proceeding",
        // });
        return;
      }

      // Dismiss the keyboard
      Keyboard.dismiss();
      setIsSendingText(true);

      // Prepare message data
      const data = {
        text: convertLink(text),
        // Uncomment and handle files if necessary
        // files: files || [],
      };

      // Generate a random ID for optimistic UI update
      const randomId = Math.floor(Math.random() * (999999 - 1111) + 1111);

      // Construct the message object
      const messageData = {
        message: {
          ...data,
          _id: randomId,
          sender: {
            _id: user?._id,
            fullName: `${user?.firstName} ${user?.lastName}`,
            profilePicture: user.profilePicture,
          },
          createdAt: Date.now(),
          status: 'sending',
          chat: chatId,
          type: 'message',
        },
      };

      // Optimistically add the message to the UI
      // dispatch(pushMessage(messageData));
      setText('');

      try {
        const res = await axiosInstance.put(
          `/chat/sendmessage/${chatId}`,
          data,
        );

        setMessages(prev => ({
          ...prev,
          [chatId]: [res.data.message, ...(prev[chatId] || [])],
        }));
        dispatch(setLocalMessages([res.data.message, ...localMessages]));
        // setLocalMessages(pre => [res.data.message, ...pre]);
        setSelectedImages([]);
      } catch (err) {
        setIsSendingText(false);

        if (__DEV__) {
          console.error('Error sending message:', err.response?.data);
        }
      } finally {
        setIsSendingText(false);
      }
    },
    [text, user, chatId],
  );

  /**
   * Toggles the visibility of the message input field.
   */
  const toggleMessageClicked = useCallback(() => {
    setMessageClicked(prev => !prev);
  }, []);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
      selectionLimit: 5,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setSelectedImages(response.assets);
      }
    });
  };
  return (
    <>
      <View style={styles.container}>
        {messageClicked && !startRecording ? (
          <ChatMessageInput text={text} setText={setText} />
        ) : startRecording ? (
          <AudioRecorder onCancel={() => setStartRecording(false)} />
        ) : (
          <TouchableOpacity
            onPress={toggleMessageClicked}
            style={styles.initialContainer}>
            <Text style={styles.messageText}>
              {text.trim() ? text : 'Message...'}
            </Text>
          </TouchableOpacity>
        )}

        {!startRecording && (
          <>
            {text.length > 0 ? (
              <SendContainer sendMessage={() => sendMessage(text)} />
            ) : (
              <IconContainer
                setStartRecording={setStartRecording}
                selectImage={selectImage}
                // setOpenGallery={setOpenGallery}
              />
            )}
          </>
        )}
      </View>
      {selectedImages?.length > 0 && (
        <ImageGallery
          selectedImages={selectedImages}
          onClose={() => {
            setSelectedImages([]);
          }}
          onSend={message => {
            sendMessage(message);
          }}
        />
      )}
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ChatFooter2);

/**
 * Styles for the ChatFooter2 component.
 *
 * @param {object} Colors - Theme colors from the context.
 * @returns {object} - StyleSheet object.
 */
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
    },
    initialContainer: {
      width: '85%',
      height: 49,
      justifyContent: 'center',
    },
  });
