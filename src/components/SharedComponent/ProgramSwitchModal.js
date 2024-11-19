import React, {memo, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setEnrollment} from '../../store/reducer/authReducer';
import {setProgramActive} from '../../store/reducer/programReducer';
import {useTheme} from '../../context/ThemeContext';
import PopupProgramItem from '../ProgramCom/PopupProgramItem';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CrossIcon from '../../assets/Icons/CrossIcon';
import ArrowLeft from '../../assets/Icons/ArrowLeft';

const ProgramSwitchModal = memo(({modalOpen, setModalOpen, handleVerify}) => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {myEnrollments} = useSelector(state => state.auth);
  const [active, setActive] = useState(null);
  // console.log(
  //   "myEnrollments.length",
  //   JSON.stringify(myEnrollments.length, null, 1)
  // );

  // const getActive = async () => {
  //   let activeE = await AsyncStorage.getItem('active_enrolment');
  //   if (activeE) {
  //     setActive(JSON.parse(activeE));
  //     dispatch(setProgramActive(JSON.parse(activeE)));
  //   }
  // };

  // useEffect(() => {
  //   getActive();
  // }, [myEnrollments]);

  // const handleSwitch = async enrollment => {
  //   dispatch(setEnrollment(enrollment));
  //   await AsyncStorage.setItem('active_enrolment', JSON.stringify(enrollment));
  //   getActive();
  //   handleVerify();
  // };

  return (
    <Modal
      backdropColor={Colors.BackDropColor}
      style={styles.modal}
      isVisible={modalOpen}>
      <View style={styles.popupContainer}>
        <View style={styles.popupTopContainer}>
          <View style={styles.popupArrowContainer}>
            <ArrowLeft />
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
          {myEnrollments.length ? (
            myEnrollments.map((item, index) => (
              <PopupProgramItem
                active={active}
                key={index}
                enrollment={item}
                handleSwitch={handleSwitch}
              />
            ))
          ) : (
            <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
              <Text style={styles.headingText}>
                Enrollment is not available
              </Text>
              <Text style={styles.bodyText}>
                Sorry, You have not enrolled at any Bootcamp yet. Please explore
                your Institutes website to enroll your preferred bootcamp!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
});

const getStyles = Colors =>
  StyleSheet.create({
    headingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.8),
      color: Colors.Heading,
      textAlign: 'center',
    },
    bodyText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
      textAlign: 'center',
      marginHorizontal: responsiveScreenWidth(4),
      lineHeight: responsiveScreenHeight(3),
    },
    modal: {
      // marginHorizontal: responsiveScreenWidth(4),
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
      alignItems: 'center',
      justifyContent: 'space-between',
      height: responsiveScreenHeight(3.5),
    },
    popupArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    popupTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      marginLeft: responsiveScreenWidth(2),
      color: Colors.BodyText,
    },
    popupCrossContainer: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupLine: {
      width: responsiveScreenWidth(85),
      height: 2,
      backgroundColor: Colors.BorderColor,
      marginTop: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(1),
      alignSelf: 'center',
    },
  });

export default ProgramSwitchModal;
