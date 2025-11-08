import { User, Bell, Lock, CreditCard, Globe, Palette, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function Settings() {
  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input defaultValue="John Doe" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" defaultValue="john@example.com" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input type="tel" defaultValue="(555) 123-4567" />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input defaultValue="38301" />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Budget Alerts</p>
                  <p className="text-gray-500">Get notified when approaching budget limits</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Shutdown Alerts</p>
                  <p className="text-gray-500">Updates on government shutdown risk</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">New Resources</p>
                  <p className="text-gray-500">Notifications about new food banks and resources</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Job Alerts</p>
                  <p className="text-gray-500">New job matches for your profile</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Anonymous Community Posts</p>
                  <p className="text-gray-500">Post anonymously in the community forum</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="pt-4">
                <Button variant="outline">Export My Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connected">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-gray-900">EBT Card</p>
                    <p className="text-gray-500">**** 1234</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Terms of Service
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Policy
              </Button>
              <div className="pt-4 text-center text-gray-500">
                Oasis v1.0.0
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
