import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import CrossCircle from "../../assets/Icons/CrossCircle";
import CrossIcon from "../../assets/Icons/CrossIcon";
import {
  responsiveScreenWidth,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import RefreshIcon from "../../assets/Icons/RefreshIcon";
import { useTheme } from "../../context/ThemeContext";

const CameraScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [gallery, setGallery] = useState([]);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("photo", JSON.stringify(photo, null, 1));
      // const asset = await MediaLibrary.createAssetAsync(photo.uri);
      // console.log("asset", JSON.stringify(asset, null, 1));
      setGallery([photo.uri, ...gallery]);
    }
  };

  console.log("gallery", JSON.stringify(gallery, null, 1));
  return (
    <SafeAreaView style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <View style={styles.firstContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.crossButton}
            >
              <CrossIcon color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.RefreshIconContainer}
              onPress={toggleCameraFacing}
            >
              <RefreshIcon />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={takePicture}
            style={styles.snapButtonContainer}
          >
            <View style={styles.snapButton}></View>
          </TouchableOpacity>
        </View>
        {gallery?.length > 0 && (
          <ScrollView horizontal style={styles.galleryContainer}>
            {gallery.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item }}
                style={styles.galleryImage}
              />
            ))}
          </ScrollView>
        )}
      </CameraView>
    </SafeAreaView>
  );
};

const getStyles = (Colors) =>
  StyleSheet.create({
    firstContainer: {
      // backgroundColor: "green",
      justifyContent: "space-between",
    },
    crossButton: {
      // marginLeft: responsiveScreenWidth(4),
      padding: 20,
    },
    RefreshIconContainer: {
      // flex: 0.1,
      alignSelf: "flex-end",
      alignItems: "center",
      backgroundColor: "black",
      borderRadius: 100,
      padding: 10,
      margin: 20,
    },
    snapButtonContainer: {
      flex: 0.1,
      flexDirection: "row",
      // backgroundColor: "yellow",
      borderRadius: 5,
      padding: 10,
      margin: 20,
      position: "absolute",
      bottom: 0,
      width: "90%",
      justifyContent: "center",
    },
    button: {
      flex: 0.1,
      alignSelf: "flex-end",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 5,
      padding: 10,
      margin: 20,
    },
    galleryContainer: {
      flex: 1,
      backgroundColor: "transparent",
      maxHeight: 120,
    },
    galleryImage: {
      width: 100,
      height: 100,
      margin: 5,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "white",
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: "row",
      // backgroundColor: "red",
      // margin: 15,
      position: "relative",
    },
    button: {
      flex: 1,
      alignSelf: "flex-end",
      alignItems: "center",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
    snapButton: {
      height: 70,
      width: 70,
      borderRadius: 100,
      borderWidth: 5,
      borderColor: Colors.WhiteOpacityColor,
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
      backgroundColor: "white",
    },
  });

export default CameraScreen;
