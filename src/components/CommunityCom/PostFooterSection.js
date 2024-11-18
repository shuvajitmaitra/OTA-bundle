import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {onShare} from '../../utility/commonFunction';
import ShareIcon from '../../assets/Icons/ShareIcon';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useTheme} from '../../context/ThemeContext';
import LikeIcon from '../../assets/Icons/LikeIcon';
import CommentsIcon from '../../assets/Icons/CommentsIcon';
import Divider from '../SharedComponent/Divider';
import ReactionContainer from './ReactionContainer';
import {usePopover} from 'react-native-modal-popover';

import {getComments, giveReaction} from '../../actions/chat-noti';
import {useDispatch, useSelector} from 'react-redux';
import ForwardIcon from '../../assets/Icons/ForwardIcon';
import {useNavigation} from '@react-navigation/native';
import {
  setBottomSheetVisible,
  setCommentModalIndex,
} from '../../store/reducer/ModalReducer';
import {setCommentId} from '../../store/reducer/commentReducer';

const PostFooterSection = ({post, toggleCommentSection, showComments}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  const customArray = Object.entries(post.reactions).map(([key, value]) => ({
    key,
    value,
  }));
  const {bottomSheetVisible} = useSelector(state => state.modal);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const openComment = () => {
    dispatch(setBottomSheetVisible(!bottomSheetVisible));
    dispatch(setCommentId(post?._id));
    getComments(post?._id);
  };

  return (
    <>
      <View style={styles.firstContainer}>
        <View style={styles.reactContainer}>
          {customArray.length > +0 &&
            customArray.map((item, index) => (
              <View key={index} style={styles.likesContainer}>
                <Text style={styles.text}>{item.value || 0}</Text>
                <Text style={{fontSize: responsiveScreenFontSize(2)}}>
                  {item.key}
                </Text>
              </View>
            ))}
          {/* (
            <View style={styles.likesContainer}>
              <Text style={styles.text}>0</Text>
              <LikeIcon />
            </View>
          ) */}
        </View>

        {post?.commentsCount > 0 && (
          <TouchableOpacity
            // onPress={() => toggleCommentSection()}
            onPress={openComment}
            style={styles.commentsContainer}>
            <Text style={styles.text}>
              {post.commentsCount}{' '}
              {post.commentsCount == 1 ? 'comment' : 'comments'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Divider marginBottom={0.5} marginTop={0.5} />
      <View style={styles.postFooterContainer}>
        <TouchableOpacity
          ref={touchableRef}
          // onPress={() => giveReaction(post?._id, { symbol: post.myReaction || "👍" })}
          // onLongPress={openPopover}
          onPress={openPopover}
          style={styles.shareButtonContainer}>
          {post.myReaction ? (
            <View
              style={[
                styles.likesContainer,
                {
                  backgroundColor: Colors.PrimaryOpacityColor,
                  width: responsiveScreenWidth(12),
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: responsiveScreenHeight(-1),
                },
              ]}>
              <Text
                style={[styles.text, {fontSize: responsiveScreenFontSize(2)}]}>
                {post.myReaction}
              </Text>
            </View>
          ) : (
            <>
              <MaterialIcons
                name={'add-reaction'}
                size={18}
                color={Colors.BodyText}
              />
              <Text
                style={[
                  styles.text,
                  {
                    color: Colors.BodyText,
                  },
                ]}>
                React
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => toggleCommentSection()}
          onPress={openComment}
          style={styles.shareButtonContainer}>
          <CommentsIcon color={showComments && Colors.Primary} size={18} />
          <Text style={[styles.text, showComments && {color: Colors.Primary}]}>
            Comment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            onShare(
              `https://portal.bootcampshub.ai/dashboard/community/post/${post._id}`,
            )
          }
          style={styles.shareButtonContainer}>
          <ForwardIcon />
          <Text style={styles.text}>Share</Text>
        </TouchableOpacity>
      </View>
      <ReactionContainer
        closePopover={closePopover}
        popoverVisible={popoverVisible}
        popoverAnchorRect={popoverAnchorRect}
        postId={post?._id}
        myReaction={post.myReaction}
      />
    </>
  );
};

export default PostFooterSection;

const getStyles = Colors =>
  StyleSheet.create({
    firstContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
      flexWrap: 'wrap',
      // backgroundColor: "red",
      justifyContent: 'space-between',
    },
    likesContainer: {
      // backgroundColor: "red",
      borderRadius: responsiveScreenFontSize(100),
      paddingHorizontal: responsiveScreenWidth(2),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
      paddingVertical: responsiveScreenHeight(0.3),
    },
    reactContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      flexWrap: 'wrap',
      // backgroundColor: "red"
    },
    commentsContainer: {
      // backgroundColor: "red",
      paddingHorizontal: responsiveScreenWidth(2),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
    },
    footerTop: {
      //   backgroundColor: "red",
      //   backgroundColor: Colors.Background_color,
      //   borderWidth: 1,
      //   borderColor: Colors.BorderColor,
      //   borderRadius: responsiveScreenFontSize(1),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      flexWrap: 'wrap',
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.BodyText,
      alignItems: 'center',
      flexDirection: 'row',
      // gap: responsiveScreenWidth(2),
    },
    postFooterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
    },
    shareButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
  });
