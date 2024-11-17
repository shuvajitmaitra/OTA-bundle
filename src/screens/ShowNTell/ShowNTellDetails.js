import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import Markdown from 'react-native-markdown-display';
import {useSelector} from 'react-redux';
import DoubleArrowLeft from '../../assets/Icons/DoubleArrowLeftIcon';
import DoubleArrowRightIcon from '../../assets/Icons/DoubleArrowRightIcon';
import {getFileTypeFromUri} from '../../components/TechnicalTestCom/TestNow';
import {extractFilename, handleOpenLink} from '../../components/HelperFunction';
import DownloadIconTwo from '../../assets/Icons/DownloadIconTwo';
import Divider from '../../components/SharedComponent/Divider';
import BackNextButton from '../../components/SharedComponent/BackNextButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {formattingDate} from '../../utility/commonFunction';

const ShowNTellDetails = ({route}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [dataIndex, setDataIndex] = useState(route?.params?.index || 0);
  const {showNTell} = useSelector(state => state.showNTell);

  const [imageNumber, setImageNumber] = useState(0);

  const data = showNTell[dataIndex];
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.White}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />

      <ScrollView contentContainerStyle={{flex: 1}}>
        {/* -------------
                  -----------top section--------
                  ------------------------------------ */}
        <View style={styles.testContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.title}>Show N Tell</Text>
            {showNTell?.length > 1 && (
              <BackNextButton
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                length={showNTell.length}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'green',
              position: 'relative',
            }}>
            {imageNumber > 0 && data?.attachments?.length > 1 ? (
              <TouchableOpacity
                onPress={() => setImageNumber(imageNumber - 1)}
                style={{
                  position: 'absolute',
                  left: responsiveScreenWidth(-5),
                  zIndex: 1,
                }}>
                <DoubleArrowLeft />
              </TouchableOpacity>
            ) : null}
            {getFileTypeFromUri(data?.attachments[imageNumber]) == 'image' ? (
              <Image
                style={styles.image}
                source={{uri: data?.attachments[imageNumber]}}
              />
            ) : getFileTypeFromUri(data?.attachments[imageNumber]) == 'pdf' ? (
              <>
                <Image
                  style={styles.image}
                  resizeMode="repeat"
                  source={require(`../../assets/Images/placeholder-pdf.png`)}
                />
                <View style={styles.fileNameContainer}>
                  <Image
                    style={styles.pdfIcon}
                    source={require(`../../assets/Images/pdfIcon.png`)}
                  />
                  <Text style={styles.fileName}>
                    {extractFilename(data?.attachments[imageNumber])}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleOpenLink(data?.attachments[imageNumber])}
                  style={styles.downloadIcon}>
                  <Text style={styles.downloadText}>Download PDF</Text>
                  <DownloadIconTwo />
                </TouchableOpacity>
              </>
            ) : getFileTypeFromUri(data?.attachments[imageNumber]) ==
              'document' ? (
              <>
                <Image
                  resizeMode="repeat"
                  style={styles.image}
                  source={require(`../../assets/Images/placeholder-doc.png`)}
                />
                <View style={styles.fileNameContainer}>
                  <Image
                    style={styles.pdfIcon}
                    source={require(`../../assets/Images/google-docs.png`)}
                  />
                  <Text style={styles.fileName}>
                    {extractFilename(data?.attachments[imageNumber])}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleOpenLink(data?.attachments[imageNumber])}
                  style={styles.downloadIconDoc}>
                  {/* <DownloadIconTwo color={Colors.PureGray} size={30} /> */}
                  <Text style={styles.downloadTextDoc}>Download DOC</Text>
                  <DownloadIconTwo />
                </TouchableOpacity>
              </>
            ) : (
              <Image
                resizeMode="cover"
                style={styles.image}
                source={require(`../../assets/Images/placeholder-default.png`)}
              />
            )}

            {imageNumber < data?.attachments?.length - 1 &&
            data?.attachments?.length > 1 ? (
              <TouchableOpacity
                onPress={() => setImageNumber(imageNumber + 1)}
                style={{
                  position: 'absolute',
                  right: responsiveScreenWidth(-5),
                  zIndex: 1,
                }}>
                <DoubleArrowRightIcon />
              </TouchableOpacity>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.titleText}>{data?.title}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Date:</Text>
            <Text style={styles.statusText}>
              {/* {moment(data?.createdAt).format("DD MMM, YYYY")}
               */}
              {formattingDate(data?.createdAt)}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Status:</Text>
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    data?.status === 'accepted'
                      ? Colors.Primary
                      : data?.status === 'pending'
                      ? Colors.PureYellow
                      : data?.status === 'rejected'
                      ? Colors.Red
                      : Colors.BodyText,
                },
              ]}>
              {data?.status}
            </Text>
          </View>
          {/* <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Created By:</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
              >
                <Image
                  style={styles.imageSmall}
                  source={{ uri: data?.users?.profilePicture }}
                />
                <Text style={styles.statusText}>
                  {data?.users[0]?.fullName}
                </Text>
              </View>
            </View> */}
          <Divider marginBottom={1} marginTop={1} />
          <Text style={styles.agendaText}>Agenda:</Text>
          <View style={styles.markdownContainer}>
            <Markdown style={styles.markdownStyle}>{data?.agenda}</Markdown>
          </View>
          {/* <View style={styles.line}></View> */}

          {/* -------------
                      -----------Report section--------
                      ------------------------------------ */}
          {/* <View>
              <Text style={styles.reportTitle}>Comments</Text>
              <View style={styles.reportContainer}>
                <Image
                  source={{
                    uri: "https://shorturl.at/qAKW6",
                  }}
                  style={styles.imgStyle}
                />

                <TextInput    keyboardAppearance={
            Colors.Background_color === "#F5F5F5" ? "light" : "dark"
          }
                  style={styles.report}
                  placeholderTextColor={Colors.Heading}
                  multiline={true}
                  placeholder="Typo, grammatical issue, etc..."
                />
              </View>
              <View style={styles.reportSubmit}>
                <TouchableOpacity onPress={() => {}} style={styles.reportBtn}>
                  <Text style={styles.reportBtnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShowNTellDetails;

const getStyles = Colors =>
  StyleSheet.create({
    agendaText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },
    downloadIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderColor: 'red',
      borderWidth: 1,
      position: 'absolute',
      top: responsiveScreenHeight(12),
      backgroundColor: Colors.PureWhite,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 7,
    },
    downloadIconDoc: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderColor: '#3386F9',
      borderWidth: 1,
      position: 'absolute',
      top: responsiveScreenHeight(12),
      backgroundColor: Colors.PureWhite,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 7,
    },
    fileName: {
      fontFamily: CustomFonts.MEDIUM,
      alignItems: 'center',
      color: '#333333',
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(3),
    },
    editIcon: {
      backgroundColor: Colors.PrimaryOpacityColor,
      padding: 7,
      borderRadius: 5,
    },
    deleteIcon: {
      backgroundColor: Colors.LightRed,
      padding: 7,
      borderRadius: 5,
    },
    imageSmall: {
      width: 20,
      height: 20,
      borderRadius: 100,
    },
    markdownContainer: {
      // backgroundColor: "red",
      //   marginTop: responsiveScreenHeight(2),
      paddingRight: responsiveScreenWidth(2),
    },
    pdfIcon: {
      width: 40,
      height: 40,
    },
    markdownStyle: {
      body: {
        color: Colors.BodyText,
        // fontSize: 16,

        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
      },
      heading1: {
        fontSize: 24,
        color: '#000',
        marginBottom: 10,
      },
      heading2: {
        fontSize: 20,
        color: '#000',
        marginBottom: 8,
      },
      heading3: {
        fontSize: 18,
        color: '#000',
        marginBottom: 6,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        color: Colors.Primary,
        // marginBottom: 100,
      },
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
    },
    statusText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    statusTitle: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: responsiveScreenHeight(0.5),
    },
    titleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Primary,
      flex: 1,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: responsiveScreenHeight(2),
      backgroundColor: Colors.BodyTextOpacity,
    },
    contain: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(5),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      width: '50%',
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    testContainer: {
      backgroundColor: Colors.White,
      padding: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(2),
      borderRadius: responsiveScreenWidth(3),
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: responsiveScreenHeight(3),
    },

    line: {
      marginBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      width: '100%',
      alignSelf: 'center',
    },
    reportTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    reportContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      marginVertical: responsiveScreenHeight(1),
    },
    imgStyle: {
      width: 40,
      height: 40,
      borderRadius: responsiveScreenWidth(50),
    },
    report: {
      color: Colors.Heading,
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      textAlignVertical: 'top',

      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      fontFamily: CustomFonts.REGULAR,
      height: responsiveScreenHeight(8),
      padding: responsiveScreenWidth(3),
      width: responsiveScreenWidth(67),
    },
    reportSubmit: {
      display: 'flex',
      alignSelf: 'flex-end',
      marginTop: responsiveScreenHeight(2),
    },
    reportBtn: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      width: responsiveScreenWidth(30),
    },
    reportBtnText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      textAlign: 'center',
    },

    downloadText: {
      color: 'red',
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    downloadTextDoc: {
      color: '#3386F9',
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    fileNameContainer: {
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'absolute',
      alignItems: 'center',
      top: responsiveScreenHeight(3),
      gap: 5,
    },
  });
