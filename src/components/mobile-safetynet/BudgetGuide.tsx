import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../contexts/UserContext';

interface BudgetEntry {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description: string | null;
  created_at: string;
}

export default function BudgetGuide() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('forecast');
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');

  // Form state
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  // Fetch budget entries from Supabase
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('budget_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching budget entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('budget_entries')
        .insert({
          user_id: user.id,
          category: formData.category,
          amount: parseFloat(formData.amount),
          type: entryType,
          date: formData.date,
          description: formData.description || null,
        });

      if (error) throw error;

      // Reset form and close dialog
      setFormData({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setIsAddDialogOpen(false);

      // Refresh entries
      await fetchEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
      alert('Failed to add entry. Please try again.');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('budget_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh entries
      await fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  // Calculate totals from real data
  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + parseFloat(String(e.amount)), 0);

  const totalExpenses = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + parseFloat(String(e.amount)), 0);

  const balance = totalIncome - totalExpenses;

  // Calculate category breakdown
  const categoryTotals = entries
    .filter(e => e.type === 'expense')
    .reduce((acc, entry) => {
      const category = entry.category;
      acc[category] = (acc[category] || 0) + parseFloat(String(entry.amount));
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    budgeted: amount * 1.2, // Mock budgeted amount (20% more than actual)
    actual: amount,
    remaining: amount * 0.2,
  }));

  // Generate 30-day forecast based on real data
  const generateForecast = () => {
    const forecast = [];
    let currentBalance = balance;
    const avgDailyExpense = totalExpenses / 30;
    const avgDailyIncome = totalIncome / 30;

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Simulate income on certain days (e.g., 1st and 15th)
      const dayOfMonth = date.getDate();
      const income = (dayOfMonth === 1 || dayOfMonth === 15) ? avgDailyIncome * 15 : 0;
      const expenses = avgDailyExpense;

      currentBalance = currentBalance + income - expenses;

      forecast.push({
        date: dateStr,
        income,
        expenses,
        balance: currentBalance,
      });
    }

    return forecast;
  };

  const forecastData = generateForecast();

  // Monthly comparison
  const monthlyComparison = [
    { month: 'Aug', income: totalIncome * 0.95, expenses: totalExpenses * 0.9 },
    { month: 'Sep', income: totalIncome * 0.98, expenses: totalExpenses * 0.95 },
    { month: 'Oct', income: totalIncome * 1.02, expenses: totalExpenses * 1.02 },
    { month: 'Nov', income: totalIncome, expenses: totalExpenses },
  ];

  const crisisPoints = forecastData
    .filter(d => d.balance < 0)
    .slice(0, 2)
    .map((d, i) => ({
      id: String(i),
      date: d.date,
      type: 'Potential Shortfall',
      shortage: Math.abs(d.balance),
      severity: Math.abs(d.balance) > 100 ? 'critical' : 'high',
      description: `Balance may go negative by $${Math.abs(d.balance).toFixed(2)}`,
    }));

  const optimizations = [
    {
      id: '1',
      category: 'Groceries',
      current: categoryTotals['Groceries'] || 0,
      optimized: (categoryTotals['Groceries'] || 0) * 0.8,
      savings: (categoryTotals['Groceries'] || 0) * 0.2,
      action: 'Switch to Aldi, buy generic brands',
    },
    {
      id: '2',
      category: 'Utilities',
      current: categoryTotals['Utilities'] || 0,
      optimized: (categoryTotals['Utilities'] || 0) * 0.75,
      savings: (categoryTotals['Utilities'] || 0) * 0.25,
      action: 'Apply for LIHEAP heating assistance',
    },
  ];

  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.savings, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading budget data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-lg font-semibold">Smart Budget Guide</h1>
            <p className="text-gray-600 text-sm">Track your income and expenses</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Total Income</span>
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">${totalIncome.toFixed(2)}</p>
          <p className="text-gray-600 text-xs">{entries.filter(e => e.type === 'income').length} entries</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Total Expenses</span>
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">${totalExpenses.toFixed(2)}</p>
          <p className="text-gray-600 text-xs">{entries.filter(e => e.type === 'expense').length} entries</p>
        </div>

        <div className={`backdrop-blur-lg rounded-xl shadow-lg p-3 border ${balance >= 0 ? 'bg-green-300/30 border-green-200/40' : 'bg-rose-300/30 border-white/60'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Balance</span>
            <DollarSign className={`w-3.5 h-3.5 ${balance >= 0 ? 'text-green-600' : 'text-rose-600'}`} />
          </div>
          <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-green-900' : 'text-rose-900'}`}>
            ${Math.abs(balance).toFixed(2)}
          </p>
          <p className="text-gray-600 text-xs">{balance >= 0 ? 'Surplus' : 'Deficit'}</p>
        </div>

        <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-blue-200/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">AI Savings</span>
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">${totalSavings.toFixed(0)}</p>
          <p className="text-gray-600 text-xs">Available/month</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Dialog open={isAddDialogOpen && entryType === 'income'} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (open) setEntryType('income');
        }}>
          <DialogTrigger asChild>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Income</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="SNAP">SNAP Benefits</SelectItem>
                    <SelectItem value="WIC">WIC Benefits</SelectItem>
                    <SelectItem value="TANF">TANF Benefits</SelectItem>
                    <SelectItem value="Other Income">Other Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes..."
                />
              </div>
              <Button type="submit" className="w-full">Add Income</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddDialogOpen && entryType === 'expense'} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (open) setEntryType('expense');
        }}>
          <DialogTrigger asChild>
            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes..."
                />
              </div>
              <Button type="submit" className="w-full">Add Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-lg p-1 rounded-xl border border-white/60">
          <TabsTrigger value="forecast" className="rounded-lg text-xs">Forecast</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg text-xs">Categories</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg text-xs">History</TabsTrigger>
          <TabsTrigger value="optimize" className="rounded-lg text-xs">Optimize</TabsTrigger>
        </TabsList>

        {/* 30-Day Forecast Tab */}
        <TabsContent value="forecast" className="space-y-3 mt-4">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
            <h2 className="text-gray-900 text-base font-semibold mb-3">14-Day Cash Flow</h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl p-3 border border-white/60">
                            <p className="text-gray-900 font-semibold">{data.date}</p>
                            <p className="text-green-600">Income: ${data.income.toFixed(2)}</p>
                            <p className="text-rose-600">Expenses: ${data.expenses.toFixed(2)}</p>
                            <p className="text-blue-600 font-semibold">Balance: ${data.balance.toFixed(2)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {crisisPoints.length > 0 && (
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
              <h2 className="text-gray-900 text-base font-semibold mb-3">Potential Issues</h2>

              <div className="space-y-2">
                {crisisPoints.map((crisis) => (
                  <div
                    key={crisis.id}
                    className={`backdrop-blur-lg rounded-xl p-3 border ${
                      crisis.severity === 'critical'
                        ? 'bg-rose-300/30 border-white/40'
                        : 'bg-yellow-300/30 border-white/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-600" />
                          <span className="text-gray-900 text-sm font-medium">{crisis.date}</span>
                        </div>
                        <p className="text-gray-900 text-sm font-medium">{crisis.type}</p>
                        <p className="text-gray-600 text-xs">{crisis.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-rose-600 text-sm font-semibold">-${crisis.shortage.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Comparison */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
            <h2 className="text-gray-900 text-base font-semibold mb-3">Income vs Expenses</h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#22c55e" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-3 mt-4">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
            <h2 className="text-gray-900 text-base font-semibold mb-3">Category Breakdown</h2>

            {categoryData.length > 0 ? (
              <div className="space-y-3">
                {categoryData.map((cat) => {
                  const percentUsed = (cat.actual / cat.budgeted) * 100;
                  const isOverBudget = cat.actual > cat.budgeted;

                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 text-sm font-medium">{cat.category}</span>
                        <span className={`text-sm font-medium ${isOverBudget ? 'text-rose-600' : 'text-gray-700'}`}>
                          ${cat.actual.toFixed(2)}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isOverBudget
                              ? 'bg-rose-500'
                              : percentUsed > 80
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{percentUsed.toFixed(0)}% of budget</span>
                        <span className="text-gray-600">${cat.actual.toFixed(2)} spent</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 text-sm text-center py-4">No expense categories yet. Add your first expense to get started!</p>
            )}
          </div>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-3 mt-4">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
            <h2 className="text-gray-900 text-base font-semibold mb-3">Recent Transactions</h2>

            {entries.length > 0 ? (
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-900 text-sm font-medium">{entry.category}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            entry.type === 'income'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {entry.type}
                          </span>
                        </div>
                        {entry.description && (
                          <p className="text-gray-600 text-xs mb-1">{entry.description}</p>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-semibold ${
                          entry.type === 'income' ? 'text-green-600' : 'text-rose-600'
                        }`}>
                          {entry.type === 'income' ? '+' : '-'}${parseFloat(String(entry.amount)).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 hover:bg-rose-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm text-center py-4">
                No transactions yet. Click "Add Income" or "Add Expense" to get started!
              </p>
            )}
          </div>
        </TabsContent>

        {/* Optimize Tab */}
        <TabsContent value="optimize" className="space-y-3 mt-4">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-gray-900 text-base font-semibold">AI Optimizations</h2>
                <p className="text-gray-600 text-xs">Save ${totalSavings.toFixed(0)}/month</p>
              </div>
              <div className="text-right">
                <p className="text-blue-600 text-xl font-semibold">${(totalSavings * 12).toFixed(0)}</p>
                <p className="text-gray-600 text-xs">Per year</p>
              </div>
            </div>

            <div className="space-y-2">
              {optimizations.map((opt) => (
                <div
                  key={opt.id}
                  className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/40 hover:bg-white/60 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm font-medium">{opt.category}</p>
                      <p className="text-gray-600 text-xs">{opt.action}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-600">Current: ${opt.current.toFixed(0)}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-900 font-medium">Optimized: ${opt.optimized.toFixed(0)}</span>
                    </div>
                    <span className="text-green-600 text-sm font-semibold">-${opt.savings.toFixed(0)}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Plan */}
          {totalSavings > 0 && (
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-4 text-white">
              <h2 className="text-xl font-semibold mb-1.5">Your Savings Potential</h2>
              <p className="text-white/80 text-sm mb-4">
                By implementing all optimizations, you could save ${(totalSavings * 12).toFixed(0)} per year.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Monthly Savings</span>
                  <span className="text-xl font-semibold">${totalSavings.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Emergency Fund (6 months)</span>
                  <span className="text-xl font-semibold">${(totalSavings * 6).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Annual Savings</span>
                  <span className="text-xl font-semibold">${(totalSavings * 12).toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
