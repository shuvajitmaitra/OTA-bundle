import React, {useState, useCallback, useMemo} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ArrowRight from '../../assets/Icons/ArrowRight';
import NoDataIcon from '../../assets/Icons/NotDataIcon';
import Loading from '../SharedComponent/Loading';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import ImageView from 'react-native-image-viewing';

const UserModalImageGallery = ({media, isLoading}) => {
  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const handleSeeMore = useCallback(() => {
    setSeeMoreClicked(prev => !prev);
  }, []);

  const handleImageSelect = useCallback(itemUrl => {
    setSelectedImages([{uri: itemUrl}]);
  }, []);

  const displayedPhotos = useMemo(
    () => (seeMoreClicked ? media : media.slice(0, 9)),
    [seeMoreClicked, media],
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.galleryContainer}>
            {displayedPhotos.length > 0 ? (
              displayedPhotos.map((item, index) => (
                <TouchableOpacity
                  onPress={() => handleImageSelect(item.url)}
                  key={item.id || index}
                  style={styles.imageWrapper}>
                  <Image style={styles.image} source={{uri: item.url}} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noDataContainer(Colors)}>
                <NoDataIcon />
              </View>
            )}
          </View>

          {media.length > 9 && (
            <TouchableOpacity
              onPress={handleSeeMore}
              style={styles.seeMoreButton}>
              <Text style={styles.seeMoreText}>
                {seeMoreClicked ? 'See Less' : 'See More'}
              </Text>
              <ArrowRight />
            </TouchableOpacity>
          )}
        </>
      )}
      <ImageView
        images={selectedImages}
        imageIndex={0}
        visible={selectedImages.length > 0}
        onRequestClose={() => setSelectedImages([])}
      />
    </>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    galleryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingTop: responsiveScreenHeight(2),
      borderTopColor: Colors.BorderColor,
      borderTopWidth: 1,
      justifyContent: 'space-between',
      gap: 10,
    },
    imageWrapper: {
      marginBottom: responsiveScreenHeight(2),
    },
    image: {
      height: 120,
      width: responsiveScreenWidth(28),
      resizeMode: 'cover',
      borderRadius: 8,
      backgroundColor: Colors.LightGreen,
    },
    noDataContainer: Colors => ({
      minHeight: responsiveScreenHeight(30),
      minWidth: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.LightGreen,
      borderRadius: 10,
      marginBottom: responsiveScreenHeight(2),
    }),
    seeMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(2),
    },
    seeMoreText: {
      color: 'rgba(39, 172, 31, 1)',
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
  });

export default UserModalImageGallery;
