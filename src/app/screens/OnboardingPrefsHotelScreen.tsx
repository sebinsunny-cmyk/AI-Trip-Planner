import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? tm.accentAmber : tm.borderSubtle, transition: 'background 0.3s' }} />
      ))}
    </div>
  );
}

function ChipGroup({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', letterSpacing: '0.07em' }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(opt => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange(opt)}
            style={{
              padding: '9px 18px', borderRadius: '22px',
              border: `1px solid ${selected === opt ? tm.accentAmber : tm.borderSubtle}`,
              background: selected === opt ? `${tm.accentAmber}15` : tm.bgSurface,
              cursor: 'pointer', fontSize: '13px', fontFamily: fonts.body,
              color: selected === opt ? tm.accentAmber : tm.textPrimary,
              fontWeight: selected === opt ? 700 : 400,
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function OnboardingPrefsHotelScreen() {
  const navigate = useNavigate();
  const [hotelStars, setHotelStars] = useState('4 Star');
  const [roomType,   setRoomType]   = useState('Standard');
  const [cabType,    setCabType]    = useState('Sedan');
  const [mealPref,   setMealPref]   = useState('No preference');

  function proceed() { navigate('/onboarding/permissions'); }

  return (
    <div style={{ background: tm.bgPrimary, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: fonts.body }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <StepBar step={3} total={4} />
        <div style={{ marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>Step 3 of 4</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0 4px' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/onboarding/prefs-flight')}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <ArrowLeft size={15} color={tm.textPrimary} />
          </motion.button>
          <h1 style={{ fontSize: '22px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, margin: 0 }}>
            Hotel &amp; cab
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '0 0 16px', paddingLeft: '42px' }}>
          Your preferences for stays and ground transport
        </p>
      </div>

      {/* Scrollable prefs */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px', scrollbarWidth: 'none' }}>
        <ChipGroup
          label="HOTEL STARS"
          options={['5 Star', '4 Star', '3 Star', 'Any']}
          selected={hotelStars}
          onChange={setHotelStars}
        />
        <ChipGroup
          label="ROOM TYPE"
          options={['Standard', 'Deluxe', 'Suite', 'Day use']}
          selected={roomType}
          onChange={setRoomType}
        />
        <ChipGroup
          label="CAB TYPE"
          options={['Sedan', 'SUV', 'Mini', 'No preference']}
          selected={cabType}
          onChange={setCabType}
        />
        <ChipGroup
          label="MEAL PREFERENCE"
          options={['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'No preference']}
          selected={mealPref}
          onChange={setMealPref}
        />
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px 36px', flexShrink: 0, borderTop: `1px solid ${tm.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '10px', background: tm.bgPrimary }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={proceed}
          style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', background: tm.accentAmber, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>Continue</span>
          <ChevronRight size={16} color="#fff" />
        </motion.button>
        <button onClick={proceed} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary }}>Skip — use defaults</span>
        </button>
      </div>
    </div>
  );
}
