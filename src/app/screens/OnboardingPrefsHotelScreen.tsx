import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Building2, Hotel, Crown } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { NovaBubble, StepDots } from '../components/NovaBubble';

/* ─── Data ────────────────────────────────────────────────────────────────── */

const HOTEL_TIERS: { id: string; Icon: React.ElementType; label: string; sub: string }[] = [
  { id: '3 Star', Icon: Building2, label: 'Budget',  sub: '3 Star' },
  { id: '4 Star', Icon: Hotel,     label: 'Comfort', sub: '4 Star' },
  { id: '5 Star', Icon: Crown,     label: 'Premium', sub: '5 Star' },
];

const CAB_TYPES = ['Sedan', 'SUV', 'Mini', 'No preference'];
const MEAL_PREFS = ['Vegetarian', 'Non-Veg', 'Vegan', 'Jain', 'Any'];

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function HotelGrid({ selected, onChange }: { selected: string; onChange: (v: string) => void }) {
  const accent = tm.accentAmber;
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{
        fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
        fontWeight: 600, letterSpacing: '0.07em', marginBottom: '10px',
      }}>
        HOTEL TIER
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {HOTEL_TIERS.map(({ id, Icon, label, sub }, i) => {
          const active = selected === id;
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(id)}
              style={{
                flex: 1, padding: '14px 6px', borderRadius: '14px',
                background: active ? `${accent}14` : tm.bgSurface,
                border: `1.5px solid ${active ? accent : tm.borderSubtle}`,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                transition: 'all 0.18s',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '13px',
                background: active ? `${accent}18` : tm.bgElevated,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
              }}>
                <Icon size={22} color={active ? accent : tm.textSecondary} strokeWidth={1.75} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{
                  fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700,
                  color: active ? accent : tm.textPrimary,
                }}>
                  {label}
                </span>
                <span style={{
                  fontSize: '10px', fontFamily: fonts.mono,
                  color: active ? `${accent}90` : tm.textSecondary,
                }}>
                  {sub}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ChipRow({ label, options, selected, onChange, accent = tm.accentAmber }: {
  label: string; options: string[]; selected: string;
  onChange: (v: string) => void; accent?: string;
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
        fontWeight: 600, letterSpacing: '0.07em', marginBottom: '10px',
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(opt => {
          const active = selected === opt;
          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.94 }}
              onClick={() => onChange(opt)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px 16px', borderRadius: '22px',
                border: `1px solid ${active ? accent : tm.borderSubtle}`,
                background: active ? `${accent}15` : tm.bgSurface,
                cursor: 'pointer', fontSize: '13px', fontFamily: fonts.body,
                color: active ? accent : tm.textPrimary,
                fontWeight: active ? 700 : 400,
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Screen ──────────────────────────────────────────────────────────────── */

export function OnboardingPrefsHotelScreen() {
  const navigate = useNavigate();
  const [hotelTier, setHotelTier] = useState('4 Star');
  const [cabType,   setCabType]   = useState('Sedan');
  const [mealPref,  setMealPref]  = useState('Any');

  function proceed() { navigate('/onboarding/permissions'); }

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
          onClick={() => navigate('/onboarding/prefs-flight')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={15} color={tm.textPrimary} />
        </motion.button>
        <StepDots step={6} />
      </div>

      {/* Nova question */}
      <div style={{ paddingTop: '22px', flexShrink: 0 }}>
        <NovaBubble message="After a long day of meetings — where do you like to stay?" />
      </div>

      {/* Prefs content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0', scrollbarWidth: 'none' }}>
        <HotelGrid selected={hotelTier} onChange={setHotelTier} />
        <ChipRow
          label="CAB TYPE"
          options={CAB_TYPES}
          selected={cabType}
          onChange={setCabType}
          accent="#00C9A7"
        />
        <ChipRow
          label="MEAL PREFERENCE"
          options={MEAL_PREFS}
          selected={mealPref}
          onChange={setMealPref}
          accent="#7C3AED"
        />
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
