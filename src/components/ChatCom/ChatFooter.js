import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {manipulateAsync, SaveFormat} from 'expo-image-manipulator';
import * as DocumentPicker from 'expo-document-picker';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import axios from '../../utility/axiosInstance';
import ChatMessageInput from './ChatMessageInput';
import MediaPicker from './MediaPicker';
import color from '../../constants/color';
import {socket} from '../../utility/socketManager';
import {
  pushMessage,
  updateLatestMessage,
  updateMessage,
  updateSendingInfo,
} from '../../store/reducer/chatReducer';

import CameraIcon from '../../assets/Icons/CameraIcon';
import MicIcon from '../../assets/Icons/MicIcon';
import SendIcon from '../../assets/Icons/SendIcon';
import {useTheme} from '../../context/ThemeContext';
import AudioBookIcon from '../../assets/Icons/AudioBookIcon';
import ArrowRightWithoutTail from '../../assets/Icons/ArrowRightWithoutTail';
import {removeHtmlTags, transFormDate} from './MessageHelper';
import CrossIcon from '../../assets/Icons/CrossIcon';
import ImageView from 'react-native-image-viewing';
import AttachmentIcon from '../../assets/Icons/AttachmentIcon';
import {Popover, usePopover} from 'react-native-modal-popover';
import {useNavigation} from '@react-navigation/native';
import Camera from '../SharedComponent/Camera';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import GallaryIcon from '../../assets/Icons/GallaryIcon';
import ExpandLeftIcon from '../../assets/Icons/ExpandLeft';
import FullScreenEditorModal from './Modal/FullScreenEditorModal';
import CaptureAudio from './CaptureAudio';

const convertLink = text => {
  var exp =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  var text1 = text.replace(exp, '<a target="_blank" href="$1">$1</a>');
  var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
};

