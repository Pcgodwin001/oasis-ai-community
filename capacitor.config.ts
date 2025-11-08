import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oasis.app',
  appName: 'Oasis',
  webDir: 'build',
  ios: {
    contentInset: 'never',
    scrollEnabled: false,
    backgroundColor: '#3B82F6'
  },
  plugins: {
    Keyboard: {
      resize: 'none',
      style: 'dark',
      resizeOnFullScreen: false
    }
  }
};

export default config;
