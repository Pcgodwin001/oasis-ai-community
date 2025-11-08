import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '../utils/platform';

/**
 * Hook to manage status bar appearance on mobile devices
 */
export function useStatusBar(options?: {
  style?: 'light' | 'dark';
  backgroundColor?: string;
  overlay?: boolean;
}) {
  const isAvailable = Platform.isNative();

  useEffect(() => {
    if (!isAvailable) return;

    const setupStatusBar = async () => {
      try {
        // Set style
        if (options?.style === 'light') {
          await StatusBar.setStyle({ style: Style.Light });
        } else {
          await StatusBar.setStyle({ style: Style.Dark });
        }

        // Set background color (Android only)
        if (Platform.isAndroid() && options?.backgroundColor) {
          await StatusBar.setBackgroundColor({ color: options.backgroundColor });
        }

        // Set overlay mode (iOS only)
        if (Platform.isIOS() && options?.overlay !== undefined) {
          await StatusBar.setOverlaysWebView({ overlay: options.overlay });
        }

        // Show status bar
        await StatusBar.show();
      } catch (error) {
        console.warn('StatusBar setup failed:', error);
      }
    };

    setupStatusBar();
  }, [isAvailable, options?.style, options?.backgroundColor, options?.overlay]);

  return {
    isAvailable,
    show: async () => {
      if (!isAvailable) return;
      try {
        await StatusBar.show();
      } catch (error) {
        console.warn('StatusBar show failed:', error);
      }
    },
    hide: async () => {
      if (!isAvailable) return;
      try {
        await StatusBar.hide();
      } catch (error) {
        console.warn('StatusBar hide failed:', error);
      }
    },
  };
}
