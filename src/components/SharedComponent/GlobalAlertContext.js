import React, {createContext, useContext, useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {Text, View, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import BinIcon from '../../assets/Icons/BinIcon';
import CustomeFonts from '../../constants/CustomeFonts';
import {RegularFonts} from '../../constants/Fonts';
import AlertIcon2 from '../../assets/Icons/AlertIcon2';
import ErrorIcon from '../../assets/Icons/ErrorIcon';
import SuccessIcon from '../../assets/Icons/SuccessIcon';
import Markdown from 'react-native-markdown-display';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

// Create a context
const AlertContext = createContext();

// Provide the alert context to the app
export const AlertProvider = ({children}) => {
  const [data, setData] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const showAlert = data => {
    setData(data);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  //type: "success" || "error" || "warning"

  /*
   showAlert({
        title: "Title",
        type: "warning",
        message:
          "Coming soon...",
      });
  
  
  */
  return (
    <AlertContext.Provider value={{showAlert}}>
      {children}
      <Modal
        isVisible={isVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        onBackdropPress={() => setIsVisible(false)}>
        <View style={styles.alertBox}>
          <View
            style={{
              //   height: 100,
              //   width: 100,
              //   backgroundColor:
              //     data.type == "error"
              //       ? Colors.Red
              //       : data.type == "warning"
              //       ? Colors.ThemeSecondaryColor
              //       : Colors.Primary,
              //   borderRadius: 100,
              //   marginBottom: "-50%",
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -70,
              shadowColor: Colors.PureWhite,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.29,
              shadowRadius: 4.65,

              elevation: 3,
            }}>
            {data.type == 'error' ? (
              <ErrorIcon />
            ) : data.type == 'warning' ? (
              <AlertIcon2 />
            ) : (
              <SuccessIcon />
            )}
          </View>
          <Text style={styles.heading}>{data.title || 'Success'}</Text>
          <Text style={styles.alertText}>
            {data.message || 'Task is successful!'}
          </Text>
          {data.link && (
            <Text style={styles.linkText}>
              {data.link || 'portal.bootcampshub.ai'}
            </Text>
          )}
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

// Custom hook to use the alert context
export const useGlobalAlert = () => {
  return useContext(AlertContext);
};

const getStyles = Colors =>
  StyleSheet.create({
    alertBox: {
      backgroundColor: Colors.White,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      gap: 10,
    },
    alertText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BL,
      textAlign: 'center',
      fontFamily: CustomeFonts.REGULAR,
    },
    linkText: {
      color: Colors.Primary,
      fontSize: RegularFonts.BL,
      textAlign: 'center',
      fontFamily: CustomeFonts.SEMI_BOLD,
    },
    heading: {
      fontFamily: CustomeFonts.SEMI_BOLD,
      fontSize: RegularFonts.HL,
      color: Colors.Heading,
      textAlign: 'center',
    },
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.BodyText,
        fontFamily: CustomeFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
        // backgroundColor: "yellow",
      },
      heading1: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        flex: 1,
        width: responsiveScreenWidth(73),
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.Primary,
        // marginBottom: 100,
      },
      blockquote: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    },
  });
