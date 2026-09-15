import React, { useState, useEffect } from 'react';
import { UserProfile, PersonalGoals, calculateAge } from '../types';
import {
  User,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  Camera,
  CheckCircle,
  Phone,
  Calendar,
  MapPin,
  Smile,
  Target,
  Droplets,
  Footprints,
  Moon,
  Plus,
  Minus,
  RotateCcw,
  Sliders,
  Award,
  Flame,
  Check,
  Zap,
  Clock,
  ArrowRight,
  Cloud,
  Bell,
  Volume2,
  AlertCircle,
  Gift,
  Truck,
  Package
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  onTriggerTestNotification?: () => void;
  onOpenPrizeModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  isLoggedIn = false,
  onOpenAuth,
  onTriggerTestNotification,
  onOpenPrizeModal
}) => {
  const [fullName, setFullName] = useState(user.fullName || 'Becky Lam');
  const [phone, setPhone] = useState(user.phone || '+84 90 123 4567');
  const [dob, setDob] = useState(user.dob || '2004-02-14');
  const [gender, setGender] = useState(user.gender || 'Female 🌸');
  const [address, setAddress] = useState(user.address || '123 Nguyen Hue Blvd, District 1');
  const [avatarUrl, setAvatarUrl] = useState(
    user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );

  // Hourly Notification Reminder State
  const [hourlyNotificationEnabled, setHourlyNotificationEnabled] = useState<boolean>(
    user.hourlyNotificationEnabled ?? true
  );
  const [notificationIntervalHours, setNotificationIntervalHours] = useState<number>(
    user.notificationIntervalHours ?? 1
  );
  const [browserPermission, setBrowserPermission] = useState<string>('default');

  // Check browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    } else {
      setBrowserPermission('unsupported');
    }
  }, []);

  // Sync state if user changes (e.g. from cloud login)
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || 'Becky Lam');
      setPhone(user.phone || '+84 90 123 4567');
      setDob(user.dob || '2004-02-14');
      setGender(user.gender || 'Female 🌸');
      setAddress(user.address || '123 Nguyen Hue Blvd, District 1');
      setAvatarUrl(user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
      if (user.hourlyNotificationEnabled !== undefined) {
        setHourlyNotificationEnabled(user.hourlyNotificationEnabled);
      }
      if (user.notificationIntervalHours !== undefined) {
        setNotificationIntervalHours(user.notificationIntervalHours);
      }
      if (user.emergencyContact) {
        setEmergencyName(user.emergencyContact.name || 'Thao Lam (Mom)');
        setEmergencyRelationship(user.emergencyContact.relationship || 'Mother 💖');
        setEmergencyPhone(user.emergencyContact.phone || '+84 91 999 8888');
      }
      if (user.knownAllergies) {
        setMedicationAllergies(user.knownAllergies.medications || 'Penicillin (Causes hives/rash)');
        setFoodAllergies(user.knownAllergies.food || 'Shellfish (Shrimp, Crab - mild itch)');
        setDrinkAllergies(user.knownAllergies.drinks || 'Excessive high-caffeine energy drinks');
      }
      if (user.goals) {
        setGoals(user.goals);
      }
    }
  }, [user]);

  // Personal Goals State
  const defaultGoals: PersonalGoals = {
    waterTarget: 2500,
    waterCurrent: 1750,
    stepsTarget: 10000,
    stepsCurrent: 7200,
    sleepTarget: 8.0,
    sleepCurrent: 7.5
  };

  const [goals, setGoals] = useState<PersonalGoals>(user.goals || defaultGoals);
  const [isEditingTargets, setIsEditingTargets] = useState(false);

  // Emergency contact fields
  const [emergencyName, setEmergencyName] = useState(user.emergencyContact?.name || 'Thao Lam (Mom)');
  const [emergencyRelationship, setEmergencyRelationship] = useState(user.emergencyContact?.relationship || 'Mother 💖');
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContact?.phone || '+84 91 999 8888');

  // Known allergies fields
  const [medicationAllergies, setMedicationAllergies] = useState(user.knownAllergies?.medications || 'Penicillin (Causes hives/rash)');
  const [foodAllergies, setFoodAllergies] = useState(user.knownAllergies?.food || 'Shellfish (Shrimp, Crab - mild itch)');
  const [drinkAllergies, setDrinkAllergies] = useState(user.knownAllergies?.drinks || 'Excessive high-caffeine energy drinks');

  const [isSaved, setIsSaved] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // Dynamic Age calculation
  const computedAge = calculateAge(dob);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
  ];

  // Goals Handlers
  const handleUpdateGoals = (partial: Partial<PersonalGoals>) => {
    const updatedGoals = { ...goals, ...partial };
    setGoals(updatedGoals);
    const updatedProfile: UserProfile = {
      ...user,
      fullName,
      phone,
      dob,
      gender,
      address,
      avatarUrl,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelationship,
        phone: emergencyPhone
      },
      knownAllergies: {
        medications: medicationAllergies,
        food: foodAllergies,
        drinks: drinkAllergies
      },
      goals: updatedGoals
    };
    onUpdateProfile(updatedProfile);
  };

  const handleWaterIncrement = (amount: number) => {
    const nextVal = Math.max(0, goals.waterCurrent + amount);
    handleUpdateGoals({ waterCurrent: nextVal });
  };

  const handleStepsIncrement = (amount: number) => {
    const nextVal = Math.max(0, goals.stepsCurrent + amount);
    handleUpdateGoals({ stepsCurrent: nextVal });
  };

  const handleSleepIncrement = (amount: number) => {
    const nextVal = Math.max(0, Math.round((goals.sleepCurrent + amount) * 10) / 10);
    handleUpdateGoals({ sleepCurrent: nextVal });
  };

  // Progress Percentages
  const waterPct = Math.min(150, Math.round((goals.waterCurrent / (goals.waterTarget || 1)) * 100));
  const stepsPct = Math.min(150, Math.round((goals.stepsCurrent / (goals.stepsTarget || 1)) * 100));
  const sleepPct = Math.min(150, Math.round((goals.sleepCurrent / (goals.sleepTarget || 1)) * 100));

  const averageDailyScore = Math.round(
    (Math.min(100, waterPct) + Math.min(100, stepsPct) + Math.min(100, sleepPct)) / 3
  );

  const completedGoalsCount = [waterPct >= 100, stepsPct >= 100, sleepPct >= 100].filter(Boolean).length;

  const handleToggleHourlyNotification = async (enabled: boolean) => {
    setHourlyNotificationEnabled(enabled);

    if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          const perm = await Notification.requestPermission();
          setBrowserPermission(perm);
        } catch (e) {
          console.log('Permission request handled');
        }
      } else {
        setBrowserPermission(Notification.permission);
      }
    }

    const updated: UserProfile = {
      ...user,
      fullName,
      phone,
      dob,
      gender,
      address,
      avatarUrl,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelationship,
        phone: emergencyPhone
      },
      knownAllergies: {
        medications: medicationAllergies,
        food: foodAllergies,
        drinks: drinkAllergies
      },
      goals,
      hourlyNotificationEnabled: enabled,
      notificationIntervalHours
    };
    onUpdateProfile(updated);
  };

  const handleIntervalChange = (hours: number) => {
    setNotificationIntervalHours(hours);
    const updated: UserProfile = {
      ...user,
      fullName,
      phone,
      dob,
      gender,
      address,
      avatarUrl,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelationship,
        phone: emergencyPhone
      },
      knownAllergies: {
        medications: medicationAllergies,
        food: foodAllergies,
        drinks: drinkAllergies
      },
      goals,
      hourlyNotificationEnabled,
      notificationIntervalHours: hours
    };
    onUpdateProfile(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      fullName,
      phone,
      dob,
      gender,
      address,
      avatarUrl,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelationship,
        phone: emergencyPhone
      },
      knownAllergies: {
        medications: medicationAllergies,
        food: foodAllergies,
        drinks: drinkAllergies
      },
      goals,
      hourlyNotificationEnabled,
      notificationIntervalHours
    };

    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div id="view-profile" className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#fed7aa] border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
        <div>
          <div className="inline-block bg-white border-2 border-slate-900 px-2.5 py-0.5 rounded-full text-xs font-black text-orange-900 mb-1 shadow-[1px_1px_0px_0px_#000]">
            PAGE 6: PROFILE, GOALS &amp; EMERGENCY CARD 🪪💅
          </div>
          <h2 className="text-2xl font-black text-slate-900">My Era / Patient Profile</h2>
          <p className="text-xs font-semibold text-slate-700">
            Set daily health goals, keep your vital contacts, and manage allergy records synced in Cloud Firestore.
          </p>
        </div>
        <span className="text-4xl">👑💖✨</span>
      </div>

      {isSaved && (
        <div className="bg-emerald-100 border-2 border-emerald-500 rounded-2xl p-4 text-xs font-black text-emerald-900 flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] animate-fadeIn">
          <CheckCircle size={18} />
          <span>Profile, Goals, and Emergency settings synced to Cloud Database! 💅✨</span>
        </div>
      )}

      {/* Cloud Sync Status Header Banner */}
      <div className="bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 border-2 border-slate-900 flex items-center justify-center text-purple-700 shadow-[1px_1px_0px_0px_#000]">
            <Cloud size={18} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span>Cloud Firestore Database Status:</span>
              <span className={`px-2 py-0.2 rounded-full border border-slate-900 text-[10px] ${
                isLoggedIn ? 'bg-emerald-200 text-emerald-900' : 'bg-yellow-200 text-yellow-900'
              }`}>
                {isLoggedIn ? 'Live Connected ☁️' : 'Guest / Local Mode 💾'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              {isLoggedIn ? `Authenticated as ${user.email || user.fullName}` : 'Sign in to access your records across any browser or device.'}
            </p>
          </div>
        </div>

        {onOpenAuth && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="self-start sm:self-auto bg-purple-600 hover:bg-purple-700 text-white border-2 border-slate-900 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
          >
            {isLoggedIn ? 'Manage Account ⚙️' : 'Sign In / Connect ☁️'}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= 1. PERSONAL INFORMATION ================= */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-900">
            <User size={20} className="text-orange-600" />
            <h3 className="font-black text-base text-slate-900">1. Personal Info &amp; Bio</h3>
          </div>

          {/* Avatar & Edit/Upload Mock Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-orange-50 border-2 border-slate-900 rounded-2xl">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-3 border-slate-900 overflow-hidden shadow-[3px_3px_0px_0px_#000] bg-white">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                className="absolute bottom-0 right-0 bg-yellow-300 hover:bg-yellow-400 text-slate-900 border-2 border-slate-900 p-1.5 rounded-full shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                title="Change Avatar"
              >
                <Camera size={13} />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h4 className="font-black text-slate-900 text-base">{fullName || 'Bestie'}</h4>
                <span className="text-xs bg-yellow-300 border border-slate-900 px-2 py-0.2 rounded-full font-black">
                  Age {computedAge}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500">Avatar Photo • Click to customize</p>
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                className="text-xs font-black text-purple-700 hover:text-purple-900 underline cursor-pointer"
              >
                {isAvatarPickerOpen ? 'Hide Preset Photos' : 'Edit / Choose Preset Avatar 📸'}
              </button>
            </div>
          </div>

          {/* Preset Avatar Selector Drawer */}
          {isAvatarPickerOpen && (
            <div className="p-3 bg-purple-50 border-2 border-slate-900 rounded-2xl animate-fadeIn space-y-2">
              <span className="text-xs font-black text-slate-700 block">Choose an aesthetic avatar:</span>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`w-12 h-12 rounded-full border-2 border-slate-900 overflow-hidden cursor-pointer shrink-0 transition-transform ${
                      avatarUrl === preset ? 'ring-3 ring-purple-600 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Full Name ✨</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Phone Number 📱</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Date of Birth 🎂 <span className="text-purple-700 font-extrabold">(Auto Age: {computedAge})</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Gender Identity 🌸</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="Female 🌸">Female 🌸</option>
                <option value="Male ⚡">Male ⚡</option>
                <option value="Non-Binary 🌈">Non-Binary 🌈</option>
                <option value="Prefer not to say 🧘‍♀️">Prefer not to say 🧘‍♀️</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-slate-700 mb-1">Residential Address 📍</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, city, district"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
          </div>
        </div>

        {/* ================= 2. PERSONAL GOALS & DAILY TARGETS ================= */}
        <div id="personal-goals-section" className="bg-[#f0fdf4] border-3 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center text-white shrink-0">
                <Target size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-black text-base text-slate-900">2. Personal Goals &amp; Daily Targets</h3>
                  <span className="bg-white border border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full text-emerald-800 shadow-[1px_1px_0px_0px_#000]">
                    Daily Progress Tracking 🎯
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  Set your daily targets for water, movement, and rest. Track today's progress with instant logging.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingTargets(!isEditingTargets)}
              className="self-start sm:self-auto flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 px-3 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Sliders size={13} className="text-emerald-700" />
              <span>{isEditingTargets ? 'Done Editing Targets 🔒' : 'Customize Targets ⚙️'}</span>
            </button>
          </div>

          {/* Daily Slay Score Overview Card */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-slate-500">Today's Goal Progress</span>
                <span className="bg-yellow-200 border border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {completedGoalsCount} of 3 Goals Completed
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{averageDailyScore}%</span>
                <span className="text-xs font-bold text-slate-600">
                  {averageDailyScore >= 100
                    ? '👑 Ultimate Slay! All targets smashed!'
                    : averageDailyScore >= 70
                    ? '✨ Crushing it! You are super close to target!'
                    : '💪 Keep hydrating, walking & resting!'}
                </span>
              </div>
            </div>

            {/* Visual mini score bar */}
            <div className="w-full sm:w-64 bg-slate-100 border-2 border-slate-900 rounded-xl h-6 p-0.5 overflow-hidden shadow-[1.5px_1.5px_0px_0px_#000] relative">
              <div
                className="h-full rounded-lg bg-gradient-to-r from-teal-400 via-emerald-400 to-yellow-300 border border-slate-900 transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.min(100, Math.max(8, averageDailyScore))}%` }}
              >
                <span className="text-[10px] font-black text-slate-900 select-none">
                  {averageDailyScore}%
                </span>
              </div>
            </div>
          </div>

          {/* ================= 3 GOALS CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. WATER INTAKE GOAL */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 border-2 border-slate-900 flex items-center justify-center text-sky-600">
                      <Droplets size={15} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 leading-tight">Water Intake</h4>
                      <span className="text-[10px] font-bold text-slate-500">Hydration target</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 ${
                    waterPct >= 100 ? 'bg-emerald-200 text-emerald-900' : 'bg-sky-100 text-sky-900'
                  }`}>
                    {waterPct}% {waterPct >= 100 && '🎉'}
                  </span>
                </div>

                {/* Current vs Target */}
                <div className="flex items-baseline justify-between mt-1">
                  <div className="text-lg font-black text-slate-900">
                    {goals.waterCurrent.toLocaleString()} <span className="text-xs font-bold text-slate-500">/ {goals.waterTarget.toLocaleString()} mL</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    ≈ {(goals.waterCurrent / 250).toFixed(1)} / {(goals.waterTarget / 250).toFixed(1)} cups
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 border-2 border-slate-900 rounded-xl h-4 p-0.5 mt-2 overflow-hidden shadow-[1px_1px_0px_0px_#000]">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-sky-300 to-sky-500 border border-slate-900 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(4, waterPct))}%` }}
                  />
                </div>

                <p className="text-[11px] font-bold text-slate-600 mt-2">
                  {goals.waterCurrent >= goals.waterTarget
                    ? '💧 Hydro Queen status unlocked! Well hydrated!'
                    : `💧 ${Math.max(0, goals.waterTarget - goals.waterCurrent)} mL remaining to reach daily goal.`}
                </p>
              </div>

              {/* Target Editing or Quick Tracking */}
              {isEditingTargets ? (
                <div className="pt-2 border-t-2 border-slate-100 space-y-2">
                  <label className="block text-[10px] font-black text-slate-700 uppercase">Set Target (mL):</label>
                  <input
                    type="number"
                    step="100"
                    min="500"
                    max="6000"
                    value={goals.waterTarget}
                    onChange={(e) => handleUpdateGoals({ waterTarget: Number(e.target.value) || 2000 })}
                    className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-[1px_1px_0px_0px_#000]"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {[2000, 2500, 3000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleUpdateGoals({ waterTarget: preset })}
                        className={`text-[10px] font-black px-2 py-0.5 rounded-lg border border-slate-900 cursor-pointer ${
                          goals.waterTarget === preset ? 'bg-sky-300 text-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        {preset}mL
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t-2 border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Quick Log Hydration:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleWaterIncrement(250)}
                      className="bg-sky-100 hover:bg-sky-200 text-slate-900 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="+250 mL (1 Cup)"
                    >
                      +250ml 🥛
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWaterIncrement(500)}
                      className="bg-sky-200 hover:bg-sky-300 text-slate-900 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="+500 mL (1 Bottle)"
                    >
                      +500ml 💧
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWaterIncrement(-250)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="-250 mL"
                    >
                      -250ml
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. DAILY STEPS GOAL */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-600">
                      <Footprints size={15} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 leading-tight">Daily Steps</h4>
                      <span className="text-[10px] font-bold text-slate-500">Activity &amp; Movement</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 ${
                    stepsPct >= 100 ? 'bg-emerald-200 text-emerald-900' : 'bg-emerald-50 text-emerald-900'
                  }`}>
                    {stepsPct}% {stepsPct >= 100 && '👟'}
                  </span>
                </div>

                {/* Current vs Target */}
                <div className="flex items-baseline justify-between mt-1">
                  <div className="text-lg font-black text-slate-900">
                    {goals.stepsCurrent.toLocaleString()} <span className="text-xs font-bold text-slate-500">/ {goals.stepsTarget.toLocaleString()} steps</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    ≈ {((goals.stepsCurrent * 0.75) / 1000).toFixed(1)} km
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 border-2 border-slate-900 rounded-xl h-4 p-0.5 mt-2 overflow-hidden shadow-[1px_1px_0px_0px_#000]">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-emerald-300 to-teal-500 border border-slate-900 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(4, stepsPct))}%` }}
                  />
                </div>

                <p className="text-[11px] font-bold text-slate-600 mt-2">
                  {goals.stepsCurrent >= goals.stepsTarget
                    ? '🔥 Step Queen! You completely slayed your step goal!'
                    : `👟 ${Math.max(0, goals.stepsTarget - goals.stepsCurrent).toLocaleString()} steps left to smash target.`}
                </p>
              </div>

              {/* Target Editing or Quick Tracking */}
              {isEditingTargets ? (
                <div className="pt-2 border-t-2 border-slate-100 space-y-2">
                  <label className="block text-[10px] font-black text-slate-700 uppercase">Set Target (Steps):</label>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    max="30000"
                    value={goals.stepsTarget}
                    onChange={(e) => handleUpdateGoals({ stepsTarget: Number(e.target.value) || 8000 })}
                    className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-[1px_1px_0px_0px_#000]"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {[6000, 8000, 10000, 12000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleUpdateGoals({ stepsTarget: preset })}
                        className={`text-[10px] font-black px-2 py-0.5 rounded-lg border border-slate-900 cursor-pointer ${
                          goals.stepsTarget === preset ? 'bg-emerald-300 text-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        {preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t-2 border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Quick Log Steps:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStepsIncrement(1000)}
                      className="bg-emerald-100 hover:bg-emerald-200 text-slate-900 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="+1,000 Steps (Walk)"
                    >
                      +1k 🚶‍♀️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepsIncrement(2500)}
                      className="bg-emerald-200 hover:bg-emerald-300 text-slate-900 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="+2,500 Steps (Run / Gym)"
                    >
                      +2.5k 🏃‍♀️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepsIncrement(-1000)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="-1,000 Steps"
                    >
                      -1k
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. SLEEP DURATION GOAL */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 border-2 border-slate-900 flex items-center justify-center text-indigo-600">
                      <Moon size={15} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 leading-tight">Sleep &amp; Rest</h4>
                      <span className="text-[10px] font-bold text-slate-500">Nightly Recovery</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 ${
                    sleepPct >= 100 ? 'bg-indigo-200 text-indigo-900' : 'bg-indigo-50 text-indigo-900'
                  }`}>
                    {sleepPct}% {sleepPct >= 100 && '😴'}
                  </span>
                </div>

                {/* Current vs Target */}
                <div className="flex items-baseline justify-between mt-1">
                  <div className="text-lg font-black text-slate-900">
                    {goals.sleepCurrent} <span className="text-xs font-bold text-slate-500">/ {goals.sleepTarget} hrs</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {goals.sleepCurrent >= 7 ? '✨ Optimal Rest' : '💤 Catch up rest'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 border-2 border-slate-900 rounded-xl h-4 p-0.5 mt-2 overflow-hidden shadow-[1px_1px_0px_0px_#000]">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-purple-300 to-indigo-500 border border-slate-900 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(4, sleepPct))}%` }}
                  />
                </div>

                <p className="text-[11px] font-bold text-slate-600 mt-2">
                  {goals.sleepCurrent >= goals.sleepTarget
                    ? '😴 Sleeping Beauty era! Great cellular recovery!'
                    : `🌙 ${(goals.sleepTarget - goals.sleepCurrent).toFixed(1)} hrs needed to hit nightly recovery target.`}
                </p>
              </div>

              {/* Target Editing or Quick Tracking */}
              {isEditingTargets ? (
                <div className="pt-2 border-t-2 border-slate-100 space-y-2">
                  <label className="block text-[10px] font-black text-slate-700 uppercase">Set Target (Hours):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="14"
                    value={goals.sleepTarget}
                    onChange={(e) => handleUpdateGoals({ sleepTarget: Number(e.target.value) || 8 })}
                    className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-[1px_1px_0px_0px_#000]"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {[7.0, 7.5, 8.0, 8.5, 9.0].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleUpdateGoals({ sleepTarget: preset })}
                        className={`text-[10px] font-black px-2 py-0.5 rounded-lg border border-slate-900 cursor-pointer ${
                          goals.sleepTarget === preset ? 'bg-indigo-300 text-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        {preset}h
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t-2 border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Quick Log Sleep:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSleepIncrement(0.5)}
                      className="bg-indigo-100 hover:bg-indigo-200 text-slate-900 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="+0.5 Hour (Nap)"
                    >
                      +0.5h 🌙
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSleepIncrement(1.0)}
                      className="bg-indigo-200 hover:bg-indigo-300 text-slate-900 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="+1.0 Hour"
                    >
                      +1.0h 🛌
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSleepIncrement(-0.5)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-900 py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
                      title="-0.5 Hour"
                    >
                      -0.5h
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= 3. EMERGENCY CONTACT INFO ================= */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-900">
            <HeartHandshake size={20} className="text-red-500" />
            <h3 className="font-black text-base text-slate-900">3. Emergency Contact Person</h3>
          </div>

          <p className="text-xs font-semibold text-slate-600">
            This person will be dialed immediately when tapping the persistent orange "Call Contact" button.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Contact Name 💖</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="e.g. Thao Lam (Mom)"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Relationship 🤝</label>
              <input
                type="text"
                value={emergencyRelationship}
                onChange={(e) => setEmergencyRelationship(e.target.value)}
                placeholder="e.g. Mother 💖, Partner, Sister"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Emergency Phone 📞</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+84 91 999 8888"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>
          </div>
        </div>

        {/* ================= 4. MEDICAL INFO & KNOWN ALLERGIES ================= */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-900">
            <ShieldAlert size={20} className="text-purple-600" />
            <h3 className="font-black text-base text-slate-900">4. Medical Info &amp; Permanent Allergies</h3>
          </div>

          <p className="text-xs font-semibold text-slate-600">
            Permanent record displayed on your Emergency 115 card for emergency responders and doctors.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Medication Allergies (e.g. Penicillin, Aspirin, Ibuprofen) 💊
              </label>
              <input
                type="text"
                value={medicationAllergies}
                onChange={(e) => setMedicationAllergies(e.target.value)}
                placeholder="e.g. Penicillin (Causes severe hives), None"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Food Allergies (e.g. Shellfish, Peanuts, Gluten) 🦐🥜
              </label>
              <input
                type="text"
                value={foodAllergies}
                onChange={(e) => setFoodAllergies(e.target.value)}
                placeholder="e.g. Shellfish (Shrimp, Crab - mild itch), Peanuts"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Drink / Other Sensitivities 🥤☕
              </label>
              <input
                type="text"
                value={drinkAllergies}
                onChange={(e) => setDrinkAllergies(e.target.value)}
                placeholder="e.g. High caffeine, Artificial sweeteners"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
        </div>

        {/* ================= 5. HOURLY NOTIFICATIONS & VITALS REMINDERS ================= */}
        <div
          id="hourly-notifications-section"
          className="bg-[#fef08a] border-3 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center text-yellow-300 shrink-0">
                <Bell size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-black text-base text-slate-900">5. Hourly Vitals Reminders &amp; Alerts</h3>
                  <span className="bg-white border border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full text-purple-900 shadow-[1px_1px_0px_0px_#000]">
                    Toast Notification 🔔✨
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Trigger an automated browser &amp; in-app toast chime every hour to keep your vitals on track.
                </p>
              </div>
            </div>

            {/* Test Trigger Button */}
            {onTriggerTestNotification && (
              <button
                type="button"
                id="test-vitals-toast-btn"
                onClick={onTriggerTestNotification}
                className="self-start sm:self-auto flex items-center gap-1.5 bg-white hover:bg-yellow-50 text-slate-900 border-2 border-slate-900 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
                title="Trigger a live sample vitals toast notification"
              >
                <Volume2 size={14} className="text-purple-700" />
                <span>Test Toast Now 🔔</span>
              </button>
            )}
          </div>

          {/* Main Toggle Switch Card */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-900">Hourly Vitals Log Notification</h4>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 ${
                      hourlyNotificationEnabled
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {hourlyNotificationEnabled ? 'ACTIVE 🟢' : 'DISABLED ⚪'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  Displays an interactive reminder toast at top right with quick "Log Vitals" button and audio chime.
                </p>
              </div>

              {/* Toggle Switch Component */}
              <button
                type="button"
                id="hourly-notification-toggle"
                onClick={() => handleToggleHourlyNotification(!hourlyNotificationEnabled)}
                className={`w-16 h-9 rounded-full border-3 border-slate-900 p-1 flex items-center shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer shrink-0 ${
                  hourlyNotificationEnabled ? 'bg-purple-600 justify-end' : 'bg-slate-200 justify-start'
                }`}
                aria-pressed={hourlyNotificationEnabled}
                title={hourlyNotificationEnabled ? 'Disable Hourly Notifications' : 'Enable Hourly Notifications'}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000] transition-transform ${
                    hourlyNotificationEnabled ? 'bg-yellow-300' : 'bg-white'
                  }`}
                />
              </button>
            </div>

            {/* Notification Schedule & Frequency Selector */}
            {hourlyNotificationEnabled && (
              <div className="pt-3 border-t-2 border-slate-100 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Clock size={14} className="text-purple-600" />
                    <span>Reminder Frequency:</span>
                  </label>

                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { hours: 1, label: 'Every 1 Hour (Standard 💅)' },
                      { hours: 2, label: 'Every 2 Hours' },
                      { hours: 4, label: 'Every 4 Hours' }
                    ].map((opt) => (
                      <button
                        key={opt.hours}
                        type="button"
                        onClick={() => handleIntervalChange(opt.hours)}
                        className={`text-xs font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 cursor-pointer shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 transition-all ${
                          notificationIntervalHours === opt.hours
                            ? 'bg-yellow-300 text-slate-900'
                            : 'bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Browser Native Permission Status */}
                <div className="p-3 bg-purple-50 border-2 border-slate-900/40 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📢</span>
                    <span className="font-bold text-slate-800">
                      Browser Notification Push Status:
                    </span>
                  </div>

                  <span
                    className={`font-black text-[11px] px-2.5 py-0.5 rounded-full border border-slate-900 ${
                      browserPermission === 'granted'
                        ? 'bg-emerald-200 text-emerald-900'
                        : browserPermission === 'denied'
                        ? 'bg-red-200 text-red-900'
                        : 'bg-yellow-200 text-yellow-900'
                    }`}
                  >
                    {browserPermission === 'granted'
                      ? 'System Push Allowed 🟢'
                      : browserPermission === 'denied'
                      ? 'Browser Blocked (In-App Only) 🟡'
                      : 'In-App Toast Active 🔔'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= 6. MILESTONE PRIZES & SHIPMENTS ================= */}
        <div
          id="milestone-prizes-section"
          className="bg-[#fbcfe8] border-3 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center text-yellow-300 shrink-0">
                <Gift size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-black text-base text-slate-900">6. Milestone Rewards &amp; Prize Shipping</h3>
                  <span className="bg-white border border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full text-purple-900 shadow-[1px_1px_0px_0px_#000]">
                    100 PTS Goal 🏆
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Track your physical wellness gifts, delivery details, and congratulations notes.
                </p>
              </div>
            </div>

            {onOpenPrizeModal && (
              <button
                type="button"
                id="open-prize-modal-from-profile"
                onClick={onOpenPrizeModal}
                className="self-start sm:self-auto flex items-center gap-1.5 bg-yellow-300 hover:bg-yellow-400 text-slate-900 border-2 border-slate-900 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
              >
                <Truck size={14} className="text-purple-700" />
                <span>
                  {user.claimedPrizeShipments && user.claimedPrizeShipments.length > 0
                    ? 'View Shipment & Note 💌'
                    : user.points >= 100
                    ? 'Claim 100 PTS Prize 🎁'
                    : '100 PTS Prize Preview 🎁'}
                </span>
              </button>
            )}
          </div>

          {user.claimedPrizeShipments && user.claimedPrizeShipments.length > 0 ? (
            <div className="space-y-3">
              {user.claimedPrizeShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-purple-700" />
                      <span className="font-black text-slate-900">{shipment.prizeTitle}</span>
                    </div>
                    <span className="bg-emerald-200 text-emerald-900 border border-slate-900 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]">
                      🚚 {shipment.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-2 border-t border-slate-200">
                    <div>
                      <span className="font-bold text-slate-500">Tracking Code: </span>
                      <span className="font-mono font-black text-purple-700">{shipment.trackingNumber}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Courier Phone: </span>
                      <span className="font-bold text-slate-800">{shipment.phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-bold text-slate-500">Delivery Address: </span>
                      <span className="font-bold text-slate-800">{shipment.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-xs text-slate-900">SlayHealth 100 PTS Care Package</h4>
                <p className="text-[11px] font-semibold text-slate-600">
                  Hit 100 points to claim a care package with Panadol Extra, pastel band-aids, and hydration packs!
                </p>
              </div>
              <span className="font-black text-xs px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 border border-slate-900 shrink-0">
                Current: {user.points || 0} / 100 pts
              </span>
            </div>
          )}
        </div>

        {/* Save Changes Button */}
        <button
          type="submit"
          className="w-full py-4 bg-yellow-300 hover:bg-yellow-400 text-slate-900 border-3 border-slate-900 rounded-2xl font-black text-base shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          <span>Save Changes &amp; Sync Profile to Cloud 💾💅</span>
        </button>
      </form>
    </div>
  );
};
