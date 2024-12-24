import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import React from 'react';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import NotifyBell from '../../assets/Icons/NotifyBell';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import {UserModalTabView} from './UserModalTabView';
import CustomFonts from '../../constants/CustomFonts';
import useChat from '../../hook/useChat';
import {useTheme} from '../../context/ThemeContext';
import {useSelector} from 'react-redux';
import Images from '../../constants/Images';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';

export default function UserModal() {
  const [notificationSwitch, setNotificationSwitch] = React.useState(false);

  const {setIsProfileModalVisible, image, name, chat} = useChat();
  const {onlineUsers} = useSelector(state => state.chat);

  const online = onlineUsers?.find(x => x?._id === chat?.otherUser?._id);

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();
  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        onPress={() => {
          setIsProfileModalVisible(false);
        }}
        style={styles.modalArrowIcon}>
        <ArrowLeft />
        <Text
          style={{
            fontFamily: CustomFonts.REGULAR,
            paddingLeft: 8,
            fontSize: responsiveScreenFontSize(1.9),
            color: Colors.BodyText,
          }}>
          Back
        </Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            style={styles.profileImage}
            source={
              image
                ? {
                    uri: image,
                  }
                : Images.DEFAULT_IMAGE
            }
          />

          <View style={styles.modalProfileNameContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileName}>
              {name}
            </Text>
            <View style={styles.activeStatusContainer}>
              <View
                style={[
                  styles.activeDot,
                  {
                    backgroundColor: online ? '#62cc7b' : '#BDBDBD',
                  },
                ]}></View>
              <Text
                style={{
                  color: Colors.BodyText,
                  fontFamily: CustomFonts.REGULAR,
                }}>
                {online ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          <View style={styles.notificationContainer}>
            <View style={styles.notificationSubContainer}>
              <NotifyBell />
              <Text
                style={{
                  color: Colors.BodyText,
                  fontFamily: CustomFonts.REGULAR,
                  fontSize: responsiveScreenFontSize(2),
                }}>
                Notification
              </Text>
            </View>
            <Switch
              trackColor={{false: '#767577', true: Colors.Primary}}
              thumbColor={notificationSwitch ? Colors.Primary : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() =>
                setNotificationSwitch(previousState => !previousState)
              }
              value={notificationSwitch}
            />
          </View>

          <View style={styles.descriptionContainer}>
            <Text
              style={{
                color: Colors.Heading,
                fontSize: responsiveScreenFontSize(2.1),
                fontFamily: CustomFonts.MEDIUM,
                paddingTop: responsiveScreenHeight(2),
                paddingBottom: responsiveScreenHeight(1.7),
              }}>
              Description
            </Text>
            <Text
              style={{
                color: Colors.BodyText,
                fontFamily: CustomFonts.REGULAR,
                fontSize: responsiveScreenFontSize(1.7),
              }}>
              Hi there! I&apos;m using this app long time.
            </Text>
            <View
              style={{
                borderBottomWidth: 0.8,
                borderColor: Colors.BorderColor,
                marginTop: responsiveScreenHeight(2.7),
                marginBottom: responsiveScreenHeight(1.5),
              }}></View>
          </View>

          {/* <UserModalTabView chat={chat} /> */}

          <View>
            <TouchableOpacity
              onPress={() =>
                showAlert({
                  title: 'Coming Soon...',
                  type: 'warning',
                  message: 'This feature is coming soon.',
                })
              }
              style={styles.blockContainer}>
              <MaterialCommunityIcons
                name="block-helper"
                size={responsiveScreenFontSize(2)}
                color="rgba(244, 42, 65, 1)"
              />
              <Text
                style={[styles.ContainerText, {color: 'rgba(244, 42, 65, 1)'}]}
                numberOfLines={1}
                ellipsizeMode="tail">
                Block {name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                showAlert({
                  title: 'Coming Soon...',
                  type: 'warning',
                  message: 'This feature is coming soon.',
                })
              }
              style={styles.blockContainer}>
              <Feather
                name="archive"
                size={responsiveScreenFontSize(2.5)}
                color={Colors.BodyText}
              />
              <Text style={styles.ContainerText}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                showAlert({
                  title: 'Coming Soon...',
                  type: 'warning',
                  message: 'This feature is coming soon.',
                })
              }
              style={styles.blockContainer}>
              <Feather
                name="alert-triangle"
                size={responsiveScreenFontSize(2.5)}
                color={Colors.BodyText}
              />
              <Text style={styles.ContainerText}>Archive Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingHorizontal: responsiveScreenWidth(5),
      paddingBottom: responsiveScreenHeight(2.5),
      paddingTop: responsiveScreenHeight(1),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(2),
      maxHeight: responsiveScreenHeight(80),
    },
    modalArrowIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      paddingBottom: responsiveScreenHeight(0.8),
      color: 'rgba(71, 71, 72, 1)',
      flexDirection: 'row',
      alignItems: 'center',

      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(1),
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    profileImage: {
      height: responsiveScreenHeight(30),
      width: responsiveScreenWidth(80),
      resizeMode: 'cover',
      borderRadius: responsiveScreenHeight(1),
      alignSelf: 'center',
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    modalProfileNameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1.7),
    },
    profileName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      width: responsiveScreenWidth(60),
    },
    activeStatusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(0.5),
    },
    activeDot: {
      width: responsiveScreenWidth(3),
      height: responsiveScreenWidth(3),
      borderRadius: responsiveScreenWidth(100),
      color: 'rgba(0, 0, 0, 0.6)',
    },
    notificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(0.5),
    },
    notificationSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    descriptionContainer: {
      borderTopWidth: 1,
      borderColor: Colors.BorderColor,
    },
    blockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      marginVertical: responsiveScreenHeight(1),
    },
    ContainerText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
  });
