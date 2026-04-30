import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Plane, Check, Clock, MapPin,
  Share2, Download, AlertCircle, Leaf, Copy,
  CheckCircle2, Hourglass, FileCheck, Sparkles,
  Star, Wifi, Coffee, Car, Building2, CreditCard,
} from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import type { TripDetail, FlightLeg, TripStatus, HotelEntry } from '../data/trips';
import { TRIP_DETAILS } from '../data/trips';

// ─── Status helpers (no JSX at module scope) ────────────────────────────────

function statusAccent(s: TripStatus) {
  return s === 'confirmed' ? '#00C9A7' : s === 'Booking in progress' ? '#F5A623' : '#8B949E';
}
function statusLabel(s: TripStatus) {
  return s === 'confirmed' ? '● Confirmed' : s === 'Booking in progress' ? '⚙ Booking in progress' : '✓ Completed';
}
function statusTagline(s: TripStatus) {
  return s === 'confirmed'
    ? 'Your booking is locked in'
    : s === 'Booking in progress'
    ? 'TripMind is building your trip'
    : 'Trip completed successfully';
}
function StatusIcon({ s }: { s: TripStatus }) {
  const c = statusAccent(s);
  if (s === 'confirmed') return <CheckCircle2 size={14} color={c} />;
  if (s === 'Booking in progress') return <Hourglass size={13} color={c} />;
  return <FileCheck size={13} color={c} />;
}

const TYPE_COLOR: Record<string, string> = {
  flight:  '#F5A623',
  cab:     '#00C9A7',
  meeting: '#7C3AED',
  reminder:'#8B949E',
  buffer:  '#4A9EFF',
  hotel:   '#4A9EFF',
};
const AIRLINE_BADGE: Record<string, string> = {
  IndiGo: '6E',
  'Air India': 'AI',
  Vistara: 'UK',
};

// ─── Tiny shared primitives ───────────────────────────────────────────────────

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: `${color}18`, border: `1px solid ${color}40`,
      borderRadius: '20px', padding: '3px 10px',
    }}>
      {children}
    </div>
  );
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono,
      textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px',
    }}>
      {children}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
      borderRadius: '14px', overflow: 'hidden', marginBottom: '12px', ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

type Tab = 'Itinerary' | 'Expenses' | 'Details';
const TABS: Tab[] = ['Itinerary', 'Expenses', 'Details'];

