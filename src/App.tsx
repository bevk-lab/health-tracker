import React, { useState, useEffect } from 'react';
import {
  PageType,
  VitalsRecord,
  Appointment,
  JournalEntry,
  UserProfile,
  MotivationalQuote,
  Friend,
  MOTIVATIONAL_QUOTES
} from './types';
import {
  INITIAL_VITALS,
  INITIAL_APPOINTMENTS,
  INITIAL_JOURNAL,
  INITIAL_USER,
  INITIAL_FRIENDS
} from './mockData';
import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  deleteDoc,
  updateDoc,
  FirebaseUser
} from './firebase';

// Extracted Sub-Components
import { Sidebar } from './components/Sidebar';
import { EmergencyFABs } from './components/EmergencyFABs';
import { GenZMotivationModal } from './components/GenZMotivationModal';
import { AuthModal } from './components/AuthModal';
import { SyncStatusBadge } from './components/SyncStatusBadge';
import { HeaderSearchBar } from './components/HeaderSearchBar';
import { LoginScreen } from './components/LoginScreen';
import { HomeView } from './components/HomeView';
import { InputMetricsView } from './components/InputMetricsView';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { DiaryView } from './components/DiaryView';
import { ProfileView } from './components/ProfileView';
import { SocialView } from './components/SocialView';
import { VitalsReminderToast } from './components/VitalsReminderToast';
import { PrizeClaimModal } from './components/PrizeClaimModal';
import { PrizeClaimShipment } from './types';

import { Menu, Sparkles, Clock, Calendar, Heart, ShieldAlert, Cloud } from 'lucide-react';

