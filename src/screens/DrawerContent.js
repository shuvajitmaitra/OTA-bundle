// import React, {useState} from 'react';
// import {View, StyleSheet, Linking, Alert} from 'react-native';
// import {
//   Avatar,
//   Title,
//   Caption,
//   Paragraph,
//   Drawer,
//   Text,
//   TouchableRipple,
//   Switch,
// } from 'react-native-paper';
// import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import MIcon from 'react-native-vector-icons/MaterialIcons';
// import AntIcon from 'react-native-vector-icons/AntDesign';
// import {useSelector, useDispatch} from 'react-redux';
// import environment from '../constants/environment';
// import {logout} from '../store/reducer/authReducer';
// import DisplaySettingsIcon from '../assets/Icons/DisplaySettingsIcon';
// import SwapIcon from '../assets/Icons/SwapIcon';
// import {useTheme} from '../context/ThemeContext';
// import * as Updates from 'expo-updates';
// import ProfileGreenIcon from '../assets/Icons/ProfileGreenIcon';
// import MyAssesmentIcon from '../assets/Icons/MyAssesmentIcon';
// import MyProgramIcon from '../assets/Icons/MyProgramIcon';
// import PaymentIcon from '../assets/Icons/PaymentIcon';
// import DocumentIcon from '../assets/Icons/DocumentIcon';
// import PasswordIcon from '../assets/Icons/PasswordIcon';
// import HomeIcon from '../assets/Icons/HomeIcon';
// import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
// import Divider from '../components/SharedComponent/Divider';
// import HomeIconTwo from '../assets/Icons/HomeIcon2';
// import BookIcon from '../assets/Icons/BookIcon';
// import CustomFonts from '../constants/CustomFonts';
// import {useGlobalAlert} from '../components/SharedComponent/GlobalAlertContext';
// import useUserStatusData from '../constants/UserStatusData';
// import {useNavigation} from '@react-navigation/native';

// export function DrawerContent(props) {
//   // --------------------------
//   // ----------- Import theme Colors -----------
//   // --------------------------
//   const Colors = useTheme();
//   const styles = getStyles(Colors);
//   const {showAlert} = useGlobalAlert();
//   const {user} = useSelector(state => state.auth);
//   const {status} = useSelector(state => state.userStatus);
//   const dispatch = useDispatch();
//   const userStatusData = useUserStatusData(16); //passed icon size
//   const signOut = async () => {
//     await AsyncStorage.removeItem('user_token');
//     await AsyncStorage.removeItem('active_enrolment');
//     dispatch(logout());
//   };
//   // console.log(user);
//   const navigation = useNavigation();
//   const [updateAvailable, setUpdateAvailable] = useState(false);

//   async function onFetchUpdateAsync() {
//     try {
//       const update = await Updates.checkForUpdateAsync();

//       if (update.isAvailable) {
//         setUpdateAvailable(true);
//         Alert.alert(
//           'Update Available',
//           'A new version of the app is available. Do you want to download it?',
//           [
//             {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
//             {text: 'Download', onPress: () => onDownloadUpdateAsync()},
//           ],
//         );
//         return;
//       } else {
//         // Alert.alert("No Update Available", "You are already on the latest version.", [
//         //   { text: "OK", onPress: () => console.log("OK Pressed") },
//         // ]);
//         showAlert({
//           title: 'No Update Available',
//           type: 'warning',
//           message: 'You are already on the latest version.',
//         });
//       }
//     } catch (error) {
//       // alert(`Error fetching latest Expo update: ${error}`);
//       console.log('Error Details:', error);
//       showAlert({
//         title: 'Error',
//         type: 'error',
//         message: `Error fetching latest Expo update: ${error}`,
//       });
//     }
//   }

//   async function onDownloadUpdateAsync() {
//     try {
//       await Updates.fetchUpdateAsync();
//       Alert.alert(
//         'Update Downloaded',
//         'Please restart the application to apply the update.',
//         [{text: 'Restart', onPress: () => Updates.reloadAsync()}],
//       );
//     } catch (error) {
//       alert(`Error downloading latest Expo update: ${error}`);
//     } finally {
//       setUpdateAvailable(false);
//     }
//   }

