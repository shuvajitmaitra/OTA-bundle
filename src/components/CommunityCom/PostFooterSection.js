import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {onShare} from '../../utility/commonFunction';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import CommentsIcon from '../../assets/Icons/CommentsIcon';
import Divider from '../SharedComponent/Divider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getComments} from '../../actions/chat-noti';
import {useDispatch, useSelector} from 'react-redux';
import ForwardIcon from '../../assets/Icons/ForwardIcon';
import {setBottomSheetVisible} from '../../store/reducer/ModalReducer';
import {setCommentId} from '../../store/reducer/commentReducer';
import ReactionContainer from './ReactionContainer';

const PostFooterSection = ({post, toggleCommentSection, showComments}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverRect, setPopoverRect] = useState(null);
  const buttonRef = useRef(null);
  const [touchPosition, setTouchPosition] = useState({x: 0, y: 0});
  const customArray = Object.entries(post.reactions).map(([key, value]) => ({
    key,
    value,
  }));
  const {bottomSheetVisible} = useSelector(state => state.modal);
  const dispatch = useDispatch();
  const openComment = () => {
    dispatch(setBottomSheetVisible(!bottomSheetVisible));
    dispatch(setCommentId(post?._id));
    getComments(post?._id);
  };
  const handlePressIn = event => {
    const {pageX, pageY} = event.nativeEvent;
    setTouchPosition({x: pageX, y: pageY});
  };
  const showPopoverWithPosition = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setPopoverRect({
          x: pageX,
          y: pageY,
          width: width,
          height: height,
        });
      });
    }
    setShowPopover(true);
  };

  return (
    <>
      <View style={styles.firstContainer}>
        <View style={styles.reactContainer}>
          {customArray.length > 0 &&
            customArray.map((item, index) => (
              <View key={index} style={styles.likesContainer}>
                <Text style={styles.text}>{item.value || 0}</Text>
                <Text style={{fontSize: responsiveScreenFontSize(2)}}>
                  {item.key}
                </Text>
              </View>
            ))}
        </View>

        {post?.commentsCount > 0 && (
          <TouchableOpacity
            onPress={openComment}
            style={styles.commentsContainer}>
            <Text style={styles.text}>
              {post.commentsCount}{' '}
              {post.commentsCount === 1 ? 'comment' : 'comments'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Divider marginBottom={0.5} marginTop={0.5} />
      <View style={styles.postFooterContainer}>
        <TouchableOpacity
          ref={buttonRef}
          onPressIn={handlePressIn}
          onPress={showPopoverWithPosition}
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

      {popoverRect && (
        <ReactionContainer
          touchPosition={touchPosition}
          popoverRect={popoverRect}
          showPopover={showPopover}
          setShowPopover={setShowPopover}
          postId={post?._id}
          myReaction={post.myReaction}
        />
      )}
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
      justifyContent: 'space-between',
    },
    likesContainer: {
      borderRadius: responsiveScreenFontSize(100),
      paddingHorizontal: responsiveScreenWidth(2),
      borderWidth: 1,
      overflow: 'hidden',
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
    },
    commentsContainer: {
      paddingHorizontal: responsiveScreenWidth(2),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.BodyText,
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
