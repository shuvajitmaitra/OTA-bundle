import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import ImageView from 'react-native-image-viewing';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import Modal from 'react-native-modal';
import ModalBackAndCrossButton from '../../../components/ChatCom/Modal/ModalBackAndCrossButton';
import {Image} from 'react-native';
import {loadHolidays, loadWeekends} from '../../../actions/chat-noti';
import {useSelector} from 'react-redux';
import moment from 'moment';
import Images from '../../../constants/Images';
import {storage} from '../../../utility/mmkvInstance';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';

export default function HolidayModal({
  toggleHoliday,
  setIsHolidayVisible,
  isHolidayVisible,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const enroll = storage.getString('active_enrolment');
  let enrollId = JSON.parse(enroll)?._id;
  const [viewImage, setViewImage] = useState([]);
  const {holidays, weekends} = useSelector(state => state.calendar);
  const [selected, setSelected] = useState('holidays');
  useEffect(() => {
    loadHolidays();
    loadWeekends();
  }, []);

  const renderDate = (start, end) =>
    start === end
      ? moment(start).format('MMM DD')
      : moment(start).isSame(moment(end), 'month')
      ? `${moment(start).format('MMM DD')}-${moment(end).format('DD')}`
      : `${moment(start).format('MMM DD')}-${moment(end).format('MMM DD')}`;

  const renderDays = dateCount =>
    `${dateCount} ${dateCount === 1 ? 'day' : 'days'}`;

  const renderOffday = (start, end) =>
    start === end
      ? moment(start).format('ddd')
      : `${moment(start).format('ddd')} - ${moment(end).format('ddd')}`;

  const items = selected === 'holidays' ? holidays : weekends;
  const {top} = useSafeAreaInsets();
  return (
    <Modal
      style={{
        margin: 0,
        backgroundColor: Colors.White,
        // alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: top,
      }}
      isVisible={isHolidayVisible}>
      {/* <View style={styles.modalContainer}>
      </View> */}
      <ModalBackAndCrossButton
        containerStyle={{paddingHorizontal: 20}}
        toggleModal={toggleHoliday}
      />
      {/* <View style={styles.modalTop}></View> */}
      <View style={styles.headerContainer}>
        <Text style={styles.modalHeading}>
          Holidays - {new Date().getFullYear()}
        </Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setSelected('holidays')}
            style={[
              styles.holidayButtonContainer,
              selected === 'holidays' && styles.clickedStyle,
            ]}>
            <Text
              style={[
                styles.holidayButton,
                selected === 'holidays' && {color: Colors.PureWhite},
              ]}>
              Holidays
            </Text>
          </TouchableOpacity>
          {enrollId && (
            <TouchableOpacity
              style={[
                styles.holidayButtonContainer,
                selected === 'weekends' && styles.clickedStyle,
              ]}
              onPress={() => setSelected('weekends')}>
              <Text
                style={[
                  styles.holidayButton,
                  selected === 'weekends' && {color: Colors.PureWhite},
                ]}>
                Weekends
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.date}>Date</Text>
          <Text style={styles.days}>Day</Text>
          <Text style={[styles.offday]}>Offday</Text>
          <Text style={[styles.img]}>Image</Text>
          <Text style={styles.holiday}>Events</Text>
        </View>

        <ScrollView style={styles.dayContainer}>
          {items.length > 0 ? (
            items?.map((item, index) => (
              <View key={index} style={styles.day}>
                <Text style={styles.date}>
                  {renderDate(item.date.start, item.date.end)}
                </Text>
                <Text style={styles.days}>
                  {renderDays(item.dateCount) || null}
                </Text>
                <Text style={[styles.offday]}>
                  {renderOffday(item.date.start, item.date.end) || 'N/A'}
                </Text>
                <TouchableOpacity
                  onPress={() => setViewImage([{uri: item?.image}])}>
                  <Image
                    source={
                      item?.image
                        ? {
                            uri: item?.image,
                          }
                        : Images.DEFAULT_IMAGE
                    }
                    style={styles.img}
                  />
                </TouchableOpacity>
                <Text style={styles.holiday}>{item?.message || 'N/A'}</Text>
              </View>
            ))
          ) : (
            <View
              style={{
                height: responsiveScreenHeight(70),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NoDataAvailable />
            </View>
          )}
        </ScrollView>
        <ImageView
          images={viewImage}
          imageIndex={0}
          visible={viewImage?.length !== 0}
          onRequestClose={() => setViewImage([])}
        />
      </View>
    </Modal>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    holidayButtonContainer: {
      alignItems: 'center',
      borderRadius: 5,
    },
    clickedStyle: {
      borderRadius: 5,
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
    },
    holidayButton: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenHeight(1),
      borderRadius: 7,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      backgroundColor: Colors.Background_color,
      paddingVertical: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(2),
      gap: 10,
      borderRadius: 7,
    },
    date: {
      // backgroundColor: "red",
      width: responsiveScreenWidth(17),
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'left',
      paddingLeft: responsiveScreenWidth(1),
    },
    days: {
      // backgroundColor: "red",
      width: responsiveScreenWidth(15),
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'left',
      paddingLeft: responsiveScreenWidth(1),
    },
    offday: {
      // backgroundColor: "red",
      width: responsiveScreenWidth(11),
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'left',
      paddingLeft: responsiveScreenWidth(1),
    },
    holiday: {
      // backgroundColor: 'red',
      width: responsiveScreenWidth(23),
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'left',
      paddingLeft: responsiveScreenWidth(1),
    },
    img: {
      // backgroundColor: "red",
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'left',
      paddingLeft: responsiveScreenWidth(1),
      width: responsiveScreenWidth(10),
      height: responsiveScreenHeight(3),
      marginRight: responsiveScreenWidth(1),
      borderRadius: 5,
    },

    // modalTop: {
    //   // paddingVertical: responsiveScreenHeight(2),
    //   flexDirection: 'row',
    //   // // justifyContent: 'flex-end',
    //   // paddingHorizontal: 20,
    //   // width: '90%',
    //   // backgroundColor: Colors.Background_color,
    // },
    // modalContainer: {
    //   // width: responsiveScreenWidth(90),
    //   // minHeight: responsiveScreenHeight(50),
    //   // maxHeight: responsiveScreenHeight(80),
    //   // backgroundColor: Colors.White,
    //   // borderRadius: responsiveScreenWidth(3),
    //   // paddingHorizontal: 10,
    // },

    modalHeading: {
      color: Colors.Primary,
      fontSize: responsiveScreenFontSize(2.1),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    container: {
      paddingTop: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(2),
      marginHorizontal: 20,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(1),
      gap: 10,
    },

    dayContainer: {
      flexDirection: 'column',
      gap: responsiveScreenHeight(1.5),
      height: responsiveScreenHeight(70),
    },
    day: {
      backgroundColor: Colors.White,
      paddingLeft: responsiveScreenWidth(1.5),
      paddingVertical: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(1),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 15,
    },
  });
