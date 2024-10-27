// import {
//   StyleSheet,
//   Text,
//   View,
//   KeyboardAvoidingView,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   StatusBar,
// } from 'react-native';
// import React, {useState, useRef, useEffect, useCallback} from 'react';
// import {Provider, Snackbar} from 'react-native-paper';
// import {AntDesign} from '@expo/vector-icons';
// import moment from 'moment';
// import {Divider} from 'react-native-paper';
// import {useDispatch, useSelector} from 'react-redux';
// import * as Clipboard from 'expo-clipboard';
// import Modal from 'react-native-modal';
// import CloseIcon from '../../assets/Icons/CloseIcon';
// import TrashIcon from '../../assets/Icons/TrashIcon';
// import {
//   responsiveScreenWidth,
//   responsiveScreenFontSize,
//   responsiveScreenHeight,
// } from 'react-native-responsive-dimensions';

// import color from '../../constants/color';
// import axios from '../../utility/axiosInstance';
// import ChatFooter from '../../components/ChatCom/ChatFooter';

// import {updateMessage} from '../../store/reducer/chatReducer';
// import ThreadMessageItem from '../../components/ChatCom/ThreadMessageItem';
// import ThreadMessageReplyItem from '../../components/ChatCom/ThreadMessageReplyItem';
// import CustomeFonts from '../../constants/CustomeFonts';
// import Loading from '../../components/SharedComponent/Loading';
// import LoadingSmall from '../../components/SharedComponent/LoadingSmall';
// import {useTheme} from '../../context/ThemeContext';
// import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {setThreadOpen} from '../../store/reducer/ModalReducer';

// export default ThreadScreen = ({route}) => {
//   // --------------------------
//   // ----------- Import theme Colors -----------
//   // --------------------------
//   const Colors = useTheme();
//   const styles = getStyles(Colors);
//   const {chatMessages} = useSelector(state => state.chat);
//   const [chat, setChat] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [text, setText] = useState('');

//   const [muteData, setMuteData] = useState(null);
//   let dispatch = useDispatch();
//   const scrollViewRef = useRef();

//   const [selecetedMessage, setSelectedMessage] = useState(null);
//   const [isSnakbarVisible, setIsSnakbarVisible] = useState(false);

//   const [messageToEdit, setMessageToEdit] = useState(null);
//   const [messageToDelete, setMessageToDelete] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const [replies, setReplies] = useState([]);
//   const [count, setCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);

//   let chatId = route?.chat?._id;
//   let messageId = route?.message?._id;

//   useEffect(() => {
//     if (chatMessages[chatId]) {
//       let findMessage = chatMessages[chatId]?.find(x => x?._id === messageId);

//       setReplies(findMessage?.replies || []);
//     }
//   }, [chatMessages, route]);

//   useEffect(() => {
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

//   // ref
//   const bottomSheetModalRef = useRef(null);

//   const handlePresentModalClose = useCallback(() => {
//     bottomSheetModalRef.current?.close();
//     setSelectedMessage(null);
//   }, []);
//   const copyToClipboard = async message => {
//     setIsSnakbarVisible(true);
//     await Clipboard.setStringAsync(
//       message?.text.replace(/<[^>]*>?/gm, '').trim(),
//     );
//   };

//   useEffect(() => {
//     if (route?.fromNoti) {
//       axios
//         .get(`/chat/message/${route?.messageId}`)
//         .then(res => {
//           setChat(res.data.chat);
//           setMessage(res.data.message);
//         })
//         .catch(err => {
//           Alert.alert(err?.response?.data?.error);
//           console.log(err);
//         });
//     } else if (route?.chat && route?.message) {
//       setChat(route?.chat);
//       setMessage(route?.message);
//     }
//   }, [route]);

//   const handleUpdateMessage = message => {
//     dispatch(updateMessage({chat: chat?._id, message}));

//     setMessage(prev => ({...prev, ...message}));
//   };

//   const handleDelete = threadMessage => {
//     setIsDeleting(true);
//     axios
//       .delete(`/chat/delete/message/${threadMessage?._id}`)
//       .then(res => {
//         handleUpdateMessage(res.data.message);
//         setIsDeleting(false);
//         setMessageToDelete(null);
//         setSelectedMessage(null);
//       })
//       .catch(err => {
//         setIsDeleting(false);
//         console.log(err);
//         Alert.error({message: err?.response?.data?.error});
//       });
//   };

//   const handleSetEdit = message => {
//     setMessageToEdit(message);
//     setText(message?.content?.replace(/<[^>]*>?/gm, '').trim());
//     handlePresentModalClose();
//     //inputRef.current.focus()
//   };

