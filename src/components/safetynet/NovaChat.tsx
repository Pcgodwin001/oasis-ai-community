import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Search, Trash2, Download, MoreVertical, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { PromptInputBox } from '../ui/ai-prompt-box';
import { aiService } from '../../services/aiService';
import { authService } from '../../services/authService';
import { toast } from 'sonner';

interface Message {
  id: number;
  sender: 'user' | 'nova';
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; path: string }>;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'nova',
    content: "Hi! I'm NOVA, your AI Financial Coach. I monitor your money 24/7 and help you survive economic uncertainty. I can predict financial crises, optimize your budget, find ways to earn money, and connect you to resources. What can I help you with today?",
    timestamp: new Date(Date.now() - 3600000),
  },
];

const commonQuestions = [
  'Will I have enough money for rent?',
  'How can I avoid overdraft on Nov 12?',
  'Find cheaper grocery stores near me',
  'I need $100 by tomorrow',
  'What benefits am I missing?',
  'Help me prepare for government shutdown',
];

const conversationHistory = [
  { id: 1, title: 'Rent Crisis - Nov 12', date: 'Today', preview: 'How can I avoid overdraft when rent is due?' },
  { id: 2, title: 'Grocery Cost Reduction', date: 'Yesterday', preview: 'Find me cheaper stores to save money' },
  { id: 3, title: 'Emergency Cash Options', date: 'Nov 5', preview: 'I need $100 by tomorrow, what are my options?' },
  { id: 4, title: 'Missing Benefits Discovery', date: 'Nov 3', preview: 'You found I\'m eligible for $2,847 in EITC!' },
];

