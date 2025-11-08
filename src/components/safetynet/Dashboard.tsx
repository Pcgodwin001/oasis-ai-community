import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Bot, AlertTriangle, Receipt, Briefcase,
  TrendingUp, TrendingDown, Calendar, Users, DollarSign,
  Activity, Shield, Bell, Radio, ArrowUpRight, ArrowDownRight,
  Clock, Zap, Target, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import bannerIllustration from 'figma:asset/a7b2e2edb1d084f4474a1d86bf9a5d4ebaf755e4.png';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart
} from 'recharts';
import { cashflowService } from '../../services/cashflowService';
import { authService } from '../../services/authService';
import { ebtService } from '../../services/ebtService';
import { useUser } from '../../contexts/UserContext';

// Default fallback data
const defaultCashFlow = [
  { date: 'Nov 8', balance: 156, type: 'actual' },
  { date: 'Nov 9', balance: 140, type: 'predicted' },
  { date: 'Nov 12', balance: -94, type: 'predicted', crisis: true },
  { date: 'Nov 15', balance: 1106, type: 'predicted' },
];

// Financial health metrics
const financialMetrics = [
  { 
    label: 'Financial Health', 
    value: '62', 
    unit: '/100',
    change: 5, 
    status: 'Improving',
    icon: Activity,
    color: 'text-gray-900',
    bgColor: 'bg-white/20',
    borderColor: 'border-white/40'
  },
  { 
    label: 'Days Until Crisis', 
    value: '4', 
    unit: 'days',
    change: null, 
    status: 'Nov 12 - Rent Due', 
    icon: AlertTriangle,
    color: 'text-gray-900',
    bgColor: 'bg-white/20',
    borderColor: 'border-white/40'
  },
  { 
    label: 'Emergency Fund', 
    value: '$87', 
    unit: '',
    change: 12, 
    status: '3 days coverage', 
    icon: Shield,
    color: 'text-gray-900',
    bgColor: 'bg-white/20',
    borderColor: 'border-white/40'
  },
  { 
    label: 'Monthly Savings', 
    value: '$127', 
    unit: '',
    change: 8, 
    status: 'AI found this month', 
    icon: TrendingUp,
    color: 'text-gray-900',
    bgColor: 'bg-white/20',
    borderColor: 'border-white/40'
  },
];

// Active economic threats
const activeThreats = [
  { 
    id: 1, 
    title: 'Government Shutdown Risk', 
    severity: 'high',
    impact: 'SNAP may be delayed 2-4 weeks',
    probability: '35%',
    deadline: 'Nov 17, 2025',
    status: 'Backup plan ready',
    icon: AlertTriangle
  },
  { 
    id: 2, 
    title: 'Rent Due - Insufficient Funds', 
    severity: 'critical',
    impact: 'Short $94 on Nov 12',
    probability: '100%',
    deadline: 'Nov 12, 2025',
    status: 'AI has 3 solutions',
    icon: AlertTriangle
  },
  { 
    id: 3, 
    title: 'Grocery Inflation +8.2%', 
    severity: 'medium',
    impact: '+$28/month on food costs',
    probability: 'Ongoing',
    deadline: 'Continuous',
    status: 'Budget adjusted',
    icon: TrendingUp
  },
];

// AI Recommendations
const aiRecommendations = [
  {
    id: 1,
    priority: 'urgent',
    title: 'Avoid Overdraft on Nov 12',
    description: 'You\'ll be $94 short for rent. Here are your options:',
    solutions: [
      { action: 'Work 1 DoorDash shift tonight', potential: '$35-45', time: '2-3 hours' },
      { action: 'Sell unused items on Facebook', potential: '$50-80', time: '2-3 days' },
      { action: 'Ask for shift advance at work', potential: '$100', time: '1 day' },
    ],
    impact: 'Prevents $35 overdraft fee + stress'
  },
  {
    id: 2,
    priority: 'high',
    title: 'Switch Grocery Stores',
    description: 'Based on receipt analysis, you can save $87/month:',
    solutions: [
      { action: 'Buy milk, eggs, bread at Aldi', potential: '$32/month', time: 'Ongoing' },
      { action: 'Use store brand for 8 items', potential: '$28/month', time: 'Ongoing' },
      { action: 'Shop Tuesday for markdowns', potential: '$27/month', time: 'Weekly' },
    ],
    impact: 'Saves $1,044/year on groceries'
  },
  {
    id: 3,
    priority: 'medium',
    title: 'Claim Missing Benefits',
    description: 'You\'re eligible for benefits you\'re not receiving:',
    solutions: [
      { action: 'Apply for EITC tax credit', potential: '$2,847', time: '30 min application' },
      { action: 'Enroll in WIC', potential: '$47/month', time: '1 hour appointment' },
      { action: 'Apply for LIHEAP (heating)', potential: '$400/winter', time: '20 min application' },
    ],
    impact: 'Additional $3,411/year in benefits'
  },
];

