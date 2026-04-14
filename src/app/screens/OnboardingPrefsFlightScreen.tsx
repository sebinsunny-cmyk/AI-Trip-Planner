import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { NovaBubble, StepDots } from '../components/NovaBubble';

/* ─── Visual card grids ───────────────────────────────────────────────────── */

const FLIGHT_CLASSES = [
  { id: 'Economy',     emoji: '🪑', label: 'Economy',     sub: 'Smart & efficient' },
  { id: 'Business',    emoji: '💼', label: 'Business',    sub: 'Extra comfort'     },
  { id: 'First Class', emoji: '🥂', label: 'First Class', sub: 'Top tier'          },
];

const SEAT_PREFS = [
  { id: 'Window',       emoji: '🪟', label: 'Window',        sub: 'Views & lean' },
  { id: 'Aisle',        emoji: '↔️',  label: 'Aisle',         sub: 'Easy exit'    },
  { id: 'No preference',emoji: '🎲', label: 'No preference', sub: 'Anything works'},
];

function VisualGrid<T extends { id: string; emoji: string; label: string; sub: string }>({
  label, items, selected, onChange, accent = tm.accentAmber,
}: {
  label: string;
  items: T[];
  selected: string;
  onChange: (id: string) => void;
  accent?: string;
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
        fontWeight: 600, letterSpacing: '0.07em', marginBottom: '10px',
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {items.map(({ id, emoji, label: lbl, sub }, i) => {
          const active = selected === id;
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(id)}
              style={{
                flex: 1, padding: '12px 6px', borderRadius: '14px',
                background: active ? `${accent}14` : tm.bgSurface,
                border: `1.5px solid ${active ? accent : tm.borderSubtle}`,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '6px',
                transition: 'all 0.18s',
              }}
            >
              <span style={{ fontSize: '22px', lineHeight: 1 }}>{emoji}</span>
              <div>
                <div style={{
                  fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700,
                  color: active ? accent : tm.textPrimary, lineHeight: 1.2,
                }}>
                  {lbl}
                </div>
                <div style={{
                  fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '2px',
                }}>
                  {sub}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: {
  label: string; desc?: string; value: boolean; onChange: () => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 14px',
      background: tm.bgSurface, border: `1px solid ${value ? `${tm.accentTeal}50` : tm.borderSubtle}`,
      borderRadius: '12px', marginBottom: '8px', transition: 'border-color 0.2s',
    }}>
      <div>
        <div style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textPrimary, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '1px' }}>{desc}</div>}
      </div>
      <button
        onClick={onChange}
        style={{
          width: 44, height: 24, borderRadius: 12, flexShrink: 0,
          background: value ? tm.accentTeal : tm.bgElevated,
          border: `1px solid ${value ? tm.accentTeal : tm.borderSubtle}`,
          cursor: 'pointer', position: 'relative', padding: 0, transition: 'all 0.2s',
        }}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        />
      </button>
    </div>
  );
}

/* ─── Screen ──────────────────────────────────────────────────────────────── */

export function OnboardingPrefsFlightScreen() {
  const navigate = useNavigate();
  const [flightClass, setFlightClass] = useState('Economy');
  const [seatPref,    setSeatPref]    = useState('Window');
  const [cabinOnly,   setCabinOnly]   = useState(false);
  const [directOnly,  setDirectOnly]  = useState(false);

  function proceed() { navigate('/onboarding/prefs-hotel'); }

  return (
    <div style={{
      background: tm.bgPrimary, height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '20px 20px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/onboarding/location')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={15} color={tm.textPrimary} />
        </motion.button>
        <StepDots step={5} />
      </div>

      {/* Nova question */}
      <div style={{ paddingTop: '22px', flexShrink: 0 }}>
        <NovaBubble message="How do you prefer to fly? I'll use this for every search." />
      </div>

      {/* Prefs content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0', scrollbarWidth: 'none' }}>
        <VisualGrid
          label="FLIGHT CLASS"
          items={FLIGHT_CLASSES}
          selected={flightClass}
          onChange={setFlightClass}
        />
        <VisualGrid
          label="SEAT PREFERENCE"
          items={SEAT_PREFS}
          selected={seatPref}
          onChange={setSeatPref}
          accent="#3B82F6"
        />

        <div style={{ marginBottom: '8px' }}>
          <div style={{
            fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
            fontWeight: 600, letterSpacing: '0.07em', marginBottom: '10px',
          }}>
            DEAL-BREAKERS
          </div>
          <ToggleRow
            label="Direct flights only"
            desc="Skip connecting flights"
            value={directOnly}
            onChange={() => setDirectOnly(v => !v)}
          />
          <ToggleRow
            label="Cabin baggage only"
            desc="Avoid checked-luggage fees"
            value={cabinOnly}
            onChange={() => setCabinOnly(v => !v)}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px 36px', flexShrink: 0,
        borderTop: `1px solid ${tm.borderSubtle}`,
        display: 'flex', flexDirection: 'column', gap: '10px',
        background: tm.bgPrimary,
      }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={proceed}
          style={{
            width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
            background: tm.accentAmber, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
            Looks good →
          </span>
        </motion.button>
        <button onClick={proceed} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary }}>
            Use defaults
          </span>
        </button>
      </div>
    </div>
  );
}