export default function App() {
  // Preliminary Authentication Screen State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('slayhealth_authenticated');
    return saved === 'true';
  });

  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Application Data States
  const [vitals, setVitals] = useState<VitalsRecord[]>(() => {
    const saved = localStorage.getItem('slayhealth_vitals');
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('slayhealth_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [journal, setJournal] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('slayhealth_journal');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('slayhealth_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('slayhealth_friends');
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  // Gamification States
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('slayhealth_points');
    return saved ? JSON.parse(saved) : 120;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('slayhealth_streak');
    return saved ? JSON.parse(saved) : 5;
  });

  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [claimedRewards, setClaimedRewards] = useState<string[]>(() => {
    const saved = localStorage.getItem('slayhealth_claimed_rewards');
    return saved ? JSON.parse(saved) : (INITIAL_USER.claimedRewards || []);
  });

  // 100 PTS Prize Claim Modal State
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState<boolean>(false);

  // Hourly Vitals Reminder Toast States
  const [isVitalsToastOpen, setIsVitalsToastOpen] = useState<boolean>(false);
  const [vitalsToastData, setVitalsToastData] = useState<{ title: string; message: string }>({
    title: 'Hourly Vitals Check-in! ⏰💅',
    message: 'Hey bestie! Time for your hourly check-in. Log your Blood Pressure & Heart Rate to keep your wellness streak glowing!'
  });

  const handleTriggerVitalsReminderToast = (title?: string, message?: string) => {
    setVitalsToastData({
      title: title || 'Hourly Vitals Check-in! ⏰💅',
      message: message || 'Hey bestie! Time for your hourly health check-in. Log your Heart Rate, Blood Pressure & SpO2 to earn +15 PTS!'
    });
    setIsVitalsToastOpen(true);
  };

  // Fixed Header Live Clock & Date
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hourly Vitals Notification Scheduler (Checks every minute)
  useEffect(() => {
    const isEnabled = user.hourlyNotificationEnabled ?? true;
    if (!isEnabled) return;

    const intervalHours = user.notificationIntervalHours ?? 1;
    const intervalMs = intervalHours * 60 * 60 * 1000;

    const checkReminderInterval = setInterval(() => {
      const now = Date.now();
      const lastCheck = localStorage.getItem('slayhealth_last_hourly_reminder');
      const lastTimestamp = lastCheck ? parseInt(lastCheck, 10) : 0;

      if (!lastTimestamp || now - lastTimestamp >= intervalMs) {
        localStorage.setItem('slayhealth_last_hourly_reminder', now.toString());
        handleTriggerVitalsReminderToast(
          'Hourly Vitals Check-in! ⏰💅',
          `It's time for your ${intervalHours}h vitals check-in! Keep your vitals updated and stay slaying.`
        );
      }
    }, 60000); // check every 60s

    return () => clearInterval(checkReminderInterval);
  }, [user.hourlyNotificationEnabled, user.notificationIntervalHours]);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('slayhealth_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('slayhealth_vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem('slayhealth_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('slayhealth_journal', JSON.stringify(journal));
  }, [journal]);

  useEffect(() => {
    localStorage.setItem('slayhealth_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('slayhealth_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('slayhealth_points', JSON.stringify(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem('slayhealth_claimed_rewards', JSON.stringify(claimedRewards));
  }, [claimedRewards]);

  // ================= REAL-TIME CLOUD FIRESTORE SYNCHRONIZATION =================
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentFbUser) => {
      setFirebaseUser(currentFbUser);

      if (currentFbUser) {
        setIsSyncing(true);
        const userDocRef = doc(db, 'users', currentFbUser.uid);

        try {
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            // First time cloud user: initialize with default or existing profile
            const initialUserData: UserProfile = {
              uid: currentFbUser.uid,
              email: currentFbUser.email || undefined,
              nickname: user.nickname || '@becky_slay',
              fullName: currentFbUser.displayName || user.fullName || 'Becky Lam',
              phone: user.phone || '+84 90 123 4567',
              dob: user.dob || '2004-02-14',
              gender: user.gender || 'Female 🌸',
              address: user.address || '123 Nguyen Hue Blvd, District 1',
              avatarUrl: currentFbUser.photoURL || user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              emergencyContact: user.emergencyContact || INITIAL_USER.emergencyContact,
              knownAllergies: user.knownAllergies || INITIAL_USER.knownAllergies,
              goals: user.goals || INITIAL_USER.goals,
              points: points || 120,
              streak: streak || 5,
              claimedRewards: claimedRewards || [],
              isAnonymous: currentFbUser.isAnonymous
            };

            await setDoc(userDocRef, initialUserData);

            // Populate initial sample records in cloud subcollections
            for (const v of INITIAL_VITALS) {
              await setDoc(doc(db, 'users', currentFbUser.uid, 'vitals', v.id), v);
            }
            for (const a of INITIAL_APPOINTMENTS) {
              await setDoc(doc(db, 'users', currentFbUser.uid, 'appointments', a.id), a);
            }
            for (const j of INITIAL_JOURNAL) {
              await setDoc(doc(db, 'users', currentFbUser.uid, 'journal', j.id), j);
            }
          }
        } catch (err) {
          console.error('Error bootstrapping cloud profile:', err);
        }

        // 1. Subscribe to User Profile in Cloud
        const unsubProfile = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUser(data);
            if (data.points !== undefined) setPoints(data.points);
            if (data.streak !== undefined) setStreak(data.streak);
            if (data.claimedRewards) setClaimedRewards(data.claimedRewards);
            setLastSynced(new Date());
            setIsSyncing(false);
          }
        });

        // 2. Subscribe to Vitals Subcollection in Cloud
        const vitalsColRef = collection(db, 'users', currentFbUser.uid, 'vitals');
        const unsubVitals = onSnapshot(vitalsColRef, (snap) => {
          const list: VitalsRecord[] = [];
          snap.forEach((d) => {
            list.push({ id: d.id, ...(d.data() as any) });
          });
          if (list.length > 0) {
            list.sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime());
            setVitals(list);
          }
          setLastSynced(new Date());
          setIsSyncing(false);
        });

        // 3. Subscribe to Appointments Subcollection in Cloud
        const apptsColRef = collection(db, 'users', currentFbUser.uid, 'appointments');
        const unsubAppts = onSnapshot(apptsColRef, (snap) => {
          const list: Appointment[] = [];
          snap.forEach((d) => {
            list.push({ id: d.id, ...(d.data() as any) });
          });
          if (list.length > 0) {
            list.sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime());
            setAppointments(list);
          }
          setLastSynced(new Date());
          setIsSyncing(false);
        });

        // 4. Subscribe to Journal Subcollection in Cloud
        const journalColRef = collection(db, 'users', currentFbUser.uid, 'journal');
        const unsubJournal = onSnapshot(journalColRef, (snap) => {
          const list: JournalEntry[] = [];
          snap.forEach((d) => {
            list.push({ id: d.id, ...(d.data() as any) });
          });
          if (list.length > 0) {
            list.sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime());
            setJournal(list);
          }
          setLastSynced(new Date());
          setIsSyncing(false);
        });

        return () => {
          unsubProfile();
          unsubVitals();
          unsubAppts();
          unsubJournal();
        };
      } else {
        setIsSyncing(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Motivational Pop-up State
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(MOTIVATIONAL_QUOTES[0]);

  const handleNavigate = (page: PageType) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
      setIsPopupOpen(true);
    }
  };

  // Login handler from Preliminary Screen
  const handleLoginSuccess = (
    provider: 'google' | 'facebook' | 'instagram' | 'email' | 'guest',
    userDetails?: { name: string; email: string; nickname: string; avatarUrl: string }
  ) => {
    if (userDetails) {
      setUser((prev) => ({
        ...prev,
        fullName: userDetails.name,
        email: userDetails.email,
        nickname: userDetails.nickname,
        avatarUrl: userDetails.avatarUrl,
        authProvider: provider
      }));
    }
    setIsAuthenticated(true);
  };

  // Add friend to Squad from Search Bar or QR
  const handleAddFriend = (newFriend: Friend) => {
    if (!friends.some((f) => f.id === newFriend.id)) {
      setFriends((prev) => [newFriend, ...prev]);
      setPoints((prev) => prev + 15);
    }
  };

  // Vitals Save Handler (Cloud synced)
  const handleSaveVitals = async (record: VitalsRecord) => {
    setVitals((prev) => [...prev, record]);
    const nextPoints = points + 15;
    setPoints(nextPoints);

    if (firebaseUser) {
      setIsSyncing(true);
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'vitals', record.id), record);
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          points: nextPoints
        });
        setLastSynced(new Date());
      } catch (err) {
        console.error('Error saving vital to cloud:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    setCurrentPage('analytics');
  };

  // Gamification Daily Check-in (Cloud synced)
  const handleDailyCheckIn = async () => {
    if (!hasCheckedInToday) {
      setHasCheckedInToday(true);
      const nextPoints = points + 20;
      const nextStreak = streak + 1;
      setPoints(nextPoints);
      setStreak(nextStreak);

      if (firebaseUser) {
        setIsSyncing(true);
        try {
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            points: nextPoints,
            streak: nextStreak,
            lastCheckInDate: new Date().toISOString().split('T')[0]
          });
          setLastSynced(new Date());
        } catch (err) {
          console.error('Error updating check-in to cloud:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    }
  };

  // Redeem Reward (Cloud synced)
  const handleRedeemReward = async (rewardTitle: string, cost: number) => {
    // If it's the 100 PTS goal reward (Panadol & Band-aids Pack), always open the prize claim modal
    // which shows congratulations, thank-you note, and requires shipping address and phone number!
    if (cost === 100 || rewardTitle.includes('Panadol') || rewardTitle.includes('Band-aids')) {
      setIsPrizeModalOpen(true);
      return;
    }

    if (points >= cost && !claimedRewards.includes(rewardTitle)) {
      const nextPoints = points - cost;
      const nextClaimed = [...claimedRewards, rewardTitle];
      setPoints(nextPoints);
      setClaimedRewards(nextClaimed);

      if (firebaseUser) {
        setIsSyncing(true);
        try {
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            points: nextPoints,
            claimedRewards: nextClaimed
          });
          setLastSynced(new Date());
        } catch (err) {
          console.error('Error redeeming reward in cloud:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    }
  };

  // Confirm Prize Claim with Required Shipping Address & Phone (Cloud synced)
  const handleConfirmPrizeClaim = async (shipmentData: {
    recipientName: string;
    phone: string;
    address: string;
    notes?: string;
  }) => {
    const cost = 100;
    const rewardTitle = 'Panadol / Band-aids Pack 🩹';
    const nextPoints = Math.max(0, points - cost);
    const nextClaimed = claimedRewards.includes(rewardTitle)
      ? claimedRewards
      : [...claimedRewards, rewardTitle];

    const newShipment: PrizeClaimShipment = {
      id: 'SHIP-' + Date.now(),
      prizeTitle: 'SlayHealth 100 PTS Care Package (Panadol & Cute Band-aids 🩹)',
      pointsCost: cost,
      recipientName: shipmentData.recipientName,
      phone: shipmentData.phone,
      address: shipmentData.address,
      notes: shipmentData.notes || '',
      claimedAt: new Date().toISOString(),
      status: 'processing',
      trackingNumber: 'SLAY-SHIP-' + Math.floor(100000 + Math.random() * 900000)
    };

    const nextShipments = [newShipment, ...(user.claimedPrizeShipments || [])];
    const updatedUser: UserProfile = {
      ...user,
      points: nextPoints,
      claimedRewards: nextClaimed,
      claimedPrizeShipments: nextShipments,
      fullName: shipmentData.recipientName,
      phone: shipmentData.phone,
      address: shipmentData.address
    };

    setPoints(nextPoints);
    setClaimedRewards(nextClaimed);
    setUser(updatedUser);

    if (firebaseUser) {
      setIsSyncing(true);
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          points: nextPoints,
          claimedRewards: nextClaimed,
          claimedPrizeShipments: nextShipments,
          fullName: shipmentData.recipientName,
          phone: shipmentData.phone,
          address: shipmentData.address
        });
        setLastSynced(new Date());
      } catch (err) {
        console.error('Error recording prize claim to cloud:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Appointments handlers (Cloud synced)
  const handleAddAppointment = async (apt: Appointment) => {
    setAppointments((prev) => [...prev, apt]);
    const nextPoints = points + 10;
    setPoints(nextPoints);

    if (firebaseUser) {
      setIsSyncing(true);
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'appointments', apt.id), apt);
        await updateDoc(doc(db, 'users', firebaseUser.uid), { points: nextPoints });
        setLastSynced(new Date());
      } catch (err) {
        console.error('Error saving appointment to cloud:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));

    if (firebaseUser) {
      setIsSyncing(true);
      try {
        await deleteDoc(doc(db, 'users', firebaseUser.uid, 'appointments', id));
        setLastSynced(new Date());
      } catch (err) {
        console.error('Error deleting appointment from cloud:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Journal handlers (Cloud synced)
  const handleAddJournal = async (entry: JournalEntry) => {
    setJournal((prev) => [entry, ...prev]);
    const nextPoints = points + 20;
    setPoints(nextPoints);

    if (firebaseUser) {
      setIsSyncing(true);
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'journal', entry.id), entry);
        await updateDoc(doc(db, 'users', firebaseUser.uid), { points: nextPoints });
        setLastSynced(new Date());
      } catch (err) {
        console.error('Error saving journal to cloud:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleDeleteJournal = async (id: string) => {
    setJournal((prev) => prev.filter((j) => j.id !== id));

    if (firebaseUser) {
      setIsSyncing(true);
      try {
        await deleteDoc(doc(db, 'users', firebaseUser.uid, 'journal', id));
        setLastSynced(new Date());
      } catch (err) {
        console.error('Error deleting journal from cloud:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Profile update handler (Cloud synced)
  const handleUpdateProfile = async (updated: UserProfile) => {
    setUser(updated);

    if (firebaseUser) {
      setIsSyncing(true);
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true });
        setLastSynced(new Date());
      } catch (err) {
        console.error('Error syncing profile update to cloud:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Sign out error:', err);
      setIsAuthenticated(false);
    }
  };

  // If user is not yet logged in, show the Preliminary Authentication Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Format date and time for Fixed Header
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#fdf2f8] text-slate-900 font-sans flex flex-col selection:bg-yellow-300 selection:text-slate-900">
      {/* ================= FIXED HEADER WITH SEARCH BAR ================= */}
      <header
        id="app-fixed-header"
        className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b-3 border-slate-900 shadow-[0px_4px_0px_0px_#0f172a] px-3 sm:px-4 py-2.5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Hamburger Menu Button & Clickable App Logo/Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Hamburger button: triggers collapsible sidebar */}
            <button
              id="header-hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-yellow-300 hover:bg-yellow-400 text-slate-900 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} className="stroke-[2.5]" />
            </button>

            {/* Clickable App Logo / Avatar: ALWAYS navigates to Home */}
            <button
              id="header-app-logo-btn"
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 cursor-pointer group text-left transition-transform active:scale-95"
              title="Return to Home Dashboard"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-400 to-yellow-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-xl overflow-hidden group-hover:rotate-3 transition-transform">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-1">
                  <span className="font-black text-base text-slate-900 tracking-tight leading-none group-hover:text-purple-700 transition-colors">
                    SlayHealth
                  </span>
                  <span className="text-[10px] bg-yellow-300 border border-slate-900 px-1 py-0.2 rounded-full font-black">
                    Squad 👥
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{user.nickname || '@becky_slay'}</span>
              </div>
            </button>
          </div>

          {/* Center: Global Search Bar for Friends/Family Nicknames (e.g. @ltngen) */}
          <div className="flex-1 max-w-md mx-1 sm:mx-2">
            <HeaderSearchBar
              friends={friends}
              onAddFriend={handleAddFriend}
              onSelectFriend={() => handleNavigate('social')}
            />
          </div>

          {/* Right: Cloud Sync Badge, Clock & Points Pill */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cloud Sync Status Indicator */}
            <SyncStatusBadge
              user={user}
              isLoggedIn={!!firebaseUser}
              isSyncing={isSyncing}
              lastSynced={lastSynced}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onSignOut={handleSignOut}
            />

            {/* Clock badge */}
            <div
              id="header-datetime-badge"
              className="hidden lg:flex bg-purple-100 border-2 border-slate-900 px-2.5 py-1 rounded-2xl shadow-[2px_2px_0px_0px_#000] items-center gap-1.5 text-xs font-black text-purple-900"
            >
              <span>🗓️ {formattedDate}</span>
              <span className="text-pink-600 font-extrabold">⏰ {formattedTime}</span>
            </div>

            {/* Points pill in header */}
            <button
              onClick={() => handleNavigate('social')}
              className="flex items-center gap-1 bg-yellow-300 border-2 border-slate-900 px-2.5 py-1 rounded-2xl shadow-[2px_2px_0px_0px_#000] text-xs font-black cursor-pointer hover:bg-yellow-400 active:translate-y-0.5 transition-transform"
              title="View Squad Leaderboard"
            >
              <Sparkles size={13} className="text-purple-700" />
              <span>{points} pts</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= COLLAPSIBLE SIDEBAR ================= */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        points={points}
        streak={streak}
        isLoggedIn={!!firebaseUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* ================= CLOUD AUTHENTICATION MODAL ================= */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        isLoggedIn={!!firebaseUser}
        onSignOut={handleSignOut}
      />

      {/* ================= CENTRAL POPUP (MOTIVATIONAL HEALTH REMINDER) ================= */}
      <GenZMotivationModal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        quote={currentQuote}
      />

      {/* ================= EMERGENCY FABS CLUSTER & GEMINI CHATBOT (PERSISTENT ON ALL PAGES) ================= */}
      <EmergencyFABs
        user={user}
        latestVitals={vitals.length > 0 ? vitals[vitals.length - 1] : null}
      />

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-24 pb-28">
        {currentPage === 'home' && (
          <HomeView
            user={user}
            vitals={vitals}
            appointments={appointments}
            points={points}
            streak={streak}
            hasCheckedInToday={hasCheckedInToday}
            claimedRewards={claimedRewards}
            onCheckIn={handleDailyCheckIn}
            onRedeemReward={handleRedeemReward}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            isLoggedIn={!!firebaseUser}
          />
        )}

        {currentPage === 'input' && <InputMetricsView onSave={handleSaveVitals} />}

        {currentPage === 'analytics' && <AnalyticsView vitals={vitals} user={user} />}

        {currentPage === 'calendar' && (
          <CalendarView
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}

        {currentPage === 'diary' && (
          <DiaryView
            entries={journal}
            onAddEntry={handleAddJournal}
            onDeleteEntry={handleDeleteJournal}
          />
        )}

        {currentPage === 'social' && (
          <SocialView
            user={user}
            friends={friends}
            onAddFriend={handleAddFriend}
            onUpdatePoints={(pts) => setPoints((p) => p + pts)}
          />
        )}

        {currentPage === 'profile' && (
          <ProfileView
            user={user}
            onUpdateProfile={handleUpdateProfile}
            isLoggedIn={!!firebaseUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenPrizeModal={() => setIsPrizeModalOpen(true)}
            onTriggerTestNotification={() =>
              handleTriggerVitalsReminderToast(
                'Hourly Vitals Check-in! ⏰💅',
                'Hey bestie! This is your live hourly reminder. Log your Heart Rate, Blood Pressure & SpO2 to keep your streak glowing!'
              )
            }
          />
        )}
      </main>

      {/* ================= HOURLY VITALS REMINDER TOAST NOTIFICATION ================= */}
      <VitalsReminderToast
        isOpen={isVitalsToastOpen}
        onClose={() => setIsVitalsToastOpen(false)}
        onLogVitals={() => handleNavigate('input')}
        title={vitalsToastData.title}
        message={vitalsToastData.message}
      />

      {/* ================= 100 PTS GOAL PRIZE CLAIM POP-UP MODAL ================= */}
      <PrizeClaimModal
        isOpen={isPrizeModalOpen}
        onClose={() => setIsPrizeModalOpen(false)}
        user={user}
        points={points}
        isAlreadyClaimed={
          claimedRewards.includes('Panadol / Band-aids Pack 🩹') ||
          claimedRewards.includes('Panadol & Cute Band-aids Pack 🩹') ||
          Boolean(user.claimedPrizeShipments && user.claimedPrizeShipments.length > 0)
        }
        existingShipment={user.claimedPrizeShipments?.[0] || null}
        onConfirmClaim={handleConfirmPrizeClaim}
      />

      {/* Bottom GenZ Status Strip */}
      <footer className="py-3 px-4 text-center border-t-2 border-slate-900/10 text-[11px] font-bold text-slate-500">
        ✨ SlayHealth Squad Sync • Real-Time Firestore Security &amp; Gemini AI Wellness Co-pilot 💅
      </footer>
    </div>
  );
}
