import { useState, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Platform } from '../utils/platform';

interface CameraState {
  photo: Photo | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for capturing photos with the device camera
 * Useful for receipt scanner and profile pictures
 */
export function useCamera() {
  const [state, setState] = useState<CameraState>({
    photo: null,
    loading: false,
    error: null,
  });

  const isAvailable = Platform.isPluginAvailable('Camera');

  /**
   * Take a photo using the camera
   */
  const takePhoto = useCallback(async () => {
    if (!isAvailable) {
      setState(prev => ({
        ...prev,
        error: 'Camera not available',
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      setState({
        photo,
        loading: false,
        error: null,
      });

      return photo;
    } catch (error: any) {
      // User cancelled - not an error
      if (error?.message?.includes('cancelled') || error?.message?.includes('canceled')) {
        setState(prev => ({ ...prev, loading: false }));
        return null;
      }

      const errorMessage = error?.message || 'Failed to take photo';
      setState({
        photo: null,
        loading: false,
        error: errorMessage,
      });
      console.error('Camera error:', error);
      return null;
    }
  }, [isAvailable]);

  /**
   * Pick a photo from the gallery
   */
  const pickPhoto = useCallback(async () => {
    if (!isAvailable) {
      setState(prev => ({
        ...prev,
        error: 'Camera not available',
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      setState({
        photo,
        loading: false,
        error: null,
      });

      return photo;
    } catch (error: any) {
      // User cancelled - not an error
      if (error?.message?.includes('cancelled') || error?.message?.includes('canceled')) {
        setState(prev => ({ ...prev, loading: false }));
        return null;
      }

      const errorMessage = error?.message || 'Failed to pick photo';
      setState({
        photo: null,
        loading: false,
        error: errorMessage,
      });
      console.error('Gallery error:', error);
      return null;
    }
  }, [isAvailable]);

  /**
   * Request camera permissions
   */
  const requestPermissions = useCallback(async () => {
    if (!isAvailable) return { granted: false };

    try {
      const permission = await Camera.requestPermissions();
      return {
        granted: permission.camera === 'granted' && permission.photos === 'granted',
      };
    } catch (error) {
      console.error('Permission request failed:', error);
      return { granted: false };
    }
  }, [isAvailable]);

  /**
   * Check if camera permissions are granted
   */
  const checkPermissions = useCallback(async () => {
    if (!isAvailable) return { granted: false };

    try {
      const permission = await Camera.checkPermissions();
      return {
        granted: permission.camera === 'granted' && permission.photos === 'granted',
      };
    } catch (error) {
      console.error('Permission check failed:', error);
      return { granted: false };
    }
  }, [isAvailable]);

  return {
    ...state,
    isAvailable,
    takePhoto,
    pickPhoto,
    requestPermissions,
    checkPermissions,
  };
}
