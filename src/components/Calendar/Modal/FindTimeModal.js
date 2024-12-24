import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import ReactNativeModal from 'react-native-modal';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../../context/ThemeContext';
import axiosInstance from '../../../utility/axiosInstance';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import moment from 'moment';

const FindTimeModal = ({
  isModalVisible,
  toggleModal,
  schedule,
  handleCheckboxToggle,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <ReactNativeModal isVisible={isModalVisible}>
      <View style={styles.container}>
        <ModalBackAndCrossButton toggleModal={() => toggleModal(false)} />
        {schedule[0]?.intervals?.length > 0 ? (
          schedule[0]?.intervals?.map(item => (
            <View style={styles.timeContainer} key={item?._id}>
              <TouchableOpacity style={styles.subTimeDateContainer}>
                <Text style={styles.timeDateText}>
                  {moment(item?.from, 'HH:mm').format('hh:mm A')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subTimeDateContainer}>
                <Text style={styles.timeDateText}>
                  {moment(item?.to, 'HH:mm').format('hh:mm A')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCheckboxToggle(schedule[1]);
                  toggleModal(false);
                }}
                style={styles.subTimeDateContainer}>
                <Text style={styles.timeDateText}>Invite</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <NoDataAvailable />
        )}
      </View>
    </ReactNativeModal>
  );
};

export default FindTimeModal;

const getStyles = Colors =>
  StyleSheet.create({
    timeContainer: {
      paddingVertical: responsiveScreenHeight(1),
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      // backgroundColor: "red",
      minHeight: 200,
    },
    timeDateText: {
      color: 'rgba(39, 172, 31, 1)',
    },
    subTimeDateContainer: {
      backgroundColor: Colors.ModalBoxColor,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 4,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overFlow: 'hidden',
    },
    container: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      maxHeight: responsiveScreenHeight(80),
      padding: 20,
    },
  });
