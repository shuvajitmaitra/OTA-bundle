import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Enables strict mode
});

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomSheetVisible} from '../../store/reducer/ModalReducer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import LoadingSmall from './LoadingSmall';
import {RegularFonts} from '../../constants/Fonts';
import {getComments} from '../../actions/chat-noti';
import {formatDynamicDate, showAlertModal} from '../../utility/commonFunction';
import axiosInstance from '../../utility/axiosInstance';
import Comment from '../CommunityCom/Comment';
import Divider from './Divider';
import SendIcon from '../../assets/Icons/SendIcon';
import {BackHandler} from 'react-native';

const GlobalCommentModal = () => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const bottomSheetRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const {user} = useSelector(state => state.auth);
  const textInputRef = useRef(null);
  const {comments, commentId} = useSelector(state => state.comment);
  const {bottomSheetVisible} = useSelector(state => state.modal);
  const [isCommenting, setCommenting] = useState(false);
  const snapPoints = useMemo(() => ['100%'], []);
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateComment = () => {
    if (!commentText.trim()) {
      return showAlertModal({
        title: 'Empty Comment',
        type: 'warning',
        message: 'Comment cannot be empty.',
      });
    }

    setCommenting(true);
    axiosInstance
      .post(`/content/comment/create`, {
        comment: commentText,
        contentId: commentId,
      })
      .then(res => {
        if (res.data.success) {
          getComments(commentId);
        }
      })
      .catch(error => {
        console.log('error to create comment', JSON.stringify(error, null, 1));
      })
      .finally(() => {
        setCommentText('');
        setCommenting(false);
      });
  };
  const handleSheetChanges = useCallback(index => {
    console.log(index);
    if (index === -1) {
      dispatch(setBottomSheetVisible(false));
      textInputRef.current?.blur();
    } else if (index === 0) {
      textInputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (bottomSheetVisible) {
        bottomSheetRef.current?.expand();
      } else {
        bottomSheetRef.current?.close();
      }
    }
  }, [bottomSheetVisible]);

  useEffect(() => {
    const backAction = () => {
      if (bottomSheetVisible) {
        dispatch(setBottomSheetVisible(false)); // Close the modal
        return true; // Prevent the default back action
      }
      return false; // Allow the default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the listener on unmount
  }, [bottomSheetVisible]);

  const filteredComments = useMemo(
    () => comments.filter(comment => comment.contentId === commentId),
    [comments, commentId],
  );

  return (
    // <Text>Hello</Text>
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      style={styles.bottomSheet}
      backgroundStyle={styles.bottomSheetBackground}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.comments}>Comments</Text>
        <View>
          {filteredComments && filteredComments.length > 0 ? (
            filteredComments?.map((comment, index) => {
              const isSameDate =
                new Date(filteredComments[index]?.createdAt).toDateString() ===
                new Date(filteredComments[index - 1]?.createdAt).toDateString();

              return (
                <React.Fragment key={comment._id}>
                  {(index == 0 || !isSameDate) && (
                    <View style={styles.commentDateContainer}>
                      <Text style={styles.commentDate}>
                        {/* {moment(comments[index].createdAt).format("MMM DD, YYYY")} */}
                        {formatDynamicDate(filteredComments[index].createdAt)}
                      </Text>
                    </View>
                  )}
                  <Comment comment={comment} />
                </React.Fragment>
              );
            })
          ) : (
            // <Text style={styles.noDataText}>No comments available</Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: "green",
                minHeight: '80%',
              }}>
              <FontAwesome name="comments" size={111} color={Colors.BodyText} />
              <Text
                style={{
                  color: Colors.BodyText,
                  fontSize: responsiveScreenFontSize(2.5),
                  fontFamily: CustomFonts.SEMI_BOLD,
                  marginTop: responsiveScreenHeight(2.5),
                }}>
                No comments yet
              </Text>
              <Text
                style={{
                  color: Colors.BodyText,
                  fontSize: responsiveScreenFontSize(1.6),
                  fontFamily: CustomFonts.SEMI_BOLD,
                }}>
                Be the first to comment
              </Text>
            </View>
          )}
        </View>
      </BottomSheetScrollView>

      <Divider marginBottom={1} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={textInputRef}
            keyboardAppearance={
              Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
            }
            style={styles.inputText}
            value={commentText}
            onChangeText={e => setCommentText(e)}
            placeholder={
              user?.fullName ? `Comment as ${user?.fullName}` : 'Comment...'
            }
            placeholderTextColor={Colors.BodyText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                paddingBottom:
                  Platform.OS == 'ios'
                    ? responsiveScreenHeight(0.5)
                    : responsiveScreenHeight(0.5),
              },
            ]}
            onPress={() => {
              isCommenting ? null : handleCreateComment();
            }}>
            {isCommenting ? (
              <View style={{paddingBottom: responsiveScreenHeight(1)}}>
                <LoadingSmall color={Colors.Primary} />
              </View>
            ) : (
              <SendIcon size={30} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export default GlobalCommentModal;

const getStyles = Colors =>
  StyleSheet.create({
    commentDateContainer: {
      paddingVertical: 3,
      paddingHorizontal: 5,
      backgroundColor: Colors.PrimaryOpacityColor,
      width: responsiveScreenWidth(30),
      borderRadius: 5,
      marginTop: 10,
      alignSelf: 'center',
    },
    commentDate: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.BL,
      textAlign: 'center',
      color: Colors.Primary,
    },
    noDataText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      textAlign: 'center',
      marginVertical: responsiveScreenHeight(2),
    },
    inputText: {
      flex: 1,
      paddingHorizontal: 10,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      backgroundColor: Colors.BorderColor,
      paddingVertical: responsiveScreenHeight(1),
      maxHeight: 400,
      borderRadius: 30,
    },
    container: {
      flex: 1,
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      padding: 36,
      alignItems: 'center',
    },
    submitBtn: {
      //   paddingTop: 10,
      alignSelf: 'flex-end',
    },
    comments: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(1.5),
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 36, // Avoid overlap with handle
      paddingHorizontal: 16,
    },
    bottomSheet: {
      overflow: 'hidden',
      zIndex: 99,
    },
    bottomSheetBackground: {
      backgroundColor: Colors.Background_color,
    },
    handle: {
      backgroundColor: Colors.Background_color,
      height: 40,
      borderRadius: 0,
    },
    handleIndicator: {
      backgroundColor: Colors.White,
      width: 40,
      height: 4,
      borderRadius: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.BorderColor,
      marginHorizontal: responsiveScreenWidth(4),
      // marginVertical: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
      paddingRight: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 30,
      paddingLeft: 10,
    },
  });
