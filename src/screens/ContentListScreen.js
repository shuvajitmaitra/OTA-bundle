import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import axios from "../utility/axiosInstance";
import { useSelector } from "react-redux";
import color from "../constants/color";
import { ScrollView } from "react-native-gesture-handler";
import { Caption, Searchbar, Subheading } from "react-native-paper";
import moment from "moment";
import FIcon from "react-native-vector-icons/FontAwesome5";
import { useTheme } from "../context/ThemeContext";

const ContentListScreen = ({ route, navigation }) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("Not submitted");
  const [rejectReason, setRejectReason] = useState("");
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
    });
  }, [route, navigation]);

  useEffect(() => {
    if (!isAuthenticated || !route?.params?.pageKey) return;
    (async () => {
      try {
        let url = "/content/labcontent";
        if (route?.params?.pageKey !== "labcontent") {
          url = `/content/getbycourse/${route?.params?.pageKey}`;
        }
        setIsLoading(true);
        let rescontent = await axios.get(url);
        setContents(rescontent.data.contents);
        setRecords(rescontent.data.contents);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    })();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={color.primary} animating={true} size={50} />
      </View>
    );
  }

  const handleFilter = (value) => {
    if (value == "") {
      setContents(records);
    } else {
      setContents(
        records?.filter((c) =>
          c.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <>
      <ScrollView style={styles.wrapper}>
        <TouchableOpacity style={styles.card}>
          <Searchbar
            placeholder="Search"
            onChangeText={handleFilter}
            // value={searchQuery}
          />
        </TouchableOpacity>

        {contents?.length > 0 &&
          contents.map((content, i) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("ContentDetails", { content })}
              style={styles.card}
              key={i}
              activeOpacity={0.5}
            >
              <View style={{ width: "90%" }}>
                <Subheading>{content?.name}</Subheading>
                <Caption>{moment(content.createdAt).fromNow()}</Caption>
              </View>
              <FIcon size={20} name="chevron-right" />
            </TouchableOpacity>
          ))}

        <View style={{ height: 150 }}></View>
      </ScrollView>
    </>
  );
};

const getStyles = (Colors) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.White,
    },
    wrapper: {
      padding: 10,
    },
    card: {
      backgroundColor: Colors.White,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 1,
      elevation: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
  });

export default ContentListScreen;
