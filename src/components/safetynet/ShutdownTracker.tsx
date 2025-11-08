import { AlertTriangle, TrendingUp, Calendar, Users, DollarSign, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function ShutdownTracker() {
  const riskLevel = 35;
  const fundingDeadline = 'November 17, 2025';
  const daysUntilDeadline = 10;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Hero Section */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h1 className="text-gray-900">Government Shutdown Tracker</h1>
              </div>
              <p className="text-gray-600 mb-6">
                Stay informed about potential government shutdowns and their impact on your benefits
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 mb-2">Funding Deadline</p>
                  <p className="text-gray-900">{fundingDeadline}</p>
                  <p className="text-gray-600">{daysUntilDeadline} days away</p>
                </div>

                <div>
                  <p className="text-gray-700 mb-2">Last Updated</p>
                  <p className="text-gray-600">Today at 10:30 AM EST</p>
                </div>

                <Button className="bg-gradient-to-r from-orange-600 to-red-600">
                  Subscribe to Alerts
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-48 h-48 rounded-full border-8 border-orange-300 mb-4">
                  <div>
                    <p className="text-orange-600 mb-2">{riskLevel}%</p>
                    <p className="text-gray-700">Risk Level</p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-700 text-lg px-4 py-2">
                  Moderate Risk
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Risk Percentage</span>
              <span className="text-gray-900">{riskLevel}%</span>
            </div>
            <Progress value={riskLevel} className="h-2" />
            <p className="text-gray-600">
              Congress is currently negotiating the budget. Recent votes show moderate support for funding extension.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What This Means</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
              <p className="text-gray-600">SNAP/EBT benefits will continue for 30 days</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
              <p className="text-gray-600">WIC services remain operational</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2" />
              <p className="text-gray-600">Some job programs may pause</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2" />
              <p className="text-gray-600">New applications may be delayed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preparation Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
              <span className="text-gray-600">Stock up on non-perishables</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
              <span className="text-gray-600">Locate nearby food banks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              <span className="text-gray-600">Create emergency budget</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              <span className="text-gray-600">Apply for local assistance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="local">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="local">Jackson, TN</TabsTrigger>
              <TabsTrigger value="state">Tennessee</TabsTrigger>
              <TabsTrigger value="national">National</TabsTrigger>
            </TabsList>

            <TabsContent value="local" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <Users className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-gray-600">People Affected</p>
                  <p className="text-gray-900">~8,500</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <DollarSign className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-gray-600">Monthly Benefits</p>
                  <p className="text-gray-900">$2.1M</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="text-gray-600">Food Banks</p>
                  <p className="text-gray-900">12 active</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <Calendar className="w-5 h-5 text-orange-600 mb-2" />
                  <p className="text-gray-600">Capacity Days</p>
                  <p className="text-gray-900">30 days</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 mb-2">Local Impact Summary</p>
                <p className="text-gray-600">
                  In Jackson, TN, approximately 8,500 residents rely on SNAP benefits. 
                  Local food banks have indicated they can support increased demand for up to 30 days. 
                  Community organizations are preparing contingency plans.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="state" className="space-y-4 mt-4">
              <p className="text-gray-600">Statewide impact data for Tennessee would display here.</p>
            </TabsContent>

            <TabsContent value="national" className="space-y-4 mt-4">
              <p className="text-gray-600">National impact statistics would display here.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* News & Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-900">House Votes on Funding Extension</p>
              <Badge variant="secondary">2 hours ago</Badge>
            </div>
            <p className="text-gray-600">
              The House is expected to vote on a short-term funding extension this afternoon...
            </p>
          </div>

          <div className="border-l-4 border-green-600 pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-900">USDA Confirms Benefit Continuity</p>
              <Badge variant="secondary">5 hours ago</Badge>
            </div>
            <p className="text-gray-600">
              USDA officials confirmed that SNAP benefits will continue for at least 30 days...
            </p>
          </div>

          <div className="border-l-4 border-purple-600 pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-900">Tennessee Activates Emergency Plan</p>
              <Badge variant="secondary">Yesterday</Badge>
            </div>
            <p className="text-gray-600">
              State officials have activated emergency food assistance protocols...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
