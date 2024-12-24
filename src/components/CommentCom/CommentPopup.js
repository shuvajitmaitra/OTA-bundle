import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  setSelectedComment,
  updateComment,
} from '../../store/reducer/commentReducer';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import CustomFonts from '../../constants/CustomFonts';

const CommentPopup = () => {
  const dispatch = useDispatch();
  const {selectedComment} = useSelector(state => state.comment);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <>
      {selectedComment && (
        <ReactNativeModal
          onBackdropPress={() => dispatch(setSelectedComment(null))}
          isVisible={Boolean(selectedComment)}>
          <View style={styles.popupContainer}>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  updateComment({
                    commentId: selectedComment._id,
                    data: {isUpdateOpen: true},
                  }),
                );
                dispatch(setSelectedComment(null));
              }}
              style={{
                padding: 5,
                backgroundColor: Colors.Gray,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: Colors.White,
                  fontSize: RegularFonts.HS,
                  fontFamily: CustomFonts.SEMI_BOLD,
                }}>
                Update comment
              </Text>
            </TouchableOpacity>
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
              style={{
                padding: 5,
                backgroundColor: Colors.Gray,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: Colors.White,
                  fontSize: RegularFonts.HS,
                  fontFamily: CustomFonts.SEMI_BOLD,
                }}>
                Reply comment
              </Text>
            </TouchableOpacity>
            <View
              style={{
                padding: 5,
                backgroundColor: Colors.Gray,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: Colors.White,
                  fontSize: RegularFonts.HS,
                  fontFamily: CustomFonts.SEMI_BOLD,
                }}>
                Delete comment
              </Text>
            </View>
            <View
              style={{
                padding: 5,
                backgroundColor: Colors.Gray,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: Colors.White,
                  fontSize: RegularFonts.HS,
                  fontFamily: CustomFonts.SEMI_BOLD,
                }}>
                Update comment
              </Text>
            </View>
          </View>
        </ReactNativeModal>
      )}{' '}
    </>
  );
};

export default CommentPopup;

const getStyles = Colors =>
  StyleSheet.create({
    popupContainer: {
      backgroundColor: Colors.White,
      maxHeight: 200,
      alignSelf: 'center',
      padding: 10,
      borderRadius: 7,
      gap: 10,
    },
  });
