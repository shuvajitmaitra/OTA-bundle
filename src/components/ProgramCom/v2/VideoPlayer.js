import { StyleSheet, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";
import { responsiveScreenWidth } from "react-native-responsive-dimensions";

export default function VideoPlayer({ url }) {
  return (
    <View style={styles.videoContainer}>
      <WebView
        source={{ uri: url }}
        allowsFullscreenVideo={true}
        scrollEnabled={false}
        automaticallyAdjustContentInsets={false}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    aspectRatio: 16 / 9,
    marginHorizontal: responsiveScreenWidth(4),
    borderRadius: 10,
    overflow: "hidden",
  },
});
