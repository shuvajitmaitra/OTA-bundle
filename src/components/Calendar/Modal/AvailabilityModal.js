import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import CopySmallIcon from '../../../assets/Icons/CopySmallIcon';
import RedCross from '../../../assets/Icons/RedCorss';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import MyButton from '../../AuthenticationCom/MyButton';
import Plus from '../../../assets/Icons/Plus';
import ClockIcon from '../../../assets/Icons/ClockIcon';
import axiosInstance from '../../../utility/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import {
  addIntervals,
  removeIntervals,
  setAvailabilityData,
  toggleAvailabilitySwitch,
  updateBulkInterval,
  updateIntervalsTime,
} from '../../../store/reducer/calendarReducer';
import moment from 'moment-timezone';
import CustomTimePicker from '../../SharedComponent/CustomTimePicker';
import DateSpecificHour from '../DateSpecificHour';
import AddSpecificDateModal from './AddSpecificDateModal';
import ApplyIntervalsModal from './ApplyIntervalsModal';
import Loading from '../../SharedComponent/Loading';
import Divider from '../../SharedComponent/Divider';
import {showAlertModal} from '../../../utility/commonFunction';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../../../assets/Icons/ArrowLeft';

const AvailabilityModal = React.memo(function AvailabilityModal({
  toggleAvailability,
  setIsAvailabilityVisible,
  isAvailabilityVisible,
}) {
  const {
    availabilities = [],
    availabilityData,
    specificHours,
  } = useSelector(state => state.calendar);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerState, setPickerState] = useState('dateTime');
  const [from, setFrom] = useState(moment().format('hh:mm A'));
  const [to, setTo] = useState(moment().format('hh:mm A'));

  const [indexes, setIndexes] = useState({});

  function getCurrentTimeZone() {
    const currentTimeZone = moment.tz.guess();
    const offset = moment.tz(currentTimeZone).format('Z');

    const timeZoneCities = {
      '-12:00': 'Baker Island',
      '-11:00': 'American Samoa, Midway Atoll',
      '-10:00': 'Hawaii, Tahiti',
      '-09:30': 'Marquesas Islands',
      '-09:00': 'Alaska, Gambier Islands',
      '-08:00': 'Los Angeles, Vancouver',
      '-07:00': 'Denver, Phoenix',
      '-06:00': 'Chicago, Mexico City',
      '-05:00': 'New York, Toronto',
      '-04:00': 'Santiago, Caracas',
      '-03:30': "St. John's",
      '-03:00': 'Buenos Aires, Sao Paulo',
      '-02:00': 'South Georgia/Sandwich Islands',
      '-01:00': 'Azores, Cape Verde',
      '+00:00': 'London, Lisbon',
      '+01:00': 'Berlin, Paris',
      '+02:00': 'Cairo, Johannesburg',
      '+03:00': 'Moscow, Riyadh',
      '+03:30': 'Tehran',
      '+04:00': 'Dubai, Baku',
      '+04:30': 'Kabul',
      '+05:00': 'Karachi, Tashkent',
      '+05:30': 'Mumbai, New Delhi',
      '+05:45': 'Kathmandu',
      '+06:00': 'Astana, Dhaka',
      '+06:30': 'Yangon',
      '+07:00': 'Bangkok, Jakarta',
      '+08:00': 'Beijing, Singapore',
      '+08:45': 'Eucla',
      '+09:00': 'Tokyo, Seoul',
      '+09:30': 'Adelaide, Darwin',
      '+10:00': 'Sydney, Vladivostok',
      '+10:30': 'Lord Howe Island',
      '+11:00': 'Magadan, Solomon Islands',
      '+12:00': 'Auckland, Fiji',
      '+12:45': 'Chatham Islands',
      '+13:00': "Nuku'alofa, Tokelau",
      '+14:00': 'Kiritimati',
    };

    const displayCities = timeZoneCities[offset] || 'Unknown Location';

    const displayFormat = `(GMT${offset}) ${displayCities}`;
    return displayFormat;
  }

  const timeZone = getCurrentTimeZone();

  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [schedule, setSchedule] = useState(availabilityData?.name);
  const [applyIntervalsModal, setApplyIntervalsModal] = useState(false);
  const [copyIndex, setCopyIndex] = useState('');

  const toggleApplyIntervalsModal = useCallback(() => {
    setApplyIntervalsModal(pre => !pre);
  });

  const handleToggleChange = useCallback(
    index => {
      dispatch(toggleAvailabilitySwitch({index}));
    },
    [dispatch],
  );

  const [time, setTime] = useState(new Date());

  const [isSpecificHoursModalVisible, setIsSpecificHoursModalVisible] =
    useState(false);
  const toggleAddSpecificHoursModal = () => {
    setIsSpecificHoursModalVisible(pre => !pre);
  };

  const handleApplyButton = days => {
    dispatch(updateBulkInterval({days, index: copyIndex}));
    toggleApplyIntervalsModal();
  };

  const handleAddIntervals = useCallback(
    index => {
      dispatch(addIntervals({index}));
    },
    [dispatch],
  );

  const handleRemoveInterval = useCallback(
    (index, intervalIndex) => {
      dispatch(removeIntervals({index, intervalIndex}));
    },
    [dispatch],
  );

  const CustomSwitch = ({value, onValueChange}) => {
    return (
      <TouchableOpacity
        style={[styles.switch, value ? styles.switchOn : styles.switchOff]}
        onPress={onValueChange}>
        <View
          style={[
            styles.switchThumb,
            value ? styles.switchThumbOn : styles.switchThumbOff,
          ]}
        />
      </TouchableOpacity>
    );
  };

  const data = {
    name: schedule,
    availability: [...(availabilities || []), ...(specificHours || [])],
    timeZone: availabilityData?.timeZone,
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateAvailability = () => {
    if (!schedule) {
      return showAlertModal({
        title: 'Empty Name',
        type: 'warning',
        message: 'Name field is required.',
      });
    }
    setIsLoading(true);
    axiosInstance
      .patch(`calendar/schedule/update/${availabilityData._id}`, data)
      .then(res => {
        dispatch(setAvailabilityData(res?.data?.schedule));
        // Alert?.alert("Schedule updated!");
        showAlertModal({
          title: 'Schedule updated!',
          type: 'success',
          message: 'Schedule updated successfully',
        });
        setIsAvailabilityVisible(false);
        setIsLoading(false);
      })
      ?.catch(error => {
        console?.log(
          'error you got from availability modal',
          JSON?.stringify(error.response.data, null, 1),
        );
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (indexes?.index !== undefined) {
      dispatch(
        updateIntervalsTime({
          index: indexes?.index,
          intervalIndex: indexes?.intervalIndex,
          time: moment(time, 'hh:mm A').format('HH:mm'),
          period: indexes?.period,
        }),
      );
      setIndexes({});
      setTime(new Date());
    }
  }, [time, dispatch]);
  const {top} = useSafeAreaInsets();
  return (
    <Modal
      style={{margin: 0, padding: 0, backgroundColor: 'red'}}
      isVisible={isAvailabilityVisible}>
      {isLoading ? (
        <Loading backgroundColor={'transparent'} />
      ) : (
        <View style={[styles.modalContainer, {paddingTop: top}]}>
          <TouchableOpacity
            style={styles?.modalTop}
            onPress={toggleAvailability}>
            {/* <ModalBackAndCrossButton toggleModal={toggleAvailability} /> */}
            <ArrowLeft />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <>
            <ScrollView style={{zIndex: 10}}>
              <View style={styles?.modalBody}>
                <Text style={styles?.modalHeading}>Availability</Text>
                <Text style={styles?.modalSubHeading}>
                  You can select the available event date and time here.
                </Text>
                {/* Weekly hours */}
                <View style={[styles?.weekContainer, {zIndex: 100}]}>
                  <Text style={styles?.heading}>Weekly hours</Text>
                  <Divider marginBottom={-0.5} marginTop={1} />
                  <View>
                    <Text style={styles?.title}>Name</Text>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      style={styles?.input}
                      placeholderTextColor={Colors?.BodyText}
                      placeholder={'Write schedule name...'}
                      value={schedule}
                      onChangeText={text => setSchedule(text)}
                    />
                    <Text style={styles?.title}>Current Time Zone</Text>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      style={[styles.input]}
                      // placeholderTextColor={Colors?.BodyText}
                      placeholder={timeZone}
                      value={timeZone}
                      editable={false}
                    />
                  </View>
                  <Divider marginBottom={-0.5} marginTop={1} />

                  <View style={styles?.time}>
                    {availabilities?.map((item, index) => (
                      <View key={item?._id} style={styles?.row}>
                        <View
                          style={{
                            // marginTop: responsiveScreenHeight(1.5),
                            flex: item.intervals?.length ? 0.1 : 0.1,
                            // backgroundColor: "green",
                          }}>
                          <CustomSwitch
                            value={item?.intervals?.length > 0}
                            onValueChange={() => handleToggleChange(index)}
                          />
                        </View>
                        <Text
                          style={[
                            styles?.dayText,
                            {flex: item?.intervals?.length ? 0.1 : 0.1},
                          ]}>
                          {item?.wday?.slice(0, 3)}
                        </Text>
                        {item?.intervals?.length > 0 ? (
                          <View
                            style={{
                              flex: 0.8,
                              // backgroundColor: "blue",
                              flexDirection: 'row',
                            }}>
                            <View style={{flex: 0.9}}>
                              {item?.intervals?.map((item, intervalIndex) => {
                                return (
                                  <View
                                    style={styles?.iconContainer}
                                    key={item?._id}>
                                    <TouchableOpacity
                                      onPress={() => {
                                        setIndexes({
                                          index,
                                          intervalIndex,
                                          period: 'from',
                                        });

                                        setPickerState('time');
                                        setFrom(
                                          moment(item?.from, 'HH:mm')?.format(
                                            'hh:mm A',
                                          ),
                                        );
                                        setIsPickerVisible(true);
                                      }}
                                      style={styles?.timeBox}>
                                      <Text style={styles?.dropDownText}>
                                        {moment(item?.from, 'HH:mm')?.format(
                                          'hh:mm A',
                                        )}
                                      </Text>
                                      <ClockIcon />
                                    </TouchableOpacity>
                                    <View
                                      style={{
                                        flex: 0.1,
                                        alignItems: 'center',
                                      }}>
                                      <Text style={styles?.to}>to</Text>
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => {
                                        setIndexes({
                                          index,
                                          intervalIndex,
                                          period: 'to',
                                        });
                                        setPickerState('time');
                                        setTo(
                                          moment(item?.to, 'HH:mm')?.format(
                                            'hh:mm A',
                                          ),
                                        );
                                        setIsPickerVisible(true);
                                      }}
                                      style={styles?.timeBox}>
                                      <Text style={styles?.dropDownText}>
                                        {moment(item?.to, 'HH:mm')?.format(
                                          'hh:mm A',
                                        )}
                                      </Text>
                                      <ClockIcon />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={styles.crossPlusButton}
                                      onPress={() => {
                                        handleRemoveInterval(
                                          index,
                                          intervalIndex,
                                        );
                                      }}>
                                      <RedCross />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={styles.crossPlusButton}
                                      onPress={() => {
                                        handleAddIntervals(index);
                                      }}>
                                      <Plus />
                                    </TouchableOpacity>
                                  </View>
                                );
                              })}
                            </View>

                            <TouchableOpacity
                              style={styles?.copy}
                              onPress={() => {
                                toggleApplyIntervalsModal();
                                setCopyIndex(index);
                              }}>
                              <CopySmallIcon
                                color={Colors.SecondaryButtonTextColor}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View
                            style={{
                              flex: 0.8,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 10,
                              // backgroundColor: "red",
                            }}>
                            <TextInput
                              style={styles?.unavailable}
                              placeholder="Unavailable"
                              placeholderTextColor={Colors?.BodyText}
                              keyboardAppearance={
                                Colors.Background_color === '#F5F5F5'
                                  ? 'light'
                                  : 'dark'
                              }
                              editable={false}
                              selectTextOnFocus={false}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                handleToggleChange(index);
                              }}
                              style={{}}>
                              <Plus />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>

                <DateSpecificHour
                  toggleAddSpecificHoursModal={toggleAddSpecificHoursModal}
                />

                <View style={styles?.send}>
                  <MyButton
                    onPress={() => {
                      handleUpdateAvailability();
                    }}
                    title={'Save'}
                    bg={Colors?.Primary}
                    colour={Colors?.PureWhite}
                  />
                </View>
              </View>

              <AddSpecificDateModal
                isSpecificHoursModalVisible={isSpecificHoursModalVisible}
                toggleAddSpecificHoursModal={toggleAddSpecificHoursModal}
              />
              <ApplyIntervalsModal
                applyIntervalsModal={applyIntervalsModal}
                toggleApplyIntervalsModal={toggleApplyIntervalsModal}
                handleApplyButton={handleApplyButton}
              />
            </ScrollView>

            <CustomTimePicker
              setTime={setTime}
              mode={pickerState}
              time={indexes.period == 'from' ? from : to}
              isPickerVisible={isPickerVisible}
              setIsPickerVisible={setIsPickerVisible}
            />
          </>
        </View>
      )}
      <GlobalAlertModal />
    </Modal>
  );
});

const getStyles = Colors =>
  StyleSheet?.create({
    crossPlusButton: {
      flex: 0.1,
    },
    to: {
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      // marginHorizontal: -3,
      // flex: 0÷.1,
      // backgroundColor: "yellow",
    },
    backButtonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    timeBox: {
      flex: 0.35,
      height: 30,
      // maxW: 85,
      backgroundColor: Colors?.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors?.BorderColor,
      borderRadius: 7,
      flexDirection: 'row',
      justifyContent: 'space-between',
      // flexWrap: "wrap",
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(1),
    },
    dateTimePickerContainer: {
      backgroundColor: Colors?.Background_color,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      position: 'absolute',

      // bottom: "90%",
      zIndex: 100,
    },
    dateTimePicker: {
      width: 200,
      height: 200,
    },

    dropDownText: {
      fontFamily: CustomFonts?.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.3),
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      // justifyContent: "flex-end",
      paddingHorizontal: responsiveScreenWidth(2),
    },
    modalContainer: {
      // maxHeight: responsiveScreenHeight(80),
      backgroundColor: Colors.White,
      // borderRadius: 10,
      paddingHorizontal: 10,
      paddingBottom: 40,
      // zIndex: -10,
      // position: "relative",
      // justifyContent: "center",
      // alignItems: "center",
      // width: responsiveScreenWidth(100)
    },
    modalBody: {
      // alignSelf: "center",
      // width: responsiveScreenWidth(88),
      // paddingVertical: responsiveScreenWidth(1),
      // backgroundColor: 'red',
    },
    modalHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.SEMI_BOLD,
      paddingHorizontal: responsiveScreenWidth(2),
    },
    modalSubHeading: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      paddingHorizontal: responsiveScreenWidth(2),
    },
    weekContainer: {
      paddingVertical: responsiveScreenWidth(4),
      paddingHorizontal: responsiveScreenWidth(2),
      backgroundColor: Colors.White,
      marginTop: responsiveScreenHeight(2),
    },
    heading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      // paddingBottom: responsiveScreenWidth(1.5),
      // borderBottomWidth: 1.5,
      // borderColor: Colors.BorderColor,
    },
    title: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      paddingTop: responsiveScreenHeight(1),
      paddingBottom: responsiveScreenHeight(1),
    },
    input: {
      color: Colors.BodyText,
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1),
    },
    field: {
      paddingBottom: responsiveScreenHeight(1.5),
      borderBottomWidth: 1.5,
      borderColor: Colors.BorderColor,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',

      gap: 5,
      marginBottom: responsiveScreenWidth(2),
      // backgroundColor: "red",
      flex: 1,
    },
    dayText: {
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      textTransform: 'capitalize',
      // marginTop: responsiveScreenHeight(0.5),

      // backgroundColor: "yellow",
      // marginTop: responsiveScreenHeight(1),
    },

    switch: {
      width: responsiveScreenWidth(6),
      height: responsiveScreenHeight(1.5),
      borderRadius: 20,
      justifyContent: 'center',
    },
    switchOn: {
      backgroundColor: Colors.Primary,
    },
    switchOff: {
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    switchThumb: {
      width: 12,
      height: 12,
      borderRadius: 16,
    },
    switchThumbOn: {
      backgroundColor: Colors.White,
      alignSelf: 'flex-end',
    },
    switchThumbOff: {
      backgroundColor: Colors.Primary,
      alignSelf: 'flex-start',
    },
    unavailable: {
      flex: 0.78,
      color: Colors.BodyText,
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(2),
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.REGULAR,
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenWidth(0.7),
    },
    time: {
      marginTop: responsiveScreenHeight(1.5),
      flex: 1,
      // backgroundColor: 'pink',
    },
    copy: {
      // backgroundColor: Colors.SecondaryButtonBackgroundColor,
      paddingVertical: 4,
      marginLeft: 4,
      borderRadius: 50,
      marginTop: responsiveScreenHeight(0.4),
      flex: 0.05,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      marginBottom: responsiveScreenHeight(0.5),
      // backgroundColor: 'blue',
    },
    btn: {
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      marginVertical: responsiveScreenHeight(2),
    },
    btnText: {
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },

    send: {
      marginVertical: responsiveScreenHeight(2),
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

export default AvailabilityModal;
