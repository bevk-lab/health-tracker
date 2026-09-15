import React, { useState } from 'react';
import { JournalEntry } from '../types';
import {
  BookOpen,
  PlusCircle,
  Sparkles,
  Trash2,
  Tag,
  Clock,
  Heart,
  Smile
} from 'lucide-react';

interface DiaryViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const DiaryView: React.FC<DiaryViewProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('slaying');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Energy', 'Mindset']);
  const [isSuccess, setIsSuccess] = useState(false);

  const moodOptions: { id: JournalEntry['mood']; emoji: string; label: string; bg: string }[] = [
    { id: 'slaying', emoji: '💅', label: 'Slaying', bg: 'bg-pink-300' },
    { id: 'vibing', emoji: '✨', label: 'Vibing', bg: 'bg-yellow-300' },
    { id: 'cozy', emoji: '☕', label: 'Cozy', bg: 'bg-orange-300' },
    { id: 'tired', emoji: '😴', label: 'Tired', bg: 'bg-purple-300' },
    { id: 'anxious', emoji: '🥺', label: 'Anxious', bg: 'bg-sky-300' }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tToRemove: string) => {
    setTags(tags.filter((t) => t !== tToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const selectedMoodObj = moodOptions.find((m) => m.id === mood);

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      title,
      content,
      mood,
      moodEmoji: selectedMoodObj?.emoji || '💅',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tags: tags.length > 0 ? tags : ['Brain Dump'],
      createdAt: new Date().toISOString()
    };

    onAddEntry(newEntry);
    setTitle('');
    setContent('');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 2500);
  };

  return (
    <div id="view-diary" className="space-y-6 animate-fadeIn">
      {/* Title Banner */}
      <div className="bg-[#e9d5ff] border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
        <div>
          <div className="inline-block bg-white border-2 border-slate-900 px-2.5 py-0.5 rounded-full text-xs font-black text-purple-900 mb-1 shadow-[1px_1px_0px_0px_#000]">
            PAGE 5: BRAIN DUMP & WELLNESS DIARY 🧠💭
          </div>
          <h2 className="text-2xl font-black text-slate-900">Brain Dump & Vibe Log</h2>
          <p className="text-xs font-semibold text-slate-700">
            Vent your thoughts, log your hydration wins, and unload mental stress. Synced with Cloud Firestore.
          </p>
        </div>
        <span className="text-4xl">📝💭💅</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: New Entry Form (Span 5) */}
        <div className="lg:col-span-5 bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-900">
            <PlusCircle size={20} className="text-purple-600" />
            <h3 className="font-black text-base text-slate-900">New Brain Dump</h3>
          </div>

          {isSuccess && (
            <div className="bg-purple-100 border-2 border-purple-500 rounded-2xl p-2.5 text-xs font-black text-purple-900 flex items-center gap-2 animate-fadeIn">
              <Sparkles size={16} />
              <span>Brain dump saved & 20 pts added! ✨</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Mood Selector */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                How are you feeling right now? 🌈
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {moodOptions.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`py-2 px-1 rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center text-xs font-black transition-all cursor-pointer ${
                      mood === m.id
                        ? `${m.bg} shadow-[2px_2px_0px_0px_#000] scale-105`
                        : 'bg-[#f8fafc] hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <span className="text-[9px] mt-0.5">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Headline / Tea Title ✨
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Drank 2.5L water & crushed my test!"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Unfiltered Brain Dump 💭
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Spill everything: what did you eat, how did your body feel, did your heart race, what made you smile..."
                rows={4}
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl p-3 text-xs font-semibold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Custom Tag Manager */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Vibe Tags 🏷️
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag (e.g. Sleep, Stress)"
                  className="flex-1 bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-[1px_1px_0px_0px_#000]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-yellow-300 hover:bg-yellow-400 text-slate-900 border-2 border-slate-900 px-3 rounded-xl text-xs font-black shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                >
                  + Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-purple-100 border border-slate-900 text-purple-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-500 cursor-pointer font-black"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-300 hover:bg-purple-400 text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-xs shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles size={16} />
              <span>Log Brain Dump & Claim Pts 💅</span>
            </button>
          </form>
        </div>

        {/* Right: Masonry Grid of Past Entries (Span 7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
              <span>Past Journal Entries</span>
              <span className="text-xs bg-yellow-300 border border-slate-900 px-2 py-0.2 rounded-full font-black">
                {entries.length} Entries
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {entries.map((item) => (
              <div
                key={item.id}
                className="bg-white border-3 border-slate-900 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col justify-between hover:scale-[1.01] transition-transform"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl p-1 bg-yellow-100 rounded-xl border border-slate-900">
                        {item.moodEmoji}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wide bg-purple-100 border border-slate-900 px-2 py-0.5 rounded-full text-purple-900">
                        {item.mood}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteEntry(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 mb-1.5 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-600 line-clamp-4 leading-relaxed mb-3">
                    {item.content}
                  </p>
                </div>

                <div>
                  {/* Tag chips */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold bg-slate-100 border border-slate-300 text-slate-700 px-1.5 py-0.2 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100">
                    <span>🗓️ {item.date}</span>
                    <span>⏰ {item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