const ChatFooter = ({
  scrollToBottom,
  chat,
  messageToEdit,
  setMessageToEdit,
  setMessagesPending,
  parentMessage,
  text,
  setText,
  stopAudio,
}) => {
  const Colors = useTheme();
  const {showAlert} = useGlobalAlert();
  const {user: profile} = useSelector(state => state.auth);
  const imagePickerRef = useRef();
  let dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState(null);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isSendingText, setIsSendingText] = useState(false);

  const [isRecorderVisible, setIsRecorderVisible] = useState(false);
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [allFiles, setAllFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState([]);

  const styles = getStyles(Colors, selectedImage, selectedAudio);
  const [messageFocused, setMessageFocused] = useState(false);
  const [viewImage, setViewImage] = useState([]);
  const [fullModalVisible, setFullModalVisible] = useState(false);
  const navigation = useNavigation();
  // const [galleryOpen, setGalleryOpen] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleUnfocus = () => {
    Keyboard.dismiss();
    setMessageFocused(false);
  };

  const dispatchLatest = latestMessage => {
    dispatch(updateLatestMessage({chatId: chat?._id, latestMessage}));
  };

  const clearFields = () => {
    setText('');
  };

  //   const UploadSingleFile = async selected => {
  //     // Display the camera to the user and wait for them to take a photo or to cancel
  //     // the action
  //     // console.log("selected", JSON.stringify(selected, null, 1));
  //     console.log('selected', JSON.stringify(selected, null, 1));
  //     try {
  //       setIsUploading(true);
  //       let results = await Promise.all(
  //         selected?.map(async item => {
  //           try {
  //             const manipResult = await manipulateAsync(
  //               item,
  //               [{resize: {width: 500}}],
  //               {compress: 0.8, format: SaveFormat.JPEG},
  //             );

  //             let formData = new FormData();
  //             formData.append('file', {
  //               uri: manipResult.uri,
  //               name: 'image.jpg',
  //               type: 'image/jpeg',
  //             });
  //             // Add headers for Axios request
  //             const config = {
  //               headers: {
  //                 'Content-Type': 'multipart/form-data',
  //               },
  //             };
  //             let res = await axios.post('/chat/file', formData, config);
  //             let file = res.data.file;
  //             // console.log("file.....", JSON.stringify(file, null, 1));
  //             return file;
  //           } catch (error) {
  //             setIsUploading(false);
  //             console.log({error});
  //             showAlert({
  //               title: 'Failed',
  //               type: 'error',
  //               message: 'Upload Failed',
  //             });
  //             // return error
  //           }
  //         }),
  //       );

  //       let files = results?.map(file => ({
  //         name: file?.originalname || 'image.jpeg',
  //         size: file?.size,
  //         type: file?.type,
  //         url: file?.location,
  //       }));
  //       sendMessage(files);
  //       // se([files]);
  //       setIsUploading(false);
  //     } catch (error) {
  //       console.log(error);
  //       showAlert({
  //         title: 'Failed',
  //         type: 'error',
  //         message: 'Upload Failed',
  //       });
  //     }
  //   };
  //   const UploadFile = async selected => {
  //     // Display the camera to the user and wait for them to take a photo or to cancel
  //     // the action
  //     console.log('selected', JSON.stringify(selected, null, 1));
  //     try {
  //       if (selected?.length > 5) {
  //         return showAlert({
  //           title: 'Limit Exceeded',
  //           type: ' warning',
  //           message: 'Maximum 5 images can be uploaded',
  //         });
  //       }

  //       imagePickerRef.current?.closeSheet();

  //       setIsUploading(true);
  //       let results = await Promise.all(
  //         selected?.map(async item => {
  //           try {
  //             const manipResult = await manipulateAsync(
  //               item,
  //               [{resize: {width: 500}}],
  //               {compress: 0.8, format: SaveFormat.JPEG},
  //             );

  //             let formData = new FormData();
  //             formData.append('file', {
  //               uri: manipResult.uri,
  //               name: 'image.jpg',
  //               type: 'image/jpeg',
  //             });
  //             // Add headers for Axios request
  //             const config = {
  //               headers: {
  //                 'Content-Type': 'multipart/form-data',
  //               },
  //             };
  //             let res = await axios.post('/chat/file', formData, config);
  //             let file = res.data.file;
  //             // console.log("file.....", JSON.stringify(file, null, 1));
  //             return file;
  //           } catch (error) {
  //             setIsUploading(false);
  //             console.log({error});
  //             showAlert({
  //               title: 'Failed',
  //               type: 'error',
  //               message: 'Upload Failed',
  //             });
  //             // return error
  //           }
  //         }),
  //       );

  //       let files = results?.map(file => ({
  //         name: file?.originalname || 'image.jpeg',
  //         size: file?.size,
  //         type: file?.type,
  //         url: file?.location,
  //       }));
  //       // sendMessage(files);
  //       setAllFiles(prev => [...prev, ...files]);
  //       setIsUploading(false);
  //     } catch (error) {
  //       console.log(error);
  //       showAlert({
  //         title: 'Failed',
  //         type: 'error',
  //         message: 'Upload Failed',
  //       });
  //     }
  //   };

  let handleKey = () => {
    let user = profile;

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
        chatId: chat?._id,
        typingData: {isTyping: true, user: profileData},
      });
    }

    clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        setTyping(false);
        socket.emit('typing', {
          chatId: chat?._id,
          typingData: {isTyping: false, user: profileData},
        });
      }, 2000),
    );
  };

  const handleEditMesage = message => {
    if (!text && !files) {
      return showAlert({
        title: 'Write something',
        type: 'warning',
        message: 'Please write something in the input field before proceeding',
      });
    }

    let data = {
      text: convertLink(text),
    };
    Keyboard.dismiss();
    setIsSendingText(true);
    axios
      .patch(`/chat/update/message/${message?._id}`, data)
      .then(res => {
        setText('');
        setMessageToEdit(null);

        let message = {...res.data.message, editedAt: new Date()};

        dispatch(
          updateMessage({
            chat: chat?._id,
            message,
          }),
        );
        dispatch(
          updateLatestMessage({
            chatId: chat?._id,
            latestMessage: res.data.message,
            counter: 1,
          }),
        );

        setIsSendingText(false);
      })
      .catch(err => {
        setIsSendingText(false);
        showAlert({
          title: 'Error',
          type: 'error',
          message: 'Something went wrong',
        });
      });
  };

  const changeSelection = (uri, index) => {
    if (!selected?.includes(uri)) {
      if (selected?.length < 5) {
        setSelected(prev => [...prev, uri]);
        setSelectedImage(prev => [...prev, uri]);
      } else {
        showAlert({
          title: 'Limit Exceeded',
          type: 'warning',
          message: 'Maximum 5 images can be uploaded',
        });
      }
    } else {
      setSelected(prev => prev?.filter(x => x !== uri));
      setSelectedImage(prev => prev?.filter(x => x !== uri));
      setAllFiles(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  //   const sendAudioMessage = async RecordedURI => {
  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri: RecordedURI,
  //       name: 'recording.mp3',
  //       type: 'audio/mp3',
  //     });
  //     setIsSendingAudio(true);
  //     try {
  //       const config = {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       };
  //       let response = await axios.post('/chat/file', formData, config);
  //       let fileData = response?.data?.file;

  //       let files = [
  //         {
  //           name: fileData?.name,
  //           type: fileData?.type,
  //           size: fileData?.size,
  //           url: fileData?.location,
  //         },
  //       ];
  //       // sendMessage(files);
  //       setAllFiles(prev => [...prev, ...files]);
  //       setIsSendingAudio(false);
  //       setIsRecorderVisible(false);
  //     } catch (error) {
  //       showAlert({
  //         title: 'Error',
  //         type: 'error',
  //         message: err?.response?.data?.error,
  //       });
  //       setIsSendingAudio(false);
  //     }
  //   };

  useEffect(() => {
    if (messageToEdit) {
      setText(transFormDate(removeHtmlTags(messageToEdit?.text)));
      console.log('messageToEdit', JSON.stringify(messageToEdit, null, 1));
    }
  }, [messageToEdit]);

  const sendMessage = files => {
    if (
      !text.trim() &&
      (!allFiles || allFiles.length === 0) &&
      (!files || files.length === 0)
    ) {
      return showAlert({
        title: 'Write something',
        type: 'warning',
        message: 'Please write something before proceeding',
      });
    }

    Keyboard.dismiss();
    setIsSendingText(true);
    let data = {
      text: convertLink(text),
      files: files ? files : allFiles || [],
    };
    if (parentMessage) {
      data['parentMessage'] = parentMessage;
    }

    let randomId = Math.floor(Math.random() * (999999 - 1111) + 1111);
    let user = profile;
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
        chat: chat?._id,
        type: 'message',
      },
    };

    dispatch(pushMessage(messageData));

    setText('');
    setMessageFocused(false);
    scrollToBottom();
    axios
      .put(`/chat/sendmessage/${chat?._id}`, data)
      .then(res => {
        //setMessages(prev => [...prev, res.data.message])
        dispatch(
          updateSendingInfo({
            message: res.data.message,
            trackingId: randomId,
          }),
        );
        clearFields();
        setAllFiles([]);
        setSelectedAudio([]);
        setSelectedImage([]);
        setSelected([]);
        //scrollToBottom()
        setIsSendingText(false);
      })
      .catch(err => {
        setIsSendingText(false);
        showAlert({
          title: 'Error',
          type: 'error',
          message: err?.response?.data?.error,
        });
        setMessagesPending([]);
        console.log(err);
      });
  };

  const renderItem = ({item, index}) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => setViewImage([{uri: item}])}>
        <Image style={styles.image} source={{uri: item}} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.crossButtonContainer}
        onPress={() => changeSelection(item, index)}>
        <CrossIcon size={8} color={Colors.White} />
      </TouchableOpacity>
      <ImageView
        images={viewImage}
        imageIndex={0}
        visible={viewImage?.length !== 0}
        onRequestClose={() => setViewImage([])}
      />
    </View>
  );

  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  //   async function pickDocument() {
  //     try {
  //       const document = await DocumentPicker.getDocumentAsync({
  //         type: [
  //           'image/*',
  //           'application/pdf',
  //           'application/msword',
  //           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //         ],
  //         multiple: true,
  //         copyToCacheDirectory: true,
  //       });
  //       if (!document.canceled) {
  //         setState(document.assets);

  //         UploadAnyFile(document.assets);
  //       } else {
  //         return console.log('Failed to pick doc or cancel'); // Document picking was canceled or failed
  //       }
  //     } catch (error) {
  //       console.error('Error picking document:', error);
  //       return null;
  //     }
  //   }

  //   const UploadAnyFile = async selected => {
  //     closePopover();
  //     try {
  //       if (selected?.length > 5) {
  //         showAlert({
  //           title: 'Limit Exceeded',
  //           type: 'warning',
  //           message: 'Maximum 5 files can be uploaded',
  //         });
  //       }

  //       setIsUploading(true);

  //       let results = await Promise.all(
  //         selected?.map(async item => {
  //           try {
  //             let formData = new FormData();
  //             formData.append('file', {
  //               uri: item.uri,
  //               name: item.name || 'uploaded_file',
  //               type: item.mimeType || 'application/octet-stream',
  //             });

  //             const config = {
  //               headers: {
  //                 'Content-Type': 'multipart/form-data',
  //               },
  //             };

  //             let res = await axios.post('/chat/file', formData, config);
  //             let file = res.data.file;
  //             return file;
  //           } catch (error) {
  //             setIsUploading(false);
  //             console.log({error});
  //             // Alert.alert("Failed", "Upload Failed");
  //             showAlert({
  //               title: 'Failed',
  //               type: 'error',
  //               message: 'Upload Failed',
  //             });
  //             throw error;
  //           }
  //         }),
  //       );
  //       let files = results?.map(file => ({
  //         name: file?.name || 'uploaded_file',
  //         size: file?.size,
  //         type: file?.type,
  //         url: file?.location,
  //       }));
  //       setAllFiles(files);
  //       sendMessage(files);
  //       setIsUploading(false);
  //     } catch (error) {
  //       console.log(error);
  //       showAlert({
  //         title: 'Failed',
  //         type: 'error',
  //         message: 'Upload Failed',
  //       });
  //     }
  //   };

  //   const handleSendCapturedPhoto = clicked => {
  //     UploadSingleFile(clicked);
  //   };

  console.log(text.length);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
      style={{backgroundColor: Colors.Primary}}>
      <View
        style={[
          styles.footerWrapper,
          {
            marginTop:
              selectedImage?.length > 0 || selectedAudio?.length > 0
                ? responsiveScreenHeight(7)
                : 0,
          },
        ]}>
        {selectedImage?.length > 0 || selectedAudio?.length > 0 ? (
          <View
            style={{
              width: responsiveScreenWidth(100),
              position: 'absolute',
              top: responsiveScreenHeight(-7),
              flexDirection: 'row',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View style={{flexDirection: 'row', paddingLeft: 5}}>
                <FlatList
                  data={selectedImage}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.ImageList}
                />
                {selectedAudio?.length > 0 && (
                  <View
                    style={{
                      marginTop: responsiveScreenHeight(1),
                      // backgroundColor: "red",
                    }}>
                    <AudioBookIcon />
                    {/* <Text>{selectedAudio?.length}</Text> */}
                    <TouchableOpacity
                      style={[styles.crossButtonContainer, {top: -3, right: 0}]}
                      //   onPress={() => {
                      //     setIsRecorderVisible(false);
                      //     setSelectedAudio([]);
                      //   }}
                    >
                      <CrossIcon size={8} color={Colors.White} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '10%',
                  }}
                  disabled={isSendingText}
                  //   onPress={() =>
                  //     messageToEdit
                  //       ? handleEditMesage(messageToEdit)
                  //       : sendMessage()
                  //   }
                  activeOpacity={0.5}>
                  <SendIcon />
                </TouchableOpacity>
              }
            </View>
          </View>
        ) : null}
        {isRecorderVisible ? (
          //   <CaptureAudio
          //     stopAudio={stopAudio}
          //     setSelectedAudio={setSelectedAudio}
          //     sendRenderedAudio={audio => sendAudioMessage(audio)}
          //     setIsRecorderVisible={setIsRecorderVisible}
          //     isSendingAudio={isSendingAudio}
          //   />
          <></>
        ) : (
          <>
            {messageFocused ? (
              <TouchableOpacity
                onPress={handleUnfocus}
                style={{paddingRight: 10, backgroundColor: Colors.White}}>
                <ArrowRightWithoutTail />
              </TouchableOpacity>
            ) : (
              <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity
                  // onPress={() => selectDoc()}
                  onPress={() => {
                    setIsCameraOpen(!isCameraOpen);
                  }}
                  activeOpacity={0.5}>
                  <CameraIcon />
                  {/* <PlusIcon /> */}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.5}>
                  <GallaryIcon />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  disabled={isUploading}
                  onPress={() => pickDocument()}>
                  {isUploading ? (
                    <ActivityIndicator
                      style={{marginRight: 10}}
                      color="000"
                      size={24}
                    />
                  ) : (
                    <AttachmentIcon />
                  )}
                </TouchableOpacity> */}
                {/* <Popover
                    contentStyle={[styles.popupContent]}
                    arrowStyle={styles.popupArrow}
                    backgroundStyle={{ backgroundColor: Colors.BackDropColor }}
                    visible={popoverVisible}
                    onClose={closePopover}
                    fromRect={popoverAnchorRect}
                    supportedOrientations={["portrait", "landscape"]}
                    placement="top"
                    fromTouchable={null}
                  >
                    <AttachmentItem
                      pickDocument={pickDocument}
                      closePopover={closePopover}
                      galleryOpenFunction={imagePickerRef.current?.openSheet}
                      handleSendCapturedPhoto={handleSendCapturedPhoto}
                    />
                  </Popover> */}
                <TouchableOpacity
                  onPress={() => setIsRecorderVisible(true)}
                  activeOpacity={0.5}>
                  <MicIcon />
                </TouchableOpacity>
              </View>
            )}

            {messageFocused ? (
              <View style={styles.textInputContainer}>
                <View style={styles.textInput}>
                  <ChatMessageInput
                    chat={chat?._id}
                    isChannel={chat?.isChannel}
                    text={text}
                    setText={setText}
                    handleKey={handleKey}
                  />
                </View>
                <View
                  style={{
                    flex: 0.1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: "red",
                    // minHeight: text.length > 30 ? 50 : 30,
                  }}>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      // backgroundColor: Colors.CyanOpacity,
                      borderRadius: 100,
                    }}
                    // disabled={isSendingText}
                    onPress={() => setFullModalVisible(true)}
                    activeOpacity={0}>
                    <ExpandLeftIcon />
                  </TouchableOpacity>

                  {text && (
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '10%',
                      }}
                      disabled={isSendingText}
                      onPress={() =>
                        messageToEdit
                          ? handleEditMesage(messageToEdit)
                          : sendMessage()
                      }
                      activeOpacity={0.5}>
                      <SendIcon />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setMessageFocused(true);
                }}
                style={styles.viewTextInput}>
                <View style={{flexDirection: 'row', padding: 3}}>
                  <Text style={{color: Colors.BodyText, width: '92%'}}>
                    {text ? text : 'Message...'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
        {fullModalVisible && (
          <FullScreenEditorModal
            isVisible={fullModalVisible}
            setIsVisible={setFullModalVisible}
            text={text}
            setText={setText}
            sendMessage={sendMessage}
          />
        )}
        {isCameraOpen && (
          <Camera
            isVisible={isCameraOpen}
            toggleCamera={setIsCameraOpen}
            handleSendCapturedPhoto={handleSendCapturedPhoto}
          />
        )}
        <MediaPicker
          setSelectedImage={setSelectedImage}
          UploadFile={UploadFile}
          selected={selected}
          setSelected={setSelected}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatFooter;

const getStyles = Colors =>
  StyleSheet.create({
    popupContent: {
      // padding: 16,
      backgroundColor: 'transparent',
      borderRadius: 8,
      bottom: responsiveScreenHeight(20),
      // width: responsiveScreenWidth(50),
    },
    popupArrow: {
      // display: "none",
      marginTop: responsiveScreenHeight(-10),
      borderTopColor: Colors.Background_color,
      marginLeft: responsiveScreenWidth(2),
      zIndex: -1,
    },

    crossButtonContainer: {
      position: 'absolute',
      top: responsiveScreenHeight(0.5),
      right: responsiveScreenWidth(-1),
      backgroundColor: Colors.Heading,
      padding: 2,
      borderRadius: 100,
    },
    ImageList: {
      flexGrow: 1,
      alignItems: 'center',
    },
    itemContainer: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      // backgroundColor: "rgba(1, 1, 1, 0.15)",
      marginHorizontal: responsiveScreenWidth(1),
      position: 'relative',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 5,
      marginVertical: responsiveScreenHeight(1),
    },
    footerWrapper: {
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: Colors.White,
      padding: 10,
      position: 'relative',
    },

    textInputContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.Background_color,
      borderRadius: 20,
      width: '90%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
    },
    textInput: {
      paddingVertical: 10,
      color: Colors.Heading,
      flex: 0.9,
      flexDirection: 'column',
      marginHorizontal: 5,
      position: 'relative',
      minHeight: 60,
      justifyContent: 'center',
      // backgroundColor: "yellow",
      marginTop: -8,
    },
    viewTextInput: {
      padding: 12,
      color: Colors.BodyText,
      width: '72%',
      display: 'flex',
      flexDirection: 'column',
      marginHorizontal: 5,
      position: 'relative',
      backgroundColor: Colors.Background_color,
      borderRadius: 20,
    },
    messageItem: {
      flexDirection: 'row',
      marginVertical: 7,
    },
    userImageWrapper: {
      marginRight: 10,
      alignSelf: 'flex-start',
    },
    userImg: {
      height: 45,
      width: 45,
      borderRadius: 5,
    },
    modalWrapper: {
      backgroundColor: '#f0f0f0',
    },
    listItem: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    contentContainer: {
      backgroundColor: color.primary,
      color: Colors.White,
      paddingVertical: 10,
    },
  });