function TabBar({ status, active, onChange }: {
  status: TripStatus; active: Tab; onChange: (t: Tab) => void;
}) {
  const accent = statusAccent(status);
  return (
    <div style={{
      display: 'flex', borderBottom: `1px solid ${tm.borderSubtle}`,
      background: tm.bgPrimary, flexShrink: 0,
    }}>
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '11px 4px 9px', position: 'relative',
          }}
        >
          <span style={{
            fontSize: '13px', fontFamily: fonts.heading,
            fontWeight: tab === active ? 700 : 400,
            color: tab === active ? tm.textPrimary : tm.textSecondary,
          }}>
            {tab}
          </span>
          {tab === active && (
            <div style={{
              position: 'absolute', bottom: 0, left: '20%', right: '20%',
              height: '2px', background: accent, borderRadius: '2px 2px 0 0',
            }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Hero header ─────────────────────────────────────────────────────────────

function HeroHeader({ trip, onBack }: { trip: TripDetail; onBack: () => void }) {
  const accent = statusAccent(trip.status);
  const dim = trip.status === 'completed';

  return (
    <div style={{
      background: `linear-gradient(160deg, ${accent}10 0%, ${tm.bgPrimary} 60%)`,
      borderBottom: `1px solid ${tm.borderSubtle}`,
      padding: '8px 16px 14px', flexShrink: 0,
    }}>
      {/* Back + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
          }}
        >
          <ChevronLeft size={18} color={tm.textSecondary} />
          <span style={{ fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.body }}>My Trips</span>
        </button>
        <Pill color={accent}>
          <StatusIcon s={trip.status} />
          <span style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600, color: accent }}>
            {statusLabel(trip.status)}
          </span>
        </Pill>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '34px', fontFamily: fonts.heading, fontWeight: 800, lineHeight: 1,
            color: dim ? tm.textSecondary : tm.textPrimary }}>
            {trip.from}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '2px' }}>
            {trip.fromCity}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>
            <div style={{ flex: 1, height: '1px', background: `${accent}60` }} />
            <Plane size={16} color={accent} />
            <div style={{ flex: 1, height: '1px', background: `${accent}60` }} />
          </div>
          <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            {trip.outbound.duration}
            {trip.inbound ? ' · Round' : ''}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '34px', fontFamily: fonts.heading, fontWeight: 800, lineHeight: 1,
            color: dim ? tm.textSecondary : tm.textPrimary }}>
            {trip.to}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '2px' }}>
            {trip.toCity}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '12px', fontFamily: fonts.body, fontWeight: 500,
            color: dim ? tm.textSecondary : tm.textPrimary, marginBottom: '2px' }}>
            {trip.purpose}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            {trip.date}
            {trip.returnDate && trip.returnDate !== trip.date ? ` → ${trip.returnDate}` : ''}
            {' · '}{trip.outbound.airline} {trip.outbound.flightNumber}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontFamily: fonts.heading, fontWeight: 800,
            color: dim ? tm.textSecondary : tm.textPrimary }}>
            {trip.price}
          </div>
          <div style={{ fontSize: '9px', color: accent, fontFamily: fonts.mono }}>
            {statusTagline(trip.status)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Flight card ──────────────────────────────────────────────────────────────

function FlightCard({ leg, label, dim }: { leg: FlightLeg; label: string; dim: boolean }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const isPending = leg.pnr === 'PENDING' || leg.pnr === 'TBD';

  function handleDownload() {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }

  function copy() {
    if (isPending) return;
    navigator.clipboard?.writeText(leg.pnr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div style={{
      background: tm.bgSurface,
      border: `1px solid ${dim ? tm.borderSubtle : leg.airlineColor + '50'}`,
      borderTop: `3px solid ${dim ? tm.borderSubtle : leg.airlineColor}`,
      borderRadius: '14px', overflow: 'hidden', marginBottom: '12px',
      opacity: dim ? 0.75 : 1,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: `1px solid ${tm.borderSubtle}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: dim ? tm.bgElevated : leg.airlineColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontFamily: fonts.mono, fontWeight: 700,
            color: dim ? tm.textSecondary : '#fff',
          }}>
            {AIRLINE_BADGE[leg.airline] ?? '✈'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700,
              color: dim ? tm.textSecondary : tm.textPrimary }}>
              {leg.airline}
            </div>
            <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              {leg.flightNumber} · {leg.class}
            </div>
          </div>
        </div>
        <Pill color={dim ? tm.textSecondary : leg.airlineColor}>
          {dim && <Check size={10} color={tm.textSecondary} />}
          <span style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600,
            color: dim ? tm.textSecondary : leg.airlineColor }}>
            {label}
          </span>
        </Pill>
      </div>

      {/* Route */}
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ textAlign: 'center', minWidth: '50px' }}>
          <div style={{ fontSize: '20px', fontFamily: fonts.heading, fontWeight: 800,
            color: dim ? tm.textSecondary : tm.textPrimary }}>
            {leg.departure}
          </div>
          <div style={{ fontSize: '11px', color: leg.airlineColor, fontFamily: fonts.mono, fontWeight: 600 }}>
            {leg.from}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            {leg.fromCity}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>{leg.duration}</span>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>
            <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
            <Plane size={12} color={dim ? tm.textSecondary : tm.accentAmber} />
            <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
          </div>
          <span style={{ fontSize: '10px', fontFamily: fonts.mono,
            color: leg.stops === 0 && !dim ? tm.accentTeal : tm.textSecondary }}>
            {leg.stops === 0 ? 'Non-stop' : `${leg.stops} stop`}
          </span>
        </div>
        <div style={{ textAlign: 'center', minWidth: '50px' }}>
          <div style={{ fontSize: '20px', fontFamily: fonts.heading, fontWeight: 800,
            color: dim ? tm.textSecondary : tm.textPrimary }}>
            {leg.arrival}
          </div>
          <div style={{ fontSize: '11px', color: leg.airlineColor, fontFamily: fonts.mono, fontWeight: 600 }}>
            {leg.to}
          </div>
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            {leg.toCity}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px',
        background: tm.borderSubtle, borderTop: `1px solid ${tm.borderSubtle}` }}>
        {[
          { label: 'TERMINAL', value: leg.terminal },
          { label: 'SEAT', value: leg.seat },
          { label: 'PNR', value: isPending ? 'Pending' : leg.pnr, mono: true, pending: isPending, copy: !isPending && !dim },
          {
            label: 'CARBON',
            value: `${leg.carbonKg} kg CO₂`,
            icon: <Leaf size={10} color={dim ? tm.textSecondary : tm.accentTeal} />,
            color: dim ? tm.textSecondary : tm.accentTeal,
          },

        ].map((item, i) => (
          <div key={i} style={{
            background: tm.bgSurface, padding: '9px 12px',
            display: 'flex', flexDirection: 'column', gap: '3px',
          }}>
            <span style={{ fontSize: '9px', color: tm.textSecondary, fontFamily: fonts.mono, letterSpacing: '0.4px' }}>
              {item.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {item.icon ?? null}
              <span style={{
                fontSize: '12px', fontFamily: item.mono ? fonts.mono : fonts.body, fontWeight: 600,
                letterSpacing: item.mono ? '1px' : undefined,
                color: item.pending ? tm.accentAmber : (item.color ?? (dim ? tm.textSecondary : tm.textPrimary)),
              }}>
                {item.value}
              </span>
              {item.copy && (
                <button onClick={copy} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0 0 0 2px', display: 'flex', alignItems: 'center',
                }}>
                  {copied
                    ? <Check size={10} color={tm.accentTeal} />
                    : <Copy size={10} color={tm.textSecondary} />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Download e-ticket — only when PNR confirmed */}
      {!isPending && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          style={{
            width: '100%',
            background: downloaded ? `${tm.accentTeal}15` : 'transparent',
            border: 'none',
            borderTop: `1px solid ${tm.borderSubtle}`,
            padding: '11px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            transition: 'background 0.2s ease',
          }}
        >
          {downloaded
            ? <Check size={14} color={tm.accentTeal} />
            : <Download size={14} color={tm.accentAmber} />}
          <span style={{
            fontSize: '13px',
            fontFamily: fonts.body,
            fontWeight: 500,
            color: downloaded ? tm.accentTeal : tm.accentAmber,
          }}>
            {downloaded ? 'E-ticket downloaded' : `Download E-ticket · ${leg.flightNumber}`}
          </span>
        </motion.button>
      )}
    </div>
  );
}

// ─── Itinerary tab ───────────────────────────────────────────────────────────

function ItineraryTab({ trip }: { trip: TripDetail }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const done = trip.status === 'completed';
  const planning = trip.status === 'Booking in progress';

  return (
    <div>
      {/* Status banner */}
      {planning && trip.itinerary2Note && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: `${tm.accentAmber}0C`, border: `1px dashed ${tm.accentAmber}40`,
          borderRadius: '12px', padding: '10px 14px', marginBottom: '14px',
        }}>
          <AlertCircle size={14} color={tm.accentAmber} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: tm.textNarration, fontFamily: fonts.body, lineHeight: 1.5 }}>
            {trip.itinerary2Note}
          </span>
        </div>
      )}
      {done && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: `${tm.textSecondary}0A`, border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '12px', padding: '10px 14px', marginBottom: '14px',
        }}>
          <CheckCircle2 size={14} color={tm.textSecondary} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.body, lineHeight: 1.5 }}>
            All {trip.itinerary.length} events completed · Expense report filed ✓
          </span>
        </div>
      )}

      {/* Quick stats bar */}
      <Card>
        <div style={{ display: 'flex', padding: '10px 0' }}>
          {[
            { label: 'Departs', value: trip.outbound.departure, sub: trip.from },
            { label: 'Arrives', value: trip.outbound.arrival, sub: trip.to },
            trip.inbound
              ? { label: 'Returns', value: trip.inbound.departure, sub: trip.inbound.from }
              : { label: 'Returns', value: '—', sub: 'TBD' },
            { label: 'Stops', value: trip.outbound.stops === 0 ? 'Direct' : String(trip.outbound.stops), sub: 'Outbound' },
          ].map((col, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
              {i > 0 && (
                <div style={{
                  position: 'absolute', left: 0, top: '10%', height: '80%',
                  width: '1px', background: tm.borderSubtle,
                }} />
              )}
              <div style={{ fontSize: '9px', color: tm.textSecondary, fontFamily: fonts.mono,
                textTransform: 'uppercase', marginBottom: '3px' }}>
                {col.label}
              </div>
              <div style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, marginBottom: '1px',
                color: col.value === '—' ? tm.accentAmber : (done ? tm.textSecondary : tm.textPrimary) }}>
                {col.value}
              </div>
              <div style={{ fontSize: '10px', fontFamily: fonts.mono,
                color: col.sub === 'TBD' ? tm.accentAmber : tm.textSecondary }}>
                {col.sub}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Timeline */}
      <div style={{ paddingLeft: '2px', paddingRight: '2px' }}>
        {trip.itinerary.map((item, idx) => {
          const color = done ? tm.textSecondary : (TYPE_COLOR[item.type] ?? tm.textSecondary);
          const isExpanded = expanded === idx;
          return (
            <div key={idx} style={{ display: 'flex', gap: '12px' }}>
              {/* Rail */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                  background: done ? tm.bgElevated : `${color}1E`,
                  border: `1.5px solid ${color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: done ? undefined : '10px',
                }}>
                  {done ? <Check size={10} color={tm.textSecondary} /> : <span>{item.icon}</span>}
                </div>
                {idx < trip.itinerary.length - 1 && (
                  <div style={{
                    width: '1px', flex: 1, minHeight: '14px', margin: '2px 0',
                    background: done
                      ? tm.borderSubtle
                      : `linear-gradient(to bottom, ${color}60, ${color}18)`,
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: '14px', paddingTop: '3px' }}>
                <div style={{ fontSize: '10px', color, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '1px' }}>
                  {item.time}
                </div>
                <div style={{
                  fontSize: '13px', fontFamily: fonts.body, fontWeight: 500, marginBottom: '2px',
                  color: done ? tm.textSecondary : tm.textPrimary,
                  textDecoration: done ? 'line-through' : 'none',
                }}>
                  {item.title}
                </div>
                {item.subtitle && (
                  <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                    {item.subtitle}
                  </div>
                )}
                {item.reasoning && !done && (
                  <button
                    onClick={() => setExpanded(isExpanded ? null : idx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0 0', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: '10px', color: tm.accentAmber, fontFamily: fonts.mono }}>
                      {isExpanded ? '▲ hide reason' : '▼ why?'}
                    </span>
                  </button>
                )}
                <AnimatePresence>
                  {item.reasoning && isExpanded && !done && (
                    <motion.div
                      key="r"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        marginTop: '6px', background: `${tm.accentAmber}0C`,
                        border: `1px solid ${tm.accentAmber}25`, borderRadius: '8px', padding: '8px 10px',
                      }}>
                        <p style={{ fontSize: '11px', color: tm.textNarration, fontFamily: fonts.body, margin: 0, lineHeight: 1.6 }}>
                          💡 {item.reasoning}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Planning: return day placeholder */}
      {planning && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          border: `1px dashed ${tm.accentAmber}40`, borderRadius: '12px', padding: '14px', marginTop: '4px',
        }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
            background: `${tm.accentAmber}18`, border: `1px dashed ${tm.accentAmber}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={13} color={tm.accentAmber} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.accentAmber, marginBottom: '3px' }}>
              Return Day — Being Planned
            </div>
            <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              Return timeline will appear once flight is confirmed
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Expenses tab ─────────────────────────────────────────────────────────────

function ExpensesTab({ trip }: { trip: TripDetail }) {
  const total = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const withinBudget = total <= trip.policyLimit;
  const pct = Math.min(100, Math.round((total / trip.policyLimit) * 100));
  const done = trip.status === 'completed';
  const planning = trip.status === 'Booking in progress';

  const byCategory: Record<string, number> = {};
  trip.expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount; });

  const catMeta: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    flight: { label: 'Flights', color: tm.accentAmber, icon: <Plane      size={14} color={tm.accentAmber} /> },
    cab:    { label: 'Cabs',    color: tm.accentTeal,  icon: <Car        size={14} color={tm.accentTeal}  /> },
    hotel:  { label: 'Hotel',   color: '#7C3AED',       icon: <Building2  size={14} color="#7C3AED"        /> },
    other:  { label: 'Other',   color: '#4A9EFF',       icon: <CreditCard size={14} color="#4A9EFF"        /> },
  };

  const barColor = done
    ? tm.textSecondary
    : withinBudget ? tm.accentTeal : tm.accentRed;

  return (
    <div>
      {/* Status top banner */}
      {planning && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: `${tm.accentAmber}0C`, border: `1px dashed ${tm.accentAmber}40`,
          borderRadius: '12px', padding: '10px 14px', marginBottom: '12px',
        }}>
          <Hourglass size={13} color={tm.accentAmber} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '11px', fontFamily: fonts.heading, fontWeight: 700, color: tm.accentAmber, marginBottom: '2px' }}>
              Estimated costs — not yet finalised
            </div>
            <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              Amounts may change once flights are confirmed
            </div>
          </div>
        </div>
      )}
      {done && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: `${tm.textSecondary}0A`, border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '12px', padding: '10px 14px', marginBottom: '12px',
        }}>
          <FileCheck size={13} color={tm.textSecondary} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '11px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textSecondary, marginBottom: '2px' }}>
              Expense report auto-filed ✓
            </div>
            <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              Submitted to finance · Approved
            </div>
          </div>
        </div>
      )}

      {/* Total */}
      <Card>
        <div style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginBottom: '4px' }}>
                {done ? 'TOTAL SPENT' : planning ? 'ESTIMATED SPEND' : 'TOTAL SPEND'}
              </div>
              <div style={{ fontSize: '24px', fontFamily: fonts.heading, fontWeight: 800,
                color: done ? tm.textSecondary : tm.textPrimary }}>
                {planning ? '~' : ''}₹{total.toLocaleString()}
              </div>
            </div>
            <Pill color={withinBudget ? barColor : tm.accentRed}>
              {withinBudget
                ? <Check size={10} color={barColor} />
                : <AlertCircle size={10} color={tm.accentRed} />}
              <span style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600,
                color: withinBudget ? barColor : tm.accentRed }}>
                {done ? 'Approved' : withinBudget ? 'Within limit' : 'Over limit'}
              </span>
            </Pill>
          </div>
          <div style={{ height: '5px', background: tm.bgElevated, borderRadius: '4px', overflow: 'hidden', marginBottom: '5px' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ height: '100%', borderRadius: '4px', background: barColor }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              ₹{total.toLocaleString()} of ₹{trip.policyLimit.toLocaleString()} limit
            </span>
            {withinBudget && !done && (
              <span style={{ fontSize: '10px', color: tm.accentTeal, fontFamily: fonts.mono }}>
                ₹{(trip.policyLimit - total).toLocaleString()} remaining
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* By category */}
      <Card>
        <div style={{ padding: '14px' }}>
          <MiniLabel>By Category</MiniLabel>
          {Object.entries(byCategory).map(([cat, amt], i, arr) => {
            const meta = catMeta[cat] ?? { label: cat, color: tm.textSecondary, icon: <CreditCard size={14} color={tm.textSecondary} /> };
            const p = Math.round((amt / total) * 100);
            return (
              <div key={cat} style={{ marginBottom: i < arr.length - 1 ? '12px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>{meta.icon}</span>
                    <span style={{ fontSize: '12px', fontFamily: fonts.body,
                      color: done ? tm.textSecondary : tm.textPrimary }}>{meta.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>{p}%</span>
                    <span style={{ fontSize: '13px', fontFamily: fonts.mono, fontWeight: 600,
                      color: done ? tm.textSecondary : tm.textPrimary }}>
                      {planning ? '~' : ''}₹{amt.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ height: '4px', background: tm.bgElevated, borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p}%` }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
                    style={{ height: '100%', borderRadius: '3px', background: done ? tm.textSecondary : meta.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Line items */}
      <Card>
        <div style={{ padding: '10px 14px 6px', borderBottom: `1px solid ${tm.borderSubtle}` }}>
          <MiniLabel>Line Items</MiniLabel>
        </div>
        {trip.expenses.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            borderBottom: i < trip.expenses.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '15px', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: '12px', fontFamily: fonts.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                color: done ? tm.textSecondary : tm.textNarration }}>
                {item.label}
              </span>
            </div>
            <span style={{ fontSize: '13px', fontFamily: fonts.mono, fontWeight: 600, flexShrink: 0, marginLeft: '8px',
              color: done ? tm.textSecondary : tm.textPrimary }}>
              {planning ? '~' : ''}₹{item.amount.toLocaleString()}
            </span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', background: tm.bgElevated,
          borderTop: `1px solid ${done ? tm.borderSubtle : tm.accentAmber + '30'}`,
        }}>
          <span style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700,
            color: done ? tm.textSecondary : tm.textPrimary }}>TOTAL</span>
          <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800,
            color: done ? tm.textSecondary : tm.textPrimary }}>
            {planning ? '~' : ''}₹{total.toLocaleString()}
          </span>
        </div>
      </Card>

      {!planning && (
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { icon: <Download size={14} color={tm.textSecondary} />, label: done ? 'Download Receipt' : 'Export PDF' },
            { icon: <Share2 size={14} color={tm.textSecondary} />, label: 'Share' },
          ].map((btn, i) => (
            <button key={i} style={{
              flex: 1, background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '12px', padding: '11px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              {btn.icon}
              <span style={{ fontSize: '12px', fontFamily: fonts.body, color: tm.textSecondary }}>{btn.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Hotel card ──────────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  Wifi:      <Wifi size={10} />,
  Parking:   <Car size={10} />,
  Breakfast: <Coffee size={10} />,
};

function HotelCard({ hotel, dim }: { hotel: HotelEntry; dim: boolean }) {
  const statusColor =
    hotel.status === 'completed' ? tm.textSecondary :
    hotel.status === 'booked'    ? tm.accentTeal :
                                   tm.accentAmber;

  return (
    <Card>
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${tm.borderSubtle}` }}>
        <MiniLabel>Hotel</MiniLabel>
      </div>
      <div style={{ padding: '14px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Building2 size={18} color="#7C3AED" />
              <div>
                <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700,
                  color: dim ? tm.textSecondary : tm.textPrimary }}>
                  {hotel.name}
                </div>
                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} size={9} color={dim ? tm.textSecondary : tm.accentAmber} fill={dim ? tm.textSecondary : tm.accentAmber} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={10} color={tm.textSecondary} />
              <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                {hotel.distanceFromVenue}
              </span>
            </div>
          </div>
          <Pill color={statusColor}>
            {hotel.status === 'completed' && <Check size={10} color={statusColor} />}
            <span style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600,
              textTransform: 'capitalize', color: statusColor }}>
              {hotel.status}
            </span>
          </Pill>
        </div>

        {/* Check-in / Check-out */}
        <div style={{
          display: 'flex', gap: '0',
          background: tm.bgElevated, borderRadius: '10px',
          padding: '10px 0', marginBottom: '12px',
        }}>
          {[
            { label: 'Check-in', value: hotel.checkIn },
            { label: 'Nights', value: String(hotel.nights) },
            { label: 'Check-out', value: hotel.checkOut },
          ].map((col, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
              {i > 0 && (
                <div style={{
                  position: 'absolute', left: 0, top: '10%', height: '80%',
                  width: '1px', background: tm.borderSubtle,
                }} />
              )}
              <div style={{ fontSize: '9px', color: tm.textSecondary, fontFamily: fonts.mono,
                textTransform: 'uppercase', marginBottom: '3px' }}>
                {col.label}
              </div>
              <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 800,
                color: dim ? tm.textSecondary : tm.textPrimary }}>
                {col.value}
              </div>
            </div>
          ))}
        </div>

        {/* Amenities + price + confirmation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {hotel.amenities.map(a => (
              <div key={a} style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
                borderRadius: '6px', padding: '3px 7px',
              }}>
                <span style={{ color: tm.textSecondary }}>{AMENITY_ICONS[a] ?? null}</span>
                <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>{a}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '10px' }}>
            <div style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 800,
              color: dim ? tm.textSecondary : tm.textPrimary }}>
              ₹{hotel.pricePerNight.toLocaleString()}
            </div>
            <div style={{ fontSize: '9px', color: tm.textSecondary, fontFamily: fonts.mono }}>per night</div>
          </div>
        </div>

        {/* Confirmation ID */}
        {hotel.confirmationId !== 'PENDING' && (
          <div style={{
            marginTop: '12px', padding: '8px 12px',
            background: `${tm.accentTeal}10`, border: `1px solid ${tm.accentTeal}30`,
            borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>Confirmation ID</span>
            <span style={{ fontSize: '11px', color: tm.accentTeal, fontFamily: fonts.mono, fontWeight: 700,
              letterSpacing: '1px' }}>
              {hotel.confirmationId}
            </span>
          </div>
        )}
        {hotel.confirmationId === 'PENDING' && (
          <div style={{
            marginTop: '12px', padding: '8px 12px',
            background: `${tm.accentAmber}10`, border: `1px dashed ${tm.accentAmber}40`,
            borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>Confirmation ID</span>
            <span style={{ fontSize: '11px', color: tm.accentAmber, fontFamily: fonts.mono, fontWeight: 700 }}>
              Awaiting confirmation
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Details tab ─────────────────────────────────────────────────────────────

function DetailsTab({ trip }: { trip: TripDetail }) {
  const done = trip.status === 'completed';
  const planning = trip.status === 'Booking in progress';

  const agentAccent = done ? tm.textSecondary : planning ? tm.accentAmber : tm.accentTeal;
  const agentBg = `${agentAccent}0C`;
  const agentBorder = `${agentAccent}30`;
  const agentEmoji = done ? '✅' : planning ? '⚙️' : '🤖';
  const agentTitle = done
    ? 'Post-trip summary'
    : planning
    ? 'Agent is working on this'
    : 'Why TripMind chose this';

  return (
    <div>
      {/* Agent card */}
      <div style={{
        background: agentBg, border: `1px solid ${agentBorder}`,
        borderRadius: '14px', padding: '14px', marginBottom: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: `${agentAccent}1E`, border: `1px solid ${agentAccent}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
          }}>
            {agentEmoji}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: agentAccent }}>
              {agentTitle}
            </div>
            {planning && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  style={{ width: '5px', height: '5px', borderRadius: '50%', background: tm.accentAmber }}
                />
                <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  Active · Monitoring fares
                </span>
              </div>
            )}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: tm.textNarration, fontFamily: fonts.body, margin: 0, lineHeight: 1.7 }}>
          {trip.agentNote}
        </p>
      </div>

      {/* Flights */}
      {!planning && (
        <>
          <FlightCard leg={trip.outbound} label="Outbound" dim={done} />
          {trip.inbound && <FlightCard leg={trip.inbound} label="Return" dim={done} />}
        </>
      )}
      {planning && (
        <>
          <FlightCard leg={trip.outbound} label="Outbound — Shortlisted" dim={false} />
          {/* Return placeholder */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            border: `1px dashed ${tm.accentAmber}40`, borderRadius: '14px', padding: '14px', marginBottom: '12px',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
              background: `${tm.accentAmber}10`, border: `1px dashed ${tm.accentAmber}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plane size={14} color={tm.accentAmber} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.accentAmber, marginBottom: '3px' }}>
                Return Flight — Pending
              </div>
              <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                Monitoring 3 fare options for {trip.to} → {trip.from}
              </div>
            </div>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              style={{ width: '7px', height: '7px', borderRadius: '50%', background: tm.accentAmber, flexShrink: 0 }}
            />
          </div>
        </>
      )}

      {/* Ground transport */}
      <Card>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${tm.borderSubtle}` }}>
          <MiniLabel>Ground Transport</MiniLabel>
        </div>
        {trip.cabs.length === 0 ? (
          <div style={{ padding: '14px' }}>
            <span style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.body }}>No cabs arranged yet</span>
          </div>
        ) : (
          trip.cabs.map((cab, i) => {
            const cabColor = cab.status === 'completed' ? tm.textSecondary : cab.status === 'booked' ? tm.accentTeal : tm.accentAmber;
            return (
              <div key={cab.id} style={{
                padding: '12px 14px',
                borderBottom: i < trip.cabs.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Car size={17} color={tm.accentTeal} />
                    <div>
                      <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700,
                        color: done ? tm.textSecondary : tm.textPrimary }}>
                        {cab.label} · {cab.provider}
                      </div>
                      <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                        {cab.type} · {cab.pickupTime}
                      </div>
                    </div>
                  </div>
                  <Pill color={cabColor}>
                    {cab.status === 'completed' && <Check size={10} color={cabColor} />}
                    <span style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600, color: cabColor }}>
                      {cab.status}
                    </span>
                  </Pill>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', paddingTop: '2px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tm.accentAmber, flexShrink: 0 }} />
                    <div style={{ width: '1px', flex: 1, minHeight: '12px', background: tm.borderSubtle }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: tm.accentTeal, flexShrink: 0 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontFamily: fonts.body,
                      color: done ? tm.textSecondary : tm.textPrimary, marginBottom: '10px' }}>
                      {cab.from}
                    </div>
                    <div style={{ fontSize: '12px', fontFamily: fonts.body,
                      color: done ? tm.textSecondary : tm.textPrimary }}>
                      {cab.to}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontFamily: fonts.mono, fontWeight: 700,
                      color: done ? tm.textSecondary : tm.textPrimary }}>
                      ₹{cab.fare}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', marginTop: '3px' }}>
                      <Clock size={10} color={tm.textSecondary} />
                      <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: tm.textSecondary }}>
                        {cab.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </Card>

      {/* Hotel */}
      {trip.hotel && <HotelCard hotel={trip.hotel} dim={done} />}

      {/* Trip info */}
      <Card>
        <div style={{ padding: '14px' }}>
          <MiniLabel>Trip Info</MiniLabel>
          {[
            { icon: <MapPin size={13} color={tm.textSecondary} />, label: 'Purpose', value: trip.purpose },
            {
              icon: <Clock size={13} color={tm.textSecondary} />,
              label: 'Dates',
              value: trip.returnDate && trip.returnDate !== trip.date
                ? `${trip.date} → ${trip.returnDate}`
                : trip.date,
            },
            {
              icon: <Plane size={13} color={tm.textSecondary} />,
              label: 'Route',
              value: `${trip.fromCity} → ${trip.toCity}`,
            },
            {
              icon: <Leaf size={13} color={done ? tm.textSecondary : tm.accentTeal} />,
              label: 'Carbon footprint',
              value: `${trip.outbound.carbonKg + (trip.inbound?.carbonKg ?? 0)} kg CO₂`,
            },
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              paddingBottom: i < arr.length - 1 ? '10px' : 0,
              borderBottom: i < arr.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
              marginBottom: i < arr.length - 1 ? '10px' : 0,
            }}>
              <div style={{ marginTop: '1px', flexShrink: 0 }}>{row.icon}</div>
              <div>
                <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginBottom: '2px' }}>
                  {row.label}
                </div>
                <div style={{ fontSize: '13px', fontFamily: fonts.body, fontWeight: 500,
                  color: done ? tm.textSecondary : tm.textPrimary }}>
                  {row.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function TripDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Itinerary');

  const trip: TripDetail | undefined = id != null ? TRIP_DETAILS[id] : undefined;

  useEffect(() => {
    if (trip?.status === 'Booking in progress') {
      navigate('/agent-auto', { replace: true });
    }
  }, [trip, navigate]);

  if (trip?.status === 'Booking in progress') return null;

  if (!trip) {
    return (
      <div style={{
        background: tm.bgPrimary, minHeight: '100%', fontFamily: fonts.body,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
      }}>
        <span style={{ fontSize: '40px' }}>🗺️</span>
        <p style={{ color: tm.textSecondary, fontSize: '14px', margin: 0 }}>Trip not found</p>
        <button
          onClick={() => navigate('/trips')}
          style={{
            background: tm.accentAmber, border: 'none', borderRadius: '12px',
            padding: '10px 22px', cursor: 'pointer', fontSize: '13px',
            fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff',
          }}
        >
          ← Back to My Trips
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: tm.bgPrimary, fontFamily: fonts.body, display: 'flex', flexDirection: 'column' }}>
      <HeroHeader trip={trip} onBack={() => navigate('/trips')} />
      <TabBar status={trip.status} active={activeTab} onChange={setActiveTab} />
      <div style={{ padding: '14px 14px 40px' }}>
        {activeTab === 'Itinerary' && <ItineraryTab trip={trip} />}
        {activeTab === 'Expenses' && <ExpensesTab trip={trip} />}
        {activeTab === 'Details' && <DetailsTab trip={trip} />}
      </div>
    </div>
  );
}
