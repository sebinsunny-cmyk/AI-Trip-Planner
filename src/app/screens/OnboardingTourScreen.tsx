import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

const FEATURES = [
  {
    emoji: '🎙️',
    headline: 'Just tell me your trip',
    subtitle: '"Fly to Mumbai on Friday for a 2 PM meeting" — that\'s all it takes.',
    accent: '#3B82F6',
  },
  {
    emoji: '🤖',
    headline: 'Nova plans everything',
    subtitle: 'Your AI agent finds the best flights, books cabs, and picks hotels — in seconds.',
    accent: '#7C3AED',
  },
  {
    emoji: '✅',
    headline: 'One tap to confirm',
    subtitle: 'Review flights, cabs & hotel together. Approve and you\'re done.',
    accent: '#00C9A7',
  },
];

export function OnboardingTourScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: tm.bgPrimary, minHeight: '100%',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '32px 20px 40px',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ marginBottom: '36px' }}
      >
        <h1 style={{ fontSize: '24px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, margin: '0 0 6px', letterSpacing: '-0.4px', textAlign: 'center' }}>
          Meet TripMind ✈️
        </h1>
        <p style={{ fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.mono, margin: 0, textAlign: 'center' }}>
          Here's how your AI travel companion works
        </p>
      </motion.div>

      {/* Feature cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
        {FEATURES.map(({ emoji, headline, subtitle, accent }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              background: tm.bgSurface,
              border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              borderLeft: `3px solid ${accent}`,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '13px', flexShrink: 0,
              background: `${accent}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
            }}>
              {emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary, marginBottom: '3px' }}>
                {headline}
              </div>
              <div style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.body, lineHeight: 1.55 }}>
                {subtitle}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/onboarding/profile')}
        style={{
          width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
          background: tm.accentAmber, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
          Get Started
        </span>
        <ChevronRight size={16} color="#fff" />
      </motion.button>
    </div>
  );
}
