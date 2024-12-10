import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TextInput} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {handleError} from '../../actions/chat-noti';
import axiosInstance from '../../utility/axiosInstance';
import OnlineUsersItem from './OnlineUsersItem';
import Divider from '../SharedComponent/Divider';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {useNavigation} from '@react-navigation/native';
import {RegularFonts} from '../../constants/Fonts';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import debounce from 'lodash.debounce'; // Install lodash.debounce

const CreateNewUser = () => {
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [AllUsers, setAllUsers] = useState([]);
  const navigation = useNavigation();

  // API Call for searching users
  const searchAllUser = useCallback(searchText => {
    axiosInstance
      .get(`/chat/searchuser?query=${searchText}`)
      .then(res => {
        setAllUsers(res.data.users);
      })
      .catch(error => {
        handleError(error);
      });
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(text => {
      searchAllUser(text);
    }, 500),
    [searchAllUser],
  );

  // Handle search text change
  const handleSearchChange = text => {
    debouncedSearch(text); // Trigger debounced search
  };

  useEffect(() => {
    searchAllUser('');
  }, [searchAllUser]);

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.arrowContainer}
          onPress={() => navigation.goBack()}>
          <ArrowLeft />
        </TouchableOpacity>
        <View style={styles.searchFieldContainer}>
          <TextInput
            onChangeText={handleSearchChange} // Attach the handler here
            placeholder="Search new user..."
            placeholderTextColor={Colors.BodyText}
            style={styles.searchUserField}
          />
        </View>
      </View>

      <FlatList
        data={AllUsers}
        renderItem={({item}) => <OnlineUsersItem item={item} />}
        keyExtractor={item => item?._id || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        ItemSeparatorComponent={
          <Divider marginTop={0.000001} marginBottom={0.00001} />
        }
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <NoDataAvailable />
          </View>
        }
      />
    </View>
  );
};

export default CreateNewUser;

const getStyles = Colors =>
  StyleSheet.create({
    topContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      justifyContent: 'center',
    },
    noDataContainer: {
      height: responsiveScreenHeight(80),
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.White,
      padding: 10,
      borderRadius: 100,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    searchFieldContainer: {
      width: responsiveScreenWidth(80),
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.ScreenBoxColor,
      paddingHorizontal: 10,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      alignSelf: 'center',
    },
    searchUserField: {
      flex: 1,
      height: 40,
      color: Colors.BodyText,
      fontSize: RegularFonts.HS,
    },
  });
