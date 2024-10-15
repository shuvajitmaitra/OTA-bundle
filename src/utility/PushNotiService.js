import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as Notifications from "expo-notifications";
import axios from "../utility/axiosInstance";
import * as Device from "expo-device";
import { setUser } from "../store/reducer/authReducer";
import { useNavigation } from "@react-navigation/native";
import store from "../store";
import { setSelectedMessageScreen } from "../store/reducer/ModalReducer";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  try {
    let token;
    if (Device?.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: "e8784d85-47f4-4b75-934f-91db83637504",
      });
    } else {
      console.log("Must use physical device for Push Notifications from push notification service");
      return;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token?.data || token;
  } catch (error) {
    console.log(error, "error from register push token");
    return null;
  }
}

const PushNotiService = () => {
  const { user, isAuthenticated } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    try {
      if (isAuthenticated) {
        registerForPushNotificationsAsync().then(async (token) => {
          if (!token) return;

          notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
            let currentCount = await Notifications?.getBadgeCountAsync();
            await Notifications?.setBadgeCountAsync(currentCount + 1);
          });

          responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            let data = response?.notification?.request?.content?.data;
            // console.log("data..........................................", JSON.stringify(data, null, 1));

            // if (data?.path === "message") {
            //   navigation?.navigate("messageScreen", {
            //     chatId: data?.chatId,
            //     name: data?.name,
            //     image: data?.image,
            //   });
            // } else if (data?.path === "thread") {
            //   navigation.navigate("message-thread", {
            //     messageId: data?.messageId,
            //     fromNoti: true,
            //   });
            // } else {
            //   navigation?.navigate("NewChatScreen");
            // }
            if (data.path === "message") {
              store.dispatch(
                setSelectedMessageScreen({
                  chatId: data?.chatId,
                  name: data?.name,
                  image: data?.image,
                })
              );
            }
          });

          if (!user?.pushTokens?.includes(token)) {
            axios
              .post("/user/sync-pushtoken", { pushToken: token })
              .then((res) => {
                dispatch(setUser(res?.data?.user));
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });

        return () => {
          if (notificationListener.current) {
            Notifications.removeNotificationSubscription(notificationListener.current);
          }
          if (responseListener.current) {
            Notifications.removeNotificationSubscription(responseListener.current);
          }
        };
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [isAuthenticated, user]);

  return null;
};

export default PushNotiService;
