import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, Plane, Leaf, ArrowRight, ArrowLeft } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  carbonKg: number;
  recommended?: boolean;
  reasoning?: string;
}

const AIRLINE_COLORS: Record<string, string> = {
  IndiGo: '#1A56DB',
  'Air India': '#C8001E',
  Vistara: '#6B21A8',
};

const AIRLINE_EMOJI: Record<string, string> = {
  IndiGo: '🔵',
  'Air India': '🔴',
  Vistara: '🟣',
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
  if (flight.price === minPrice)                             return { label: 'Cheapest',   color: '#22C55E' };
  if (parseDurationMinutes(flight.duration) === minDuration) return { label: 'Fastest',    color: '#3B82F6' };
  if (flight.stops === 0)                                    return { label: 'Non-stop',   color: tm.accentTeal };
  if (flight.carbonKg === minCarbon)                         return { label: 'Greenest',   color: '#16A34A' };
  if (flight.recommended)                                    return { label: 'Best Value', color: tm.accentAmber };
  return null;
}

interface FlightOptionCardProps {
  flights: FlightOption[];           // outbound
  returnFlights?: FlightOption[];    // return (round trip)
  origin?: string;
  destination?: string;
  date?: string;
  onSelect: (outbound: FlightOption, returnFlight?: FlightOption) => void;
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({
  label, route, accent, icon,
}: {
  label: string;
  route: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        background: `${accent}18`, border: `1px solid ${accent}35`,
        borderRadius: '8px', padding: '4px 10px', flexShrink: 0,
      }}>
        {icon}
        <span style={{ fontSize: '11px', fontFamily: fonts.mono, fontWeight: 700, color: accent, letterSpacing: '0.04em' }}>
          {label}
        </span>
      </div>
      <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
      <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.textSecondary, flexShrink: 0 }}>
        {route}
      </span>
    </div>
  );
}

