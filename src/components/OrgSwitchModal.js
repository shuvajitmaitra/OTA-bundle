import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../context/ThemeContext';
import CustomFonts from '../constants/CustomFonts';
import Divider from './SharedComponent/Divider';
import Images from '../constants/Images';
import {setOrganization} from '../utility/mmkvHelpers';
import {setSelectedOrganization} from '../store/reducer/authReducer';
import {useMainContext} from '../context/MainContext';

const OrgSwitchModal = ({isVisible, onCancelPress}) => {
  const {organizations, selectedOrganization} = useSelector(
    state => state.auth,
  );
  const {handleVerify2} = useMainContext();
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  useEffect(() => {
    const handleSelectOrganization = () => {
      if (organizations.length === 0) {
        return;
      }
      setOrganization(organizations[0]);
      dispatch(setSelectedOrganization(organizations[0]));
      handleVerify2();
    };
    if (organizations.length === 1) handleSelectOrganization();
  }, [dispatch, handleVerify2, organizations]);

  const handleSelectOrganization = org => {
    setOrganization(org);
    dispatch(setSelectedOrganization(org));
    handleVerify2();
  };

  const renderItem = ({item}) => {
    return (
      <View key={item?._id} style={styles.selectedOrganizationContainer}>
        <Image
          source={
            item?.data?.companyLogo
              ? {uri: item.data.companyLogo}
              : Images.DEFAULT_IMAGE
          }
          resizeMode="contain"
          style={styles.selectedOrganizationImage}
        />
        <Text style={styles.selectedOrganizationText}>
          {item?.name || 'N/A'}
        </Text>
        <View style={{flexGrow: 1}} />
        <TouchableOpacity
          onPress={() => handleSelectOrganization(item)}
          style={styles.selectBtnContainer}>
          <Text>
            {item._id === selectedOrganization?._id ? 'Selected' : 'Select'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ReactNativeModal isVisible={isVisible} onBackdropPress={onCancelPress}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headingText}>Select Company/University</Text>
          {/* <TouchableOpacity onPress={onCancelPress}>
            <CrossCircle />
          </TouchableOpacity> */}
        </View>
        <Divider marginTop={1.5} marginBottom={1.5} />
        <FlatList
          data={organizations}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          ItemSeparatorComponent={
            <Divider marginTop={0.5} marginBottom={0.5} />
          }
        />
      </View>
    </ReactNativeModal>
  );
};

export default OrgSwitchModal;

const getStyles = Colors =>
  StyleSheet.create({
    selectBtnContainer: {
      backgroundColor: Colors.Primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
    },
    headingText: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: CustomFonts.BOLD,
      color: Colors.Heading,
    },
    mainContainer: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      padding: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selectedOrganizationImage: {
      borderRadius: 100,
      backgroundColor: Colors.Primary,
      height: 50,
      width: 50,
    },
    selectedOrganizationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 20,
    },
    selectedOrganizationText: {
      color: Colors.Heading,
      fontSize: 18,
      fontFamily: CustomFonts.MEDIUM,
    },
  });
