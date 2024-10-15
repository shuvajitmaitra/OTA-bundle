// import React, {useState, memo} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   Pressable,
// } from 'react-native';

// import Feather from 'react-native-vector-icons/Feather';

// import moment from 'moment';
// import AntIcons from 'react-native-vector-icons/AntDesign';
// import mime from 'mime';
// import ImageView from 'react-native-image-viewing';
// import * as Linking from 'expo-linking';
// import {
//   responsiveScreenFontSize,
//   responsiveScreenHeight,
//   responsiveScreenWidth,
// } from 'react-native-responsive-dimensions';
// import {useSelector} from 'react-redux';
// import Markdown from 'react-native-markdown-display';
// import Modal from 'react-native-modal';

// import userIcon from '../../assets/Images/user.png';
// import CustomeFonts from '../../constants/CustomeFonts';
// import LoadingSmall from '../SharedComponent/LoadingSmall';
// import ForwardMember from './Modal/ForwardMessageModal';
// import ThreeDotGrayIcon from '../../assets/Icons/ThreeDotGrayIcon';
// import NewPinIcon from '../../assets/Icons/NewPinIcon';
// import {useTheme} from '../../context/ThemeContext';
// import {bytesToSize, removeHtmlTags} from './MessageHelper';
// import {VideoPlaybackProvider} from '../../context/VideoPlaybackContext';
// import CustomVideoPlayer from './CustomVideoPlayer';
// import axios from '../../utility/axiosInstance';
// import Images from '../../constants/Images';
// import {showToast} from '../HelperFunction';
// import AudioMessage from './AudioMessage';

// const images = [
//   'image/bmp',
//   'image/cis-cod',
//   'image/gif',
//   'image/jpeg',
//   'image/jpg',
//   'image/pipeg',
//   'image/x-xbitmap',
//   'image/png',
// ];

// export function transFormDate(text) {
//   // Define regex pattern to match {{DATE:...}}
//   let regexPattern = /\{\{DATE:(.*?)\}\}/g;
//   const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   // Replace all occurrences of the pattern with formatted time and timezone
//   return text?.replace(regexPattern, (match, startTime) => {
//     // Format startTime using moment.js
//     return `${moment(startTime).format(
//       'MMMM Do YYYY, h:mm A z',
//     )} (${userTimezone})`;
//   });
// }

// const PinMessage = ({message, handleLongPress, chat, handleUpdateMessage}) => {
//   const [isModalVisible, setIsModalVisible] = React.useState(false);
//   const {onlineUsers} = useSelector(state => state.chat);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const {user: profile} = useSelector(state => state.auth);
//   const myMessage = message.sender?._id === profile?._id;

//   const handlePin = (id, isPinned) => {
//     axios
//       .patch(`/chat/pin/${id}`, {unpin: isPinned})
//       .then(res => {
//         if (res.data.message) {
//           handleUpdateMessage(res.data.message);

//           if (res.data.message.pinnedBy === null) {
//             showToast('Unpinned successfully...', Colors.Primary);
//           } else {
//             showToast('Pinned successfully...');
//           }
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };

//   const [readMoreClicked, setReadMoreClicked] = useState(false);

//   const [isForwardMemberModalVisible, setForwardMembersModalVisible] =
//     useState(false);
//   const toggleForwardMemberModal = () => {
//     setForwardMembersModalVisible(!isForwardMemberModalVisible);
//   };

//   const downloadFile = file => {
//     if (images.includes(file.type)) {
//       setSelectedImages([{uri: file.url}]);
//     } else {
//       Linking.openURL(file.url);
//     }
//   };
//   function autoLinkify(text) {
//     // Regular expression to match plain text URLs
//     const urlRegex =
//       /\b((?:https?|ftp):\/\/[^\s\]]+|(?<!:\/\/)[^\s\]]+\.[^\s\]]+)\b/gi;

