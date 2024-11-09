import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from './CustomFonts';

export const markdownStyle = {
  bullet_list: {
    marginVertical: 10,
  },
  ordered_list: {
    marginVertical: 10,
  },
  list_item: {
    marginVertical: 10,
  },
  body: {
    flex: 1,
    width: responsiveScreenWidth(73),
    color: Colors.BodyText,
    fontFamily: CustomFonts.REGULAR,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: responsiveScreenHeight(1.5),
    // backgroundColor: "yellow",
  },
  heading1: {
    flex: 1,
    width: responsiveScreenWidth(73),
    fontSize: 24,
    color: Colors.Heading,
    marginBottom: 10,
  },
  heading2: {
    flex: 1,
    width: responsiveScreenWidth(73),
    fontSize: 20,
    color: Colors.Heading,
    marginBottom: 8,
  },
  heading3: {
    flex: 1,
    width: responsiveScreenWidth(73),
    fontSize: 18,
    color: Colors.Heading,
    marginBottom: 6,
  },
  paragraph: {
    flex: 1,
    width: responsiveScreenWidth(73),
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'justify',
  },
  link: {
    flex: 1,
    width: responsiveScreenWidth(73),
    color: '#27AC1F',
    // marginBottom: 100,
  },
  blockquote: {
    flex: 1,
    width: responsiveScreenWidth(73),
    backgroundColor: Colors.White,
    borderRadius: 4,
    padding: 8,
    fontFamily: 'monospace',
  },
  code_block: {
    flex: 1,
    width: responsiveScreenWidth(73),
    backgroundColor: Colors.White,
    borderRadius: 4,
    padding: 8,
    fontFamily: 'monospace',
  },
  code_inline: {
    flex: 1,
    width: responsiveScreenWidth(73),
    backgroundColor: Colors.White,
    borderRadius: 4,
    padding: 4,
    fontFamily: 'monospace',
  },
};
