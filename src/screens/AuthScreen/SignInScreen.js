import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import validator from 'validator';
import {useTheme} from '../../context/ThemeContext';
import TopLogo from '../../components/AuthenticationCom/TopLogo';
import axiosInstance from '../../utility/axiosInstance';
import {useMainContext} from '../../context/MainContext';
import {storage} from '../../utility/mmkvInstance';
import EyeIcon from '../../assets/Icons/EyeIcon';
import EyeClose from '../../assets/Icons/EyeClose';
import {useGlobalAlert} from '../../components/SharedComponent/GlobalAlertContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RequireFieldStar from '../../constants/RequireFieldStar';

export default function SignInScreen({navigation}) {
  const {handleVerify} = useMainContext();
  const {showAlert} = useGlobalAlert();
  const [data, setData] = useState({
    email: '',
    password: '',
    isValidUser: false,
    isValidPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  // Validate email and update state
  const textInputChange = val => {
    const emailInput = val.toLowerCase();
    if (emailInput.trim() && validator.isEmail(emailInput)) {
      setData({...data, email: emailInput, isValidUser: true});
    } else {
      setData({...data, email: emailInput, isValidUser: false});
    }
  };

  // Handle password input and validation
  const handlePasswordChange = val => {
    if (val.trim().length >= 8) {
      setData({...data, password: val, isValidPassword: true});
    } else {
      setData({...data, password: val, isValidPassword: false});
    }
  };

  const handleSignin = async () => {
    if (!data.isValidUser || !data.isValidPassword) {
      return;
    }
    setIsLoading(true);
    try {
      const {data: responseData} = await axiosInstance.post('/user/login', {
        email: data.email,
        password: data.password,
      });

      const {success, token} = responseData;
      console.log('success', JSON.stringify(token, null, 1));

      if (success && token) {
        storage.set('user_token', `Bearer ${token}`);
        handleVerify();
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      showAlert({
        title: error.response?.data.error,
        type: 'warning',
        message: 'Please check your email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSignin = () => {
  //   console.log('data.email', JSON.stringify(data.email, null, 1));
  //   axios
  //     .post('/user/login', {
  //       email: data.email,
  //       password: data.password,
  //     })
  //     .then(res => {
  //       console.log('res.data', JSON.stringify(res.data, null, 1));
  //     })
  //     .catch(error => {
  //       console.log('error', JSON.stringify(error.response, null, 1));
  //     });
  // };
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: Colors.Background_color,
        paddingTop: top,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <StatusBar
            translucent
            backgroundColor={Colors.Background_color}
            barStyle={
              Colors.Background_color === '#F5F5F5'
                ? 'dark-content'
                : 'light-content'
            }
          />
          <TopLogo title={'Welcome!'} />
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Email
              <RequireFieldStar />
            </Text>
            <TextInput
              style={[
                styles.inputField,
                data.isValidUser || data.email.length === 0
                  ? styles.validInput
                  : styles.invalidInput,
              ]}
              placeholder="Enter email"
              placeholderTextColor={Colors.BodyText}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={textInputChange}
              value={data.email}
            />
            {!data.isValidUser && data.email !== '' && (
              <Text style={styles.errorMsg}>Please enter a valid email</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Password
              <RequireFieldStar />
            </Text>
            <View style={{position: 'relative'}}>
              <TextInput
                style={[
                  styles.inputField,
                  data.isValidPassword || data.password.length === 0
                    ? styles.validInput
                    : styles.invalidInput,
                ]}
                placeholder="Enter password"
                placeholderTextColor={Colors.BodyText}
                secureTextEntry={passwordVisible}
                onChangeText={handlePasswordChange}
                value={data.password}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(pre => !pre)}
                style={{position: 'absolute', right: 20, top: '44%'}}>
                {passwordVisible ? (
                  <EyeClose />
                ) : (
                  <EyeIcon color={Colors.BodyText} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordDetails}>
              Must be at least 8 characters
            </Text>
            {!data.isValidPassword && data.password !== '' && (
              <Text style={styles.errorMsg}>
                Password must be at least 8 characters
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.signinBtn,
              (!data.isValidUser || !data.isValidPassword) &&
                styles.disabledBtn,
            ]}
            onPress={handleSignin}
            disabled={!data.isValidUser || !data.isValidPassword || isLoading}
            activeOpacity={0.8}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.signinBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By clicking “Sign in”, you agree to our{' '}
            <TouchableOpacity
              onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
              <Text style={styles.termsLink}>
                Terms of Use and Privacy Policy.
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styling function for dynamic theme-based styles
const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(5),
    },
    inputContainer: {
      marginTop: responsiveScreenHeight(2),
    },
    inputLabel: {
      //   fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
    },
    inputField: {
      borderWidth: 1,
      overflow: 'hidden',
      borderRadius: 10,
      padding: responsiveScreenHeight(1.5),
      marginTop: responsiveScreenHeight(1),
      fontSize: responsiveScreenFontSize(2),
      //   fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    validInput: {
      borderColor: 'rgba(39, 172, 31, 1)',
    },
    invalidInput: {
      borderColor: 'red',
    },
    errorMsg: {
      color: 'red',
      fontSize: responsiveScreenFontSize(1.6),
      marginTop: responsiveScreenHeight(0.5),
    },
    passwordDetails: {
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1),
    },
    signinBtn: {
      marginTop: responsiveScreenHeight(3),
      backgroundColor: 'rgba(39, 172, 31, 1)',
      paddingVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      alignItems: 'center',
    },
    signinBtnText: {
      color: '#FFF',
      //   fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
    },
    disabledBtn: {
      backgroundColor: 'gray',
    },
    forgotPasswordLink: {
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(2),
      color: 'rgba(39, 172, 31, 1)',
      //   fontFamily: CustomFonts.MEDIUM,
      marginTop: responsiveScreenHeight(2),
    },
    terms: {
      width: responsiveScreenWidth(75),
      alignSelf: 'center',
      textAlign: 'center',
      marginTop: responsiveScreenHeight(3),
      color: Colors.BodyText,
      //   fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      marginBottom: responsiveScreenHeight(3),
    },
    termsLink: {
      color: 'rgba(39, 172, 31, 1)',
      marginTop: responsiveScreenHeight(1),
    },
  });
