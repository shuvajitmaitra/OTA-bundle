import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import ArrowRight from "../../assets/Icons/ArrowRight";
import NoDataIcon from "../../assets/Icons/NotDataIcon";
import Loading from "../SharedComponent/Loading";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../utility/axiosInstance";
import CustomeFonts from "../../constants/CustomeFonts";
import ImageView from "react-native-image-viewing";

export default function UserModalImageGallery({ chat }) {
  const [media, setMedia] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`/chat/media/${chat?._id}`, {
          limit: 50,
          type: "image",
        });
        if (response.data && Array.isArray(response.data.medias)) {
          const reversedMedias = [...response.data.medias].reverse();
          setMedia(reversedMedias);
        } else {
          setMedia([]);
        }
      } catch (error) {
        console.error("Failed to fetch media:", error.message);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chat?._id]);

  const handleSeeMore = useCallback(() => {
    setSeeMoreClicked((prev) => !prev);
  }, []);

  const handleImageSelect = useCallback((itemUrl) => {
    setSelectedImages([{ uri: itemUrl }]);
  }, []);

  const allPhotos = useMemo(
    () => (seeMoreClicked ? media : media.slice(0, 9)),
    [seeMoreClicked, media]
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: responsiveScreenWidth(2.5),
              paddingTop: responsiveScreenHeight(2),
              borderTopColor: Colors.BorderColor,
              borderTopWidth: 1,
            }}
          >
            {allPhotos?.length ? (
              allPhotos?.map((item, index) => (
                <TouchableOpacity
                  onPress={() => setSelectedImages([{ uri: item?.url }])}
                  key={index}
                >
                  <Image
                    key={index}
                    style={{
                      height: responsiveScreenWidth(28),
                      width: responsiveScreenWidth(25),
                      resizeMode: "cover",
                    }}
                    source={{ uri: item.url }}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View
                style={{
                  minHeight: responsiveScreenHeight(30),
                  minWidth: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.LightGreen,
                  borderRadius: 10,
                  marginBottom: responsiveScreenHeight(2),
                }}
              >
                <NoDataIcon />
              </View>
            )}
          </View>

          {media?.length > 9 && (
            <TouchableOpacity
              onPress={() => handleSeeMore()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: responsiveScreenWidth(2),
                paddingVertical: responsiveScreenHeight(2),
              }}
            >
              <Text
                style={{
                  color: "rgba(39, 172, 31, 1)",
                  fontFamily: CustomeFonts.SEMI_BOLD,
                  fontSize: responsiveScreenFontSize(1.8),
                }}
              >
                {seeMoreClicked ? "See Less" : "See More"}
              </Text>
              <ArrowRight />
            </TouchableOpacity>
          )}
        </>
      )}
      <ImageView
        images={selectedImages}
        imageIndex={0}
        visible={selectedImages?.length !== 0}
        onRequestClose={() => setSelectedImages([])}
      />
    </>
  );
}

const getStyles = (Colors) => StyleSheet.create({});