//   return (
//     <View style={{flex: 1, backgroundColor: Colors.White}}>
//       <DrawerContentScrollView {...props}>
//         <View style={styles.drawerContent}>
//           <View style={styles.userInfoSection}>
//             <View style={{flexDirection: 'row', marginTop: 15}}>
//               <Avatar.Image
//                 source={{
//                   uri:
//                     user?.profilePicture ||
//                     'https://api.adorable.io/avatars/50/abott@adorable.png',
//                 }}
//                 size={50}
//               />
//               <View
//                 style={{
//                   position: 'absolute',
//                   bottom: -5,
//                   left: 32,
//                   backgroundColor: Colors.White,
//                   borderRadius: 100,
//                   padding: 2,
//                 }}>
//                 {userStatusData.find(item => item.value === status).icon}
//               </View>
//               <View style={{marginLeft: 15, flexDirection: 'column', flex: 1}}>
//                 <Title style={styles.title}>{user?.fullName}</Title>
//                 <Caption style={styles.caption}>{user?.email}</Caption>
//               </View>
//             </View>

//             {/* <View style={styles.row}>
//                             <View style={styles.section}>
//                                 <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
//                                 <Caption style={styles.caption}>Following</Caption>
//                             </View>
//                             <View style={styles.section}>
//                                 <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
//                                 <Caption style={styles.caption}>Followers</Caption>
//                             </View>
//                         </View> */}
//           </View>

//           <Drawer.Section showDivider={false} style={styles.drawerSection}>
//             {/* <DrawerItem
//               icon={({ color, size }) => <HomeIcon />}
//               label="Home"
//               labelStyle={{fontFamily: CustomFonts.MEDIUM, color: Colors.Heading }}
//               onPress={() => {
//                 props.navigation.navigate("Home");
//               }}
//             /> */}
//             <DrawerItem
//               icon={({color, size}) => <HomeIconTwo />}
//               label="Home"
//               labelStyle={{
//                 fontFamily: CustomFonts.MEDIUM,
//                 color: Colors.Heading,
//                 marginLeft: responsiveScreenWidth(-1),
//               }}
//               onPress={() => {
//                 props.navigation.navigate('Home');
//               }}
//             />

//             {/* -------------------------- */}
//             {/* ----------- MyProfile ----------- */}
//             {/* -------------------------- */}
//             <DrawerItem
//               icon={({color, size}) => <ProfileGreenIcon />}
//               label="Profile"
//               labelStyle={{
//                 fontFamily: CustomFonts.MEDIUM,
//                 color: Colors.Heading,
//               }}
//               onPress={() => {
//                 props.navigation.navigate('MyProfile');
//               }}
//             />
//             {/* -------------------------- */}
//             {/* ----------- My Program Screen ----------- */}
//             {/* -------------------------- */}
//             <DrawerItem
//               icon={({color, size}) => <MyProgramIcon />}
//               label="Bootcamps"
//               labelStyle={{
//                 fontFamily: CustomFonts.MEDIUM,
//                 color: Colors.Heading,
//               }}
//               onPress={() => {
//                 props.navigation.navigate('ProgramStack', {
//                   screen: 'Program',
//                 });
//               }}
//             />
//             {/* -------------------------- */}
//             {/* ----------- My Program Screen ----------- */}
//             {/* -------------------------- */}
//             <DrawerItem
//               icon={({color, size}) => <BookIcon size={18} />}
//               label="Technical Tests"
//               labelStyle={{
//                 fontFamily: CustomFonts.MEDIUM,
//                 color: Colors.Heading,
//               }}
//               onPress={() => {
//                 props.navigation.navigate('ProgramStack', {
//                   screen: 'TechnicalTestScreen',
//                 });
//               }}
//             />

