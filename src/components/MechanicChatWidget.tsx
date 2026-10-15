import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Wrench, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

interface MechanicChatWidgetProps {
  language: Language;
}

export const MechanicChatWidget: React.FC<MechanicChatWidgetProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const isAr = language === 'ar';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      text: isAr
        ? "مرحباً بك في كراج أبيكس تورك! أنا المهندس الافتراضي، كيف أساعدك اليوم في تشخيص الأعطال، مواعيد الصيانة، أو اختيار قطع الغيار؟"
        : "Hello! I am the Apex Torque Virtual Master Mechanic. How can I assist with your diagnostics, tuning calibrations, or garage booking today?",
      time: "Just now"
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let botResponse = isAr 
        ? "أهلاً بك! يمكنك حجز موعد مباشر في ورشة الشويخ بالضغط على زر 'حجز موعد' بالأعلى، أو تفضل بزيارتنا في الشويخ الصناعية 1."
        : "Noted! For Kuwait's high-temperature climate, we recommend our Full Synthetic Oil package or Stage II thermal calibrations. You can book an appointment above.";
      
      const lower = inputText.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('سعر') || lower.includes('كم')) {
        botResponse = isAr 
          ? "تبديل الزيت التخليقي يبدأ من 45 د.ك مع فحص شامل، وبرمجة ستيج 1 تبدأ من 285 د.ك مع الداينو."
          : "Stage I Calibrations start at 285 KWD with dyno validation. Basic full synthetic oil service is 45 KWD.";
      } else if (lower.includes('dtc') || lower.includes('code') || lower.includes('عطل') || lower.includes('فحص')) {
        botResponse = isAr
          ? "يمكنك كتابة رمز العطل (مثل P0300) في قسم 'فحص الأعطال OBD2' لتحديد المشكلة فوراً."
          : "You can input the error code directly into our DTC Scanner above for instant root-cause analysis.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: "Just now"
        }
      ]);
    }, 700);
  };

  return (
    <div className={`fixed bottom-6 ${isAr ? 'left-6' : 'right-6'} z-40`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="w-80 sm:w-96 bg-white border border-sky-100 rounded-3xl shadow-2xl overflow-hidden mb-4 flex flex-col h-[450px]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-1">
                    {isAr ? 'كبير مهندسي أبيكس' : 'Apex Master Mechanic'} <Sparkles className="w-3 h-3 text-sky-200" />
                  </h4>
                  <div className="text-[10px] text-sky-100 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isAr ? 'مستشار الصيانة المباشر' : 'LIVE DIAGNOSTIC ADVISOR'}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isAr ? 'اسأل عن الأسعار أو الأعطال...' : 'Ask about repairs, tuning, or parts...'}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
              />
              <button
                type="submit"
                className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/35 hover:bg-sky-500 transition-all active:scale-95"
        aria-label="Toggle Mechanic Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
        )}
      </button>
    </div>
  );
};