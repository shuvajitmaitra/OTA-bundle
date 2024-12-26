import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {useSelector} from 'react-redux';
import SendIcon from '../../assets/Icons/SendIcon';
import {giveReply} from '../../actions/chat-noti';
import CustomFonts from '../../constants/CustomFonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';

const ReplyBox = ({comment, setComment}) => {
  const {user} = useSelector(state => state.auth);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [reply, setReply] = useState('');
  const {showAlert} = useGlobalAlert();

  return (
    <View style={styles.replayContainer}>
      <View
        style={{
          height: responsiveScreenHeight(10),
          width: responsiveScreenWidth(10),
        }}>
        <View
          style={{
            height: '50%',
            width: responsiveScreenWidth(6),
            alignSelf: 'flex-end',
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderBottomColor: Colors.BodyText,
            borderLeftColor: Colors.BodyText,
            borderBottomLeftRadius:
              (!comment.repliesCount && responsiveScreenFontSize(0.5)) || null,
            // backgroundColor: "pink",
          }}></View>

        {comment.repliesCount > 0 && (
          <View
            style={{
              height: '78%',
              width: responsiveScreenWidth(6),
              alignSelf: 'flex-end',
              borderLeftWidth: 2,
              borderLeftColor: Colors.BodyText,
              // backgroundColor: "yellow",
            }}></View>
        )}
      </View>
      <View>
        <Image source={{uri: user?.profilePicture}} style={styles.userImage} />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.ModalBoxColor,
          marginTop: 10,
          borderRadius: 7,
          borderWidth: 1,
          overFlow: 'hidden',
          borderColor: Colors.BorderColor,
          paddingHorizontal: 10,
        }}>
        <TextInput
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
          }
          placeholder="Write reply..."
          placeholderTextColor={Colors.BodyText}
          style={styles.input}
          multiline
          autoCorrect={false}
          onChangeText={text => setReply(text)}
          value={reply}
          textAlignVertical="top"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => setComment(pre => ({...pre, isReplyOpen: false}))}>
            <CrossCircle color={Colors.Red} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (reply) {
                giveReply({
                  contentId: comment.contentId,
                  comment: reply,
                  parentId: comment._id,
                });
                setReply('');
              } else {
                // Alert.alert("Reply field cannot be empty");
                return showAlert({
                  title: 'Empty Reply',
                  type: 'warning',
                  message: 'Reply cannot be empty.',
                });
              }
            }}
            style={styles.sendButtonContainer}>
            <SendIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReplyBox;

const getStyles = Colors =>
  StyleSheet.create({
    userImage: {
      height: responsiveScreenFontSize(4),
      width: responsiveScreenFontSize(4),
      borderRadius: 100,
      marginTop: responsiveScreenHeight(1),
      marginRight: responsiveScreenWidth(2),
    },

    replayContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: "green",
    },
    input: {
      fontFamily: CustomFonts.REGULAR,
      minHeight: responsiveScreenHeight(4),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1),
      fontSize: responsiveScreenFontSize(1.8),
      // backgroundColor: "red",
    },
    sendButtonContainer: {
      // bottom: responsiveScreenHeight(1),
      // right: responsiveScreenWidth(2),
    },
  });
