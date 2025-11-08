import { Bus, MapPin, Clock, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function Transportation() {
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
                <Input placeholder="Your location" className="pl-10" />
              </div>
            </div>
            <div>
              <Label>To</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Destination" className="pl-10" />
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
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enter locations to see route options</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Save frequently used routes for quick access</p>
        </CardContent>
      </Card>
    </div>
  );
}