// Quick actions
const quickActions = [
  { icon: Bot, label: 'Ask NOVA AI', path: '/nova', color: 'from-blue-500/10 to-cyan-500/10', borderColor: 'border-blue-400/30' },
  { icon: Receipt, label: 'Scan Receipt', path: '/receipts', color: 'from-white/10 to-white/20', borderColor: 'border-white/30' },
  { icon: MapPin, label: 'Find Resources', path: '/resources', color: 'from-white/10 to-white/20', borderColor: 'border-white/30' },
  { icon: Briefcase, label: 'Earn Money', path: '/jobs', color: 'from-white/10 to-white/20', borderColor: 'border-white/30' },
  { icon: DollarSign, label: 'Smart Budget', path: '/budget', color: 'from-white/10 to-white/20', borderColor: 'border-white/30' },
  { icon: Users, label: 'Community', path: '/community', color: 'from-white/10 to-white/20', borderColor: 'border-white/30' },
];

export default function Dashboard() {
  const { user, profile } = useUser();
  const [cashFlowData, setCashFlowData] = useState(defaultCashFlow);
  const [financialHealth, setFinancialHealth] = useState({ score: 62, daysUntilCrisis: 4, recommendations: [] });
  const [ebtBalance, setEbtBalance] = useState<number | null>(null);
  const [currentBalance, setCurrentBalance] = useState(156);
  const [isLoading, setIsLoading] = useState(true);

  const financialHealthScore = financialHealth.score;
  const daysUntilCrisis = financialHealth.daysUntilCrisis || 4;

  // Get user's first name
  const firstName = profile?.fullName?.split(' ')[0] || 'there';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Load cash flow predictions
        const predictions = await cashflowService.predictCashFlow(user.id, 30);
        if (predictions.length > 0) {
          const formattedData = predictions.map((p, i) => ({
            date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            balance: Math.round(p.predictedBalance),
            type: i === 0 ? 'actual' : 'predicted',
            crisis: p.predictedBalance <= 0
          }));
          setCashFlowData(formattedData);
          // Set current balance from first prediction
          if (formattedData[0]) {
            setCurrentBalance(formattedData[0].balance);
          }
        }

        // Load financial health
        const health = await cashflowService.calculateFinancialHealth(user.id);
        setFinancialHealth(health);

        // Load EBT balance
        const ebt = await ebtService.getEBTAccount(user.id);
        if (ebt) {
          setEbtBalance(ebt.currentBalance);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Banner with Financial Health Status */}
      <div className="backdrop-blur-xl bg-white border border-blue-400/20 rounded-3xl p-6 lg:p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-gray-900 mb-2">Welcome back, {firstName}!</h1>
            <p className="text-gray-600 mb-4">
              AI Financial Coach monitoring your situation 24/7
            </p>
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                Loading your financial data...
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <div className="backdrop-blur-lg bg-gradient-to-br from-white/40 to-white/20 border border-white/40 rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-sm text-gray-600">Financial Health</p>
                  <p className="text-lg font-semibold text-gray-900">{financialHealthScore}/100</p>
                </div>
                {daysUntilCrisis && daysUntilCrisis > 0 && (
                  <div className="backdrop-blur-lg bg-gradient-to-br from-white/40 to-white/20 border border-white/40 rounded-xl px-4 py-2 shadow-lg">
                    <p className="text-sm text-gray-600">Next Crisis</p>
                    <p className="text-lg font-semibold text-gray-900">{daysUntilCrisis} days</p>
                  </div>
                )}
                <div className="backdrop-blur-lg bg-gradient-to-br from-white/40 to-white/20 border border-white/40 rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-lg font-semibold text-gray-900">${currentBalance}</p>
                </div>
                {ebtBalance !== null && (
                  <div className="backdrop-blur-lg bg-gradient-to-br from-white/40 to-white/20 border border-white/40 rounded-xl px-4 py-2 shadow-lg">
                    <p className="text-sm text-gray-600">EBT Balance</p>
                    <p className="text-lg font-semibold text-gray-900">${ebtBalance}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Illustration */}
          <div className="hidden lg:block flex-shrink-0">
            <img
              src={bannerIllustration}
              alt="Community support illustration"
              className="w-64 h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Financial Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className={`backdrop-blur-lg bg-white/40 border ${metric.borderColor} shadow-xl`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-600 mb-1">{metric.label}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <p className={`${metric.color}`}>{metric.value}</p>
                      <span className="text-gray-500">{metric.unit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {metric.change !== null && (
                        metric.change > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-gray-600" />
                        )
                      )}
                      <span className="text-gray-600">{metric.status}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.bgColor} border ${metric.borderColor}`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Predictive Cash Flow */}
        <div className="lg:col-span-8 space-y-6">
          {/* 30-Day Cash Flow Prediction */}
          <Card className="backdrop-blur-lg bg-white/40 border border-blue-400/30 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-700" />
                    30-Day Cash Flow Prediction
                  </CardTitle>
                  <CardDescription>AI predicts when you'll run out of money</CardDescription>
                </div>
                <Badge className="backdrop-blur-md bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 text-gray-900">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`$${value}`, 'Balance']}
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          if (payload.crisis) {
                            return (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={6}
                                fill="#f43f5e"
                                stroke="#fff"
                                strokeWidth={2}
                              />
                            );
                          }
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={4}
                              fill="#3b82f6"
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          );
                        }}
                      />
                      {/* Zero line */}
                      <Line
                        type="monotone"
                        dataKey={() => 0}
                        stroke="#9ca3af"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Events */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="backdrop-blur-md bg-white/30 border border-rose-300/30 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-gray-700 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">Crisis Alert</p>
                        <p className="text-gray-700">Nov 12: Rent due, short $94</p>
                        <p className="text-gray-600">AI Solution: Work 1 extra shift</p>
                      </div>
                    </div>
                  </div>
                  <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-700 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">Income Events</p>
                        <p className="text-gray-700">Nov 10: SNAP +$425</p>
                        <p className="text-gray-700">Nov 15, 29: Paycheck +$1,200</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link to="/budget">
                  <Button className="w-full backdrop-blur-lg bg-gradient-to-r from-blue-500/80 to-cyan-500/80 hover:from-blue-600/90 hover:to-cyan-600/90 border border-blue-400/40 text-white shadow-lg transition-all duration-300">
                    View Detailed Budget Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="backdrop-blur-lg bg-white/40 border border-white/60 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-gray-700" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>Personalized actions to improve your finances</CardDescription>
                </div>
                <Badge className="backdrop-blur-md bg-white/40 text-gray-900 border border-white/40">
                  3 Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((rec) => (
                  <div key={rec.id} className={`backdrop-blur-md bg-white/30 border ${
                    rec.priority === 'urgent' ? 'border-rose-300/30' : 'border-white/40'
                  } rounded-xl p-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className={`backdrop-blur-sm bg-white/40 text-gray-900 border border-white/50`}>
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="text-gray-900 mb-1">{rec.title}</h3>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        
                        <div className="space-y-2">
                          {rec.solutions.map((solution, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-white/40 rounded-lg p-2">
                              <CheckCircle2 className="w-4 h-4 text-gray-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-gray-900">{solution.action}</p>
                                <div className="flex items-center gap-3 text-gray-600">
                                  <span>💰 {solution.potential}</span>
                                  <span>⏱️ {solution.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-gray-700">
                            <span>Impact:</span> {rec.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/nova">
                <Button variant="outline" className="w-full mt-4">
                  Get More AI Recommendations
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="backdrop-blur-lg bg-white/40 border border-white/60 shadow-xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access essential tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} to={action.path}>
                      <div className={`backdrop-blur-md bg-gradient-to-br ${action.color} border ${action.borderColor} rounded-2xl p-4 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer h-full`}>
                        <Icon className="w-6 h-6 mb-2 text-gray-700" />
                        <p className="text-gray-900">{action.label}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Threats & Assistance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Economic Threats */}
          <Card className="backdrop-blur-lg bg-white/40 border border-white/60 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-700" />
                    Active Threats
                  </CardTitle>
                  <CardDescription>AI monitoring risks to your finances</CardDescription>
                </div>
                <Badge className="backdrop-blur-md bg-white/40 text-gray-900 border border-white/40">
                  {activeThreats.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeThreats.map((threat) => {
                  const Icon = threat.icon;
                  return (
                    <div key={threat.id} className={`backdrop-blur-md bg-white/30 border ${
                      threat.severity === 'critical' ? 'border-rose-300/30' : 'border-white/40'
                    } rounded-xl p-3`}>
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className={`w-5 h-5 mt-0.5 text-gray-700`} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-gray-900">{threat.title}</p>
                            <Badge variant="secondary" className={`backdrop-blur-sm bg-white/40 text-gray-900 border border-white/50 ml-2`}>
                              {threat.probability}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{threat.impact}</p>
                          <div className="flex items-center justify-between text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{threat.deadline}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <p className="text-gray-700 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {threat.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link to="/shutdown">
                <Button variant="outline" className="w-full mt-3">
                  View All Threats & Preparations
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* NOVA AI Quick Access */}
          <Card className="backdrop-blur-lg bg-white/40 border border-blue-400/30 shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 backdrop-blur-md bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/40 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <CardTitle>NOVA AI Coach</CardTitle>
                  <CardDescription>24/7 financial guidance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600">
                Your personal AI financial coach. Ask anything about money, benefits, or crisis planning.
              </p>
              <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl p-3 space-y-2">
                <p className="text-gray-700">"How can I avoid overdraft on Nov 12?"</p>
                <p className="text-gray-700">"Find cheaper grocery stores near me"</p>
                <p className="text-gray-700">"What benefits am I missing?"</p>
              </div>
              <Link to="/nova">
                <Button className="w-full backdrop-blur-lg bg-gradient-to-r from-blue-500/80 to-cyan-500/80 hover:from-blue-600/90 hover:to-cyan-600/90 border border-blue-400/40 text-white shadow-lg transition-all duration-300">
                  Chat with NOVA
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Benefits Status */}
          <Card className="backdrop-blur-lg bg-white/40 border border-white/60 shadow-xl">
            <CardHeader>
              <CardTitle>Benefits Status</CardTitle>
              <CardDescription>Your government assistance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700">SNAP/EBT</span>
                  <Badge className="backdrop-blur-sm bg-white/40 text-gray-900 border border-white/50">
                    Active
                  </Badge>
                </div>
                <p className="text-gray-900">Balance: $296.55</p>
                <p className="text-gray-600">Refill: Nov 10 (+$425)</p>
              </div>
              
              <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700">Shutdown Risk</span>
                  <Badge className="backdrop-blur-sm bg-white/40 text-gray-900 border border-white/50">
                    35%
                  </Badge>
                </div>
                <p className="text-gray-600">AI monitoring 24/7</p>
                <p className="text-gray-700">Backup plan ready ✓</p>
              </div>

              <Link to="/ebt-balance">
                <Button className="w-full backdrop-blur-lg bg-white/60 hover:bg-white/80 border border-white/60 text-gray-900 shadow-lg transition-all duration-300">
                  Manage Benefits
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Nearby Resources */}
          <Card className="backdrop-blur-lg bg-white/40 border border-white/60 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Emergency Resources</CardTitle>
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-3">
                <p className="text-gray-900 mb-1">12 resources</p>
                <p className="text-gray-600">Within 5 miles</p>
              </div>
              <div className="space-y-2">
                <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl p-2 flex items-center justify-between">
                  <span className="text-gray-700">Food Banks</span>
                  <span className="text-gray-900">5</span>
                </div>
                <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl p-2 flex items-center justify-between">
                  <span className="text-gray-700">Community Aid</span>
                  <span className="text-gray-900">7</span>
                </div>
              </div>
              <Link to="/resources">
                <Button variant="outline" className="w-full">
                  Find Help Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
