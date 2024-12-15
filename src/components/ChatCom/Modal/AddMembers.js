import React, {useEffect, useState, useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import CircleIcon from '../../../assets/Icons/CircleIcon';
import ModalBackAndCrossButton from './ModalBackAndCrossButton';
import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {updateSingleChatMemberCount} from '../../../store/reducer/chatReducer';
import Loading from '../../SharedComponent/Loading';
import Images from '../../../constants/Images';
import {updateCrowdMembers} from '../../../store/reducer/chatSlice';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import {showAlertModal} from '../../../utility/commonFunction';
import debounce from 'lodash.debounce'; // Import lodash.debounce
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';
import {showToast} from '../../HelperFunction';

const AddMembers = ({isAddMembersModalVisible, toggleAddMembersModal}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {singleChat: chat} = useSelector(state => state.chat);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const dispatch = useDispatch();

  // API Call for searching users
  const searchUsers = useCallback(text => {
    axiosInstance
      .get(`/chat/searchuser?query=${text}`)
      .then(res => {
        setUsers(res?.data?.users || []);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  useEffect(() => {
    searchUsers('');
  }, []);

  // Debounced version of the searchUsers function
  const debouncedSearchUsers = useCallback(
    debounce(text => {
      searchUsers(text);
    }, 500), // Adjust debounce time (in ms) as needed
    [searchUsers],
  );

  // Handle input change and trigger debounced search
  const handleInputChange = text => {
    setInputText(text);
    debouncedSearchUsers(text);
  };

  const handleAddUser = user => {
    setLoading(true);
    axiosInstance
      .patch(`/chat/channel/adduser/${chat?._id}`, {
        user: user._id,
      })
      .then(res => {
        if (res.data.success) {
          showToast({
            message: `${user.fullName} added successfully`,
            // background: Colors.Primary,
            // color: Colors.PureWhite,
          });

          dispatch(updateSingleChatMemberCount('add'));
          dispatch(
            updateCrowdMembers({
              _id: Math.random().toString(),
              mute: {
                isMuted: false,
              },
              isBlocked: false,
              isFavourite: false,
              role: 'member',
              chat: chat?._id,
              user: user,
              __v: 0,
            }),
          );
          setUsers(prev => prev?.filter(item => item._id !== user._id));
          // toggleAddMembersModal()
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log('err', err.response?.data);
        showToast({
          message: err.response?.data?.error,
          background: Colors.Primary,
          color: Colors.PureWhite,
        });
        // showAlertModal({
        //   title: 'Error!',
        //   type: 'warning',
        //   message: err.response?.data?.error || 'Something went wrong.',
        // });
      });
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isAddMembersModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          <ModalBackAndCrossButton toggleModal={toggleAddMembersModal} />
          <Text style={styles.checkedHeading}>Add Members</Text>
          <Text style={styles.addMemberDescription}>
            If you wish to add a member, kindly search and click add button.
          </Text>
          <View style={styles.topContainer}>
            <View style={styles.inputField}>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                style={styles.textInput}
                placeholder="Search"
                placeholderTextColor={Colors.BodyText}
                onChangeText={handleInputChange} // Handle input changes here
                value={inputText}
              />
              <SearchIcon />
            </View>
          </View>
          <View>
            <Text style={styles.allContact}>All Contact</Text>
          </View>
          {loading ? (
            <Loading />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
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
                          ? `${user?.fullName.split(' ')[0]} ${
                              user?.fullName.split(' ')[1]
                            }`
                          : `${user?.fullName}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      onPress={() => handleAddUser(user)}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

export default AddMembers;

const getStyles = Colors =>
  StyleSheet.create({
    addMemberDescription: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      width: '85%',
      paddingTop: responsiveScreenHeight(1),
    },
    addButtonText: {
      padding: 10,
      backgroundColor: Colors.Primary,
      paddingHorizontal: responsiveScreenWidth(7),
      paddingVertical: responsiveScreenHeight(1),
      fontFamily: CustomFonts.REGULAR,
      color: '#ffffff',
      borderRadius: 7,
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
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
    },
    modalContainer: {
      marginTop: responsiveScreenHeight(6),
      maxHeight: responsiveScreenHeight(80),
    },
    modalStyle: {
      borderRadius: 15,
      backgroundColor: Colors.White,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(69.5),
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
      backgroundColor: Colors.ModalBoxColor,

      padding: responsiveScreenWidth(1.9),
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
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
