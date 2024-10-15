import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {useSelector} from 'react-redux';
import DefaultTheme, {DarkTheme, LightTheme} from '../constants/Colors.js';

// Define the type for your theme
type Theme = typeof DefaultTheme | typeof DarkTheme | typeof LightTheme;

// Define the type for display mode
type DisplayMode = 'dark' | 'default' | 'light';

// Create a theme context with initial default thee
const ThemeContext = createContext<Theme>(DefaultTheme);

// Custom hook to use the theme context
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};

// Define props type for ThemeProvider
type ThemeProviderProps = {
  children: ReactNode;
};

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  // Ensure the type of state is explicitly defined
  const {displayMode}: {displayMode: DisplayMode} = useSelector(
    (state: any) => state.chat,
  );

  // Define initial state using DefaultTheme
  const [theme, setTheme] = useState<Theme>(DefaultTheme);

  // Function to update theme based on display mode
  const updateTheme = (mode: DisplayMode): Theme => {
    switch (mode) {
      case 'dark':
        return DarkTheme;
      case 'light':
        return LightTheme;
      default:
        return DefaultTheme;
    }
  };

  useEffect(() => {
    setTheme(updateTheme(displayMode));
  }, [displayMode]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
