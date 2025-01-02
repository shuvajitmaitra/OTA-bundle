import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';

const SmallFonts = {
  HL: responsiveScreenFontSize(1.8),
  HR: responsiveScreenFontSize(1.8),
  HS: responsiveScreenFontSize(1.4),
  BL: responsiveScreenFontSize(1.8),
  BodyTextMedium: responsiveScreenFontSize(1.8),
  BS: responsiveScreenFontSize(1.8),
};
export const RegularFonts = {
  HXXL: responsiveScreenFontSize(3), // Typically for very large headings
  HXL: responsiveScreenFontSize(2.8), // Typically for large headings
  HL: responsiveScreenFontSize(2.6), // Typically for large headings
  HR: responsiveScreenFontSize(2.4), // Typically for large headings
  HS: responsiveScreenFontSize(2), // Regular headings
  BL: responsiveScreenFontSize(1.8), // Sub-headings or smaller headings
  BR: responsiveScreenFontSize(1.6), // Larger body text
  BS: responsiveScreenFontSize(1.4), // Regular body text
};

const LargeFonts = {
  HL: responsiveScreenFontSize(1.8),
  HR: responsiveScreenFontSize(1.6),
  HS: responsiveScreenFontSize(1.4),
  BL: responsiveScreenFontSize(1.8),
  BR: responsiveScreenFontSize(1.8),
  BS: responsiveScreenFontSize(1.8),
};
