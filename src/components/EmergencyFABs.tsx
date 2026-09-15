import React, { useState } from 'react';
import { UserProfile, RecentCallContact, VitalsRecord } from '../types';
import {
  PhoneCall,
  ShieldAlert,
  X,
  HeartHandshake,
  Sparkles,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  UserPlus,
  Bot,
  ExternalLink
} from 'lucide-react';
import { GeminiChatDrawer } from './GeminiChatDrawer';
import { INITIAL_RECENT_CALLS } from '../mockData';

interface EmergencyFABsProps {
  user: UserProfile;
  latestVitals?: VitalsRecord | null;
}

export const EmergencyFABs: React.FC<EmergencyFABsProps> = ({ user, latestVitals }) => {
  const [isRecentCallsOpen, setIsRecentCallsOpen] = useState<boolean>(false);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState<boolean>(false);
  const [recentCalls, setRecentCalls] = useState<RecentCallContact[]>(INITIAL_RECENT_CALLS);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const triggerCallNotification = (name: string) => {
    setCopiedNotification(`📞 Connecting to ${name}...`);
    setTimeout(() => {
      setCopiedNotification(null);
    }, 2500);
  };

  return (
    <>
      {/* Persistent Floating Action Area (Bottom-Right Cluster) */}
      <div
        id="emergency-fabs-cluster"
        className="fixed bottom-4 right-4 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5"
      >
        {/* Button 3: Chat with Gemini AI (Gradient Blue/Purple) */}
        <button
          id="fab-gemini-chat-btn"
          onClick={() => setIsGeminiChatOpen(true)}
          className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black px-4 py-2.5 rounded-full border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Open Gemini Health AI Chatbot"
        >
          <Sparkles size={16} className="text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs sm:text-sm tracking-wide">Chat with Gemini 🤖✨</span>
        </button>

        {/* Button 2: Call Family / Recent Contacts (Orange/Yellow) */}
        <button
          id="fab-call-contact-btn"
          onClick={() => setIsRecentCallsOpen(true)}
          className="group flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-black px-3.5 py-2.5 rounded-full border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="View Family & Recently Called Contacts"
        >
          <span className="text-base">📞</span>
          <span className="text-xs sm:text-sm tracking-tight">Family Contacts</span>
        </button>

        {/* Button 1: Emergency 115 (Red Link for Native Phone Dialer) */}
        <a
          id="fab-emergency-115-link"
          href="tel:115"
          onClick={() => triggerCallNotification('National Emergency 115')}
          className="group relative flex items-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white font-black px-4 py-2.5 rounded-full border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Direct Dial Emergency 115 Ambulance"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <ShieldAlert size={17} className="animate-bounce" />
          <span className="text-xs sm:text-sm tracking-wide">Emergency 115 🚨</span>
        </a>
      </div>

      {/* Floating Call Notification Toast */}
      {copiedNotification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white font-black text-xs px-4 py-2.5 rounded-2xl border-2 border-yellow-300 shadow-[4px_4px_0px_0px_#f59e0b] animate-bounce">
          {copiedNotification}
        </div>
      )}

      {/* ================= MODAL: RECENTLY CALLED CONTACTS ================= */}
      {isRecentCallsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#fffbeb] border-4 border-slate-900 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-[8px_8px_0px_0px_#f97316] relative animate-zoomIn max-h-[90vh] flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setIsRecentCallsOpen(false)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-white hover:bg-orange-100 text-slate-900 border-2 border-slate-900 rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-2.5 mb-2 text-orange-600">
              <div className="w-9 h-9 rounded-2xl bg-orange-100 border-2 border-slate-900 flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
                📞
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-900">
                  Recently Called & Family Contacts
                </h3>
                <p className="text-xs font-bold text-slate-600">
                  Tap any contact to start a phone call immediately
                </p>
              </div>
            </div>

            {/* Primary Emergency Contact Card */}
            <div className="bg-orange-100 border-3 border-slate-900 rounded-2xl p-3.5 mb-3 shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-pink-300 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000]">
                  💖
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-50 border border-pink-300 px-1.5 py-0.5 rounded-md">
                    {user.emergencyContact?.relationship || 'Primary Emergency Person'}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {user.emergencyContact?.name || 'Thao Lam (Mom)'}
                  </h4>
                  <p className="text-xs font-bold text-slate-600">
                    {user.emergencyContact?.phone || '+84 91 999 8888'}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${(user.emergencyContact?.phone || '+84919998888').replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-3.5 py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 cursor-pointer"
              >
                <PhoneCall size={14} /> Call Now
              </a>
            </div>

            {/* List of Recently Called Contacts */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-4">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-1 flex items-center justify-between">
                <span>Recent Call History (Mock List)</span>
                <span className="text-[10px] text-slate-400 font-bold">{recentCalls.length} logs</span>
              </div>

              {recentCalls.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white border-2 border-slate-900 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {contact.avatarUrl ? (
                      <img
                        src={contact.avatarUrl}
                        alt={contact.name}
                        className="w-10 h-10 rounded-xl border-2 border-slate-900 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-purple-200 border-2 border-slate-900 flex items-center justify-center font-black text-sm">
                        {contact.name.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {contact.name}
                        </span>
                        {contact.nickname && (
                          <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-1 rounded border border-purple-200">
                            {contact.nickname}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mt-0.5">
                        <span className="flex items-center gap-0.5 text-slate-700">
                          {contact.callType === 'incoming' && (
                            <PhoneIncoming size={11} className="text-emerald-600" />
                          )}
                          {contact.callType === 'outgoing' && (
                            <PhoneOutgoing size={11} className="text-blue-600" />
                          )}
                          {contact.callType === 'missed' && (
                            <PhoneMissed size={11} className="text-red-500" />
                          )}
                          {contact.timeAgo}
                        </span>
                        {contact.duration && (
                          <>
                            <span>•</span>
                            <span>{contact.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Direct Call Button */}
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="shrink-0 inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-3 py-2 rounded-xl border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer"
                  >
                    <PhoneCall size={13} />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Dismiss Footer */}
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <a
                href="tel:115"
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-center py-2.5 rounded-xl border-2 border-slate-900 font-black text-xs shadow-[2px_2px_0px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldAlert size={14} /> National Ambulance 115
              </a>
              <button
                onClick={() => setIsRecentCallsOpen(false)}
                className="bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 px-5 py-2.5 rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SLIDE-UP GEMINI CHAT DRAWER ================= */}
      <GeminiChatDrawer
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
        user={user}
        latestVitals={latestVitals}
      />
    </>
  );
};
