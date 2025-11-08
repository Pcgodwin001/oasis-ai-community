import { ShieldAlert, Calendar, AlertTriangle, MapPin, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export default function ShutdownTracker() {
  const shutdownRisk = 35;
  const daysUntilDeadline = 9;
  const deadline = new Date('2025-11-17');
  const snapBalance = 296.55;
  const emergencyFund = 87;

  const impactedBenefits = [
    {
      id: '1',
      name: 'SNAP/EBT',
      risk: 'high',
      currentBalance: 296.55,
      nextRefill: new Date('2025-11-20'),
      impact: 'December refill may be delayed',
      protected: true,
    },
    {
      id: '2',
      name: 'WIC',
      risk: 'medium',
      impact: 'Services may be reduced',
      protected: false,
    },
    {
      id: '3',
      name: 'Section 8 Housing',
      risk: 'low',
      impact: 'Short-term funding secured',
      protected: true,
    },
  ];

  const backupPlan = [
    {
      id: '1',
      category: 'Food Security',
      actions: [
        { task: 'Stock up on essentials now', status: 'pending', priority: 'urgent' },
        { task: 'Locate 5 food banks nearby', status: 'completed', priority: 'high' },
        { task: 'Join mutual aid network', status: 'pending', priority: 'high' },
        { task: 'Download food bank hours offline', status: 'pending', priority: 'medium' },
      ],
    },
    {
      id: '2',
      category: 'Emergency Fund',
      actions: [
        { task: 'Save $200 emergency cash', status: 'in-progress', priority: 'urgent' },
        { task: 'Set aside rent money separately', status: 'pending', priority: 'urgent' },
        { task: 'Cancel non-essential subscriptions', status: 'pending', priority: 'high' },
      ],
    },
    {
      id: '3',
      category: 'Income Backup',
      actions: [
        { task: 'Sign up for DoorDash/Instacart', status: 'pending', priority: 'high' },
        { task: 'Identify quick cash opportunities', status: 'pending', priority: 'medium' },
        { task: 'Apply for emergency assistance', status: 'pending', priority: 'medium' },
      ],
    },
  ];

  const foodBanks = [
    {
      id: '1',
      name: "St. Mary's Food Pantry",
      distance: 0.8,
      hours: 'Mon, Wed, Fri 9am-12pm',
      requirements: 'No ID required',
      supplies: 'Fresh produce, canned goods',
    },
    {
      id: '2',
      name: 'Community Kitchen',
      distance: 1.2,
      hours: 'Tue-Sat 10am-3pm',
      requirements: 'Open to all',
      supplies: 'Hot meals + groceries',
    },
    {
      id: '3',
      name: 'Harvest Hope Food Bank',
      distance: 1.7,
      hours: 'Weekdays 1pm-5pm',
      requirements: 'Registration preferred',
      supplies: 'SNAP match program',
    },
  ];

  const totalBackupActions = backupPlan.reduce((sum, cat) => sum + cat.actions.length, 0);
  const completedActions = backupPlan.reduce(
    (sum, cat) => sum + cat.actions.filter((a) => a.status === 'completed').length,
    0
  );
  const preparednessPercent = (completedActions / totalBackupActions) * 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl">Shutdown Tracker</h1>
            <p className="text-gray-600">Monitor and prepare for disruptions</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Risk Level */}
      <div className={`backdrop-blur-lg rounded-3xl shadow-xl p-6 border ${
        shutdownRisk >= 50 
          ? 'bg-rose-300/30 border-white/60' 
          : 'bg-white/60 border-white/60'
      }`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-gray-600 mb-2">Shutdown Risk</p>
            <p className="text-6xl text-gray-900 mb-2">{shutdownRisk}%</p>
            <p className="text-gray-600">Based on congressional negotiations</p>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            shutdownRisk >= 50 ? 'bg-rose-500' : 'bg-yellow-500'
          }`}>
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Risk Level</span>
            <span className={shutdownRisk >= 50 ? 'text-rose-600' : 'text-yellow-600'}>
              {shutdownRisk >= 50 ? 'HIGH' : 'MODERATE'}
            </span>
          </div>
          <Progress value={shutdownRisk} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/40">
          <div>
            <p className="text-gray-600 text-sm">Deadline</p>
            <p className="text-gray-900 text-xl">{deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Days Remaining</p>
            <p className="text-gray-900 text-xl">{daysUntilDeadline}</p>
          </div>
        </div>
      </div>

      {/* Preparedness Score */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 text-xl">Preparedness Score</h2>
            <p className="text-gray-600">{completedActions} of {totalBackupActions} actions complete</p>
          </div>
          <div className="text-right">
            <p className="text-gray-900 text-3xl">{Math.round(preparednessPercent)}%</p>
          </div>
        </div>

        <Progress value={preparednessPercent} className="h-3 mb-4" />

        {preparednessPercent < 50 && (
          <div className="bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-4 border border-yellow-200/40">
            <p className="text-gray-900">Complete more backup actions to improve your preparedness</p>
          </div>
        )}
      </div>

      {/* Impacted Benefits */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h2 className="text-gray-900 text-xl mb-4">Your Benefits at Risk</h2>
        
        <div className="space-y-3">
          {impactedBenefits.map((benefit) => (
            <div
              key={benefit.id}
              className={`backdrop-blur-lg rounded-2xl p-4 border ${
                benefit.risk === 'high'
                  ? 'bg-rose-300/30 border-white/40'
                  : benefit.risk === 'medium'
                  ? 'bg-yellow-300/30 border-white/40'
                  : 'bg-white/40 border-white/40'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-900">{benefit.name}</p>
                    {benefit.protected && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{benefit.impact}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-lg ${
                    benefit.risk === 'high'
                      ? 'bg-rose-500 text-white'
                      : benefit.risk === 'medium'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {benefit.risk.toUpperCase()} RISK
                </span>
              </div>

              {benefit.currentBalance && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/40 text-sm">
                  <span className="text-gray-600">Current Balance</span>
                  <span className="text-gray-900">${benefit.currentBalance.toFixed(2)}</span>
                </div>
              )}

              {benefit.nextRefill && (
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-600">Next Refill</span>
                  <span className="text-gray-900">{benefit.nextRefill.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Backup Plan */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h2 className="text-gray-900 text-xl mb-4">Your Backup Plan</h2>
        
        <div className="space-y-4">
          {backupPlan.map((category) => (
            <div key={category.id} className="space-y-2">
              <h3 className="text-gray-900">{category.category}</h3>
              
              {category.actions.map((action, idx) => (
                <div
                  key={idx}
                  className="bg-white/40 backdrop-blur-lg rounded-2xl p-4 border border-white/40 flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    {action.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : action.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-gray-900 ${action.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                      {action.task}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${
                      action.priority === 'urgent'
                        ? 'bg-rose-500 text-white'
                        : action.priority === 'high'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {action.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Resources */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 text-xl">Nearby Food Banks</h2>
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {foodBanks.map((bank) => (
            <div
              key={bank.id}
              className="bg-white/40 backdrop-blur-lg rounded-2xl p-4 border border-white/40"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-gray-900">{bank.name}</p>
                  <p className="text-gray-600 text-sm">{bank.distance} miles away</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/60 border-white/60 hover:bg-white/80"
                >
                  Directions
                </Button>
              </div>

              <div className="space-y-1 mt-3 pt-3 border-t border-white/40 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{bank.hours}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{bank.requirements}</span>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{bank.supplies}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Fund Goal */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 text-white">
        <h3 className="text-2xl mb-2">Build Emergency Fund</h3>
        <p className="text-white/80 mb-6">
          Target: $200 in cash by Nov 17 to cover essentials if benefits are delayed
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span>Current Savings</span>
            <span className="text-2xl">${emergencyFund}</span>
          </div>
          <Progress value={(emergencyFund / 200) * 100} className="h-3 bg-white/20" />
          <div className="flex items-center justify-between">
            <span>Still Needed</span>
            <span className="text-2xl">${200 - emergencyFund}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white/90">Quick ways to raise $113:</p>
          <div className="space-y-1 text-sm text-white/80">
            <p>• 2 DoorDash shifts = $110</p>
            <p>• Plasma donation = $100</p>
            <p>• Sell unused items = $50-100</p>
          </div>
        </div>
      </div>

      {/* Stay Informed */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h3 className="text-gray-900 mb-4">Stay Informed</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">Real-time Updates</p>
              <p className="text-gray-600 text-sm">ZENO AI monitors Congress daily for shutdown news</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">Instant Alerts</p>
              <p className="text-gray-600 text-sm">Get notified if risk increases above 50%</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">Community Support</p>
              <p className="text-gray-600 text-sm">47 local members ready to help in mutual aid network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
