import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ChevronRight, ChevronDown, Plane, MapPin, Star,
  Clock, Leaf, Edit2, Check,
} from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { FlightOption } from '../components/FlightOptionCard';
import { CabBooking } from '../components/CabBookingCard';
import { HotelOption } from '../components/HotelOptionCard';

// ─── Airline helpers ──────────────────────────────────────────────────────────

const AIRLINE_COLORS: Record<string, string> = {
  IndiGo: '#1A56DB', 'Air India': '#C8001E', Vistara: '#6B21A8',
};
const AIRLINE_EMOJI: Record<string, string> = {
  IndiGo: '🔵', 'Air India': '🔴', Vistara: '🟣',
};
const PROVIDER_COLORS: Record<string, string> = { Uber: '#000000', Ola: '#3CB371' };
const PROVIDER_EMOJI: Record<string, string>  = { Uber: '⚫', Ola: '🟢' };

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ emoji, title, accent }: { emoji: string; title: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: `${accent}20`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '15px', flexShrink: 0,
      }}>
        {emoji}
      </div>
      <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary, flex: 1 }}>
        {title}
      </span>
    </div>
  );
}

// ─── Edit button ──────────────────────────────────────────────────────────────

function EditButton({ onPress }: { onPress: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onPress}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        background: `${tm.accentAmber}15`, border: `1px solid ${tm.accentAmber}40`,
        borderRadius: '8px', padding: '5px 10px', cursor: 'pointer',
      }}
    >
      <Edit2 size={11} color={tm.accentAmber} />
      <span style={{ fontSize: '11px', color: tm.accentAmber, fontFamily: fonts.mono, fontWeight: 600 }}>
        Change
      </span>
    </motion.button>
  );
}

// ─── Flight summary row ───────────────────────────────────────────────────────

