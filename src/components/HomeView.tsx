import React from 'react';
import { PageType, UserProfile, VitalsRecord, Appointment } from '../types';
import {
  Flame,
  Award,
  Gift,
  Stethoscope,
  MapPin,
  ArrowRight,
  TrendingUp,
  Activity,
  Droplets,
  Thermometer,
  Zap,
  Clock,
  Sparkles,
  Cloud
} from 'lucide-react';

interface HomeViewProps {
  user: UserProfile;
  vitals: VitalsRecord[];
  appointments: Appointment[];
  points: number;
  streak: number;
  hasCheckedInToday: boolean;
  claimedRewards: string[];
  onCheckIn: () => void;
  onRedeemReward: (reward: string, cost: number) => void;
  onNavigate: (page: PageType) => void;
  onOpenAuth?: () => void;
  isLoggedIn?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  vitals,
  appointments,
  points,
  streak,
  hasCheckedInToday,
  claimedRewards,
  onCheckIn,
  onRedeemReward,
  onNavigate,
  onOpenAuth,
  isLoggedIn = false
}) => {
  // Latest recorded vitals or safe default
  const latestVitals = vitals[vitals.length - 1] || {
    sys: 120,
    dia: 80,
    pulse: 72,
    spo2: 99,
    bloodSugar: 95,
    temperature: 36.6,
    date: 'Today',
    time: '08:00',
    tag: 'Normal Vibe',
    isAbnormal: false,
    anomalyReasons: []
  };

  // Find most upcoming appointment
  const nextAppointment = React.useMemo(() => {
    if (!appointments || appointments.length === 0) return null;
    const sorted = [...appointments].sort(
      (a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    );
    return sorted[0];
  }, [appointments]);

  // Evaluate individual metric statuses for quick status checks (Normal vs Warning)
  const isBpWarning = latestVitals.sys > 140 || latestVitals.sys < 90 || latestVitals.dia > 90 || latestVitals.dia < 60;
  const isPulseWarning = latestVitals.pulse > 100 || latestVitals.pulse < 60;
  const isSpo2Warning = latestVitals.spo2 < 95;
  const isSugarWarning = latestVitals.bloodSugar > 130 || latestVitals.bloodSugar < 70;
  const isTempWarning = latestVitals.temperature > 38.0;

  return (
    <div id="view-home" className="space-y-6 animate-fadeIn">
      {/* Welcome Banner with GenZ greeting & Cloud indicator */}
      <div className="bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-100 border-3 border-slate-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#0f172a] relative overflow-hidden">
        <div className="absolute -top-2 -right-2 text-5xl opacity-40 animate-pulse pointer-events-none select-none">
          ✨👑💖
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 bg-white border-2 border-slate-900 px-3 py-0.5 rounded-full text-xs font-black text-purple-700 shadow-[2px_2px_0px_0px_#000]">
                <Flame size={14} className="text-orange-500 fill-orange-400" />
                <span>Streak: {streak} Days On Fire!</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-emerald-200 border-2 border-slate-900 px-2.5 py-0.5 rounded-full text-[11px] font-black text-emerald-950 shadow-[1.5px_1.5px_0px_0px_#000]">
                <Cloud size={12} className="text-emerald-800" />
                <span>Cloud Synced Database</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Hey {user.fullName?.split(' ')[0] || 'Bestie'}, slay today! ✨
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-1 max-w-xl">
              Keep your body balanced, hydrate often, and log your tea & vitals to sync directly with Cloud Firestore and claim cute rewards!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="home-squad-btn"
              onClick={() => onNavigate('social')}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white border-2 border-slate-900 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>👥 Squad &amp; Duels</span>
            </button>
            <button
              id="home-quick-log-btn"
              onClick={() => onNavigate('input')}
              className="flex items-center gap-1.5 bg-yellow-300 hover:bg-yellow-400 text-slate-900 border-2 border-slate-900 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>⚡ Log Vitals</span>
            </button>
            <button
              id="home-tea-btn"
              onClick={() => onNavigate('analytics')}
              className="flex items-center gap-1.5 bg-pink-300 hover:bg-pink-400 text-slate-900 border-2 border-slate-900 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>🧋 Health Tea</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: Row 1 (Rewards Card & Next Appointment) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Rewards Card (Span 7) */}
        <div
          id="rewards-card"
          className="md:col-span-7 bg-[#ecfdf5] border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h2 className="text-lg font-black text-slate-900">Gamified Glow Rewards</h2>
              </div>

              {/* Animated cheering icon/sticker */}
              <div className="flex items-center gap-1.5 bg-yellow-300 border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] animate-bounce">
                <span className="text-lg animate-spin" style={{ animationDuration: '3s' }}>🎉</span>
                <span>{points} PTS</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-600 mb-3">
              Earn +20 pts daily for logging vitals & brain dump journals. Auto-persisted to your cloud profile!
            </p>

            {/* Progress Bar towards 100 pts */}
            <div
              id="goal-100pts-card"
              onClick={() => onRedeemReward('Panadol / Band-aids Pack 🩹', 100)}
              className="bg-white hover:bg-yellow-50/60 border-2 border-slate-900 rounded-2xl p-3.5 shadow-[2px_2px_0px_0px_#000] mb-4 cursor-pointer transition-all active:translate-y-0.5 group"
              title="Click to view 100 PTS Prize & Shipping details"
            >
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="group-hover:scale-110 transition-transform">🎯</span>
                  <span className="font-black">Goal: 100 pts</span>
                  <span className="text-[11px] font-extrabold text-purple-700">(Panadol / Cute Band-aids 🩹)</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full border border-slate-900 text-[10px] font-black shadow-[1px_1px_0px_0px_#000] ${
                  points >= 100
                    ? 'bg-yellow-300 text-slate-900 animate-pulse'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {points >= 100 ? 'CLAIM READY 🎁' : `${Math.min(points, 100)} / 100 pts`}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-4 rounded-full border-2 border-slate-900 overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-teal-300 to-yellow-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (points / 100) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-extrabold text-slate-500 mt-1.5">
                <span>0 pts: Newbie 🐣</span>
                <span>50 pts: Matcha Latte 🍵</span>
                <span className="text-purple-700 font-black">100 pts: Panadol Pack 🩹 (Tap to Claim)</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-slate-900/20">
            <button
              id="daily-checkin-btn"
              onClick={onCheckIn}
              disabled={hasCheckedInToday}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-black text-xs border-2 border-slate-900 transition-all cursor-pointer ${
                hasCheckedInToday
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-300 hover:bg-emerald-400 text-slate-900 shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5'
              }`}
            >
              <span>{hasCheckedInToday ? '✅ Claimed for Today' : '✨ Daily Check-in (+20 pts)'}</span>
            </button>

            <button
              id="redeem-100-btn"
              onClick={() => onRedeemReward('Panadol / Band-aids Pack 🩹', 100)}
              className={`flex items-center gap-1.5 py-2.5 px-3 rounded-2xl font-black text-xs border-2 border-slate-900 transition-all cursor-pointer ${
                claimedRewards && (claimedRewards.includes('Panadol / Band-aids Pack 🩹') || claimedRewards.includes('Panadol & Cute Band-aids Pack 🩹'))
                  ? 'bg-purple-200 hover:bg-purple-300 text-purple-900 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                  : points >= 100
                  ? 'bg-yellow-300 hover:bg-yellow-400 text-slate-900 shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                  : 'bg-slate-100 hover:bg-yellow-100 text-slate-700 border-slate-300 shadow-[1.5px_1.5px_0px_0px_#000]'
              }`}
            >
              <Gift size={14} className={points >= 100 ? 'text-purple-700 animate-bounce' : ''} />
              <span>
                {claimedRewards && (claimedRewards.includes('Panadol / Band-aids Pack 🩹') || claimedRewards.includes('Panadol & Cute Band-aids Pack 🩹'))
                  ? 'View Claimed Prize 🎁'
                  : points >= 100
                  ? '🎉 Claim 100pts Goal!'
                  : 'Goal 100pts (Preview)'}
              </span>
            </button>
          </div>
        </div>

        {/* Next Appointment Reminder Widget (Span 5) */}
        <div
          id="next-appointment-widget"
          className="md:col-span-5 bg-[#fff7ed] border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🗓️</span>
                <h2 className="text-lg font-black text-slate-900">Next Doctor Sesh</h2>
              </div>
              <span className="bg-orange-300 border-2 border-slate-900 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]">
                REMINDER
              </span>
            </div>

            {nextAppointment ? (
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Stethoscope size={16} className="text-orange-600" />
                    {nextAppointment.doctorName}
                  </span>
                  <span className="text-[11px] font-bold bg-pink-100 border border-slate-900 text-pink-700 px-2 py-0.5 rounded-full">
                    {nextAppointment.time}
                  </span>
                </div>
                {nextAppointment.specialty && (
                  <p className="text-xs font-semibold text-purple-700">{nextAppointment.specialty}</p>
                )}
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                  <MapPin size={13} className="text-slate-400" />
                  <span className="truncate">{nextAppointment.location}</span>
                </div>
                <div className="text-[11px] bg-orange-50 border border-orange-200 rounded-xl p-2 font-medium text-slate-700 flex justify-between items-center">
                  <span>🗓️ <strong>Date:</strong> {nextAppointment.date}</span>
                  <span className="text-[10px] font-bold text-orange-800 bg-orange-200 px-1.5 py-0.5 rounded-md">
                    Upcoming
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-400 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-slate-500">No appointments booked bestie! 🧘‍♀️</p>
                <p className="text-[11px] text-slate-400 mt-1">Book your doctor visits in the Calendar tab.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('calendar')}
            className="mt-3 w-full bg-orange-300 hover:bg-orange-400 text-slate-900 border-2 border-slate-900 py-2 rounded-2xl font-black text-xs shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all"
          >
            <span>Manage All Appointments</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Bento Grid: Row 2 (Quick Vitals & Status - 5 Metrics) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💖</span>
            <h2 className="text-lg font-black text-slate-900">Latest Vitals & Status Check</h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-900 px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]">
            Logged: {latestVitals.date} {latestVitals.time}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Metric 1: Blood Pressure */}
          <div className="bg-[#fef9c3] border-3 border-slate-900 rounded-3xl p-4 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700">
                Blood Pressure
              </span>
              <span className="text-xl">🩺</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {latestVitals.sys}/{latestVitals.dia}
                </span>
                <span className="text-[10px] font-bold text-slate-500">mmHg</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000] ${
                  isBpWarning ? 'bg-red-400 text-white' : 'bg-emerald-300 text-slate-900'
                }`}
              >
                {isBpWarning ? '⚠️ Warning' : '✅ Normal'}
              </span>
            </div>
          </div>

          {/* Metric 2: Pulse Rate */}
          <div className="bg-[#fee2e2] border-3 border-slate-900 rounded-3xl p-4 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700">
                Pulse Rate
              </span>
              <span className="text-xl">💓</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{latestVitals.pulse}</span>
                <span className="text-[10px] font-bold text-slate-500">BPM</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000] ${
                  isPulseWarning ? 'bg-red-400 text-white' : 'bg-emerald-300 text-slate-900'
                }`}
              >
                {isPulseWarning ? '⚠️ Warning' : '✅ Normal'}
              </span>
            </div>
          </div>

          {/* Metric 3: Oxygen SpO2 */}
          <div className="bg-[#e0f2fe] border-3 border-slate-900 rounded-3xl p-4 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700">
                SpO2 Oxygen
              </span>
              <span className="text-xl">🫁</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{latestVitals.spo2}</span>
                <span className="text-[10px] font-bold text-slate-500">%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000] ${
                  isSpo2Warning ? 'bg-red-400 text-white' : 'bg-emerald-300 text-slate-900'
                }`}
              >
                {isSpo2Warning ? '⚠️ Warning' : '✅ Normal'}
              </span>
            </div>
          </div>

          {/* Metric 4: Blood Sugar */}
          <div className="bg-[#dcfce7] border-3 border-slate-900 rounded-3xl p-4 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700">
                Blood Sugar
              </span>
              <span className="text-xl">🩸</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{latestVitals.bloodSugar}</span>
                <span className="text-[10px] font-bold text-slate-500">mg/dL</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000] ${
                  isSugarWarning ? 'bg-red-400 text-white' : 'bg-emerald-300 text-slate-900'
                }`}
              >
                {isSugarWarning ? '⚠️ Warning' : '✅ Normal'}
              </span>
            </div>
          </div>

          {/* Metric 5: Body Temperature */}
          <div className="col-span-2 sm:col-span-1 bg-[#fae8ff] border-3 border-slate-900 rounded-3xl p-4 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700">
                Body Temp
              </span>
              <span className="text-xl">🌡️</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {latestVitals.temperature}
                </span>
                <span className="text-[10px] font-bold text-slate-500">°C</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000] ${
                  isTempWarning ? 'bg-red-400 text-white' : 'bg-emerald-300 text-slate-900'
                }`}
              >
                {isTempWarning ? '⚠️ Fever' : '✅ Normal'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
