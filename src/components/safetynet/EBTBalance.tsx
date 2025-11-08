import { useState } from 'react';
import { 
  CreditCard, RefreshCw, Download, Settings as SettingsIcon, Plus,
  TrendingDown, Calendar, DollarSign, AlertCircle, Filter, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const spendingData = [
  { date: 'Oct 8', spent: 45, budget: 50 },
  { date: 'Oct 15', spent: 48, budget: 50 },
  { date: 'Oct 22', spent: 42, budget: 50 },
  { date: 'Oct 29', spent: 52, budget: 50 },
  { date: 'Nov 5', spent: 38, budget: 50 },
];

const categoryData = [
  { name: 'Groceries', value: 320, color: '#3b82f6' },
  { name: 'Household', value: 85, color: '#10b981' },
  { name: 'Personal Care', value: 45, color: '#f59e0b' },
  { name: 'Other', value: 25, color: '#6366f1' },
];

const allTransactions = [
  { id: 1, date: '2025-11-07', merchant: 'Walmart Supercenter', category: 'Groceries', amount: -28.45, balance: 296.55 },
  { id: 2, date: '2025-11-06', merchant: 'Dollar General', category: 'Household', amount: -15.20, balance: 325.00 },
  { id: 3, date: '2025-11-05', merchant: 'Kroger', category: 'Groceries', amount: -42.67, balance: 340.20 },
  { id: 4, date: '2025-11-04', merchant: 'CVS Pharmacy', category: 'Personal Care', amount: -18.99, balance: 382.87 },
  { id: 5, date: '2025-11-03', merchant: 'Aldi', category: 'Groceries', amount: -35.42, balance: 401.86 },
  { id: 6, date: '2025-11-01', merchant: 'SNAP Monthly Deposit', category: 'Deposit', amount: 425.00, balance: 437.28 },
  { id: 7, date: '2025-10-30', merchant: 'Walmart Supercenter', category: 'Groceries', amount: -31.15, balance: 12.28 },
];

export default function EBTBalance() {
  const [timeRange, setTimeRange] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [addCardOpen, setAddCardOpen] = useState(false);

  const currentBalance = 296.55;
  const lastDeposit = 425.00;
  const daysUntilRefill = 3;
  const dailyBudget = 14.83;
  const totalSpent = 296.55;
  const avgDailySpending = 42.36;
  const projectedRunOut = 'Nov 14';

  const filteredTransactions = allTransactions.filter(t =>
    t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">EBT Balance Management</h1>
          <p className="text-gray-600">Track your benefits and spending</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add EBT Card</DialogTitle>
                <DialogDescription>
                  Your information is encrypted and secure. We never store your full card number.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="**** **** **** 1234" type="text" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardPin">PIN (for verification only)</Label>
                  <Input id="cardPin" placeholder="****" type="password" maxLength={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddCardOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  Add Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Balance & Charts */}
        <div className="lg:col-span-3 space-y-6">
          {/* Balance Card */}
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-2">Current Balance</p>
                  <p className="text-gray-900">${currentBalance.toFixed(2)}</p>
                  <div className="flex items-center space-x-4 mt-3 text-gray-600">
                    <div>
                      <p>Last Deposit</p>
                      <p className="text-gray-900">${lastDeposit.toFixed(2)}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-300" />
                    <div>
                      <p>Refill in</p>
                      <p className="text-gray-900">{daysUntilRefill} days</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Spending Progress</span>
                    <span className="text-gray-900">
                      ${totalSpent.toFixed(2)} / ${lastDeposit.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={70} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spending Chart */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Spending Over Time</CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="spent" stroke="#3b82f6" name="Spent" strokeWidth={2} />
                    <Line type="monotone" dataKey="budget" stroke="#10b981" name="Budget" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Budget Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <DollarSign className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-gray-600">Daily Budget</p>
                  <p className="text-gray-900">${dailyBudget.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <TrendingDown className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-gray-600">Avg Daily Spending</p>
                  <p className="text-gray-900">${avgDailySpending.toFixed(2)}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <Calendar className="w-5 h-5 text-orange-600 mb-2" />
                  <p className="text-gray-600">Projected Run-Out</p>
                  <p className="text-gray-900">{projectedRunOut}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 mb-1">Budget Recommendation</p>
                  <p className="text-gray-600">
                    You're spending ${(avgDailySpending - dailyBudget).toFixed(2)} more than your daily budget. 
                    Consider shopping at discount stores to reduce spending.
                  </p>
                  <Button variant="link" className="px-0 h-auto text-blue-600 mt-2">
                    View Budget Guide →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-gray-900">${category.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Total Spent This Month</p>
                <p className="text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Days Remaining</p>
                <p className="text-gray-900">{daysUntilRefill} days</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Transaction Count</p>
                <p className="text-gray-900">{allTransactions.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="flex justify-between mb-1">
                      <p className="text-gray-900">{transaction.merchant}</p>
                      <p className={transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <p className="text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.merchant}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className={`text-right ${transaction.amount > 0 ? 'text-green-600' : ''}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">${transaction.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
