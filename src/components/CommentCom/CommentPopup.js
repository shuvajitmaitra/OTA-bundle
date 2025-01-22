import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteComment,
  setSelectedComment,
  setSingleComment,
  updateComment,
} from '../../store/reducer/commentReducer';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import {handleError} from '../../actions/chat-noti';
import {setCommentCount} from '../../store/reducer/communityReducer';
import Popover, {Rect} from 'react-native-popover-view';
import CommentsIcon from '../../assets/Icons/CommentsIcon';
import EditIconTwo from '../../assets/Icons/EditIcon2';
import DeleteIcon from '../../assets/Icons/DeleteIcon';

const CommentPopup = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {selectedComment} = useSelector(state => state.comment);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const handleDeleteComment = async () => {
    await axiosInstance
      .delete(`/content/comment/delete/${selectedComment._id}`)
      .then(res => {
        if (res.data.success) {
          dispatch(deleteComment(selectedComment));
          dispatch(
            setCommentCount({
              contentId: selectedComment?.contentId,
              replyCount: selectedComment?.repliesCount,
            }),
          );
        }
      })
      .catch(error => {
        handleError(error);
      });
  };

  return (
    <>
      {selectedComment && (
        <Popover
          onBackdropPress={() => dispatch(setSelectedComment(null))}
          isVisible={Boolean(selectedComment)}
          // placement={'right'}
          popoverStyle={styles.popoverStyle}
          from={new Rect(selectedComment.x, selectedComment.y, 0, 0)}
          onRequestClose={() => dispatch(setSelectedComment(null))}>
          <View style={styles.popupContainer}>
            {!selectedComment.parentId && (
              <TouchableOpacity
                onPress={() => {
                  // dispatch(
                  //   updateComment({
                  //     commentId: selectedComment._id,
                  //     data: {isReplyOpen: true},
                  //   }),
                  // );
                  dispatch(
                    setSingleComment({...selectedComment, replyOpen: true}),
                  );

                  dispatch(setSelectedComment(null));
                }}
                style={styles.actionButton}>
                <CommentsIcon />
                <Text style={styles.actionText}>Reply comment</Text>
              </TouchableOpacity>
            )}
            {user._id === selectedComment.user._id && (
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    updateComment({
                      commentId: selectedComment._id,
                      data: {isUpdateOpen: true, ...selectedComment},
                    }),
                  );
                  dispatch(
                    setSingleComment({...selectedComment, updateOpen: true}),
                  );
                  dispatch(setSelectedComment(null));
                }}
                style={styles.actionButton}>
                <EditIconTwo />
                <Text style={styles.actionText}>
                  {!selectedComment.parentId ? 'Edit comment' : 'Edit reply'}
                </Text>
              </TouchableOpacity>
            )}

            {user._id === selectedComment.user._id && (
              <TouchableOpacity
                onPress={async () => {
                  await handleDeleteComment();
                  dispatch(setSelectedComment(null));
                }}
                style={styles.actionButton}>
                <DeleteIcon />
                <Text style={styles.actionText}>Delete comment</Text>
              </TouchableOpacity>
            )}
          </View>
        </Popover>
      )}
    </>
  );
};

export default CommentPopup;

const getStyles = Colors =>
  StyleSheet.create({
    popoverStyle: {
      backgroundColor: Colors.White,
    },
    popupContainer: {
      backgroundColor: Colors.White,
      maxHeight: 220,
      alignSelf: 'center',
      padding: 10,
      borderRadius: 7,
      gap: 10,
    },
    actionButton: {
      padding: 10,
      backgroundColor: Colors.Background_color,
      borderRadius: 5,
      // alignItems: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    actionText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
      fontFamily: CustomFonts.MEDIUM,
    },
  });
