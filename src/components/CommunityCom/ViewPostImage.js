import {Pressable, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {Image} from 'react-native';
import ImageViewModal from './Modal/ImageViewModal';
import CustomFonts from '../../constants/CustomFonts';

const ViewPostImage = ({post}) => {
  const Colors = useTheme();
  const [imageDimensions, setImageDimensions] = useState({});
  const images = post?.attachments;
  const newImage = images?.length > 4 ? images?.slice(0, 4) : images;
  const imageCount = images?.length;
  const postCount = newImage?.length;
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const handleImagePress = () => {
    setIsImageModalVisible(!isImageModalVisible);
  };

  const handleImageLayout = (uri, width, height) => {
    const aspectRatio = width / height;
    setImageDimensions(prev => ({
      ...prev,
      [uri]: {aspectRatio},
    }));
  };

  return (
    <>
      {imageCount > 0 && (
        <View
          style={{
            width: '100%',
            // height: imageCount === 2 ? responsiveScreenHeight(26) : responsiveScreenHeight(50.5),
            flexDirection: imageCount === 1 ? 'column' : 'row',
            flexWrap: imageCount > 1 ? 'wrap' : 'nowrap',
            backgroundColor: Colors.Background_color,
            borderWidth: 1,
            overFlow: 'hidden',
            borderColor: Colors.BorderColor,
            borderRadius: 4,
            padding: 10,
            gap: 10,
          }}>
          {newImage?.map((item, index) => {
            const {aspectRatio} = imageDimensions[item.url] || {};

            return (
              <React.Fragment key={item._id}>
                <Pressable
                  onPress={handleImagePress}
                  style={{
                    // height: imageCount === 1 ? "100%" : responsiveScreenHeight(25) - 15,
                    width: imageCount === 1 ? '100%' : '48%',
                    position: 'relative',
                  }}>
                  <Image
                    source={{uri: item?.url}}
                    style={[
                      {
                        // height: "100%",
                        // width: "100%",
                      },
                      aspectRatio
                        ? {aspectRatio}
                        : {height: responsiveScreenHeight(20)},
                    ]}
                    resizeMode="cover"
                    onLoad={({nativeEvent}) =>
                      handleImageLayout(
                        item.url,
                        nativeEvent.source.width,
                        nativeEvent.source.height,
                      )
                    }
                  />
                  {imageCount > 4 && index === 3 && (
                    <View
                      style={{
                        position: 'absolute',
                        height: responsiveScreenHeight(25) - 15,
                        width: '100%',
                        backgroundColor: Colors.BackDropColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: CustomFonts.SEMI_BOLD,
                          fontSize: responsiveScreenFontSize(2.6),
                          color: Colors.PureWhite,
                        }}>
                        +{imageCount - 4}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}

          {isImageModalVisible && (
            <ImageViewModal
              attachments={images || []}
              isVisible={isImageModalVisible}
              toggleModal={handleImagePress}
            />
          )}
        </View>
      )}
    </>
  );
};

export default ViewPostImage;
