import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import axios from "../utility/axiosInstance";
import { ScrollView } from "react-native-gesture-handler";
import color from "../constants/color";
import RenderHtml from "react-native-render-html";
import { useTheme } from "../context/ThemeContext";

const ContentDetails = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const [content, setContent] = useState(null);
  const [description, setDescription] = useState(``);
  const [isLoading, setIsLoading] = useState(false);
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  useEffect(() => {
    if (route?.params?.content) {
      setContent(route?.params?.content);
      navigation.setOptions({
        title: route.params.content?.name,
      });
    }
  }, [route, navigation]);

  useEffect(() => {
    if (content) {
      if (content?.description) {
        setDescription(content?.description);
      } else {
        setIsLoading(true);
        axios
          .get(`/content/getcontent/${content?._id}`)
          .then((res) => {
            setDescription(res.data.content?.description);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            Alert.alert(
              "Not Found",
              "Content not found or you have no access to it"
            );
          });
      }
    }
  }, [content]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.White,
        }}
      >
        <ActivityIndicator color={color.primary} animating={true} size={30} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <RenderHtml
        contentWidth={width}
        source={{ html: description }}
        enableExperimentalMarginCollapsing={true}
        tagsStyles={{
          p: {
            display: "flex",
            margin: 0,
            whiteSpace: "normal",
          },
          strong: {
            whiteSpace: "normal",
          },
        }}
      />
    </ScrollView>
  );
};

export default ContentDetails;

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: Colors.White,
    },
  });
