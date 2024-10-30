import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import validator from 'validator';
import {useTheme} from '../../context/ThemeContext';
// import CustomeFonts from '../../constants/CustomeFonts';
import TopLogo from '../../components/AuthenticationCom/TopLogo';
import axiosInstance from '../../utility/axiosInstance';
import {useMainContext} from '../../context/MainContext';
import {storage} from '../../utility/mmkvInstance';

export default function SignInScreen({navigation}) {
  const {handleVerify} = useMainContext();
  // const dispatch = useDispatch();

  const [data, setData] = useState({
    email: '',
    password: '',
    isValidUser: false,
    isValidPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

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
      // Optionally, you can alert the user here
      return;
    }

    setIsLoading(true);

    console.log('data', JSON.stringify(data, null, 1));
    try {
      const response = await axiosInstance.post('/user/login', {
        email: data.email,
        password: data.password,
      });

      const {success, token} = response.data;
      // console.log('Login Success:', success);
      // console.log('Received Token:', token);

      if (success) {
        if (token) {
          storage.set('user_token', `Bearer ${token}`);
          handleVerify(true);
        } else {
          console.log('Token is undefined');
          // Optionally, handle the case where token is missing
        }
      } else {
        console.log('Login unsuccessful');
      }
    } catch (error) {
      console.log(
        'error.response.data',
        JSON.stringify(error.response?.data, null, 1),
      );
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
  return (
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
        <Text style={styles.inputLabel}>Email *</Text>
        <TextInput
          style={[
            styles.inputField,
            data.isValidUser ? styles.validInput : styles.invalidInput,
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

      {/* Password Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password *</Text>
        <TextInput
          style={[
            styles.inputField,
            data.isValidPassword ? styles.validInput : styles.invalidInput,
          ]}
          placeholder="Enter password"
          placeholderTextColor={Colors.BodyText}
          secureTextEntry={true}
          onChangeText={handlePasswordChange}
          value={data.password}
        />
        <Text style={styles.passwordDetails}>
          Must be at least 8 characters
        </Text>
        {!data.isValidPassword && data.password !== '' && (
          <Text style={styles.errorMsg}>
            Password must be at least 8 characters
          </Text>
        )}
      </View>

      {/* Sign-In Button */}
      <TouchableOpacity
        style={[
          styles.signinBtn,
          (!data.isValidUser || !data.isValidPassword) && styles.disabledBtn,
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

      {/* Forgot Password Link */}
      <TouchableOpacity
        // onPress={() => navigation.navigate('ForgotPasswordPage')}
        activeOpacity={0.6}>
        <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Terms and Conditions */}
      <Text style={styles.terms}>
        By clicking “Sign in”, you agree to our{' '}
        <TouchableOpacity
        // onPress={() => navigation.navigate('PrivacyPolicyScreen')}
        >
          <Text style={styles.termsLink}>Terms of Use and Privacy Policy.</Text>
        </TouchableOpacity>
      </Text>
    </View>
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
      //   fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
    },
    inputField: {
      borderWidth: 1,
      borderRadius: 10,
      padding: responsiveScreenHeight(1.5),
      marginTop: responsiveScreenHeight(1),
      fontSize: responsiveScreenFontSize(2),
      //   fontFamily: CustomeFonts.REGULAR,
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
      //   fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
    },
    disabledBtn: {
      backgroundColor: 'gray',
    },
    forgotPasswordLink: {
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(2),
      color: 'rgba(39, 172, 31, 1)',
      //   fontFamily: CustomeFonts.MEDIUM,
      marginTop: responsiveScreenHeight(2),
    },
    terms: {
      width: responsiveScreenWidth(75),
      alignSelf: 'center',
      textAlign: 'center',
      marginTop: responsiveScreenHeight(3),
      color: Colors.BodyText,
      //   fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      marginBottom: responsiveScreenHeight(3),
    },
    termsLink: {
      color: 'rgba(39, 172, 31, 1)',
      marginTop: responsiveScreenHeight(1),
    },
  });
