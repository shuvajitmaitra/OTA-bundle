import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export async function registerForPushNotificationsAsync(user, dispatch, axios) {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
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
    alert(
      "Must use physical device for Push Notifications from notification service"
    );
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
  console.log({ token });
  return token?.data || token;
}

export function useNotificationListeners(user, dispatch, axios, navigation) {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const registerAndListenForNotifications = async () => {
      const token = await registerForPushNotificationsAsync(
        user,
        dispatch,
        axios
      );

      notificationListener.current =
        Notifications.addNotificationReceivedListener(async (notification) => {
          let currentCount = await Notifications.getBadgeCountAsync();
          await Notifications.setBadgeCountAsync(currentCount + 1);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          let data = response.notification?.request?.content?.data;
          console.log(
            "data from notification service",
            JSON.stringify(data, null, 1)
          );
          if (data?.path === "message") {
            navigation.navigate("NewMessageScreen", {
              chatId: data.chatId,
              name: data.name,
              image: data.image,
            });
          }
          if (data?.path === "thread") {
            navigation.navigate("message-thread", {
              messageId: data.messageId,
              fromNoti: true,
            });
          }
        });

      if (!user.pushTokens.includes(token)) {
        axios
          .post("/user/sync-pushtoken", { pushToken: token })
          .then((res) => {
            console.log(res.data.user);
            dispatch(setUser(res.data.user));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    if (user.isAuthenticated) {
      registerAndListenForNotifications();
    }

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [user, dispatch, axios]);
}
