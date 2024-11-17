import React from 'react'
import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview'

const WebViewComp = ({ url }) => {
    return (
        <>
            <View style={{ aspectRatio: 16 / 9 }}>
                <WebView
                    source={{
                        html: `
                        <iframe src=${url} width="100%" height="100%" frameborder="0" allowFullScreen></iframe>
                    `
                    }}
                    onError={() => null}
                    allowsFullscreenVideo={true}
                    scrollEnabled={false}
                    automaticallyAdjustContentInsets={false}
                />
            </View>
        </>
    )
}

export default WebViewComp
