import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import Images from '../../constants/Images';
import {TextInput} from 'react-native';
import {Image} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomSheetVisible} from '../../store/reducer/ModalReducer';
import {setCommentId} from '../../store/reducer/commentReducer';
import {getComments} from '../../actions/chat-noti';

const CommentField = ({postId}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const openCommentModal = () => {
    dispatch(setBottomSheetVisible(true));
    dispatch(setCommentId(postId));
    getComments(postId);
  };

  return (
    <View>
      <Text style={styles.comments}>Comments</Text>
      <View style={styles.writeComment}>
        <Image
          source={
            user.profilePicture
              ? {
                  uri: `${user.profilePicture}`,
                }
              : Images.DEFAULT_IMAGE
          }
          style={styles.profileImg}
        />
        <TextInput
          onPress={openCommentModal}
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
          }
          style={styles.inputText}
          placeholder={
            user?.fullName ? `Comment as ${user?.fullName}` : 'Comment...'
          }
          placeholderTextColor={Colors.BodyText}
        />
      </View>
    </View>
  );
};

export default CommentField;

const getStyles = Colors =>
  StyleSheet.create({
    writeComment: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      marginTop: responsiveScreenHeight(2),
      //   backgroundColor: "green",
    },
    profileImg: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      objectFit: 'cover',
      borderRadius: 50,
    },
    comments: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
    },
    inputText: {
      flex: 1,
      paddingHorizontal: 10,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      backgroundColor: Colors.BorderColor,
      minHeight: responsiveScreenHeight(6),
      borderRadius: 12,
      paddingVertical: responsiveScreenHeight(1),
    },
  });
