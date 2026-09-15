import React from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, User, LogOut, Sparkles, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface SyncStatusBadgeProps {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isSyncing: boolean;
  lastSynced: Date | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  user,
  isLoggedIn,
  isSyncing,
  lastSynced,
  onOpenAuth,
  onSignOut
}) => {
  return (
    <div id="cloud-sync-status-bar" className="flex items-center gap-2">
      {/* Sync Status Chip */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-2xl border-2 border-slate-900 text-xs font-black shadow-[2px_2px_0px_0px_#000] ${
          isSyncing
            ? 'bg-amber-200 text-amber-900'
            : isLoggedIn
            ? 'bg-emerald-200 text-emerald-900'
            : 'bg-yellow-100 text-slate-800'
        }`}
        title={lastSynced ? `Last synchronized with Firestore at ${lastSynced.toLocaleTimeString()}` : 'Cloud sync status'}
      >
        {isSyncing ? (
          <>
            <RefreshCw size={13} className="animate-spin text-amber-800" />
            <span className="hidden sm:inline">Syncing Cloud...</span>
            <span className="sm:hidden">Syncing</span>
          </>
        ) : isLoggedIn ? (
          <>
            <Cloud size={13} className="text-emerald-800" />
            <span className="hidden sm:inline">Cloud Synced ☁️</span>
            <span className="sm:hidden">Synced</span>
          </>
        ) : (
          <>
            <CloudOff size={13} className="text-slate-600" />
            <span className="hidden sm:inline">Local / Guest 💾</span>
            <span className="sm:hidden">Guest</span>
          </>
        )}
      </div>

      {/* Account / Login Trigger Button */}
      {isLoggedIn ? (
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 border-2 border-slate-900 px-2.5 py-1 rounded-2xl text-xs font-black text-purple-950 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="View Account Details"
          >
            <User size={13} className="text-purple-700" />
            <span className="max-w-[100px] truncate">{user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'My Era'}</span>
          </button>

          <button
            onClick={onSignOut}
            className="p-1 bg-white hover:bg-red-100 text-slate-700 hover:text-red-700 border-2 border-slate-900 rounded-xl shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 border-2 border-slate-900 px-3 py-1 rounded-2xl text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          title="Sign in to sync your health data securely in Cloud Firestore"
        >
          <Sparkles size={13} className="text-purple-900" />
          <span>Sign In / Sync ☁️</span>
        </button>
      )}
    </div>
  );
};
