import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import GalleryIcon from '../../assets/Icons/GalleryIcon';
import {useTheme} from '../../context/ThemeContext';
import FileIcon from '../../assets/Icons/FileIcon';
import FolderIcon from '../../assets/Icons/FolderIcon';
import FolderIconTwo from '../../assets/Icons/FolderIconTwo';
import {useDispatch} from 'react-redux';
import {setIsBoxShowing} from '../../store/reducer/chatReducer';
import CameraIcon from '../../assets/Icons/CameraIcon';
import EmojiIcon from '../../assets/Icons/EmojiIcon';
import CustomFonts from '../../constants/CustomFonts';
import Camera from '../SharedComponent/Camera';

const AttachmentItem = ({
  galleryOpenFunction,
  closePopover,
  pickDocument,
  handleSendCapturedPhoto,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setIsCameraOpen(!isCameraOpen);
        }}
        style={styles.galleryButton}>
        <View style={styles.iconContainer}>
          <CameraIcon size={25} />
        </View>
        <Text style={styles.buttonText}>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closePopover();
          galleryOpenFunction();
        }}
        style={styles.galleryButton}>
        <View style={styles.iconContainer}>
          <GalleryIcon size={25} />
        </View>
        <Text style={styles.buttonText}>Images</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // closePopover();
          pickDocument();
        }}
        style={styles.galleryButton}>
        <View style={styles.iconContainer}>
          <FolderIconTwo size={25} />
        </View>
        <Text style={styles.buttonText}>Files</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closePopover();
          Alert?.alert('Coming soon...');
        }}
        style={styles.galleryButton}>
        <View style={styles.iconContainer}>
          <EmojiIcon size={25} />
        </View>
        <Text style={styles.buttonText}>Emoji</Text>
      </TouchableOpacity>

      {isCameraOpen && (
        <Camera
          isVisible={isCameraOpen}
          toggleCamera={() => {
            setIsCameraOpen();
            closePopover();
          }}
          handleSendCapturedPhoto={handleSendCapturedPhoto}
        />
      )}
    </View>
  );
};

export default AttachmentItem;

const getStyles = Colors =>
  StyleSheet.create({
    buttonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
    },
    iconContainer: {
      backgroundColor: Colors.CyanOpacity,
      padding: 15,
      borderRadius: 100,
    },
    galleryButton: {
      // width: responsiveScreenWidth(10),
      // height: responsiveScreenWidth(10),
      // backgroundColor: Colors.Red,
      justifyContent: 'flex-start',
      alignItems: 'center',
      // borderRadius: 100,
      // flexDirection: "row",
      // marginRight: responsiveScreenWidth(5),
      gap: 5,
      width: responsiveScreenWidth(17),
    },
    container: {
      position: 'absolute',
      minHeight: 100,
      minWidth: 100,
      borderRadius: 10,
      flexDirection: 'row',
      gap: 20,
      padding: 20,
      flexWrap: 'wrap',
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(78),
      // justifyContent: "center",
      paddingHorizontal: responsiveScreenWidth(8.8),
    },
  });
