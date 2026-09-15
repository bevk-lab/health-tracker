import { VitalsRecord, Appointment, JournalEntry, UserProfile } from './types';

export const INITIAL_VITALS: VitalsRecord[] = [
  {
    id: 'v-1',
    sys: 118,
    dia: 76,
    pulse: 72,
    spo2: 99,
    bloodSugar: 92,
    temperature: 36.6,
    timestamp: '2026-08-27 08:30',
    date: '2026-08-27',
    time: '08:30',
    tag: 'Morning Chill ☕',
    mealStatus: 'yes',
    hasAllergyReaction: false,
    isAbnormal: false,
    anomalyReasons: []
  },
  {
    id: 'v-2',
    sys: 122,
    dia: 80,
    pulse: 78,
    spo2: 98,
    bloodSugar: 110,
    temperature: 36.8,
    timestamp: '2026-08-28 13:15',
    date: '2026-08-28',
    time: '13:15',
    tag: 'Post Matcha 🍵',
    mealStatus: 'yes',
    hasAllergyReaction: false,
    isAbnormal: false,
    anomalyReasons: []
  },
  {
    id: 'v-3',
    sys: 146,
    dia: 94,
    pulse: 106,
    spo2: 97,
    bloodSugar: 142,
    temperature: 38.4,
    timestamp: '2026-08-29 10:45',
    date: '2026-08-29',
    time: '10:45',
    tag: 'Midterm Stress & Fever 📚🤒',
    mealStatus: 'skipped',
    hasAllergyReaction: true,
    allergyDetails: 'Mild skin itchiness after eating shrimp chips',
    isAbnormal: true,
    anomalyReasons: [
      'SYS > 140 (High)',
      'DIA > 90 (High)',
      'Pulse > 100 (Rapid)',
      'Blood Sugar > 130 mg/dL (High)',
      'Temp > 38°C (Fever)'
    ]
  },
  {
    id: 'v-4',
    sys: 119,
    dia: 78,
    pulse: 70,
    spo2: 99,
    bloodSugar: 98,
    temperature: 36.7,
    timestamp: '2026-08-29 19:30',
    date: '2026-08-29',
    time: '19:30',
    tag: 'Bedtime Zen 🛌',
    mealStatus: 'yes',
    hasAllergyReaction: false,
    isAbnormal: false,
    anomalyReasons: []
  },
  {
    id: 'v-5',
    sys: 116,
    dia: 75,
    pulse: 68,
    spo2: 100,
    bloodSugar: 95,
    temperature: 36.5,
    timestamp: '2026-08-30 08:15',
    date: '2026-08-30',
    time: '08:15',
    tag: 'Post Yoga 🧘‍♀️',
    mealStatus: 'yes',
    hasAllergyReaction: false,
    isAbnormal: false,
    anomalyReasons: []
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Sarah Taylor',
    specialty: 'Dermatology & Skin Glow ✨',
    location: 'Bloom Wellness Clinic, Floor 3',
    date: '2026-09-02',
    time: '14:30',
    notes: 'Bring list of current skincare products & SPF sunscreen routine.'
  },
  {
    id: 'apt-2',
    doctorName: 'Dr. James Chen',
    specialty: 'Dental Cleaning & Brightening 🦷',
    location: 'Sparkle Dental Lounge, Suite 204',
    date: '2026-09-12',
    time: '10:00',
    notes: 'Routine 6-month scale & polish session.'
  },
  {
    id: 'apt-3',
    doctorName: 'Dr. Emily Nguyen',
    specialty: 'General Checkup & Allergies 🩺',
    location: 'District 1 Medical Center',
    date: '2026-09-25',
    time: '09:00',
    notes: 'Follow-up on seasonal allergies and annual blood panel.'
  }
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    title: 'Drank 2.5L water & crushed my presentation 🥳',
    content: 'Felt super energized after adding electrolyte drops to my morning iced tumbler! Pulse was steady at 72 bpm all day. Celebrated with matcha latte.',
    mood: 'slaying',
    moodEmoji: '💅',
    date: '2026-08-28',
    time: '20:15',
    tags: ['Hydration', 'Win', 'Energy', 'Slay']
  },
  {
    id: 'j-2',
    title: 'A bit jittery after double espresso ☕',
    content: 'Noticed pulse spiked over 100 after 2 oat flat whites during cramming session. Switched to iced chamomile tea and feeling much calmer now.',
    mood: 'anxious',
    moodEmoji: '🥺',
    date: '2026-08-29',
    time: '16:30',
    tags: ['Caffeine', 'Pulse', 'Rest']
  },
  {
    id: 'j-3',
    title: 'Pilates core burn + post-workout smoothie 🥑',
    content: 'Awesome reformer session today! SpO2 is 100% and temperature stabilized back to 36.5°C. Logging my meals on point this week.',
    mood: 'vibing',
    moodEmoji: '✨',
    date: '2026-08-30',
    time: '10:00',
    tags: ['Fitness', 'Pilates', 'Smoothie', 'Glow']
  }
];

