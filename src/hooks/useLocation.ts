import { useState, useCallback, useEffect } from 'react';
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { Platform } from '../utils/platform';

interface LocationState {
  position: Position | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for accessing device geolocation
 * Provides user's current location for features like resource finder
 */
export function useLocation(autoFetch: boolean = false) {
  const [state, setState] = useState<LocationState>({
    position: null,
    loading: false,
    error: null,
  });

  const isAvailable = Platform.isPluginAvailable('Geolocation');

  /**
   * Get current position
   */
  const getCurrentPosition = useCallback(async (options?: PositionOptions) => {
    if (!isAvailable) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation not available',
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await Geolocation.getCurrentPosition(options);
      setState({
        position,
        loading: false,
        error: null,
      });
      return position;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to get location';
      setState({
        position: null,
        loading: false,
        error: errorMessage,
      });
      console.error('Geolocation error:', error);
      return null;
    }
  }, [isAvailable]);

  /**
   * Request location permissions
   */
  const requestPermissions = useCallback(async () => {
    if (!isAvailable) return { granted: false };

    try {
      const permission = await Geolocation.requestPermissions();
      return { granted: permission.location === 'granted' };
    } catch (error) {
      console.error('Permission request failed:', error);
      return { granted: false };
    }
  }, [isAvailable]);

  /**
   * Check if location permissions are granted
   */
  const checkPermissions = useCallback(async () => {
    if (!isAvailable) return { granted: false };

    try {
      const permission = await Geolocation.checkPermissions();
      return { granted: permission.location === 'granted' };
    } catch (error) {
      console.error('Permission check failed:', error);
      return { granted: false };
    }
  }, [isAvailable]);

  /**
   * Watch position for continuous updates
   */
  const watchPosition = useCallback((
    callback: (position: Position) => void,
    options?: PositionOptions
  ) => {
    if (!isAvailable) return null;

    const watchId = Geolocation.watchPosition(options || {}, (position, error) => {
      if (error) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Watch position failed',
        }));
      } else if (position) {
        setState({
          position,
          loading: false,
          error: null,
        });
        callback(position);
      }
    });

    return watchId;
  }, [isAvailable]);

  /**
   * Clear position watch
   */
  const clearWatch = useCallback(async (watchId: string) => {
    if (!isAvailable) return;
    try {
      await Geolocation.clearWatch({ id: watchId });
    } catch (error) {
      console.error('Clear watch failed:', error);
    }
  }, [isAvailable]);

  // Auto-fetch position on mount if requested
  useEffect(() => {
    if (autoFetch && isAvailable) {
      getCurrentPosition();
    }
  }, [autoFetch, isAvailable, getCurrentPosition]);

  return {
    ...state,
    isAvailable,
    getCurrentPosition,
    requestPermissions,
    checkPermissions,
    watchPosition,
    clearWatch,
  };
}
