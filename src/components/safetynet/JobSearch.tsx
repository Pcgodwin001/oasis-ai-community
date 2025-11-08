import { Briefcase, MapPin, DollarSign, Clock, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

const jobs = [
  {
    id: 1,
    title: 'Cashier',
    company: 'Target',
    location: 'Jackson, TN',
    salary: '$13.00/hr',
    type: 'Part-time',
    posted: '2 days ago',
    match: 95,
  },
  {
    id: 2,
    title: 'Stock Associate',
    company: 'Walmart',
    location: 'Jackson, TN',
    salary: '$12.50/hr',
    type: 'Full-time',
    posted: '3 days ago',
    match: 92,
  },
  {
    id: 3,
    title: 'Food Service Worker',
    company: 'Jackson-Madison County Schools',
    location: 'Jackson, TN',
    salary: '$11.00/hr',
    type: 'Part-time',
    posted: '1 week ago',
    match: 88,
  },
];

export default function JobSearch() {
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Job Search & Application Helper</h1>
        <p className="text-gray-600">Find opportunities and get AI-powered application assistance</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search jobs..." className="pl-10" />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Location" className="pl-10" defaultValue="Jackson, TN" />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              Search
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">{jobs.length} jobs found</p>
          </div>

          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                      </Badge>
                      <Badge variant="secondary">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {job.salary}
                      </Badge>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700 mb-2">
                      {job.match}% Match
                    </Badge>
                    <p className="text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {job.posted}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                    Apply Now
                  </Button>
                  <Button size="sm" variant="outline">
                    Save Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resume Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create a professional resume with AI assistance</p>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={() => navigate('/resume/builder/new')}
              >
                Build Resume
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Applied</span>
                  <span className="text-gray-900">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interviewing</span>
                  <span className="text-gray-900">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Offered</span>
                  <span className="text-gray-900">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