//     // Replace plain text URLs with Markdown links
//     return text.replace(urlRegex, match => {
//       // Check if the match is already within Markdown link syntax
//       if (text.includes(`[${match}](${match})`)) {
//         return match; // Return the match unchanged
//       } else {
//         return `[${match}](${match})`; // Convert the match into a Markdown link
//       }
//     });
//   }
//   const messageText =
//     message?.text?.length > 500
//       ? message?.text?.slice(0, 500) + '...'
//       : message?.text;
//   const Colors = useTheme();
//   const styles = getStyles(Colors);

//   const [currentPlayingUrl, setCurrentPlayingUrl] = useState(null);

//   const handlePlayToggle = url => {
//     setCurrentPlayingUrl(currentPlayingUrl === url ? null : url);
//   };

//   return (
//     <>
//       <View style={styles.messageItem}>
//         {myMessage ? null : (
//           <View style={styles.userImageWrapper}>
//             <Image
//               source={
//                 message.sender?.profilePicture
//                   ? {uri: message.sender?.profilePicture}
//                   : userIcon
//               }
//               style={styles.userImg}
//             />
//             {onlineUsers?.find(x => x?._id === message?.sender?._id) ? (
//               <View style={styles.activeStatus}></View>
//             ) : null}
//           </View>
//         )}
//         <View
//           style={{
//             flex: 1,
//             // backgroundColor: "red"
//           }}>
//           {!myMessage && (
//             <Text
//               style={{
//                 alignSelf: 'flex-start',
//                 color: Colors.Heading,
//                 paddingVertical: 1,
//                 fontWeight: '500',
//               }}>
//               {message?.sender?.fullName}
//             </Text>
//           )}

//           <Pressable
//             onLongPress={() => {
//               setIsModalVisible(!isModalVisible);
//             }}
//             activeOpacity={0.5}
//             style={{
//               ...styles.messageContainer,
//               ...{
//                 backgroundColor: myMessage ? Colors.MediumGreen : Colors.White,
//                 alignSelf: myMessage ? 'flex-end' : 'flex-start',
//                 width: myMessage ? '85%' : '100%',
//                 position: 'relative',
//                 marginBottom: responsiveScreenHeight(1),
//                 zIndex: -10,
//               },
//             }}>
//             <Pressable
//               onPress={() => {
//                 setIsModalVisible(!isModalVisible);
//               }}
//               style={{
//                 // backgroundColor: "red",
//                 padding: 5,
//                 paddingLeft: 15,
//                 position: 'absolute',
//                 top: responsiveScreenHeight(0.5),
//                 right: responsiveScreenWidth(1),
//                 // zIndex: 10,
//               }}>
//               <ThreeDotGrayIcon />
//             </Pressable>
//             {message?.text ? (
//               <Markdown
//                 style={{
//                   whiteSpace: 'pre',
//                   body: {
//                     color: myMessage ? Colors.Heading : Colors.Heading,
//                     paddingRight: responsiveScreenWidth(2),
//                   },
//                   code_inline: {
//                     paddingRight: responsiveScreenWidth(2),
//                     color: myMessage ? Colors.BodyText : Colors.Gray3,
//                   },
//                   hr: {
//                     paddingRight: responsiveScreenWidth(2),
//                     backgroundColor: myMessage ? Colors.White : Colors.Gray3,
//                   },
//                   fence: {
//                     paddingRight: responsiveScreenWidth(2),
//                     color: Colors.Gray3,
//                   },
//                   code_block: {
//                     paddingRight: responsiveScreenWidth(2),
//                     color: Colors.Gray3,
//                   },
//                   blockquote: {
//                     paddingRight: responsiveScreenWidth(2),
//                     color: Colors.Gray3,
//                   },
//                   table: {
//                     paddingRight: responsiveScreenWidth(2),
//                     borderColor: myMessage
//                       ? Colors.BodyText
//                       : Colors.BorderColor,
//                   },
//                   thead: {
//                     borderColor: myMessage
//                       ? Colors.BodyText
//                       : Colors.BorderColor,
//                   },
//                   tbody: {
//                     borderColor: myMessage
//                       ? Colors.BodyText
//                       : Colors.BorderColor,
//                   },
//                   th: {
//                     borderColor: myMessage
//                       ? Colors.BodyText
//                       : Colors.BorderColor,
//                   },
//                   tr: {
//                     borderColor: myMessage
//                       ? Colors.BodyText
//                       : Colors.BorderColor,
//                   },
//                   td: {
//                     borderColor: myMessage
//                       ? Colors.BodyText
//                       : Colors.BorderColor,
//                   },
//                   link: {
//                     paddingRight: responsiveScreenWidth(2),
//                     // backgroundColor: myMessage
//                     //   ? Colors.White
//                     //   : Colors.LightGreen,
//                     color: myMessage ? Colors.Primary : Colors.Primary,
//                     fontWeight: 'bold',
//                   },
//                 }}>
//                 {autoLinkify(
//                   transFormDate(
//                     removeHtmlTags(
//                       readMoreClicked
//                         ? message?.text.trim()
//                         : messageText.trim(),
//                     ),
//                   ),
//                 )}
//               </Markdown>
//             ) : null}

