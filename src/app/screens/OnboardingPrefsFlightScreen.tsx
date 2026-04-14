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

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', background: tm.bgSurface,
      border: `1px solid ${tm.borderSubtle}`, borderRadius: '12px', marginBottom: '8px',
    }}>
      <div>
        <div style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textPrimary, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '1px' }}>{desc}</div>}
      </div>
      <button
        onClick={onChange}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0,
          background: value ? tm.accentTeal : tm.bgElevated,
          border: `1px solid ${value ? tm.accentTeal : tm.borderSubtle}`,
          cursor: 'pointer', position: 'relative', padding: 0, transition: 'all 0.2s',
        }}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        />
      </button>
    </div>
  );
}

export function OnboardingPrefsFlightScreen() {
  const navigate = useNavigate();
  const [flightClass,  setFlightClass]  = useState('Economy');
  const [seatPref,     setSeatPref]     = useState('Window');
  const [cabinOnly,    setCabinOnly]    = useState(false);
  const [directOnly,   setDirectOnly]   = useState(false);

  function proceed() { navigate('/onboarding/prefs-hotel'); }

  return (
    <div style={{ background: tm.bgPrimary, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: fonts.body }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <StepBar step={2} total={4} />
        <div style={{ marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>Step 2 of 4</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0 4px' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/onboarding/profile')}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <ArrowLeft size={15} color={tm.textPrimary} />
          </motion.button>
          <h1 style={{ fontSize: '22px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, margin: 0 }}>
            Flight &amp; luggage
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '0 0 16px', paddingLeft: '42px' }}>
          We'll use these as defaults for every trip
        </p>
      </div>

      {/* Scrollable prefs */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px', scrollbarWidth: 'none' }}>
        <ChipGroup
          label="FLIGHT CLASS"
          options={['Economy', 'Business', 'First Class']}
          selected={flightClass}
          onChange={setFlightClass}
        />
        <ChipGroup
          label="SEAT PREFERENCE"
          options={['Window', 'Aisle', 'Middle', 'No preference']}
          selected={seatPref}
          onChange={setSeatPref}
        />
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', letterSpacing: '0.07em' }}>
            LUGGAGE & STOPS
          </div>
          <ToggleRow
            label="Cabin baggage only"
            desc="Avoid checked-in luggage fees"
            value={cabinOnly}
            onChange={() => setCabinOnly(v => !v)}
          />
          <ToggleRow
            label="Direct flights only"
            desc="No connecting flights"
            value={directOnly}
            onChange={() => setDirectOnly(v => !v)}
          />
        </div>
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
