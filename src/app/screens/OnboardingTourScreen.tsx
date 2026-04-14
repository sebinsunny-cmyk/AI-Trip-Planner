import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { tm, fonts } from '../constants/colors';
import { NovaBubble, StepDots } from '../components/NovaBubble';

const TRAVELLER_TYPES = [
  {
    id: 'frequent',
    emoji: '🧳',
    headline: 'Frequent business traveller',
    sub: 'Multiple trips every month',
    accent: '#F5A623',
  },
  {
    id: 'occasional',
    emoji: '✈️',
    headline: 'Occasional work trips',
    sub: 'A few times a year',
    accent: '#3B82F6',
  },
  {
    id: 'mixed',
    emoji: '🌴',
    headline: 'Mix of work & leisure',
    sub: 'It depends on the season',
    accent: '#00C9A7',
  },
];

export function OnboardingTourScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelected(id);
    setTimeout(() => navigate('/onboarding/name'), 380);
  }

  return (
    <div style={{
      background: tm.bgPrimary, height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar — dots only (no back on first guided step) */}
      <div style={{
        padding: '20px 20px 0',
        display: 'flex', justifyContent: 'center',
      }}>
        <StepDots step={1} />
      </div>

      {/* Nova question */}
      <div style={{ paddingTop: '22px' }}>
        <NovaBubble
          message="Hi! I'm Nova ✨ I'll be your AI travel companion. What kind of traveller are you?"
          delay={0.1}
        />
      </div>

      {/* Traveller type cards — vertically centred */}
      <div style={{
        flex: 1, padding: '0 20px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px',
      }}>
        {TRAVELLER_TYPES.map(({ id, emoji, headline, sub, accent }, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 + i * 0.09, type: 'spring', stiffness: 300, damping: 28 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(id)}
            style={{
              background: selected === id ? `${accent}12` : tm.bgSurface,
              border: `1.5px solid ${selected === id ? accent : tm.borderSubtle}`,
              borderRadius: '16px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '14px',
              textAlign: 'left',
              transition: 'border-color 0.18s, background 0.18s',
            }}
          >
            {/* Icon */}
            <div style={{
              width: 50, height: 50, borderRadius: '14px', flexShrink: 0,
              background: `${accent}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
            }}>
              {emoji}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700,
                color: tm.textPrimary, marginBottom: '3px',
              }}>
                {headline}
              </div>
              <div style={{
                fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono,
              }}>
                {sub}
              </div>
            </div>

            {/* Check mark on select */}
            {selected === id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: accent, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>✓</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
