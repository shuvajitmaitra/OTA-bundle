import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';
import SearchIcon from '../../../assets/Icons/SearchIcon';
import CheckIcon from '../../../assets/Icons/CheckIcon';
import UnCheckIcon from '../../../assets/Icons/UnCheckIcon';
import CircleIcon from '../../../assets/Icons/CircleIcon';
import CustomFonts from '../../../constants/CustomFonts';
import BlackCrossIcon from '../../../assets/Icons/BlackCrossIcon';
import axiosInstance from '../../../utility/axiosInstance';
import useChat from '../../../hook/useChat';
import {useTheme} from '../../../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updateChats} from '../../../store/reducer/chatReducer';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import FindTimeModal from './FindTimeModal';
import moment from 'moment';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import Images from '../../../constants/Images';
const InviteMemberModal = ({
  isModalVisible,
  toggleModal,
  date = moment(date).format('dddd'),
  setInvitations,
  invitations = [],
  handleUncheck,
  from,
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  // const [invitations, setInvitations] = useState(invitations);
  const [inputText, setInputText] = useState('');
  const [schedule, setSchedule] = useState([]);
  const dispatch = useDispatch();
  const {event} = useSelector(state => state.calendar);

  const [findTimeModalVisible, setFindTimeModalVisible] = useState(false);
  // console.log("event", JSON.stringify(event, null, 1));

  const handleCheckboxToggle = (user, action) => {
    if (from === 'add') {
      setUsers(
        users?.map(item =>
          item?._id === user
            ? {...item, invitations: !item?.invitations}
            : item,
        ),
      );

      const userInValidUsers = invitations?.find(item => item?._id === user);
      console.log(
        'userInValidUsers',
        JSON.stringify(userInValidUsers, null, 1),
      );

      if (userInValidUsers) {
        const newValidUsers = invitations?.filter(item => item?._id !== user);
        setInvitations(newValidUsers);
      } else {
        const userInUsers = users?.find(item => item?._id === user);
        console.log('userInUsers', JSON.stringify(userInUsers, null, 1));

        if (userInUsers) {
          setInvitations(prevValidUsers => {
            if (!prevValidUsers) {
              prevValidUsers = [];
            }
            return [...prevValidUsers, userInUsers];
          });
        } else {
          console.error('User not found in users list');
        }
      }
      return;
    }
    axiosInstance
      .patch(`/calendar/event/invitation/${event._id}`, {action, user})
      .then(res => {
        console.log('res.data', JSON.stringify(res.data, null, 1));
        if (res.data.success) {
          setUsers(
            users?.map(item =>
              item?._id === user
                ? {...item, invitations: !item?.invitations}
                : item,
            ),
          );

          const userInValidUsers = invitations?.find(
            item => item?._id === user,
          );

          if (userInValidUsers) {
            const newValidUsers = invitations?.filter(
              item => item._id !== user,
            );
            setInvitations(newValidUsers);
          } else {
            const userInUsers = users.find(item => item._id === user);
            if (userInUsers) {
              setInvitations(prevValidUsers => {
                if (!prevValidUsers) {
                  prevValidUsers = [];
                }
                return [...prevValidUsers, userInUsers];
              });
            }
          }
        }
      })
      .catch(error => {
        console.log(
          'error from calendar event invitation',
          JSON.stringify(error, null, 1),
        );
      });
  };

  useEffect(() => {
    axiosInstance
      .get(`/chat/searchuser?query=${inputText}`)
      .then(res => {
        setUsers(res?.data?.users);
      })
      .then(err => {
        console.log('err from searchuser?query', JSON.stringify(err, null, 1));
      });
  }, [inputText]);

  const handleFindTime = useCallback(userId => {
    axiosInstance
      .get(`calendar/schedule/find/${userId}`)
      .then(res => {
        if (res.data.success) {
          setSchedule([
            res?.data?.schedule?.availability?.find(
              item => item.wday == date.toLowerCase(),
            ),
            userId,
          ]);
        }
      })
      .catch(error => {
        console.log('error.....', JSON.stringify(error, null, 1));
        setSchedule([]);
      });
    setFindTimeModalVisible(true);
  }, []);
  const handleInviteButton = () => {
    // invitations.map((item) => setInvitations((pre) => [...pre, item._id]));
    setInvitations(invitations);
  };
  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          {/* -------------------------- */}
          {/* ----------- Back and Cross Button ----------- */}
          {/* -------------------------- */}
          <ModalBackAndCrossButton toggleModal={toggleModal} />
          <Text style={styles.checkedHeading}>Invitations</Text>

          {/* -------------------------- */}
          {/* ----------- To Implement previous style please uncomment all comments ----------- */}
          {/* -------------------------- */}
          <Text style={styles.Description}>
            If you wish to invite someone, kindly search and make selection.
          </Text>

          <View style={styles.inputField}>
            <TextInput
              keyboardAppearance={
                Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
              }
              style={styles.textInput}
              placeholder="Search"
              placeholderTextColor={Colors.BodyText}
              onChangeText={text => setInputText(text)}
              value={inputText}
            />
            <SearchIcon />
          </View>
          <View style={styles.topContainer}>
            {invitations?.length > 0 && (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      marginTop: responsiveScreenHeight(1),
                    }}>
                    {invitations?.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            alignItems: 'center',
                            position: 'relative',
                          }}>
                          <Image
                            source={
                              item?.profilePicture
                                ? {
                                    uri: item?.profilePicture,
                                  }
                                : Images.DEFAULT_IMAGE
                            }
                            style={styles.checkedImage}
                          />
                          <TouchableOpacity
                            onPress={() => handleUncheck(item?._id, 'remove')}
                            activeOpacity={0.5}
                            style={{
                              position: 'absolute',
                              bottom: responsiveScreenHeight(1),
                              right: responsiveScreenWidth(0),
                            }}>
                            <BlackCrossIcon />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.checkedText}>
                          {item?.fullName?.split(' ')?.length > 2
                            ? `${item?.fullName.split(' ')[0]}`
                            : `${item?.fullName}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  activeOpacity={0.3}
                  onPress={() => {
                    toggleModal();
                    from == 'add' && handleInviteButton();
                  }}
                  style={{
                    borderRadius: 4,
                    padding: 10,
                    backgroundColor: Colors.Primary,
                    paddingHorizontal: responsiveScreenWidth(7),
                    paddingVertical: responsiveScreenHeight(1),
                  }}>
                  <Text style={styles.addButtonText}>Invite</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={styles.allContact}>All Contact</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Show User List*/}
            {users.length ? (
              users?.map((user, index) => {
                return (
                  <View style={styles.imageContainer} key={index}>
                    <View style={styles.profileContainer}>
                      <View style={{position: 'relative'}}>
                        <Image
                          style={styles.user}
                          source={
                            user?.profilePicture
                              ? {
                                  uri: user?.profilePicture,
                                }
                              : Images.DEFAULT_IMAGE
                          }
                        />
                        <View style={styles.smallCircle}>
                          <CircleIcon />
                        </View>
                      </View>
                      <Text numberOfLines={1} style={styles.userName}>
                        {user?.fullName}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                        flex: 0.45,
                      }}>
                      <TouchableOpacity
                        onPress={() => handleFindTime(user._id)}
                        style={styles.findButtonContainer}>
                        <Text style={styles.findButtonText}>Find Time</Text>
                      </TouchableOpacity>
                      {invitations?.find(item => item._id == user._id) ? (
                        <TouchableOpacity
                          onPress={() =>
                            handleCheckboxToggle(user?._id, 'remove')
                          }
                          style={styles.removeButton}>
                          <Text style={styles.findButtonText}>Remove</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleCheckboxToggle(user?._id, 'add')}
                          style={styles.findButtonContainer}>
                          <Text style={styles.findButtonText}>Add</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <NoDataAvailable />
            )}
          </ScrollView>
        </View>
        <FindTimeModal
          handleCheckboxToggle={handleCheckboxToggle}
          isModalVisible={findTimeModalVisible}
          schedule={schedule}
          toggleModal={setFindTimeModalVisible}
        />
      </View>
    </ReactNativeModal>
  );
};

export default InviteMemberModal;

const getStyles = Colors =>
  StyleSheet.create({
    findButtonText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.3),
      color: Colors.PureWhite,
    },
    findButtonContainer: {
      backgroundColor: Colors.Primary,
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 4,
    },
    removeButton: {
      backgroundColor: Colors.Red,
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 4,
    },
    Description: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      width: '85%',
      paddingTop: responsiveScreenHeight(1),
    },
    addButtonText: {
      fontFamily: CustomFonts.REGULAR,
      color: '#ffffff',
    },
    checkedText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.5),
    },
    checkedHeading: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(2),
    },
    checkedImage: {
      width: responsiveScreenWidth(13),
      height: responsiveScreenWidth(13),
      marginBottom: responsiveScreenHeight(1),
      borderRadius: 100,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
    },
    modalContainer: {
      // marginTop: responsiveScreenHeight(6),
    },
    modalStyle: {
      borderRadius: 15,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(80),
    },

    btn: {
      backgroundColor: '#27ac1f',
      marginBottom: responsiveScreenHeight(3),
    },
    text: {
      alignSelf: 'center',
      paddingTop: responsiveScreenHeight(1),
      color: '#fff',
    },

    inputField: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.ScreenBoxColor,
      marginTop: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(2),
      // maxHeight: responsiveScreenHeight(5.8),
      marginBottom: responsiveScreenHeight(1),
    },

    textInput: {
      paddingVertical: responsiveScreenWidth(1.9),
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      flex: 1,
      // padding: 19,
      // backgroundColor: "black",
    },

    topContainer: {
      flexDirection: 'row',
      // justifyContent: "space-between",
      gap: responsiveScreenWidth(2.2),
      alignItems: 'center',
      //   backgroundColor: "red",
    },
    allContact: {
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(1),
      fontFamily: CustomFonts.MEDIUM,
      fontWeight: '500',
      fontSize: responsiveScreenFontSize(2),
      marginBottom: responsiveScreenHeight(1),
    },
    userList: {
      marginTop: responsiveScreenHeight(1),
    },
    imageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: responsiveScreenWidth(2),
      justifyContent: 'space-between',
      flex: 1,
    },
    user: {
      width: responsiveScreenWidth(6.5),
      height: responsiveScreenWidth(6.7),
      backgroundColor: Colors.LightGreen,
      resizeMode: 'cover',
      borderRadius: 100,
    },
    userName: {
      fontSize: responsiveScreenFontSize(1.9),
      fontFamily: CustomFonts.MEDIUM,
      fontWeight: '500',
      color: Colors.BodyText,
      flexBasis: '50%',

      // backgroundColor: "red",
    },
    smallCircle: {
      position: 'absolute',
      right: responsiveScreenWidth(-1),
      top: responsiveScreenHeight(1.8),
      padding: 1,
    },
    profileContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      alignItems: 'center',
      flex: 0.55,
    },
  });
