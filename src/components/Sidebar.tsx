import React from 'react';
import { PageType, UserProfile } from '../types';
import {
  X,
  Home,
  PlusCircle,
  TrendingUp,
  Calendar as CalendarIcon,
  BookOpen,
  User,
  Sparkles,
  Flame,
  Award,
  ShieldAlert,
  ChevronRight,
  Cloud,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  user: UserProfile;
  points: number;
  streak: number;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  user,
  points,
  streak,
  isLoggedIn = false,
  onOpenAuth,
  onSignOut
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      id: 'home' as PageType,
      label: 'Home / Dashboard',
      subtitle: 'Main hub & rewards',
      emoji: '🏠',
      color: 'hover:bg-yellow-100',
      activeBg: 'bg-yellow-300'
    },
    {
      id: 'input' as PageType,
      label: 'Input Metrics',
      subtitle: 'Log vitals & lifestyle',
      emoji: '🩺',
      color: 'hover:bg-emerald-100',
      activeBg: 'bg-emerald-300'
    },
    {
      id: 'analytics' as PageType,
      label: 'Health Tea 📈',
      subtitle: 'Trends & anomaly tea',
      emoji: '🧋',
      color: 'hover:bg-pink-100',
      activeBg: 'bg-pink-300'
    },
    {
      id: 'calendar' as PageType,
      label: 'Doctor Sheshes',
      subtitle: 'Appointments calendar',
      emoji: '🗓️',
      color: 'hover:bg-blue-100',
      activeBg: 'bg-blue-300'
    },
    {
      id: 'diary' as PageType,
      label: 'Brain Dump',
      subtitle: 'Mental journal & vents',
      emoji: '🧠',
      color: 'hover:bg-purple-100',
      activeBg: 'bg-purple-300'
    },
    {
      id: 'social' as PageType,
      label: 'Social & Squad 👥',
      subtitle: 'Leaderboard, duels & QR',
      emoji: '👥',
      color: 'hover:bg-pink-100',
      activeBg: 'bg-pink-300'
    },
    {
      id: 'profile' as PageType,
      label: 'My Era / Profile',
      subtitle: 'Bio, contact & allergies',
      emoji: '💅',
      color: 'hover:bg-orange-100',
      activeBg: 'bg-orange-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        id="collapsible-sidebar"
        className="relative w-80 max-w-[85vw] bg-[#fdf4ff] border-r-4 border-slate-900 h-full flex flex-col justify-between p-5 shadow-[8px_0px_0px_0px_#0f172a] z-10 overflow-y-auto animate-slideInLeft"
      >
        <div>
          {/* Header & Close Button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-400 to-yellow-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-xl overflow-hidden">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-black text-base text-slate-900 tracking-tight">SlayHealth</h3>
                  <span className="text-[10px] bg-yellow-300 border border-slate-900 px-1 py-0.2 rounded-full font-black">
                    GenZ
                  </span>
                </div>
                <p className="text-xs font-bold text-purple-700 truncate max-w-[150px]">{user.fullName}</p>
              </div>
            </div>

            <button
              id="sidebar-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white hover:bg-pink-200 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black cursor-pointer active:translate-y-0.5"
              title="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Gamification Snippet in Sidebar */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-3 shadow-[3px_3px_0px_0px_#000] mb-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-1 text-slate-700">
                <Flame size={15} className="text-orange-500 fill-orange-400" />
                Streak: {streak} Days
              </span>
              <span className="flex items-center gap-1 text-purple-700 bg-purple-100 border border-slate-900 px-2 py-0.5 rounded-full">
                <Award size={13} />
                {points} PTS
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              Target: 100 pts for Panadol & Cute Band-aids 🩹
            </div>
          </div>

          {/* Cloud Account / Auth Banner */}
          <div className="mb-4">
            {isLoggedIn ? (
              <div className="bg-emerald-50 border-2 border-slate-900 rounded-2xl p-2.5 flex items-center justify-between text-xs font-bold shadow-[2px_2px_0px_0px_#000]">
                <div className="flex items-center gap-2">
                  <Cloud size={16} className="text-emerald-700" />
                  <div>
                    <div className="text-emerald-950 font-black text-[11px]">Cloud Synced ☁️</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{user.email || 'Active Account'}</div>
                  </div>
                </div>
                {onOpenAuth && (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      onClose();
                    }}
                    className="text-[10px] font-black text-purple-700 bg-white border border-slate-900 px-2 py-1 rounded-lg hover:bg-purple-50 cursor-pointer"
                  >
                    Manage
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth();
                  onClose();
                }}
                className="w-full bg-yellow-300 hover:bg-yellow-400 border-2 border-slate-900 rounded-2xl p-2.5 flex items-center justify-between text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-purple-700" />
                  <span>Connect Cloud Database ☁️</span>
                </div>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1">
              Select Destination 🧭
            </p>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 border-slate-900 font-black text-sm transition-all cursor-pointer text-left ${
                    isActive
                      ? `${item.activeBg} text-slate-900 shadow-[3px_3px_0px_0px_#000] translate-x-1`
                      : `bg-white text-slate-800 ${item.color} shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5`
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <div className="font-extrabold text-sm">{item.label}</div>
                      <div className="text-[10px] font-semibold text-slate-500">{item.subtitle}</div>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${isActive ? 'rotate-90 text-slate-900' : 'text-slate-400'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 mt-4 border-t-2 border-slate-900/20 text-center space-y-2">
          {onSignOut && (
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-red-50 text-red-600 font-black py-2 rounded-xl border-2 border-slate-900 text-xs shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all"
            >
              <LogOut size={13} /> Switch Account / Log Out
            </button>
          )}
          <div className="bg-yellow-200 border-2 border-slate-900 rounded-xl p-2 text-[11px] font-black text-slate-800 shadow-[2px_2px_0px_0px_#000]">
            ⚡ Stay Hydrated & Slay 💅
          </div>
          <p className="text-[10px] font-bold text-slate-500">SlayHealth Cloud Sync v2.0</p>
        </div>
      </aside>
    </div>
  );
};
