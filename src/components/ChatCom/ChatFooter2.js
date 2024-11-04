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
import SendContainer from './ChatFooter/SendContainer';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import ChatMessageInput from './ChatMessageInput';
import {updateLatestMessage} from '../../store/reducer/chatReducer';
import axiosInstance from '../../utility/axiosInstance';
import {setLocalMessages, updateMessage} from '../../store/reducer/chatSlice';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageGallery from './ChatFooter/ImageGallery';
import AudioRecorder from './ChatFooter/AudioRecorder';
import PlusIcon from '../../assets/Icons/PlusIcon';
import AttachmentIcon from '../../assets/Icons/AttachmentIcon';
import DocumentPicker from 'react-native-document-picker';
import GallaryIcon from '../../assets/Icons/GallaryIcon';
import SendIcon from '../../assets/Icons/SendIcon';
import ArrowTopIcon from '../../assets/Icons/ArrowTopIcon';
import DocumentContainer from './DocumentContainer';
import LoadingSmall from '../SharedComponent/LoadingSmall';
import {socket} from '../../utility/socketManager';
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
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const {user} = useSelector(state => state.auth);
  const {localMessages} = useSelector(state => state.chatSlice);
  const {singleChat} = useSelector(state => state.chat);
  const [documentVisible, setDocumentVisible] = useState(null);
  const [showBottom, setShowBottom] = useState(false);
  const [selected, setSelected] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [editedText, setEditedText] = useState(messageEditVisible.text);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  const toggleBottom = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Keyboard.dismiss();
    setShowBottom(pre => !pre);
  };
  const dispatch = useDispatch();

  const [messageClicked, setMessageClicked] = useState(false);
  const [startRecording, setStartRecording] = useState(false);

  // Theme context
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [isSendingText, setIsSendingText] = useState(false);

  const sendMessage = useCallback(
    async (txt, files) => {
      console.log(files);
      setSelectedImages([]);
      setDocumentVisible(false);
      setSelected([]);
      Keyboard.dismiss();
      setIsSendingText(true);
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
        console.log('res.data', JSON.stringify(res.data, null, 1));
        if (parentId) {
          setMessages(pre => [res.data.message, ...pre]);
        } else {
          setMessages(prev => ({
            ...prev,
            [chatId]: [res.data.message, ...(prev[chatId] || [])],
          }));
          dispatch(setLocalMessages([res.data.message, ...localMessages]));
        }
        // setLocalMessages(pre => [res.data.message, ...pre]);
        setSelectedImages([]);
      } catch (err) {
        setIsSendingText(false);

        if (__DEV__) {
          console.error('Error sending message:', err.response?.data);
        }
      } finally {
        setIsSendingText(false);
        setUploading(false);
      }
    },
    [
      text,
      user?._id,
      user?.firstName,
      user?.lastName,
      user.profilePicture,
      chatId,
      setMessages,
      dispatch,
      localMessages,
    ],
  );

  const toggleMessageClicked = useCallback(() => {
    setMessageClicked(prev => !prev);
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const UploadImages = async txt => {
    // closePopover();
    try {
      // if (selected?.length > 5) {
      //   showAlert({
      //     title: 'Limit Exceeded',
      //     type: 'warning',
      //     message: 'Maximum 5 files can be uploaded',
      //   });
      // }

      setIsUploading(true);

      let results = await Promise.all(
        selectedImages?.map(async item => {
          try {
            let formData = new FormData();
            formData.append('file', {
              uri: item.uri,
              name: item.name || 'uploaded_file',
              type: item.mimeType || 'application/octet-stream',
            });

            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            };

            let res = await axiosInstance.post('/chat/file', formData, config);
            let file = res.data.file;
            return file;
          } catch (error) {
            setIsUploading(false);
            console.log({error});
            Alert.alert('Failed', 'Upload Failed');
            // showAlert({
            //   title: 'Failed',
            //   type: 'error',
            //   message: 'Upload Failed',
            // });
            // throw error;
          }
        }),
      );
      let files = results?.map(file => ({
        name: file?.name || 'uploaded_file',
        size: file?.size,
        type: file?.type,
        url: file?.location,
      }));
      // setAllFiles(files);
      sendMessage(txt, files);
      setIsUploading(false);
    } catch (error) {
      console.log(error);
      // showAlert({
      //   title: 'Failed',
      //   type: 'error',
      //   message: 'Upload Failed',
      // });
    }
  };

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

  const handleDocumentSelection = async () => {
    setShowBottom(false);
    setDocumentVisible(true);
    console.log('Document Picker called');
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });
      setSelected(result);
      //   console.log('Selected File:', result);
      console.log('result[0]', JSON.stringify(result, null, 1));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
        setDocumentVisible(false);
        setSelected({});
      } else {
        console.error(err);
      }
    }
  };

  const UploadDocument = async txt => {
    // closePopover();
    setUploading(true);
    setDocumentVisible(false);
    try {
      //   if (selected?.length > 5) {
      //     showAlertModal({
      //       title: "Limit Exceeded",
      //       type: "warning",
      //       message: "Maximum 5 files can be uploaded",
      //     });
      //   }

      //   setIsUploading(true);

      let results = await Promise.all(
        selected?.map(async item => {
          try {
            let formData = new FormData();
            formData.append('file', {
              uri: item.uri,
              name: item.name || 'uploaded_file',
              type: item.mimeType || 'application/octet-stream',
            });

            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            };

            let res = await axiosInstance.post('/chat/file', formData, config);
            let file = res.data.file;
            return file;
          } catch (error) {
            // setIsUploading(false);
            console.log({error});
            // Alert.alert("Failed", "Upload Failed");
            // showAlertModal({
            //   title: "Failed",
            //   type: "error",
            //   message: "Upload Failed",
            // });
            throw error;
          }
        }),
      );
      let files = results?.map(file => ({
        name: file?.name || 'uploaded_file',
        size: file?.size,
        type: file?.type,
        url: file?.location,
      }));
      console.log('files', JSON.stringify(files, null, 1));
      sendMessage(txt, files);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  let handleKey = () => {
    let profileData = {
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
  const handleEditMessage = message => {
    if (!text) {
      return Alert.alert('Write something');
    }
    let data = {
      text: convertLink(text),
    };
    Keyboard.dismiss();
    setIsSendingText(true);
    axiosInstance
      .patch(`/chat/update/message/${message?._id}`, data)
      .then(res => {
        setText('');
        // setMessageToEdit(null);
        let newMessage = {...res.data.message, editedAt: new Date()};
        dispatch(updateMessage(newMessage));
        dispatch(
          updateLatestMessage({
            chatId: message?.chat,
            latestMessage: res.data.message,
            counter: 1,
          }),
        );
        setMessageEditVisible('');
        setIsSendingText(false);
      })
      .catch(err => {
        setIsSendingText(false);
      });
  };

  if (messageEditVisible) {
    return (
      <>
        <View style={styles.cancelContainer}>
          <Text style={styles.editingText}>Editing message: </Text>
          <TouchableOpacity onPress={() => setMessageEditVisible('')}>
            <Text style={styles.editingButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.editMessageContainer}>
          <ChatMessageInput
            handleKey={handleKey}
            chat={singleChat?._id}
            isChannel={singleChat?.isChannel}
            text={editedText}
            setText={setEditedText}
          />
          <SendContainer
            sendMessage={() => handleEditMessage(messageEditVisible)}
          />
        </View>
      </>
    );
  }

  if (documentVisible) {
    return (
      <DocumentContainer
        selected={selected}
        onClose={() => {
          setSelected([]);
          setDocumentVisible(false);
          setShowBottom(false);
        }}
        UploadDocument={UploadDocument}
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
        onSend={txt => {
          UploadImages(txt);
        }}
      />
    );
  }
  return (
    <View>
      {!startRecording && (
        <View style={styles.mainContainer}>
          <Pressable
            style={styles.toggleButton}
            // onPress={() => handleDocumentSelection()}
            onPress={toggleBottom}>
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
                  // text={text} setText={setText}
                />
                {text.length > 0 && (
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
        <View style={styles.bottomContainer}>
          {!startRecording && (
            <TouchableOpacity
              onPress={() => handleDocumentSelection()}
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

const getStyles = Colors =>
  StyleSheet.create({
    toggleButton: {
      width: 40,
      alignItems: 'center',
      // backgroundColor: 'red',
      height: 40,
      justifyContent: 'center',
    },
    buttonContainer: {
      padding: 20,
      backgroundColor: Colors.CyanOpacity,
      borderRadius: 100,
      height: 60,
      // marginTop: 20,
    },
    bottomContainer: {
      // backgroundColor: Colors.Red,
      // height: 100,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      justifyContent: 'flex-start',
      paddingHorizontal: 20,
    },
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'red',
      marginTop: 10,
      // paddingHorizontal: 20,
      // minHeight: 200,
    },
    editingButtonText: {
      color: Colors.Red,
      fontWeight: '600',
      // backgroundColor: 'red',
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
      marginRight: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      // flex: 1,
      overflow: 'hidden',
      // maxHeight: 100,
    },

    initialContainer: {
      // width: '90%',
      flex: 1,
      height: 49,
      justifyContent: 'center',
      // backgroundColor: 'red',
    },
  });