//   const handleSetDelete = message => {
//     setMessageToDelete(message);
//     handlePresentModalClose();
//   };
//   const {top, bottom} = useSafeAreaInsets();
//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: Colors.White,
//         paddingTop: top / 1.5,
//         // paddingBottom: bottom ,
//       }}>
//       <StatusBar
//         translucent={true}
//         backgroundColor={Colors.White}
//         barStyle={
//           Colors.Background_color === '#F5F5F5'
//             ? 'dark-content'
//             : 'light-content'
//         }
//       />
//       <Provider>
//         <Snackbar
//           visible={isSnakbarVisible}
//           onDismiss={() => setIsSnakbarVisible(false)}
//           duration={1000}
//           style={{zIndex: 1}}>
//           Message Copied to clipboard
//         </Snackbar>
//         <TouchableOpacity
//           onPress={() => {
//             dispatch(setThreadOpen(false));
//           }}
//           style={styles.theadHeaderContainer}>
//           <AntDesign
//             name="arrowleft"
//             style={{marginLeft: 10}}
//             size={24}
//             color={Colors.BodyText}
//           />
//           <Text
//             style={{
//               marginLeft: 10,
//               fontFamily: CustomeFonts.MEDIUM,
//               fontSize: responsiveScreenFontSize(2),
//               color: Colors.BodyText,
//             }}>
//             Back
//           </Text>
//         </TouchableOpacity>
//         <ScrollView
//           style={[{}, styles.container]}
//           ref={scrollViewRef}
//           onContentSizeChange={() =>
//             scrollViewRef.current.scrollToEnd({animated: true})
//           }>
//           {message && <ThreadMessageItem message={message} />}
//           <View style={styles.replayCountContainer}>
//             <Text style={styles.replayCountText}>
//               {isLoading ? (
//                 <LoadingSmall color={Colors.Primary} />
//               ) : replies?.length ? (
//                 replies?.length
//               ) : (
//                 0
//               )}{' '}
//               {replies?.length > 1 ? 'Replies' : 'Reply'}
//               {/* {replies.length || 0} */}
//             </Text>
//             {/* <CommentsIcon color={Colors.Primary} size={20} /> */}
//           </View>
//           <Divider />

//           {isLoading ? (
//             <Loading backgroundColor={Colors.Background_color} />
//           ) : replies?.length > 0 ? (
//             replies.map((message, i) => (
//               <ThreadMessageReplyItem
//                 key={i}
//                 message={message}
//                 copyToClipboard={copyToClipboard}
//                 handleSetEdit={handleSetEdit}
//                 handleSetDelete={handleSetDelete}
//                 chat={chat}
//               />
//             ))
//           ) : (
//             <NoDataAvailable />
//           )}
//         </ScrollView>

//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           //style={styles.container}
//           keyboardVerticalOffset={88}>
//           <View style={styles.footer}>
//             {muteData && muteData?.isMuted ? (
//               <View>
//                 {muteData?.isMuted && (
//                   <Text
//                     style={{
//                       color: 'red',
//                       textAlign: 'center',
//                       fontSize: 18,
//                       marginVertical: 20,
//                       fontWeight: 'bold',
//                     }}>
//                     You have been muted from this channel
//                     {muteData?.date && (
//                       <>
//                         {' '}
//                         - untill (
//                         {moment(muteData?.date).format('D MMM, YYYY HH:MM a')})
//                       </>
//                     )}
//                   </Text>
//                 )}
//               </View>
//             ) : (
//               chat &&
//               !chat?.readOnly && (
//                 <>
//                   {messageToEdit && (
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'center',
//                         paddingTop: responsiveScreenHeight(1),
//                         backgroundColor: Colors.White,
//                       }}>
//                       <Text
//                         style={{
//                           color: Colors.BodyText,
//                           fontWeight: '500',
//                           textAlign: 'center',
//                           marginBottom: 3,
//                         }}>
//                         Editing message:
//                       </Text>
//                       <TouchableOpacity
//                         onPress={() => {
//                           setMessageToEdit(null);
//                           setText('');
//                         }}
//                         style={{marginLeft: 10}}
//                         activeOpacity={0.5}>
//                         <Text style={{color: 'red', fontWeight: 'bold'}}>
//                           Cancel
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   )}

//                   <ChatFooter
//                     text={text}
//                     setText={setText}
//                     chat={chat}
//                     parentMessage={messageId}
//                     messageToEdit={messageToEdit}
//                     setMessageToEdit={setMessageToEdit}
//                     scrollToBottom={() => null}
//                     setMessagesPending={() => null}
//                   />
//                 </>
//               )
//             )}
//           </View>
//         </KeyboardAvoidingView>

