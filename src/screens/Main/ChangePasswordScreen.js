import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {useDispatch} from 'react-redux';

import CustomFonts from '../../constants/CustomFonts';
import DarkPasswordField from '../../components/DarkPasswordField';
import MyButton from '../../components/AuthenticationCom/MyButton';
import axiosInstance from '../../utility/axiosInstance';
import {useTheme} from '../../context/ThemeContext';
import {logout} from '../../store/reducer/authReducer';
import {useGlobalAlert} from '../../components/SharedComponent/GlobalAlertContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../../assets/Icons/ArrowLeft';

export default function ChangePasswordScreen() {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {showAlert} = useGlobalAlert();
  const [currentPassError, setCurrentPassError] = useState('');
  const [newPassError, setNewPassError] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');
  const {top} = useSafeAreaInsets();

  const [data, setData] = React.useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
    isValidPassword: true,
    isValidConfirmPassword: true,
  });
  const signOut = async () => {
    await AsyncStorage.removeItem('user_token');
    dispatch(logout());
  };
  handleCurrentPasswordChange;
  const handleCurrentPasswordChange = val => {
    if (val.trim()?.length >= 8) {
      setData({
        ...data,
        currentPassword: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        currentPassword: val,
        isValidPassword: false,
      });
    }
  };
  const handlePasswordChange = val => {
    if (val.trim()?.length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const handleConfirmPasswordChange = val => {
    if (val.trim()?.length >= 8) {
      setData({
        ...data,
        confirmPassword: val,
        isValidConfirmPassword: true,
      });
    } else {
      setData({
        ...data,
        confirmPassword: val,
        isValidConfirmPassword: false,
      });
    }
  };
  const handlePasswordSave = () => {
    setCurrentPassError('');
    setConfirmPassError('');
    setNewPassError('');
    if (!data.currentPassword) {
      setCurrentPassError('Please enter your current password');
    }
    if (!data.password) {
      setNewPassError('Please enter your new password');
    }
    if (!data.confirmPassword) {
      setConfirmPassError('Please enter your confirm password');
    }
    if (data.password !== data.confirmPassword) {
      setConfirmPassError('Confirm password does not match');
    }
    if (data.currentPassword && data.password && data.confirmPassword) {
      if (data.password === data.confirmPassword) {
        axiosInstance
          .patch('/user/changepassword', {
            currentPassword: data.currentPassword,
            newPassword: data.password,
            confirmPassword: data.confirmPassword,
          })
          .then(async res => {
            console.log(res);
            showAlert({
              title: 'Password changed successfully',
              type: 'success',
              message:
                'You successfully changed your password. Please login again',
            });
            signOut();
          })
          .catch(err => {
            console.log('resetPassword', err);
            setCurrentPassError('Incorrect current password');
            // alert("Write your recent password");
            // showAlert({
            //   title: "Write your recent password",
            //   type: "warning",
            //   message: "Write your recent password",
            // });
          });
      }
    }
  };
  const handleCancel = () => {
    navigation.navigate('ChangePasswordScreen');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topContainer, {paddingTop: top}]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.topArrowContainer}>
          <ArrowLeft />
          <Text style={styles.topText}>Back</Text>
        </TouchableOpacity>
      </View>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.White}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />

      <ScrollView>
        <View>
          <Text style={styles.title}>Change Password</Text>
        </View>
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.heading}>Update your password</Text>
            {/* <Text>You Changed Password on February 20, 2024</Text> */}
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <DarkPasswordField
              title="Current Password"
              setText={val => handleCurrentPasswordChange(val)}
              placeholder="Enter current password"
              iconName="lock"
              bottomDetails="Write current password"
              errorText={currentPassError}
              isValidPassword={data.isValidPassword}
              isRequire={true}
            />
            <DarkPasswordField
              title="New Password"
              setText={val => handlePasswordChange(val)}
              placeholder="Enter new password"
              iconName="lock"
              bottomDetails="Must be at least 8 characters"
              errorText={newPassError}
              isValidPassword={data.isValidPassword}
              isRequire={true}
            />
            <DarkPasswordField
              title="Confirm Password"
              setText={val => handleConfirmPasswordChange(val)}
              placeholder="Enter confirm password"
              iconName="lock"
              bottomDetails="Must be the same as above password"
              errorText={confirmPassError}
              isValidPassword={data.isValidPassword}
              isRequire={true}
            />

            <View style={styles.btnArea}>
              <MyButton
                onPress={() => {
                  navigation.goBack();
                }}
                title={'Cancel'}
                bg={'rgba(39, 172, 31, 0.1)'}
                colour={Colors.Primary}
              />
              <MyButton
                onPress={handlePasswordSave}
                title={'Update'}
                bg={Colors.Primary}
                colour={Colors.PureWhite}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      // paddingHorizontal: responsiveScreenWidth(5),
      // paddingVertical: responsiveScreenHeight(2),
    },
    topContainer: {
      backgroundColor: Colors.White,
      paddingBottom: 10,
      paddingHorizontal: responsiveScreenWidth(4),
    },
    topArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    topText: {
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    arrowStyle: {
      marginTop: responsiveScreenHeight(0.3),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      paddingTop: responsiveScreenHeight(3),
      paddingLeft: responsiveScreenWidth(5),
    },
    heading: {
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(3),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(0),
    },
    itemContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(2),
      backgroundColor: Colors.White,
      paddingVertical: responsiveScreenHeight(3),
      borderRadius: responsiveScreenWidth(2),
    },
    btnArea: {
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(5),
      gap: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(2),
    },
  });
