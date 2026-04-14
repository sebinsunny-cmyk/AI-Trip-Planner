import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ArrowRight, ChevronRight, ChevronDown, Plane, MapPin, Star,
  Clock, Leaf, Edit2, Check, Wifi, Car, Coffee, ShieldCheck, CalendarClock, X,
} from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import uberLogo from '../../assets/logos/uber-logo.webp';
import olaLogo from '../../assets/logos/white_ola_logo.png';
import indigoLogo from '../../assets/logos/IndiGo-Logo.wine.png';
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
const AIRLINE_LOGOS: Record<string, string> = {
  IndiGo:      indigoLogo,
  'Air India':  'https://images.kiwi.com/airlines/64/AI.png',
  Vistara:      'https://images.kiwi.com/airlines/64/UK.png',
};

function AirlineIcon({ airline, size }: { airline: string; size: number }) {
  const logo = AIRLINE_LOGOS[airline];
  if (logo) {
    return (
      <img
        src={logo}
        alt={airline}
        style={{ width: size, height: size, borderRadius: '6px', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.55 }}>{AIRLINE_EMOJI[airline] || '✈️'}</span>;
}
const PROVIDER_COLORS: Record<string, string> = { Uber: '#000000', Ola: '#3CB371' };
const PROVIDER_EMOJI: Record<string, string>  = { Uber: '⚫', Ola: '🟢' };

const PROVIDER_LOGOS: Record<string, string> = { Uber: uberLogo, Ola: olaLogo };

function ProviderIcon({ provider, size }: { provider: string; size: number }) {
  const logo = PROVIDER_LOGOS[provider];
  if (logo) {
    return (
      <img
        src={logo}
        alt={provider}
        style={{ width: size, height: size, borderRadius: '6px', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.55 }}>{PROVIDER_EMOJI[provider]}</span>;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  Wifi:      <Wifi size={10} />,
  Parking:   <Car size={10} />,
  Breakfast: <Coffee size={10} />,
};

// ─── Flight insight helpers ───────────────────────────────────────────────────

type InsightTag = { label: string; color: string };

function parseDurationMinutes(dur: string): number {
  const h = dur.match(/(\d+)h/);
  const m = dur.match(/(\d+)m/);
  return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
}

function getFlightInsight(flight: FlightOption, allFlights: FlightOption[]): InsightTag | null {
  if (allFlights.length === 0) return null;
  const minPrice    = Math.min(...allFlights.map(f => f.price));
  const minDuration = Math.min(...allFlights.map(f => parseDurationMinutes(f.duration)));
  const minCarbon   = Math.min(...allFlights.map(f => f.carbonKg));
  if (flight.price === minPrice)                    return { label: 'Cheapest',   color: '#22C55E' };
  if (parseDurationMinutes(flight.duration) === minDuration) return { label: 'Fastest',    color: '#3B82F6' };
  if (flight.stops === 0)                           return { label: 'Non-stop',   color: tm.accentTeal };
  if (flight.carbonKg === minCarbon)                return { label: 'Greenest',   color: '#16A34A' };
  if (flight.recommended)                           return { label: 'Best Value', color: tm.accentAmber };
  return null;
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ emoji, title, accent }: { emoji: string; title: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${tm.accentAmber}15`, border: `1px solid ${tm.accentAmber}40`,
        borderRadius: '8px', padding: '6px', cursor: 'pointer',
      }}
    >
      <Edit2 size={13} color={tm.accentAmber} />
    </motion.button>
  );
}

// ─── Flight summary row ───────────────────────────────────────────────────────

function FlightSummaryRow({
  label, flight, origin, destination, accent, allFlights = [], onEdit, isReturn = false, hideChip = false, cardBg,
}: { label: string; flight: FlightOption; origin: string; destination: string; accent: string; allFlights?: FlightOption[]; onEdit?: () => void; isReturn?: boolean; hideChip?: boolean; cardBg?: string }) {
  const insight = getFlightInsight(flight, allFlights);
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ width: '100%' }}>

      {/* Direction chip + edit — hidden when rendered inside section header */}
      {!hideChip && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '8px', padding: '4px 10px',
          }}>
            {isReturn ? <ArrowLeft size={11} color={accent} /> : <ArrowRight size={11} color={accent} />}
            <span style={{ fontSize: '11px', fontFamily: fonts.mono, fontWeight: 700, color: tm.textPrimary, letterSpacing: '0.05em' }}>
              {label}
            </span>
          </div>
          {onEdit && <EditButton onPress={onEdit} />}
        </div>
      )}

      {/* Card */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          background: cardBg ?? tm.bgElevated,
          border: `1px solid ${accent}60`,
          borderLeft: `3px solid ${accent}`,
          borderRadius: '12px',
          padding: '8px 10px',
          cursor: 'pointer',
        }}
      >
        {/* ── Minimal view (always visible) ── */}

        {/* Airline + Nova's Pick + price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: AIRLINE_COLORS[flight.airline] || tm.bgElevated,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', flexShrink: 0,
            }}>
              <AirlineIcon airline={flight.airline} size={24} />
            </div>
            <span style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
              {flight.airline}
            </span>
            {flight.recommended && (
              <div style={{
                background: `${accent}20`, border: `1px solid ${accent}50`,
                borderRadius: '20px', padding: '1px 6px',
              }}>
                <span style={{ fontSize: '9px', color: accent, fontFamily: fonts.mono, fontWeight: 600 }}>★ Nova's Pick</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
              ₹{flight.price.toLocaleString()}
            </span>
            <ChevronDown
              size={13} color={tm.textSecondary}
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
            />
          </div>
        </div>

        {/* Route times */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ textAlign: 'center', minWidth: '36px' }}>
            <div style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, lineHeight: 1 }}>
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
              <Plane size={9} color={accent} />
              <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
            </div>
            <div style={{ fontSize: '9px', color: flight.stops === 0 ? tm.accentTeal : tm.textSecondary, fontFamily: fonts.mono, marginTop: '3px' }}>
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
            </div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '36px' }}>
            <div style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, lineHeight: 1 }}>
              {flight.arrival}
            </div>
            <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '2px' }}>{destination}</div>
          </div>
        </div>

        {/* ── Expanded detail ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ borderTop: `1px solid ${tm.borderSubtle}`, marginTop: '10px', paddingTop: '10px' }}>
                {/* Flight number + insight + carbon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                      {flight.flightNumber}
                    </span>
                    {insight && (
                      <div style={{
                        background: `${insight.color}1A`, border: `1px solid ${insight.color}45`,
                        borderRadius: '20px', padding: '1px 6px',
                      }}>
                        <span style={{ fontSize: '9px', color: insight.color, fontFamily: fonts.mono, fontWeight: 700 }}>
                          {insight.label}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: `${tm.accentTeal}15`, padding: '3px 7px', borderRadius: '6px',
                  }}>
                    <Leaf size={10} color={tm.accentTeal} />
                    <span style={{ fontSize: '10px', color: tm.accentTeal, fontFamily: fonts.mono }}>
                      {flight.carbonKg}kg CO₂
                    </span>
                  </div>
                </div>

                {/* Reasoning */}
                {flight.reasoning && (
                  <div style={{
                    background: `${accent}10`, border: `1px solid ${accent}30`,
                    borderRadius: '10px', padding: '8px 10px',
                  }}>
                    <p style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.body, margin: 0, lineHeight: 1.6 }}>
                      💡 {flight.reasoning}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={onClose}
                  style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={14} color={tm.textSecondary} />
                </motion.button>
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
  flight, isSelected, accent, origin, destination, onSelect, allFlights = [],
}: { flight: FlightOption; isSelected: boolean; accent: string; origin: string; destination: string; onSelect: () => void; allFlights?: FlightOption[] }) {
  const [expandedReason, setExpandedReason] = useState(flight.recommended ?? false);
  const insight = getFlightInsight(flight, allFlights);

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
          <AirlineIcon airline={flight.airline} size={32} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
              {flight.airline}
            </span>
            {insight && (
              <div style={{
                background: `${insight.color}1A`, border: `1px solid ${insight.color}45`,
                borderRadius: '20px', padding: '1px 7px',
              }}>
                <span style={{ fontSize: '10px', color: insight.color, fontFamily: fonts.mono, fontWeight: 700, letterSpacing: '0.02em' }}>
                  {insight.label}
                </span>
              </div>
            )}
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
        borderRadius: '14px', overflow: 'hidden', marginBottom: '8px', cursor: 'pointer',
      }}
    >
      {/* Image banner */}
      {hotel.image && (
        <div style={{ position: 'relative', height: '80px', overflow: 'hidden' }}>
          <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
          {hotel.recommended && (
            <span style={{
              position: 'absolute', top: '8px', right: '8px',
              fontSize: '9px', fontFamily: fonts.mono, fontWeight: 700,
              color: '#ffffff', background: '#7C3AED',
              borderRadius: '4px', padding: '2px 6px', letterSpacing: '0.04em',
            }}>★ Nova's Pick</span>
          )}
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: '12px 14px' }}>
      {/* Name + price */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
              {hotel.name}
            </span>
            {hotel.recommended && !hotel.image && (
              <div style={{
                background: '#7C3AED20', border: '1px solid #7C3AED50',
                borderRadius: '20px', padding: '1px 7px', flexShrink: 0,
              }}>
                <span style={{ fontSize: '10px', color: '#7C3AED', fontFamily: fonts.mono, fontWeight: 600 }}>★ Nova's Pick</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} size={9} color={tm.accentAmber} fill={tm.accentAmber} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={9} color={tm.textSecondary} />
              <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>{hotel.distanceFromVenue} from venue</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
            ₹{hotel.pricePerNight.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>day use</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: tm.borderSubtle, margin: '10px 0' }} />

      {/* Rating + insights */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' as const }}>
        {hotel.rating && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: '#22C55E18', border: '1px solid #22C55E40',
            borderRadius: '8px', padding: '3px 8px',
          }}>
            <Star size={10} color="#22C55E" fill="#22C55E" />
            <span style={{ fontSize: '11px', fontFamily: fonts.heading, fontWeight: 700, color: '#22C55E' }}>{hotel.rating}</span>
            {hotel.ratingCount && (
              <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>({hotel.ratingCount})</span>
            )}
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: `${tm.accentTeal}15`, border: `1px solid ${tm.accentTeal}35`,
          borderRadius: '8px', padding: '3px 8px',
        }}>
          <ShieldCheck size={10} color={tm.accentTeal} />
          <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: tm.accentTeal }}>Free cancellation</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: '#7C3AED15', border: '1px solid #7C3AED35',
          borderRadius: '8px', padding: '3px 8px',
        }}>
          <CalendarClock size={10} color="#7C3AED" />
          <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: '#7C3AED' }}>Day use · 12–6 PM</span>
        </div>
      </div>

      {/* Amenities with icons */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
        {hotel.amenities.map(a => (
          <div key={a} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: '#7C3AED18', border: '1px solid #7C3AED30',
            borderRadius: '6px', padding: '3px 8px',
          }}>
            <span style={{ color: '#7C3AED', display: 'flex', alignItems: 'center' }}>
              {AMENITY_ICONS[a] ?? null}
            </span>
            <span style={{ fontSize: '10px', color: '#7C3AED', fontFamily: fonts.mono }}>{a}</span>
          </div>
        ))}
      </div>

      {/* Radio */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: `2px solid ${isSelected ? '#7C3AED' : tm.borderSubtle}`,
          background: isSelected ? '#7C3AED' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
        </div>
      </div>
      </div>{/* end card body */}
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
            <ProviderIcon provider={cab.provider} size={26} />
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
  const { isDark } = useTheme();
  const state    = (location.state as any) ?? {};

  const allFlights:       FlightOption[] = state.allFlights       ?? [];
  const allReturnFlights: FlightOption[] = state.allReturnFlights ?? [];
  const allCabs:          CabBooking[]   = state.allCabs          ?? [];
  const allHotels:        HotelOption[]  = state.allHotels        ?? [];

  const [selFlight,  setSelFlight]  = useState<FlightOption>(state.selectedFlight);
  const [selReturn,  setSelReturn]  = useState<FlightOption>(state.selectedReturnFlight);
  const [selCabs,    setSelCabs]    = useState<CabBooking[]>(state.selectedCabs ?? []);
  const [selHotel,   setSelHotel]   = useState<HotelOption>(state.selectedHotel);
  const [booking] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cabsExpanded,  setCabsExpanded]  = useState(false);
  const [totalExpanded, setTotalExpanded] = useState(false);
  const [flightIndex,   setFlightIndex]   = useState(0); // 0 = outbound, 1 = return
  const [cabIndex,      setCabIndex]      = useState(0);
  const [cabExpanded,   setCabExpanded]   = useState(false);
  const [hotelExpanded, setHotelExpanded] = useState(false);

  function navigateCab(next: number) { setCabIndex(next); setCabExpanded(false); }

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
    navigate('/payment', { state: { totalPrice } });
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
            Mumbai · Apr 15
          </div>
        </div>
        <div style={{ width: '32px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '10px 14px 16px', scrollbarWidth: 'none' }}>

        {/* ── FLIGHTS ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{
            background: '#3B82F608', border: '1px solid #3B82F625',
            borderRadius: '16px', padding: '10px 12px 8px', marginBottom: '8px',
          }}
        >
          {/* Flights header row — title + chip + edit aligned together */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#3B82F620', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
              ✈️
            </div>
            <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>Flights</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: isDark ? tm.bgElevated : '#f8f8f8', border: `1px solid ${tm.borderSubtle}`, borderRadius: '8px', padding: '4px 10px' }}>
              {flightIndex === 0 ? <ArrowRight size={11} color={tm.accentAmber} /> : <ArrowLeft size={11} color={tm.accentTeal} />}
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, fontWeight: 700, color: tm.textPrimary, letterSpacing: '0.05em' }}>
                {flightIndex === 0 ? 'OUTBOUND' : 'RETURN'}
              </span>
            </div>
            <div style={{ flex: 1 }} />
            <EditButton onPress={() => openSheet(flightIndex === 0 ? 'flight-out' : 'flight-ret')} />
          </div>

          {/* Single card — switches between outbound and return */}
          <AnimatePresence mode="wait">
            {flightIndex === 0 ? (
              <motion.div key="outbound" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                <FlightSummaryRow label="OUTBOUND" flight={selFlight} origin="COK" destination="BOM" accent={tm.accentAmber} allFlights={allFlights} onEdit={() => openSheet('flight-out')} hideChip cardBg={isDark ? tm.bgElevated : '#EFF6FF80'} />
              </motion.div>
            ) : (
              <motion.div key="return" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}>
                <FlightSummaryRow label="RETURN" flight={selReturn} origin="BOM" destination="COK" accent={tm.accentTeal} allFlights={allReturnFlights} onEdit={() => openSheet('flight-ret')} isReturn hideChip cardBg={isDark ? tm.bgElevated : '#EFF6FF80'} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prev / Next navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFlightIndex(0)}
              disabled={flightIndex === 0}
              style={{ background: 'none', border: 'none', cursor: flightIndex === 0 ? 'default' : 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowLeft size={11} color={flightIndex === 0 ? tm.borderSubtle : tm.textSecondary} />
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: flightIndex === 0 ? tm.borderSubtle : tm.textSecondary }}>Previous</span>
            </motion.button>
            <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: tm.textSecondary }}>{flightIndex + 1} / 2</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFlightIndex(1)}
              disabled={flightIndex === 1}
              style={{ background: 'none', border: 'none', cursor: flightIndex === 1 ? 'default' : 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: flightIndex === 1 ? tm.borderSubtle : tm.textSecondary }}>Next</span>
              <ArrowRight size={11} color={flightIndex === 1 ? tm.borderSubtle : tm.textSecondary} />
            </motion.button>
          </div>
        </motion.div>

        {/* ── CABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: `${tm.accentTeal}08`, border: `1px solid ${tm.accentTeal}25`,
            borderRadius: '16px', padding: '10px 12px 8px', marginBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <SectionHeader emoji="🚕" title="Cabs" accent={tm.accentTeal} />
            <EditButton onPress={() => openSheet('cab')} />
          </div>

          {/* Single cab card */}
          <AnimatePresence mode="wait">
            {selCabs[cabIndex] && (
              <motion.div
                key={cabIndex}
                initial={{ opacity: 0, x: cabIndex === 0 ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: cabIndex === 0 ? 16 : -16 }}
                transition={{ duration: 0.18 }}
                style={{ background: isDark ? tm.bgElevated : '#ECFDF580', border: `1px solid ${tm.borderSubtle}`, borderRadius: '12px', padding: '8px 10px', cursor: 'pointer' }}
              onClick={() => setCabExpanded(e => !e)}
              >
                {/* Minimal row — always visible */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '7px',
                      background: PROVIDER_COLORS[selCabs[cabIndex].provider],
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                    }}>
                      <ProviderIcon provider={selCabs[cabIndex].provider} size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>{selCabs[cabIndex].label}</div>
                      <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>via {selCabs[cabIndex].provider} · {selCabs[cabIndex].type}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>₹{selCabs[cabIndex].estimatedFare}</span>
                    <ChevronDown size={13} color={tm.textSecondary} style={{ transform: cabExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </div>
                </div>

                {/* Expanded — pickup/drop details */}
                <AnimatePresence>
                  {cabExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ display: 'flex', gap: '8px', borderTop: `1px solid ${tm.borderSubtle}`, marginTop: '8px', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2px' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: tm.accentAmber }} />
                          <div style={{ width: '1px', flex: 1, background: tm.borderSubtle, margin: '3px 0' }} />
                          <div style={{ width: '5px', height: '5px', borderRadius: '2px', background: tm.accentTeal }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.body, marginBottom: '4px' }}>
                            {selCabs[cabIndex].pickupLocation} · <span style={{ color: tm.textSecondary }}>{selCabs[cabIndex].pickupTime}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.body }}>
                            {selCabs[cabIndex].dropLocation} · <span style={{ color: tm.textSecondary }}>~{selCabs[cabIndex].travelTime}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prev / Next — always visible, disabled when only 1 cab or at boundary */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateCab(Math.max(0, cabIndex - 1))}
              disabled={cabIndex === 0 || selCabs.length <= 1}
              style={{ background: 'none', border: 'none', cursor: (cabIndex === 0 || selCabs.length <= 1) ? 'default' : 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowLeft size={11} color={(cabIndex === 0 || selCabs.length <= 1) ? tm.borderSubtle : tm.textSecondary} />
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: (cabIndex === 0 || selCabs.length <= 1) ? tm.borderSubtle : tm.textSecondary }}>Previous</span>
            </motion.button>
            <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: tm.textSecondary }}>{cabIndex + 1} / {selCabs.length}</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateCab(Math.min(selCabs.length - 1, cabIndex + 1))}
              disabled={cabIndex === selCabs.length - 1 || selCabs.length <= 1}
              style={{ background: 'none', border: 'none', cursor: (cabIndex === selCabs.length - 1 || selCabs.length <= 1) ? 'default' : 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: (cabIndex === selCabs.length - 1 || selCabs.length <= 1) ? tm.borderSubtle : tm.textSecondary }}>Next</span>
              <ArrowRight size={11} color={(cabIndex === selCabs.length - 1 || selCabs.length <= 1) ? tm.borderSubtle : tm.textSecondary} />
            </motion.button>
          </div>
        </motion.div>

        {/* ── HOTEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{
            background: '#7C3AED08', border: '1px solid #7C3AED25',
            borderRadius: '16px', padding: '10px 12px 8px', marginBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <SectionHeader emoji="🏨" title="Hotel" accent="#7C3AED" />
            <EditButton onPress={() => openSheet('hotel')} />
          </div>

          {/* Hotel card — expand/collapse on click */}
          <div
            onClick={() => setHotelExpanded(e => !e)}
            style={{ background: isDark ? tm.bgElevated : '#F5F3FF80', border: `1px solid ${tm.borderSubtle}`, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
          >
            {/* Minimal row — always visible */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, marginRight: '10px' }}>
                {selHotel?.image ? (
                  <img src={selHotel.image} alt={selHotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                    background: (selHotel?.stars ?? 0) >= 5 ? 'linear-gradient(135deg, #1a1a2e, #0f3460)' : 'linear-gradient(135deg, #1a3a2e, #2d6a4f)',
                  }}>🏨</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary, marginBottom: '3px' }}>
                  {selHotel?.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: selHotel?.stars ?? 0 }).map((_, i) => (
                      <Star key={i} size={8} color={tm.accentAmber} fill={tm.accentAmber} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={8} color={tm.textSecondary} />
                    <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>{selHotel?.distanceFromVenue} from venue</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>₹{selHotel?.pricePerNight.toLocaleString()}</div>
                  <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>day use</div>
                </div>
                <ChevronDown size={13} color={tm.textSecondary} style={{ transform: hotelExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>

            {/* Expanded — image banner, rating, insights, amenities */}
            <AnimatePresence>
              {hotelExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', height: '110px', overflow: 'hidden' }}>
                    {selHotel?.image ? (
                      <img src={selHotel.image} alt={selHotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: (selHotel?.stars ?? 0) >= 5
                          ? 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)'
                          : 'linear-gradient(135deg, #1a3a2e 0%, #2d6a4f 100%)',
                      }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
                  </div>
                  <div style={{ borderTop: `1px solid ${tm.borderSubtle}`, margin: '0 10px', paddingTop: '8px', paddingBottom: '8px' }}>
                    {/* Rating + insights */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
                      {selHotel?.rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#22C55E18', border: '1px solid #22C55E40', borderRadius: '8px', padding: '3px 8px' }}>
                          <Star size={10} color="#22C55E" fill="#22C55E" />
                          <span style={{ fontSize: '11px', fontFamily: fonts.heading, fontWeight: 700, color: '#22C55E' }}>{selHotel.rating}</span>
                          {selHotel.ratingCount && <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>({selHotel.ratingCount})</span>}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: `${tm.accentTeal}15`, border: `1px solid ${tm.accentTeal}35`, borderRadius: '8px', padding: '3px 8px' }}>
                        <ShieldCheck size={10} color={tm.accentTeal} />
                        <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: tm.accentTeal }}>Free cancellation</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#7C3AED15', border: '1px solid #7C3AED35', borderRadius: '8px', padding: '3px 8px' }}>
                        <CalendarClock size={10} color="#7C3AED" />
                        <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: '#7C3AED' }}>Day use · 12–6 PM</span>
                      </div>
                    </div>
                    {/* Amenities */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                      {selHotel?.amenities.map(a => (
                        <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#7C3AED18', border: '1px solid #7C3AED30', borderRadius: '6px', padding: '3px 8px' }}>
                          <span style={{ color: '#7C3AED', display: 'flex', alignItems: 'center' }}>{AMENITY_ICONS[a] ?? null}</span>
                          <span style={{ fontSize: '10px', color: '#7C3AED', fontFamily: fonts.mono }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Prev / Next — always visible, both disabled since only 1 hotel */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <motion.button
              disabled
              style={{ background: 'none', border: 'none', cursor: 'default', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowLeft size={11} color={tm.borderSubtle} />
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.borderSubtle }}>Previous</span>
            </motion.button>
            <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: tm.textSecondary }}>1 / 1</span>
            <motion.button
              disabled
              style={{ background: 'none', border: 'none', cursor: 'default', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.borderSubtle }}>Next</span>
              <ArrowRight size={11} color={tm.borderSubtle} />
            </motion.button>
          </div>
        </motion.div>

        {/* ── Total accordion ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: `${tm.accentAmber}10`, border: `1px solid ${tm.accentAmber}30`,
            borderLeft: `3px solid ${tm.accentAmber}`, borderRadius: '12px', overflow: 'hidden',
            marginBottom: '8px',
          }}
        >
          {/* Header row — always visible, clickable */}
          <button
            onClick={() => setTotalExpanded(e => !e)}
            style={{
              width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 14px',
            }}
          >
            <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
              Total Trip Cost
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
                ₹{totalPrice.toLocaleString()}
              </span>
              <ChevronDown
                size={14} color={tm.accentAmber}
                style={{ transform: totalExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </div>
          </button>

          {/* Breakdown — animated */}
          <AnimatePresence>
            {totalExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 14px 10px', borderTop: `1px solid ${tm.accentAmber}25` }}>
                  {[
                    { label: 'Flights (round trip)', val: `₹${((selFlight?.price ?? 0) + (selReturn?.price ?? 0)).toLocaleString()}` },
                    { label: 'Cabs',                 val: `₹${selCabs.reduce((s, c) => s + c.estimatedFare, 0).toLocaleString()}` },
                    { label: 'Hotel (day use)',       val: `₹${(selHotel?.pricePerNight ?? 0).toLocaleString()}` },
                  ].map((r, i, arr) => (
                    <div key={r.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      paddingTop: i === 0 ? '10px' : '6px',
                      borderTop: i > 0 ? `1px solid ${tm.accentAmber}15` : 'none',
                    }}>
                      <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>{r.label}</span>
                      <span style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.mono, fontWeight: 600 }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '8px', textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>+taxes & fees</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Confirm & Book CTA ── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setConfirmOpen(true)}
          disabled={booking}
          style={{
            width: '100%', background: booking ? `${tm.accentAmber}80` : tm.accentAmber,
            border: 'none', borderRadius: '16px', padding: '13px',
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
                Confirm Booking & Pay
              </span>
              <ChevronRight size={18} color="#ffffff" strokeWidth={2.5} />
            </>
          )}
        </motion.button>

        {/* ── Cancel ── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          style={{
            width: '100%', marginTop: '10px', background: 'transparent',
            border: `1px solid ${tm.borderSubtle}`, borderRadius: '16px', padding: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 600, color: tm.textSecondary }}>
            Cancel
          </span>
        </motion.button>

      </div>

      {/* ─── Confirm Booking Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 80 }}
            />
            {/* Centering wrapper */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 81,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 16px', pointerEvents: 'none',
            }}>
              {/* Modal card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 16 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                style={{
                  width: '100%',
                  background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
                  borderRadius: '24px', padding: '24px 20px',
                  pointerEvents: 'auto',
                }}
              >
                {/* Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px',
                    background: `${tm.accentAmber}18`, border: `1px solid ${tm.accentAmber}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                  }}>
                    ✈️
                  </div>
                </div>
                {/* Title */}
                <h3 style={{ margin: '0 0 8px', textAlign: 'center', fontSize: '17px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
                  Confirm your booking?
                </h3>
                <p style={{ margin: '0 0 20px', textAlign: 'center', fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, lineHeight: 1.6 }}>
                  A total of{' '}
                  <span style={{ color: tm.textPrimary, fontWeight: 700 }}>₹{totalPrice.toLocaleString('en-IN')}</span>{' '}
                  will be charged. You'll be redirected to the payment gateway to complete your booking.
                </p>
                {/* Actions */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirmBook}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                    background: tm.accentAmber, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: `0 4px 18px ${tm.accentAmber}40`, marginBottom: '10px',
                  }}
                >
                  <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: '#ffffff' }}>Proceed to Payment</span>
                  <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setConfirmOpen(false)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '14px', cursor: 'pointer',
                    background: 'transparent', border: `1px solid ${tm.borderSubtle}`,
                  }}
                >
                  <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 600, color: tm.textSecondary }}>Go Back</span>
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

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
            onSelect={() => setTempFlightOut(f.id)} allFlights={allFlights}
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
            onSelect={() => setTempFlightRet(f.id)} allFlights={allReturnFlights}
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