// ─── Single flight row ────────────────────────────────────────────────────────
function FlightRow({
  flight, isSelected, accent, origin, destination, onSelect, expandedReason, onToggleReason, allFlights = [],
}: {
  flight: FlightOption;
  isSelected: boolean;
  accent: string;
  origin: string;
  destination: string;
  onSelect: () => void;
  expandedReason: boolean;
  onToggleReason: (e: React.MouseEvent) => void;
  allFlights?: FlightOption[];
}) {
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

      {/* Airline + times */}
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

      {/* Route times row */}
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
          <div style={{
            fontSize: '10px',
            color: flight.stops === 0 ? tm.accentTeal : tm.textSecondary,
            fontFamily: fonts.mono, marginTop: '3px',
          }}>
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

      {/* Insight chip */}
      {insight && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            display: 'inline-block',
            background: `${insight.color}1A`, border: `1px solid ${insight.color}45`,
            borderRadius: '20px', padding: '2px 9px',
          }}>
            <span style={{ fontSize: '10px', color: insight.color, fontFamily: fonts.mono, fontWeight: 700, letterSpacing: '0.02em' }}>
              {insight.label}
            </span>
          </div>
        </div>
      )}

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

      {/* Reasoning toggle */}
      {flight.reasoning && (
        <button
          onClick={onToggleReason}
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
              <p style={{ fontSize: '12px', color: tm.textNarration, fontFamily: fonts.body, margin: 0, lineHeight: 1.6 }}>
                💡 {flight.reasoning}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function FlightOptionCard({
  flights,
  returnFlights,
  origin = 'COK',
  destination = 'BOM',
  date = 'Apr 15',
  onSelect,
}: FlightOptionCardProps) {
  const isRoundTrip = !!returnFlights?.length;

  const [selectedOutboundId, setSelectedOutboundId] = useState<string>(
    flights.find(f => f.recommended)?.id ?? flights[0]?.id
  );
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(
    isRoundTrip ? (returnFlights!.find(f => f.recommended)?.id ?? returnFlights![0]?.id) : null
  );
  const initialExpanded = new Set<string>([
    flights.find(f => f.recommended)?.id,
    returnFlights?.find(f => f.recommended)?.id,
  ].filter(Boolean) as string[]);
  const [expandedReasons, setExpandedReasons] = useState<Set<string>>(initialExpanded);

  const selectedOutbound = flights.find(f => f.id === selectedOutboundId)!;
  const selectedReturn = returnFlights?.find(f => f.id === selectedReturnId);
  const totalPrice = selectedOutbound.price + (selectedReturn?.price ?? 0);
  const canBook = !isRoundTrip || !!selectedReturn;

  return (
    <div>
      {/* ── Outbound section ── */}
      <SectionHeader
        label="OUTBOUND"
        route={`${origin} → ${destination} · ${date}`}
        accent={tm.accentAmber}
        icon={<ArrowRight size={11} color={tm.accentAmber} />}
      />

      {flights.map(flight => (
        <FlightRow
          key={flight.id}
          flight={flight}
          isSelected={selectedOutboundId === flight.id}
          accent={tm.accentAmber}
          origin={origin}
          destination={destination}
          onSelect={() => setSelectedOutboundId(flight.id)}
          expandedReason={expandedReasons.has(flight.id)}
          allFlights={flights}
          onToggleReason={e => {
            e.stopPropagation();
            setExpandedReasons(prev => {
              const next = new Set(prev);
              next.has(flight.id) ? next.delete(flight.id) : next.add(flight.id);
              return next;
            });
          }}
        />
      ))}

      {/* ── Return section ── */}
      {isRoundTrip && (
        <>
          <div style={{ height: '6px' }} />
          <SectionHeader
            label="RETURN"
            route={`${destination} → ${origin} · ${date}`}
            accent={tm.accentTeal}
            icon={<ArrowLeft size={11} color={tm.accentTeal} />}
          />

          {returnFlights!.map(flight => (
            <FlightRow
              key={flight.id}
              flight={flight}
              isSelected={selectedReturnId === flight.id}
              accent={tm.accentTeal}
              origin={destination}
              destination={origin}
              onSelect={() => setSelectedReturnId(flight.id)}
              expandedReason={expandedReasons.has(flight.id)}
              allFlights={returnFlights}
              onToggleReason={e => {
                e.stopPropagation();
                setExpandedReasons(prev => {
                  const next = new Set(prev);
                  next.has(flight.id) ? next.delete(flight.id) : next.add(flight.id);
                  return next;
                });
              }}
            />
          ))}
        </>
      )}

      {/* ── Selection summary ── */}
      {isRoundTrip && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: tm.bgElevated,
            border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Outbound summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: tm.accentAmber, flexShrink: 0,
              }} />
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.textPrimary }}>
                {selectedOutbound.departure} · {selectedOutbound.airline} {selectedOutbound.flightNumber}
              </span>
            </div>
            {/* Return summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: selectedReturn ? tm.accentTeal : tm.borderSubtle, flexShrink: 0,
              }} />
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: selectedReturn ? tm.textPrimary : tm.textSecondary }}>
                {selectedReturn
                  ? `${selectedReturn.departure} · ${selectedReturn.airline} ${selectedReturn.flightNumber}`
                  : 'Select return flight above'}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '9px', color: tm.textSecondary, fontFamily: fonts.mono }}>TOTAL</div>
            <div style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
              ₹{totalPrice.toLocaleString()}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Primary CTA ── */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => canBook && onSelect(selectedOutbound, selectedReturn)}
        disabled={!canBook}
        style={{
          width: '100%',
          background: canBook ? tm.accentAmber : `${tm.accentAmber}50`,
          border: 'none',
          borderRadius: '12px',
          padding: '13px',
          cursor: canBook ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
          {isRoundTrip
            ? 'Book Both Flights'
            : `Book ${selectedOutbound?.airline} ${selectedOutbound?.flightNumber}`}
        </span>
        <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
      </motion.button>

      <button
        style={{
          width: '100%',
          background: 'transparent',
          border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '12px',
          padding: '12px',
          cursor: 'pointer',
          fontSize: '13px',
          color: tm.textSecondary,
          fontFamily: fonts.body,
        }}
      >
        Modify preferences
      </button>
    </div>
  );
}
