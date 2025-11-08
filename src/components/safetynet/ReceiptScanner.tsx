import { Upload, Camera, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';

export default function ReceiptScanner() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Receipt Scanner & Price Tracker</h1>
        <p className="text-gray-600">Track your spending and compare prices across stores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upload Receipt</CardTitle>
            <CardDescription>Scan or upload your receipts to track spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Drag and drop your receipt or click to upload</p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-600 mb-1">Receipts Scanned</p>
              <p className="text-gray-900">47</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-gray-600 mb-1">Total Tracked</p>
              <p className="text-gray-900">$1,234.56</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-gray-600 mb-1">Avg Transaction</p>
              <p className="text-gray-900">$26.27</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Your scanned receipts will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
}
