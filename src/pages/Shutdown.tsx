import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockShutdownRisk } from '../lib/mockData'

export default function Shutdown() {
  const navigate = useNavigate()
  const [checklist, setChecklist] = useState(mockShutdownRisk.preparationChecklist)

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const getRiskColor = (percentage: number) => {
    if (percentage < 30) return { gradient: 'from-green-400 to-emerald-500', text: 'text-green-700', label: 'LOW', bg: 'bg-green-50' }
    if (percentage < 70) return { gradient: 'from-yellow-400 to-orange-500', text: 'text-yellow-700', label: 'MEDIUM', bg: 'bg-yellow-50' }
    return { gradient: 'from-red-400 to-pink-500', text: 'text-red-700', label: 'HIGH', bg: 'bg-red-50' }
  }

  const risk = getRiskColor(mockShutdownRisk.percentage)
  const completedTasks = checklist.filter(item => item.completed).length

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
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shutdown Risk
            </h1>
            <p className="text-sm text-gray-600">AI-powered predictions</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 space-y-6">
        {/* Risk Meter - Beautiful Circular Design */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
              <span>⚠️</span>
              <span>Government Shutdown Risk</span>
            </h2>

            {/* Circular Progress with Gradient */}
            <div className="relative w-56 h-56 mx-auto my-8">
              <svg className="transform -rotate-90" width="224" height="224">
                <circle
                  cx="112"
                  cy="112"
                  r="96"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="96"
                  stroke="url(#gradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${(mockShutdownRisk.percentage / 100) * 603} 603`}
                  strokeLinecap="round"
                  className="drop-shadow-lg"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={risk.text} stopOpacity="1" />
                    <stop offset="100%" className={risk.text} stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-6xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {mockShutdownRisk.percentage}%
                </p>
                <p className={`text-lg font-bold ${risk.text} mt-2 px-4 py-1 backdrop-blur-xl ${risk.bg} rounded-full`}>
                  {risk.label} RISK
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Last updated: {new Date(mockShutdownRisk.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Risk Factors */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Current Factors:</h3>
            <div className="space-y-3">
              {mockShutdownRisk.factors.map((factor, index) => (
                <div key={index} className="flex items-start backdrop-blur-xl bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                  <span className="text-blue-600 font-bold mr-3 text-lg">•</span>
                  <span className="text-gray-800 font-medium">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className={`backdrop-blur-xl ${risk.bg}/80 border border-${risk.text.replace('text-', '')}-200 rounded-3xl p-6 shadow-xl`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <span>💡</span>
            <span>What This Means For You</span>
          </h3>
          <p className="text-gray-800 leading-relaxed">
            {mockShutdownRisk.percentage < 30 &&
              "Risk is low right now. Congress has plenty of time to pass funding, and there's bipartisan support. Your benefits are safe for now, but it's always good to have a backup plan."
            }
            {mockShutdownRisk.percentage >= 30 && mockShutdownRisk.percentage < 70 &&
              "There's moderate risk of a shutdown. Start preparing now by stocking non-perishables and knowing where food pantries are located. Your benefits may be delayed if a shutdown happens."
            }
            {mockShutdownRisk.percentage >= 70 &&
              "Risk is high. A shutdown is likely within the next few weeks. Take action now: stock up on essentials, apply for emergency assistance, and make a backup plan. SNAP benefits may be delayed or interrupted."
            }
          </p>
        </div>

        {/* Preparation Checklist */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-2xl border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <span>✓</span>
              <span>Preparation Checklist</span>
            </h2>
            <span className="px-4 py-2 backdrop-blur-xl bg-blue-50 rounded-full text-sm font-bold text-blue-700">
              {completedTasks}/{checklist.length}
            </span>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-full flex items-start p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                  item.completed
                    ? 'backdrop-blur-xl bg-green-50/80 border-green-300 hover:border-green-400'
                    : 'backdrop-blur-xl bg-white/80 border-gray-200 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-xl border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                  item.completed
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500'
                    : 'border-gray-300'
                }`}>
                  {item.completed && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`font-medium ${item.completed ? 'line-through text-gray-600' : 'text-gray-900'}`}>
                  {item.task}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${(completedTasks / checklist.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center space-x-2">
            <span>🆘</span>
            <span>Emergency Resources</span>
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/map')}
              className="group w-full backdrop-blur-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4 group-hover:scale-110 transition-transform duration-300">🗺️</span>
                <div>
                  <p className="font-bold text-gray-900">Find Food Pantries</p>
                  <p className="text-sm text-gray-600">5 locations nearby in Jackson</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/chat')}
              className="group w-full backdrop-blur-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4 group-hover:scale-110 transition-transform duration-300">💬</span>
                <div>
                  <p className="font-bold text-gray-900">Ask ZENO</p>
                  <p className="text-sm text-gray-600">Get personalized shutdown guidance</p>
                </div>
              </div>
            </button>

            <div className="backdrop-blur-xl bg-red-50/80 border border-red-200 rounded-2xl p-5">
              <div className="flex items-center">
                <span className="text-3xl mr-4">📞</span>
                <div>
                  <p className="font-bold text-gray-900">Emergency Hotline</p>
                  <a href="tel:211" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Dial 211 for assistance →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stay Informed */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl border border-white/20">
          <h3 className="text-2xl font-bold mb-3 flex items-center space-x-2">
            <span>🔔</span>
            <span>Stay Informed</span>
          </h3>
          <p className="text-sm opacity-95 mb-5 leading-relaxed">
            Oasis monitors Congress 24/7 using AI and will alert you if the shutdown risk increases. We'll make sure you're always prepared.
          </p>
          <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="font-bold text-lg">Alerts Enabled ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
