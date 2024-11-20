import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import CustomDropDownTwo from '../../components/SharedComponent/CustomDropDownTwo';
import MyButton from '../../components/AuthenticationCom/MyButton';
import CalenderIcon from '../../assets/Icons/CalenderIcon';
import SearchWhiteIcon from '../../assets/Icons/SearchWhiteIcon';
import EyeIcon from '../../assets/Icons/EyeIcon';
import axiosInstance from '../../utility/axiosInstance';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import moment from 'moment';
import Images from '../../constants/Images';
import {setTechnicalTest} from '../../store/reducer/TechnicalTestReducer';
import CustomTimePicker from '../../components/SharedComponent/CustomTimePicker';
import {formattingDate} from '../../utility/commonFunction';
import Loading from '../../components/SharedComponent/Loading';
import ReloadIcon from '../../assets/Icons/ReloadIcon';

export default function TechnicalTestScreen() {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {assignments} = useSelector(state => state.technicalTest);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarClicked, setIsCalendarClicked] = useState(false);
  const [date, setDate] = React.useState();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchId, setSearchId] = useState('');
  const [status, setStatus] = useState('');

  const fieldEmpty =
    selectedCategory || selectedType || searchId || date ? false : true;
  const testNowPage = questionNumber => {
    navigation.navigate('ProgramStack', {
      screen: 'TestNow',
      params: {data: assignments, questionNumber},
    });
  };

  const getStatusStyle = status => {
    switch (status) {
      case 'Not Answered':
        return {color: '#097EF2'};
      case 'accepted':
        return {color: '#27AC1F'};
      case 'pending':
        return {color: '#FF9900'};
      case 'rejected':
        return {color: '#F34141'};
      default:
        return {color: 'black'};
    }
  };

  useEffect(() => {
    // setIsLoading(true);
    axiosInstance
      .post('/assignment/myassignments')
      .then(res => {
        if (res.data.success) {
          dispatch(setTechnicalTest(res.data.assignments));
        }
        // setIsLoading(false);
      })
      .catch(error => {
        console.log(
          'error you got assignment and myassingment',
          JSON.stringify(error.response.data, null, 1),
        );
        // setIsLoading(false);
      });
  }, []);
  // if (isLoading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: Colors.White,
  //       }}
  //     >
  //       <ActivityIndicator color={Colors.Primary} size={40} />
  //     </View>
  //   );
  // }
  const showCalendar = () => {
    setIsCalendarClicked(true);
  };

  const statusOptions = ['Accepted', 'Pending', 'Rejected'];
  const categoryOptions = [
    'Technical Task',
    'Technical Assignment',
    'Technical Questions',
  ];
  const typeOptions = ['Answered', 'Not Answered'];
  const category =
    (selectedCategory === 'Technical Task' && 'task') ||
    (selectedCategory === 'Technical Assignment' && 'assignment') ||
    (selectedCategory === 'Technical Questions' && 'question') ||
    '';
  const selectedStatus =
    (status === 'Accepted' && 'accepted') ||
    (status === 'Rejected' && 'rejected') ||
    (status === 'Pending' && 'pending') ||
    '';
  const type =
    (selectedType === 'Answered' && 'answered') ||
    (selectedType === 'Not Answered' && 'notanswered') ||
    '';
  const searchData = {
    category,
    limit: 50,
    page: 1,
    query: searchId,
    status: selectedStatus,
    type,
    workshop: date,
  };

  const handleSearch = () => {
    console.log('searchId', JSON.stringify(searchData, null, 1));
    setIsLoading(true);

    axiosInstance
      .post('/assignment/myassignments', searchData)
      .then(res => {
        console.log('res.data', JSON.stringify(res.data, null, 1));
        if (res.data.success) {
          dispatch(setTechnicalTest(res.data.assignments));
          setDate('');
          setSelectedCategory('');
          setSelectedType('');
          setStatus('');
          setSearchId('');
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(
          'error you got /assignment/myassignments',
          JSON.stringify(error.response.data, null, 1),
        );
        setIsLoading(false);
      });
  };
  // console.log("assignments", JSON.stringify(assignments, null, 1));

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />

      <ScrollView>
        {/* -------------------------- */}
        {/* ----------- top section ----------- */}
        {/* -------------------------- */}
        <View style={styles.headingContainer}>
          <Text style={styles.title}>Technical Test</Text>
          <Text style={styles.text}>
            View all Technical Tests related to my program
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProgramStack', {
                screen: 'ViewStatus',
                params: {assignments},
              });
            }}
            style={styles.viewBtn}>
            <EyeIcon color={Colors.PureWhite} style={styles.viewBtnText} />
            <Text style={styles.viewBtnText}>View Status</Text>
          </TouchableOpacity>
        </View>

        {/* -------------------------- */}
        {/* -----------  ----------- */}
        {/* -------------------------- */}
        <View style={styles.itemContainer}>
          <Text style={styles.allTitle}>All Technical Test</Text>
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                style={styles.input}
                placeholder="Search Id"
                placeholderTextColor={Colors.BodyText}
                value={searchId}
                onChangeText={text => setSearchId(text)}
              />
              <CustomDropDownTwo
                flex={0.87}
                placeholder={'Category'}
                data={categoryOptions}
                state={selectedCategory}
                setState={setSelectedCategory}
              />
            </View>
            <View style={styles.inputContainer2}>
              <View style={{zIndex: 10, flex: 0.87}}>
                <CustomDropDownTwo
                  flex={1}
                  placeholder={'Type'}
                  data={typeOptions}
                  state={selectedType}
                  setState={setSelectedType}
                />
              </View>
              <TouchableOpacity
                onPress={() => showCalendar()}
                activeOpacity={0.5}
                style={[styles.input]}>
                {/* <TextInput
                  style={styles.input2}
                  placeholder="Workshop"
                  placeholderTextColor={Colors.BodyText}
                  value={searchWorkshop}
                  onChangeText={setSearchWorkshop}
                /> */}
                <Text style={styles.input2}>
                  {date ? moment(date).format('D MMM, YYYY') : 'Workshop'}
                </Text>
                <CalenderIcon size={18} color={Colors.BodyText} />
              </TouchableOpacity>
            </View>
            {selectedType == 'Answered' ? (
              <View
                style={{
                  marginBottom: responsiveScreenHeight(1.5),
                  zIndex: 1,
                }}>
                <CustomDropDownTwo
                  flex={1}
                  placeholder={'All Status'}
                  width={86}
                  data={statusOptions}
                  state={status}
                  setState={setStatus}
                />
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  fieldEmpty ? null : handleSearch();
                }}
                style={[
                  styles.searchBtn,
                  fieldEmpty && {
                    backgroundColor: Colors.DisablePrimaryBackgroundColor,
                  },
                ]}
                disabled={fieldEmpty}>
                <SearchWhiteIcon
                  color={fieldEmpty && Colors.DisablePrimaryButtonTextColor}
                />
                <Text
                  style={[
                    styles.viewBtnText,
                    fieldEmpty && {
                      color: Colors.DisablePrimaryButtonTextColor,
                    },
                  ]}>
                  Search
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleSearch();
                }}
                style={[
                  styles.searchBtn,
                  !fieldEmpty && {
                    backgroundColor: Colors.DisablePrimaryBackgroundColor,
                  },
                ]}
                disabled={!fieldEmpty}>
                <ReloadIcon
                  color={!fieldEmpty && Colors.DisablePrimaryButtonTextColor}
                />
                <Text
                  style={[
                    styles.viewBtnText,
                    !fieldEmpty && {
                      color: Colors.DisablePrimaryButtonTextColor,
                    },
                  ]}>
                  Reload
                </Text>
              </TouchableOpacity>
            </View>
            {isCalendarClicked && (
              <>
                {/* <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
              /> */}

                <CustomTimePicker
                  mode={'date'}
                  setDate={date =>
                    date ? setDate(new Date(date).toISOString()) : new Date()
                  }
                  isPickerVisible={isCalendarClicked}
                  setIsPickerVisible={setIsCalendarClicked}
                  showPreviousDate={true}
                />
              </>
            )}
          </View>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {assignments?.length > 0 ? (
                assignments?.map((item, index) => (
                  <View key={index} style={styles.technicalTestContainer}>
                    <View>
                      <View>
                        <Image
                          source={Images.TECHNICAL_TEST}
                          style={styles.imgStyle}
                        />
                      </View>

                      <View>
                        <Text style={styles.technicalTest}>
                          {/* {item.question} */}
                          {item.question?.length > 50
                            ? item.question.slice(0, 50) + '...'
                            : item.question}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.allDataContainer}>
                      <View style={styles.testDataHeading}>
                        <Text style={styles.marks}>ID:</Text>
                        <Text style={styles.marks}>Category:</Text>
                        <Text style={styles.marks}>Workshop:</Text>
                        <Text style={styles.marks}>Deadline:</Text>
                        <Text style={styles.marks}>Total Marks:</Text>
                        {item?.submission?.status && (
                          <Text style={styles.marks}>Status:</Text>
                        )}
                        {typeof item?.submission?.mark !== 'undefined' ? (
                          <Text style={styles.marks}>Obtained Mark:</Text>
                        ) : null}
                      </View>
                      <View style={styles.testDataHeadingText}>
                        <Text style={styles.number}>#{item?.id || 'N/A'}</Text>
                        <Text style={styles.number}>
                          {(item?.category === 'task' && 'Technical Task') ||
                            (item?.category === 'assignment' &&
                              'Technical Assignment') ||
                            (item?.category === 'question' &&
                              'Technical Questions') ||
                            item?.category}
                        </Text>
                        <Text style={styles.number}>
                          {/* {moment(item.workshop).format("D MMM, YYYY")} */}
                          {formattingDate(item.workshop)}
                        </Text>
                        <Text style={styles.number}>
                          {item?.dueDate
                            ? formattingDate(item?.dueDate)
                            : 'Not specified'}
                        </Text>
                        <Text style={styles.number}>{item?.mark}</Text>
                        {item?.submission?.status && (
                          <Text
                            style={[
                              styles.status,
                              getStatusStyle(item?.submission?.status),
                            ]}>
                            {item?.submission?.status}
                          </Text>
                        )}
                        {
                          <Text style={[styles.number]}>
                            {item?.submission?.mark == 0
                              ? 'No Mark'
                              : item?.submission?.mark}
                          </Text>
                        }
                      </View>
                    </View>

                    <View style={styles.btnArea}>
                      {item?.submission?.status ? (
                        <MyButton
                          onPress={() => testNowPage(index)}
                          title={'Update Answer'}
                          bg={Colors.Primary}
                          colour={Colors.PureWhite}
                          flex={1}
                        />
                      ) : (
                        <MyButton
                          onPress={() => testNowPage(index)}
                          title={'Answer'}
                          bg={Colors.Primary}
                          colour={Colors.PureWhite}
                          flex={1}
                        />
                      )}
                      {/* <MyButton
                    onPress={() => {}}
                    title={"See Result"}
                    bg={
                      item?.submission?.status === "pending"
                        ? Colors.DisableSecondaryBackgroundColor
                        : Colors.SecondaryButtonBackgroundColor
                    }
                    colour={
                      item?.submission?.status === "pending"
                        ? Colors.DisableSecondaryButtonTextColor
                        : Colors.SecondaryButtonTextColor
                    }
                  /> */}
                    </View>
                  </View>
                ))
              ) : (
                <NoDataAvailable />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    testDataHeadingText: {
      // backgroundColor: "black",
    },
    testDataHeading: {
      // backgroundColor: "yellow",
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      // paddingHorizontal: responsiveScreenWidth(5),
    },

    headingContainer: {
      paddingHorizontal: responsiveScreenWidth(5),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },

    allTitle: {
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      paddingBottom: responsiveScreenHeight(1),
    },
    heading: {
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(3),
      fontFamily: 'WorkSans_Regular',
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(2),
    },
    itemContainer: {
      width: responsiveScreenWidth(100),
      flex: 1,
      height: '100%',
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(2),
      backgroundColor: Colors.White,
      paddingVertical: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(3),
      borderRadius: responsiveScreenWidth(2),
    },

    technicalTestContainer: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(2),
      marginVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(2),
      zIndex: 1,
    },

    technicalTest: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.1),
      color: Colors.Heading,
      fontWeight: '600',
      paddingBottom: responsiveScreenHeight(1.8),
      paddingTop: responsiveScreenHeight(1),
    },
    allDataContainer: {
      backgroundColor: Colors.White,

      padding: responsiveScreenWidth(3),
      borderRadius: responsiveScreenWidth(2),
      flexDirection: 'row',
      // marginTop: responsiveScreenHeight(2)
    },
    dataContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    text: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      // paddingTop: responsiveScreenHeight(1),
      paddingBottom: responsiveScreenHeight(2),
      textAlign: 'left',
    },
    marks: {
      color: Colors.Heading,
      paddingBottom: responsiveScreenHeight(1),
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
      width: responsiveScreenWidth(28),
    },
    number: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      paddingBottom: responsiveScreenHeight(1),
    },
    status: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),

      paddingBottom: responsiveScreenHeight(1),
      textTransform: 'capitalize',
    },
    btnArea: {
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(0.5),
      gap: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(2),
    },
    viewBtnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.PureWhite,
    },
    viewBtn: {
      width: responsiveScreenWidth(35),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchContainer: {
      backgroundColor: Colors.Background_color,
      padding: responsiveScreenWidth(4),
      borderRadius: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(1),
      // height: responsiveScreenHeight(30)
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 3,
    },
    inputContainer2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: responsiveScreenHeight(1.5),
      zIndex: 2,
    },

    input: {
      color: Colors.BodyText,
      width: responsiveScreenWidth(40),
      zIndex: -3,
      paddingHorizontal: responsiveScreenWidth(3),
      minHeight: responsiveScreenHeight(2),
      backgroundColor: Colors.White,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      fontFamily: CustomFonts.REGULAR,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: responsiveScreenFontSize(2),
    },
    input2: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      flex: 1,
      zIndex: -2,
      fontSize: responsiveScreenFontSize(2),
    },
    searchBtn: {
      width: responsiveScreenWidth(40),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
    imgStyle: {
      width: 60,
      height: 60,
    },
  });
