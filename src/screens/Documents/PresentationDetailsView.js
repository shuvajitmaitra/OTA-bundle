import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  StatusBar,
  Image,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import RenderHtml from 'react-native-render-html';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import {useTheme} from '../../context/ThemeContext';
// import HTMLView from 'react-native-htmlview';
import CommentSection from '../../components/CommentCom/CommentSection';

export default function PresentationDetailsView({route}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const params = route.params;
  const [isLoading, setIsLoading] = React.useState(true);
  const [content, setContent] = React.useState();
  const [slides, setSlides] = useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let content = await axiosInstance.get(
          `/content/getcontent/${params?.contentId}`,
        );
        setContent(content.data.content?.description);
        setSlides(content.data?.content?.slide?.slides);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    })();
  }, []);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.White,
        }}>
        <ActivityIndicator size={50} animating={true} color={Colors.Primary} />
      </View>
    );
  }

  const tagsStyles = {
    h1: {
      color: Colors.Heading,
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(2),
    },
    p: {
      color: Colors.Red,
      display: 'flex',
      margin: 0,
      whiteSpace: 'normal',
      fontSize: responsiveScreenFontSize(0),
      textAlign: 'justify',
    },
    strong: {
      whiteSpace: 'normal',
      fontWeight: 'bold',
    },
    ul: {
      paddingLeft: 20,
    },
    li: {
      fontSize: 18,
    },
    span: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      textAlign: 'justify',
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(10),
      whiteSpace: 'normal',
    },
    img: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '100%',
      height: 'auto',
    },
  };

  // const renderers = {
  //   img: (htmlAttribs) => {
  //     const { src, alt } = htmlAttribs;
  //     return (
  //       <Image
  //         source={{
  //           uri: src,
  //         }}
  //         style={{ width: "100%", height: 200, resizeMode: "contain" }}
  //         accessibilityLabel={alt}
  //       />
  //     );
  //   },
  // };
  // console.log("slides", JSON.stringify(slides, null, 1));
  console.log('content', JSON.stringify(content, null, 1));
  return (
    <View style={styles.container}>
      <ScrollView>
        <RenderHtml
          contentWidth={responsiveScreenWidth(100)}
          source={{html: content}}
          enableExperimentalMarginCollapsing={true}
          defaultTextProps={{
            style: {
              color: Colors.BodyText,
              fontSize: responsiveFontSize(1.6),
              marginTop: 20,
            },
          }}
          tagsStyles={{
            body: {
              color: Colors.BodyText, // Sets default color for untagged text
              margin: 0,
              whiteSpace: 'normal',
            },
            h1: {
              color: Colors.Heading,
              // color: "red",
            },
            p: {
              color: Colors.BodyText,
              display: 'flex',
              margin: 0,
              whiteSpace: 'normal',
            },
            strong: {
              whiteSpace: 'normal',
            },
          }}
        />
        {slides?.map(item => {
          return (
            <View key={item._id}>
              {/* <RenderHtml
                contentWidth={responsiveScreenHeight(100)}
                source={{ html: item.content }}
                tagsStyles={tagsStyles}
                renderers={renderers}
              /> */}
              {/* <HTMLView value={item.content} stylesheet={tagsStyles} /> */}
            </View>
          );
        })}

        {slides && <CommentSection postId={params?.contentId} />}
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      marginTop: responsiveScreenHeight(2),
      alignSelf: 'center',
    },
    container: {
      padding: 10,
      backgroundColor: Colors.Background_color,
      flex: 1,
    },
  });
