import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Provider} from 'react-native-paper';
import color from '../constants/color';
import moment from 'moment';
import {useTheme} from '../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Divider from '../components/SharedComponent/Divider';
import CustomFonts from '../constants/CustomFonts';
import axiosInstance from '../utility/axiosInstance';
import ImageView from 'react-native-image-viewing';
import AddPaymentModal from '../components/PaymentCom/AddPaymentModal';
import {showToast} from '../components/HelperFunction';
import Loading from '../components/SharedComponent/Loading';
import Images from '../constants/Images';
import {useGlobalAlert} from '../components/SharedComponent/GlobalAlertContext';

const MyPaymentScreen = (routes, navigation) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const [viewImage, setViewImage] = useState([]);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [transactions, setTransactions] = useState([]);
  // console.log("transactions", JSON.stringify(transactions, null, 1));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [isLoding, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] =
    useState(false);
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState(10);
  const [date, setDate] = useState(new Date());
  const [attachment, setAttachment] = useState(null);
  const [note, setNote] = useState('');
  const {showAlert} = useGlobalAlert();

  const [selected, setSelected] = useState(null);

  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const handleShowDetails = trx => {
    setSelected(trx);
    setIsOpenDetails(true);
  };
  const orderId = routes.route.params?.courseId;
  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      axiosInstance
        .get(`/order/details/${orderId}`)
        .then(res => {
          setTransactions(res.data.transactions);
          setTotalAmount(res.data.order.amount);
          setTotalPaid(
            res.data.transactions.reduce(
              (total, item) => total + item.amount,
              0,
            ),
          );
          setIsLoading(false);
        })
        .catch(err => {
          console.log('err', JSON.stringify(err, null, 1));
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);

      axiosInstance
        .get(`/transaction/myTransaction`)
        .then(res => {
          setTransactions(res.data.transactions);
          setTotalAmount(res.data.totalAmount);
          setTotalPaid(
            res.data.transactions.reduce(
              (total, item) =>
                item.status === 'accepted' ? total + item.amount : total,
              0,
            ),
          );

          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
          console.log('You got error', JSON.stringify(err, null, 1));
        });
    }
  }, []);

  const handleAddPayment = () => {
    // console.log("function called");
    if (amount < 10) {
      return showAlert({
        title: 'Error',
        type: 'warning',
        message: 'Amount must be greater then 10$',
      });
    }
    setIsSaving(true);
    let data = {
      method,
      amount,
      date,
      note,
      attachment,
    };

    axiosInstance
      .post(
        orderId ? `/order/addpayment/${orderId}` : '/transaction/addbyuser',
        data,
      )
      .then(res => {
        if (res.data.success) {
          setTransactions(prev => [res.data.transaction, ...prev]);
          handleCancel();
          setIsSaving(false);
          toggleAddPaymentModal();
          showToast('Payment Added!');
          //window.open(res.data.redirectUrl, '_blank')
        } else {
          setIsSaving(false);
          setTransactions(prev => [res.data.transaction, ...prev]);
          handleCancel();
        }
      })
      .catch(error => {
        toggleAddPaymentModal();

        setIsSaving(false);
        if (error.response) {
          console.log(
            'Server error:',
            JSON.stringify(error.response.data, null, 1),
          );
        } else if (error.request) {
          console.log('Network error:', JSON.stringify(error.request, null, 1));
        } else {
          console.error('Error:', JSON.stringify(error.message, null, 1));
        }
        error &&
          error.response &&
          showAlert({
            title: 'Error',
            type: 'error',
            message: err?.response?.data?.error,
          });
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAmount(10);
    setMethod('');
    setDate('');
    setNote('');
    setAttachment(null);
  };

  if (isLoding) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.Background_color,
        }}>
        <Loading />
      </View>
    );
  }

  const toggleAddPaymentModal = () => {
    setIsAddPaymentModalVisible(pre => !pre);
  };
  return (
    <Provider>
      <View style={styles.container}>
        {/* {!isModalVisible && (
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => {
              // setIsModalVisible(true);
              toggleAddPaymentModal();
            }}
            color={Colors.White}
            small={false}
          />
        )} */}
        <Text style={styles.headerText}>Payment History</Text>
        <Divider />

        <View style={styles.amountWrapper}>
          <View style={[styles.amountContainer, {backgroundColor: '#4b56c0'}]}>
            <Text style={styles.amountText}>Total Amount</Text>
            <Text style={styles.amount}>${totalAmount}</Text>
          </View>
          <View style={[styles.amountContainer, {backgroundColor: '#00c177'}]}>
            <Text style={styles.amountText}>Paid Amount</Text>
            <Text style={styles.amount}>${totalPaid || 0}</Text>
          </View>
          <View style={[styles.amountContainer, {backgroundColor: '#ef7817'}]}>
            <Text style={styles.amountText}>Due Amount</Text>
            <Text style={styles.amount}>${totalAmount - totalPaid}</Text>
          </View>
        </View>

        {transactions?.length > 0 && (
          <ScrollView horizontal={true} style={styles.tableContainer}>
            <ScrollView vertical={true}>
              <View style={styles.header}>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={[, styles.headingText]}>Amount</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={[, styles.headingText]}>Method</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={[, styles.headingText]}>Date</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={[, styles.headingText]}>Status</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={[, styles.headingText]}>Attachment</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={[, styles.headingText]}>Note</Text>
                </View>
              </View>
              <View style={styles.footer}>
                {transactions?.map((trx, i) => (
                  <View key={i} style={styles.row}>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Text style={styles.cell}>$ {trx.amount}</Text>
                    </View>

                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Text style={styles.cell}>{trx.method}</Text>
                    </View>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Text style={styles.cell}>
                        {moment(trx.date).format('D MMM YYYY')}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          // marginLeft: responsiveScreenWidth(4),
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          // gap: 5,
                        },
                      ]}>
                      <View
                        style={{
                          // width: 10,
                          height: 10,
                          borderRadius: 100,
                          backgroundColor:
                            (trx.status === 'accepted' && Colors.Primary) ||
                            (trx.status === 'pending' && Colors.StarColor) ||
                            (trx.status === 'pending' && Colors.Red),
                        }}></View>
                      <Text
                        style={[styles.cell, {textTransform: 'capitalize'}]}>
                        {trx.status || 'N/A'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        setViewImage([
                          trx.attachment
                            ? {
                                uri: trx.attachment,
                              }
                            : Images.DEFAULT_IMAGE,
                        ])
                      }
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Image
                        // height={100}
                        // width={100}
                        style={styles.img}
                        source={
                          trx.attachment
                            ? {
                                uri: trx.attachment,
                              }
                            : Images.DEFAULT_IMAGE
                        }
                      />
                      {/* <Text style={styles.cell}>
                        {trx.attachment || "Empty"}
                      </Text> */}
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      {/* <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleShowDetails(trx)}
                      >
                        <Text style={styles.buttonText}>View</Text>
                      </TouchableOpacity> */}

                      <Text style={styles.cell}>{trx?.note || 'N/A'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </View>
      <ImageView
        images={viewImage}
        imageIndex={0}
        visible={viewImage?.length !== 0}
        onRequestClose={() => setViewImage([])}
      />

      <AddPaymentModal
        handleAddPayment={handleAddPayment}
        method={method}
        amount={amount}
        date={date}
        note={note}
        attachment={attachment}
        setMethod={setMethod}
        setAmount={setAmount}
        setDate={setDate}
        setAttachment={setAttachment}
        setNote={setNote}
        toggleAddPaymentModal={toggleAddPaymentModal}
        isAddPaymentModalVisible={isAddPaymentModalVisible}
      />
    </Provider>
  );
};

export default MyPaymentScreen;

const getStyles = Colors =>
  StyleSheet.create({
    amountText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.PureWhite,
    },
    amount: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.PureWhite,
    },
    amountContainer: {
      flex: 1,
      padding: 10,
      paddingRight: 0,
      borderRadius: 10,
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      // marginTop: responsiveScreenHeight(1),
      // marginLeft:
    },
    box: {
      width: responsiveScreenWidth(22),
      alignItems: 'center',
      // backgroundColor: "green",
      height: responsiveScreenHeight(4),
      justifyContent: 'center',
      overflow: 'hidden',
      alignItems: 'flex-start',
      marginLeft: responsiveScreenWidth(4),
    },
    img: {
      width: responsiveScreenWidth(22),
      height: responsiveScreenHeight(4),
      overflow: 'hidden',
    },
    tableContainer: {
      borderTopStartRadius: 10,
      flex: 1,
      // padding: 10,
      // backgroundColor: Colors.White,
    },
    header: {
      flexDirection: 'row',
      gap: 10,
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
      backgroundColor: Colors.White,
      justifyContent: 'space-between',
    },
    footer: {
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
      // backgroundColor: "green",
    },
    row: {
      flexDirection: 'row',
      backgroundColor: Colors.Background_color,
      paddingVertical: 8,
      // paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,

      justifyContent: 'space-between',
      // alignItems: "center",
    },
    cell: {
      // flex: 1,
      fontFamily: CustomFonts.REGULAR,
      fontSize: 13,
      // backgroundColor: "red",
      color: Colors.BodyText,
      maxWidth: 100,
      textAlign: 'center',
    },
    headingText: {
      maxWidth: 100,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    // buttonText: {
    //   color: Colors.PureWhite,
    //   fontWeight: "bold",
    //   textAlign: "center",
    // },
    // button: {
    //   backgroundColor: Colors.Primary,
    //   padding: 6,
    //   borderRadius: 5,
    //   justifyContent: "center",
    // },
    tableText: {
      color: Colors.BodyText,
    },
    tableHeading: {
      color: Colors.Heading,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: color.primary,
      zIndex: 10,
    },
    amountWrapper: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'space-between',
      marginBottom: responsiveScreenHeight(2),
    },
    card: {
      backgroundColor: Colors.Red,
      borderRadius: 5,
      paddingVertical: 5,
    },
    picker: {
      borderColor: color.primary,
      borderWidth: 1,
      width: '100%',
      borderRadius: 15,
      borderWidth: 0,
      overflow: 'hidden',
      padding: 0,
      backgroundColor: '#FFF',
    },
    border: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: Colors.BorderColor,
    },
    date: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: Colors.BorderColor,
      padding: 15,
      marginTop: 10,
    },
    textInput: {
      color: Colors.Heading,
      borderColor: Colors.BorderColor,
      width: '100%',
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      fontWeight: 'bold',
    },
    label: {
      fontWeight: 'bold',
      marginTop: 10,
    },
  });
