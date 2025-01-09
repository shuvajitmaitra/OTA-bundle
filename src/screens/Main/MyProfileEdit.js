import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker, {pick, types} from 'react-native-document-picker';

import CustomFonts from '../../constants/CustomFonts';

import {useDispatch, useSelector} from 'react-redux';
import {formatDate} from '../../utility/formatDate';
import MyButton from '../../components/AuthenticationCom/MyButton';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import LineUp from '../../assets/Icons/LineUp';
import FacebookSvg from '../../assets/Icons/FacebookSvg';

import InstagramIcon from '../../assets/Icons/InstagramIcon';
import Linkedin from '../../assets/Icons/Linkedin';
import Twitter from '../../assets/Icons/Twitter';
import GithubIcon from '../../assets/Icons/GithubIcon';
import {setUser} from '../../store/reducer/authReducer';
import UploadIcon from '../../assets/Icons/UploadIcon';
import {extractFilename, showToast} from '../../components/HelperFunction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGlobalAlert} from '../../components/SharedComponent/GlobalAlertContext';
import RequireFieldStar from '../../constants/RequireFieldStar';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import CameraIcon from '../../assets/Icons/CameraIcon';
import {launchImageLibrary} from 'react-native-image-picker';

export default function MyProfileEdit() {
  const scrollViewRef = useRef(null);
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resume, setResume] = useState(user?.personalData?.resume || '');
  const [resumeName, setResumeName] = useState('');
  const {top} = useSafeAreaInsets();
  const [firstName, setFirstName] = React.useState(user?.firstName);
  const [lastName, setLastName] = React.useState(user?.lastName);
  const [about, setAbout] = React.useState(user?.about);
  const {showAlert} = useGlobalAlert();
  const [edit, setEdit] = React.useState(false);
  const [facebook, setFacebook] = React.useState(
    user?.personalData?.socialMedia?.facebook,
  );
  const [github, setGithub] = React.useState(
    user?.personalData?.socialMedia?.github,
  );
  const [instagram, setInstagram] = React.useState(
    user?.personalData?.socialMedia?.instagram,
  );
  const [linkedin, setLinkedin] = React.useState(
    user?.personalData?.socialMedia?.linkedin,
  );

  const [twitter, setTwitter] = React.useState(
    user?.personalData?.socialMedia?.twitter,
  );

  const [selectedPostalCode, setSelectedPostalCode] = React.useState(
    user?.personalData?.address?.postalCode,
  );
  const [selectedCountry, setSelectedCountry] = React.useState(
    user.personalData?.address?.country,
  );
  const [selectedCity, setSelectedCity] = React.useState(
    user.personalData?.address?.city,
  );
  const [state, setState] = React.useState(user.personalData?.address?.state);
  const [selectedState, setSelectedState] = React.useState(
    user.personalData?.address?.street,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    navigation.navigate('MyProfile');
  };
  const handleUpdateUser = () => {
    if (!firstName && !lastName) {
      Alert.alert('Please provide first name & last name');
      return;
    }
    if (!about) return Alert.alert('About is require');
    axiosInstance
      .patch('/user/updateuser', {
        firstName: firstName,
        lastName: lastName,
        personalData: {
          address: {
            street: selectedState,
            city: selectedCity,
            postalCode: selectedPostalCode,
            state: state,
            country: selectedCountry,
          },
          socialMedia: {
            facebook: facebook,
            github: github,
            instagram: instagram,
            linkedin: linkedin,
            twitter: twitter,
          },
          resume,
          bio: about,
        },
        about,
      })
      .then(res => {
        // Alert.alert("Profile Updated");
        navigation.pop(2);
        showAlert({
          title: 'Done!',
          type: 'success',
          message: 'Profile has been updated successfully!!',
        });
        dispatch(setUser(res.data.user));
      })
      .catch(err => {
        console.log('editProfile', err);
      });
  };

  const showEditBtn = () => {
    setEdit(!edit);
  };
  const uploadResume = async () => {
    try {
      const [result] = await pick({
        allowMultiSelection: false,
        type: types.pdf,
      });

      console.log('result', JSON.stringify(result, null, 2));
      setIsLoading(true);
      const {uri, name, size} = result;

      setResumeName(name || '');
      const formData = new FormData();
      formData.append('file', {
        uri,
        name,
        type: 'application/pdf',
      });
      const url = '/document/userdocumentfile';
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('response', JSON.stringify(response, null, 2));
      if (response?.data?.success) {
        scrollToBottom();
        setResume(response?.data?.fileUrl);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error?.response) {
        console?.error('Server error:', error?.response?.data);
      } else if (error?.request) {
        console?.error('Network error:', error?.request);
        console?.log(
          'Network error:',
          JSON?.stringify(error?.request, null, 1),
        );
      } else {
        // Something else caused the error
        // console?.error('Error......:', error?.message);
        showToast({message: 'Cancel resume picker'});
      }
    }
  };
  const [profilePicture, setProfilePicture] = React.useState(
    user?.profilePicture,
  );
  const saveImage = async mediaData => {
    // console.log('uri', JSON.stringify(mediaData?.uri, null, 2));
    // console.log('mediaData', JSON.stringify(mediaData, null, 2));
    setProfilePicture(mediaData?.uri);
    try {
      setIsLoading(true);
      const formData = new FormData();
      const data = {
        uri: mediaData?.uri,
        name: mediaData?.fileName || 'profile_image',
        fileName: mediaData?.fileName || 'profile_image',
        type: mediaData?.type || mediaData?.mimeType || 'image',
      };
      formData.append('image', data);

      axiosInstance
        .patch('/user/updateimage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          if (res.data.success) {
            navigation.navigate('MyProfile');
            showToast({message: 'Profile picture changed'});
            dispatch(setUser(res.data.user));
            setIsLoading(false);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          if (error.response) {
            console.log(
              'Server error:',
              JSON.stringify(error.response.data, null, 1),
            );
          } else if (error.request) {
            console.log(
              'Network error:',
              JSON.stringify(error.request, null, 1),
            );
          } else {
            console.error('Error:', JSON.stringify(error.message, null, 1));
          }
        });
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        console.log(
          'Server error:',
          JSON.stringify(error.response.data, null, 1),
        );
      } else if (error.request) {
        console.log('Network error:', JSON.stringify(error.request, null, 1));
      } else {
        console.error('Error:', JSON.stringify(error.message, null, 1));
      }
    }
  };
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 30000,
      maxHeight: 30000,
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        saveImage(response.assets[0]);
      }
    });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // For iOS and Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <View style={{backgroundColor: Colors.Background_color}}>
        <StatusBar backgroundColor={'transparent'} />
        <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.container}>
            <View style={[styles.topContainer, {paddingTop: top}]}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.topArrowContainer}>
                <ArrowLeft color={Colors.PureWhite} />
                <Text style={styles.topText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.myProfile}>Edit Profile</Text>
              <View style={{flex: 0.3, height: 10}}></View>
            </View>

            <Image
              source={require('../../assets/ApplicationImage/MainPage/MyProfileBG.png')}
              style={styles.bgimg}
            />
            <View style={styles.profileImgContainer}>
              {isLoading ? (
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator color={Colors.Primary} size={40} />
                </View>
              ) : null}
              <Image source={{uri: profilePicture}} style={styles.profileImg} />
              <TouchableOpacity
                onPress={selectImage}
                style={styles.photoIconContainer}>
                <CameraIcon />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{user?.fullName}</Text>
            <Text style={styles.profileId}>ID: {user?.id}</Text>

            <Text style={styles.personalInfo}>Personal Information</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>First Name</Text>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                numberOfLines={1}
                style={styles.textInput}
                onChangeText={setFirstName}
                value={firstName}
                editable={true}
                placeholder="Enter first name..."
                placeholderTextColor={Colors.BodyText}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Last Name</Text>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                numberOfLines={1}
                style={styles.textInput}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={Colors.BodyText}
                editable={true}
                placeholder="Enter last name..."
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Email</Text>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                numberOfLines={1}
                style={styles.textInput}
                placeholder={user?.email || 'Enter email...'}
                placeholderTextColor={Colors.BodyText}
                editable={false}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Member Since</Text>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                numberOfLines={1}
                style={styles.textInput}
                placeholder={formatDate(user?.createdAt)}
                editable={false}
                placeholderTextColor={Colors.BodyText}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Resume</Text>
              <TouchableOpacity
                onPress={() => uploadResume()}
                style={styles.resumeContainer}>
                <UploadIcon />
                <Text numberOfLines={1} style={styles.downloadFile}>
                  {resumeName ||
                    extractFilename(user?.personalData?.resume || '') ||
                    'Upload Document'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cont}>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldText}>Address</Text>
                <View style={styles.addressContainer}>
                  <TextInput
                    keyboardAppearance={
                      Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                    }
                    numberOfLines={1}
                    placeholder="Enter street"
                    value={selectedState}
                    style={styles.addressInput}
                    onChangeText={setSelectedState}
                    placeholderTextColor={Colors.BodyText}
                  />

                  <TextInput
                    keyboardAppearance={
                      Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                    }
                    numberOfLines={1}
                    placeholder="Enter city"
                    style={styles.addressInput}
                    onChangeText={setSelectedCity}
                    value={selectedCity}
                    placeholderTextColor={Colors.BodyText}
                  />

                  <TextInput
                    keyboardAppearance={
                      Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                    }
                    numberOfLines={1}
                    placeholder="Enter postal code"
                    placeholderTextColor={Colors.BodyText}
                    value={selectedPostalCode}
                    style={styles.addressInput}
                    onChangeText={setSelectedPostalCode}
                    keyboardType="numeric"
                  />

                  {/* <View style={[styles.selectContainer]}>
                  <TextInput
                    keyboardAppearance={
                      Colors.Background_color === "#F5F5F5" ? "light" : "dark"
                    }
                    numberOfLines={1}
                    placeholder="Enter state"
                    value={state}
                    style={styles.textInput}
                    placeholderTextColor={Colors.BodyText}
                    onChangeText={(text) => setState(text)}
                  />
                </View> */}

                  <TextInput
                    keyboardAppearance={
                      Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                    }
                    numberOfLines={1}
                    placeholder="Enter country"
                    value={selectedCountry}
                    style={styles.addressInput}
                    placeholderTextColor={Colors.BodyText}
                    onChangeText={setSelectedCountry}
                  />
                </View>
              </View>
              <View style={styles.socialfieldContainer}>
                <Text style={styles.fieldText}>Social Link</Text>
                <View style={styles.socialLinkContainer}>
                  <View style={[styles.socialInputContainer]}>
                    <View style={styles.socialIconContainer}>
                      <FacebookSvg />
                    </View>

                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      numberOfLines={1}
                      placeholder="www.facebook.com"
                      placeholderTextColor={Colors.BodyText}
                      style={styles.socialInputField}
                      onChangeText={setFacebook}
                      value={facebook}
                    />
                  </View>
                  <View style={[styles.socialInputContainer]}>
                    <View style={styles.socialIconContainer}>
                      <GithubIcon />
                    </View>

                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      numberOfLines={1}
                      placeholder="www.github.com"
                      placeholderTextColor={Colors.BodyText}
                      value={github}
                      style={styles.socialInputField}
                      onChangeText={setGithub}
                    />
                  </View>
                  <View style={[styles.socialInputContainer]}>
                    <View style={styles.socialIconContainer}>
                      <InstagramIcon />
                    </View>

                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      numberOfLines={1}
                      placeholder="www.instagram.com"
                      placeholderTextColor={Colors.BodyText}
                      value={instagram}
                      style={styles.socialInputField}
                      onChangeText={setInstagram}
                    />
                  </View>
                  <View style={[styles.socialInputContainer]}>
                    <View style={styles.socialIconContainer}>
                      <Linkedin />
                    </View>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      numberOfLines={1}
                      placeholder="www.linkedin.com"
                      placeholderTextColor={Colors.BodyText}
                      value={linkedin}
                      style={[styles.socialInputField]}
                      onChangeText={setLinkedin}
                    />
                  </View>
                  <View style={styles.socialInputContainer}>
                    <View style={styles.socialIconContainer}>
                      <Twitter />
                    </View>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      numberOfLines={1}
                      placeholder="www.twitter.com"
                      placeholderTextColor={Colors.BodyText}
                      value={twitter}
                      style={styles.socialInputField}
                      onChangeText={setTwitter}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.bioContainer}>
                <Text style={styles.fieldText}>
                  Bio
                  <RequireFieldStar />
                </Text>
                <View style={[styles.inputContainer, {height: 'auto'}]}>
                  {/* <TextInput
                numberOfLines={1}
                  style={[styles.textAreaInput]}
                  onChangeText={(text) => setAbout(text)}
                /> */}
                  <TextInput
                    keyboardAppearance={
                      Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                    }
                    multiline={true}
                    onFocus={scrollToBottom}
                    placeholderTextColor={Colors.BodyText}
                    placeholder={'Write about yourself'}
                    style={styles.textAreaInput}
                    onChangeText={text => setAbout(text)}
                    value={about}
                    editable={true}
                    maxLength={200}
                  />
                </View>
              </View>
            </View>
            <View>
              <View style={styles.btnArea}>
                <MyButton
                  title={'Cancel'}
                  bg={'rgba(39, 172, 31, 0.1)'}
                  colour={Colors.Primary}
                  onPress={handleCancel}
                />
                <MyButton
                  title={'Update'}
                  bg={Colors.Primary}
                  colour={Colors.PureWhite}
                  onPress={handleUpdateUser}
                />
              </View>
            </View>
            <View style={{marginBottom: responsiveScreenHeight(2)}} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    addressInput: {
      backgroundColor: Colors.Background_color,
      textTransform: 'none',
      width: '100%',
      height: 40,
      paddingLeft: 10,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
    },
    socialIconContainer: {
      width: '15%',
      alignItems: 'center',
    },
    socialInputField: {
      backgroundColor: Colors.Background_color,
      textTransform: 'none',
      width: '85%',
      height: 40,
      paddingLeft: 10,
      borderTopRightRadius: 7,
      borderBottomRightRadius: 7,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
    },
    socialInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'blue',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 7,
    },

    container: {
      flex: 1,
      // marginTop: responsiveScreenHeight(3),
      backgroundColor: Colors.Background_color,
    },
    topContainer: {
      flexDirection: 'row',
      position: 'absolute',
      zIndex: 1,
      paddingHorizontal: responsiveScreenWidth(3),
      // paddingVertical: responsiveScreenHeight(3.5),
      justifyContent: 'space-between',
      width: responsiveScreenWidth(100),
      alignItems: 'flex-end',
      // backgroundColor: "red",
    },
    topArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      // backgroundColor: "red",
      flex: 0.3,
    },
    arrowStyle: {
      marginTop: responsiveScreenHeight(0.3),
    },
    editIcon: {
      marginTop: responsiveScreenHeight(0.4),
    },
    topText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      marginLeft: responsiveScreenWidth(1),
    },
    bgimg: {
      width: responsiveScreenWidth(100),
      height: responsiveScreenHeight(28.5),
      objectFit: 'cover',
    },
    profileImgContainer: {
      width: responsiveScreenWidth(25),
      height: responsiveScreenWidth(25),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(25),
      position: 'absolute',
      left: responsiveScreenWidth(36),
      top: responsiveScreenHeight(21),
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileImg: {
      width: responsiveScreenWidth(22),
      height: responsiveScreenWidth(22),
      objectFit: 'cover',
      borderRadius: responsiveScreenWidth(22),
      position: 'relative',
    },
    myProfile: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      // marginRight: responsiveScreenWidth(12),
      flex: 0.3,
      textAlign: 'center',
      // backgroundColor: "yellow",
    },
    photoIconContainer: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(7),
      position: 'absolute',
      left: responsiveScreenWidth(19),
      top: responsiveScreenHeight(6.5),
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(4.5),
      color: Colors.Heading,
    },
    profileId: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(0),
      color: Colors.BodyText,
    },
    socialIcon: {
      alignSelf: 'center',
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(1),
    },

    personalInfo: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginVertical: responsiveScreenHeight(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },

    fieldContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginBottom: responsiveScreenHeight(1),
    },
    socialfieldContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(2.5),
      marginBottom: responsiveScreenHeight(1),
    },

    bioContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(2.5),
      marginBottom: responsiveScreenHeight(1),
      position: 'static',

      zIndex: 1,
    },
    fieldText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      marginLeft: 2,
    },
    inputContainer: {
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(6),
      backgroundColor: Colors.White,
      borderRadius: 10,
      borderWidth: 1,
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(2),
      borderColor: Colors.BorderColor,
    },
    addressContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.White,
      borderRadius: 10,
      borderWidth: 1,
      gap: responsiveScreenHeight(1.5),
      marginTop: responsiveScreenHeight(1),
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(2),
      borderColor: Colors.BorderColor,
    },
    socialLinkContainer: {
      width: responsiveScreenWidth(90),
      gap: responsiveScreenHeight(1.5),
      backgroundColor: Colors.White,
      borderRadius: 10,
      borderWidth: 1,
      marginTop: responsiveScreenHeight(1),
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(2.5),
      borderColor: Colors.BorderColor,
    },
    addressText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
      textTransform: 'capitalize',
    },
    selectContainer: {
      // flex: 1,
      height: responsiveScreenHeight(1),
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
      justifyContent: 'space-between',
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.Primary,
    },
    textInput: {
      width: '100%',
      marginLeft: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      // textAlign: "justify",
      textTransform: 'capitalize',
      overflow: 'scroll',
      backgroundColor: Colors.White,
      // backgroundColor: "red",
      paddingLeft: 10,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      height: 50,
      marginTop: 10,
    },
    textAreaInput: {
      // flex: 1,
      marginLeft: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      textAlign: 'justify',
      // paddingVertical: responsiveScreenHeight(1),
      // backgroundColor: "red",
      textAlignVertical: 'top',
      minHeight: responsiveScreenHeight(10),
      // maxHeight: 200,
    },
    resumeContainer: {
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(6),

      borderRadius: 10,
      borderWidth: 1,
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
      borderColor: Colors.Primary,
    },
    resumeImage: {
      width: responsiveScreenWidth(6),
      height: responsiveScreenWidth(6),
    },
    downloadFile: {
      color: Colors.Primary,
      marginLeft: responsiveScreenWidth(2),

      flexBasis: '80%',
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    btnArea: {
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(5),
      gap: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(2),
    },
    dropdownCityArea: {
      width: responsiveScreenWidth(85),
      height: responsiveScreenHeight(16),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(0),
      backgroundColor: Colors.White,

      alignSelf: 'center',
      position: 'absolute',
      top: 210,
      zIndex: 9,
      paddingVertical: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
    },
    dropdownArea: {
      width: responsiveScreenWidth(85),
      height: responsiveScreenHeight(16),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(0),
      backgroundColor: Colors.White,

      alignSelf: 'center',
      position: 'absolute',
      top: 420,
      zIndex: 5,
      paddingVertical: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
    },
    dropdownStateArea: {
      width: responsiveScreenWidth(85),
      height: responsiveScreenHeight(16),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(0),
      backgroundColor: Colors.White,

      alignSelf: 'center',
      position: 'absolute',
      top: 280,
      zIndex: 4,
      paddingVertical: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
    },
    searchInput: {
      width: responsiveScreenWidth(80),
      height: responsiveScreenHeight(4),
      borderWidth: responsiveScreenWidth(0.3),
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(0.5),
      paddingLeft: responsiveScreenWidth(3),
      color: Colors.Heading,
    },
    cont: {
      position: 'relative',
    },
    countryItem: {
      width: responsiveScreenWidth(75),
      height: responsiveScreenHeight(3),
      borderBottomWidth: 0.2,
      borderBottomColor: '#8e8e8e',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    country: {
      flexDirection: 'row',

      gap: 225,
      alignItems: 'center',
    },
    countryName: {
      color: Colors.Heading,
    },
    lineUp: {
      marginLeft: responsiveScreenWidth(2),
    },
    socialField: {width: '100%', paddingLeft: responsiveScreenWidth(2)},
  });
