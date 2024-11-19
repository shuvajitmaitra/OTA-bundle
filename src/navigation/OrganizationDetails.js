import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Images from '../constants/Images';
import {useTheme} from '../context/ThemeContext';
import {ArrowDownTwo} from '../assets/Icons/ArrowDownTwo';
import Divider from '../components/SharedComponent/Divider';

const OrganizationDetails = () => {
  const {organizations, selectedOrganization} = useSelector(
    state => state.auth,
  );
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <>
      <View style={[styles.selectedOrganizationContainer, {marginTop: 20}]}>
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
        <ArrowDownTwo />
      </View>
      <Divider marginTop={1} marginBottom={1} />
      <View style={{gap: 10}}>
        {organizations.map(item => (
          <View key={item._id} style={styles.selectedOrganizationContainer}>
            <Image
              source={
                item?.data?.companyLogo
                  ? {uri: item.data.companyLogo}
                  : Images.DEFAULT_IMAGE
              }
              resizeMode="contain"
              style={styles.selectedOrganizationImage}
            />
            <Text style={styles.selectedOrganizationText}>{item.name}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

export default OrganizationDetails;

const getStyles = Colors =>
  StyleSheet.create({
    selectedOrganizationImage: {
      borderRadius: 100,
      backgroundColor: Colors.Primary,
      height: 30,
      width: 30,
    },
    selectedOrganizationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 20,
    },
    selectedOrganizationText: {
      color: Colors.Heading,
    },
  });
