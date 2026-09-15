import React, { useEffect, useState } from 'react';
import { Bell, Heart, Sparkles, X, Activity, ArrowRight, Clock, Droplets } from 'lucide-react';

interface VitalsReminderToastProps {
  isOpen: boolean;
  onClose: () => void;
  onLogVitals: () => void;
  title?: string;
  message?: string;
  autoCloseDuration?: number; // ms, default 10000 (10s)
}

export const VitalsReminderToast: React.FC<VitalsReminderToastProps> = ({
  isOpen,
  onClose,
  onLogVitals,
  title = 'Hourly Vitals Check-in! ⏰💅',
  message = 'Hey bestie! An hour has passed. Time to check and log your Blood Pressure, Heart Rate & SpO2 to keep your streak glowing!',
  autoCloseDuration = 12000
}) => {
  const [progress, setProgress] = useState<number>(100);

  // Play audio chime using Web Audio API
  useEffect(() => {
    if (isOpen) {
      setProgress(100);

      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const now = ctx.currentTime;
          
          // First gentle chime tone (E5 - 659Hz)
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(659.25, now);
          gain1.gain.setValueAtTime(0.15, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.35);

          // Second high chime tone (A5 - 880Hz)
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, now + 0.15);
          gain2.gain.setValueAtTime(0.18, now + 0.15);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now + 0.15);
          osc2.stop(now + 0.55);
        }
      } catch (e) {
        // AudioContext may be restricted by browser gesture policies
      }

      // Also send system browser notification if permission granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('SlayHealth Vitals Reminder ⏰💅', {
            body: 'Time for your hourly health check-in! Log your vitals to earn +15 PTS.',
            icon: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            tag: 'vitals-hourly-reminder'
          });
        } catch (err) {
          console.log('Browser notification fallback to in-app toast');
        }
      }

      // Auto-dismiss timer
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remainingPct = Math.max(0, 100 - (elapsed / autoCloseDuration) * 100);
        setProgress(remainingPct);

        if (elapsed >= autoCloseDuration) {
          clearInterval(interval);
          onClose();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="vitals-reminder-toast"
      role="alert"
      aria-live="assertive"
      className="fixed top-20 right-4 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-96 animate-popIn"
    >
      <div className="bg-yellow-100 border-3 border-slate-900 rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_0px_#0f172a] relative overflow-hidden">
        {/* Top Progress countdown bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-200">
          <div
            className="h-full bg-purple-600 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mt-1 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-600 text-yellow-300 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#000] shrink-0 animate-bounce">
              <Bell size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase bg-white border border-slate-900 px-2 py-0.5 rounded-full text-purple-900 shadow-[1px_1px_0px_0px_#000]">
                  Hourly Reminder 🔔
                </span>
                <span className="text-[10px] font-bold text-slate-500">Just now</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 leading-tight mt-0.5">{title}</h4>
            </div>
          </div>

          <button
            id="toast-close-btn"
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border-2 border-slate-900 rounded-xl shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <X size={15} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-xs font-bold text-slate-700 leading-relaxed mb-3 bg-white/80 border-2 border-slate-900/20 rounded-2xl p-2.5">
          {message}
        </p>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="toast-log-vitals-btn"
            onClick={() => {
              onClose();
              onLogVitals();
            }}
            className="flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black py-2.5 px-3 rounded-2xl border-2 border-slate-900 text-xs shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Activity size={14} className="stroke-[2.5]" />
            <span>Log Vitals Now</span>
          </button>

          <button
            id="toast-snooze-btn"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-900 font-black py-2.5 px-3 rounded-2xl border-2 border-slate-900 text-xs shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Clock size={14} className="text-slate-600" />
            <span>Snooze / Slay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
