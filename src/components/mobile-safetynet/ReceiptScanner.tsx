import { useState } from 'react';
import { Camera as CameraIcon, Upload, ScanLine, TrendingDown, MapPin, ChevronRight, X } from 'lucide-react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '../ui/button';

interface Receipt {
  id: string;
  date: Date;
  store: string;
  total: number;
  items: number;
  savings: number;
}

interface Comparison {
  item: string;
  currentStore: string;
  currentPrice: number;
  betterStore: string;
  betterPrice: number;
  savings: number;
}

export default function ReceiptScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock recent receipts
  const recentReceipts: Receipt[] = [
    {
      id: '1',
      date: new Date('2025-11-07'),
      store: 'Safeway',
      total: 87.43,
      items: 12,
      savings: 28.32,
    },
    {
      id: '2',
      date: new Date('2025-11-03'),
      store: 'Target',
      total: 54.21,
      items: 8,
      savings: 12.50,
    },
    {
      id: '3',
      date: new Date('2025-10-30'),
      store: 'Safeway',
      total: 92.15,
      items: 15,
      savings: 31.20,
    },
  ];

  // Mock comparison data
  const comparisons: Comparison[] = [
    {
      item: 'Organic Milk (1 gal)',
      currentStore: 'Safeway',
      currentPrice: 5.99,
      betterStore: 'Aldi',
      betterPrice: 3.99,
      savings: 2.00,
    },
    {
      item: 'Whole Wheat Bread',
      currentStore: 'Safeway',
      currentPrice: 3.49,
      betterStore: 'Aldi',
      betterPrice: 1.89,
      savings: 1.60,
    },
    {
      item: 'Free Range Eggs (dozen)',
      currentStore: 'Safeway',
      currentPrice: 5.99,
      betterStore: 'Aldi',
      betterPrice: 3.79,
      savings: 2.20,
    },
    {
      item: 'Bananas (per lb)',
      currentStore: 'Safeway',
      currentPrice: 0.79,
      betterStore: 'Aldi',
      betterPrice: 0.44,
      savings: 0.35,
    },
    {
      item: 'Ground Beef (1 lb)',
      currentStore: 'Safeway',
      currentPrice: 6.99,
      betterStore: 'Aldi',
      betterPrice: 4.49,
      savings: 2.50,
    },
    {
      item: 'Pasta (16 oz)',
      currentStore: 'Safeway',
      currentPrice: 2.29,
      betterStore: 'Aldi',
      betterPrice: 0.89,
      savings: 1.40,
    },
  ];

  const totalSavings = comparisons.reduce((sum, comp) => sum + comp.savings, 0);
  const monthlySavings = totalSavings * 4; // Assuming weekly shopping

  const takePhoto = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      // Store the photo URI
      if (image.webPath) {
        setCapturedPhoto(image.webPath);
      }

      // Simulate scanning process after photo is taken
      setTimeout(() => {
        setIsScanning(false);
        setShowResults(true);
      }, 2000);
    } catch (err) {
      setIsScanning(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';

      if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
        setError('Camera permission denied. Please enable camera access in your device settings.');
      } else if (errorMessage.includes('cancel')) {
        setError(null); // User cancelled, don't show error
      } else {
        setError('Error taking photo. Please try again.');
      }
      console.error('Error taking photo:', err);
    }
  };

  const uploadPhoto = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      // Store the photo URI
      if (image.webPath) {
        setCapturedPhoto(image.webPath);
      }

      // Simulate scanning process after photo is selected
      setTimeout(() => {
        setIsScanning(false);
        setShowResults(true);
      }, 2000);
    } catch (err) {
      setIsScanning(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to access photos';

      if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
        setError('Photo library permission denied. Please enable access in your device settings.');
      } else if (errorMessage.includes('cancel')) {
        setError(null); // User cancelled, don't show error
      } else {
        setError('Error selecting photo. Please try again.');
      }
      console.error('Error selecting photo:', err);
    }
  };

  const handleScan = () => {
    takePhoto();
  };

  const handleUpload = () => {
    uploadPhoto();
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-lg font-semibold">Receipt Scanner</h1>
            <p className="text-gray-600 text-sm">Find cheaper alternatives instantly</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Savings Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">This Week</span>
            <TrendingDown className="w-3.5 h-3.5 text-green-600" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">${totalSavings.toFixed(2)}</p>
          <p className="text-gray-600 text-xs">Potential</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Per Month</span>
            <TrendingDown className="w-3.5 h-3.5 text-green-600" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">${monthlySavings.toFixed(0)}</p>
          <p className="text-gray-600 text-xs">Saved</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Per Year</span>
            <TrendingDown className="w-3.5 h-3.5 text-green-600" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">${(monthlySavings * 12).toFixed(0)}</p>
          <p className="text-gray-600 text-xs">Total</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl shadow-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-900 text-sm font-semibold mb-1">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <Button
              onClick={() => setError(null)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Scan Actions */}
      {!showResults && (
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-5 border border-white/60">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <CameraIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 text-base font-semibold mb-1">Scan Your Receipt</h2>
            <p className="text-gray-600 text-sm">Take a photo or upload a receipt to find savings</p>
          </div>

          {/* Display captured photo preview */}
          {capturedPhoto && !isScanning && (
            <div className="mb-4">
              <img
                src={capturedPhoto}
                alt="Captured receipt"
                className="w-full h-48 object-cover rounded-xl border-2 border-blue-500"
              />
              <p className="text-center text-gray-600 text-sm mt-2">Photo captured successfully</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="h-auto py-4 flex-col gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
            >
              <CameraIcon className="w-6 h-6" />
              <span className="text-sm">{isScanning ? 'Scanning...' : 'Take Photo'}</span>
            </Button>

            <Button
              onClick={handleUpload}
              disabled={isScanning}
              variant="outline"
              className="h-auto py-4 flex-col gap-2 bg-white/40 backdrop-blur-lg border-white/60"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Upload Receipt</span>
            </Button>
          </div>

          {isScanning && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600 text-sm mt-2">Analyzing receipt...</p>
            </div>
          )}
        </div>
      )}

      {/* Scan Results */}
      {showResults && (
        <>
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-gray-900 text-base font-semibold">Analysis Complete</h2>
                <p className="text-gray-600 text-sm">Safeway - Nov 7, 2025</p>
              </div>
              <Button
                onClick={() => {
                  setShowResults(false);
                  setCapturedPhoto(null);
                }}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Display captured receipt in results */}
            {capturedPhoto && (
              <div className="mb-4">
                <img
                  src={capturedPhoto}
                  alt="Scanned receipt"
                  className="w-full h-64 object-cover rounded-xl border border-white/40"
                />
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white mb-4">
              <p className="text-white/80 text-xs mb-1">You could save</p>
              <p className="text-3xl font-semibold mb-0.5">${totalSavings.toFixed(2)}</p>
              <p className="text-white/80 text-xs">on this shopping trip</p>
              <p className="mt-2 text-white/90 text-sm">${monthlySavings.toFixed(0)}/month if you switch stores</p>
            </div>

            {/* Price Comparisons */}
            <div className="space-y-2">
              <h3 className="text-gray-900 text-sm font-semibold">Better Prices Found</h3>

              {comparisons.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/40"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm font-medium">{comp.item}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs">
                        <span className="text-gray-600">{comp.currentStore}: ${comp.currentPrice.toFixed(2)}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-blue-600 font-medium">{comp.betterStore}: ${comp.betterPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 text-sm font-semibold">-${comp.savings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Recommendation */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 text-sm font-semibold mb-0.5">Recommended: Aldi</h3>
                <p className="text-gray-600 text-xs mb-2">1.2 miles away • 5 min drive</p>
                <p className="text-gray-700 text-sm mb-3">
                  Shopping at Aldi instead of Safeway could save you ${monthlySavings}/month (${(monthlySavings * 12).toLocaleString()}/year)
                </p>
                <div className="flex gap-2">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-sm h-9">
                    Get Directions
                  </Button>
                  <Button variant="outline" className="bg-white/40 backdrop-blur-lg border-white/60 text-sm h-9">
                    Create Shopping List
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Tips */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
            <h3 className="text-gray-900 text-base font-semibold mb-3">More Savings Tips</h3>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-medium">Buy Generic Brands</p>
                  <p className="text-gray-600 text-xs">Save an additional $43/month</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-medium">Shop on Markdown Days</p>
                  <p className="text-gray-600 text-xs">Aldi marks down items on Wednesdays</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-medium">Use SNAP at Farmers Market</p>
                  <p className="text-gray-600 text-xs">Get $40 bonus for fresh produce</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent Scans */}
      {!showResults && (
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
          <h2 className="text-gray-900 text-base font-semibold mb-3">Recent Scans</h2>

          <div className="space-y-2">
            {recentReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/40 hover:bg-white/60 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm font-medium">{receipt.store}</p>
                    <p className="text-gray-600 text-xs">
                      {receipt.date.toLocaleDateString()} • {receipt.items} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 text-sm font-semibold">${receipt.total.toFixed(2)}</p>
                    <p className="text-green-600 text-xs font-medium">Save ${receipt.savings.toFixed(2)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
