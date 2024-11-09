import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useNavigation} from '@react-navigation/native';
import GoToChatIcon from '../../assets/Icons/GoToChatIcon';
import UserIconTwo from '../../assets/Icons/UserIconTwo';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import {setSingleChat, updateChats} from '../../store/reducer/chatReducer';
import {setSelectedMessageScreen} from '../../store/reducer/ModalReducer';

const OnlineUsersItem = ({item}) => {
  const [creating, setCreating] = useState(false);
  const [Loading, setLoading] = useState(false);
  const {chats} = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handleCreateChat = async id => {
    if (creating) return;
    setCreating(true);
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/chat/findorcreate/${id}`);
      console.log('res.data', JSON.stringify(res.data, null, 1));
      if (res.data.success) {
        navigation.push('MessageScreen2', {
          chatId: res.data.chat._id,
          name: item?.fullName,
          image: item?.profilePicture,
        });
      }

      dispatch(setSingleChat(res.data.chat));

      dispatch(
        setSelectedMessageScreen({
          chatId: res.data.chat._id,
          name: res.data.chat?.isChannel
            ? res.data.chat?.name
            : res.data.chat?.otherUser?.fullName,
          image:
            res.data.chat?.avatar ||
            res.data.chat?.otherUser?.profilePicture ||
            '',
          limit: res.data.chat?.unreadCount || 0,
        }),
      );
      // dispatch(
      //   setSelectedMessageScreen({
      //     chatId: res.data.chat._id,
      //     name: item?.fullName,
      //     image: item?.profilePicture,
      //   })
      // );

      // const chatExists = chats.some(chat => chat._id === res.data.chat._id);
      // setLoading(false);
      // if (!chatExists) {
      //   dispatch(updateChats(res.data.chat));
      // }
      // }
    } catch (err) {
      setLoading(false);
      console.error('Error creating chat:', err?.response?.data);
    } finally {
      setLoading(false);

      setCreating(false);
    }
  };

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <TouchableOpacity
      onPress={() => {
        handleCreateChat(item._id);
      }}
      style={styles.mainContainer}>
      <View style={[styles.container]}>
        <View style={styles.subContainer}>
          <View style={styles.profileImageContainer}>
            {item.profilePicture ? (
              <Image
                resizeMode="contain"
                style={styles.profileImage}
                source={
                  item?.profilePicture
                    ? {uri: item?.profilePicture}
                    : require('../../assets/Images/user.png')
                }
              />
            ) : (
              <UserIconTwo size={responsiveScreenWidth(10)} />
            )}

            <View
              style={[
                styles.activeDot,
                {
                  backgroundColor: Colors.Primary,
                },
              ]}></View>
          </View>

          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.profileName}>
                {item?.fullName ? item?.fullName : 'Schools Hub User'}
              </Text>
            </View>
          </View>
        </View>
        {Loading ? (
          <ActivityIndicator
            color={Colors.Primary}
            animating={true}
            size="large"
            style={{marginRight: 5}}
          />
        ) : (
          <GoToChatIcon />
        )}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    mainContainer: {
      paddingHorizontal: 20,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.8),
      //   borderRadius: responsiveScreenWidth(2),
    },
    subContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
    },
    altOfProfileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      position: 'relative',
      backgroundColor: Colors.DarkGreen,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sortName: {
      color: Colors.White,
      fontSize: responsiveScreenFontSize(1.8),
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      backgroundColor: Colors.LightGreen,
    },
    activeDot: {
      width: responsiveScreenWidth(2.8),
      height: responsiveScreenWidth(2.8),
      borderRadius: responsiveScreenWidth(100),
      position: 'absolute',
      bottom: responsiveScreenWidth(0.9),
      right: -2,
      borderWidth: 1,
      borderColor: Colors.White,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      width: responsiveScreenWidth(50),
    },
    messageTime: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomFonts.REGULAR,
    },
    timeContainer: {
      flexDirection: 'row',
      gap: responsiveScreenHeight(1),
      alignItems: 'center',
      justifyContent: 'space-between',
      width: responsiveScreenWidth(70),
    },
    messageNumberContainer: {
      alignItems: 'center',
    },
    messageNumber: {
      paddingHorizontal: responsiveScreenWidth(1.2),
      backgroundColor: Colors.Primary,
      textAlign: 'center',
      color: Colors.PureWhite,
      borderRadius: responsiveScreenWidth(100),
      fontSize: responsiveScreenFontSize(1.3),
    },
  });

export default OnlineUsersItem;

const styles = StyleSheet.create({});
