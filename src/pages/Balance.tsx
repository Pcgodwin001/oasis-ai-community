import { useNavigate } from 'react-router-dom'
import { mockEBTBalance, calculateDailyBudget, calculateRunOutDate, getAvgDailySpending } from '../lib/mockData'

export default function Balance() {
  const navigate = useNavigate()
  const balanceData = mockEBTBalance

  const dailyBudget = calculateDailyBudget(balanceData.balance, balanceData.daysUntilRefill)
  const avgDailySpending = getAvgDailySpending(balanceData.transactions)
  const predictedRunOut = calculateRunOutDate(balanceData.balance, avgDailySpending)

  const isOverBudget = avgDailySpending > dailyBudget

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 backdrop-blur-xl bg-white/80 border-b border-white/20 px-4 py-4 shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-3 text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-white/50 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EBT Balance
          </h1>
        </div>
      </div>

      <div className="relative z-10 p-4 space-y-6">
        {/* Balance Card - Large & Beautiful */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                💳
              </div>
              <div>
                <p className="text-sm opacity-90 font-medium">SNAP EBT Balance</p>
                <p className="text-xs opacity-75">Available Funds</p>
              </div>
            </div>
          </div>

          <p className="text-6xl font-bold mb-6">${balanceData.balance.toFixed(2)}</p>

          <div className="flex justify-between items-center pt-4 border-t border-white/20">
            <div>
              <p className="text-sm opacity-90">Next Refill</p>
              <p className="text-2xl font-bold">{balanceData.daysUntilRefill} days</p>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="backdrop-blur-xl bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 shadow-lg"
            >
              Ask ZENO →
            </button>
          </div>
        </div>

        {/* Budget Insights */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <span>Budget Insights</span>
          </h2>

          <div className="space-y-5">
            {/* Daily Budget */}
            <div className="p-5 backdrop-blur-xl bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm text-gray-700 font-medium">Recommended Daily Budget</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${dailyBudget.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-600">Per day to make benefits last until refill</p>
            </div>

            {/* Spending vs Budget */}
            <div className={`p-5 backdrop-blur-xl ${isOverBudget ? 'bg-red-50/50 border-red-200' : 'bg-green-50/50 border-green-200'} rounded-2xl border`}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm text-gray-700 font-medium">Your Daily Spending</span>
                <span className={`text-3xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  ${avgDailySpending.toFixed(2)}
                </span>
              </div>
              {isOverBudget ? (
                <div className="mt-3 p-3 bg-red-100 rounded-xl">
                  <p className="text-sm text-red-800 font-semibold">
                    ⚠️ ${(avgDailySpending - dailyBudget).toFixed(2)} over daily budget
                  </p>
                </div>
              ) : (
                <p className="text-sm text-green-700 font-medium">✓ Within budget!</p>
              )}
            </div>

            {/* Predicted Run Out */}
            {isOverBudget && (
              <div className="p-5 backdrop-blur-xl bg-yellow-50/50 rounded-2xl border border-yellow-200">
                <p className="text-sm text-yellow-900">
                  <span className="font-bold">⏰ Warning:</span> At current rate, benefits may run out{' '}
                  <span className="font-bold">{predictedRunOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate('/budget')}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            Get Smart Budget Plan →
          </button>
        </div>

        {/* Last Deposit */}
        {balanceData.lastDeposit && (
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Last Deposit</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  +${balanceData.lastDeposit.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">{balanceData.lastDeposit.date}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                ✓
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center space-x-2">
            <span>📝</span>
            <span>Recent Transactions</span>
          </h2>

          <div className="space-y-3">
            {balanceData.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-4 backdrop-blur-xl bg-gray-50/50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{transaction.merchant}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'deposit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/map')}
            className="group backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🗺️</div>
            <p className="text-lg font-bold text-gray-900">Find Food</p>
            <p className="text-sm text-gray-600">Nearby pantries</p>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="group backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💬</div>
            <p className="text-lg font-bold text-gray-900">Ask ZENO</p>
            <p className="text-sm text-gray-600">Get help</p>
          </button>
        </div>

        {/* Last Updated */}
        <p className="text-center text-xs text-gray-500 py-2">
          Last updated: {new Date(balanceData.lastChecked).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
