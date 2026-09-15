import React, { useState, useEffect } from 'react';
import { UserProfile, PrizeClaimShipment } from '../types';
import {
  Trophy,
  Gift,
  X,
  Sparkles,
  MapPin,
  Phone,
  User,
  FileText,
  Truck,
  Heart,
  CheckCircle2,
  Package,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface PrizeClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  points: number;
  isAlreadyClaimed: boolean;
  existingShipment?: PrizeClaimShipment | null;
  onConfirmClaim: (shipmentData: {
    recipientName: string;
    phone: string;
    address: string;
    notes?: string;
  }) => Promise<void> | void;
}

export const PrizeClaimModal: React.FC<PrizeClaimModalProps> = ({
  isOpen,
  onClose,
  user,
  points,
  isAlreadyClaimed,
  existingShipment,
  onConfirmClaim
}) => {
  const [recipientName, setRecipientName] = useState<string>(user.fullName || 'Becky Lam');
  const [phone, setPhone] = useState<string>(user.phone || '+84 90 123 4567');
  const [address, setAddress] = useState<string>(user.address || '123 Nguyen Hue Blvd, District 1');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justClaimedShipment, setJustClaimedShipment] = useState<PrizeClaimShipment | null>(null);

  // Sync with user data if props update
  useEffect(() => {
    if (user) {
      if (!recipientName) setRecipientName(user.fullName || '');
      if (!phone) setPhone(user.phone || '');
      if (!address) setAddress(user.address || '');
    }
  }, [user]);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsSubmitting(false);
      if (existingShipment) {
        setJustClaimedShipment(existingShipment);
      } else {
        setJustClaimedShipment(null);
      }
    }
  }, [isOpen, existingShipment]);

  if (!isOpen) return null;

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation for address and phone number
    if (!address.trim()) {
      setErrorMessage('Please provide your complete delivery address to ship your prize!');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please provide your phone number so the courier can contact you!');
      return;
    }

    if (!recipientName.trim()) {
      setErrorMessage('Please enter the recipient full name!');
      return;
    }

    if (points < 100 && !isAlreadyClaimed) {
      setErrorMessage('You need at least 100 points to claim this prize milestone!');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmClaim({
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim()
      });

      // Show congratulations receipt view inside modal
      setJustClaimedShipment({
        id: 'SHIP-' + Date.now(),
        prizeTitle: 'SlayHealth 100 PTS Care Package (Panadol & Cute Band-aids 🩹)',
        pointsCost: 100,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        claimedAt: new Date().toISOString(),
        status: 'processing',
        trackingNumber: 'SLAY-SHIP-' + Math.floor(100000 + Math.random() * 900000)
      });
    } catch (err) {
      console.error('Error claiming prize:', err);
      setErrorMessage('Failed to submit claim. Please try again or check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayShipment = justClaimedShipment || existingShipment;
  const showReceipt = Boolean(displayShipment);

  return (
    <div
      id="prize-claim-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="prize-claim-modal-container"
        className="bg-[#fef9c3] border-3 sm:border-4 border-slate-900 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-[8px_8px_0px_0px_#0f172a] my-auto relative animate-popIn max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-xl sm:text-2xl shadow-[2px_2px_0px_0px_#000] shrink-0 animate-bounce">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-purple-600 text-yellow-300 border border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000] uppercase tracking-wider">
                  Goal Claim • 100 PTS Milestone 🎯
                </span>
                <span className="bg-emerald-300 border border-slate-900 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Free Member Gift 🎁
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-1">
                {showReceipt
                  ? '🎉 Prize Claim Confirmed & En Route! 🚚'
                  : '🎉 Congratulations on Claiming Your 100 PTS Prize! 🏆'}
              </h2>
            </div>
          </div>

          <button
            id="close-prize-modal-btn"
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-white hover:bg-red-50 text-slate-800 hover:text-red-600 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer shrink-0"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto pr-1 sm:pr-2 space-y-4 py-4 flex-1">
          {/* ================= SECTION 1: CONGRATULATIONS & PRIZE SHOWCASE ================= */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-purple-600 shrink-0" />
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                100 Points Health Champion Reward Pack
              </h3>
            </div>

            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              Huge congratulations, <strong className="text-purple-700 font-extrabold">{user.fullName || 'Bestie'}</strong>!
              You consistently showed up for yourself, logged your daily vitals, and crushed the <strong>100 PTS</strong> health milestone.
              Your physical prize package includes:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2 bg-pink-100 border border-slate-900 p-2 rounded-xl">
                <span className="text-base">🩹</span>
                <span>Cute Aesthetic Pastel Band-aids (50 pcs)</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-100 border border-slate-900 p-2 rounded-xl">
                <span className="text-base">💊</span>
                <span>Panadol Extra Pain &amp; Fever Relief</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-100 border border-slate-900 p-2 rounded-xl">
                <span className="text-base">⚡</span>
                <span>Daily Electrolyte Hydration Sachets</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 border border-slate-900 p-2 rounded-xl">
                <span className="text-base">💅</span>
                <span>SlayHealth Waterproof Holographic Stickers</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">Points Cost:</span>
              <span className="bg-yellow-300 border border-slate-900 px-2.5 py-0.5 rounded-full font-black text-slate-900 shadow-[1px_1px_0px_0px_#000]">
                100 PTS (Deducted upon claim)
              </span>
            </div>
          </div>

          {/* ================= SECTION 2: THE HEARTFELT THANKS NOTE (MANDATORY IN POP-UP) ================= */}
          <div
            id="prize-thanks-note-card"
            className="bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000] relative"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-pink-400 border border-slate-900 flex items-center justify-center text-white shadow-[1px_1px_0px_0px_#000]">
                <Heart size={15} className="fill-current text-white" />
              </div>
              <h3 className="font-black text-xs sm:text-sm text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
                <span>A Warm Thank You From SlayHealth</span>
                <span className="text-base">💌</span>
              </h3>
            </div>

            <blockquote className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed italic bg-white/90 border border-slate-900/30 p-3.5 rounded-xl shadow-sm">
              "Thank you so much for putting your health and well-being first with SlayHealth!
              Your dedication to logging your daily vitals, staying properly hydrated, and nurturing mindful habits
              inspires our entire wellness squad. We are deeply grateful to be part of your health journey, and
              this prize is our token of gratitude for showing up for yourself every single day. Keep glowing,
              staying healthy, and slaying! ✨💅"
            </blockquote>

            <div className="mt-2 text-right">
              <span className="text-[11px] font-black text-purple-900 tracking-tight">
                — With love &amp; health, The SlayHealth Team 🌸💖
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl text-xs font-black text-red-900 flex items-center gap-2 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0 text-red-700" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= SECTION 3: SHIPPING DETAILS FORM OR CONFIRMED RECEIPT ================= */}
          {showReceipt && displayShipment ? (
            /* Confirmed Order / Receipt View */
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Package className="text-emerald-600" size={18} />
                  <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                    Shipment Tracking
                  </span>
                </div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                  🚚 {displayShipment.status.toUpperCase()}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Tracking Code:</span>
                  <span className="font-mono font-black text-purple-700">{displayShipment.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Recipient Name:</span>
                  <span className="font-bold text-slate-800">{displayShipment.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Delivery Phone:</span>
                  <span className="font-bold text-slate-800">{displayShipment.phone}</span>
                </div>
                <div className="flex justify-between items-start pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-500 shrink-0 mr-2">Destination Address:</span>
                  <span className="font-bold text-slate-800 text-right">{displayShipment.address}</span>
                </div>
                {displayShipment.notes && (
                  <div className="flex justify-between items-start pt-1 border-t border-slate-200">
                    <span className="font-bold text-slate-500 shrink-0 mr-2">Delivery Note:</span>
                    <span className="font-semibold text-slate-700 text-right">{displayShipment.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Package is being packed with love! Estimated arrival: 2-3 business days.</span>
              </div>
            </div>
          ) : (
            /* Shipping Form Requiring Address and Phone Number */
            <form onSubmit={handleSubmitClaim} className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000] space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Truck className="text-purple-700" size={18} />
                <h4 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                  Shipping Information Required
                </h4>
                <span className="text-[10px] font-bold text-red-600 ml-auto">* All fields required</span>
              </div>

              {/* Recipient Full Name */}
              <div>
                <label
                  htmlFor="claim-recipient-name"
                  className="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5"
                >
                  <User size={13} className="text-purple-600" />
                  <span>Full Name of Recipient:</span>
                </label>
                <input
                  id="claim-recipient-name"
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Becky Lam"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Contact Phone Number (Required) */}
              <div>
                <label
                  htmlFor="claim-phone"
                  className="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5"
                >
                  <Phone size={13} className="text-emerald-600" />
                  <span>Phone Number for Courier Contact: *</span>
                </label>
                <input
                  id="claim-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +84 90 123 4567"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <p className="text-[10px] font-semibold text-slate-500 mt-1">
                  The local delivery courier will call this number before arrival.
                </p>
              </div>

              {/* Delivery Address (Required) */}
              <div>
                <label
                  htmlFor="claim-address"
                  className="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5"
                >
                  <MapPin size={13} className="text-pink-600" />
                  <span>Delivery Address (Street, Ward, District, City): *</span>
                </label>
                <textarea
                  id="claim-address"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Apartment 402, 123 Nguyen Hue Blvd, Ben Nghe Ward, District 1, Ho Chi Minh City"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>

              {/* Delivery Notes / Special Instructions (Optional) */}
              <div>
                <label
                  htmlFor="claim-notes"
                  className="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5"
                >
                  <FileText size={13} className="text-purple-600" />
                  <span>Delivery Instructions (Optional):</span>
                </label>
                <input
                  id="claim-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave with reception / call upon arrival"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Submit Claim Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="confirm-claim-ship-btn"
                  disabled={isSubmitting || (points < 100 && !isAlreadyClaimed)}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border-2 sm:border-3 border-slate-900 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSubmitting
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : points >= 100 || isAlreadyClaimed
                      ? 'bg-yellow-300 hover:bg-yellow-400 text-slate-900 shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Gift size={16} className="text-purple-700" />
                  <span>
                    {isSubmitting
                      ? 'Processing Claim...'
                      : 'Confirm & Ship My 100 PTS Prize 📦✨'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <span>🛡️ 100% Free Shipping</span>
            <span>• Verified SlayHealth Member Care</span>
          </div>

          <button
            type="button"
            id="modal-done-btn"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all"
          >
            {showReceipt ? 'Done / Slay on! ✨' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
