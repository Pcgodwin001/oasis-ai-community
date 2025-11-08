import { Capacitor } from '@capacitor/core';

/**
 * Platform Detection Utilities
 * Helpers to detect the current platform and adapt UI/functionality accordingly
 */

export const Platform = {
  /**
   * Check if running as a native mobile app
   */
  isNative: () => Capacitor.isNativePlatform(),

  /**
   * Check if running in a web browser
   */
  isWeb: () => !Capacitor.isNativePlatform(),

  /**
   * Check if running on iOS
   */
  isIOS: () => Capacitor.getPlatform() === 'ios',

  /**
   * Check if running on Android
   */
  isAndroid: () => Capacitor.getPlatform() === 'android',

  /**
   * Get the current platform name
   */
  getPlatform: () => Capacitor.getPlatform(),

  /**
   * Check if plugin is available
   */
  isPluginAvailable: (pluginName: string) => {
    return Capacitor.isPluginAvailable(pluginName);
  },

  /**
   * Get safe area insets for iOS devices with notches/Dynamic Island
   * Returns default values for web
   */
  getSafeAreaInsets: () => {
    if (typeof window === 'undefined') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    // Get CSS environment variables for safe areas
    const top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0');
    const bottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0');
    const left = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sal') || '0');
    const right = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sar') || '0');

    return { top, bottom, left, right };
  },
};

/**
 * Device Info
 */
export const Device = {
  /**
   * Check if device has a notch/Dynamic Island
   */
  hasNotch: () => {
    if (typeof window === 'undefined') return false;
    const safeArea = Platform.getSafeAreaInsets();
    return safeArea.top > 20; // Standard status bar is 20px
  },

  /**
   * Check if running on a tablet
   */
  isTablet: () => {
    if (typeof window === 'undefined') return false;
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const maxDimension = Math.max(window.innerWidth, window.innerHeight);
    return minDimension >= 600 && maxDimension >= 900;
  },

  /**
   * Get device orientation
   */
  getOrientation: () => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  },
};

/**
 * Conditional class helper for mobile-specific styling
 */
export const mobileClass = (mobileClasses: string, webClasses: string = '') => {
  return Platform.isNative() ? mobileClasses : webClasses;
};

/**
 * Conditional class helper for iOS-specific styling
 */
export const iosClass = (iosClasses: string, otherClasses: string = '') => {
  return Platform.isIOS() ? iosClasses : otherClasses;
};

/**
 * Conditional class helper for Android-specific styling
 */
export const androidClass = (androidClasses: string, otherClasses: string = '') => {
  return Platform.isAndroid() ? androidClasses : otherClasses;
};
