import { useState, useEffect, useRef } from 'react';
import {
  Upload, Camera, FileText, TrendingUp, TrendingDown, Plus, X,
  DollarSign, Calendar, Store, Tag, Trash2, Eye, Search, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { receiptService, Receipt, ReceiptItem, ReceiptStats, PriceComparison } from '../../services/receiptService';
import { Badge } from '../ui/badge';

export default function ReceiptScanner() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState<ReceiptStats | null>(null);
  const [priceComparisons, setPriceComparisons] = useState<PriceComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [manualEntryDialogOpen, setManualEntryDialogOpen] = useState(false);
  const [viewReceiptDialog, setViewReceiptDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newReceipt, setNewReceipt] = useState<Partial<Receipt>>({
    store_name: '',
    purchase_date: new Date().toISOString().split('T')[0],
    total_amount: 0,
    tax_amount: 0,
    subtotal: 0,
    payment_method: 'cash',
    category: 'groceries',
    notes: '',
    items: [],
  });

  const [newItem, setNewItem] = useState<Partial<ReceiptItem>>({
    item_name: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [receiptsData, statsData, comparisonsData] = await Promise.all([
        receiptService.getReceipts(20),
        receiptService.getReceiptStats(),
        receiptService.getPriceComparisons(),
      ]);
      setReceipts(receiptsData);
      setStats(statsData);
      setPriceComparisons(comparisonsData);
    } catch (error) {
      toast.error('Failed to load receipt data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await receiptService.uploadReceiptImage(file);
      const receiptData = await receiptService.processReceiptOCR(imageUrl);

      setNewReceipt({
        ...receiptData,
        image_url: imageUrl,
        purchase_date: new Date().toISOString().split('T')[0],
      });

      setUploadDialogOpen(false);
      setManualEntryDialogOpen(true);
      toast.success('Receipt image uploaded! Please review and complete the details.');
    } catch (error) {
      toast.error('Failed to upload receipt image');
    } finally {
      setUploading(false);
    }
  };

  const addItemToReceipt = () => {
    if (!newItem.item_name || !newItem.quantity || !newItem.unit_price) {
      toast.error('Please fill in all item details');
      return;
    }

    const total_price = newItem.quantity! * newItem.unit_price!;
    const item: ReceiptItem = {
      ...newItem as ReceiptItem,
      total_price,
    };

    setNewReceipt({
      ...newReceipt,
      items: [...(newReceipt.items || []), item],
    });

    // Update totals
    const subtotal = (newReceipt.subtotal || 0) + total_price;
    const tax = newReceipt.tax_amount || 0;
    const total = subtotal + tax;

    setNewReceipt({
      ...newReceipt,
      subtotal,
      total_amount: total,
      items: [...(newReceipt.items || []), item],
    });

    setNewItem({
      item_name: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    });
  };

  const removeItemFromReceipt = (index: number) => {
    const items = [...(newReceipt.items || [])];
    const removedItem = items[index];
    items.splice(index, 1);

    const subtotal = (newReceipt.subtotal || 0) - removedItem.total_price;
    const tax = newReceipt.tax_amount || 0;
    const total = subtotal + tax;

    setNewReceipt({
      ...newReceipt,
      items,
      subtotal,
      total_amount: total,
    });
  };

  const handleSaveReceipt = async () => {
    try {
      if (!newReceipt.store_name || !newReceipt.total_amount) {
        toast.error('Please fill in store name and total amount');
        return;
      }

      await receiptService.createReceipt(newReceipt as Receipt);
      toast.success('Receipt saved successfully!');
      setManualEntryDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Failed to save receipt');
    }
  };

  const handleDeleteReceipt = async (id: string) => {
    try {
      await receiptService.deleteReceipt(id);
      toast.success('Receipt deleted');
      loadData();
      setViewReceiptDialog(false);
    } catch (error) {
      toast.error('Failed to delete receipt');
    }
  };

  const resetForm = () => {
    setNewReceipt({
      store_name: '',
      purchase_date: new Date().toISOString().split('T')[0],
      total_amount: 0,
      tax_amount: 0,
      subtotal: 0,
      payment_method: 'cash',
      category: 'groceries',
      notes: '',
      items: [],
    });
    setNewItem({
      item_name: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receipt Scanner & Price Tracker</h1>
          <p className="text-gray-600">Track your spending and compare prices across stores</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan Receipt
          </Button>
          <Button
            onClick={() => setManualEntryDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Manually
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-white/60 border-white/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Receipts</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_receipts || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/60 border-white/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.total_amount || 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/60 border-white/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Transaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.average_transaction || 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/60 border-white/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.this_month_total || 0)}
                </p>
                {stats && stats.last_month_total > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {stats.this_month_total > stats.last_month_total ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`text-xs ${stats.this_month_total > stats.last_month_total ? 'text-red-500' : 'text-green-500'}`}>
                      {Math.abs(((stats.this_month_total - stats.last_month_total) / stats.last_month_total) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receipts" className="w-full">
        <TabsList>
          <TabsTrigger value="receipts">Recent Receipts</TabsTrigger>
          <TabsTrigger value="comparisons">Price Comparisons</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts" className="space-y-4 mt-6">
          {receipts.length === 0 ? (
            <Card className="backdrop-blur-xl bg-white/60 border-white/60">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No receipts yet</h3>
                <p className="text-gray-600 mb-6">Start tracking your spending by adding your first receipt</p>
                <Button onClick={() => setManualEntryDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Receipt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receipts.map((receipt) => (
                <Card
                  key={receipt.id}
                  className="backdrop-blur-xl bg-white/60 border-white/60 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setViewReceiptDialog(true);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {receipt.store_name || 'Unknown Store'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {receipt.purchase_date ? formatDate(receipt.purchase_date) : 'No date'}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {formatCurrency(receipt.total_amount)}
                      </Badge>
                    </div>

                    {receipt.items && receipt.items.length > 0 && (
                      <div className="text-sm text-gray-600 mb-3">
                        {receipt.items.length} item{receipt.items.length !== 1 ? 's' : ''}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      {receipt.category && (
                        <Badge variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {receipt.category}
                        </Badge>
                      )}
                      {receipt.payment_method && (
                        <Badge variant="secondary" className="text-xs">
                          {receipt.payment_method}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparisons" className="space-y-4 mt-6">
          {priceComparisons.length === 0 ? (
            <Card className="backdrop-blur-xl bg-white/60 border-white/60">
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No price comparisons yet</h3>
                <p className="text-gray-600">Add receipts from different stores to compare prices</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {priceComparisons.map((comparison, index) => (
                <Card key={index} className="backdrop-blur-xl bg-white/60 border-white/60">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize mb-1">
                          {comparison.item_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Found in {comparison.stores.length} stores
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Potential Savings</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(comparison.worst_price - comparison.best_price)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {comparison.stores.map((store, storeIndex) => (
                        <div
                          key={storeIndex}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            store.price === comparison.best_price
                              ? 'bg-green-50 border border-green-200'
                              : store.price === comparison.worst_price
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Store className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-900">{store.store_name}</span>
                            {store.price === comparison.best_price && (
                              <Badge className="bg-green-600">Best Price</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(store.price)}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDate(store.last_purchase)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Receipt</DialogTitle>
            <DialogDescription>
              Take a photo or upload an image of your receipt
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Entry Dialog */}
      <Dialog open={manualEntryDialogOpen} onOpenChange={setManualEntryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Receipt Details</DialogTitle>
            <DialogDescription>
              Enter receipt information manually
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Store Name *</Label>
                <Input
                  value={newReceipt.store_name}
                  onChange={(e) => setNewReceipt({ ...newReceipt, store_name: e.target.value })}
                  placeholder="Walmart, Target, etc."
                />
              </div>
              <div>
                <Label>Purchase Date *</Label>
                <Input
                  type="date"
                  value={newReceipt.purchase_date}
                  onChange={(e) => setNewReceipt({ ...newReceipt, purchase_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={newReceipt.category}
                  onValueChange={(value) => setNewReceipt({ ...newReceipt, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="dining">Dining</SelectItem>
                    <SelectItem value="gas">Gas/Fuel</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="household">Household</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={newReceipt.payment_method}
                  onValueChange={(value) => setNewReceipt({ ...newReceipt, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                    <SelectItem value="ebt">EBT/SNAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={newReceipt.notes}
                onChange={(e) => setNewReceipt({ ...newReceipt, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Items</h4>

              <div className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-5">
                  <Input
                    placeholder="Item name"
                    value={newItem.item_name}
                    onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newItem.unit_price}
                    onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-2">
                  <Button onClick={addItemToReceipt} className="w-full" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {newReceipt.items && newReceipt.items.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {newReceipt.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.item_name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.total_price)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemFromReceipt(index)}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(newReceipt.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax:</span>
                <Input
                  type="number"
                  step="0.01"
                  className="w-32 text-right"
                  value={newReceipt.tax_amount}
                  onChange={(e) => {
                    const tax = parseFloat(e.target.value) || 0;
                    setNewReceipt({
                      ...newReceipt,
                      tax_amount: tax,
                      total_amount: (newReceipt.subtotal || 0) + tax,
                    });
                  }}
                />
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(newReceipt.total_amount || 0)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setManualEntryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReceipt}>Save Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Receipt Dialog */}
      <Dialog open={viewReceiptDialog} onOpenChange={setViewReceiptDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Store</Label>
                  <p className="font-medium">{selectedReceipt.store_name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Date</Label>
                  <p className="font-medium">
                    {selectedReceipt.purchase_date ? formatDate(selectedReceipt.purchase_date) : 'N/A'}
                  </p>
                </div>
              </div>

              {selectedReceipt.items && selectedReceipt.items.length > 0 && (
                <div>
                  <Label className="text-gray-600">Items</Label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {selectedReceipt.items.map((item, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{item.item_name}</span>
                        <div className="text-right">
                          <span className="text-gray-600 text-sm mr-3">
                            {item.quantity} × {formatCurrency(item.unit_price)}
                          </span>
                          <span className="font-medium">{formatCurrency(item.total_price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(selectedReceipt.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>{formatCurrency(selectedReceipt.tax_amount || 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedReceipt.total_amount)}</span>
                </div>
              </div>

              {selectedReceipt.notes && (
                <div>
                  <Label className="text-gray-600">Notes</Label>
                  <p className="mt-1">{selectedReceipt.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => selectedReceipt && handleDeleteReceipt(selectedReceipt.id!)}
              className="mr-auto text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button onClick={() => setViewReceiptDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