//         <Modal
//           backdropColor={Colors.BackDropColor}
//           style={styles.modal}
//           isVisible={Boolean(messageToDelete)}>
//           <View style={styles.modalStyle}>
//             <TouchableOpacity
//               style={styles.crossIconStyle}
//               onPress={() => setMessageToDelete(false)}>
//               <CloseIcon />
//             </TouchableOpacity>
//             <View style={styles.textContainer}>
//               <Text style={styles.modalText}>
//                 Do you want to remove this message?
//               </Text>
//             </View>
//             <TouchableOpacity
//               onPress={() => handleDelete(messageToDelete)}
//               activeOpacity={0.5}
//               style={styles.modalBottom}>
//               <Text style={styles.btnText}>Remove for everyone</Text>
//               <TrashIcon />
//             </TouchableOpacity>
//           </View>
//         </Modal>
//       </Provider>
//     </View>
//   );
// };

// const getStyles = Colors =>
//   StyleSheet.create({
//     theadHeaderContainer: {
//       height: 50,
//       backgroundColor: Colors.White,
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'flex-start',
//       borderBottomWidth: 1,
//       borderBottomColor: Colors.BorderColor,
//     },
//     replayCountContainer: {
//       flexDirection: 'row',
//       paddingHorizontal: responsiveScreenWidth(3),
//       gap: responsiveScreenWidth(1),
//       paddingVertical: responsiveScreenHeight(1),
//     },
//     container: {
//       backgroundColor: Colors.Background_color,
//       flex: 1,
//     },
//     footer: {
//       width: '100%',
//       flexDirection: 'column',
//       backgroundColor: Colors.Background_color,
//     },
//     footerWrapper: {
//       width: '100%',
//       alignItems: 'center',
//       flexDirection: 'row',
//     },
//     textInput: {
//       backgroundColor: Colors.White,
//       padding: 10,
//       color: Colors.Heading,
//       borderRadius: 10,
//       width: '85%',
//       display: 'flex',
//       flexDirection: 'column',
//       marginHorizontal: 5,
//       position: 'relative',
//     },
//     messageItem: {
//       flexDirection: 'row',
//       marginVertical: 7,
//     },
//     userImageWrapper: {
//       marginRight: 10,
//       alignSelf: 'flex-start',
//     },
//     userImg: {
//       height: 45,
//       width: 45,
//       borderRadius: 5,
//     },
//     modalWrapper: {
//       backgroundColor: '#f0f0f0',
//     },
//     listItem: {
//       paddingVertical: 5,
//       paddingHorizontal: 10,
//       borderBottomColor: Colors.BorderColor,
//       borderBottomWidth: 1,
//     },
//     shadow: {
//       shadowColor: '#000',
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.25,
//       shadowRadius: 3.84,

//       elevation: 5,
//     },
//     contentContainer: {
//       backgroundColor: color.primary,
//       color: Colors.White,
//       paddingVertical: 10,
//     },

//     replayCountText: {
//       color: Colors.Primary,
//       fontFamily: CustomeFonts.SEMI_BOLD,
//       fontSize: responsiveScreenFontSize(2),
//     },

//     modalStyle: {
//       borderWidth: 1,
//       borderRadius: 10,
//       borderColor: Colors.BorderColor,
//       backgroundColor: Colors.White,
//       width: responsiveScreenWidth(90),
//       height: responsiveScreenHeight(19),
//       paddingHorizontal: responsiveScreenWidth(2),
//       marginBottom: responsiveScreenHeight(8),
//     },

//     crossIconStyle: {
//       width: '100%',
//       alignItems: 'flex-end',
//       marginTop: responsiveScreenHeight(1),
//     },
//     textContainer: {
//       width: '100%',
//     },

//     modalText: {
//       fontSize: responsiveScreenFontSize(2),
//       textAlign: 'center',
//       fontFamily: CustomeFonts.SEMI_BOLD,
//       paddingHorizontal: responsiveScreenWidth(4),
//       color: Colors.BodyText,
//     },
//     modalBottom: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       width: responsiveScreenWidth(80),
//       height: responsiveScreenHeight(5),
//       marginTop: responsiveScreenHeight(2),
//       alignSelf: 'center',
//       borderRadius: 8,
//       alignItems: 'center',
//       paddingHorizontal: responsiveScreenWidth(4),
//       backgroundColor: Colors.LightRed,
//     },

//     btnText: {
//       color: Colors.ThemeWarningColor,
//       fontFamily: CustomeFonts.REGULAR,
//       fontSize: responsiveScreenFontSize(1.7),
//     },
//   });
