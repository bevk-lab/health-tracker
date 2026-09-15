export type PageType = 'home' | 'input' | 'analytics' | 'calendar' | 'diary' | 'profile' | 'social';

export type MealStatus = 'yes' | 'no' | 'skipped';

export interface VitalsRecord {
  id: string;
  sys: number;          // mmHg (Normal: 90-120)
  dia: number;          // mmHg (Normal: 60-80)
  pulse: number;        // BPM (Normal: 60-100)
  spo2: number;         // % (Normal: >=95)
  bloodSugar: number;   // mg/dL (Normal: 70-130)
  temperature: number;  // °C (Normal: <= 37.5, > 38 warning)
  date: string;         // YYYY-MM-DD
  time: string;         // HH:mm
  timestamp: string;
  tag?: string;
  mealStatus: MealStatus;
  hasAllergyReaction: boolean;
  allergyDetails?: string;
  isAbnormal: boolean;
  anomalyReasons: string[];
  createdAt?: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string;
  specialty?: string;
  createdAt?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'slaying' | 'vibing' | 'tired' | 'anxious' | 'cozy';
  moodEmoji: string;
  date: string;
  time: string;
  tags: string[];
  createdAt?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface KnownAllergies {
  medications: string;
  food: string;
  drinks: string;
}

export interface PersonalGoals {
  waterTarget: number; // in ml, e.g. 2500
  waterCurrent: number; // in ml, e.g. 1750
  stepsTarget: number; // e.g. 10000
  stepsCurrent: number; // e.g. 7200
  sleepTarget: number; // in hours, e.g. 8.0
  sleepCurrent: number; // in hours, e.g. 7.5
}

export interface UserProfile {
  uid?: string;
  email?: string;
  nickname?: string;
  fullName: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  gender: string;
  address: string;
  avatarUrl: string;
  emergencyContact: EmergencyContact;
  knownAllergies: KnownAllergies;
  goals?: PersonalGoals;
  points?: number;
  streak?: number;
  lastCheckInDate?: string;
  claimedRewards?: string[];
  isAnonymous?: boolean;
  authProvider?: 'google' | 'facebook' | 'instagram' | 'email' | 'guest';
  hourlyNotificationEnabled?: boolean;
  notificationIntervalHours?: number;
  lastNotificationTimestamp?: string;
  claimedPrizeShipments?: PrizeClaimShipment[];
}

export interface PrizeClaimShipment {
  id: string;
  prizeTitle: string;
  pointsCost: number;
  recipientName: string;
  phone: string;
  address: string;
  notes?: string;
  claimedAt: string;
  status: 'processing' | 'shipped' | 'delivered';
  trackingNumber: string;
}

export interface Friend {
  id: string;
  nickname: string; // e.g. "@ltngen"
  fullName: string;
  avatarUrl: string;
  status: string;
  streak: number;
  points: number;
  todaySteps: number;
  todayWater: number;
  badges: string[];
  isFavorite?: boolean;
  phone?: string;
  relationship?: string;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  nickname: string;
  fullName: string;
  avatarUrl: string;
  points: number;
  streak: number;
  todaySteps: number;
  todayWater: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface RecentCallContact {
  id: string;
  name: string;
  nickname?: string;
  relationship: string;
  phone: string;
  avatarUrl?: string;
  callType: 'incoming' | 'outgoing' | 'missed';
  duration?: string;
  timeAgo: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  category?: 'general' | 'vitals' | 'nutrition' | 'vibe';
}

export interface MotivationalQuote {
  quote: string;
  sub: string;
  animalType: 'cat' | 'dog';
  imageUrl: string;
  badge: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "Drink water bestie! Stay hydrated 💧",
    sub: "Your kidneys, skin glow, and energy will thank you big time!",
    animalType: 'cat',
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&auto=format&fit=crop&q=80",
    badge: "HYDRATION CHECK 🧃"
  },
  {
    quote: "Did you eat? Go grab a snack! 🍔",
    sub: "You can't run on vibes and iced coffee alone. Fuel your glow!",
    animalType: 'dog',
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80",
    badge: "SNACK TIME 🥑"
  },
  {
    quote: "Slay the day! You are doing amazing ✨",
    sub: "Main character energy activated. Remember you are THAT person.",
    animalType: 'cat',
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80",
    badge: "CONFIDENCE BOOST 💅"
  },
  {
    quote: "Posture check! Unhunch those shoulders rn 🧘‍♀️",
    sub: "Release your jaw, roll your shoulders back, and take a deep breath.",
    animalType: 'dog',
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80",
    badge: "POSTURE RESET 🌿"
  },
  {
    quote: "Touch some grass & reset your vibe 🌸",
    sub: "Step outside for 5 mins of fresh air and natural sunlight.",
    animalType: 'dog',
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&auto=format&fit=crop&q=80",
    badge: "ZEN VIBES 🌿"
  },
  {
    quote: "Screen break time! Blink those pretty eyes 👀",
    sub: "Look 20 feet away for 20 seconds. 20-20-20 eye rule works wonders!",
    animalType: 'cat',
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&auto=format&fit=crop&q=80",
    badge: "EYE CARE 👁️"
  }
];

export function calculateAge(dobString: string): number {
  if (!dobString) return 22;
  const birth = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return isNaN(age) || age < 0 ? 22 : age;
}

export function evaluateVitals(
  sys: number,
  dia: number,
  pulse: number,
  spo2: number,
  bloodSugar: number,
  temp: number
) {
  const isSysHigh = sys > 140;
  const isSysLow = sys < 90;
  const isDiaHigh = dia > 90;
  const isDiaLow = dia < 60;
  const isPulseHigh = pulse > 100;
  const isPulseLow = pulse < 60;
  const isSpo2Low = spo2 < 95;
  const isBloodSugarHigh = bloodSugar > 130;
  const isBloodSugarLow = bloodSugar < 70;
  const isTempHigh = temp > 38.0;

  const isAbnormal =
    isSysHigh ||
    isSysLow ||
    isDiaHigh ||
    isDiaLow ||
    isPulseHigh ||
    isPulseLow ||
    isSpo2Low ||
    isBloodSugarHigh ||
    isBloodSugarLow ||
    isTempHigh;

  const reasons: string[] = [];
  if (isSysHigh) reasons.push('SYS > 140 (High)');
  if (isSysLow) reasons.push('SYS < 90 (Low)');
  if (isDiaHigh) reasons.push('DIA > 90 (High)');
  if (isDiaLow) reasons.push('DIA < 60 (Low)');
  if (isPulseHigh) reasons.push('Pulse > 100 (Rapid)');
  if (isPulseLow) reasons.push('Pulse < 60 (Slow)');
  if (isSpo2Low) reasons.push('SpO2 < 95% (Low Oxygen)');
  if (isBloodSugarHigh) reasons.push('Blood Sugar > 130 mg/dL (High)');
  if (isBloodSugarLow) reasons.push('Blood Sugar < 70 mg/dL (Low)');
  if (isTempHigh) reasons.push('Temp > 38°C (Fever)');

  return {
    isAbnormal,
    reasons
  };
}
