import type { Message } from '../lib/zeno'

interface ChatMessageProps {
  message: Message
  onActionClick?: (action: string) => void
}

export default function ChatMessage({ message, onActionClick }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div className={`max-w-[80%] md:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar for AI */}
        {!isUser && (
          <div className="flex items-center mb-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg mr-2 shadow-lg">
              🤖
            </div>
            <span className="text-sm font-bold text-gray-700">ZENO AI</span>
          </div>
        )}

        {/* Message Bubble with Glassmorphism */}
        <div
          className={`rounded-3xl px-6 py-4 shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-tr-md'
              : 'backdrop-blur-xl bg-white/80 text-gray-900 rounded-tl-md border border-white/20'
          }`}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {/* Timestamp */}
          <p
            className={`text-xs mt-2 ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Suggested Actions - Beautiful Buttons */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-4 space-y-2">
            {message.suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onActionClick?.(action.action)}
                className="group flex items-center justify-center w-full backdrop-blur-xl bg-white/80 border-2 border-blue-500/50 text-blue-700 px-6 py-3 rounded-2xl font-semibold hover:bg-blue-500 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {action.icon && <span className="mr-3 text-xl group-hover:scale-110 transition-transform duration-300">{action.icon}</span>}
                <span>{action.label}</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
