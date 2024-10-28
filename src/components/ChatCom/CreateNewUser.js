import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TextInput} from 'react-native';
import CustomeBtn from '../AuthenticationCom/CustomeBtn';
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

const CreateNewUser = () => {
  const [searchText, setSearchText] = useState('');
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [AllUsers, setAllUsers] = useState([]);
  const navigation = useNavigation();

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

  useEffect(() => {
    searchAllUser('');
  }, []);

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.White,
            padding: 10,
            borderRadius: 100,
          }}
          onPress={() => navigation.goBack()}>
          {/* <Ionicons name="chevron-back" size={25} color={Colors.BodyText} /> */}
          <ArrowLeft />
        </TouchableOpacity>
        <View style={styles.searchFieldContainer}>
          <TextInput
            onChangeText={text => setSearchText(text)}
            placeholder="Search new user..."
            placeholderTextColor={Colors.BodyText}
            style={styles.searchUserField}
          />
          <CustomeBtn
            handlePress={() => {
              searchAllUser(searchText);
            }}
            title="Search"
            customeContainerStyle={{
              flex: 0.3,
              height: 30,
              borderRadius: 4,
              marginTop: 0,
            }}
            disable={!searchText}
          />
        </View>
      </View>

      <FlatList
        data={AllUsers}
        renderItem={({item}) => <OnlineUsersItem item={item} />}
        keyExtractor={item => item?._id || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        ItemSeparatorComponent={() => (
          <Divider marginTop={0.000001} marginBottom={0.00001} />
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              height: responsiveScreenHeight(80),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <NoDataAvailable />
          </View>
        )}
      />
    </View>
  );
};

export default CreateNewUser;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    searchFieldContainer: {
      width: responsiveScreenWidth(85),
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
      // backgroundColor: "red",
      flex: 1,
      height: 40,
      color: Colors.BodyText,

      fontSize: RegularFonts.HS,
    },
  });
