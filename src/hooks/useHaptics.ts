import { useCallback } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Platform } from '../utils/platform';

/**
 * Hook for haptic feedback on mobile devices
 * Provides tactile feedback for user interactions
 */
export function useHaptics() {
  const isAvailable = Platform.isPluginAvailable('Haptics');

  /**
   * Light impact feedback
   * Use for: UI element selection, button taps
   */
  const light = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.warn('Haptics light failed:', error);
    }
  }, [isAvailable]);

  /**
   * Medium impact feedback
   * Use for: Toggle switches, checkboxes
   */
  const medium = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.warn('Haptics medium failed:', error);
    }
  }, [isAvailable]);

  /**
   * Heavy impact feedback
   * Use for: Important actions, confirmations
   */
  const heavy = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.warn('Haptics heavy failed:', error);
    }
  }, [isAvailable]);

  /**
   * Success notification feedback
   * Use for: Successful operations
   */
  const success = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.warn('Haptics success failed:', error);
    }
  }, [isAvailable]);

  /**
   * Warning notification feedback
   * Use for: Warning messages
   */
  const warning = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.warn('Haptics warning failed:', error);
    }
  }, [isAvailable]);

  /**
   * Error notification feedback
   * Use for: Error messages, failed operations
   */
  const error = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.warn('Haptics error failed:', error);
    }
  }, [isAvailable]);

  /**
   * Selection changed feedback (iOS only)
   * Use for: Picker wheels, continuous selection
   */
  const selectionChanged = useCallback(async () => {
    if (!isAvailable) return;
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.warn('Haptics selectionChanged failed:', error);
    }
  }, [isAvailable]);

  /**
   * Vibrate device for specified duration
   * Use for: Custom vibration patterns
   */
  const vibrate = useCallback(async (duration: number = 300) => {
    if (!isAvailable) return;
    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.warn('Haptics vibrate failed:', error);
    }
  }, [isAvailable]);

  return {
    isAvailable,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selectionChanged,
    vibrate,
  };
}
