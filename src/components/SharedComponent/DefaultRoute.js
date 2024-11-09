import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import CrossIcon from '../../assets/Icons/CrossIcon';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import Divider from './Divider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CodingIcon from '../../assets/Icons/CodingIcon';
import {handleOpenLink} from '../HelperFunction';
import {MainContext} from '../../App';
import ProgramSwitchModal from './ProgramSwitchModal';

const DefaultRoute = ({route}) => {
  const {params} = route;
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const handleGoHome = () => {
    navigation.navigate('HomeStack', {screen: 'Home'});
  };
  const {top} = useSafeAreaInsets();

  const [modalOpen, setModalOpen] = useState(false);
  const {handleVerify} = useContext(MainContext);
  return (
    <View
      style={{
        backgroundColor: Colors.Background_color,
        flex: 1,
        paddingTop: top,
      }}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={{width: 100}} onPress={() => handleGoHome()}>
          <CrossIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleGoHome()}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
      <Divider marginTop={1} />
      <View style={styles.mainContainer}>
        <CodingIcon />
        <Text style={styles.headingText}>{params.title}</Text>
        <View style={styles.bodyText}>
          <Text style={styles.bodyText}>{params.description}</Text>
          {/* <Text style={styles.bodyText}>
              If you are already enrolled, please select your program from
            </Text>
            <Text style={styles.bodyText}>'Switch Program'</Text> */}
          <Pressable
            style={styles.buttonContainer}
            onPress={() => setModalOpen(!modalOpen)}>
            <Text
              style={[
                {
                  color: Colors.PureWhite,
                  fontFamily: CustomFonts.MEDIUM,
                  fontSize: responsiveScreenFontSize(2),
                },
              ]}>
              Switch Bootcamps
            </Text>
          </Pressable>
          {modalOpen && (
            <ProgramSwitchModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              handleVerify={handleVerify}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default DefaultRoute;

const getStyles = Colors =>
  StyleSheet.create({
    buttonContainer: {
      backgroundColor: Colors.Primary,
      width: responsiveWidth(50),
      alignSelf: 'center',
      height: 40,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    topContainer: {
      //   backgroundColor: "blue",
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
      marginHorizontal: responsiveScreenWidth(4),
    },
    mainContainer: {
      //   backgroundColor: "yellow",
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },

    headingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.8),
      color: Colors.Heading,
    },
    bodyText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.BodyText,
      textAlign: 'center',
      marginHorizontal: responsiveScreenWidth(4),
      lineHeight: responsiveScreenHeight(3),
    },
    buttonText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
      textAlign: 'center',
    },
  });
