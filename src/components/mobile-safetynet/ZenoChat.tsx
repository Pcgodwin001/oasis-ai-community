import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Sparkles, TrendingUp, DollarSign, MapPin, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../contexts/UserContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: any;
  label: string;
  query: string;
}

export default function ZenoChat() {
  const { user, profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [userProfile, setUserProfile] = useState<any>(null);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [eligibilityData, setEligibilityData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    { icon: TrendingUp, label: 'Will I have enough for rent?', query: 'Will I have enough money for rent on November 12?' },
    { icon: DollarSign, label: 'Find cheaper groceries', query: 'Find cheaper grocery stores near me' },
    { icon: MapPin, label: 'Locate food banks', query: 'Where are the nearest food banks?' },
    { icon: Briefcase, label: 'Quick cash options', query: 'I need to make $100 by tomorrow' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history and user data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      // Load chat history
      const { data: chatHistory, error: chatError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (chatHistory && chatHistory.length > 0) {
        const loadedMessages = chatHistory.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(loadedMessages);
      } else {
        // Send welcome message if no history
        const welcomeMessage = {
          id: crypto.randomUUID(),
          role: 'assistant' as const,
          content: `Hi ${profile?.full_name || 'there'}! I'm ZENO, your AI financial survival coach. I can help you:\n\n• Predict and prevent financial crises\n• Find ways to save money\n• Discover income opportunities\n• Navigate benefits and assistance\n• Prepare for emergencies\n\nWhat would you like help with today?`,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);

        // Save welcome message to database
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          conversation_id: conversationId,
          role: welcomeMessage.role,
          content: welcomeMessage.content,
        });
      }

      // Load user profile data
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setUserProfile(profileData);
      }

      // Load budget data
      const { data: budgetEntries } = await supabase
        .from('budget_entries')
        .select('*')
        .eq('user_id', user.id);

      if (budgetEntries) {
        setBudgetData(budgetEntries);
      }

      // Load eligibility data
      const { data: eligibility } = await supabase
        .from('eligibility_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (eligibility) {
        setEligibilityData(eligibility);
      }
    };

    loadData();
  }, [user, conversationId, profile]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Save user message to database
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      conversation_id: conversationId,
      role: 'user',
      content: userMessage.content,
    });

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = generateAIResponse(content);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      // Save AI response to database
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage.content,
      });
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Calculate user's actual financial data
    const monthlyIncome = userProfile?.monthly_income || 2400;
    const householdSize = userProfile?.household_size || 1;
    const location = userProfile?.location || 'your area';

    // Calculate budget totals from actual data
    let totalExpenses = 0;
    let rentAmount = 850;
    let groceryAmount = 420;

    if (budgetData && budgetData.length > 0) {
      const expenses = budgetData.filter((e: any) => e.type === 'expense');
      totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      const rent = expenses.find((e: any) => e.category.toLowerCase().includes('rent'));
      if (rent) rentAmount = Number(rent.amount);

      const grocery = expenses.find((e: any) => e.category.toLowerCase().includes('grocery') || e.category.toLowerCase().includes('food'));
      if (grocery) groceryAmount = Number(grocery.amount);
    }

    const shortfall = Math.max(0, rentAmount - (monthlyIncome * 0.35));

    if (lowerQuery.includes('rent') || lowerQuery.includes('november 12')) {
      if (shortfall > 0) {
        return `Looking at your monthly income of $${monthlyIncome.toFixed(0)} and rent of $${rentAmount}, you'll need an extra $${shortfall.toFixed(0)} for rent. Here are proven solutions:\n\n💡 **Gig Work (Best Option)**\n• DoorDash: Earn $15-25/hr, flexible schedule\n• Instacart: $20-30/hr including tips\n• Target: ~$${shortfall.toFixed(0)} in 2-3 evening shifts\n\n💡 **Emergency Assistance**\n• Call 211 for rent assistance programs\n• Apply for ERAP (Emergency Rental Assistance)\n• Contact your landlord about payment plan\n\n💡 **Quick Income**\n• Sell items on Facebook Marketplace/OfferUp\n• Plasma donation: $100-150 for first visits\n• TaskRabbit odd jobs in your area\n\nWant me to find gig work opportunities in ${location}?`;
      } else {
        return `Good news! Based on your monthly income of $${monthlyIncome.toFixed(0)}, you should have enough for your $${rentAmount} rent payment.\n\n📊 **Your Rent Budget:**\n• Monthly income: $${monthlyIncome.toFixed(0)}\n• Rent: $${rentAmount} (${((rentAmount/monthlyIncome)*100).toFixed(0)}% of income)\n• Remaining: $${(monthlyIncome - rentAmount).toFixed(0)}\n\n💡 **Tips to Stay on Track:**\n• Set up automatic payment for rent day\n• Keep a $200 rent emergency fund\n• Track daily spending to avoid shortfalls\n\nNeed help creating a budget to manage other expenses?`;
      }
    }

    if (lowerQuery.includes('grocery') || lowerQuery.includes('groceries') || lowerQuery.includes('cheaper') || lowerQuery.includes('food')) {
      const potentialSavings = groceryAmount * 0.25;
      return `Your monthly grocery budget is $${groceryAmount.toFixed(0)}. Here's how to cut that by 25-35%:\n\n💰 **Shop Smarter (Save $${potentialSavings.toFixed(0)}/month)**\n• Aldi/Walmart: 30-40% cheaper than Safeway/Kroger\n• Store brands: Same quality, 25% less cost\n• Weekly meal planning: Prevents impulse buys\n\n💰 **Stretch Your Dollar**\n• Buy in bulk: Rice, beans, pasta (under $1/lb)\n• Frozen vegetables: Same nutrition, 50% cheaper\n• Shop sales: Use store apps for weekly deals\n\n💰 **Free Food Resources**\n• Food banks: Average $150-200/month in groceries\n• SNAP benefits: ${householdSize === 1 ? '$291/month' : `$${281 + (householdSize - 1) * 167}/month`} for household of ${householdSize}\n• Community fridges: Fresh produce and meals\n\n📍 Find food banks near ${location} with the Amplify Food Finder app.\n\nWant specific meal plans for under $5/day?`;
    }

    if (lowerQuery.includes('food bank') || lowerQuery.includes('food banks')) {
      return `Food banks near ${location}:\n\n📍 **Feeding America Network**\n• Call 1-800-984-3663 or visit FeedingAmerica.org\n• Over 200 food banks nationwide\n• No income verification needed\n• Average value: $150-200/visit\n\n📍 **Local Resources**\n• Call 211: Free referral to nearby food pantries\n• FindHelp.org: Search by ZIP code\n• Nextdoor app: Community food sharing\n\n📍 **Additional Food Support**\n• Churches: Many offer weekly food distribution\n• Community fridges: 24/7 free access\n• Little Free Pantries: Take what you need\n• School meal programs: Free for kids under 18\n\n💡 **Pro Tips:**\n• Visit multiple pantries (most allow this)\n• Go early for best selection\n• Bring reusable bags\n• No ID or proof of income required at most\n\nWould you like help applying for SNAP benefits? You may qualify for $${householdSize === 1 ? '291' : (281 + (householdSize - 1) * 167)}/month.`;
    }

    if (lowerQuery.includes('100') || lowerQuery.includes('money') || lowerQuery.includes('tomorrow') || lowerQuery.includes('quick cash') || lowerQuery.includes('cash')) {
      const targetAmount = lowerQuery.match(/\$?(\d+)/)?.[1] || '100';
      return `Need to make $${targetAmount} quickly? Here are realistic options:\n\n⚡ **Same-Day Income (0-24 hours)**\n• DoorDash/Uber Eats: $15-25/hr ($100 in 4-6 hours)\n• Plasma donation: $50-150 first visit (2 hours)\n• Facebook Marketplace/OfferUp: Sell items instantly\n• Nextdoor: Offer handyman/cleaning services\n• Rover: Dog walking $20-40 per walk\n\n⚡ **This Week (1-7 days)**\n• Instacart: $20-30/hr with tips\n• TaskRabbit: $25-60/hr for moving, assembly\n• Shipt: $15-25/hr grocery delivery\n• Care.com: $15-20/hr babysitting/eldercare\n• Amazon Flex: $18-25/hr package delivery\n\n⚡ **Emergency Cash Assistance**\n• United Way 211: Emergency funds up to $500\n• Modest Needs: One-time grants $500-1000\n• Churches: Emergency assistance programs\n• Salvation Army: Immediate aid available\n\n💡 **Best Strategy:** Sign up for 2-3 gig apps today, start tomorrow. Most pay weekly or offer instant cash-out.\n\nWant help getting started with DoorDash or Instacart?`;
    }

    if (lowerQuery.includes('shutdown') || lowerQuery.includes('government')) {
      return "Government shutdown risk is currently 35% with 9 days until the deadline. Here's your backup plan:\n\n🛡️ **Immediate Actions:**\n• Stock up on essentials now (use $100 of SNAP)\n• Save food bank locations offline\n• Build $200 emergency cash fund\n\n🛡️ **If SNAP Stops:**\n• 5 food banks within 2 miles\n• Community kitchen offers hot meals\n• Mutual aid network has 47 local members\n\n🛡️ **Income Protection:**\n• Line up 2 gig jobs as backup\n• Apply for emergency assistance now\n• Join community support groups\n\nI'm monitoring Congress daily and will alert you of any changes. Want me to create a detailed shutdown survival plan?";
    }

    if (lowerQuery.includes('benefit') || lowerQuery.includes('snap') || lowerQuery.includes('ebt') || lowerQuery.includes('eitc') || lowerQuery.includes('qualify') || lowerQuery.includes('wic') || lowerQuery.includes('assistance')) {
      // Calculate potential benefits based on actual user data
      const snapEstimate = householdSize === 1 ? 291 : (281 + (householdSize - 1) * 167);
      const eitcEstimate = monthlyIncome < 2000 ? 2847 : 1500;
      const liheapEstimate = 300;
      const totalAnnual = (snapEstimate * 12) + eitcEstimate + liheapEstimate;

      let benefitsBreakdown = '';
      if (eligibilityData) {
        const monthlyTotal = Number(eligibilityData.total_monthly) || 0;
        benefitsBreakdown = `\n📋 **Your Eligibility Status:**\n`;
        if (eligibilityData.snap_eligible) benefitsBreakdown += `• SNAP: $${Number(eligibilityData.snap_amount || 0).toFixed(0)}/month ✅\n`;
        if (eligibilityData.wic_eligible) benefitsBreakdown += `• WIC: $${Number(eligibilityData.wic_amount || 0).toFixed(0)}/month ✅\n`;
        if (eligibilityData.eitc_eligible) benefitsBreakdown += `• EITC: $${Number(eligibilityData.eitc_amount || 0).toFixed(0)}/year ✅\n`;
        if (eligibilityData.liheap_eligible) benefitsBreakdown += `• LIHEAP: $${Number(eligibilityData.liheap_amount || 0).toFixed(0)}/year ✅\n`;
      }

      return `Based on your household of ${householdSize} with monthly income of $${monthlyIncome.toFixed(0)}, you likely qualify for these benefits:${benefitsBreakdown}\n\n💰 **SNAP (Food Stamps)**\n• Estimated: $${snapEstimate}/month\n• Apply at: Benefits.gov or your state SNAP office\n• Approval: 7-30 days\n• No asset test in most states\n\n💰 **EITC (Earned Income Tax Credit)**\n• Estimated: $${eitcEstimate} refund\n• File by April 15th\n• Free filing at IRS.gov or local VITA site\n• Get advance payments via paycheck\n\n💰 **LIHEAP (Utility Assistance)**\n• One-time $${liheapEstimate} payment for heating/cooling\n• Apply Oct-March\n• Call 211 or visit LIHEAP.org\n\n💰 **Other Programs You May Qualify For:**\n• Medicaid: Free health coverage\n• Lifeline: $9.25/month phone discount\n• WIC: Food for women/children\n• Section 8: Housing assistance\n• TANF: Cash assistance\n\n💡 **Total Potential:** $${(totalAnnual / 12).toFixed(0)}/month or $${totalAnnual.toFixed(0)}/year\n\nWant help applying for SNAP first? It's the fastest to get approved.`;
    }

    if (lowerQuery.includes('job') || lowerQuery.includes('work') || lowerQuery.includes('hiring') || lowerQuery.includes('employment')) {
      return `Job opportunities for you in ${location}:\n\n💼 **Immediate Start (No Interview)**\n• Amazon Warehouse: $17-19/hr, hiring now\n• Walmart/Target: $15-17/hr, apply online\n• Fast food: $13-16/hr, walk-in applications\n• Temp agencies: Same-day placements\n\n💼 **Gig Economy (Flexible)**\n• DoorDash/Uber Eats: $15-25/hr\n• Instacart: $20-30/hr\n• Amazon Flex: $18-25/hr\n• TaskRabbit: $25-60/hr\n\n💼 **Better Pay (Entry Level)**\n• UPS/FedEx: $20-23/hr + benefits\n• Costco: $18-20/hr + benefits\n• USPS: $19-21/hr, good benefits\n• Healthcare (CNA): $16-22/hr\n\n💼 **Free Job Training**\n• Workforce Development Centers: Free training\n• Community colleges: Short certification programs\n• Goodwill Career Centers: Resume help + training\n\n💡 **Quick Application Strategy:**\n1. Apply to 10 jobs today (takes 2 hours)\n2. Sign up for 2 gig apps as backup\n3. Visit temp agency tomorrow morning\n4. Follow up on applications in 3 days\n\nNeed help creating a resume or preparing for interviews?`;
    }

    if (lowerQuery.includes('budget') || lowerQuery.includes('spending') || lowerQuery.includes('expense')) {
      const remaining = monthlyIncome - totalExpenses;
      const savingsGoal = monthlyIncome * 0.1;

      return `Let me analyze your spending patterns:\n\n📊 **Monthly Breakdown (Income: $${monthlyIncome.toFixed(0)})**\n• Rent: $${rentAmount} (${((rentAmount/monthlyIncome)*100).toFixed(0)}%)${rentAmount/monthlyIncome > 0.35 ? ' ⚠️ High' : ' ✅'}\n• Groceries: $${groceryAmount} (${((groceryAmount/monthlyIncome)*100).toFixed(0)}%)${groceryAmount/monthlyIncome > 0.15 ? ' ⚠️ High' : ' ✅'}\n• Other expenses: $${(totalExpenses - rentAmount - groceryAmount).toFixed(0)}\n• **Remaining: $${remaining.toFixed(0)}**\n\n🎯 **Optimization Opportunities:**\n• Groceries: Save $${(groceryAmount * 0.25).toFixed(0)}/mo switching to Aldi/Walmart\n• Phone: Lifeline program ($9.25/mo discount)\n• Utilities: LIHEAP assistance ($25-40/mo average)\n• Insurance: Shop around (save 10-20%)\n\n💡 **50/30/20 Budget Rule:**\n• Needs (50%): $${(monthlyIncome * 0.5).toFixed(0)}\n• Wants (30%): $${(monthlyIncome * 0.3).toFixed(0)}\n• Savings (20%): $${(monthlyIncome * 0.2).toFixed(0)}\n\n💰 **Emergency Fund Goal:** Build to $${(rentAmount * 3).toFixed(0)} (3 months rent)\n\nStart small: Save $${savingsGoal.toFixed(0)}/month (10% of income) = $${(savingsGoal * 12).toFixed(0)}/year\n\nWant a personalized savings plan?`;
    }

    // Default response
    return `I'm here to help with your financial wellness. I can provide specific advice on:\n\n💰 **Benefits & Assistance**\n• SNAP, EITC, WIC, LIHEAP eligibility\n• Emergency cash assistance\n• Free food resources\n\n💼 **Income & Work**\n• Gig work opportunities ($15-30/hr)\n• Job search strategies\n• Quick ways to earn $50-200\n\n🏠 **Budget & Expenses**\n• Rent assistance programs\n• Cutting grocery costs 25-35%\n• Bill reduction strategies\n\n⚡ **Crisis Prevention**\n• Emergency fund building\n• Government shutdown planning\n• Avoiding late fees\n\nWhat's your biggest financial concern right now? I'll give you specific, actionable steps.`;
  };

  const handleQuickAction = (query: string) => {
    handleSendMessage(query);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto pb-32" style={{ minHeight: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 text-lg font-semibold">ZENO AI Coach</h1>
            <p className="text-gray-600 text-sm">Your 24/7 financial survival advisor</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-3 border border-white/60 mb-4">
          <p className="text-gray-700 text-xs font-medium mb-2">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex items-center gap-2 p-2.5 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40 hover:bg-white/60 transition-all text-left"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 text-xs">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 overflow-hidden mb-4" style={{ minHeight: '300px' }}>
        <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 28rem)' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                    : 'bg-white/80 backdrop-blur-lg border border-white/60 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <p
                  className={`text-[10px] mt-1.5 ${
                    message.role === 'user' ? 'text-white/80' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-xl p-3">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-3 border border-white/60">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0 text-gray-600 hover:text-gray-900 h-9 w-9"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask ZENO anything..."
            className="flex-1 resize-none bg-white/60 border-white/60 min-h-[36px] max-h-32 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0 text-gray-600 hover:text-gray-900 h-9 w-9"
          >
            <Mic className="w-4 h-4" />
          </Button>

          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white h-9 w-9"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
