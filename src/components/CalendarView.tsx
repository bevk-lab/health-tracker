import React, { useState } from 'react';
import { Appointment } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Stethoscope,
  PlusCircle,
  Trash2,
  CheckCircle,
  Sparkles,
  FileText
} from 'lucide-react';

interface CalendarViewProps {
  appointments: Appointment[];
  onAddAppointment: (apt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onAddAppointment,
  onDeleteAppointment
}) => {
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [time, setTime] = useState('14:00');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !location || !date || !time) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorName,
      specialty: specialty || 'Specialist Consultation 🩺',
      location,
      date,
      time,
      notes,
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newApt);
    setIsSuccess(true);
    setDoctorName('');
    setSpecialty('');
    setLocation('');
    setNotes('');

    setTimeout(() => {
      setIsSuccess(false);
    }, 2500);
  };

  return (
    <div id="view-calendar" className="space-y-6 animate-fadeIn">
      {/* Title Banner */}
      <div className="bg-[#bae6fd] border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
        <div>
          <div className="inline-block bg-white border-2 border-slate-900 px-2.5 py-0.5 rounded-full text-xs font-black text-sky-800 mb-1 shadow-[1px_1px_0px_0px_#000]">
            PAGE 4: DOCTOR APPOINTMENTS 🗓️
          </div>
          <h2 className="text-2xl font-black text-slate-900">Doctor Sheshes & Visits</h2>
          <p className="text-xs font-semibold text-slate-700">
            Never miss a medical checkup, skin consult, or dental sesh! Synced with Cloud Firestore.
          </p>
        </div>
        <span className="text-4xl">🩺🗓️✨</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Add Appointment Form (Span 5) */}
        <div className="lg:col-span-5 bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-900">
            <PlusCircle size={20} className="text-sky-600" />
            <h3 className="font-black text-base text-slate-900">Book New Sesh</h3>
          </div>

          {isSuccess && (
            <div className="bg-emerald-100 border-2 border-emerald-500 rounded-2xl p-3 text-xs font-black text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <CheckCircle size={16} />
              <span>Appointment saved to Cloud Database! ✨</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Doctor / Clinic Name 🩺
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Alex Wong"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Department / Specialty 🌸
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Dermatology & Acne Care, Dental Cleaning"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Clinic Address & Room 📍
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bloom Medical Center, 3rd Floor"
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Date 🗓️</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-2.5 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Time ⏰</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl px-2.5 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Prep Notes / Checklist 📝
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Fast for 8 hours, bring ID card, ask doctor about vitamin D..."
                rows={3}
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-xl p-2.5 text-xs font-semibold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-300 hover:bg-sky-400 text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-xs shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles size={15} />
              <span>Save & Sync Appointment 📅</span>
            </button>
          </form>
        </div>

        {/* Right Column: List of Saved Appointments (Span 7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
              <span>Upcoming Consultations</span>
              <span className="text-xs bg-yellow-300 border border-slate-900 px-2 py-0.2 rounded-full font-black">
                {appointments.length} Total
              </span>
            </h3>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white border-3 border-slate-900 rounded-3xl p-8 text-center shadow-[4px_4px_0px_0px_#0f172a]">
              <p className="text-sm font-black text-slate-800">No appointments scheduled!</p>
              <p className="text-xs text-slate-500 mt-1">Book your doctor visits in the form to the left.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white border-3 border-slate-900 rounded-3xl p-4.5 shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-0.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900">{apt.doctorName}</span>
                        <span className="text-[10px] font-black bg-sky-200 border border-slate-900 text-sky-900 px-2 py-0.5 rounded-full">
                          {apt.time}
                        </span>
                      </div>
                      {apt.specialty && (
                        <p className="text-xs font-bold text-purple-700 mt-0.5">{apt.specialty}</p>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteAppointment(apt.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg border border-transparent hover:border-slate-900 transition-colors cursor-pointer"
                      title="Cancel appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-1">
                      <CalendarIcon size={14} className="text-sky-600" />
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-orange-500" />
                      <span className="truncate max-w-[200px]">{apt.location}</span>
                    </div>
                  </div>

                  {apt.notes && (
                    <div className="mt-2.5 bg-yellow-50 border border-yellow-200 rounded-xl p-2 text-xs font-medium text-slate-700 flex items-start gap-1.5">
                      <FileText size={13} className="text-yellow-700 shrink-0 mt-0.5" />
                      <span>{apt.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