//             {/* -------------------------- */}
//             {/* ----------- My Documents ----------- */}
//             {/* -------------------------- */}
//             <DrawerItem
//               icon={() => <DocumentIcon />}
//               label={'My Documents'}
//               labelStyle={{
//                 fontFamily: CustomFonts.MEDIUM,
//                 color: Colors.Heading,
//               }}
//               onPress={() => {
//                 props.navigation.navigate('ProgramStack', {
//                   screen: 'Presentation',
//                 });
//               }}
//             />
//             {/* -------------------------- */}
//             {/* ----------- My Payment history ----------- */}
//             {/* -------------------------- */}
//             {/* <DrawerItem
//               icon={() => <PaymentIcon />}
//               label={"Payment History"}
//               labelStyle={{
//                 fontFamily: CustomFonts.MEDIUM,
//                 color: Colors.Heading,
//               }}
//               onPress={() => {
//                 props.navigation.navigate("MyPaymentScreen");
//                 // Alert.alert("Coming soon....");
//               }}
//             /> */}
//             {/* -------------------------- */}
//             {/* ----------- Change password screen ----------- */}
//             {/* -------------------------- */}
//             <DrawerItem
//               icon={() => <PasswordIcon />}
//               label={'Change Password'}
//               labelStyle={{
//                 fontFamily: CustomFonts.MEDIUM,
//                 color: Colors.Heading,
//               }}
//               onPress={() => {
//                 props.navigation.navigate('ChangePasswordScreen');
//               }}
//               // onPress={() => navigation.navigate("ChangePassword")}
//             />
//             {/* -------------------------- */}
//             {/* ----------- Display settings screen ----------- */}
//             {/* -------------------------- */}
//             <DrawerItem
//               icon={({color, size}) => <DisplaySettingsIcon />}
//               label="Display Settings"
//               labelStyle={{
//                 fontFamily: CustomFonts.MEDIUM,
//                 color: Colors.Heading,
//               }}
//               onPress={() => {
//                 props.navigation.navigate('displaySettings');
//               }}
//             />

//             {updateAvailable ? (
//               <DrawerItem
//                 icon={({color, size}) => (
//                   <MIcon name="system-update-alt" color={'red'} size={19} />
//                 )}
//                 label="Download Update"
//                 labelStyle={{
//                   fontFamily: CustomFonts.MEDIUM,
//                   color: 'red',
//                 }}
//                 onPress={() => {
//                   onDownloadUpdateAsync();
//                 }}
//               />
//             ) : (
//               <DrawerItem
//                 icon={({color, size}) => (
//                   <MIcon
//                     name="system-update-alt"
//                     color={updateAvailable ? 'red' : Colors.Heading}
//                     size={19}
//                   />
//                 )}
//                 label="Check for Update"
//                 labelStyle={{
//                   fontFamily: CustomFonts.MEDIUM,
//                   color: updateAvailable ? 'red' : Colors.Heading,
//                 }}
//                 onPress={() => {
//                   onFetchUpdateAsync();
//                 }}
//               />
//             )}

