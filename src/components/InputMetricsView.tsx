import React, { useState } from 'react';
import { VitalsRecord, MealStatus, evaluateVitals } from '../types';
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Clock,
  Sparkles,
  Check,
  AlertTriangle,
  Utensils,
  ShieldAlert,
  Flame,
  Cloud
} from 'lucide-react';

interface InputMetricsViewProps {
  onSave: (record: VitalsRecord) => void;
}

export const InputMetricsView: React.FC<InputMetricsViewProps> = ({ onSave }) => {
  const [sys, setSys] = useState<string>('120');
  const [dia, setDia] = useState<string>('80');
  const [pulse, setPulse] = useState<string>('72');
  const [spo2, setSpo2] = useState<string>('99');
  const [bloodSugar, setBloodSugar] = useState<string>('95');
  const [temperature, setTemperature] = useState<string>('36.6');
  const [tag, setTag] = useState<string>('Post Workout 🏋️‍♀️');

  // Date & Time states
  const [measurementDate, setMeasurementDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [measurementTime, setMeasurementTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  // Lifestyle Check-in states
  const [mealStatus, setMealStatus] = useState<MealStatus>('yes');
  const [hasAllergyReaction, setHasAllergyReaction] = useState<boolean>(false);
  const [allergyDetails, setAllergyDetails] = useState<string>('');

  // Save animation state
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const parsedSys = Number(sys) || 0;
  const parsedDia = Number(dia) || 0;
  const parsedPulse = Number(pulse) || 0;
  const parsedSpo2 = Number(spo2) || 0;
  const parsedSugar = Number(bloodSugar) || 0;
  const parsedTemp = Number(temperature) || 0;

  // Live evaluation of thresholds
  const evaluation = evaluateVitals(
    parsedSys,
    parsedDia,
    parsedPulse,
    parsedSpo2,
    parsedSugar,
    parsedTemp
  );

  const handleSetRightNow = () => {
    const now = new Date();
    setMeasurementDate(now.toISOString().split('T')[0]);
    setMeasurementTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: VitalsRecord = {
      id: `vitals-${Date.now()}`,
      sys: parsedSys,
      dia: parsedDia,
      pulse: parsedPulse,
      spo2: parsedSpo2,
      bloodSugar: parsedSugar,
      temperature: parsedTemp,
      date: measurementDate,
      time: measurementTime,
      timestamp: `${measurementDate} ${measurementTime}`,
      tag: tag || 'Routine Vibe',
      mealStatus,
      hasAllergyReaction,
      allergyDetails: hasAllergyReaction ? allergyDetails : undefined,
      isAbnormal: evaluation.isAbnormal,
      anomalyReasons: evaluation.reasons,
      createdAt: new Date().toISOString()
    };

    setIsSaved(true);
    setTimeout(() => {
      onSave(newRecord);
    }, 400);
  };

  return (
    <div id="view-input-metrics" className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Title Card */}
      <div className="bg-[#fef08a] border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
        <div>
          <div className="inline-block bg-white border-2 border-slate-900 px-2.5 py-0.5 rounded-full text-xs font-black text-yellow-900 mb-1 shadow-[1px_1px_0px_0px_#000]">
            PAGE 2: VITALS & LIFESTYLE CHECK 🩺
          </div>
          <h2 className="text-2xl font-black text-slate-900">Log Your Health Vitals</h2>
          <p className="text-xs font-semibold text-slate-700">
            Chunky colorful fields & lifestyle check-in synced directly to your cloud health record!
          </p>
        </div>
        <span className="text-4xl">⚡🥑💖</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-3 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] space-y-6">
        {/* SECTION 1: MEASUREMENT DATE & TIME */}
        <div className="bg-[#fdf4ff] border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Clock size={15} className="text-purple-600" />
              <span>Timestamp & Date of Measurement</span>
            </label>
            <button
              type="button"
              onClick={handleSetRightNow}
              className="self-start sm:self-auto text-[11px] font-black bg-yellow-300 hover:bg-yellow-400 text-slate-900 px-3 py-1 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000] cursor-pointer active:translate-y-0.5"
            >
              Set Right Now ⚡
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="block text-[11px] font-bold text-slate-600 mb-1">Date 🗓️</span>
              <input
                type="date"
                value={measurementDate}
                onChange={(e) => setMeasurementDate(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-600 mb-1">Time ⏰</span>
              <input
                type="time"
                value={measurementTime}
                onChange={(e) => setMeasurementTime(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: OVERSIZED VITALS INPUT GRID */}
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Activity size={16} className="text-pink-600" />
            <span>Chunky Vitals Metrics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Systolic BP */}
            <div className="bg-[#fff7ed] border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-800">Systolic (SYS)</label>
                <span className="text-[10px] font-bold text-slate-500">90-120 mmHg</span>
              </div>
              <input
                type="number"
                min="50"
                max="250"
                value={sys}
                onChange={(e) => setSys(e.target.value)}
                placeholder="120"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2.5 text-2xl font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Diastolic BP */}
            <div className="bg-[#fef9c3] border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-800">Diastolic (DIA)</label>
                <span className="text-[10px] font-bold text-slate-500">60-80 mmHg</span>
              </div>
              <input
                type="number"
                min="30"
                max="150"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                placeholder="80"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2.5 text-2xl font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            {/* Pulse Rate */}
            <div className="bg-[#fee2e2] border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-800">Pulse Rate (BPM)</label>
                <span className="text-[10px] font-bold text-slate-500">60-100 BPM</span>
              </div>
              <input
                type="number"
                min="30"
                max="220"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="72"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2.5 text-2xl font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            {/* Oxygen SpO2 */}
            <div className="bg-[#e0f2fe] border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-800">SpO2 Oxygen (%)</label>
                <span className="text-[10px] font-bold text-slate-500">≥ 95%</span>
              </div>
              <input
                type="number"
                min="50"
                max="100"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                placeholder="99"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2.5 text-2xl font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            {/* Blood Sugar */}
            <div className="bg-[#dcfce7] border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-800">Blood Sugar (mg/dL)</label>
                <span className="text-[10px] font-bold text-slate-500">70-130 mg/dL</span>
              </div>
              <input
                type="number"
                min="30"
                max="400"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                placeholder="95"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2.5 text-2xl font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>

            {/* Body Temperature */}
            <div className="bg-[#fae8ff] border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-800">Body Temp (°C)</label>
                <span className="text-[10px] font-bold text-slate-500">36.1 - 37.2 °C</span>
              </div>
              <input
                type="number"
                step="0.1"
                min="34"
                max="43"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="36.6"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2.5 text-2xl font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: LIFESTYLE CHECK-IN (MEALS & ALLERGIES) */}
        <div className="bg-[#ecfeff] border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900/20">
            <Utensils size={18} className="text-teal-700" />
            <h3 className="font-black text-sm text-slate-900">GenZ Lifestyle Check-in 🥑</h3>
          </div>

          {/* Meals Check */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-2">
              Did you eat proper meals today? 🍱
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'yes' as MealStatus, label: 'Yes, ate well 🥑', color: 'bg-emerald-300' },
                { id: 'no' as MealStatus, label: 'Barely / Snacks 🥪', color: 'bg-yellow-300' },
                { id: 'skipped' as MealStatus, label: 'Skipped Meals 🚫', color: 'bg-red-300' }
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMealStatus(option.id)}
                  className={`py-2 px-2 rounded-xl border-2 border-slate-900 text-xs font-black transition-all cursor-pointer ${
                    mealStatus === option.id
                      ? `${option.color} shadow-[2px_2px_0px_0px_#000] scale-[1.02]`
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies Check */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-2">
              Any allergic reactions to food/meds/drinks today? 🚨
            </label>
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                onClick={() => setHasAllergyReaction(false)}
                className={`flex-1 py-2 rounded-xl border-2 border-slate-900 text-xs font-black transition-all cursor-pointer ${
                  !hasAllergyReaction
                    ? 'bg-emerald-300 text-slate-900 shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-slate-700'
                }`}
              >
                No reactions! Clean glow ✨
              </button>
              <button
                type="button"
                onClick={() => setHasAllergyReaction(true)}
                className={`flex-1 py-2 rounded-xl border-2 border-slate-900 text-xs font-black transition-all cursor-pointer ${
                  hasAllergyReaction
                    ? 'bg-red-400 text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-slate-700'
                }`}
              >
                Yes, experienced allergy 🚨
              </button>
            </div>

            {hasAllergyReaction && (
              <div className="animate-fadeIn mt-2">
                <input
                  type="text"
                  value={allergyDetails}
                  onChange={(e) => setAllergyDetails(e.target.value)}
                  placeholder="e.g. Mild hives after iced seafood pasta, taken antihistamine..."
                  className="w-full bg-white border-2 border-red-500 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-red-400"
                  required={hasAllergyReaction}
                />
              </div>
            )}
          </div>

          {/* Context Tag Selection */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-2">
              Context / Activity Tag 🏷️
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Morning Chill ☕',
                'Post Workout 🏋️‍♀️',
                'Midday Study Sesh 📚',
                'Post Matcha 🍵',
                'Bedtime Zen 🛌',
                'High Stress ⚡'
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-900 cursor-pointer transition-all ${
                    tag === t
                      ? 'bg-slate-900 text-yellow-300 shadow-[1px_1px_0px_0px_#000]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Anomaly Warning Alert */}
        {evaluation.isAbnormal && (
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-3.5 flex items-start gap-2.5 animate-fadeIn">
            <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
            <div className="text-xs">
              <span className="font-black text-red-800">Threshold Breached: </span>
              <span className="font-semibold text-red-700">{evaluation.reasons.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Chunky Save Button */}
        <button
          type="submit"
          disabled={isSaved}
          className={`w-full py-4 rounded-2xl font-black text-base border-3 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-emerald-400 text-slate-900'
              : 'bg-yellow-300 hover:bg-yellow-400 text-slate-900 shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-1'
          }`}
        >
          <Sparkles size={20} />
          <span>{isSaved ? 'Syncing to Cloud... 💅' : 'Save My Vitals & Cloud Sync 💾✨'}</span>
        </button>
      </form>
    </div>
  );
};
