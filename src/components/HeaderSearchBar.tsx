import React, { useState, useRef, useEffect } from 'react';
import { Search, UserPlus, Check, Sparkles, X, Flame, ShieldAlert, Heart } from 'lucide-react';
import { Friend } from '../types';
import { SEARCHABLE_USERS } from '../mockData';

interface HeaderSearchBarProps {
  friends: Friend[];
  onAddFriend: (user: Friend) => void;
  onSelectFriend?: (friend: Friend) => void;
}

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  friends,
  onAddFriend,
  onSelectFriend
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  
  // Filter matched squad members or new users by nickname or name
  const filteredUsers = SEARCHABLE_USERS.filter((user) => {
    if (!normalizedQuery) return true;
    const cleanNick = user.nickname.toLowerCase();
    const cleanName = user.fullName.toLowerCase();
    return cleanNick.includes(normalizedQuery) || cleanName.includes(normalizedQuery);
  });

  const handleAdd = (user: Friend, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddFriend(user);
    setAddedIds((prev) => ({ ...prev, [user.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [user.id]: false }));
    }, 3000);
  };

  const isFriendAlready = (id: string) => {
    return friends.some((f) => f.id === id);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
          <Search size={15} className="text-purple-600" />
        </div>
        <input
          id="global-friend-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder="Search friend nickname (e.g. @ltngen)..."
          className="w-full pl-9 pr-8 py-2 bg-white/90 focus:bg-white text-xs font-bold text-slate-900 border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_#0f172a] focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setIsFocused(false);
            }}
            className="absolute right-2.5 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isFocused && (
        <div
          id="friend-search-dropdown"
          className="absolute left-0 right-0 top-full mt-2 bg-white border-3 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] z-50 overflow-hidden max-h-80 overflow-y-auto animate-zoomIn"
        >
          <div className="p-2.5 bg-yellow-100 border-b-2 border-slate-900 flex items-center justify-between text-[11px] font-black text-slate-900">
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-purple-600" />
              Squad Search Results {searchQuery && `for "${searchQuery}"`}
            </span>
            <span className="text-[10px] text-slate-500 font-bold">
              {filteredUsers.length} found
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const alreadyAdded = isFriendAlready(user.id);
                const justAdded = addedIds[user.id];

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      if (onSelectFriend) onSelectFriend(user);
                      setIsFocused(false);
                    }}
                    className="p-2.5 hover:bg-purple-50 transition-colors flex items-center justify-between gap-2.5 cursor-pointer"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-9 h-9 rounded-xl border-2 border-slate-900 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border border-slate-900 rounded-full"></span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900 truncate">
                            {user.fullName}
                          </span>
                          <span className="text-[11px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded-md border border-purple-300">
                            {user.nickname}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold truncate">
                          <span className="flex items-center gap-0.5 text-orange-600 font-bold">
                            <Flame size={11} className="fill-orange-400" /> {user.streak}d streak
                          </span>
                          <span>•</span>
                          <span className="truncate">{user.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Add to Squad or Status */}
                    <div>
                      {alreadyAdded || justAdded ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-xl border border-emerald-400">
                          <Check size={11} /> Squad
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleAdd(user, e)}
                          className="inline-flex items-center gap-1 bg-yellow-300 hover:bg-yellow-400 text-slate-900 text-[11px] font-black px-2.5 py-1 rounded-xl border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer"
                        >
                          <UserPlus size={12} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs font-bold text-slate-500">
                No squad member found with "{searchQuery}". Try searching <span className="font-black text-purple-600">@ltngen</span> or <span className="font-black text-purple-600">@minh_fit</span>!
              </div>
            )}
          </div>

          <div className="p-2 bg-slate-50 border-t border-slate-200 text-center text-[10px] font-bold text-slate-500">
            Tip: Press Esc or click outside to dismiss
          </div>
        </div>
      )}
    </div>
  );
};