export const INITIAL_USER: UserProfile = {
  fullName: 'Becky Lam',
  nickname: '@becky_slay',
  phone: '+84 90 123 4567',
  dob: '2004-02-14',
  gender: 'Female 🌸',
  address: '123 Nguyen Hue Blvd, District 1, Ho Chi Minh City',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  emergencyContact: {
    name: 'Thao Lam (Mom)',
    relationship: 'Mother 💖',
    phone: '+84 91 999 8888'
  },
  knownAllergies: {
    medications: 'Penicillin (Causes hives/rash)',
    food: 'Shellfish (Shrimp, Crab - mild itch)',
    drinks: 'Excessive high-caffeine energy drinks'
  },
  goals: {
    waterTarget: 2500,
    waterCurrent: 1750,
    stepsTarget: 10000,
    stepsCurrent: 7200,
    sleepTarget: 8.0,
    sleepCurrent: 7.5
  },
  points: 120,
  streak: 5,
  claimedRewards: []
};

// Mock Friends in the user's circle
export const INITIAL_FRIENDS = [
  {
    id: 'f-1',
    nickname: '@ltngen',
    fullName: 'Ngan Lam',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    status: 'Slaying 10k steps today 👟',
    streak: 12,
    points: 340,
    todaySteps: 10450,
    todayWater: 2750,
    badges: ['👑 Top Slay', '👟 Step Beast', '💧 Hydro Queen'],
    isFavorite: true,
    phone: '+84 90 888 1122',
    relationship: 'Sister / Bestie'
  },
  {
    id: 'f-2',
    nickname: '@minh_fit',
    fullName: 'Minh Tran',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    status: 'Post-gym smoothie vibes 🥑',
    streak: 8,
    points: 260,
    todaySteps: 8900,
    todayWater: 3000,
    badges: ['🏋️ Gym Bro', '🥑 Clean Fuel'],
    isFavorite: false,
    phone: '+84 93 456 7890',
    relationship: 'Gym Buddy'
  },
  {
    id: 'f-3',
    nickname: '@hoa_zen',
    fullName: 'Hoa Nguyen',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    status: 'Matcha & pilates mode 🍵',
    streak: 15,
    points: 410,
    todaySteps: 11200,
    todayWater: 2500,
    badges: ['🧘‍♀️ Zen Queen', '🌸 Glow Guru'],
    isFavorite: true,
    phone: '+84 97 123 9988',
    relationship: 'Roommate'
  },
  {
    id: 'f-4',
    nickname: '@vy_slay',
    fullName: 'Vy Hoang',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    status: 'Resting & hydrating 🛌💧',
    streak: 4,
    points: 150,
    todaySteps: 4500,
    todayWater: 1800,
    badges: ['😴 Sleep Fairy'],
    isFavorite: false,
    phone: '+84 98 777 6655',
    relationship: 'Study Pal'
  },
  {
    id: 'f-5',
    nickname: '@thao_mom',
    fullName: 'Thao Lam (Mom)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    status: 'Morning park walk completed 🌸',
    streak: 21,
    points: 520,
    todaySteps: 12500,
    todayWater: 2400,
    badges: ['💖 Super Mom', '👑 Walking Queen'],
    isFavorite: true,
    phone: '+84 91 999 8888',
    relationship: 'Mother 💖'
  }
];