export default function NovaChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const userInput = message;
    setIsTyping(true);

    try {
      // Get current user
      const user = await authService.getCurrentUser();
      if (!user) {
        toast.error('Please sign in to use NOVA');
        setIsTyping(false);
        return;
      }

      // Get user context for personalized AI responses
      const userContext = await aiService.getUserContextForAI(user.id);

      // Get AI response
      const aiResponse = await aiService.sendMessage(
        user.id,
        conversationId,
        userInput,
        userContext
      );

      const novaMessage: Message = {
        id: messages.length + 2,
        sender: 'nova',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, novaMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get response from NOVA');

      // Fallback to mock response if AI fails
      setTimeout(() => {
        const responses: { [key: string]: Message } = {
          'rent': {
            id: messages.length + 2,
            sender: 'nova',
            content: 'I see you\'re $94 short for rent on Nov 12. Don\'t worry, I have 3 solutions:\n\n1. Work 1 DoorDash dinner shift tonight (6-9pm) → Earn $35-45 in 3 hours. Surge pricing active in your area.\n\n2. Sell unused items on Facebook Marketplace → I scanned your past purchases and found 4 items you could sell for $50-80 total (takes 2-3 days).\n\n3. Request shift advance from your employer → Most employers offer $50-100 advances, repaid next paycheck.\n\nMy recommendation: Do option #1 tonight. It\'s the fastest and covers your shortage. Want me to set this up?',
            timestamp: new Date(),
            actions: [
              { label: 'Find Gig Work Now', path: '/jobs' },
              { label: 'View Full Cash Flow', path: '/budget' },
              { label: 'Emergency Resources', path: '/resources' },
            ],
          },
          'grocery': {
            id: messages.length + 2,
            sender: 'nova',
            content: "I analyzed your receipts and found you can save $87/month by switching stores:\n\n• Milk, eggs, bread at Aldi instead of Walmart = Save $32/month (26% cheaper)\n• Store brand for 8 common items = Save $28/month\n• Shop Tuesdays for markdowns = Save $27/month\n\nTotal annual savings: $1,044. The Aldi at 123 Main St is 1.2 miles from you, open 9am-8pm. Want directions?",
            timestamp: new Date(),
            actions: [
              { label: 'Get Directions to Aldi', path: '/resources' },
              { label: 'View Smart Budget', path: '/budget' },
              { label: 'Scan More Receipts', path: '/receipts' },
            ],
          },
          'money': {
            id: messages.length + 2,
            sender: 'nova',
            content: 'I can help you get $100 by tomorrow. Here are your fastest options ranked by time:\n\n1. DoorDash tonight (3-4 hours) → $80-120\n2. Sell items today (Facebook/Craigslist) → $50-150 (I found 6 items you can sell)\n3. Plasma donation (2 hours) → $50-100 first time\n4. Ask for workplace advance → $100 (if employer offers)\n\n⚠️ AVOID payday loans - they charge 400% interest and trap you in debt.\n\nMy recommendation: Combine DoorDash tonight ($40) + sell 2 items tomorrow ($60) = $100+ total. Which would you like to start with?',
            timestamp: new Date(),
            actions: [
              { label: 'Find Quick Gigs', path: '/jobs' },
              { label: 'Emergency Cash Guide', path: '/budget' },
              { label: 'Community Resources', path: '/resources' },
            ],
          },
          'benefits': {
            id: messages.length + 2,
            sender: 'nova',
            content: '🎯 Great news! You\'re eligible for benefits you\'re not receiving:\n\n1. EITC Tax Credit: $2,847/year - I can help you file in 30 minutes\n2. WIC Benefits: $47/month for nutritious food\n3. LIHEAP (Heating): $400 this winter\n4. Lifeline (Phone): $9.25/month discount\n\nTotal value: $3,411/year you\'re leaving on the table! Want me to help you apply for these? I can fill out the applications with you.',
            timestamp: new Date(),
            actions: [
              { label: 'Apply for EITC Now', path: '/eligibility' },
              { label: 'Apply for WIC', path: '/ebt-balance' },
              { label: 'View All Benefits', path: '/ebt-balance' },
            ],
          },
          'shutdown': {
            id: messages.length + 2,
            sender: 'nova',
            content: 'I\'m monitoring the government shutdown risk 24/7. Current status:\n\n🟡 Risk Level: 35% (Moderate)\n📅 Deadline: Nov 17, 2025 (9 days)\n💰 Your exposure: HIGH - You receive $425/month SNAP\n\nIf shutdown happens:\n• SNAP may be delayed 2-4 weeks\n• Your backup plan is READY:\n  - 5 food banks within 2 miles\n  - $87 emergency fund (3 days food)\n  - 12 neighbors in mutual aid network\n\nI\'ll alert you immediately if risk increases above 50%. Want me to help you prepare more?',
            timestamp: new Date(),
            actions: [
              { label: 'View Shutdown Tracker', path: '/shutdown' },
              { label: 'Build Emergency Fund', path: '/budget' },
              { label: 'Find Food Resources', path: '/resources' },
            ],
          },
          'balance': {
            id: messages.length + 2,
            sender: 'nova',
            content: 'Your SNAP balance is $296.55. Next refill: Nov 10 (+$425).\n\nBut let me tell you what\'s more important - your PREDICTED cash flow:\n\n⚠️ Nov 12: You\'ll be $94 short for rent\n✅ Nov 15: Paycheck arrives, you\'ll have $506 safe to spend\n⚠️ Nov 20: Predicted grocery run will leave you with $326\n\nMy recommendation: Work 1 extra shift before Nov 12 to avoid overdraft ($35 fee). Want help finding quick work?',
            timestamp: new Date(),
            actions: [
              { label: 'View 30-Day Prediction', path: '/budget' },
              { label: 'Find Gig Work', path: '/jobs' },
              { label: 'Manage All Benefits', path: '/ebt-balance' },
            ],
          },
          'default': {
            id: messages.length + 2,
            sender: 'nova',
            content: "I'm your AI Financial Coach! I can help you:\n\n💰 Predict when you'll run out of money (30-day forecast)\n🎯 Find ways to earn extra income TODAY\n📊 Optimize your budget and find hidden savings\n🏪 Discover cheaper stores and save hundreds\n🆘 Navigate financial emergencies\n💵 Find benefits you're eligible for but missing\n⚠️ Prepare for government shutdowns\n\nWhat would you like help with?",
            timestamp: new Date(),
            actions: [
              { label: 'Predict My Cash Flow', path: '/budget' },
              { label: 'Find Ways to Earn', path: '/jobs' },
              { label: 'Check Missing Benefits', path: '/ebt-balance' },
              { label: 'Emergency Help', path: '/resources' },
            ],
          },
        };

        let responseKey = 'default';
        const lowerInput = userInput.toLowerCase();

        if (lowerInput.includes('rent') || lowerInput.includes('overdraft') || lowerInput.includes('short') || lowerInput.includes('enough money')) {
          responseKey = 'rent';
        } else if (lowerInput.includes('grocery') || lowerInput.includes('groceries') || lowerInput.includes('cheaper') || lowerInput.includes('save money') || lowerInput.includes('store')) {
          responseKey = 'grocery';
        } else if (lowerInput.includes('need') && (lowerInput.includes('$') || lowerInput.includes('money') || lowerInput.includes('cash') || lowerInput.includes('100') || lowerInput.includes('tomorrow'))) {
          responseKey = 'money';
        } else if (lowerInput.includes('benefit') || lowerInput.includes('eligible') || lowerInput.includes('missing') || lowerInput.includes('eitc') || lowerInput.includes('wic')) {
          responseKey = 'benefits';
        } else if (lowerInput.includes('shutdown') || lowerInput.includes('government') || lowerInput.includes('prepare')) {
          responseKey = 'shutdown';
        } else if (lowerInput.includes('balance') || lowerInput.includes('ebt') || lowerInput.includes('snap')) {
          responseKey = 'balance';
        }

        setMessages((prev) => [...prev, responses[responseKey]]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col backdrop-blur-sm bg-white/10">
      {/* Clean Header */}
      <div className="backdrop-blur-xl bg-white/40 border-b border-white/40 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">NOVA</h2>
              <p className="text-sm text-gray-600">AI Financial Coach</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-white/50">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="backdrop-blur-lg bg-white/90">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export Conversation
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'nova' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`flex flex-col max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.sender === 'user' ? 'text-white font-medium' : 'text-gray-900'
                  }`}>
                    {message.content}
                  </p>
                </div>

                {message.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.actions.map((action, index) => (
                      <Link key={index} to={action.path}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80 hover:bg-white text-xs"
                        >
                          {action.label} →
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1.5 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.sender === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gray-600 text-white">
                    U
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3">
                <p className="text-sm text-gray-600 italic">Thinking...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Common Questions - Simplified */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-600 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.slice(0, 4).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="bg-white/60 hover:bg-white/80 text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area - Clean */}
      <div className="backdrop-blur-xl bg-white/50 border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <PromptInputBox
            onSend={handleSend}
            isLoading={isTyping}
            placeholder="Ask NOVA anything..."
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            NOVA is an AI coach. Verify critical financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
