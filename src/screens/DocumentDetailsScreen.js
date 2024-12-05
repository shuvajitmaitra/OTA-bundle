import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import RenderHtml from 'react-native-render-html';
import AIcon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../context/ThemeContext';
const DocumentDetailsScreen = ({route, navigation}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {width} = useWindowDimensions();
  const [content, setContent] = useState(null);
  const [description, setDescription] = useState('');
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

  return (
    <ScrollView style={styles.container}>
      <RenderHtml contentWidth={width - 10} source={{html: description}} />

      <View style={styles.contentContainer}>
        {content &&
          content?.attachment.map((att, i) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(att)}
              style={styles.downloadButton}
              activeOpacity={0.5}>
              <AIcon size={15} color={Colors.Primary} name="download" />
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
    contentContainer: {
      paddingBottom: 20,
    },
    downloadButton: {
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      borderRadius: 5,
      padding: 5,
      flexDirection: 'row',
      marginBottom: 10,
    },
    container: {
      padding: 10,
      backgroundColor: Colors.Background_color,
      paddingBottom: 20,
    },
  });
