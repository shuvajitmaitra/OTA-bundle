import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  useWindowDimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import color from '../constants/color';
import RenderHtml from 'react-native-render-html';
import AIcon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../context/ThemeContext';
const DocumentDetailsScreen = ({route, navigation}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {width} = useWindowDimensions();
  const [content, setContent] = useState(null);
  const [description, setDescription] = useState(``);
  const [isLoading, setIsLoading] = useState(false);
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
      }
    }
  }, [content]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.White,
        }}>
        <ActivityIndicator color={color.primary} animating={true} size={30} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <RenderHtml contentWidth={width - 10} source={{html: description}} />

      <View style={{paddingBottom: 20}}>
        {content &&
          content?.attachment.map((att, i) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(att)}
              style={{
                borderColor: Colors.BorderColor,
                borderWidth: 1,
                borderRadius: 5,
                padding: 5,
                flexDirection: 'row',
                marginBottom: 10,
              }}
              activeOpacity={0.5}>
              <AIcon size={15} color={color.primary} name="download" />
              <Text> {att.split('/').pop()}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
};

export default DocumentDetailsScreen;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: color.bg,
      paddingBottom: 20,
    },
  });
