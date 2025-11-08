import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Phone, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import GoogleMapWrapper from '../maps/GoogleMapWrapper';
import { supabase } from '../../lib/supabase';
import { Geolocation } from '@capacitor/geolocation';

interface Resource {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  hours: string | null;
  services: string[] | null;
  rating: number | null;
  distance?: number;
}

interface UserLocation {
  lat: number;
  lng: number;
}

// Helper function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Map resource types to categories
const getResourceCategory = (type: string): string => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('food') || lowerType.includes('kitchen') || lowerType.includes('pantry')) {
    return 'food';
  } else if (lowerType.includes('health') || lowerType.includes('clinic') || lowerType.includes('medical')) {
    return 'health';
  } else if (lowerType.includes('shelter') || lowerType.includes('housing')) {
    return 'shelter';
  } else if (lowerType.includes('job') || lowerType.includes('employment')) {
    return 'job';
  }
  return 'food'; // default
};

// Format resource type for display
const formatResourceType = (type: string): string => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function ResourceMap() {
  const [activeTab, setActiveTab] = useState('all');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default to NYC

  // Fetch user's current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setMapCenter(location);
      } catch (error) {
        console.log('Could not get user location, using default:', error);
        // Use default location (NYC)
        setUserLocation({ lat: 40.7128, lng: -74.006 });
      }
    };

    getCurrentLocation();
  }, []);

  // Fetch resources from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('name');

        if (error) throw error;

        // Calculate distances if user location is available
        const resourcesWithDistance = (data || []).map((resource) => {
          if (userLocation) {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              resource.lat,
              resource.lng
            );
            return { ...resource, distance: parseFloat(distance.toFixed(1)) };
          }
          return resource;
        });

        // Sort by distance if available
        if (userLocation) {
          resourcesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }

        setResources(resourcesWithDistance);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchResources();
    }
  }, [userLocation]);

  // Filter resources based on active tab
  const filteredResources = activeTab === 'all'
    ? resources
    : resources.filter((r) => getResourceCategory(r.type) === activeTab);

  // Get resource counts by category
  const resourceCounts = {
    food: resources.filter((r) => getResourceCategory(r.type) === 'food').length,
    health: resources.filter((r) => getResourceCategory(r.type) === 'health').length,
    shelter: resources.filter((r) => getResourceCategory(r.type) === 'shelter').length,
    job: resources.filter((r) => getResourceCategory(r.type) === 'job').length,
    all: resources.length,
  };

  // Handle Get Directions button - opens in Google Maps or Apple Maps
  const handleGetDirections = (resource: Resource) => {
    const destination = `${resource.lat},${resource.lng}`;
    const label = encodeURIComponent(resource.name);

    // Detect platform and open appropriate maps app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      // Apple Maps
      window.open(`maps://maps.apple.com/?daddr=${destination}&q=${label}`, '_blank');
    } else if (isAndroid) {
      // Google Maps
      window.open(`google.navigation:q=${destination}`, '_blank');
    } else {
      // Web fallback - Google Maps
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${label}`, '_blank');
    }
  };

  // Handle phone call
  const handleCall = (phone: string | null) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const renderResourceCard = (resource: Resource) => (
    <div
      key={resource.id}
      className="bg-white/40 backdrop-blur-lg rounded-2xl p-5 border border-white/40 hover:bg-white/60 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{resource.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <MapPin className="w-3 h-3" />
            <span>
              {resource.distance !== undefined && `${resource.distance} mi • `}
              {resource.address}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-1 rounded-lg">
              {formatResourceType(resource.type)}
            </span>
            {resource.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-gray-600">{resource.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {resource.hours && (
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{resource.hours}</span>
          </div>
        )}

        {resource.phone && (
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{resource.phone}</span>
          </div>
        )}
      </div>

      {resource.services && resource.services.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-600 text-xs mb-2">Services:</p>
          <div className="flex flex-wrap gap-2">
            {resource.services.map((service, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-500/10 text-blue-700 px-2 py-1 rounded-lg"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => handleGetDirections(resource)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Directions
        </Button>
        {resource.phone && (
          <Button
            onClick={() => handleCall(resource.phone)}
            variant="outline"
            className="bg-white/60 border-white/60 hover:bg-white/80"
          >
            <Phone className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

  // Convert resources to map markers
  const mapMarkers: MapMarker[] = filteredResources.map((resource) => ({
    id: resource.id,
    position: { lat: resource.lat, lng: resource.lng },
    title: resource.name,
    type: formatResourceType(resource.type),
  }));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl">Resource Map</h1>
            <p className="text-gray-600">
              {userLocation ? 'Find help near you' : 'Loading location...'}
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-5 border border-white/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Food Resources</span>
            <MapPin className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-gray-900 text-3xl">{resourceCounts.food}</p>
          <p className="text-gray-600 text-sm">Available nearby</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-5 border border-white/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Resources</span>
            <MapPin className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-gray-900 text-3xl">{resourceCounts.all}</p>
          <p className="text-gray-600 text-sm">All categories</p>
        </div>
      </div>

      {/* Google Map */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3 animate-pulse" />
                <p className="text-gray-700">Loading map...</p>
              </div>
            </div>
          ) : (
            <GoogleMapWrapper
              center={mapCenter}
              zoom={13}
              markers={mapMarkers}
              containerStyle={{ width: '100%', height: '100%' }}
            />
          )}
        </div>
      </div>

      {/* Resource Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-white/60 backdrop-blur-lg p-1 rounded-2xl border border-white/60">
          <TabsTrigger value="all" className="flex-1 rounded-xl text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="food" className="flex-1 rounded-xl text-xs">
            Food
          </TabsTrigger>
          <TabsTrigger value="health" className="flex-1 rounded-xl text-xs">
            Health
          </TabsTrigger>
          <TabsTrigger value="shelter" className="flex-1 rounded-xl text-xs">
            Shelter
          </TabsTrigger>
          <TabsTrigger value="job" className="flex-1 rounded-xl text-xs">
            Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40">
            <p className="text-gray-900">
              <strong>{filteredResources.length} Resources</strong> available near you
            </p>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No resources found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map(renderResourceCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="food" className="space-y-4 mt-4">
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40">
            <p className="text-gray-900">
              <strong>{filteredResources.length} Food Resources</strong> including food banks, pantries, and kitchens
            </p>
          </div>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No food resources found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map(renderResourceCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-4 mt-4">
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40">
            <p className="text-gray-900">
              <strong>{filteredResources.length} Health Resources</strong> offering medical care
            </p>
          </div>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No health resources found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map(renderResourceCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shelter" className="space-y-4 mt-4">
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40">
            <p className="text-gray-900">
              <strong>{filteredResources.length} Shelter Resources</strong> for emergency and housing assistance
            </p>
          </div>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No shelter resources found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map(renderResourceCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="job" className="space-y-4 mt-4">
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40">
            <p className="text-gray-900">
              <strong>{filteredResources.length} Job Resources</strong> for employment and training
            </p>
          </div>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No job resources found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map(renderResourceCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Emergency Contacts */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 text-white">
        <h3 className="text-2xl mb-4">Emergency Contacts</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-lg rounded-xl">
            <div>
              <p className="text-white">Emergency Shelter</p>
              <p className="text-white/80 text-sm">24/7 Hotline</p>
            </div>
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-white/90">
              Call Now
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-lg rounded-xl">
            <div>
              <p className="text-white">Crisis Counseling</p>
              <p className="text-white/80 text-sm">988 Lifeline</p>
            </div>
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-white/90">
              Call Now
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-lg rounded-xl">
            <div>
              <p className="text-white">Domestic Violence</p>
              <p className="text-white/80 text-sm">National Hotline</p>
            </div>
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-white/90">
              Call Now
            </Button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h3 className="text-gray-900 mb-4">Tips for Using Resources</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">1</span>
            </div>
            <div>
              <p className="text-gray-900">Call Ahead</p>
              <p className="text-gray-600 text-sm">Hours and requirements can change - always call first</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">2</span>
            </div>
            <div>
              <p className="text-gray-900">Bring Documentation</p>
              <p className="text-gray-600 text-sm">ID, proof of address, income documents when possible</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">3</span>
            </div>
            <div>
              <p className="text-gray-900">Arrive Early</p>
              <p className="text-gray-600 text-sm">Many resources serve first-come, first-served</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">4</span>
            </div>
            <div>
              <p className="text-gray-900">Ask About Other Programs</p>
              <p className="text-gray-600 text-sm">Staff can often refer you to additional resources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
