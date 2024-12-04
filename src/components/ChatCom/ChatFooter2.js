// ChatFooter2.js

import React, {useState, useCallback, useEffect} from 'react';
import {
  Alert,
  Keyboard,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import SendContainer from './ChatFooter/SendContainer';
import ChatMessageInput from './ChatMessageInput';
import ImageGallery from './ChatFooter/ImageGallery';
import AudioRecorder from './ChatFooter/AudioRecorder';
import DocumentContainer from './DocumentContainer';
import LoadingSmall from '../SharedComponent/LoadingSmall';

import PlusIcon from '../../assets/Icons/PlusIcon';
import AttachmentIcon from '../../assets/Icons/AttachmentIcon';
import GallaryIcon from '../../assets/Icons/GallaryIcon';
import ArrowTopIcon from '../../assets/Icons/ArrowTopIcon';

import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import axiosInstance from '../../utility/axiosInstance';
import {socket} from '../../utility/socketManager';

import {
  setLocalMessages,
  setThreadMessages,
  updateMessage,
  updateRepliesCount,
  updateThreadMessage,
} from '../../store/reducer/chatSlice';
import {updateLatestMessage} from '../../store/reducer/chatReducer';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
const WWW_REGEX = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

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

const ChatFooter2 = ({
  chatId = '',
  setMessages = () => {},
  messageEditVisible = false,
  setMessageEditVisible = () => {},
  parentId = '',
}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {localMessages, threadMessages} = useSelector(state => state.chatSlice);
  const {singleChat} = useSelector(state => state.chat);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [documentVisible, setDocumentVisible] = useState(null);
  const [showBottom, setShowBottom] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [editedText, setEditedText] = useState(messageEditVisible.text || '');
  const [messageClicked, setMessageClicked] = useState(false);
  const [startRecording, setStartRecording] = useState(false);
  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setShowBottom(false),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {},
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Toggle the bottom container
  const toggleBottom = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Keyboard.dismiss();
    setShowBottom(prev => !prev);
  };

  // Handle message input changes and typing status
  const handleKey = () => {
    const profileData = {
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      fullName: user?.fullName,
      profilePicture: user?.profilePicture,
    };

    if (!typing) {
      setTyping(true);
      socket.emit('typing', {
        chatId: singleChat?._id,
        typingData: {isTyping: true, user: profileData},
      });
    }

    clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        setTyping(false);
        socket.emit('typing', {
          chatId: singleChat?._id,
          typingData: {isTyping: false, user: profileData},
        });
      }, 2000),
    );
  };

  // Send message handler
  const sendMessage = useCallback(
    async (txt, files) => {
      console.log('calledddddd');
      setSelectedImages([]);
      setSelectedDocuments([]);
      setDocumentVisible(false);
      setShowBottom(false);
      Keyboard.dismiss();

      const data = {
        text: convertLink(txt || text),
        files: files || [],
        parentMessage: parentId,
      };
      const randomId = Math.floor(Math.random() * (999999 - 1111) + 1111);
      const messageData = {
        message: {
          ...data,
          _id: randomId,
          sender: {
            _id: user?._id,
            fullName: `${user?.firstName} ${user?.lastName}`,
            profilePicture: user.profilePicture,
            type: user.type,
          },
          createdAt: Date.now(),
          status: 'sending',
          chat: chatId,
          type: 'message',
        },
      };

      setMessages(prev => ({
        ...prev,
        [chatId]: [messageData.message, ...(prev[chatId] || [])],
      }));
      dispatch(setLocalMessages([messageData.message, ...localMessages]));
      setText('');

      try {
        const res = await axiosInstance.put(
          `/chat/sendmessage/${chatId}`,
          data,
        );

        if (parentId) {
          dispatch(setThreadMessages([res.data.message, ...threadMessages]));
          dispatch(updateRepliesCount(parentId));
        } else {
          setMessages(prev => ({
            ...prev,
            [chatId]: [res.data.message, ...(prev[chatId] || [])],
          }));
          dispatch(setLocalMessages([res.data.message, ...localMessages]));
        }
        setSelectedImages([]);
        setSelectedDocuments([]);
      } catch (err) {
        if (__DEV__) {
          console.error('Error sending message:', err.response?.data);
        }
        Alert.alert('Error', 'Failed to send message.');
      } finally {
        setUploading(false);
      }
    },
    [
      text,
      user,
      chatId,
      setMessages,
      dispatch,
      localMessages,
      parentId,
      threadMessages,
    ],
  );

  // Handle image selection
  const selectImage = () => {
    Keyboard.dismiss();
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

  // Handle document selection
  const handleDocumentSelection = async () => {
    setShowBottom(false);
    setDocumentVisible(true);
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });
      setSelectedDocuments(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
        setDocumentVisible(false);
        setSelectedDocuments([]);
      } else {
        console.error(err);
        Alert.alert('Error', 'Failed to pick document.');
      }
    }
  };

  // Upload images and send message
  const uploadImagesAndSend = async txt => {
    setUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        selectedImages.map(async item => {
          const formData = new FormData();
          formData.append('file', {
            uri: item.uri,
            name: item.fileName || 'uploaded_image',
            type: item.type || 'image/jpeg',
          });

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const res = await axiosInstance.post('/chat/file', formData, config);
          return res.data.file;
        }),
      );

      const files = uploadedFiles.map(file => ({
        name: file.name || 'uploaded_file',
        size: file.size,
        type: file.type,
        url: file.location,
      }));

      sendMessage(txt, files);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to upload images.');
    } finally {
      setUploading(false);
    }
  };

  // Upload documents and send message
  const uploadDocumentsAndSend = async txt => {
    setUploading(true);
    setDocumentVisible(false);
    try {
      const uploadedFiles = await Promise.all(
        selectedDocuments.map(async item => {
          const formData = new FormData();
          formData.append('file', {
            uri: item.uri,
            name: item.name || 'uploaded_document',
            type: item.type || 'application/pdf',
          });

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const res = await axiosInstance.post('/chat/file', formData, config);
          return res.data.file;
        }),
      );

      const files = uploadedFiles.map(file => ({
        name: file.name || 'uploaded_file',
        size: file.size,
        type: file.type,
        url: file.location,
      }));

      sendMessage(txt, files);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  // Toggle message edit mode
  const toggleMessageClicked = useCallback(() => {
    setMessageClicked(prev => !prev);
  }, []);

  // Handle message editing
  const handleEditMessage = async message => {
    if (!editedText.trim()) {
      return Alert.alert('Validation', 'Please write something.');
    }

    const data = {
      text: convertLink(editedText),
    };

    Keyboard.dismiss();

    try {
      const res = await axiosInstance.patch(
        `/chat/update/message/${message._id}`,
        data,
      );
      const newMessage = {...res.data.message, editedAt: new Date()};
      console.log('newMessage', JSON.stringify(newMessage, null, 1));
      if (!newMessage.parentMessage) {
        dispatch(updateMessage(newMessage));
        dispatch(
          updateLatestMessage({
            chatId: message.chat,
            latestMessage: res.data.message,
            counter: 1,
          }),
        );
      } else {
        dispatch(updateThreadMessage(newMessage));
      }
      setMessageEditVisible(false);
      setEditedText('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to edit message.');
    } finally {
    }
  };

  // Render different states based on visibility
  if (messageEditVisible) {
    return (
      <Pressable onPress={() => Keyboard.dismiss()}>
        <>
          <EditMessageHeader
            onCancel={() => setMessageEditVisible(false)}
            styles={styles}
            Colors={Colors}
          />
          <View style={styles.editMessageContainer}>
            <ChatMessageInput
              handleKey={handleKey}
              chat={singleChat?._id}
              isChannel={singleChat?.isChannel}
              text={
                messageEditVisible.text ? messageEditVisible.text : editedText
              }
              setText={setEditedText}
              maxHeight={responsiveScreenHeight(45)}
            />
            <SendContainer
              sendMessage={() => handleEditMessage(messageEditVisible)}
            />
          </View>
        </>
      </Pressable>
    );
  }

  if (documentVisible) {
    return (
      <DocumentContainer
        selected={selectedDocuments}
        onClose={() => {
          setSelectedDocuments([]);
          setDocumentVisible(false);
          setShowBottom(false);
        }}
        uploadDocument={uploadDocumentsAndSend}
        handleKey={handleKey}
        chat={singleChat?._id}
        isChannel={singleChat?.isChannel}
      />
    );
  }

  if (selectedImages.length) {
    return (
      <ImageGallery
        selectedImages={selectedImages}
        onClose={() => {
          toggleBottom();
          setSelectedImages([]);
        }}
        onSend={uploadImagesAndSend}
      />
    );
  }

  return (
    <View>
      {!startRecording && (
        <View style={styles.mainContainer}>
          <Pressable style={styles.toggleButton} onPress={toggleBottom}>
            {showBottom ? <ArrowTopIcon size={40} /> : <PlusIcon />}
          </Pressable>
          <View style={styles.container}>
            {messageClicked && !startRecording ? (
              <>
                <ChatMessageInput
                  chat={singleChat?._id}
                  isChannel={singleChat?.isChannel}
                  text={text}
                  setText={setText}
                  handleKey={handleKey}
                />
                {text.trim().length > 0 && (
                  <SendContainer sendMessage={() => sendMessage(text)} />
                )}
              </>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  toggleMessageClicked();
                  setShowBottom(false);
                }}
                style={styles.initialContainer}>
                <Text style={styles.messageText}>
                  {text.trim() ? text : 'Message...'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {showBottom && (
        <View
          style={[styles.bottomContainer, !startRecording && {height: 150}]}>
          {!startRecording && (
            <TouchableOpacity
              onPress={handleDocumentSelection}
              style={styles.buttonContainer}>
              {uploading ? <LoadingSmall /> : <AttachmentIcon />}
            </TouchableOpacity>
          )}

          <AudioRecorder
            sendMessage={sendMessage}
            setStartRecording={setStartRecording}
            handleKey={handleKey}
            chat={singleChat?._id}
            isChannel={singleChat?.isChannel}
          />

          {!startRecording && (
            <TouchableOpacity
              onPress={selectImage}
              style={styles.buttonContainer}>
              <GallaryIcon />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default React.memo(ChatFooter2);

// Styles
const getStyles = Colors =>
  StyleSheet.create({
    toggleButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      padding: 20,
      backgroundColor: Colors.CyanOpacity,
      borderRadius: 100,
      height: 60,
    },
    bottomContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 20,
      gap: 20,
      paddingHorizontal: 20,
    },
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: Platform.OS === 'ios' ? 25 : 10,
    },
    editingButtonText: {
      color: Colors.Red,
      fontWeight: '600',
    },
    editingText: {
      fontWeight: '600',
      color: Colors.Heading,
    },
    cancelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    messageText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.HS,
    },
    container: {
      backgroundColor: Colors.Background_color,
      minHeight: 50,
      borderRadius: 30,
      marginRight: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      flex: 1,
      overflow: 'hidden',
    },
    editMessageContainer: {
      backgroundColor: Colors.Background_color,
      minHeight: 50,
      borderRadius: 30,
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      overflow: 'hidden',
      marginBottom: 30,
    },
    initialContainer: {
      flex: 1,
      height: 49,
      justifyContent: 'center',
    },
  });

// Additional Component: EditMessageHeader
const EditMessageHeader = ({onCancel, styles, Colors}) => (
  <View style={styles.cancelContainer}>
    <Text style={styles.editingText}>Editing message: </Text>
    <TouchableOpacity onPress={onCancel}>
      <Text style={styles.editingButtonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
);
