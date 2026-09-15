import React from 'react';
import { MotivationalQuote } from '../types';
import { X, Sparkles } from 'lucide-react';

interface GenZMotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: MotivationalQuote;
}

export const GenZMotivationModal: React.FC<GenZMotivationModalProps> = ({
  isOpen,
  onClose,
  quote
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="genz-motivation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div
        className="bg-white border-4 border-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_#ec4899] transform scale-100 animate-zoomIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close 'X' Button - Required to dismiss (MUST NOT auto-close) */}
        <button
          id="popup-close-btn"
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 bg-pink-400 hover:bg-pink-500 text-slate-900 border-2 border-slate-900 rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer active:scale-95 transition-transform"
          title="Close motivational popup"
        >
          <X size={18} />
        </button>

        {/* Badge */}
        <div className="flex items-center justify-center mb-3">
          <span className="bg-yellow-300 border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
            <Sparkles size={13} />
            {quote.badge}
          </span>
        </div>

        {/* Cute Pet Illustration / Photo */}
        <div className="w-full h-44 rounded-2xl border-3 border-slate-900 overflow-hidden mb-4 shadow-[3px_3px_0px_0px_#000] bg-purple-100 relative group">
          <img
            src={quote.imageUrl}
            alt="Cute Motivational Pet"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 right-2 bg-white/95 border border-slate-900 px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-800 shadow-[1px_1px_0px_0px_#000]">
            {quote.animalType === 'cat' ? '🐱 Cute Kitty Bestie' : '🐶 Good Vibes Pup'}
          </div>
        </div>

        {/* Quote and Subtitle */}
        <div className="text-center space-y-1.5 mb-5">
          <h3 className="text-lg font-black text-slate-900 leading-snug">{quote.quote}</h3>
          <p className="text-xs font-semibold text-slate-600">{quote.sub}</p>
        </div>

        {/* Action Button */}
        <button
          id="popup-action-btn"
          onClick={onClose}
          className="w-full bg-purple-300 hover:bg-purple-400 text-slate-900 border-2 border-slate-900 py-2.5 rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
        >
          Slay bestie! 💖 Got it ✨
        </button>
      </div>
    </div>
  );
};