function FlightSummaryRow({
  label, flight, origin, destination, accent,
}: { label: string; flight: FlightOption; origin: string; destination: string; accent: string }) {
  return (
    <div style={{
      background: tm.bgElevated, borderRadius: '12px', padding: '12px', marginBottom: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%', background: accent, flexShrink: 0,
        }} />
        <span style={{ fontSize: '10px', color: accent, fontFamily: fonts.mono, fontWeight: 600, letterSpacing: '0.06em' }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '7px',
          background: AIRLINE_COLORS[flight.airline] || tm.bgSurface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', flexShrink: 0,
        }}>
          {AIRLINE_EMOJI[flight.airline] || '✈️'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
              {flight.departure}
            </span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
              <Plane size={9} color={tm.textSecondary} />
              <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
            </div>
            <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
              {flight.arrival}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
            <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              {origin} · {flight.airline} {flight.flightNumber}
            </span>
            <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              {flight.duration} · Non-stop
            </span>
          </div>
        </div>
        <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, flexShrink: 0 }}>
          ₹{flight.price.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── Bottom sheet wrapper ─────────────────────────────────────────────────────

function BottomSheet({
  visible, onClose, title, children,
}: { visible: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60 }}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 61,
              background: tm.bgSurface, borderRadius: '20px 20px 0 0',
              maxHeight: '80%', display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Handle + title */}
            <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
              <div style={{
                width: '36px', height: '4px', borderRadius: '2px',
                background: tm.borderSubtle, margin: '0 auto 16px',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                  {title}
                </span>
                <button
                  onClick={onClose}
                  style={{
                    background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
                    borderRadius: '8px', padding: '4px 10px', cursor: 'pointer',
                    fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono,
                  }}
                >
                  Done
                </button>
              </div>
            </div>
            <div style={{ overflowY: 'auto', padding: '0 16px 32px', scrollbarWidth: 'none' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Flight picker row ────────────────────────────────────────────────────────

function FlightPickerRow({
  flight, isSelected, accent, origin, destination, onSelect,
}: { flight: FlightOption; isSelected: boolean; accent: string; origin: string; destination: string; onSelect: () => void }) {
  const [expandedReason, setExpandedReason] = useState(flight.recommended ?? false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      style={{
        background: tm.bgSurface,
        border: `1px solid ${isSelected ? `${accent}60` : tm.borderSubtle}`,
        borderLeft: `3px solid ${isSelected ? accent : 'transparent'}`,
        borderRadius: '14px',
        padding: '12px 14px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
        position: 'relative',
      }}
    >
      {/* Nova's pick badge */}
      {flight.recommended && (
        <div style={{
          position: 'absolute', top: '10px', right: '12px',
          background: `${accent}20`, border: `1px solid ${accent}50`,
          borderRadius: '20px', padding: '2px 8px',
        }}>
          <span style={{ fontSize: '10px', color: accent, fontFamily: fonts.mono, fontWeight: 600 }}>
            ★ Nova's Pick
          </span>
        </div>
      )}

      {/* Airline + flight number */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px',
          background: AIRLINE_COLORS[flight.airline] || tm.bgElevated,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', flexShrink: 0,
        }}>
          {AIRLINE_EMOJI[flight.airline] || '✈️'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
            {flight.airline}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            {flight.flightNumber}
          </div>
        </div>
      </div>

      {/* Route times */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <div style={{ textAlign: 'center', minWidth: '40px' }}>
          <div style={{ fontSize: '17px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, lineHeight: 1 }}>
            {flight.departure}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '2px' }}>{origin}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginBottom: '3px' }}>
            {flight.duration}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
            <Plane size={10} color={isSelected ? accent : tm.textSecondary} />
            <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
          </div>
          <div style={{ fontSize: '10px', color: flight.stops === 0 ? tm.accentTeal : tm.textSecondary, fontFamily: fonts.mono, marginTop: '3px' }}>
            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '40px' }}>
          <div style={{ fontSize: '17px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, lineHeight: 1 }}>
            {flight.arrival}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '2px' }}>{destination}</div>
        </div>
      </div>

      {/* Price + carbon + radio */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>from </span>
          <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
            ₹{flight.price.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: `${tm.accentTeal}15`, padding: '3px 7px', borderRadius: '6px',
          }}>
            <Leaf size={10} color={tm.accentTeal} />
            <span style={{ fontSize: '10px', color: tm.accentTeal, fontFamily: fonts.mono }}>
              {flight.carbonKg}kg CO₂
            </span>
          </div>
          <div style={{
            width: '18px', height: '18px', borderRadius: '50%',
            border: `2px solid ${isSelected ? accent : tm.borderSubtle}`,
            background: isSelected ? accent : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', flexShrink: 0,
          }}>
            {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0D1117' }} />}
          </div>
        </div>
      </div>

      {/* Why I recommend this */}
      {flight.reasoning && (
        <button
          onClick={e => { e.stopPropagation(); setExpandedReason(r => !r); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '8px 0 0',
          }}
        >
          <span style={{ fontSize: '11px', color: accent, fontFamily: fonts.mono }}>
            Why I recommend this
          </span>
          <ChevronDown
            size={12}
            color={accent}
            style={{ transform: expandedReason ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>
      )}

      <AnimatePresence>
        {expandedReason && flight.reasoning && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              background: `${accent}10`, border: `1px solid ${accent}30`,
              borderRadius: '10px', padding: '10px', marginTop: '8px',
            }}>
              <p style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.body, margin: 0, lineHeight: 1.6 }}>
                💡 {flight.reasoning}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Hotel picker row ─────────────────────────────────────────────────────────

function HotelPickerRow({
  hotel, isSelected, onSelect,
}: { hotel: HotelOption; isSelected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      whileTap={{ opacity: 0.7 }}
      onClick={onSelect}
      style={{
        background: tm.bgPrimary,
        border: `1px solid ${isSelected ? '#7C3AED60' : tm.borderSubtle}`,
        borderLeft: `3px solid ${isSelected ? '#7C3AED' : 'transparent'}`,
        borderRadius: '12px', padding: '12px', marginBottom: '8px', cursor: 'pointer',
        position: 'relative',
      }}
    >
      {hotel.recommended && (
        <div style={{
          position: 'absolute', top: '8px', right: '10px',
          background: '#7C3AED20', border: '1px solid #7C3AED40',
          borderRadius: '20px', padding: '2px 7px',
        }}>
          <span style={{ fontSize: '10px', color: '#7C3AED', fontFamily: fonts.mono, fontWeight: 600 }}>★ Best fit</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
          {hotel.name}
        </span>
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: `2px solid ${isSelected ? '#7C3AED' : tm.borderSubtle}`,
          background: isSelected ? '#7C3AED' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star key={i} size={9} color={tm.accentAmber} fill={tm.accentAmber} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <MapPin size={9} color={tm.textSecondary} />
          <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>{hotel.distanceFromVenue} from venue</span>
        </div>
        <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, marginLeft: 'auto' }}>
          ₹{hotel.pricePerNight.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Cab picker row ───────────────────────────────────────────────────────────

function CabPickerRow({
  cab, isSelected, onSelect,
}: { cab: CabBooking; isSelected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      whileTap={{ opacity: 0.7 }}
      onClick={onSelect}
      style={{
        background: tm.bgPrimary,
        border: `1px solid ${isSelected ? `${tm.accentTeal}60` : tm.borderSubtle}`,
        borderLeft: `3px solid ${isSelected ? tm.accentTeal : 'transparent'}`,
        borderRadius: '12px', padding: '12px', marginBottom: '8px', cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '7px',
            background: PROVIDER_COLORS[cab.provider],
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
          }}>
            {PROVIDER_EMOJI[cab.provider]}
          </div>
          <span style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
            {cab.provider} · {cab.type}
          </span>
        </div>
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: `2px solid ${isSelected ? tm.accentTeal : tm.borderSubtle}`,
          background: isSelected ? tm.accentTeal : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0D1117' }} />}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={10} color={tm.textSecondary} />
          <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            {cab.pickupTime} · ~{cab.travelTime}
          </span>
        </div>
        <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
          ₹{cab.estimatedFare}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UnifiedReviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = (location.state as any) ?? {};

  const allFlights:       FlightOption[] = state.allFlights       ?? [];
  const allReturnFlights: FlightOption[] = state.allReturnFlights ?? [];
  const allCabs:          CabBooking[]   = state.allCabs          ?? [];
  const allHotels:        HotelOption[]  = state.allHotels        ?? [];

  const [selFlight,  setSelFlight]  = useState<FlightOption>(state.selectedFlight);
  const [selReturn,  setSelReturn]  = useState<FlightOption>(state.selectedReturnFlight);
  const [selCabs,    setSelCabs]    = useState<CabBooking[]>(state.selectedCabs ?? []);
  const [selHotel,   setSelHotel]   = useState<HotelOption>(state.selectedHotel);
  const [booking,    setBooking]    = useState(false);

  // Sheet visibility
  const [sheetOpen, setSheetOpen] = useState<'flight-out' | 'flight-ret' | 'cab' | 'hotel' | null>(null);

  // Temp selection state inside sheets
  const [tempFlightOut, setTempFlightOut] = useState<string>(selFlight?.id ?? '');
  const [tempFlightRet, setTempFlightRet] = useState<string>(selReturn?.id ?? '');
  const [tempHotel,     setTempHotel]     = useState<string>(selHotel?.id  ?? '');

  function openSheet(which: typeof sheetOpen) {
    setTempFlightOut(selFlight?.id ?? '');
    setTempFlightRet(selReturn?.id ?? '');
    setTempHotel(selHotel?.id ?? '');
    setSheetOpen(which);
  }

  function confirmFlightOut() {
    const f = allFlights.find(f => f.id === tempFlightOut);
    if (f) setSelFlight(f);
    setSheetOpen(null);
  }
  function confirmFlightRet() {
    const f = allReturnFlights.find(f => f.id === tempFlightRet);
    if (f) setSelReturn(f);
    setSheetOpen(null);
  }
  function confirmHotel() {
    const h = allHotels.find(h => h.id === tempHotel);
    if (h) setSelHotel(h);
    setSheetOpen(null);
  }

  const totalPrice =
    (selFlight?.price  ?? 0) +
    (selReturn?.price  ?? 0) +
    (selHotel?.pricePerNight ?? 0) +
    selCabs.reduce((s, c) => s + c.estimatedFare, 0);

  function handleConfirmBook() {
    setBooking(true);
    setTimeout(() => navigate('/confirmed'), 1800);
  }

  return (
    <div style={{
      background: tm.bgPrimary, flex: 1, display: 'flex', flexDirection: 'column',
      fontFamily: fonts.body, position: 'relative', overflow: 'hidden',
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px 10px', borderBottom: `1px solid ${tm.borderSubtle}`, flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={14} color={tm.textPrimary} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
            Review & Confirm
          </div>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            Mumbai · Apr 15 · All services
          </div>
        </div>
        <div style={{ width: '32px' }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px', scrollbarWidth: 'none' }}>

        {/* ── FLIGHTS ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '16px', padding: '16px', marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <SectionHeader emoji="✈️" title="Flights" accent={tm.accentAmber} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <EditButton onPress={() => openSheet('flight-out')} />
            </div>
          </div>
          <FlightSummaryRow label="OUTBOUND" flight={selFlight} origin="COK" destination="BOM" accent={tm.accentAmber} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <EditButton onPress={() => openSheet('flight-ret')} />
          </div>
          <FlightSummaryRow label="RETURN" flight={selReturn} origin="BOM" destination="COK" accent={tm.accentTeal} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: `1px solid ${tm.borderSubtle}`, marginTop: '8px', paddingTop: '10px',
          }}>
            <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>Round trip total</span>
            <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
              ₹{((selFlight?.price ?? 0) + (selReturn?.price ?? 0)).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* ── CABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '16px', padding: '16px', marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <SectionHeader emoji="🚕" title="Cabs" accent={tm.accentTeal} />
            <EditButton onPress={() => openSheet('cab')} />
          </div>
          {selCabs.map((cab, i) => (
            <div
              key={cab.id}
              style={{
                background: tm.bgElevated, borderRadius: '12px', padding: '12px',
                marginBottom: i < selCabs.length - 1 ? '8px' : '0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '7px',
                    background: PROVIDER_COLORS[cab.provider],
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                  }}>
                    {PROVIDER_EMOJI[cab.provider]}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                      {cab.label}
                    </div>
                    <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                      via {cab.provider} · {cab.type}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
                  ₹{cab.estimatedFare}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tm.accentAmber }} />
                  <div style={{ width: '1px', flex: 1, background: tm.borderSubtle, margin: '3px 0' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: tm.accentTeal }} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.body, marginBottom: '8px' }}>
                    {cab.pickupLocation} · <span style={{ color: tm.textSecondary }}>{cab.pickupTime}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.body }}>
                    {cab.dropLocation} · <span style={{ color: tm.textSecondary }}>~{cab.travelTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── HOTEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '16px', padding: '16px', marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <SectionHeader emoji="🏨" title="Hotel" accent="#7C3AED" />
            <EditButton onPress={() => openSheet('hotel')} />
          </div>
          <div style={{ background: tm.bgElevated, borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div>
                <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                  {selHotel?.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: selHotel?.stars ?? 0 }).map((_, i) => (
                      <Star key={i} size={9} color={tm.accentAmber} fill={tm.accentAmber} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={9} color={tm.textSecondary} />
                    <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                      {selHotel?.distanceFromVenue} from venue
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
                  ₹{selHotel?.pricePerNight.toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  day use
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
              {selHotel?.amenities.map(a => (
                <div key={a} style={{
                  background: `${'#7C3AED'}18`, border: `1px solid ${'#7C3AED'}30`,
                  borderRadius: '6px', padding: '2px 8px',
                }}>
                  <span style={{ fontSize: '10px', color: '#7C3AED', fontFamily: fonts.mono }}>
                    {a}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Total summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: `${tm.accentAmber}10`, border: `1px solid ${tm.accentAmber}30`,
            borderLeft: `3px solid ${tm.accentAmber}`,
            borderRadius: '16px', padding: '14px 16px', marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
              Total Trip Cost
            </span>
            <span style={{ fontSize: '20px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
          {[
            { label: 'Flights (round trip)', val: `₹${((selFlight?.price ?? 0) + (selReturn?.price ?? 0)).toLocaleString()}` },
            { label: 'Cabs (×2)',             val: `₹${selCabs.reduce((s, c) => s + c.estimatedFare, 0).toLocaleString()}` },
            { label: 'Hotel (day use)',        val: `₹${(selHotel?.pricePerNight ?? 0).toLocaleString()}` },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>{r.label}</span>
              <span style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.mono }}>{r.val}</span>
            </div>
          ))}
          <div style={{
            marginTop: '10px', padding: '8px 10px',
            background: `${tm.accentTeal}15`, border: `1px solid ${tm.accentTeal}30`,
            borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Check size={12} color={tm.accentTeal} />
            <span style={{ fontSize: '11px', color: tm.accentTeal, fontFamily: fonts.mono }}>
              Within ₹15,000 policy limit — saving ₹{(15000 - totalPrice).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* ── Confirm & Book CTA ── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirmBook}
          disabled={booking}
          style={{
            width: '100%', background: booking ? `${tm.accentAmber}80` : tm.accentAmber,
            border: 'none', borderRadius: '16px', padding: '16px',
            cursor: booking ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: booking ? 'none' : `0 4px 18px ${tm.accentAmber}40`,
            transition: 'all 0.3s ease',
          }}
        >
          {booking ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent' }}
              />
              <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
                Booking all services…
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
                Confirm & Book All
              </span>
              <ChevronRight size={18} color="#ffffff" strokeWidth={2.5} />
            </>
          )}
        </motion.button>

      </div>

      {/* ─── Bottom Sheets ─────────────────────────────────────────────────── */}

      {/* Outbound flight */}
      <BottomSheet
        visible={sheetOpen === 'flight-out'}
        onClose={confirmFlightOut}
        title="Change Outbound Flight"
      >
        {allFlights.map(f => (
          <FlightPickerRow
            key={f.id} flight={f} origin="COK" destination="BOM"
            isSelected={tempFlightOut === f.id} accent={tm.accentAmber}
            onSelect={() => setTempFlightOut(f.id)}
          />
        ))}
        <motion.button
          whileTap={{ scale: 0.97 }} onClick={confirmFlightOut}
          style={{
            width: '100%', background: tm.accentAmber, border: 'none', borderRadius: '12px',
            padding: '13px', cursor: 'pointer', marginTop: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
            Confirm Selection
          </span>
          <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
        </motion.button>
      </BottomSheet>

      {/* Return flight */}
      <BottomSheet
        visible={sheetOpen === 'flight-ret'}
        onClose={confirmFlightRet}
        title="Change Return Flight"
      >
        {allReturnFlights.map(f => (
          <FlightPickerRow
            key={f.id} flight={f} origin="BOM" destination="COK"
            isSelected={tempFlightRet === f.id} accent={tm.accentTeal}
            onSelect={() => setTempFlightRet(f.id)}
          />
        ))}
        <motion.button
          whileTap={{ scale: 0.97 }} onClick={confirmFlightRet}
          style={{
            width: '100%', background: tm.accentAmber, border: 'none', borderRadius: '12px',
            padding: '13px', cursor: 'pointer', marginTop: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
            Confirm Selection
          </span>
          <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
        </motion.button>
      </BottomSheet>

      {/* Cab */}
      <BottomSheet
        visible={sheetOpen === 'cab'}
        onClose={() => setSheetOpen(null)}
        title="Change Cab"
      >
        <div style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, marginBottom: '12px' }}>
          Arrival cab
        </div>
        {allCabs.filter(c => c.label === 'Arrival Cab').map(c => (
          <CabPickerRow
            key={c.id} cab={c}
            isSelected={selCabs.some(s => s.id === c.id)}
            onSelect={() => setSelCabs(prev => {
              const others = prev.filter(x => x.label !== 'Arrival Cab');
              return [...others, c];
            })}
          />
        ))}
        <div style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '12px 0' }}>
          Departure cab
        </div>
        {allCabs.filter(c => c.label === 'Departure Cab').map(c => (
          <CabPickerRow
            key={c.id} cab={c}
            isSelected={selCabs.some(s => s.id === c.id)}
            onSelect={() => setSelCabs(prev => {
              const others = prev.filter(x => x.label !== 'Departure Cab');
              return [...others, c];
            })}
          />
        ))}
        <motion.button
          whileTap={{ scale: 0.97 }} onClick={() => setSheetOpen(null)}
          style={{
            width: '100%', background: tm.accentAmber, border: 'none', borderRadius: '12px',
            padding: '13px', cursor: 'pointer', marginTop: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
            Confirm Selection
          </span>
          <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
        </motion.button>
      </BottomSheet>

      {/* Hotel */}
      <BottomSheet
        visible={sheetOpen === 'hotel'}
        onClose={confirmHotel}
        title="Change Hotel"
      >
        {allHotels.map(h => (
          <HotelPickerRow
            key={h.id} hotel={h}
            isSelected={tempHotel === h.id}
            onSelect={() => setTempHotel(h.id)}
          />
        ))}
        <motion.button
          whileTap={{ scale: 0.97 }} onClick={confirmHotel}
          style={{
            width: '100%', background: tm.accentAmber, border: 'none', borderRadius: '12px',
            padding: '13px', cursor: 'pointer', marginTop: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
            Confirm Selection
          </span>
          <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
        </motion.button>
      </BottomSheet>

      {/* Booking overlay */}
      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: 0, background: 'rgba(7,10,14,0.75)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', zIndex: 80,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: `3px solid ${tm.accentAmber}`, borderTopColor: 'transparent' }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary, marginBottom: '6px' }}>
                Booking all services…
              </div>
              <div style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                Flights, cabs & hotel simultaneously
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
