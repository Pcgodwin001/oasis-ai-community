import { useState, useEffect } from 'react';
import { CreditCard, Calendar, AlertTriangle, DollarSign, CheckCircle, XCircle, Clock, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../contexts/UserContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Benefit {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  amount?: number;
  frequency?: string;
  nextDate?: Date;
  description: string;
}

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  balance_after: number;
}

interface EBTAccount {
  id: string;
  user_id: string;
  card_last_four: string | null;
  state: string | null;
  current_balance: number;
  refill_date: string | null;
}

export default function EBTBalance() {
  const { user } = useUser();
  const [ebtAccount, setEbtAccount] = useState<EBTAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Link card form
  const [cardLastFour, setCardLastFour] = useState('');
  const [state, setState] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [refillDate, setRefillDate] = useState('');

  // Add transaction form
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      loadEBTData();
    }
  }, [user]);

  const loadEBTData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch EBT account
      const { data: ebtData, error: ebtError } = await supabase
        .from('ebt_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (ebtError && ebtError.code !== 'PGRST116') {
        console.error('Error fetching EBT account:', ebtError);
      } else if (ebtData) {
        setEbtAccount(ebtData);

        // Fetch transactions
        const { data: transData, error: transError } = await supabase
          .from('transactions')
          .select('*')
          .eq('ebt_account_id', ebtData.id)
          .order('date', { ascending: false })
          .limit(20);

        if (transError) {
          console.error('Error fetching transactions:', transError);
        } else if (transData) {
          setTransactions(transData);
        }
      }
    } catch (error) {
      console.error('Error loading EBT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ebt_accounts')
        .insert({
          user_id: user.id,
          card_last_four: cardLastFour,
          state: state,
          current_balance: parseFloat(currentBalance),
          refill_date: refillDate,
        })
        .select()
        .single();

      if (error) throw error;

      setEbtAccount(data);
      setShowLinkDialog(false);
      // Reset form
      setCardLastFour('');
      setState('');
      setCurrentBalance('');
      setRefillDate('');
    } catch (error) {
      console.error('Error linking card:', error);
      alert('Failed to link card. Please try again.');
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !ebtAccount) return;

    try {
      const transactionAmount = parseFloat(amount);
      const newBalance = Number(ebtAccount.current_balance) - transactionAmount;

      // Insert transaction
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ebt_account_id: ebtAccount.id,
          date: transactionDate,
          merchant: merchant,
          category: category,
          amount: transactionAmount,
          balance_after: newBalance,
        })
        .select()
        .single();

      if (transError) throw transError;

      // Update EBT account balance
      const { error: updateError } = await supabase
        .from('ebt_accounts')
        .update({ current_balance: newBalance })
        .eq('id', ebtAccount.id);

      if (updateError) throw updateError;

      // Update local state
      setEbtAccount({ ...ebtAccount, current_balance: newBalance });
      setTransactions([transData, ...transactions]);
      setShowAddTransaction(false);

      // Reset form
      setMerchant('');
      setCategory('Groceries');
      setAmount('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const snapAllotment = 535; // Could be fetched from user profile or eligibility results
  const snapBalance = ebtAccount ? Number(ebtAccount.current_balance) : 0;
  const snapUsed = snapAllotment - snapBalance;
  const snapUsedPercent = (snapUsed / snapAllotment) * 100;
  const refillDateObj = ebtAccount?.refill_date ? new Date(ebtAccount.refill_date) : null;
  const daysUntilRefill = refillDateObj
    ? Math.ceil((refillDateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculate spending by category
  const spendingByCategory = transactions.reduce((acc, t) => {
    const cat = t.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const activeBenefits: Benefit[] = [
    {
      id: '1',
      name: 'SNAP/EBT',
      status: 'active',
      amount: 535,
      frequency: 'monthly',
      nextDate: new Date('2025-11-20'),
      description: 'Supplemental Nutrition Assistance',
    },
  ];

  const missingBenefits: Benefit[] = [
    {
      id: '2',
      name: 'EITC (Earned Income Tax Credit)',
      status: 'inactive',
      amount: 2847,
      frequency: 'annual',
      description: 'You may qualify for $2,847/year',
    },
    {
      id: '3',
      name: 'WIC',
      status: 'inactive',
      amount: 50,
      frequency: 'monthly',
      description: 'Women, Infants, and Children nutrition program',
    },
    {
      id: '4',
      name: 'LIHEAP',
      status: 'inactive',
      amount: 300,
      frequency: 'annual',
      description: 'Low Income Home Energy Assistance',
    },
    {
      id: '5',
      name: 'Lifeline',
      status: 'inactive',
      amount: 30,
      frequency: 'monthly',
      description: 'Phone/Internet service discount',
    },
  ];

  const totalMissingMonthly = missingBenefits
    .filter(b => b.frequency === 'monthly')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const totalMissingAnnual = missingBenefits
    .filter(b => b.frequency === 'annual')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl">Benefits Tracker</h1>
            <p className="text-gray-600">Manage your assistance programs</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* SNAP/EBT Balance */}
      {ebtAccount ? (
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 mb-1">SNAP/EBT Balance</p>
              <p className="text-5xl">${snapBalance.toFixed(2)}</p>
            </div>
            <CreditCard className="w-12 h-12 text-white/40" />
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Used this month</span>
              <span>${snapUsed.toFixed(2)} of ${snapAllotment}</span>
            </div>
            <Progress value={snapUsedPercent} className="h-2 bg-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/80 text-sm">Next Refill</p>
              <p className="text-xl">
                {refillDateObj
                  ? refillDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Not set'}
              </p>
              <p className="text-white/80 text-sm">{daysUntilRefill > 0 ? `${daysUntilRefill} days` : 'Past due'}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm">Card Ending</p>
              <p className="text-xl">****{ebtAccount.card_last_four || '0000'}</p>
              <p className="text-white/80 text-sm">{ebtAccount.state || 'N/A'}</p>
            </div>
          </div>

          <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-white/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>Record a new EBT transaction to track your spending.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <Label htmlFor="merchant">Merchant</Label>
                  <Input
                    id="merchant"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    placeholder="Walmart, Target, etc."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Produce">Produce</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-600">
                  Add Transaction
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 text-white">
          <div className="text-center py-8">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h3 className="text-2xl mb-2">No EBT Card Linked</h3>
            <p className="text-white/80 mb-6">Connect your EBT card to start tracking your benefits</p>
            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-white/90">Link EBT Card</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Link Your EBT Card</DialogTitle>
                  <DialogDescription>
                    Enter your EBT card details to track your benefits and spending.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLinkCard} className="space-y-4">
                  <div>
                    <Label htmlFor="cardLastFour">Card Last 4 Digits</Label>
                    <Input
                      id="cardLastFour"
                      value={cardLastFour}
                      onChange={(e) => setCardLastFour(e.target.value.slice(0, 4))}
                      placeholder="1234"
                      maxLength={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA, NY, TX, etc."
                      maxLength={2}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="balance">Current Balance</Label>
                    <Input
                      id="balance"
                      type="number"
                      step="0.01"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="refillDate">Next Refill Date</Label>
                    <Input
                      id="refillDate"
                      type="date"
                      value={refillDate}
                      onChange={(e) => setRefillDate(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-600">
                    Link Card
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Government Shutdown Alert */}
      <div className="bg-rose-300/30 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Shutdown Risk: 35%</h3>
            <p className="text-gray-600 text-sm mb-4">
              SNAP benefits may be delayed if government shutdown occurs by Nov 17
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Nov 20 refill is protected (already funded)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-gray-700">Dec 20 refill may be at risk</span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white">
              View Backup Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Active Benefits */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h2 className="text-gray-900 text-xl mb-4">Active Benefits</h2>
        
        <div className="space-y-3">
          {activeBenefits.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white/40 backdrop-blur-lg rounded-2xl p-4 border border-white/40"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-900">{benefit.name}</p>
                  </div>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/40">
                <div>
                  <p className="text-gray-600 text-xs">Amount</p>
                  <p className="text-gray-900">${benefit.amount}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Frequency</p>
                  <p className="text-gray-900 capitalize">{benefit.frequency}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Next Date</p>
                  <p className="text-gray-900">{benefit.nextDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Benefits */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 text-xl">Missing Benefits</h2>
            <p className="text-gray-600">You may qualify for these programs</p>
          </div>
          <div className="text-right">
            <p className="text-blue-600 text-2xl">${(totalMissingMonthly * 12 + totalMissingAnnual).toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Per year</p>
          </div>
        </div>

        <div className="space-y-3">
          {missingBenefits.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-gray-900">{benefit.name}</p>
                  </div>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200/40">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-600 text-xs">Potential</p>
                    <p className="text-blue-600">${benefit.amount}/{benefit.frequency === 'monthly' ? 'mo' : 'year'}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-white/60 border-blue-200/40 hover:bg-white/80"
                >
                  Check Eligibility
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Optimization */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 text-white">
        <h3 className="text-2xl mb-2">Maximize Your Benefits</h3>
        <p className="text-white/80 mb-6">
          By applying for all eligible programs, you could receive an additional ${(totalMissingMonthly * 12 + totalMissingAnnual).toLocaleString()}/year
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span>Current Annual Benefits</span>
            <span className="text-2xl">${(snapAllotment * 12).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Potential Additional Benefits</span>
            <span className="text-2xl">+${(totalMissingMonthly * 12 + totalMissingAnnual).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span>Total Possible Benefits</span>
            <span className="text-3xl">${(snapAllotment * 12 + totalMissingMonthly * 12 + totalMissingAnnual).toLocaleString()}</span>
          </div>
        </div>

        <Button className="w-full bg-white text-blue-600 hover:bg-white/90">
          Start Application Process
        </Button>
      </div>

      {/* Transaction History */}
      {ebtAccount && transactions.length > 0 && (
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
          <h3 className="text-gray-900 text-xl mb-4">Recent Transactions</h3>

          <div className="space-y-2">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white/40 backdrop-blur-lg rounded-2xl p-4 border border-white/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{transaction.merchant}</p>
                      <p className="text-gray-600 text-sm">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-semibold">-${Number(transaction.amount).toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-white/40">
                  <span>Balance after</span>
                  <span>${Number(transaction.balance_after).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending by Category */}
      {ebtAccount && Object.keys(spendingByCategory).length > 0 && (
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
          <h3 className="text-gray-900 text-xl mb-4">Spending by Category</h3>

          <div className="space-y-3">
            {Object.entries(spendingByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const total = Object.values(spendingByCategory).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? (amount / total) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">{category}</span>
                      <span className="text-gray-900 font-semibold">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Spending Alerts */}
      {ebtAccount && daysUntilRefill > 0 && snapBalance > 0 && (
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
          <h3 className="text-gray-900 text-xl mb-4">Spending Alerts</h3>

          <div className="space-y-3">
            {snapBalance / daysUntilRefill < 10 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-100/50 rounded-2xl border border-yellow-200/40">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">Low Daily Budget</p>
                  <p className="text-gray-600 text-sm">
                    You have ${(snapBalance / daysUntilRefill).toFixed(2)}/day until refill.
                    Consider shopping at discount stores.
                  </p>
                </div>
              </div>
            )}

            {snapUsedPercent > 75 && daysUntilRefill > 7 && (
              <div className="flex items-start gap-3 p-4 bg-rose-100/50 rounded-2xl border border-rose-200/40">
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">High Spending Rate</p>
                  <p className="text-gray-600 text-sm">
                    You have used {snapUsedPercent.toFixed(0)}% of your benefits with {daysUntilRefill} days remaining.
                    Try to reduce spending to ${(snapBalance / daysUntilRefill).toFixed(2)}/day.
                  </p>
                </div>
              </div>
            )}

            {snapUsedPercent < 50 && daysUntilRefill < 7 && (
              <div className="flex items-start gap-3 p-4 bg-green-100/50 rounded-2xl border border-green-200/40">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">Great Job!</p>
                  <p className="text-gray-600 text-sm">
                    You are on track with your benefits. You have ${snapBalance.toFixed(2)} remaining
                    for the next {daysUntilRefill} days.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spending Tips */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h3 className="text-gray-900 mb-4">Make Your SNAP Last Longer</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">Shop at Aldi</p>
              <p className="text-gray-600 text-sm">Your ${snapBalance.toFixed(0)} could buy 35% more groceries</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">Farmers Market Match</p>
              <p className="text-gray-600 text-sm">Get $40 bonus when you use SNAP for fresh produce</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">Meal Planning</p>
              <p className="text-gray-600 text-sm">Plan weekly meals to avoid impulse purchases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
