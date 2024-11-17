import { Alert, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import GallaryIcon from "../../assets/Icons/GallaryIcon";
import SendIconTwo from "../../assets/Icons/SendIconTwo";
import CrossCircle from "../../assets/Icons/CrossCircle"; // Assuming you have a CrossCircle icon
import axiosInstance from "../../utility/axiosInstance";
import { getHashtagTexts } from "../../utility/commonFunction";
import useUploadImage from "../../hook/useUploadImage";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";
import LoadingSmall from "../SharedComponent/LoadingSmall";
import { showToast } from "../HelperFunction";
import { handleGalleryPress, loadCommunityPosts } from "../../actions/chat-noti";
import * as ImagePicker from "expo-image-picker";
import { useGlobalAlert } from "../SharedComponent/GlobalAlertContext";
import CustomeBtn from "../AuthenticationCom/CustomeBtn";
import CustomIconButton from "../SharedComponent/CustomIconButton";
import AiIcon from "../../assets/Icons/AiIcon";
import { useNavigation } from "@react-navigation/native";
import AiModal from "../SharedComponent/AiModal/AiModal";
import AiIcon2 from "../../assets/Icons/AiIcon2";

const CreatePostButtonContainer = ({ post, setPost }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useGlobalAlert();
  const navigation = useNavigation();
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const extractTags = () => {
    setPost((pre) => ({ ...pre, tags: getHashtagTexts(pre.description) }));
  };

  const handlePost = () => {
    const title = post.title?.trim() || "";
    const description = post.description?.trim() || "";

    if (!title)
      return showAlert({
        title: "Empty Title",
        type: "warning",
        message: "Title cannot be empty.",
      });
    if (!description)
      return showAlert({
        title: "Empty Post",
        type: "warning",
        message: "Post cannot be empty.",
      });

    setCreating(true);

    axiosInstance
      .post("/content/community/post/create", {
        ...post,
        title,
        description,
        attachments: post.attachments || [],
      })
      .then((res) => {
        if (res.data.success) {
          console.log("res.data", JSON.stringify(res.data, null, 1));
          loadCommunityPosts({ page: 1, limit: 10 });
          setPost({ attachments: [], title: "", description: "", tags: [] });
          showToast("Posted...");
          setCreating(false);
        }
      })
      .catch((error) => {
        console.log("error from content community post create", JSON.stringify(error.response?.data || error.message, null, 1));
        setCreating(false);
      });
  };

  const removeImage = (uri) => {
    setPost((prevPost) => ({
      ...prevPost,
      attachments: prevPost.attachments?.filter((attachment) => attachment.url !== uri),
    }));
  };

  return (
    <>
      {post?.attachments?.length > 0 && (
        <View style={styles.selectedImagesContainer}>
          {post?.attachments?.map((item, index) => (
            <View key={`${item}_${index}`} style={styles.selectedImageContainer}>
              <Image style={styles.selectedImage} source={{ uri: item?.url }} />
              <TouchableOpacity onPress={() => removeImage(item.url)} style={styles.CrossCircle}>
                <CrossCircle color={"red"} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <CustomIconButton
          handlePress={() => handleGalleryPress({ setPost, setIsLoading })}
          title="Gallery"
          customContainerStyle={{
            flex: 0.3,
            height: 40,
            borderRadius: 4,
            marginTop: 0,
            backgroundColor: Colors.PurpleOpacity,
          }}
          isLoading={isLoading}
          disable={false}
          icon={<GallaryIcon color={Colors.Primary} />} // Expecting an icon component passed as prop
          iconPosition={"left"}
          background={Colors.PrimaryOpacityColor}
          color={Colors.Primary}
        />
        <CustomIconButton
          handlePress={() => {
            extractTags();
            handlePost();
          }}
          title="Publish"
          customContainerStyle={{
            flex: 0.3,
            height: 40,
            borderRadius: 4,
            marginTop: 0,
          }}
          isLoading={creating}
          disable={creating || isLoading}
          icon={<SendIconTwo color={creating || isLoading ? Colors.Primary : Colors.PureWhite} />} // Expecting an icon component passed as prop
          iconPosition={"left"} // Option to place icon on left or right
        />
        <CustomIconButton
          handlePress={() => {
            setAiModalVisible((pre) => !pre);
          }}
          title="AI"
          customContainerStyle={{
            flex: 0.3,
            height: 40,
            borderRadius: 4,
            marginTop: 0,
          }}
          isLoading={false}
          disable={false}
          icon={<AiIcon2 color={"white"} />} // Expecting an icon component passed as prop
          iconPosition={"left"} // Option to place icon on left or right
        />
      </View>
      <AiModal
        setState={(text) => setPost((pre) => ({ ...pre, description: text }))}
        post={post}
        isVisible={aiModalVisible}
        onCancelPress={() => setAiModalVisible(!aiModalVisible)}
      />
    </>
  );
};

export default CreatePostButtonContainer;

const getStyles = (Colors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: responsiveScreenFontSize(2),
      marginVertical: responsiveScreenHeight(1.5),
    },
    holidayButtonContainer: {
      width: responsiveScreenWidth(30),
      height: responsiveScreenHeight(5),
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: responsiveScreenWidth(4),
      gap: 8,
      borderRadius: responsiveScreenWidth(2),
      flex: 0.3,
    },
    holidayButtonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    disabledButton: {
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    disabledButtonText: {
      color: Colors.Primary,
    },
    selectedImagesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: responsiveScreenHeight(2),
    },
    selectedImageContainer: {
      position: "relative",
      marginRight: responsiveScreenWidth(3),
      marginBottom: responsiveScreenHeight(2),
      // backgroundColor: "red",
    },
    selectedImage: {
      width: responsiveScreenWidth(25),
      height: responsiveScreenHeight(15),
      borderRadius: responsiveScreenWidth(2),
    },
    CrossCircle: {
      position: "absolute",
      top: -12,
      right: -12,
      zIndex: 1,
    },
  });
