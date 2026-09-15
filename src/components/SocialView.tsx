import React, { useState } from 'react';
import {
  UserProfile,
  Friend,
  LeaderboardUser
} from '../types';
import {
  QrCode,
  Camera,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Heart,
  Zap,
  UserPlus,
  Send,
  X,
  Check,
  Copy,
  Share2,
  Smile,
  Swords,
  Footprints,
  Droplets,
  Search,
  MessageCircle
} from 'lucide-react';
import { INITIAL_LEADERBOARD } from '../mockData';

interface SocialViewProps {
  user: UserProfile;
  friends: Friend[];
  onAddFriend: (friend: Friend) => void;
  onUpdatePoints?: (pointsToAdd: number) => void;
}

export const SocialView: React.FC<SocialViewProps> = ({
  user,
  friends,
  onAddFriend,
  onUpdatePoints
}) => {
  // Modal states
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'qrcode'>('friends');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'weekly' | 'alltime' | 'family'>('weekly');
  
  // Interaction modals state
  const [motivateModalFriend, setMotivateModalFriend] = useState<Friend | null>(null);
  const [provokeModalFriend, setProvokeModalFriend] = useState<Friend | null>(null);
  
  // Motivate preset choice and sent state
  const [motivatePreset, setMotivatePreset] = useState('💅 Slay queen! You are crushing your goals today!');
  const [isMotivateSent, setIsMotivateSent] = useState(false);

  // Provoke preset choice, sent state and simulated reply
  const [provokePreset, setProvokePreset] = useState('👀 Only 3,000 steps today bestie? My grandma walks faster! 👟');
  const [isProvokeSent, setIsProvokeSent] = useState(false);
  const [friendReply, setFriendReply] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText(`https://slayhealth.app/join?ref=${user.nickname || '@becky_slay'}`);
    setCopiedLink(true);
    showToast('✨ SlayCode invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateScan = (mockFriend: Friend) => {
    onAddFriend(mockFriend);
    setIsQRScannerOpen(false);
    showToast(`🎉 Scanned QR Code! Added ${mockFriend.nickname} to your Squad! +25 Points!`);
    if (onUpdatePoints) onUpdatePoints(25);
  };

  const handleSendMotivate = () => {
    if (!motivateModalFriend) return;
    setIsMotivateSent(true);
    if (onUpdatePoints) onUpdatePoints(10);
    showToast(`💖 Sent cheer to ${motivateModalFriend.nickname}! +10 Karma PTS!`);
    setTimeout(() => {
      setIsMotivateSent(false);
      setMotivateModalFriend(null);
    }, 1800);
  };

  const handleSendProvoke = () => {
    if (!provokeModalFriend) return;
    setIsProvokeSent(true);

    const replies: Record<string, string> = {
      '@ltngen': "OMG the disrespect! 😂 Challenge accepted! Putting on my sneakers rn, see you at 15,000 steps! 🏃‍♀️💨",
      '@minh_fit': "Hahaha wait until you see my gym split tonight! You're eating dust! 🏋️🔥",
      '@hoa_zen': "I'm sipping my iced matcha peacefully while already at 11k steps darling! 🍵💅",
      '@vy_slay': "You woke me up from my power nap for this? Game on! 😼✨",
      '@thao_mom': "Con gái ngoan! Mẹ đi bộ từ 5h sáng rồi nha! Mau uống nước đi! 🌸💖"
    };

    const reply = replies[provokeModalFriend.nickname] || "Challenge accepted! You're going down on the leaderboard! ⚔️🔥";

    setTimeout(() => {
      setFriendReply(reply);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-purple-900 text-yellow-300 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#000] animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 border-4 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#0f172a] text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-2">
            <Sparkles size={14} className="text-purple-600" />
            <span>Squad Hub & Gamified Health</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[2px_2px_0px_#0f172a]">
            Social Slay & Squad Circle 👥💅
          </h2>
          <p className="text-xs sm:text-sm font-bold text-purple-950 mt-1 max-w-xl">
            Compare daily steps, send motivational cheers, engage in friendly step duels, and scan QR codes to connect with your circle!
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="social-scan-qr-btn"
            onClick={() => setIsQRScannerOpen(true)}
            className="flex items-center gap-1.5 bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-black px-4 py-2.5 rounded-2xl border-3 border-slate-900 shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all text-xs sm:text-sm cursor-pointer"
          >
            <Camera size={16} /> Scan Friend QR 📷
          </button>
          <button
            onClick={() => setActiveTab('qrcode')}
            className="flex items-center gap-1.5 bg-white hover:bg-pink-100 text-slate-900 font-black px-4 py-2.5 rounded-2xl border-3 border-slate-900 shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all text-xs sm:text-sm cursor-pointer"
          >
            <QrCode size={16} /> My SlayCode 🎟️
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex bg-white p-1.5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'friends'
              ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_#000]'
              : 'text-slate-700 hover:bg-purple-50'
          }`}
        >
          <Heart size={15} /> Squad List ({friends.length})
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-yellow-400 text-slate-900 shadow-[2px_2px_0px_0px_#000]'
              : 'text-slate-700 hover:bg-yellow-50'
          }`}
        >
          <Trophy size={15} /> Slay Leaderboard 🏆
        </button>

        <button
          onClick={() => setActiveTab('qrcode')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'qrcode'
              ? 'bg-pink-500 text-white shadow-[2px_2px_0px_0px_#000]'
              : 'text-slate-700 hover:bg-pink-50'
          }`}
        >
          <QrCode size={15} /> My QR Code & Share 🔗
        </button>
      </div>

      {/* TAB 1: FRIENDS LIST WITH MOTIVATE & PROVOKE */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <span>My Active Health Squad</span>
              <span className="text-xs bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-full font-bold">
                {friends.length} Besties
              </span>
            </h3>
            <p className="text-xs font-bold text-slate-500 hidden sm:block">
              Click Motivate to send cheers or Provoke to start a step duel! ⚔️
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white border-3 border-slate-900 rounded-3xl p-4 sm:p-5 shadow-[5px_5px_0px_0px_#0f172a] flex flex-col justify-between space-y-4 hover:-translate-y-0.5 transition-transform"
              >
                {/* Header Profile */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.fullName}
                        className="w-13 h-13 rounded-2xl border-2 border-slate-900 object-cover shadow-[2px_2px_0px_0px_#000]"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-sm sm:text-base text-slate-900">
                          {friend.fullName}
                        </h4>
                        <span className="text-[11px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded-md border border-purple-300">
                          {friend.nickname}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">{friend.status}</p>
                    </div>
                  </div>

                  <div className="bg-orange-100 border-2 border-slate-900 px-2 py-1 rounded-xl flex items-center gap-1 text-xs font-black text-orange-700 shadow-[1.5px_1.5px_0px_0px_#000]">
                    <Flame size={13} className="fill-orange-400" />
                    <span>{friend.streak}d</span>
                  </div>
                </div>

                {/* Vitals / Stats Badges */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 border-2 border-slate-900 rounded-2xl p-2.5 text-xs font-black">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-yellow-200 border border-slate-900 flex items-center justify-center text-sm">
                      👟
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Today Steps</div>
                      <div className="text-slate-900 font-extrabold">{friend.todaySteps.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-200 border border-slate-900 flex items-center justify-center text-sm">
                      💧
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Hydration</div>
                      <div className="text-slate-900 font-extrabold">{friend.todayWater} ml</div>
                    </div>
                  </div>
                </div>

                {/* Badges Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {friend.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-50 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-lg text-[10px] font-black"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: Motivate 💖 & Provoke 🔥 */}
                <div className="flex items-center gap-2.5 pt-2 border-t-2 border-slate-100">
                  {/* Motivate Button */}
                  <button
                    id={`btn-motivate-${friend.id}`}
                    onClick={() => {
                      setMotivateModalFriend(friend);
                      setIsMotivateSent(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-pink-400 hover:bg-pink-500 text-slate-900 font-black py-2.5 px-3 rounded-2xl border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#000] active:translate-y-0.5 transition-all text-xs cursor-pointer"
                  >
                    <Heart size={14} className="fill-pink-200" />
                    <span>Motivate 💖</span>
                  </button>

                  {/* Provoke Button */}
                  <button
                    id={`btn-provoke-${friend.id}`}
                    onClick={() => {
                      setProvokeModalFriend(friend);
                      setIsProvokeSent(false);
                      setFriendReply(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-black py-2.5 px-3 rounded-2xl border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#000] active:translate-y-0.5 transition-all text-xs cursor-pointer"
                  >
                    <Swords size={14} />
                    <span>Provoke 🔥</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GAMIFIED LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-5">
          {/* Subfilter */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl border-2 border-slate-900">
              <button
                onClick={() => setLeaderboardFilter('weekly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  leaderboardFilter === 'weekly' ? 'bg-yellow-300 text-slate-900 shadow-[1px_1px_0px_0px_#000]' : 'text-slate-600'
                }`}
              >
                🌟 Weekly Slay
              </button>
              <button
                onClick={() => setLeaderboardFilter('alltime')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  leaderboardFilter === 'alltime' ? 'bg-yellow-300 text-slate-900 shadow-[1px_1px_0px_0px_#000]' : 'text-slate-600'
                }`}
              >
                👑 All Time
              </button>
              <button
                onClick={() => setLeaderboardFilter('family')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  leaderboardFilter === 'family' ? 'bg-yellow-300 text-slate-900 shadow-[1px_1px_0px_0px_#000]' : 'text-slate-600'
                }`}
              >
                💖 Family Circle
              </button>
            </div>

            <span className="text-xs font-extrabold text-purple-700 bg-purple-100 border border-purple-300 px-3 py-1 rounded-full">
              Reset in: 2 days 14 hours ⏳
            </span>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4">
            {/* Rank 2 (Silver) */}
            <div className="bg-slate-100 border-3 border-slate-900 rounded-3xl p-3 sm:p-4 text-center shadow-[4px_4px_0px_0px_#0f172a] flex flex-col items-center justify-end h-56 sm:h-64 relative order-1">
              <div className="absolute -top-3 w-8 h-8 rounded-full bg-slate-300 border-2 border-slate-900 flex items-center justify-center font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
                🥈
              </div>
              <img
                src={INITIAL_LEADERBOARD[1].avatarUrl}
                alt="Rank 2"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-slate-900 object-cover mb-2"
                referrerPolicy="no-referrer"
              />
              <div className="font-black text-xs sm:text-sm text-slate-900 truncate w-full">
                {INITIAL_LEADERBOARD[1].fullName}
              </div>
              <div className="text-[10px] font-black text-purple-700">{INITIAL_LEADERBOARD[1].nickname}</div>
              <div className="mt-2 bg-purple-200 border border-slate-900 px-2 py-0.5 rounded-full text-[11px] font-black text-purple-900">
                {INITIAL_LEADERBOARD[1].points} PTS
              </div>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="bg-yellow-100 border-3 border-slate-900 rounded-3xl p-3 sm:p-4 text-center shadow-[6px_6px_0px_0px_#f59e0b] flex flex-col items-center justify-end h-64 sm:h-72 relative order-2 -translate-y-2">
              <div className="absolute -top-5 w-10 h-10 rounded-full bg-yellow-400 border-2 border-slate-900 flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_#000] animate-bounce">
                👑
              </div>
              <img
                src={INITIAL_LEADERBOARD[0].avatarUrl}
                alt="Rank 1"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 border-slate-900 object-cover mb-2 shadow-[2px_2px_0px_0px_#000]"
                referrerPolicy="no-referrer"
              />
              <div className="font-black text-xs sm:text-base text-slate-900 truncate w-full">
                {INITIAL_LEADERBOARD[0].fullName}
              </div>
              <div className="text-[10px] font-black text-pink-700">{INITIAL_LEADERBOARD[0].nickname}</div>
              <div className="mt-2 bg-yellow-300 border border-slate-900 px-2.5 py-1 rounded-full text-xs font-black text-slate-900 shadow-[1px_1px_0px_0px_#000]">
                {INITIAL_LEADERBOARD[0].points} PTS 🥇
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="bg-orange-50 border-3 border-slate-900 rounded-3xl p-3 sm:p-4 text-center shadow-[4px_4px_0px_0px_#0f172a] flex flex-col items-center justify-end h-52 sm:h-60 relative order-3">
              <div className="absolute -top-3 w-8 h-8 rounded-full bg-orange-300 border-2 border-slate-900 flex items-center justify-center font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
                🥉
              </div>
              <img
                src={INITIAL_LEADERBOARD[2].avatarUrl}
                alt="Rank 3"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-slate-900 object-cover mb-2"
                referrerPolicy="no-referrer"
              />
              <div className="font-black text-xs sm:text-sm text-slate-900 truncate w-full">
                {INITIAL_LEADERBOARD[2].fullName}
              </div>
              <div className="text-[10px] font-black text-purple-700">{INITIAL_LEADERBOARD[2].nickname}</div>
              <div className="mt-2 bg-orange-200 border border-slate-900 px-2 py-0.5 rounded-full text-[11px] font-black text-orange-900">
                {INITIAL_LEADERBOARD[2].points} PTS
              </div>
            </div>
          </div>

          {/* Full Ranked Table */}
          <div className="bg-white border-3 border-slate-900 rounded-3xl overflow-hidden shadow-[5px_5px_0px_0px_#0f172a]">
            <div className="p-3.5 bg-slate-100 border-b-2 border-slate-900 flex items-center justify-between text-xs font-black text-slate-700">
              <span>Leaderboard Standings</span>
              <span>Daily Stats & Total PTS</span>
            </div>

            <div className="divide-y-2 divide-slate-100">
              {INITIAL_LEADERBOARD.map((item) => {
                const isMe = item.isCurrentUser;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-center justify-between gap-3 ${
                      isMe ? 'bg-yellow-100 font-extrabold border-l-6 border-purple-600' : 'hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 font-black text-sm text-slate-700 text-center">
                        #{item.rank}
                      </span>
                      <img
                        src={item.avatarUrl}
                        alt={item.fullName}
                        className="w-10 h-10 rounded-xl border-2 border-slate-900 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {item.fullName}
                          </span>
                          {isMe && (
                            <span className="bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-bold text-purple-700">{item.nickname} • {item.badge}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block text-[11px] font-bold text-slate-500">
                        <div>👟 {item.todaySteps.toLocaleString()} steps</div>
                        <div>💧 {item.todayWater} ml</div>
                      </div>
                      <div className="bg-white border-2 border-slate-900 px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm text-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]">
                        {item.points} PTS
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERSONAL QR CODE & SCAN CARD */}
      {activeTab === 'qrcode' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: My Personal Aesthetic QR Card */}
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_#ec4899] flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-900 border border-pink-300 px-3 py-1 rounded-full text-xs font-black mb-4">
              <QrCode size={14} /> My SlayHealth Profile QR
            </div>

            {/* Generated Mock QR Matrix Visual */}
            <div className="relative p-4 bg-yellow-100 border-3 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_#000] mb-4">
              <svg className="w-48 h-48 sm:w-56 sm:h-56" viewBox="0 0 100 100" fill="none">
                {/* QR Pattern Representation */}
                <rect width="100" height="100" fill="#FEF08A" />
                {/* Outer corners */}
                <rect x="5" y="5" width="26" height="26" fill="#0F172A" rx="4" />
                <rect x="9" y="9" width="18" height="18" fill="#FEF08A" rx="2" />
                <rect x="13" y="13" width="10" height="10" fill="#0F172A" rx="1" />

                <rect x="69" y="5" width="26" height="26" fill="#0F172A" rx="4" />
                <rect x="73" y="9" width="18" height="18" fill="#FEF08A" rx="2" />
                <rect x="77" y="13" width="10" height="10" fill="#0F172A" rx="1" />

                <rect x="5" y="69" width="26" height="26" fill="#0F172A" rx="4" />
                <rect x="9" y="73" width="18" height="18" fill="#FEF08A" rx="2" />
                <rect x="13" y="77" width="10" height="10" fill="#0F172A" rx="1" />

                {/* Random QR Bit Matrix */}
                <rect x="36" y="8" width="6" height="6" fill="#0F172A" />
                <rect x="46" y="14" width="6" height="6" fill="#0F172A" />
                <rect x="56" y="8" width="6" height="6" fill="#0F172A" />
                <rect x="36" y="24" width="6" height="6" fill="#0F172A" />
                <rect x="48" y="28" width="6" height="6" fill="#0F172A" />
                
                <rect x="8" y="38" width="6" height="6" fill="#0F172A" />
                <rect x="18" y="46" width="6" height="6" fill="#0F172A" />
                <rect x="28" y="38" width="6" height="6" fill="#0F172A" />
                <rect x="68" y="38" width="6" height="6" fill="#0F172A" />
                <rect x="78" y="46" width="6" height="6" fill="#0F172A" />
                <rect x="86" y="38" width="6" height="6" fill="#0F172A" />

                <rect x="36" y="68" width="6" height="6" fill="#0F172A" />
                <rect x="46" y="74" width="6" height="6" fill="#0F172A" />
                <rect x="56" y="68" width="6" height="6" fill="#0F172A" />
                <rect x="68" y="68" width="6" height="6" fill="#0F172A" />
                <rect x="78" y="78" width="6" height="6" fill="#0F172A" />
                <rect x="88" y="68" width="6" height="6" fill="#0F172A" />
              </svg>

              {/* Center user avatar */}
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-2xl bg-white border-2 border-slate-900 p-0.5 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center overflow-hidden">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h4 className="font-black text-base text-slate-900">{user.fullName}</h4>
            <div className="text-xs font-black text-purple-700 bg-purple-100 border border-purple-300 px-3 py-0.5 rounded-full mt-1">
              {user.nickname || '@becky_slay'}
            </div>
            <p className="text-xs font-bold text-slate-500 mt-2">
              Let your friends scan this code to connect instantly and share vitals!
            </p>

            <div className="flex gap-2 w-full mt-5">
              <button
                onClick={handleCopyInvite}
                className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-black py-2.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] text-xs cursor-pointer"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy SlayLink'}</span>
              </button>

              <button
                onClick={() => showToast('📤 Share sheet opened on mobile device!')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black py-2.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] text-xs cursor-pointer"
              >
                <Share2 size={14} /> Share QR
              </button>
            </div>
          </div>

          {/* Card 2: Interactive Scanner Launcher & Direct Demo Scans */}
          <div className="bg-[#f0fdf4] border-4 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_#22c55e] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black mb-3">
                <Camera size={14} /> Live QR Scanner Hub
              </div>
              <h3 className="text-xl font-black text-slate-900">Scan & Add Squad Members</h3>
              <p className="text-xs font-bold text-slate-600 mt-1 mb-4">
                Scan your friend's phone screen or pick one of the verified health buddies below to test simulated QR detection!
              </p>

              <button
                onClick={() => setIsQRScannerOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 transition-all text-sm cursor-pointer mb-5"
              >
                <Camera size={18} /> Open Camera QR Scanner 📷
              </button>

              <div className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
                ⚡ Quick Scan Verified Friends:
              </div>

              <div className="space-y-2">
                {[
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
                    badges: ['👑 Top Slay', '👟 Step Beast'],
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
                    badges: ['🏋️ Gym Bro'],
                    relationship: 'Gym Buddy'
                  }
                ].map((demoFriend) => (
                  <div
                    key={demoFriend.id}
                    className="bg-white border-2 border-slate-900 rounded-2xl p-2.5 flex items-center justify-between shadow-[2px_2px_0px_0px_#000]"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={demoFriend.avatarUrl}
                        alt={demoFriend.fullName}
                        className="w-9 h-9 rounded-xl border border-slate-900 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-extrabold text-xs text-slate-900">{demoFriend.fullName}</div>
                        <div className="text-[10px] font-black text-purple-700">{demoFriend.nickname}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSimulateScan(demoFriend as Friend)}
                      className="bg-yellow-300 hover:bg-yellow-400 text-slate-900 text-[11px] font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                    >
                      Instant Scan ⚡
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-300 text-[11px] font-bold text-slate-500 text-center">
              Scanning gives +25 Social Slay Points on first connect! ✨
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CAMERA QR SCANNER ================= */}
      {isQRScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-[8px_8px_0px_0px_#22c55e] relative animate-zoomIn">
            <button
              onClick={() => setIsQRScannerOpen(false)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black mb-2">
                <Camera size={14} /> Live Viewfinder
              </div>
              <h3 className="text-xl font-black text-slate-900">Point Camera at SlayCode</h3>
              <p className="text-xs font-bold text-slate-500">Align the QR code within the frame to scan</p>
            </div>

            {/* Viewfinder Simulator */}
            <div className="relative w-full aspect-square bg-slate-950 rounded-2xl border-3 border-slate-900 overflow-hidden flex items-center justify-center mb-4">
              {/* Laser Scanning Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#22c55e] animate-bounce"></div>

              {/* Targeting Reticle */}
              <div className="w-48 h-48 border-2 border-dashed border-emerald-400 rounded-2xl relative flex items-center justify-center">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                  Scanning...
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleSimulateScan({
                    id: 'f-1',
                    nickname: '@ltngen',
                    fullName: 'Ngan Lam',
                    avatarUrl:
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
                    status: 'Slaying 10k steps today 👟',
                    streak: 12,
                    points: 340,
                    todaySteps: 10450,
                    todayWater: 2750,
                    badges: ['👑 Top Slay', '👟 Step Beast', '💧 Hydro Queen'],
                    isFavorite: true,
                    phone: '+84 90 888 1122',
                    relationship: 'Sister / Bestie'
                  })
                }
                className="w-full bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-black py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] text-xs cursor-pointer"
              >
                ⚡ Detect Code: @ltngen (Ngan Lam)
              </button>

              <button
                onClick={() => setIsQRScannerOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black py-2 rounded-xl border-2 border-slate-900 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MOTIVATE FRIEND 💖 ================= */}
      {motivateModalFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-pink-50 border-4 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-[8px_8px_0px_0px_#ec4899] relative animate-zoomIn">
            <button
              onClick={() => setMotivateModalFriend(null)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-white hover:bg-pink-100 text-slate-900 border-2 border-slate-900 rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <img
                src={motivateModalFriend.avatarUrl}
                alt={motivateModalFriend.fullName}
                className="w-12 h-12 rounded-2xl border-2 border-slate-900 object-cover shadow-[2px_2px_0px_0px_#000]"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] font-black text-pink-700 uppercase">Send Daily Slay Cheer</span>
                <h3 className="text-lg font-black text-slate-900">{motivateModalFriend.fullName}</h3>
                <span className="text-xs font-black text-purple-700">{motivateModalFriend.nickname}</span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-600 mb-3">
              Pick a motivational cheer sticker to brighten their day and keep their streak blazing:
            </p>

            <div className="space-y-2 mb-4">
              {[
                '💅 Slay queen! You are crushing your goals today!',
                '💧 Go drink your water bestie! Glow from inside out!',
                '✨ You got this presentation! Rooting for you!',
                '👟 Halfway to 10k steps! Put on your favorite playlist & walk!'
              ].map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => setMotivatePreset(text)}
                  className={`w-full text-left p-2.5 rounded-xl border-2 border-slate-900 text-xs font-black transition-all cursor-pointer ${
                    motivatePreset === text
                      ? 'bg-pink-400 text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-slate-800 hover:bg-pink-100'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>

            <button
              onClick={handleSendMotivate}
              disabled={isMotivateSent}
              className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-black py-3 rounded-2xl border-3 border-slate-900 shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all text-xs sm:text-sm cursor-pointer"
            >
              {isMotivateSent ? (
                <>
                  <Check size={16} /> Cheer Sent to {motivateModalFriend.nickname}! ✨
                </>
              ) : (
                <>
                  <Send size={16} /> Send Motivational Cheer (+10 PTS) 💖
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROVOKE / STEP DUEL 🔥 ================= */}
      {provokeModalFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-yellow-50 border-4 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-[8px_8px_0px_0px_#eab308] relative animate-zoomIn">
            <button
              onClick={() => setProvokeModalFriend(null)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-white hover:bg-yellow-100 text-slate-900 border-2 border-slate-900 rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000]">
                ⚔️
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-700 uppercase">Friendly Step Duel / Roast</span>
                <h3 className="text-lg font-black text-slate-900">Challenge {provokeModalFriend.fullName}</h3>
                <span className="text-xs font-black text-purple-700">{provokeModalFriend.nickname}</span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-600 mb-3">
              Select a playful Gen-Z banter provocation:
            </p>

            <div className="space-y-2 mb-4">
              {[
                '👀 Only 3,000 steps today bestie? My grandma walks faster! 👟',
                "💅 I'm 200 points ahead of you on the leaderboard, wake up!",
                '⚔️ Step Duel Challenge: First to 10,000 steps wins iced matcha boba! 🧋',
                '😴 Wake up bestie, your hydration streak is in severe danger! 💧'
              ].map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => setProvokePreset(text)}
                  className={`w-full text-left p-2.5 rounded-xl border-2 border-slate-900 text-xs font-black transition-all cursor-pointer ${
                    provokePreset === text
                      ? 'bg-yellow-300 text-slate-900 shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-slate-800 hover:bg-yellow-100'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>

            {!isProvokeSent ? (
              <button
                onClick={handleSendProvoke}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black py-3 rounded-2xl border-3 border-slate-900 shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all text-xs sm:text-sm cursor-pointer"
              >
                <Swords size={16} /> Send Step Duel Challenge! 🔥
              </button>
            ) : (
              <div className="space-y-3 bg-white border-2 border-slate-900 rounded-2xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                <div className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <Check size={14} /> Challenge Delivered to {provokeModalFriend.nickname}!
                </div>

                {friendReply ? (
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-3 animate-fadeIn">
                    <div className="text-[10px] font-black text-purple-700 mb-1 flex items-center gap-1">
                      <MessageCircle size={12} /> {provokeModalFriend.nickname} replied instantly:
                    </div>
                    <div className="text-xs font-bold text-slate-800 italic">
                      "{friendReply}"
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
                    <span>Waiting for {provokeModalFriend.nickname} to reply...</span>
                  </div>
                )}

                <button
                  onClick={() => setProvokeModalFriend(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-2 rounded-xl border border-slate-900 text-xs cursor-pointer"
                >
                  Dismiss Duel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
