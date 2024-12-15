import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

import CustomFonts from '../../constants/CustomFonts';
import EditIcon from '../../assets/Icons/EditIcon';

import {useSelector} from 'react-redux';
import FacebookIcon from '../../assets/Icons/FacebookIcon';
import InstragramIcon from '../../assets/Icons/InstragramIcon';
import LinkedInIcon from '../../assets/Icons/LinkedInIcon';
import {formatDate} from '../../utility/formatDate';
import MyButton from '../../components/AuthenticationCom/MyButton';
import {useTheme} from '../../context/ThemeContext';
import DownloadIconTwo from '../../assets/Icons/DownloadIconTwo';
import {extractFilename, handleOpenLink} from '../../components/HelperFunction';
import GithubIconTwo from '../../assets/Icons/GitHubIconTwo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Images from '../../constants/Images';
import Markdown from 'react-native-markdown-display';
import {autoLinkify} from '../../components/ChatCom/MessageHelper';
import {RegularFonts} from '../../constants/Fonts';
import RequireFieldStar from '../../constants/RequireFieldStar';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import Twitter from '../../assets/Icons/Twitter';
export default function MyProfile() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state.auth);
  const navigation = useNavigation();
  const [edit, setEdit] = React.useState(false);

  const countries = [
    {
      country: 'Afghanistan',
      code: '93',
      iso: 'AF',
    },
    {
      country: 'Bangladesh',
      code: '880',
      iso: 'BD',
    },
    {
      country: 'Albania',
      code: '355',
      iso: 'AL',
    },
    {
      country: 'Algeria',
      code: '213',
      iso: 'DZ',
    },
    {
      country: 'American Samoa',
      code: '1-684',
      iso: 'AS',
    },
    {
      country: 'Andorra',
      code: '376',
      iso: 'AD',
    },
    {
      country: 'Angola',
      code: '244',
      iso: 'AO',
    },
    {
      country: 'Anguilla',
      code: '1-264',
      iso: 'AI',
    },
    {
      country: 'Antarctica',
      code: '672',
      iso: 'AQ',
    },
    {
      country: 'Antigua and Barbuda',
      code: '1-268',
      iso: 'AG',
    },
  ];
  const cities = [
    {
      id: 1,
      city: 'Atlanta',
    },
    {
      id: 2,
      city: 'Boston',
    },
    {
      id: 3,
      city: 'Chicago',
    },
    {
      id: 4,
      city: 'Denver',
    },
    {
      id: 5,
      city: 'Houston',
    },
    {
      id: 6,
      city: 'Los Angeles',
    },
    {
      id: 7,
      city: 'Miami',
    },
    {
      id: 8,
      city: 'New Orleans',
    },
    {
      id: 9,
      city: 'Philadelphia',
    },
    {
      id: 10,
      city: 'Seattle',
    },
  ];
  const states = [
    {
      id: 1,
      state: 'Georgia',
    },
    {
      id: 2,
      state: 'Massachusetts',
    },
    {
      id: 3,
      state: 'Illinois',
    },
    {
      id: 4,
      state: 'Colorado',
    },
    {
      id: 5,
      state: 'Texas',
    },
    {
      id: 6,
      state: 'California',
    },
    {
      id: 7,
      state: 'Florida',
    },
    {
      id: 8,
      state: 'Louisiana',
    },
    {
      id: 9,
      state: 'Pennsylvania',
    },
    {
      id: 10,
      state: 'Washington',
    },
  ];

  const [data, setData] = React.useState(countries);
  const [stateData, setStateData] = React.useState(states);
  const [cityData, setCityData] = React.useState(cities);
  const onSearch = txt => {
    if (txt !== '') {
      let tempData = data?.filter(item => {
        return item.country.toLowerCase().indexOf(txt.toLowerCase()) > -1;
      });
      setData(tempData);
    } else {
      setData(countries);
    }
  };
  const onStateSearch = txt => {
    if (txt !== '') {
      let tempData = stateData?.filter(item => {
        return item.state.toLowerCase().indexOf(txt.toLowerCase()) > -1;
      });
      setStateData(tempData);
    } else {
      setStateData(states);
    }
  };
  const onCitySearch = txt => {
    if (txt !== '') {
      let tempData = cityData?.filter(item => {
        return item.city.toLowerCase().indexOf(txt.toLowerCase()) > -1;
      });
      setCityData(tempData);
    } else {
      setCityData(cities);
    }
  };

  const showEditBtn = () => {
    setEdit(!edit);
  };
  const insets = useSafeAreaInsets();

  return (
    <View
      // style={{ flex: 1, backgroundColor: "red" }}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={
      //   Platform.OS === "ios" ? 0 : -responsiveScreenHeight(1)
      // }
      style={{backgroundColor: Colors.Background_color}}>
      <StatusBar backgroundColor={'transparent'} />
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.topContainer, {paddingTop: insets.top}]}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={[styles.topArrowContainer]}>
              <ArrowLeft color={Colors.PureWhite} />
              <Text style={styles.topText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.myProfile}>My Profile</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyProfileEdit')}
              style={styles.editIcon}>
              <EditIcon />
            </TouchableOpacity>
          </View>

          <Image
            source={require('../../assets/ApplicationImage/MainPage/MyProfileBG.png')}
            style={styles.bgimg}
          />
          <View style={styles.profileImgContainer}>
            <Image
              source={
                user.profilePicture
                  ? {
                      uri: user?.profilePicture,
                    }
                  : Images.DEFAULT_IMAGE
              }
              style={styles.profileImg}
            />
          </View>
          <Text style={styles.profileName}>{user?.fullName}</Text>
          <Text style={styles.profileId}>ID: {user?.id}</Text>
          <View style={styles.socialIcon}>
            {user.personalData.socialMedia.facebook ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.facebook);
                }}>
                <FacebookIcon />
              </TouchableOpacity>
            ) : null}
            {user?.personalData?.socialMedia?.github ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.github);
                }}>
                <GithubIconTwo />
              </TouchableOpacity>
            ) : null}
            {user?.personalData?.socialMedia?.instagram ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.instagram);
                }}>
                <InstragramIcon />
              </TouchableOpacity>
            ) : null}
            {user?.personalData?.socialMedia?.linkedin ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.linkedin);
                }}>
                <LinkedInIcon />
              </TouchableOpacity>
            ) : null}
            {user?.personalData?.socialMedia?.twitter ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.twitter);
                }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: Colors.Primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Twitter color={Colors.Primary} />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={styles.personalInfo}>Personal Information</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>First Name</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                style={styles.textInput}
                numberOfLines={1}
                placeholder={user?.firstName || 'N/A'}
                placeholderTextColor={Colors.BodyText}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>Last Name</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                style={styles.textInput}
                numberOfLines={1}
                placeholder={user?.lastName || 'N/A'}
                placeholderTextColor={Colors.BodyText}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>Email Address</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                style={styles.textInput}
                numberOfLines={1}
                placeholder={user?.email || 'N/A'}
                placeholderTextColor={Colors.BodyText}
                editable={false}
              />
            </View>
          </View>
          {/* <CustomePhoneField title="Phone Number" setText={setPhone} /> */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>
              Phone{' '}
              <Text style={{fontFamily: CustomFonts.MEDIUM, color: Colors.Red}}>
                {user?.phone.isVerified ? null : '(Not Verified)'}
              </Text>
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: user?.phone.isVerified
                    ? Colors.BorderColor
                    : Colors.Red,
                },
              ]}>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                style={styles.textInput}
                numberOfLines={1}
                placeholder={
                  user?.phone?.number && user?.phone?.countryCode
                    ? '+' + user?.phone?.countryCode + user?.phone?.number
                    : 'N/A'
                }
                editable={false}
                placeholderTextColor={Colors.BodyText}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>Member Since</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                style={styles.textInput}
                numberOfLines={1}
                placeholder={formatDate(user?.createdAt)}
                editable={false}
                placeholderTextColor={Colors.BodyText}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>Resume</Text>
            <TouchableOpacity
              onPress={() => {
                user?.personalData?.resume
                  ? handleOpenLink(user?.personalData?.resume)
                  : Alert.alert('Resume not available');
              }}
              style={styles.resumeContainer}>
              <DownloadIconTwo />
              <Text numberOfLines={1} style={styles.downloadFile}>
                {extractFilename(user?.personalData?.resume || '') ||
                  'Resume not available'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cont}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Address</Text>
              <View style={styles.addressContainer}>
                <View style={[styles.selectContainer]}>
                  <Text style={styles.addressText}>
                    {user?.personalData?.address?.street || 'Street'}
                  </Text>
                </View>
                <View style={[styles?.selectContainer]}>
                  <Text style={styles?.addressText}>
                    {user?.personalData?.address?.city || 'City'}
                  </Text>
                </View>
                <View style={[styles?.selectContainer]}>
                  <Text style={styles?.addressText}>
                    {user?.personalData?.address?.postalCode || 'Postal code'}
                  </Text>
                </View>
                {/* <View style={[styles?.selectContainer]}>
                  <Text style={styles?.addressText}>
                    {user?.personalData?.address?.state || "State"}
                  </Text>
                </View> */}
                <View style={[styles?.selectContainer]}>
                  <Text style={styles?.addressText}>
                    {user?.personalData?.address?.country || 'Country'}
                  </Text>
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
                  keyboardAppearance={
                    Colors.Background_color === "#F5F5F5" ? "light" : "dark"
                  }
                  style={[styles.textAreaInput]}
                  multiline={true}
                  onChangeText={setDescription}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={
                    "Write a brief bio to help others get to know you..."
                  }
                  value={user?.about}
                  editable={false}
                /> */}
                <Markdown style={styles.markdownStyle}>
                  {autoLinkify(user?.about)}
                </Markdown>
              </View>
            </View>
          </View>
          {edit ? (
            <View style={styles.btnArea}>
              <MyButton
                title={'Cancel'}
                bg={'rgba(39, 172, 31, 0.1)'}
                colour={Colors.Primary}
              />
              <MyButton
                title={'Save'}
                bg={Colors.Primary}
                colour={Colors.PureWhite}
              />
            </View>
          ) : null}

          {/* <View style={{ marginBottom: responsiveScreenHeight(2) }}></View> */}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.BodyText,
        fontFamily: CustomFonts.MEDIUM,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
        // backgroundColor: "yellow",
        minHeight: 100,
        fontSize: RegularFonts.HS,
      },
      heading1: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        flex: 1,
        width: responsiveScreenWidth(73),
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.Primary,
        // marginBottom: 100,
        textDecorationLine: 'none',
      },
      blockquote: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
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
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(1),
      justifyContent: 'space-between',
      width: responsiveScreenWidth(100),
      alignItems: 'center',
      // backgroundColor: "red",
    },
    topArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrowStyle: {
      // marginTop: responsiveScreenHeight(0.3),
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
    },
    myProfile: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      marginRight: responsiveScreenWidth(12),
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
      marginTop: responsiveScreenHeight(0.5),
      marginBottom: responsiveScreenHeight(2),
    },

    bioContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2.5),
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
    addressText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
      textTransform: 'capitalize',
    },
    selectContainer: {
      flex: 1,
      height: responsiveScreenHeight(6),
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
      justifyContent: 'space-between',
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.Background_color,
    },
    textInput: {
      width: '100%',
      marginLeft: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      textAlign: 'justify',
      // backgroundColor: "red",
      flex: 1,
    },
    textAreaInput: {
      marginLeft: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      textAlign: 'justify',
      paddingVertical: responsiveScreenHeight(1),
      textAlignVertical: 'top',
      minHeight: responsiveScreenHeight(10),
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
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      flexBasis: '80%',
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
      top: 72,
      zIndex: 3,
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
      top: 143,
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
  });