// Searchable directory of users for global search
export const SEARCHABLE_USERS = [
  ...INITIAL_FRIENDS,
  {
    id: 'f-6',
    nickname: '@baobao_health',
    fullName: 'Bao Bao',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'Drinking 3L water today 💧',
    streak: 7,
    points: 210,
    todaySteps: 6200,
    todayWater: 3000,
    badges: ['💧 Hydro Homie'],
    phone: '+84 90 333 4444',
    relationship: 'Friend'
  },
  {
    id: 'f-7',
    nickname: '@david_gym',
    fullName: 'David Pham',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'Cardio session in progress 🏃‍♂️',
    streak: 9,
    points: 290,
    todaySteps: 9800,
    todayWater: 2200,
    badges: ['🏃 Cardio King'],
    phone: '+84 91 222 3333',
    relationship: 'Friend'
  },
  {
    id: 'f-8',
    nickname: '@linh_aesthetic',
    fullName: 'Linh Dang',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    status: 'Journaling thoughts 📝',
    streak: 6,
    points: 180,
    todaySteps: 5400,
    todayWater: 2100,
    badges: ['✨ Vibe Check'],
    phone: '+84 94 555 6666',
    relationship: 'Friend'
  }
];

// Mock Leaderboard
export const INITIAL_LEADERBOARD = [
  {
    id: 'f-5',
    rank: 1,
    nickname: '@thao_mom',
    fullName: 'Thao Lam (Mom)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    points: 520,
    streak: 21,
    todaySteps: 12500,
    todayWater: 2400,
    badge: '👑 Slay Empress'
  },
  {
    id: 'f-3',
    rank: 2,
    nickname: '@hoa_zen',
    fullName: 'Hoa Nguyen',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    points: 410,
    streak: 15,
    todaySteps: 11200,
    todayWater: 2500,
    badge: '🧘‍♀️ Zen Master'
  },
  {
    id: 'f-1',
    rank: 3,
    nickname: '@ltngen',
    fullName: 'Ngan Lam',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    points: 340,
    streak: 12,
    todaySteps: 10450,
    todayWater: 2750,
    badge: '👟 Step Queen'
  },
  {
    id: 'f-7',
    rank: 4,
    nickname: '@david_gym',
    fullName: 'David Pham',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    points: 290,
    streak: 9,
    todaySteps: 9800,
    todayWater: 2200,
    badge: '🏃 Cardio Champ'
  },
  {
    id: 'f-2',
    rank: 5,
    nickname: '@minh_fit',
    fullName: 'Minh Tran',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    points: 260,
    streak: 8,
    todaySteps: 8900,
    todayWater: 3000,
    badge: '🥑 Fuel Pro'
  },
  {
    id: 'user-me',
    rank: 6,
    nickname: '@becky_slay',
    fullName: 'Becky Lam (You)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    points: 120,
    streak: 5,
    todaySteps: 7200,
    todayWater: 1750,
    badge: '✨ Rising Slay',
    isCurrentUser: true
  },
  {
    id: 'f-4',
    rank: 7,
    nickname: '@vy_slay',
    fullName: 'Vy Hoang',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    points: 150,
    streak: 4,
    todaySteps: 4500,
    todayWater: 1800,
    badge: '😴 Cozy Sleeper'
  }
];

// Recently Called Contacts
export const INITIAL_RECENT_CALLS = [
  {
    id: 'rc-1',
    name: 'Thao Lam (Mom)',
    nickname: '@thao_mom',
    relationship: 'Mother 💖',
    phone: '+84 91 999 8888',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    callType: 'incoming' as const,
    duration: '4 mins 12 secs',
    timeAgo: 'Today 18:30'
  },
  {
    id: 'rc-2',
    name: 'Ngan Lam',
    nickname: '@ltngen',
    relationship: 'Sister / Bestie 💅',
    phone: '+84 90 888 1122',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    callType: 'outgoing' as const,
    duration: '2 mins 05 secs',
    timeAgo: 'Yesterday 14:15'
  },
  {
    id: 'rc-3',
    name: 'Dr. Sarah Taylor',
    relationship: 'Dermatologist 🩺',
    phone: '+84 28 3822 9999',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    callType: 'outgoing' as const,
    duration: '1 min 30 secs',
    timeAgo: 'Aug 28, 10:00'
  },
  {
    id: 'rc-4',
    name: 'Minh Tran',
    nickname: '@minh_fit',
    relationship: 'Gym Partner 🏋️',
    phone: '+84 93 456 7890',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    callType: 'missed' as const,
    timeAgo: 'Aug 27, 21:10'
  },
  {
    id: 'rc-5',
    name: 'Emergency Center 115',
    relationship: 'National Ambulance 🚨',
    phone: '115',
    callType: 'outgoing' as const,
    duration: 'Emergency Hotline',
    timeAgo: 'Medical Dispatch'
  }
];

