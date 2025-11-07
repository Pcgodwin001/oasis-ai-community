import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { mockEBTBalance, mockShutdownRisk } from '../lib/mockData'

export default function Home() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const quickStats = [
    {
      label: 'EBT Balance',
      value: `$${mockEBTBalance.balance.toFixed(2)}`,
      icon: '💳',
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      action: () => navigate('/balance')
    },
    {
      label: 'Days Until Refill',
      value: mockEBTBalance.daysUntilRefill.toString(),
      icon: '📅',
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      action: () => navigate('/balance')
    },
    {
      label: 'Nearest Food Bank',
      value: '0.6 mi',
      icon: '📍',
      gradient: 'from-green-400 via-green-500 to-green-600',
      action: () => navigate('/map')
    },
    {
      label: 'Shutdown Risk',
      value: `${mockShutdownRisk.percentage}%`,
      icon: '⚠️',
      gradient: 'from-amber-400 via-orange-500 to-orange-600',
      action: () => navigate('/shutdown')
    }
  ]

  const quickActions = [
    {
      title: 'Talk to ZENO',
      description: 'Get instant help and answers',
      icon: '🤖',
      gradient: 'from-blue-500 via-blue-600 to-purple-600',
      action: () => navigate('/chat')
    },
    {
      title: 'Check Balance',
      description: 'View transactions & insights',
      icon: '💰',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      action: () => navigate('/balance')
    },
    {
      title: 'Find Food',
      description: '5 pantries nearby',
      icon: '🍎',
      gradient: 'from-orange-500 via-red-500 to-pink-600',
      action: () => navigate('/map')
    },
    {
      title: 'Budget Helper',
      description: 'Meal plans & savings tips',
      icon: '📈',
      gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
      action: () => navigate('/budget')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with Glassmorphism */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">O</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Oasis
                </h1>
                <p className="text-xs text-gray-600">AI for Community Impact</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Card with Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              👋
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
              </h2>
              <p className="text-gray-600 flex items-center space-x-2">
                <span>📍</span>
                <span>Jackson, Tennessee</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid - Modern Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <button
              key={index}
              onClick={stat.action}
              className="group relative backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              <div className="relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions - Enhanced Gradient Cards */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <span>⚡</span>
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`group relative bg-gradient-to-br ${action.gradient} rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 text-left overflow-hidden`}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                  <h4 className="text-2xl font-bold mb-2">{action.title}</h4>
                  <p className="text-sm opacity-90 font-medium">{action.description}</p>
                  <div className="mt-4 inline-flex items-center space-x-2 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span>Get Started</span>
                    <span>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Banner - Pulsing Animation */}
        <div className="relative backdrop-blur-xl bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          {/* Pulsing Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 animate-pulse opacity-50"></div>

          <div className="relative z-10 flex items-start space-x-4">
            <div className="text-4xl animate-bounce">🆘</div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold mb-3">Need Immediate Help?</h4>
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                If you're running out of food or need emergency assistance, we're here to help you find resources right now.
              </p>
              <button
                onClick={() => navigate('/map')}
                className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Find Food Now →
              </button>
            </div>
          </div>
        </div>

        {/* About Oasis - Stats Cards */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <span>✨</span>
            <span>Why Choose Oasis?</span>
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            Oasis uses AI to help families in Jackson, TN navigate SNAP/EBT benefits, find food resources,
            and prepare for government disruptions. We're here to ensure no one goes hungry.
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 backdrop-blur-xl bg-blue-50/50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">5+</p>
              <p className="text-sm text-gray-700 font-medium">Food Pantries</p>
            </div>
            <div className="text-center p-6 backdrop-blur-xl bg-green-50/50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent mb-2">24/7</p>
              <p className="text-sm text-gray-700 font-medium">AI Support</p>
            </div>
            <div className="text-center p-6 backdrop-blur-xl bg-purple-50/50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-800 bg-clip-text text-transparent mb-2">100%</p>
              <p className="text-sm text-gray-700 font-medium">Free to Use</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
