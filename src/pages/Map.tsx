import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jacksonFoodPantries } from '../lib/mockData'
import type { FoodPantry } from '../lib/mockData'

export default function Map() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'open' | 'walk-in'>('all')
  const [selectedPantry, setSelectedPantry] = useState<FoodPantry | null>(null)

  const filteredPantries = jacksonFoodPantries.filter(pantry => {
    if (filter === 'open') return pantry.openNow
    if (filter === 'walk-in') {
      return pantry.requirements.some(req =>
        req.toLowerCase().includes('no appointment') ||
        req.toLowerCase().includes('walk-in')
      )
    }
    return true
  })

  const getInventoryColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'from-green-400 to-emerald-500'
      case 'medium': return 'from-yellow-400 to-orange-500'
      case 'low': return 'from-red-400 to-pink-500'
    }
  }

  const getInventoryDots = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return '●●●'
      case 'medium': return '●●○'
      case 'low': return '●○○'
    }
  }

  const getDirections = (pantry: FoodPantry) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pantry.latitude},${pantry.longitude}`
    window.open(url, '_blank')
  }

  const callPantry = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header with Glassmorphism - Sticky */}
      <div className="relative z-20 backdrop-blur-xl bg-white/80 border-b border-white/20 px-4 py-4 shadow-lg sticky top-0">
        <div className="flex items-center mb-4">
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
              Food Resources
            </h1>
            <p className="text-sm text-gray-600">📍 Jackson, TN</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'backdrop-blur-xl bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            All ({jacksonFoodPantries.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              filter === 'open'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'backdrop-blur-xl bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            🟢 Open Now
          </button>
          <button
            onClick={() => setFilter('walk-in')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              filter === 'walk-in'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'backdrop-blur-xl bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            🚶 Walk-In OK
          </button>
        </div>
      </div>

      {/* Pantries List */}
      <div className="relative z-10 p-4 space-y-4">
        {filteredPantries.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
            <p className="text-xl font-bold text-gray-700 mb-2">No pantries match your filters</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300"
            >
              Show all pantries
            </button>
          </div>
        ) : (
          filteredPantries.map(pantry => (
            <div
              key={pantry.id}
              className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pantry.name}</h3>
                    <p className="text-sm text-gray-700 font-medium">
                      {pantry.address}, {pantry.city}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      📍 ~{(Math.random() * 2 + 0.5).toFixed(1)} miles away
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl text-xs font-bold backdrop-blur-xl ${
                      pantry.openNow
                        ? 'bg-green-100/80 text-green-800'
                        : 'bg-red-100/80 text-red-800'
                    }`}
                  >
                    {pantry.openNow ? '🟢 OPEN' : '🔴 CLOSED'}
                  </div>
                </div>

                {/* Hours & Wait Time */}
                <div className="mb-4 backdrop-blur-xl bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-800">
                    <span className="font-bold">Today:</span>{' '}
                    {pantry.hours[Object.keys(pantry.hours)[0] as keyof typeof pantry.hours] || 'Call for hours'}
                  </p>
                  {pantry.waitTime && (
                    <p className="text-sm text-gray-800 mt-1">
                      <span className="font-bold">Wait time:</span> ~{pantry.waitTime} min
                    </p>
                  )}
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pantry.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 backdrop-blur-xl bg-blue-50/80 text-blue-700 text-xs font-semibold rounded-full border border-blue-200"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Current Inventory with Gradient Dots */}
                <div className="mb-5">
                  <p className="text-sm font-bold text-gray-800 mb-3">Current Stock:</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getInventoryColor(pantry.inventory.produce)} rounded-2xl mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                        {getInventoryDots(pantry.inventory.produce)}
                      </div>
                      <p className="text-xs text-gray-700 font-medium">Produce</p>
                    </div>
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getInventoryColor(pantry.inventory.protein)} rounded-2xl mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                        {getInventoryDots(pantry.inventory.protein)}
                      </div>
                      <p className="text-xs text-gray-700 font-medium">Protein</p>
                    </div>
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getInventoryColor(pantry.inventory.dairy)} rounded-2xl mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                        {getInventoryDots(pantry.inventory.dairy)}
                      </div>
                      <p className="text-xs text-gray-700 font-medium">Dairy</p>
                    </div>
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getInventoryColor(pantry.inventory.nonPerishables)} rounded-2xl mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                        {getInventoryDots(pantry.inventory.nonPerishables)}
                      </div>
                      <p className="text-xs text-gray-700 font-medium">Canned</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons with Gradients */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => getDirections(pantry)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
                  >
                    🗺️ Directions
                  </button>
                  <button
                    onClick={() => callPantry(pantry.phone)}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={() => setSelectedPantry(pantry)}
                    className="px-5 backdrop-blur-xl bg-white/90 hover:bg-white text-gray-800 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
                  >
                    Info
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal with Beautiful Glassmorphism */}
      {selectedPantry && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setSelectedPantry(null)}
        >
          <div
            className="backdrop-blur-2xl bg-white/95 rounded-t-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl border-t border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedPantry.name}
              </h2>
              <button
                onClick={() => setSelectedPantry(null)}
                className="p-2 backdrop-blur-xl bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div className="backdrop-blur-xl bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-2">Address</p>
                <p className="text-gray-900 font-medium">{selectedPantry.address}</p>
                <p className="text-gray-900 font-medium">{selectedPantry.city}, {selectedPantry.state} {selectedPantry.zip}</p>
              </div>

              <div className="backdrop-blur-xl bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-2">Phone</p>
                <a href={`tel:${selectedPantry.phone}`} className="text-blue-600 font-bold hover:text-blue-700">
                  {selectedPantry.phone}
                </a>
              </div>

              <div className="backdrop-blur-xl bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-3">Hours</p>
                <div className="space-y-2">
                  {Object.entries(selectedPantry.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize text-gray-700 font-medium">{day}:</span>
                      <span className="text-gray-900 font-bold">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="backdrop-blur-xl bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-3">Services Offered</p>
                <ul className="space-y-2">
                  {selectedPantry.services.map((service, index) => (
                    <li key={index} className="text-sm text-gray-900 flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="font-medium">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="backdrop-blur-xl bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-3">Requirements</p>
                <ul className="space-y-2">
                  {selectedPantry.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-900 flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span className="font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedPantry.accessibility && (
                <div className="backdrop-blur-xl bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-sm font-bold text-gray-700 mb-3">Accessibility</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPantry.accessibility.wheelchairAccessible && (
                      <span className="px-3 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-xl">
                        ♿ Wheelchair Accessible
                      </span>
                    )}
                    {selectedPantry.accessibility.parking && (
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-xl">
                        🅿️ Parking Available
                      </span>
                    )}
                    {selectedPantry.accessibility.publicTransit && (
                      <span className="px-3 py-1.5 bg-purple-100 text-purple-800 text-sm font-semibold rounded-xl">
                        🚌 Public Transit
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
