import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, RefreshCw, MessageSquare, Flame, Heart, AlertCircle } from 'lucide-react';
import { ChatMessage, UserProfile, VitalsRecord } from '../types';

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  latestVitals?: VitalsRecord | null;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'gemini',
    text: "Hey bestie! ✨ I'm your Gemini Health AI. Whether you need a quick blood pressure check, post-workout hydration tips, or a quick mood reset, I gotchu! How are you feeling right now? 💅",
    timestamp: 'Just now',
    category: 'vibe'
  }
];

const PROMPT_CHIPS = [
  { label: '💧 Water Goal Check', prompt: 'How much water should I drink based on my 1,750ml current log?' },
  { label: '🩺 BP 120/80 Meaning', prompt: 'Is my blood pressure 118/76 normal or high?' },
  { label: '🥑 Post-Workout Fuel', prompt: 'What is the best quick high-protein snack after workout?' },
  { label: '🧘‍♀️ 1-Minute Reset', prompt: 'I feel slightly stressed, guide me through a 1-minute calming breathing loop.' },
  { label: '😴 Fixing Sleep Schedule', prompt: 'Tips to hit my 8-hour sleep target tonight without grogginess?' }
];

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  user,
  latestVitals
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const generateGeminiReply = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('water') || q.includes('hydration') || q.includes('drink')) {
      const currentWater = user.goals?.waterCurrent || 1750;
      const targetWater = user.goals?.waterTarget || 2500;
      const remaining = Math.max(0, targetWater - currentWater);
      return `💧 You've logged ${currentWater}ml out of your ${targetWater}ml goal today! You're only ${remaining}ml away from hitting 100% hydration glow. Try drinking one large tumbler of chilled water with a lemon slice right now! 🍋✨`;
    }

    if (q.includes('bp') || q.includes('blood pressure') || q.includes('sys') || q.includes('dia') || q.includes('118') || q.includes('120')) {
      return `🩺 Great question! Normal resting blood pressure is generally under 120/80 mmHg. Your latest logged reading is looking nice and optimal. If you ever notice SYS > 140 or DIA > 90, remember to sit down, sip water, rest for 5 minutes, and re-test! You're doing amazing! 💖`;
    }

    if (q.includes('snack') || q.includes('food') || q.includes('protein') || q.includes('fuel') || q.includes('eat')) {
      return `🥑 Bestie, here are top 3 aesthetic high-protein snacks to fuel your day:\n1. Greek yogurt + mixed berries + chia seeds (15g protein) 🫐\n2. Iced Matcha latte with soy/almond milk + edamame 🍵\n3. Apple slices with almond butter & cinnamon 🍎`;
    }

    if (q.includes('stress') || q.includes('anxious') || q.includes('breath') || q.includes('calm') || q.includes('reset')) {
      return `🧘‍♀️ Inhale 4 seconds... Hold 4 seconds... Exhale slowly 4 seconds... 🌬️\nDrop your shoulders away from your ears, unclench your jaw, and take a gentle sip of iced water. You handled everything today like a pro! 💅✨`;
    }

    if (q.includes('sleep') || q.includes('bed') || q.includes('tired') || q.includes('night')) {
      return `😴 To hit your 8.0-hour sleep goal:\n- Put your phone on 'Do Not Disturb' 30 mins before sleep 📱❌\n- Sip chamomile or warm oat milk 🫖\n- Keep your room temp cool (~24°C) for deep REM cycles. Sweet dreams queen! 🌙`;
    }

    return `✨ Noted! As your SlayHealth AI coach, I'm keeping tabs on your streak (${user.streak || 5} days 🔥) and vitals. Always remember to listen to your body, take timely breaks, and celebrate small wins every day! What else can I check for you? 💅`;
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateGeminiReply(text);
      const botMsg: ChatMessage = {
        id: `gem-${Date.now()}`,
        sender: 'gemini',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="gemini-chat-window"
        className="w-full sm:max-w-lg bg-white border-t-4 sm:border-4 border-slate-900 rounded-t-3xl sm:rounded-3xl shadow-[0px_-8px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] flex flex-col h-[85vh] sm:h-[620px] max-h-[90vh] overflow-hidden animate-slideUp"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-b-3 border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border-2 border-white/50 backdrop-blur-xs flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white tracking-tight">Gemini Health AI</h3>
                <span className="bg-yellow-300 text-slate-900 text-[10px] font-black px-2 py-0.2 rounded-full border border-slate-900">
                  Online
                </span>
              </div>
              <p className="text-xs text-purple-100 font-semibold">Your Live Gen-Z Wellness & Vitals Co-pilot</p>
            </div>
          </div>

          <button
            id="gemini-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-purple-50 border-b-2 border-slate-900 overflow-x-auto flex gap-2 no-scrollbar">
          {PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip.prompt)}
              className="shrink-0 bg-white hover:bg-yellow-100 text-slate-800 border-2 border-slate-900 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#faf5ff]">
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 border-2 border-slate-900 flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_#000] shrink-0">
                    🤖
                  </div>
                )}

                <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl border-2 border-slate-900 text-xs sm:text-sm font-bold shadow-[3px_3px_0px_0px_#000] whitespace-pre-line ${
                      isMe
                        ? 'bg-yellow-300 text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`text-[10px] font-bold text-slate-400 mt-1 px-1 ${
                      isMe ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isMe && (
                  <div className="w-8 h-8 rounded-xl bg-purple-200 border-2 border-slate-900 flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_#000] shrink-0">
                    💅
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 border-2 border-slate-900 flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
                🤖
              </div>
              <div className="bg-white border-2 border-slate-900 rounded-2xl rounded-tl-none p-3 shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs font-black text-purple-700 ml-1">Gemini is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t-3 border-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="gemini-input-field"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Gemini about vitals, food, hydration..."
              className="flex-1 bg-slate-50 border-2 border-slate-900 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_#000]"
            />
            <button
              id="gemini-send-btn"
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black p-3 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-[10px] text-center font-bold text-slate-400 mt-1.5 flex items-center justify-center gap-1">
            <AlertCircle size={10} /> Gemini AI provides wellness tips, not clinical diagnosis. In emergencies, dial 115.
          </p>
        </div>
      </div>
    </div>
  );
};
