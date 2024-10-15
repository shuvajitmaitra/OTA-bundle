// import React, { Component } from "react";

// import axios from "axios";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// //import {setToast} from './ToastMsg'
// import store from "../store";
// import { View, Text } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const configureAxiosHeader = async () => {
//   axios.defaults.baseURL = 'https://api.ts4u.us/api'
//   const token = await AsyncStorage.getItem('user_token');
//   if (token) {
//     axios.defaults.headers.common = {
//       Authorization: token,
//     };
//   }

// };

// const loadChats = () => {
//   axios.get('/chat/mychats')
//     .then(res => {
//       store.dispatch({
//         type: "SET_CHATS",
//         payload: res.data.chats
//       })
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }

// const loadNotifications = () => {
//   axios.get('/notification/mynotifications')
//     .then(res => {
//       store.dispatch({
//         type: "SET_NOTIFICATIONS",
//         payload: res.data.notifications
//       })
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }

// //export let socket

// const withAuth = (AuthComponent) => {
//   return class Authenticated extends Component {

//     constructor(props) {
//       super(props);
//       this.state = {
//         isLoading: false,
//         userData: [],
//       };
//     }

//     async componentDidMount() {

//       configureAxiosHeader();

//       const token = await AsyncStorage.getItem('user_token');
//       //console.log(token);
//       if (token) {
//         this.setState({ isLoading: true });
//         axios
//           // eslint-disable-next-line no-undef
//           .post(`https://api.ts4u.us/api/user/verify`, {})
//           .then(async (res) => {
//             if (res.status === 200 && res.data.success) {
//               //   loadChats()
//               //   loadNotifications()
//               //   //do some change state
//               //   var options = {
//               //     rememberUpgrade: true,
//               //     transports: ['websocket'],
//               //     secure: true,
//               //     rejectUnauthorized: false
//               //   }

//               //   //socket = io(process.env.NEXT_PUBLIC_API_URL.split('/api')[0],options);
//               //   socket = io("https://api-staging.ts4u.us",options);
//               //   //console.log(socket);

//               //   socket.emit("online",{id:res.data.user?._id})

//               this.setState({ userData: res.data.user });
//               this.setState({ isLoading: false });
//               store.dispatch({
//                 type: "SET_USER",
//                 payload: res.data.user
//               })

//               // let findActive = await storage.getItem("active_enrolment");
//               // let approved = res.data.enrollments?.filter(x => x?.status === 'approved' || x?.status === 'trial');

//               // // Extract the approved IDs for easier checks later
//               // let approvedIds = approved?.map(x => x?._id);

//               // console.log(approvedIds);

//               //  // 1. If approved?.length is 0
//               //  if (!approved?.length) {

//               //   await AsyncStorage.setItem("active_enrolment", {}); // setting in local storage as per previous point
//               //   // window.location.pathname = '/';
//               //   // return; // Exit here
//               // }

//               // // New condition: If approved?.length is 1
//               // if (approved?.length === 1 && !findActive?._id) {
//               //   await AsyncStorage.setItem("active_enrolment", approved[0]);
//               //   // window.location.pathname = '/';
//               //   // return; // Exit here
//               // }

//               // // 2. If approved?.length > 0 and findActive is found and findActive belongs to approved
//               // if (findActive?._id && approvedIds?.includes(findActive?._id)) {
//               //   let enrollment = approved?.find(x => x?._id === findActive?._id)
//               //   AsyncStorage.dispatch(setEnrollment(enrollment))
//               //   // window.location.pathname = '/';
//               //   // return; // Exit here
//               // }

//               // // 3. If findActive doesn't belong to approved
//               // if (findActive?._id && !approvedIds?.includes(findActive?._id)) {
//               //   await AsyncStorage.setItem("active_enrolment", {});
//               //   if (window.location.pathname !== '/enrollment-status') {
//               //     window.location.pathname = '/enrollment-status'
//               //   }
//               //   return; // Exit here
//               // }

//               // // 5. If there are multiple approved and no findActive is found
//               // if (approved?.length > 0 && !findActive?._id) {
//               //   if (window.location.pathname !== '/enrollment-status') {
//               //     window.location.pathname = '/enrollment-status'
//               //   }
//               //   return
//               // }

//             }
//           })
//           .catch((err) => {
//             this.setState({ isLoading: false });
//             // err && err.response && console.log(err.response.data.error, "error")
//             // Cookies.remove("ts4u_token");
//             err && err.response.data && err.response.data.error && alert(err.response.data.error)
//             store.dispatch({
//               type: "LOGOUT"
//             })
//             //console.log(window.location.pathname)
//             //   if(window.location.pathname !== '/login'){
//             //     window.location.pathname='/login'
//             //   }
//             //window.location.pathname='/login'
//           });
//       }

//     }

//     render() {
//       return (
//         <View>
//           {this.state.isLoading ? (
//             <View>
//               <Text>Loading</Text>
//             </View>
//           ) : (
//             <AuthComponent {...this.props} userData={this.state.userData} >{this.props.children}</AuthComponent>
//           )}
//         </View>
//       );
//     }
//   };
// };
// export default withAuth;
