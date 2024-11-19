// OrganizationDetails.js
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../constants/Images';
import {useTheme} from '../context/ThemeContext';
import {ArrowDownTwo} from '../assets/Icons/ArrowDownTwo';
import Divider from '../components/SharedComponent/Divider';
import {setOrganization} from '../utility/mmkvHelpers';
import {setSelectedOrganization} from '../store/reducer/authReducer';
import {useMainContext} from '../context/MainContext';
import UpArrowIcon from '../assets/Icons/UpArrowIcon';

const OrganizationDetails = () => {
  const {organizations, selectedOrganization} = useSelector(
    state => state.auth,
  );
  const [selectVisible, setSelectVisible] = useState(false);
  const {handleVerify} = useMainContext();
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Animated values
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const toggleSelectVisible = () => {
    if (selectVisible) {
      // Collapse
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setSelectVisible(false);
      });
    } else {
      setSelectVisible(true);
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: organizations.length * 70, // Adjust based on item height
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleSelectOrganization = org => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setSelectVisible(false);
      setOrganization(org);
      dispatch(setSelectedOrganization(org));
      handleVerify();
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={toggleSelectVisible}
        disabled={organizations.length <= 1}
        style={[styles.selectedOrganizationContainer, styles.topContainer]}>
        <Image
          source={
            selectedOrganization?.data?.companyLogo
              ? {uri: selectedOrganization.data.companyLogo}
              : Images.DEFAULT_IMAGE
          }
          height={30}
          width={30}
          resizeMode="contain"
          style={styles.selectedOrganizationImage}
        />
        <Text style={styles.selectedOrganizationText}>
          {selectedOrganization?.name || 'Unavailable'}
        </Text>
        <View style={{flexGrow: 1}} />
        {organizations.length > 1 && (
          <>{selectVisible ? <UpArrowIcon /> : <ArrowDownTwo />}</>
        )}
      </TouchableOpacity>
      {/* <Divider marginTop={1} marginBottom={0.000001} /> */}
      {/* Animated Toggleable Section */}
      {selectVisible && (
        <Animated.View
          style={[
            styles.animatedDropdown,
            {
              height: animatedHeight,
              opacity: animatedOpacity,
            },
          ]}>
          {organizations.map(item => (
            <TouchableOpacity
              key={item._id}
              style={[styles.selectedOrganizationContainer]}
              onPress={() => handleSelectOrganization(item)}
              disabled={item._id === selectedOrganization?._id}>
              <Image
                source={
                  item?.data?.companyLogo
                    ? {uri: item.data.companyLogo}
                    : Images.DEFAULT_IMAGE
                }
                resizeMode="contain"
                style={styles.selectedOrganizationImage}
              />
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={{flexGrow: 1}} />
              <View
                style={[
                  styles.selectBtnContainer,
                  item._id === selectedOrganization?._id && {
                    backgroundColor: Colors.DisablePrimaryBackgroundColor,
                  },
                ]}>
                <Text
                  style={[
                    styles.selectBtnText,
                    item._id === selectedOrganization?._id && {
                      color: Colors.DisablePrimaryButtonTextColor,
                    },
                  ]}>
                  {item._id === selectedOrganization?._id
                    ? 'Selected'
                    : 'Select'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </>
  );
};

export default OrganizationDetails;

const getStyles = Colors =>
  StyleSheet.create({
    topContainer: {
      backgroundColor: Colors.Background_color,
    },
    selectBtnText: {
      color: Colors.PureWhite,
    },
    selectBtnContainer: {
      backgroundColor: Colors.Primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
    },
    selectedOrganizationImage: {
      borderRadius: 100,
      backgroundColor: Colors.Primary,
      height: 40,
      width: 40,
    },
    selectedOrganizationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 25,
      paddingVertical: 5,
      marginVertical: 10,
    },
    selectedOrganizationText: {
      color: Colors.Heading,
      fontSize: 18,
      fontWeight: '600',
    },
    itemText: {
      color: Colors.Heading,
      fontSize: 16,
      fontWeight: '500',
    },
    animatedDropdown: {
      // overflow: 'hidden',
      paddingHorizontal: 20,
    },
  });
