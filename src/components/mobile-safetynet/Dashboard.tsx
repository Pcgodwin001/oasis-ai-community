import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  MessageSquare,
  ScanLine,
  MapPin,
  Briefcase,
  Users,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  CreditCard,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../contexts/UserContext';

interface BudgetEntry {
  id: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description: string | null;
}

interface EBTAccount {
  id: string;
  current_balance: number;
  refill_date: string | null;
}

interface CashFlowData {
  date: string;
  balance: number;
  type: 'current' | 'normal' | 'crisis' | 'income';
  event?: string;
}

export default function Dashboard() {
  const { user, profile } = useUser();
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [ebtAccount, setEbtAccount] = useState<EBTAccount | null>(null);
  const [loading, setLoading] = useState(false); // Start false for faster initial render
  const [healthScore, setHealthScore] = useState(62);
  const [emergencyFund, setEmergencyFund] = useState(0);
  const [aiSavings, setAiSavings] = useState(0);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([]);
  const [nextCrisis, setNextCrisis] = useState({ days: 0, description: '' });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch all data in parallel for speed
      const [budgetResult, ebtResult] = await Promise.all([
        supabase
          .from('budget_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: true }),
        supabase
          .from('ebt_accounts')
          .select('*')
          .eq('user_id', user.id)
          .single()
      ]);

      const budgetData = budgetResult.data;
      const ebtData = ebtResult.data;

      if (budgetData) {
        setBudgetEntries(budgetData);
        calculateHealthMetrics(budgetData, ebtData);
        generateCashFlowPrediction(budgetData, ebtData);
      }
      if (ebtData) setEbtAccount(ebtData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthMetrics = (entries: BudgetEntry[], ebt: EBTAccount | null) => {
    // Calculate total income and expenses
    const totalIncome = entries
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const totalExpenses = entries
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    // Current balance from budget entries
    const currentBalance = totalIncome - totalExpenses;

    // Emergency fund is amount in "emergency fund" or "savings" category
    const emergencyAmount = entries
      .filter(e => e.category.toLowerCase().includes('emergency') || e.category.toLowerCase().includes('savings'))
      .reduce((sum, e) => sum + (e.type === 'income' ? Number(e.amount) : -Number(e.amount)), 0);

    setEmergencyFund(Math.max(0, emergencyAmount));

    // Calculate health score (0-100)
    // Factors: budget balance (40%), EBT balance (30%), income/expense ratio (30%)
    let score = 0;

    // Budget balance score (0-40 points)
    if (currentBalance > 500) score += 40;
    else if (currentBalance > 200) score += 30;
    else if (currentBalance > 0) score += 20;
    else score += 0;

    // EBT balance score (0-30 points)
    if (ebt) {
      const ebtBalance = Number(ebt.current_balance);
      if (ebtBalance > 200) score += 30;
      else if (ebtBalance > 100) score += 20;
      else if (ebtBalance > 0) score += 10;
    }

    // Income/Expense ratio score (0-30 points)
    if (totalIncome > 0) {
      const ratio = (totalIncome - totalExpenses) / totalIncome;
      if (ratio > 0.3) score += 30;
      else if (ratio > 0.1) score += 20;
      else if (ratio > 0) score += 10;
    }

    setHealthScore(Math.round(score));

    // Calculate AI Savings (potential savings from budget optimization)
    const groceryExpenses = entries
      .filter(e => e.type === 'expense' && e.category.toLowerCase().includes('groceries'))
      .reduce((sum, e) => sum + Number(e.amount), 0);

    // Estimate 15% potential savings on groceries + other optimizations
    const potentialSavings = groceryExpenses * 0.15 + 50; // Base $50 from other optimizations
    setAiSavings(Math.round(potentialSavings));
  };

  const generateCashFlowPrediction = (entries: BudgetEntry[], ebt: EBTAccount | null) => {
    // Generate 30-day cash flow prediction
    const predictions: CashFlowData[] = [];

    // Calculate current balance
    const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + Number(e.amount), 0);
    let currentBalance = totalIncome - totalExpenses;

    // Average daily expenses (excluding rent)
    const dailyExpenses = entries
      .filter(e => e.type === 'expense' && !e.category.toLowerCase().includes('rent'))
      .reduce((sum, e) => sum + Number(e.amount), 0) / 30;

    // Find upcoming rent payment
    const rentExpense = entries.find(e => e.type === 'expense' && e.category.toLowerCase().includes('rent'));
    const rentAmount = rentExpense ? Number(rentExpense.amount) : 0;

    // Generate predictions for next 30 days
    const today = new Date();
    let crisisDetected = false;
    let crisisDays = 0;

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Check for rent payment (assuming around 12th of month)
      if (date.getDate() === 12 && rentAmount > 0 && currentBalance - rentAmount < 50) {
        currentBalance -= rentAmount;
        predictions.push({
          date: dateStr,
          balance: Math.round(currentBalance),
          type: 'crisis',
          event: `Rent Due -$${rentAmount}`
        });
        if (!crisisDetected) {
          crisisDetected = true;
          crisisDays = i;
          setNextCrisis({ days: i, description: `Rent - Short $${Math.abs(currentBalance).toFixed(0)}` });
        }
      }
      // Check for paycheck (bi-weekly, around 15th and 30th)
      else if ((date.getDate() === 15 || date.getDate() === 30) && i > 5) {
        const paycheckAmount = entries
          .filter(e => e.type === 'income' && e.category.toLowerCase().includes('paycheck'))
          .reduce((sum, e) => sum + Number(e.amount), 0) / 2 || 590;
        currentBalance += paycheckAmount;
        predictions.push({
          date: dateStr,
          balance: Math.round(currentBalance),
          type: 'income',
          event: `Paycheck +$${Math.round(paycheckAmount)}`
        });
      }
      // Check for SNAP refill (20th of month)
      else if (date.getDate() === 20 && ebt && i > 5) {
        const snapAmount = 277; // Typical SNAP amount
        currentBalance += snapAmount;
        predictions.push({
          date: dateStr,
          balance: Math.round(currentBalance),
          type: 'income',
          event: `SNAP Refill +$${snapAmount}`
        });
      }
      // Regular day with daily expenses
      else {
        currentBalance -= dailyExpenses;
        predictions.push({
          date: dateStr,
          balance: Math.round(currentBalance),
          type: i === 0 ? 'current' : 'normal'
        });
      }

      // Detect first crisis point
      if (!crisisDetected && currentBalance < 0) {
        crisisDetected = true;
        crisisDays = i;
        setNextCrisis({ days: i, description: 'Low Balance' });
      }
    }

    setCashFlowData(predictions);
  };

  const recommendations = [
    {
      id: '1',
      priority: 'urgent',
      title: 'Rent Crisis in 4 Days',
      description: 'You will be $94 short for rent on Nov 12',
      solutions: [
        { action: 'Pick up 2 DoorDash shifts', potential: '+$110', time: '6 hours' },
        { action: 'Sell unused items on OfferUp', potential: '+$100', time: '2 hours' },
        { action: 'Request paycheck advance', potential: '+$150', time: '30 min' },
      ],
      impact: 'Prevents eviction risk',
      category: 'crisis',
    },
    {
      id: '2',
      priority: 'high',
      title: 'Overpaying for Groceries',
      description: 'You could save $87/month by switching stores',
      solutions: [
        { action: 'Shop at Aldi instead of Safeway', potential: 'Saves $87/mo', time: '0 min' },
        { action: 'Buy generic brands', potential: 'Saves $43/mo', time: '0 min' },
        { action: 'Use SNAP at farmers market', potential: '+$40 bonus', time: '1 hour' },
      ],
      impact: 'Saves $1,044/year',
      category: 'expense',
    },
    {
      id: '3',
      priority: 'high',
      title: 'Missing EITC Tax Credit',
      description: 'You may qualify for $2,847 in tax credits',
      solutions: [
        { action: 'File for EITC', potential: '+$2,847', time: '45 min' },
        { action: 'Check WIC eligibility', potential: '+$50/mo', time: '30 min' },
        { action: 'Apply for LIHEAP', potential: '+$300', time: '20 min' },
      ],
      impact: 'Extra $3,411/year',
      category: 'benefit',
    },
    {
      id: '4',
      priority: 'medium',
      title: 'Government Shutdown Risk',
      description: '35% chance of shutdown affecting SNAP by Nov 17',
      solutions: [
        { action: 'Stock up on essentials now', potential: 'Protects $277', time: '2 hours' },
        { action: 'Locate 5 nearby food banks', potential: 'Backup plan', time: '15 min' },
        { action: 'Build $200 emergency fund', potential: 'Peace of mind', time: 'Ongoing' },
      ],
      impact: 'Crisis prevention',
      category: 'crisis',
    },
  ];

  const quickActions = [
    { icon: MessageSquare, label: 'Ask ZENO AI', path: '/zeno', gradient: 'from-blue-500 to-cyan-600' },
    { icon: ScanLine, label: 'Scan Receipt', path: '/scan', gradient: 'from-blue-500 to-cyan-600' },
    { icon: MapPin, label: 'Find Resources', path: '/resources', gradient: 'from-blue-500 to-cyan-600' },
    { icon: Briefcase, label: 'Earn Money', path: '/jobs', gradient: 'from-blue-500 to-cyan-600' },
    { icon: TrendingUp, label: 'Smart Budget', path: '/budget', gradient: 'from-blue-500 to-cyan-600' },
    { icon: Users, label: 'Community', path: '/community', gradient: 'from-blue-500 to-cyan-600' },
  ];

  const userName = profile?.fullName?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-lg font-semibold mb-0.5">Welcome back, {userName}</h1>
            <p className="text-gray-600 text-sm">{today}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Financial Health Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Health Score</span>
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">{healthScore}</p>
          <p className="text-gray-600 text-xs">Out of 100</p>
        </div>

        <div className="bg-rose-300/30 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Next Crisis</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">
            {nextCrisis.days > 0 ? `${nextCrisis.days} Days` : 'None'}
          </p>
          <p className="text-gray-600 text-xs">{nextCrisis.description || 'All clear'}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Emergency Fund</span>
            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">${emergencyFund.toFixed(0)}</p>
          <p className="text-gray-600 text-xs">Goal: $500</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">AI Savings</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">${aiSavings}</p>
          <p className="text-gray-600 text-xs">Found/month</p>
        </div>
      </div>

      {/* 30-Day Cash Flow Prediction */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 text-base font-semibold">30-Day Cash Flow</h2>
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl p-3 border border-white/60">
                        <p className="text-gray-900">{data.date}</p>
                        <p className="text-blue-600">${data.balance}</p>
                        {data.event && (
                          <p className="text-gray-600 text-sm">{data.event}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="url(#colorGradient)" 
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload, index } = props;
                  if (payload.type === 'crisis') {
                    return <circle key={`dot-crisis-${index}`} cx={cx} cy={cy} r={5} fill="#ef4444" />;
                  }
                  if (payload.type === 'income') {
                    return <circle key={`dot-income-${index}`} cx={cx} cy={cy} r={5} fill="#22c55e" />;
                  }
                  return <circle key={`dot-normal-${index}`} cx={cx} cy={cy} r={3} fill="#3b82f6" />;
                }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <span className="text-gray-600">Crisis</span>
          </div>
        </div>
      </div>

      {/* Active Economic Threats */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 text-base font-semibold">Active Threats</h2>
          <ShieldAlert className="w-4 h-4 text-gray-400" />
        </div>

        <div className="space-y-2">
          <div className="bg-rose-300/30 backdrop-blur-lg rounded-xl p-3 border border-white/40">
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="text-gray-900 text-sm font-medium">Rent Payment Crisis</p>
                <p className="text-gray-600 text-xs">Short $94 for Nov 12</p>
              </div>
              <span className="text-rose-600 text-sm font-semibold">94%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">4 days remaining</span>
              <Link to="/zeno" className="text-blue-600 hover:text-blue-700 font-medium">
                Get Plan →
              </Link>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/40">
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="text-gray-900 text-sm font-medium">Government Shutdown</p>
                <p className="text-gray-600 text-xs">SNAP benefits at risk</p>
              </div>
              <span className="text-gray-700 text-sm font-semibold">35%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">9 days until deadline</span>
              <Link to="/shutdown" className="text-blue-600 hover:text-blue-700 font-medium">
                Prepare →
              </Link>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/40">
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="text-gray-900 text-sm font-medium">Inflation Impact</p>
                <p className="text-gray-600 text-xs">Groceries up 8.2%</p>
              </div>
              <span className="text-gray-700 text-sm font-semibold">High</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">+$43/month cost</span>
              <Link to="/scan" className="text-blue-600 hover:text-blue-700 font-medium">
                Save More →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 text-base font-semibold">AI Recommendations</h2>
          <Sparkles className="w-4 h-4 text-blue-500" />
        </div>

        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`backdrop-blur-lg rounded-xl p-3 border ${
                rec.priority === 'urgent'
                  ? 'bg-rose-300/30 border-white/40'
                  : 'bg-white/40 border-white/40'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        rec.priority === 'urgent'
                          ? 'bg-rose-500 text-white'
                          : rec.priority === 'high'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm font-medium">{rec.title}</p>
                  <p className="text-gray-600 text-xs">{rec.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>

              <div className="space-y-1.5 mt-2">
                {rec.solutions.slice(0, 2).map((solution, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700">{solution.action}</span>
                    <span className="text-blue-600 font-medium">{solution.potential}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-white/40 flex items-center justify-between text-xs">
                <span className="text-gray-600">Impact: {rec.impact}</span>
                <Link
                  to={rec.category === 'crisis' ? '/zeno' : rec.category === 'expense' ? '/scan' : '/ebt'}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <h2 className="text-gray-900 text-base font-semibold mb-3">Quick Actions</h2>

        <div className="grid grid-cols-3 gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="flex flex-col items-center gap-2 p-2.5 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40 hover:bg-white/60 transition-all"
              >
                <div className={`w-9 h-9 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-gray-700 text-[10px] text-center leading-tight">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Benefits Status */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 text-base font-semibold">Benefits Status</h2>
          <CreditCard className="w-4 h-4 text-gray-400" />
        </div>

        <div className="space-y-2">
          {ebtAccount ? (
            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-900 text-sm font-medium">SNAP/EBT Balance</span>
                <span className="text-gray-900 text-sm font-semibold">
                  ${Number(ebtAccount.current_balance).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {ebtAccount.refill_date
                    ? `Refills ${new Date(ebtAccount.refill_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    : 'No refill date set'}
                </span>
                <Link to="/ebt" className="text-blue-600 hover:text-blue-700 font-medium">
                  View Details →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-3 border border-blue-200/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-900 text-sm font-medium">SNAP/EBT Card</span>
                <span className="text-blue-600 text-sm font-semibold">Not Linked</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Connect your EBT card to track benefits</span>
                <Link to="/ebt" className="text-blue-600 hover:text-blue-700 font-medium">
                  Link Card →
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-900 text-sm font-medium">Shutdown Risk</span>
              <span className="text-gray-700 text-sm font-semibold">35%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Monitoring Congress</span>
              <Link to="/shutdown" className="text-blue-600 hover:text-blue-700 font-medium">
                Track →
              </Link>
            </div>
          </div>

          <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-3 border border-blue-200/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-900 text-sm font-medium">Missing Benefits</span>
              <span className="text-blue-600 text-sm font-semibold">+$3,411/year</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">You may qualify for EITC, WIC</span>
              <Link to="/ebt" className="text-blue-600 hover:text-blue-700 font-medium">
                Check →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Resources */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 text-base font-semibold">Emergency Resources</h2>
          <MapPin className="w-4 h-4 text-gray-400" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40">
            <div>
              <p className="text-gray-900 text-sm font-medium">Food Banks Nearby</p>
              <p className="text-gray-600 text-xs">Within 2 miles</p>
            </div>
            <div className="text-right">
              <p className="text-gray-900 text-xl font-semibold">5</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40">
            <div>
              <p className="text-gray-900 text-sm font-medium">Community Aid Centers</p>
              <p className="text-gray-600 text-xs">Free resources</p>
            </div>
            <div className="text-right">
              <p className="text-gray-900 text-xl font-semibold">3</p>
            </div>
          </div>
        </div>

        <Link
          to="/resources"
          className="mt-3 block text-center p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg"
        >
          View All Resources
        </Link>
      </div>
    </div>
  );
}
