import { useNavigate } from 'react-router-dom'
import { mockEBTBalance, calculateDailyBudget } from '../lib/mockData'

export default function Budget() {
  const navigate = useNavigate()
  const balance = mockEBTBalance.balance
  const daysLeft = mockEBTBalance.daysUntilRefill
  const dailyBudget = calculateDailyBudget(balance, daysLeft)

  const mealPlan = [
    {
      day: 'Monday',
      meals: [
        { name: 'Breakfast', items: 'Oatmeal with banana', cost: 0.75 },
        { name: 'Lunch', items: 'PB&J sandwich, apple', cost: 1.25 },
        { name: 'Dinner', items: 'Chicken & rice with veggies', cost: 3.00 }
      ]
    },
    {
      day: 'Tuesday',
      meals: [
        { name: 'Breakfast', items: 'Eggs and toast', cost: 1.00 },
        { name: 'Lunch', items: 'Leftover chicken & rice', cost: 0.50 },
        { name: 'Dinner', items: 'Spaghetti with sauce', cost: 2.50 }
      ]
    },
    {
      day: 'Wednesday',
      meals: [
        { name: 'Breakfast', items: 'Cereal with milk', cost: 0.80 },
        { name: 'Lunch', items: 'Bean and cheese burrito', cost: 1.50 },
        { name: 'Dinner', items: 'Baked chicken, potatoes', cost: 3.20 }
      ]
    }
  ]

  const savingTips = [
    { icon: '🏪', title: 'Shop Store Brands', description: 'Save 30-40% choosing store brands' },
    { icon: '🛒', title: 'Buy in Bulk', description: 'Rice, beans, pasta cost less in bulk' },
    { icon: '📅', title: 'Plan Your Meals', description: 'Planning prevents waste' },
    { icon: '❄️', title: 'Use Your Freezer', description: 'Buy meat on sale, freeze it' },
    { icon: '🥫', title: 'Stock Up on Sales', description: 'Buy non-perishables on sale' },
    { icon: '💰', title: 'Check Unit Prices', description: 'Compare per-ounce costs' }
  ]

  const cheapStores = [
    { name: 'Dollar General', distance: '0.8 mi', savings: 'Best for: Canned goods, snacks', emoji: '🏪' },
    { name: 'Aldi', distance: '1.2 mi', savings: 'Best for: Fresh produce, dairy', emoji: '🛒' },
    { name: 'Walmart', distance: '1.5 mi', savings: 'Best for: Bulk items, meat', emoji: '🏬' }
  ]

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
              Smart Budget
            </h1>
            <p className="text-sm text-gray-600">Make your benefits last</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 space-y-6">
        {/* Budget Summary - Large Beautiful Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl border border-white/20">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm mr-4">
              📊
            </div>
            <div>
              <p className="text-sm opacity-90 font-medium">Your Daily Budget</p>
              <p className="text-xs opacity-75">To make benefits last</p>
            </div>
          </div>

          <p className="text-6xl font-bold mb-6">${dailyBudget.toFixed(2)}</p>

          <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">Current Balance</span>
              <span className="text-xl font-bold">${balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Days Until Refill</span>
              <span className="text-xl font-bold">{daysLeft} days</span>
            </div>
          </div>
        </div>

        {/* Sample Meal Plan */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <span className="text-2xl">📝</span>
            <span>Sample 3-Day Meal Plan</span>
          </h2>

          <div className="space-y-5">
            {mealPlan.map((day, dayIndex) => (
              <div key={dayIndex} className="backdrop-blur-xl bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{day.day}</h3>
                <div className="space-y-3">
                  {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{meal.name}</p>
                        <p className="text-sm text-gray-600">{meal.items}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">${meal.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Daily Total:</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${day.meals.reduce((sum, meal) => sum + meal.cost, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 backdrop-blur-xl bg-blue-50/80 border border-blue-200 rounded-2xl p-5">
            <p className="text-sm text-blue-900 font-medium flex items-start">
              <span className="mr-2 text-lg">💡</span>
              <span>This 3-day plan costs $15.50 total, averaging $5.17/day - right on budget!</span>
            </p>
          </div>
        </div>

        {/* Money-Saving Tips */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">💰 Money-Saving Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savingTips.map((tip, index) => (
              <div key={index} className="group flex items-start p-5 backdrop-blur-xl bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform duration-300">{tip.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 mb-1">{tip.title}</p>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cheapest Stores Nearby */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🏪 Cheapest Stores Nearby</h2>
          <div className="space-y-3">
            {cheapStores.map((store, index) => (
              <div key={index} className="group backdrop-blur-xl bg-gradient-to-br from-white/80 to-gray-50/50 border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{store.emoji}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                      <span className="text-sm text-gray-600">{store.distance}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700">{store.savings}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Talk to ZENO CTA */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl border border-white/20">
          <h3 className="text-2xl font-bold mb-3">Need Personalized Help?</h3>
          <p className="text-sm opacity-95 mb-6 leading-relaxed">
            ZENO can create a custom meal plan based on your family size, dietary needs, and preferences.
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="backdrop-blur-xl bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
          >
            Ask ZENO →
          </button>
        </div>
      </div>
    </div>
  )
}
