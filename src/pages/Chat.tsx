import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatMessage from '../components/ChatMessage'
import { getZenoResponse, conversationStarters } from '../lib/zeno'
import type { Message, ZenoContext } from '../lib/zeno'
import { mockEBTBalance } from '../lib/mockData'

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm ZENO, your personal AI assistant for SNAP benefits and community resources. I'm here to help you check your EBT balance, find food pantries in Jackson, budget your benefits, and prepare for any government changes.\n\nHow can I help you today?",
      timestamp: new Date(),
      suggestedActions: [
        { label: 'Check My Balance', action: 'navigate_balance', icon: '💳' },
        { label: 'Find Food Banks', action: 'navigate_map', icon: '📍' },
        { label: 'Budget Help', action: 'navigate_budget', icon: '📊' }
      ]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // User context for ZENO
  const userContext: ZenoContext = {
    ebtBalance: mockEBTBalance.balance,
    daysUntilRefill: mockEBTBalance.daysUntilRefill,
    familySize: 4,
    location: 'Jackson, TN'
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setLoading(true)

    try {
      // Get response from ZENO
      const response = await getZenoResponse(inputText, messages, userContext)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestedActions: response.suggestedActions
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('ZENO error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (action: string) => {
    switch (action) {
      case 'navigate_balance':
        navigate('/balance')
        break
      case 'navigate_map':
        navigate('/map')
        break
      case 'navigate_budget':
        navigate('/budget')
        break
      case 'navigate_shutdown':
        navigate('/shutdown')
        break
    }
  }

  const handleStarterClick = (starter: string) => {
    setInputText(starter)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with Glassmorphism */}
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
          <div className="flex items-center">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg">
              <span className="text-xl">🤖</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ZENO</h1>
              <p className="text-sm text-gray-600">Your AI Benefits Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            onActionClick={handleActionClick}
          />
        ))}

        {loading && (
          <div className="flex justify-start mb-6 animate-fade-in">
            <div className="backdrop-blur-xl bg-white/80 rounded-3xl rounded-tl-md px-6 py-4 shadow-lg border border-white/20">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Starters (show only if first message) */}
        {messages.length === 1 && (
          <div className="mt-8 animate-fade-in">
            <p className="text-sm font-semibold text-gray-600 mb-4 text-center flex items-center justify-center space-x-2">
              <span>💡</span>
              <span>Try asking:</span>
            </p>
            <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
              {conversationStarters.map((starter, index) => (
                <button
                  key={index}
                  onClick={() => handleStarterClick(starter)}
                  className="group backdrop-blur-xl bg-white/70 border border-white/20 text-gray-700 px-6 py-4 rounded-2xl text-sm hover:bg-white hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">💬</span>
                    <span className="font-medium">{starter}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Glassmorphism */}
      <div className="relative z-20 backdrop-blur-xl bg-white/80 border-t border-white/20 px-4 py-4 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask ZENO anything about benefits, food banks, budgeting..."
                className="w-full resize-none backdrop-blur-xl bg-white/90 rounded-3xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/30 max-h-32 text-gray-900 placeholder-gray-500 shadow-lg border border-white/20"
                rows={1}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || loading}
              className={`p-4 rounded-2xl transition-all duration-300 shadow-lg ${
                inputText.trim() && !loading
                  ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
