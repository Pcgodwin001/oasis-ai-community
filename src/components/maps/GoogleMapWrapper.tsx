import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDUHTk9XWaAH2O-vjoyKKcImMmf2X3s76U';

export interface MapMarker {
  id: string | number;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  type?: string;
  onClick?: () => void;
}

interface GoogleMapWrapperProps {
  markers?: MapMarker[];
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  containerStyle?: {
    width: string;
    height: string;
  };
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
}

const defaultCenter = {
  lat: 35.6145,
  lng: -88.8139,
};

const defaultContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function GoogleMapWrapper({
  markers = [],
  center = defaultCenter,
  zoom = 13,
  containerStyle = defaultContainerStyle,
  onMapClick,
}: GoogleMapWrapperProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const getMarkerColor = (type?: string) => {
    switch (type) {
      case 'Food Bank':
        return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'Soup Kitchen':
        return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'Food Pantry':
        return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={onMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            icon={getMarkerColor(marker.type)}
            onClick={() => {
              setSelectedMarker(marker);
              marker.onClick?.();
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h3 className="font-semibold text-gray-900">{selectedMarker.title}</h3>
              {selectedMarker.type && (
                <p className="text-sm text-gray-600">{selectedMarker.type}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
