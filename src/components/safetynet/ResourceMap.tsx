import { useState } from 'react';
import { 
  MapPin, Phone, Clock, Navigation, Star, Filter, List, Map,
  ChevronRight, Heart, Share2, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const resources = [
  {
    id: 1,
    name: 'Second Harvest Food Bank',
    type: 'Food Bank',
    distance: 1.2,
    address: '123 Main St, Jackson, TN 38301',
    phone: '(731) 555-0101',
    hours: 'Mon-Fri: 9AM-4PM, Sat: 9AM-12PM',
    status: 'Open Now',
    services: ['Food Pantry', 'Fresh Produce', 'SNAP Application Help'],
    walkIn: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Jackson Community Kitchen',
    type: 'Soup Kitchen',
    distance: 2.1,
    address: '456 Oak Ave, Jackson, TN 38301',
    phone: '(731) 555-0102',
    hours: 'Mon-Fri: 11AM-1PM, 5PM-7PM',
    status: 'Open Now',
    services: ['Hot Meals', 'Take-Home Meals'],
    walkIn: true,
    rating: 4.8,
    reviews: 215,
  },
  {
    id: 3,
    name: 'West TN Food Pantry',
    type: 'Food Pantry',
    distance: 3.5,
    address: '789 Elm St, Jackson, TN 38305',
    phone: '(731) 555-0103',
    hours: 'Tue, Thu: 10AM-2PM',
    status: 'Closed',
    services: ['Food Pantry', 'Hygiene Products', 'Diapers'],
    walkIn: false,
    rating: 4.2,
    reviews: 89,
  },
  {
    id: 4,
    name: 'Grace Church Food Ministry',
    type: 'Food Bank',
    distance: 4.2,
    address: '321 Church Rd, Jackson, TN 38301',
    phone: '(731) 555-0104',
    hours: 'Wed: 1PM-5PM, Sat: 9AM-12PM',
    status: 'Open Now',
    services: ['Food Pantry', 'Clothing', 'Financial Assistance'],
    walkIn: true,
    rating: 4.6,
    reviews: 167,
  },
];

export default function ResourceMap() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [radiusMiles, setRadiusMiles] = useState([5]);
  const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null);
  const [filters, setFilters] = useState({
    openNow: false,
    walkIn: false,
    foodPantry: true,
    soupKitchen: true,
    snapHelp: false,
  });

  const filteredResources = resources.filter((resource) => {
    if (searchTerm && !resource.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (resource.distance > radiusMiles[0]) return false;
    if (filters.openNow && resource.status !== 'Open Now') return false;
    if (filters.walkIn && !resource.walkIn) return false;
    return true;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Search & Results */}
      <div className="w-full lg:w-96 xl:w-[30rem] bg-white border-r border-gray-200 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div>
            <h1 className="text-gray-900 mb-1">Find Resources</h1>
            <p className="text-gray-600">Food banks, pantries, and assistance</p>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div>
              <Label>Distance: {radiusMiles[0]} miles</Label>
              <Slider
                value={radiusMiles}
                onValueChange={setRadiusMiles}
                max={25}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="openNow"
                  checked={filters.openNow}
                  onCheckedChange={(checked) => setFilters({ ...filters, openNow: checked as boolean })}
                />
                <Label htmlFor="openNow" className="cursor-pointer">Open Now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="walkIn"
                  checked={filters.walkIn}
                  onCheckedChange={(checked) => setFilters({ ...filters, walkIn: checked as boolean })}
                />
                <Label htmlFor="walkIn" className="cursor-pointer">Walk-In Allowed</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredResources.length} results
            </p>
            <div className="flex space-x-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filteredResources.map((resource) => (
              <Card
                key={resource.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedResource(resource)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{resource.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">{resource.type}</Badge>
                        <Badge
                          className={resource.status === 'Open Now' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                        >
                          {resource.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{resource.distance} mi</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-600">{resource.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-gray-600 mb-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{resource.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{resource.hours}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Map */}
      <div className="hidden lg:flex flex-1 bg-gray-100 items-center justify-center relative">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Interactive Map View</p>
          <p className="text-gray-500">
            Map showing {filteredResources.length} locations would display here
          </p>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button size="sm" variant="secondary">Zoom In</Button>
          <Button size="sm" variant="secondary">Zoom Out</Button>
          <Button size="sm" variant="secondary">Full Screen</Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg p-4 shadow-lg">
          <p className="text-gray-900 mb-2">Map Legend</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <span className="text-gray-600">Food Banks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              <span className="text-gray-600">Soup Kitchens</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full" />
              <span className="text-gray-600">Your Location</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Detail Modal */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedResource && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-gray-900 mb-2">
                      {selectedResource.name}
                    </DialogTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{selectedResource.type}</Badge>
                      <Badge
                        className={selectedResource.status === 'Open Now' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                      >
                        {selectedResource.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{selectedResource.address}</p>
                      <p className="text-gray-600">{selectedResource.distance} miles away</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${selectedResource.phone}`} className="text-blue-600 hover:underline">
                      {selectedResource.phone}
                    </a>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900">Hours</p>
                      <p className="text-gray-600">{selectedResource.hours}</p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <p className="text-gray-900 mb-2">Services Offered</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.services.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900 mb-1">Requirements</p>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Photo ID required</li>
                        <li>• Proof of residence (utility bill, etc.)</li>
                        {!selectedResource.walkIn && <li>• Appointment required - call ahead</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedResource.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-900">{selectedResource.rating}</span>
                    <span className="text-gray-600">({selectedResource.reviews} reviews)</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
