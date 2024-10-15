// import * as React from "react";
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import { Video, ResizeMode } from "expo-av";
// import { MaterialIcons } from "@expo/vector-icons"; // Ensure you have expo-vector-icons installed
// import { useTheme } from "../../context/ThemeContext";
// import { useVideoPlayback } from "../../context/VideoPlaybackContext";

// const CustomVideoPlayer = ({
//   url,
//   thumbnailUrl = null,
//   id,
//   fullScreenRight,
// }) => {
//   const video = React.useRef(null);
//   const [status, setStatus] = React.useState({});
//   // console.log(JSON.stringify(status, null, 1));
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [showControls, setShowControls] = React.useState(true);
//   const [timeoutId, setTimeoutId] = React.useState(null);
//   const { playingVideo, setPlayingVideo } = useVideoPlayback();

//   // --------------------------
//   // ----------- Import theme Colors -----------
//   // --------------------------
//   const Colors = useTheme();
//   const styles = getStyles(Colors);

//   // --------------------------
//   // ----------- Video play-pause -----------
//   // --------------------------

//   // const togglePlayback = () => {
//   //   if (status.didJustFinish) {
//   //     video.current.playFromPositionAsync(0).then(() => {
//   //       setShowControls(false);
//   //     });
//   //   }
//   //   if (status.isPlaying) {
//   //     video.current.pauseAsync();
//   //   } else {
//   //     video.current.playAsync();
//   //   }
//   //   const newTimeoutId = setTimeout(() => {
//   //     setShowControls(false);
//   //   }, 1000);
//   //   setTimeoutId(newTimeoutId);
//   // };

//   const togglePlayback = () => {
//     if (status.didJustFinish) {
//       video.current.playFromPositionAsync(0).then(() => {
//         setTimeout(() => {
//           setShowControls(false);
//         }, 1000);
//       });
//     }
//     if (playingVideo !== id) {
//       setPlayingVideo(id);
//       video.current.playAsync();
//     } else if (status.isPlaying) {
//       video.current.pauseAsync();
//     } else {
//       video.current.playAsync();
//     }

//     const newTimeoutId = setTimeout(() => {
//       setShowControls(false);
//     }, 50000);
//     setTimeoutId(newTimeoutId);
//   };

//   // Effect to pause this video if another one starts playing
//   React.useEffect(() => {
//     if (playingVideo !== id && status.isPlaying) {
//       // console.log(JSON.stringify(id, null, 1));

//       video.current.pauseAsync();
//     }
//   }, [playingVideo, id, status.isPlaying]);

//   // --------------------------
//   // ----------- Video control show -----------
//   // --------------------------
//   const toggleControls = () => {
//     setShowControls(true);

//     if (timeoutId) {
//       clearTimeout(timeoutId);
//     }

//     const newTimeoutId = setTimeout(() => {
//       setShowControls(false);
//     }, 5000);

//     setTimeoutId(newTimeoutId);
//   };

//   React.useEffect(() => {
//     if (status.didJustFinish) {
//       setShowControls(true);
//     }
//   }, [status.didJustFinish]);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         style={styles.videoContainer}
//         onPress={toggleControls}
//       >
//         <Video
//           ref={video}
//           style={styles.video}
//           source={{
//             uri: `${url.includes("https://") ? url : "https://" + url}`,
//           }}
//           useNativeControls={false}
//           resizeMode={ResizeMode.CONTAIN}
//           isLooping={false}
//           onPlaybackStatusUpdate={(statusUpdate) => {
//             setStatus(statusUpdate);
//             setIsLoading(statusUpdate.isBuffering);
//           }}
//           posterSource={{ uri: thumbnailUrl }}
//         />
//         {!status.isPlaying && (
//           <Image
//             source={{ uri: thumbnailUrl }}
//             style={StyleSheet.absoluteFillObject}
//           />
//         )}
//         {showControls && (
//           <View style={styles.controls}>
//             {isLoading || !status?.isLoaded ? (
//               <ActivityIndicator
//                 color={Colors.PureWhite}
//                 animating={true}
//                 size="large"
//                 style={{ marginRight: 5 }}
//               />
//             ) : (
//               <TouchableOpacity
//                 onPress={togglePlayback}
//                 style={styles.controlButton}
//               >
//                 <MaterialIcons
//                   name={
//                     status.didJustFinish
//                       ? "replay"
//                       : status.isPlaying
//                       ? "pause"
//                       : "play-arrow"
//                   }
//                   size={36}
//                   color={Colors.PureWhite}
//                 />
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => video.current.presentFullscreenPlayer()}
//               style={[
//                 styles.fullscreenButton,
//                 { right: fullScreenRight || 10 },
//               ]}
//             >
//               <MaterialIcons name="fullscreen" size={26} color="white" />
//             </TouchableOpacity>
//           </View>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default CustomVideoPlayer;

// const getStyles = (Colors) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       position: "relative",
//     },
//     videoContainer: {
//       alignSelf: "center",
//       width: 320,
//       height: 200,
//       backgroundColor: "black", // Set background color to black for better video visibility
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     video: {
//       width: "100%",
//       height: "100%",
//     },
//     controls: {
//       position: "absolute",
//       flexDirection: "row",
//       justifyContent: "center",
//       alignItems: "center",
//       width: "100%",
//       height: "100%",
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//       // backgroundColor: "red",
//     },
//     controlButton: {
//       padding: 10,
//       backgroundColor: Colors.PrimaryOpacityColor,
//       borderRadius: 100,
//     },
//     fullscreenButton: {
//       position: "absolute",
//       bottom: 10,
//       right: 10,
//       // backgroundColor: "red",
//     },
//   });
