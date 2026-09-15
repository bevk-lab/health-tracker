import React, { useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile
} from '../firebase';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Cloud,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isLoggedIn,
  onSignOut
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMsg('Successfully signed in with Google! ☁️✨');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (tab === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        setSuccessMsg('Account created & synced to Cloud Firestore! 🎉');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg('Welcome back bestie! Your health cloud is loaded. ✨');
      }

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1200);
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. Please try again or use Quick Demo.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already in use. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInAnonymously(auth);
      setSuccessMsg('Signed in as Guest with Cloud Database active! ☁️✨');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } catch (err: any) {
      console.error('Anonymous Sign In Error:', err);
      setErrorMsg(err.message || 'Failed to start guest session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[8px_8px_0px_0px_#8b5cf6] relative animate-zoomIn space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-pink-300 hover:bg-pink-400 text-slate-900 border-2 border-slate-900 rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer active:scale-95 transition-transform"
        >
          <X size={18} />
        </button>

        {/* Header with GenZ Cloud Vibe */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-yellow-300 border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black text-slate-900 mb-2 shadow-[2px_2px_0px_0px_#000]">
            <Cloud size={14} className="text-purple-700" />
            <span>Cloud Database Sync ☁️</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isLoggedIn ? 'Your Cloud Health Account' : 'Sign In & Sync Data'}
          </h3>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            {isLoggedIn
              ? 'Your personal health telemetry & journals are synced in Cloud Firestore.'
              : 'Save vitals, appointments, emergency cards, and brain dumps safely to the cloud.'}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-3 text-xs font-bold text-red-900 flex items-start gap-2 animate-fadeIn">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-100 border-2 border-emerald-500 rounded-2xl p-3 text-xs font-black text-emerald-900 flex items-center gap-2 animate-fadeIn">
            <CheckCircle size={16} className="text-emerald-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* If Already Logged In: Show Profile Summary & Sign Out */}
        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="bg-purple-50 border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-900 overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-base text-slate-900">{currentUser?.fullName || 'Bestie'}</h4>
                    <span className="bg-emerald-200 border border-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500">{currentUser?.email || (currentUser?.isAnonymous ? 'Guest / Demo Cloud Account' : 'Authenticated User')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs font-bold">
                <div className="bg-white border border-slate-900 rounded-xl p-2">
                  <span className="text-[10px] text-slate-500 block">Streak</span>
                  <span className="font-black text-orange-600">🔥 {currentUser?.streak || 5} Days Fire</span>
                </div>
                <div className="bg-white border border-slate-900 rounded-xl p-2">
                  <span className="text-[10px] text-slate-500 block">Reward Pts</span>
                  <span className="font-black text-purple-700">🏆 {currentUser?.points || 60} PTS</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-400 p-2 rounded-xl">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Cloud Firestore Database is actively synchronizing.</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-900 border-2 border-slate-900 rounded-2xl font-black text-xs shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
            >
              Sign Out of Cloud Session 🚪
            </button>
          </div>
        ) : (
          /* Authentication Tabs & Forms */
          <div className="space-y-4">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 border-2 border-slate-900 rounded-2xl">
              <button
                type="button"
                onClick={() => setTab('signin')}
                className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('signup')}
                className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setTab('demo')}
                className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  tab === 'demo'
                    ? 'bg-yellow-300 text-slate-900 shadow-[2px_2px_0px_0px_#000]'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                1-Click ⚡
              </button>
            </div>

            {/* Tab 1 & 2: Email Password Form */}
            {tab !== 'demo' && (
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Your Full Name ✨</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Becky Lam"
                        className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl pl-8 pr-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required={tab === 'signup'}
                      />
                      <User size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Email Address ✉️</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="bestie@slayhealth.app"
                      className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl pl-8 pr-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />
                    <Mail size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Password 🔒</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl pl-8 pr-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                      minLength={6}
                    />
                    <Lock size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white border-2 border-slate-900 rounded-2xl font-black text-xs shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  <span>{loading ? 'Connecting Cloud...' : tab === 'signup' ? 'Create Cloud Account ✨' : 'Sign In to My Health 💅'}</span>
                </button>
              </form>
            )}

            {/* Tab 3: Quick Demo & Guest Cloud */}
            {tab === 'demo' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="bg-yellow-50 border-2 border-slate-900 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                    <Zap size={15} className="text-yellow-600" />
                    <span>Instant Cloud Guest Access</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Jump right into the app with a live cloud-backed guest session. All vitals, blood pressure trends, appointments, and journals will sync seamlessly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAnonymousSignIn}
                  disabled={loading}
                  className="w-full py-3 bg-yellow-300 hover:bg-yellow-400 text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-xs shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Zap size={15} />
                  <span>{loading ? 'Starting Cloud Session...' : 'Continue as Guest (Instant Sync) ⚡'}</span>
                </button>
              </div>
            )}

            {/* Social Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="flex-shrink mx-3 text-[10px] font-black uppercase text-slate-400">or sign in with</span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>

            {/* Google One-Click Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-xs shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.54 0 2.9.54 3.97 1.43l2.97-2.97C17.15 1.83 14.77 1 12 1 7.58 1 3.82 3.53 2.04 7.23l3.66 2.84C6.58 7.42 9.05 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.71-4.93 3.71-8.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.7 14.93c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L2.04 7.23C1.28 8.78.84 10.51.84 12.33s.44 3.55 1.2 5.1l3.66-2.5z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.66c3.24 0 5.95-1.08 7.93-2.92l-3.71-2.88c-1.07.72-2.44 1.16-4.22 1.16-3.23 0-5.96-2.18-6.94-5.12L1.4 16.74C3.18 20.47 6.94 23.66 12 23.66z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
