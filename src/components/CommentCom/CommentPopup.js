import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteComment,
  setSelectedComment,
  updateComment,
} from '../../store/reducer/commentReducer';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import {handleError} from '../../actions/chat-noti';

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
        }
      })
      .catch(error => {
        handleError(error);
      });
  };

  return (
    <>
      {selectedComment && (
        <ReactNativeModal
          onBackdropPress={() => dispatch(setSelectedComment(null))}
          isVisible={Boolean(selectedComment)}>
          <View style={styles.popupContainer}>
            {!selectedComment.parentId && (
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    updateComment({
                      commentId: selectedComment._id,
                      data: {isReplyOpen: true},
                    }),
                  );
                  dispatch(setSelectedComment(null));
                }}
                style={styles.actionButton}>
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
                  dispatch(setSelectedComment(null));
                }}
                style={styles.actionButton}>
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
                <Text style={styles.actionText}>Delete comment</Text>
              </TouchableOpacity>
            )}
          </View>
        </ReactNativeModal>
      )}
    </>
  );
};

export default CommentPopup;

const getStyles = Colors =>
  StyleSheet.create({
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
      backgroundColor: Colors.Gray,
      borderRadius: 5,
      // alignItems: 'center',
    },
    actionText: {
      color: Colors.White,
      fontSize: RegularFonts.HR,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
  });
