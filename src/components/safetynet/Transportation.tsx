import { useState } from 'react';
import { Bus, MapPin, Clock, Navigation, Star, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import GoogleMapWrapper from '../maps/GoogleMapWrapper';

const savedRoutes = [
  {
    id: 1,
    name: 'Home to Food Bank',
    from: 'Home',
    to: 'Second Harvest Food Bank',
    duration: '15 min',
    buses: ['Route 5', 'Route 12'],
  },
  {
    id: 2,
    name: 'Home to Work',
    from: 'Home',
    to: 'Downtown Jackson',
    duration: '22 min',
    buses: ['Route 3'],
  },
];

export default function Transportation() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Bus Routes & Transportation</h1>
        <p className="text-gray-600">Plan your trips using public transportation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Plan Your Route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>From</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Your location"
                  className="pl-10"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>To</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Destination"
                  className="pl-10"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>When</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="datetime-local" className="pl-10" />
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              <Navigation className="w-4 h-4 mr-2" />
              Find Routes
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Route Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[500px] relative">
              <GoogleMapWrapper
                center={{ lat: 35.6145, lng: -88.8139 }}
                zoom={13}
                containerStyle={{ width: '100%', height: '100%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Routes</CardTitle>
        </CardHeader>
        <CardContent>
          {savedRoutes.length > 0 ? (
            <div className="space-y-3">
              {savedRoutes.map((route) => (
                <div
                  key={route.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Bookmark className="w-4 h-4 text-blue-600" />
                      <h3 className="text-gray-900 font-medium">{route.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {route.from} → {route.to}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {route.duration}
                      </Badge>
                      {route.buses.map((bus, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Bus className="w-3 h-3 mr-1" />
                          {bus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Save frequently used routes for quick access</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
