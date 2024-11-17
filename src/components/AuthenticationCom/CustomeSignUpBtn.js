import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {Popover, usePopover} from 'react-native-modal-popover';

import CustomFonts from '../../constants/CustomFonts';
import AccountVerificationPage from '../../screens/Authentication/AccountVerificationPage';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';

export default function CustomeSignUpBtn({registerData, setRegisterErrors}) {
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [isLoading, setIsLoading] = useState(false);

  const [otpData, setOtpData] = useState(null);

  const handleRegister = () => {
    setRegisterErrors(null);
    setIsLoading(true);

    axiosInstance
      .post('/user/register', registerData)
      .then(res => {
        if (res.data.success) {
          setOtpData(res.data);
          openPopover();
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        err && err.response && setRegisterErrors(err.response.data?.error);
        setIsLoading(false);
      });
  };

  return (
    <TouchableOpacity
      style={styles.btnContainer}
      activeOpacity={0.7}
      ref={touchableRef}
      onPress={handleRegister}
      disabled={isLoading}>
      <View style={{flexDirection: 'row', gap: 10}}>
        {isLoading ? (
          <ActivityIndicator size={'small'} color={Colors.PureWhite} />
        ) : (
          <Text style={styles.btnText}>Create an account</Text>
        )}
        <Popover
          contentStyle={styles.popupContent}
          arrowStyle={styles.popupArrow}
          backgroundStyle={{backgroundColor: Colors.BackDropColor}}
          visible={popoverVisible}
          onClose={closePopover}
          fromRect={popoverAnchorRect}
          supportedOrientations={['portrait', 'landscape']}
          placement="top">
          <AccountVerificationPage
            otpData={otpData}
            closePopover={closePopover}
          />
        </Popover>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    btnContainer: {
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(5.5),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      marginTop: responsiveScreenHeight(2),
      borderRadius: 10,
    },
    btnText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
    },

    //Pop up view style
    popupContent: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
      width: responsiveScreenWidth(90),
      // height: responsiveScreenHeight(30),
      position: 'absolute',
      left: responsiveScreenWidth(0),
    },
    popupArrow: {
      marginTop: responsiveScreenHeight(5.5),
      borderTopColor: Colors.White,
      marginTop: responsiveScreenWidth(-2),
      zIndex: -1,
    },
  });
