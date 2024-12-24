import React, {useEffect, useState} from 'react';
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
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';
import SearchIcon from '../../../assets/Icons/SearchIcon';
import CheckIcon from '../../../assets/Icons/CheckIcon';
import UnCheckIcon from '../../../assets/Icons/UnCheckIcon';
import CircleIcon from '../../../assets/Icons/CircleIcon';
import ModalBackAndCrossButton from './ModalBackAndCrossButton';
import CustomFonts from '../../../constants/CustomFonts';
import BlackCrossIcon from '../../../assets/Icons/BlackCrossIcon';
import axiosInstance from '../../../utility/axiosInstance';
import useChat from '../../../hook/useChat';
import {useTheme} from '../../../context/ThemeContext';
import Images from '../../../constants/Images';
import {useGlobalAlert} from '../../SharedComponent/GlobalAlertContext';
const ForwardMember = ({
  isForwardMemberModalVisible,
  toggleForwardMemberModal,
  setSelectedMessage,
  chat,
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();
  //   const { chat = [], fetchMembers } = useChat();
  const [users, setUsers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [inputText, setInputText] = useState('');
  // console.log("Chat Id", userDetails);
  // console.log(JSON.stringify(chat?._id, null, 1));

  // ...................
  // For handling checkbox toggle
  // ....................
  const handleCheckboxToggle = userId => {
    setUsers(
      users.map(user =>
        user?._id === userId ? {...user, checked: !user.checked} : user,
      ),
    );
  };
  useEffect(() => {
    setChecked(users?.filter(item => item.checked));
  }, [users]);

  // --------------------------
  // ----------- Uncheck Function -----------
  // --------------------------
  const handleUncheck = id => {
    setChecked(checked?.filter(item => item?._id !== id));
    const uncheck = users.find(item => item?._id == id);
    uncheck.checked = false;
  };

  useEffect(() => {
    axiosInstance
      .get(`/chat/searchuser?query=${inputText}`)
      .then(res => {
        setUsers(res?.data?.users);
      })
      .then(err => {
        console.log(err);
      });
  }, [inputText]);

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isForwardMemberModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          {/* -------------------------- */}
          {/* ----------- Back and Cross Button ----------- */}
          {/* -------------------------- */}
          <ModalBackAndCrossButton
            toggleModal={() => {
              toggleForwardMemberModal();
              setSelectedMessage(null);
            }}
          />
          <Text style={styles.checkedHeading}>Forward Message</Text>

          {/* -------------------------- */}
          {/* ----------- To Implement previous style please uncomment all comments ----------- */}
          {/* -------------------------- */}
          <>
            {!checked?.length ? (
              <Text style={styles.Description}>
                If you wish to forward messages, kindly search and make
                selection.
              </Text>
            ) : null}
          </>
          <View style={styles.topContainer}>
            {/* search */}
            {checked?.length ? (
              <>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    {checked?.map((item, index) => (
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
                            onPress={() => handleUncheck(item?._id)}
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
                          {item?.fullName.split(' ')?.length > 3
                            ? `${item?.fullName.split(' ')[0]}  ${
                                item?.fullName.split(' ')[1]
                              }`
                            : `${item?.fullName}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
                <TouchableOpacity
                  activeOpacity={0.3}
                  style={styles.addButtonContainer}
                  onPress={() =>
                    showAlert({
                      title: 'Coming Soon...',
                      type: 'warning',
                      message: 'This feature is coming soon.',
                    })
                  }>
                  <Text style={styles.addButtonText}>Forward</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
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
              </>
            )}
          </View>
          <View>
            <Text style={styles.allContact}>All Contact</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {/* Show User List*/}
              {users?.map((user, index) => (
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
                    <Text style={styles.userName}>
                      {user?.fullName.split(' ')?.length > 3
                        ? `${user?.fullName.split(' ')[0]}  ${
                            user?.fullName.split(' ')[1]
                          }`
                        : `${user?.fullName}`}
                    </Text>
                  </View>
                  {/* Show Check box icon by help of svg */}
                  <TouchableOpacity
                    onPress={() => handleCheckboxToggle(user?._id)}>
                    {user.checked ? <CheckIcon /> : <UnCheckIcon />}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default ForwardMember;

const getStyles = Colors =>
  StyleSheet.create({
    Description: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      width: '85%',
      paddingTop: responsiveScreenHeight(1),
    },
    addButtonContainer: {
      padding: 10,
      backgroundColor: Colors.Primary,
      paddingHorizontal: responsiveScreenWidth(7),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 7,
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
      // backgroundColor: Colors.Background_color,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
    },
    modalContainer: {
      marginTop: responsiveScreenHeight(6),
    },
    modalStyle: {
      borderRadius: 15,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenHeight(1.5),
      width: responsiveScreenWidth(90),
      maxHeight: responsiveScreenHeight(80),
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

      padding: responsiveScreenWidth(1.9),
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      flex: 1,
      borderRadius: responsiveScreenWidth(2),
      height: responsiveScreenHeight(5.8),
    },

    textInput: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      flex: 1,
    },

    topContainer: {
      flexDirection: 'row',
      // justifyContent: "space-between",
      gap: responsiveScreenWidth(2.2),
      alignItems: 'center',
      paddingTop: responsiveScreenHeight(1.5),
    },
    allContact: {
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(1.8),
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
    },
  });