//             {message?.files?.length > 0 && (
//               <View
//                 style={{
//                   alignSelf: 'flex-start',
//                   overflow: 'hidden',
//                   // backgroundColor: "blue",
//                   paddingRight: responsiveScreenWidth(2),
//                   gap: 10,
//                   zIndex: -1,
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}>
//                 {message?.files.map((file, index) => (
//                   <View
//                     style={{
//                       alignSelf: 'flex-end',
//                       marginBottom: responsiveScreenHeight(1),
//                     }}
//                     key={index}>
//                     {file?.file?.type?.startsWith('audio/') ||
//                       (file?.type?.startsWith('audio/') &&
//                         message?.files?.length === 1 && (
//                           <View style={{position: 'relative'}}>
//                             <Image
//                               style={styles.senderPic}
//                               source={
//                                 message?.sender?.profilePicture
//                                   ? {
//                                       uri: message?.sender?.profilePicture,
//                                     }
//                                   : Images.DEFAULT_IMAGE
//                               }
//                             />
//                             <View style={styles.micIcon}>
//                               <Feather
//                                 name="mic"
//                                 size={12}
//                                 color={Colors.BodyText}
//                               />
//                             </View>
//                           </View>
//                         ))}
//                   </View>
//                 ))}
//                 {message?.files?.map((file, i) => (
//                   <View
//                     style={{
//                       width: '95%',
//                       paddingTop: responsiveScreenHeight(1.5),
//                       // backgroundColor: "red",
//                     }}
//                     key={i}>
//                     {file?.file?.type === 'audio/mp3' ||
//                     file?.type?.startsWith('audio/') ? (
//                       <AudioMessage
//                         isActive={currentPlayingUrl === file?.url}
//                         onTogglePlay={() => handlePlayToggle(file?.url)}
//                         audioUrl={file?.url}
//                       />
//                     ) : file?.type?.startsWith('video/') ? (
//                       <View style={{borderRadius: 10, overflow: 'hidden'}}>
//                         <View
//                           style={{
//                             marginRight: -30,
//                           }}>
//                           <VideoPlaybackProvider>
//                             <CustomVideoPlayer
//                               url={file?.url}
//                               id={message?._id}
//                               fullScreenRight={responsiveScreenWidth(8)}
//                             />
//                           </VideoPlaybackProvider>
//                         </View>
//                       </View>
//                     ) : (
//                       <TouchableOpacity
//                         // disallowInterruption={true}
//                         onPress={() => downloadFile(file)}
//                         activeOpacity={0.5}
//                         style={{
//                           flexDirection: 'row',
//                           // backgroundColor: Colors.White,
//                           borderRadius: 8,
//                           maxWidth: '100%',
//                           height: 'auto',
//                           overflow: 'hidden',
//                         }}>
//                         {images.includes(file.type) ? (
//                           <View
//                             style={{
//                               // maxHeight: responsiveScreenHeight(40),
//                               // maxWidth: responsiveScreenWidth(100),
//                               overflow: 'hidden',
//                             }}>
//                             <Image
//                               width={
//                                 myMessage
//                                   ? responsiveScreenWidth(80)
//                                   : responsiveScreenWidth(70)
//                               }
//                               source={{uri: file.url}}
//                             />
//                           </View>
//                         ) : (
//                           <View
//                             style={{
//                               padding: 8,
//                               flexDirection: 'row',
//                               gap: 10,
//                             }}>
//                             <View>
//                               {file.type === 'application/pdf' ? (
//                                 <Image
//                                   style={{height: 50, width: 50}}
//                                   source={require('../../assets/Images/pdf.png')}
//                                 />
//                               ) : file.type === 'text/plain' ? (
//                                 <Image
//                                   style={{height: 50, width: 50}}
//                                   source={require('../../assets/Images/txt-file.png')}
//                                 />
//                               ) : file.type === 'application/msword' ||
//                                 file.type ===
//                                   'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
//                                 <Image
//                                   style={{height: 50, width: 50}}
//                                   source={require('../../assets/Images/txt-file.png')}
//                                 />
//                               ) : file.type === 'application/vnd.ms-excel' ||
//                                 file.type ===
//                                   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
//                                 <Image
//                                   style={{height: 50, width: 50}}
//                                   source={require('../../assets/Images/sheets.png')}
//                                 />
//                               ) : file.type === 'application/zip' ||
//                                 file.type === 'application/x-zip-compressed' ? (
//                                 <Image
//                                   style={{height: 50, width: 50}}
//                                   source={require('../../assets/Images/zip.png')}
//                                 />
//                               ) : (
//                                 <Image
//                                   style={{height: 50, width: 50}}
//                                   source={require('../../assets/Images/file.png')}
//                                 />
//                               )}
//                             </View>
//                             <View>
//                               <View style={{flexDirection: 'row'}}>
//                                 <Text
//                                   numberOfLines={1}
//                                   style={{
//                                     fontWeight: 'bold',
//                                     flex: 1,
//                                     flexBasis: '50%',
//                                     color: Colors.Heading,
//                                   }}>
//                                   {file?.name || 'N/A'}
//                                 </Text>
//                                 <AntIcons
//                                   style={{
//                                     marginLeft: 5,
//                                     color: Colors.BodyText,
//                                   }}
//                                   size={16}
//                                   name="download"
//                                 />
//                               </View>
//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                 }}>
//                                 <Text
//                                   style={{color: Colors.BodyText}}
//                                   className="mime">
//                                   {mime.getExtension(file.type) || 'File'}
//                                 </Text>
//                                 <Text style={{color: Colors.BodyText}}>
//                                   ({bytesToSize(file.size || 0)})
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>
//                         )}
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 ))}
//               </View>
//             )}

