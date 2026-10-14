import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Car, ShoppingCart, X, CheckCircle2 } from 'lucide-react';

interface ToastData {
  id: number;
  icon: 'wrench' | 'cart' | 'car';
  message: string;
  location: string;
  timeAgo: string;
}

const SAMPLE_ALERTS: ToastData[] = [
  {
    id: 1,
    icon: 'wrench',
    message: "Salem in Shuwaikh Industrial booked a Stage II ECU Calibration",
    location: "Shuwaikh",
    timeAgo: "2 mins ago"
  },
  {
    id: 2,
    icon: 'cart',
    message: "Fahad in Hawally purchased Turbo Boost Controller Pro",
    location: "Hawally",
    timeAgo: "Just now"
  },
  {
    id: 3,
    icon: 'car',
    message: "Ahmed in Jleeb requested VIP Test Drive for Nissan GT-R",
    location: "Jleeb Al-Shuyoukh",
    timeAgo: "4 mins ago"
  },
  {
    id: 4,
    icon: 'wrench',
    message: "Yousef in Salmiya scheduled Synthetic Oil & Desert Check",
    location: "Salmiya",
    timeAgo: "1 min ago"
  }
];

export const LiveSalesToast: React.FC = () => {
  const [currentToastIndex, setCurrentToastIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentToastIndex((prev) => (prev + 1) % SAMPLE_ALERTS.length);
        setVisible(true);
      }, 800);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const toast = SAMPLE_ALERTS[currentToastIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-auto bg-white/95 border border-sky-200/80 backdrop-blur-xl rounded-2xl p-3.5 shadow-xl shadow-sky-900/10 flex items-center gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              {toast.icon === 'wrench' && <Wrench className="w-4 h-4" />}
              {toast.icon === 'cart' && <ShoppingCart className="w-4 h-4" />}
              {toast.icon === 'car' && <Car className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {toast.message}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                <span className="text-sky-600 font-bold">{toast.location}</span>
                <span>•</span>
                <span>{toast.timeAgo}</span>
              </div>
            </div>

            <button
              onClick={() => setVisible(false)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
