import React, {useState, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ArrowRight from '../../assets/Icons/ArrowRight'; // Ensure correct path
import NoDataIcon from '../../assets/Icons/NotDataIcon'; // Ensure correct path
import Loading from '../SharedComponent/Loading'; // Ensure correct path
import {useTheme} from '../../context/ThemeContext'; // Ensure correct path
import CustomFonts from '../../constants/CustomFonts'; // Ensure correct path
import ImageView from 'react-native-image-viewing';

const UserModalImageGallery = ({media, isLoading}) => {
  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Toggle the "See More" state
  const handleSeeMore = useCallback(() => {
    setSeeMoreClicked(prev => !prev);
  }, []);

  // Handle image selection to open in ImageView
  const handleImageSelect = useCallback(itemUrl => {
    setSelectedImages([{uri: itemUrl}]);
  }, []);

  // Determine which photos to display based on "See More" state
  const displayedPhotos = useMemo(
    () => (seeMoreClicked ? media : media.slice(0, 9)),
    [seeMoreClicked, media],
  );

  // Render each image item
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handleImageSelect(item.url)}
      key={item.id || item.url}
      style={styles.imageWrapper}
      accessibilityLabel={`Image ${item.id || item.url}`}>
      <Image
        style={styles.image}
        source={{uri: item.url}}
        onError={error => {
          console.error(`Failed to load image ${item.url}`, error);
          // Optionally, set a fallback image here
        }}
      />
    </TouchableOpacity>
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {displayedPhotos.length > 0 ? (
            <FlatList
              data={displayedPhotos}
              renderItem={renderItem}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.galleryContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <NoDataIcon />
            </View>
          )}

          {media.length > 9 && (
            <TouchableOpacity
              onPress={handleSeeMore}
              style={styles.seeMoreButton}>
              <Text style={styles.seeMoreText}>
                {seeMoreClicked ? 'See Less' : 'See More'}
              </Text>
              {/* <ArrowRight /> */}
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
      paddingTop: responsiveScreenHeight(2),
      // paddingHorizontal: responsiveScreenWidth(2),
      borderTopColor: Colors.LineColor,
      borderTopWidth: 1,
    },
    columnWrapper: {
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    imageWrapper: {
      flex: 1 / 3, // Each image takes up one-third of the row
      aspectRatio: 1, // Ensures the image is square
      marginHorizontal: 5, // Adjusts horizontal spacing
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: Colors.LightGreen,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    noDataContainer: {
      minHeight: responsiveScreenHeight(30),
      minWidth: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.LightGreen,
      borderRadius: 10,
      marginVertical: responsiveScreenHeight(2),
      padding: responsiveScreenWidth(4),
    },
    seeMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
