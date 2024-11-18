import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveScreenHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';

import CustomFonts from '../../../constants/CustomFonts';
import PopupProgramItem from '../PopupProgramItem';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setEnrollment} from '../../../store/reducer/authReducer';
import {useTheme} from '../../../context/ThemeContext';
import ArrowLeft from '../../../assets/Icons/ArrowLeft';
import CrossIcon from '../../../assets/Icons/CrossIcon';
import {useMainContext} from '../../../context/MainContext';

const CustomeRightHeader = ({navigation, CustomButton, setModalOutside}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = React.useState(false);
  const {myEnrollments} = useSelector(state => state.auth);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (setModalOutside) {
      setModalOpen(true);
    }
  }, [setModalOutside]);

  const {} = useMainContext();

  const getActive = async () => {
    let activeE = await AsyncStorage.getItem('active_enrolment');
    if (activeE) {
      setActive(JSON.parse(activeE));
    }
  };

  useEffect(() => {
    getActive();
  }, [myEnrollments]);

  const handleSwitch = async enrollment => {
    dispatch(setEnrollment(enrollment));
    await AsyncStorage.setItem('active_enrolment', JSON.stringify(enrollment));
    getActive();
    ();

    // window.location.href = "/user/profile?tab=program";
    // Router.push("/user/profile?tab=program")
  };

  return (
    <>
      {CustomButton ? (
        <TouchableOpacity onPress={() => setModalOpen(true)}>
          <CustomButton />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            width: responsiveScreenWidth(25),
            backgroundColor: Colors.PrimaryButtonBackgroundColor,
            paddingVertical: responsiveScreenHeight(0.8),
            borderRadius: responsiveScreenWidth(1.5),
          }}
          onPress={() => setModalOpen(true)}>
          <Text style={styles.headerText}>Switch</Text>
        </TouchableOpacity>
      )}

      <Modal
        backdropColor={Colors.BackDropColor}
        style={styles.modal}
        isVisible={modalOpen}>
        <View style={styles.popupContainer}>
          <View style={styles.popupTopContainer}>
            <View style={styles.popupArrowContainer}>
              <ArrowLeft
                onPress={() => setModalOpen(false)}
                size={24}
                color="black"
              />
              <Text style={styles.popupTitle}>Program</Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalOpen(false)}
              activeOpacity={0.9}
              style={styles.popupCrossContainer}>
              <CrossIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.popupLine} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {myEnrollments &&
              myEnrollments.map((item, index) => (
                <PopupProgramItem
                  active={active}
                  key={index}
                  enrollment={item}
                  handleSwitch={handleSwitch}
                />
              ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};
const getStyles = Colors =>
  StyleSheet.create({
    headerText: {
      // fontSize: responsiveScreenFontSize(1.8),
      // color: Colors.Primary,
      // fontFamily: CustomFonts.SEMI_BOLD,
      // marginRight: responsiveScreenWidth(4),
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
      fontSize: responsiveFontSize(1.6),
    },

    modal: {
      // backgroundColor: Colors.White,
      // borderRadius: 15,
      // marginHorizontal: responsiveScreenWidth(4),
      // paddingHorizontal: responsiveScreenWidth(1),
    },
    popupContainer: {
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      backgroundColor: Colors.White,
      borderRadius: 15,
      width: responsiveScreenWidth(90),
      maxHeight: responsiveScreenHeight(80),
    },
    popupTopContainer: {
      flexDirection: 'row',
      marginHorizontal: responsiveScreenWidth(1),
      alignItems: 'center',
      justifyContent: 'space-between',
      height: responsiveScreenHeight(3.5),
    },
    popupArrowContainer: {
      flexDirection: 'row',
    },
    popupTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      marginLeft: responsiveScreenWidth(2),
      color: Colors.Heading,
    },
    popupCrossContainer: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      backgroundColor: Colors.BorderColor,
      borderRadius: 20,
      marginRight: responsiveScreenWidth(1),
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupLine: {
      width: responsiveScreenWidth(85),
      height: 2,
      backgroundColor: Colors.BorderColor,
      marginTop: responsiveScreenHeight(2),
      alignSelf: 'center',
    },
    btn: {
      width: responsiveScreenWidth(30),
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
    },
  });

export default CustomeRightHeader;
