import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageView from "react-native-image-viewing";
import React, { useState } from "react";
import ReactNativeModal from "react-native-modal";
import { useTheme } from "../../../context/ThemeContext";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CrossCircle from "../../../assets/Icons/CrossCircle";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ImageViewModal = ({ isVisible = false, toggleModal = () => {}, attachments = [] }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const { top } = useSafeAreaInsets();
  const [viewImage, setViewImage] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({});

  const handleImageLayout = (uri, width, height) => {
    const aspectRatio = width / height;
    setImageDimensions((prev) => ({
      ...prev,
      [uri]: { aspectRatio },
    }));
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.White}
      backdropOpacity={1}
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      style={[styles.container, { paddingTop: top / 2 }]}
    >
      <TouchableOpacity
        onPress={() => {
          toggleModal();
        }}
        style={{
          position: "absolute",
          zIndex: 100,
          top: responsiveScreenHeight(3),
          right: responsiveScreenWidth(0),
        }}
      >
        <CrossCircle color={Colors.Heading} size={responsiveScreenFontSize(5)} />
      </TouchableOpacity>
      <ScrollView>
        <View style={{ gap: responsiveScreenHeight(3) }}>
          {attachments?.map((item) => {
            const { aspectRatio } = imageDimensions[item.url] || {};

            return (
              <TouchableOpacity
                onPress={() => {
                  setViewImage([{ uri: item.url }]);
                }}
                key={item._id}
              >
                <Image
                  source={{ uri: item.url }}
                  style={[
                    {
                      borderRadius: 7,
                      // height: responsiveScreenHeight(60),
                      // width: responsiveScreenWidth(90),
                    },
                    aspectRatio ? { aspectRatio } : { height: responsiveScreenHeight(20) },
                  ]}
                  resizeMode="contain"
                  onLoad={({ nativeEvent }) => handleImageLayout(item.url, nativeEvent.source.width, nativeEvent.source.height)}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <ImageView
          images={viewImage} // Array of image objects
          imageIndex={0}
          visible={viewImage.length > 0}
          onRequestClose={() => setViewImage([])} // Close the ImageView
        />
      </ScrollView>
    </ReactNativeModal>
  );
};

export default ImageViewModal;

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.White,
      position: "relative",
    },
    modal: {
      justifyContent: "center",
      alignItems: "center",
    },
  });
