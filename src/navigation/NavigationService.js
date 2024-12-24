// src/NavigationService.js

import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigates to a specified screen.
 * @param {string} name - The name of the screen to navigate to.
 * @param {object} params - Parameters to pass to the screen.
 */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn('NavigationRef is not ready. Cannot navigate to:', name);
  }
}

/**
 * Goes back to the previous screen.
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * Replaces the current screen with a new one.
 * @param {string} name - The name of the screen to replace with.
 * @param {object} params - Parameters to pass to the screen.
 */
export function replace(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.replace(name, params);
  }
}

// Add other navigation methods as needed.