//             {/* <DrawerItem
//                     <Drawer.Section style={styles.drawerSection}>
//                         <DrawerItem
//                             icon={({color, size}) => (
//                                 <Icon
//                                 name="home-outline"
//                                 color={color}
//                                 size={size}
//                                 />
//                             )}
//                             label="Home"
//                             onPress={() => {props.navigation.navigate('Home')}}
//                         />
//                         <DrawerItem
//                             icon={({color, size}) => (
//                                 <Icon
//                                 name="account-outline"
//                                 color={color}
//                                 size={size}
//                                 />
//                             )}
//                             label="Profile"
//                             onPress={() => {props.navigation.navigate('Profile')}}
//                         />
//                         <DrawerItem
//                             icon={({color, size}) => (
//                                 <AntIcon
//                                 name="google"
//                                 color={color}
//                                 size={size}
//                                 />
//                             )}
//                             label="Google Rating"
//                             onPress={() => {Linking.openURL('https://www.google.com/search?q=ts4u+28751+ryan+road&sxsrf=AOaemvLbk_QyZpcyGchcM3OZ9HSfqmEKSA%3A1637011637642&ei=tdCSYdfVJtfLrQGF24qAAQ&oq=ts4u+28751+ryan+road&gs_lcp=Cgdnd3Mtd2l6EAMyBQghEKABOggIABCwAxCRAjoICAAQgAQQsAM6CggAEIAEELADEAo6BwgAELADEB46BQgAEIAEOgQIABAeOgcIIRAKEKABSgQIQRgBUN0CWNpDYMZHaAFwAHgAgAGrAYgB9hCSAQQwLjE2mAEAoAEByAEKwAEB&sclient=gws-wiz&ved=0ahUKEwiXhJ7Jp5v0AhXXZSsKHYWtAhAQ4dUDCA4&uact=5#lrd=0x8824db1e09c791ff:0x875e1b3ada103a4b,3,,,')}}
//                         /> */}
//             {/* <DrawerItem
//                             icon={({color, size}) => (
//                                 <AntIcon
//                                 name="facebook-square"
//                                 color={color}
//                                 size={size}
//                                 />
//                             )}
//                             label="Facebook Rating"
//                             onPress={() => {Linking.openURL('https://www.facebook.com/ts4u.us/reviews/?ref=page_internal')}}
//                         /> */}
//             {/* <DrawerItem
//                             icon={({color, size}) => (
//                                 <Icon
//                                 name="bookmark-outline"
//                                 color={color}
//                                 size={size}
//                                 />
//                             )}
//                             label="Bookmarks"
//                             onPress={() => {props.navigation.navigate('BookmarkScreen')}}
//                         />
//                         <DrawerItem
//                             icon={({color, size}) => (
//                                 <Icon
//                                 name="cloud-upload-outline"
//                                 color={color}
//                                 size={size}
//                                 />
//                             )}
//                             label="Settings"
//                             onPress={() => {props.navigation.navigate('SettingsScreen')}}
//                         /> */}
//             {/* <DrawerItem
//               icon={({ color, size }) => (
//                 <Icon name="account-check-outline" color={color} size={size} />
//               )}
//               label="Support"
//               onPress={() => {
//                 props.navigation.navigate("Calender");
//               }}
//             /> */}
//           </Drawer.Section>
//           {/* <Drawer.Section title="Preferences">
//                         <TouchableRipple onPress={() => {toggleTheme()}}>
//                             <View style={styles.preference}>
//                                 <Text>Dark Theme</Text>
//                                 <View pointerEvents="none">
//                                     <Switch value={paperTheme.dark}/>
//                                 </View>
//                             </View>
//                         </TouchableRipple>
//                     </Drawer.Section> */}
//           <Divider />
//         </View>
//       </DrawerContentScrollView>
//       <View
//         style={{
//           borderTopWidth: 1,
//           borderTopColor: Colors.BorderColor,
//           width: '100%',
//         }}></View>
//       <DrawerItem
//         icon={({color, size}) => (
//           <Icon name="exit-to-app" color={'red'} size={size} />
//         )}
//         label="Sign Out"
//         onPress={() => {
//           signOut();
//         }}
//         labelStyle={{
//           fontFamily: CustomFonts.SEMI_BOLD,
//           color: 'red',
//         }}
//       />
//       <View
//         style={{
//           borderTopWidth: 1,
//           borderTopColor: Colors.BorderColor,
//           width: '100%',
//         }}></View>
//       <Caption
//         style={{
//           padding: 10,
//           color: Colors.Heading,
//           fontFamily: CustomFonts.MEDIUM,
//         }}>
//         Version: 3.0.1 {!environment.production && '(staging)'}
//       </Caption>
//     </View>
//   );
// }

// const getStyles = Colors =>
//   StyleSheet.create({
//     drawerContent: {
//       flex: 1,
//     },
//     userInfoSection: {
//       paddingLeft: 20,
//     },
//     title: {
//       fontSize: 16,
//       marginTop: 3,
//       lineHeight: 20,
//       color: Colors.Heading,
//       fontFamily: CustomFonts.SEMI_BOLD,
//     },
//     caption: {
//       fontSize: 12,
//       lineHeight: 14,
//       color: Colors.BodyText,
//       fontFamily: CustomFonts.REGULAR,
//     },
//     row: {
//       marginTop: 20,
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     section: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginRight: 15,
//     },
//     paragraph: {
//       fontWeight: 'bold',
//       marginRight: 3,
//     },
//     drawerSection: {
//       marginTop: 15,
//     },
//     bottomDrawerSection: {
//       marginBottom: 15,
//       // backgroundColor: "yellow",
//       // borderTopColor: "#f4f4f4",
//       // borderTopWidth: 1,
//     },
//     preference: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       paddingVertical: 12,
//       paddingHorizontal: 16,
//     },
//   });