//             {!message?.updatedAt ? (
//               <Text style={{textAlign: 'right'}}>
//                 <LoadingSmall />
//               </Text>
//             ) : (
//               <View
//                 style={{
//                   // backgroundColor: "green",
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   flexDirection: 'row',
//                   paddingVertical: 5,
//                 }}>
//                 {message?.text?.length > 500 && (
//                   <TouchableOpacity
//                     onPress={() => {
//                       setReadMoreClicked(prev => !prev);
//                     }}>
//                     <Text
//                       style={{
//                         color: Colors.Primary,
//                         fontSize: responsiveScreenFontSize(1.65),
//                         fontWeight: '600',
//                       }}>
//                       {readMoreClicked ? 'Read less' : 'Read more'}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//                 <View style={{flexGrow: 1}}></View>
//                 <Text
//                   style={{
//                     ...styles.messageTime,
//                     ...{
//                       color: Colors.BodyText,
//                     },
//                   }}>
//                   {/* {moment(message?.createdAt).format("MMM DD, YYYY h:mm A")} */}
//                   {moment(message?.createAt).format('LLL')}
//                 </Text>
//               </View>
//             )}
//           </Pressable>

//           <Modal
//             backdropColor={Colors.BackDropColor}
//             isVisible={isModalVisible}
//             onBackdropPress={() => setIsModalVisible(!isModalVisible)}>
//             <View style={[styles.popupContent, styles.background]}>
//               <Pressable
//                 activeOpacity={0.5}
//                 onPress={() => {
//                   handlePin(message._id, message.pinnedBy);
//                   setIsModalVisible(!isModalVisible);
//                 }}
//                 style={{
//                   flexDirection: 'row',
//                   gap: 5,
//                   alignItems: 'center',
//                   paddingHorizontal: 7,
//                 }}>
//                 <NewPinIcon />
//                 <Text style={styles.popupText}>
//                   {message.pinnedBy ? 'Unpin' : 'Pin'}
//                 </Text>
//               </Pressable>
//             </View>
//           </Modal>
//         </View>
//       </View>

