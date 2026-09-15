import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Heart, Zap, ArrowRight, UserCheck, Lock, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (provider: 'google' | 'facebook' | 'instagram' | 'email' | 'guest', userDetails?: { name: string; email: string; nickname: string; avatarUrl: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'social' | 'email'>('social');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('@becky_slay');
  const [fullName, setFullName] = useState('Becky Lam');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleProviderLogin = (provider: 'google' | 'facebook' | 'instagram' | 'guest') => {
    setIsLoading(provider);
    setTimeout(() => {
      let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
      let name = fullName;
      let handle = nickname;
      let userEmail = 'user@slayhealth.app';

      if (provider === 'google') {
        name = 'Becky Lam (Google)';
        userEmail = 'becky.lam@gmail.com';
        handle = '@becky_google';
      } else if (provider === 'facebook') {
        name = 'Becky Lam (FB)';
        userEmail = 'becky.facebook@fb.me';
        handle = '@becky_fb';
      } else if (provider === 'instagram') {
        name = 'Becky Slay ✨';
        userEmail = 'becky.insta@instagram.com';
        handle = '@becky_slay';
      } else if (provider === 'guest') {
        name = 'Slay Guest ✨';
        userEmail = 'guest@slayhealth.app';
        handle = '@slay_guest';
      }

      onLoginSuccess(provider, {
        name,
        email: userEmail,
        nickname: handle,
        avatarUrl: avatar
      });
      setIsLoading(null);
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading('email');
    setTimeout(() => {
      onLoginSuccess('email', {
        name: fullName || 'SlayHealth Member',
        email: email,
        nickname: nickname || '@slay_member',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
      });
      setIsLoading(null);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#fdf4ff] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Decorative Neo-Brutalist Background Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-300 rounded-3xl border-3 border-slate-900 rotate-12 shadow-[6px_6px_0px_0px_#0f172a] hidden md:flex items-center justify-center text-4xl">
        💅
      </div>
      <div className="absolute bottom-12 right-12 w-28 h-28 bg-pink-300 rounded-full border-3 border-slate-900 -rotate-6 shadow-[6px_6px_0px_0px_#0f172a] hidden md:flex items-center justify-center text-5xl">
        💖
      </div>
      <div className="absolute top-20 right-20 w-20 h-20 bg-emerald-300 rounded-2xl border-3 border-slate-900 rotate-45 shadow-[5px_5px_0px_0px_#0f172a] hidden lg:flex items-center justify-center text-3xl">
        🩺
      </div>
      <div className="absolute bottom-24 left-16 w-20 h-20 bg-purple-300 rounded-2xl border-3 border-slate-900 -rotate-12 shadow-[5px_5px_0px_0px_#0f172a] hidden lg:flex items-center justify-center text-3xl">
        🔥
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[10px_10px_0px_0px_#0f172a] relative z-10 animate-zoomIn">
        {/* Top Tag & Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-yellow-300 text-slate-900 border-2 border-slate-900 px-3.5 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-3">
            <Sparkles size={14} className="text-purple-700" />
            <span>Gen-Z Health & Squad Hub 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            SlayHealth <span className="text-pink-500">💅</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 max-w-xs mx-auto">
            Track daily vitals, sync with Cloud Firestore, cheer your squad, and chat with Gemini AI.
          </p>
        </div>

        {/* Tab Switcher: Social Login vs Direct */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-900 mb-6 shadow-[2px_2px_0px_0px_#000]">
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#000]'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            🚀 Social Sign-In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#000]'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            ✉️ Email / Custom
          </button>
        </div>

        {activeTab === 'social' ? (
          <div className="space-y-3.5">
            {/* 1. Google Login */}
            <button
              id="login-btn-google"
              type="button"
              disabled={!!isLoading}
              onClick={() => handleProviderLogin('google')}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-extrabold py-3.5 px-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-sm">
                {isLoading === 'google' ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>

            {/* 2. Facebook Login */}
            <button
              id="login-btn-facebook"
              type="button"
              disabled={!!isLoading}
              onClick={() => handleProviderLogin('facebook')}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold py-3.5 px-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm">
                {isLoading === 'facebook' ? 'Connecting to Facebook...' : 'Continue with Facebook'}
              </span>
            </button>

            {/* 3. Instagram Login */}
            <button
              id="login-btn-instagram"
              type="button"
              disabled={!!isLoading}
              onClick={() => handleProviderLogin('instagram')}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-95 text-white font-extrabold py-3.5 px-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="text-sm">
                {isLoading === 'instagram' ? 'Connecting to Instagram...' : 'Continue with Instagram'}
              </span>
            </button>

            {/* Fast Guest Mode Button */}
            <div className="pt-2">
              <button
                id="login-btn-guest"
                type="button"
                onClick={() => handleProviderLogin('guest')}
                className="w-full flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-black py-3 px-4 rounded-2xl border-3 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
              >
                <Zap size={16} className="text-purple-700" />
                <span className="text-xs sm:text-sm">Instant Guest Access (No Signup Needed) ⚡</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Your Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Becky Lam"
                required
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Squad Nickname (@handle)</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.startsWith('@') ? e.target.value : `@${e.target.value}`)}
                placeholder="@ltngen or @becky_slay"
                required
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@domain.com"
                required
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <button
              id="login-btn-email-submit"
              type="submit"
              disabled={!!isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3 px-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer text-sm"
            >
              {isLoading === 'email' ? 'Creating Slay Account...' : 'Enter SlayHealth Dashboard 🚀'}
            </button>
          </form>
        )}

        {/* Footer Security Badges */}
        <div className="mt-6 pt-4 border-t-2 border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" />
            HIPAA & Cloud Safe
          </span>
          <span className="flex items-center gap-1">
            <Heart size={14} className="text-pink-500 fill-pink-400" />
            100% Free Health Sync
          </span>
        </div>
      </div>
    </div>
  );
};