//       <ImageView
//         images={selectedImages}
//         imageIndex={0}
//         visible={selectedImages?.length !== 0}
//         onRequestClose={() => setSelectedImages([])}
//       />
//       <ForwardMember
//         isForwardMemberModalVisible={isForwardMemberModalVisible}
//         toggleForwardMemberModal={toggleForwardMemberModal}
//         chat={chat}
//       />
//     </>
//   );
// };

// export default React.memo(PinMessage);

// const getStyles = Colors =>
//   StyleSheet.create({
//     micIcon: {
//       position: 'absolute',
//       bottom: 0,
//       right: 0,
//       padding: 2,
//       backgroundColor: Colors.BorderColor,
//       borderRadius: 100,
//     },
//     senderPic: {
//       width: responsiveScreenWidth(8),
//       height: responsiveScreenWidth(8),
//       backgroundColor: Colors.Background_color,
//       borderRadius: 100,
//     },
//     container: {
//       flex: 1,
//       backgroundColor: Colors.White,
//     },
//     messageItem: {
//       flexDirection: 'row',
//     },
//     messageContainer: {
//       maxWidth: '90%',
//       borderRadius: 8,
//       borderBottomLeftRadius: 25,
//       paddingHorizontal: responsiveScreenWidth(4),
//       // paddingV: responsiveScreenHeight(1.2),
//       marginBottom: 1,
//     },
//     messageTime: {
//       // alignSelf: "flex-end",
//       paddingLeft: responsiveScreenWidth(5),
//       fontSize: 12,
//       // backgroundColor: "red",
//     },
//     userImageWrapper: {
//       marginRight: 10,
//       alignSelf: 'flex-start',
//     },
//     userImg: {
//       height: 35,
//       width: 35,
//       borderRadius: 45,
//       backgroundColor: Colors.Background_color,
//       borderWidth: 1,
//       borderColor: Colors.BorderColor,
//     },
//     activeStatus: {
//       width: 8,
//       height: 8,
//       borderRadius: 8,
//       backgroundColor: Colors.Primary,
//       position: 'absolute',
//       right: responsiveScreenWidth(0),
//       bottom: responsiveScreenHeight(0.5),
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
//     replyWrapper: {
//       borderLeftWidth: 2,
//       borderLeftColor: Colors.BorderColor,
//       paddingLeft: 10,
//     },
//     deleted: {
//       fontStyle: 'italic',
//       color: '#bcc0c4',
//     },
//     popupContent: {
//       backgroundColor: Colors.White,
//       borderRadius: 8,
//       width: responsiveScreenWidth(60),
//       paddingVertical: 16,
//       position: 'absolute',
//       right: responsiveScreenWidth(16),
//       // top: responsiveScreenHeight(45),
//     },
//     popupArrow: {
//       borderTopColor: Colors.White,
//     },
//     popupText: {
//       color: Colors.BodyText,
//       fontFamily: CustomeFonts.REGULAR,
//       fontSize: responsiveScreenFontSize(1.7),
//       marginBottom: 2,
//     },
//     line: {
//       width: '100%',
//       height: 1,
//       backgroundColor: Colors.LineColor,
//       position: 'relative',
//       marginVertical: responsiveScreenWidth(2),
//     },
//   });
