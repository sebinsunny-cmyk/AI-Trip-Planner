import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { fonts, tm } from '../constants/colors';

export function OnboardingWelcomeScreen() {
  const navigate = useNavigate();

  // Skip if already onboarded
  useEffect(() => {
    if (localStorage.getItem('tripmind-onboarded')) {
      navigate('/', { replace: true });
    }
  }, []);

  // Auto-advance after 4 s
  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding/tour', { replace: true }), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={() => navigate('/onboarding/tour', { replace: true })}
      style={{
        background: tm.bgPrimary,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background orbs */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
        transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
          width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle, #F5A62328, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.10, 0.22, 0.10] }}
        transition={{ repeat: Infinity, duration: 5.8, ease: 'easeInOut', delay: 1.2 }}
        style={{
          position: 'absolute', bottom: '12%', right: '-8%',
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, #3B82F630, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 0.5 }}
        style={{
          position: 'absolute', top: '30%', left: '-10%',
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, #00C9A720, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo + text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.72, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 210, damping: 22, delay: 0.1 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 36px' }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 24px rgba(245,166,35,0.35)',
              '0 0 56px rgba(245,166,35,0.65)',
              '0 0 24px rgba(245,166,35,0.35)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 2.4 }}
          style={{
            width: 90, height: 90, borderRadius: '27px', margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #F5A623 0%, #e8890f 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '42px', border: '2px solid rgba(245,166,35,0.2)',
          }}
        >
          🧭
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          style={{
            fontSize: '40px', fontFamily: fonts.heading, fontWeight: 800,
            color: tm.textPrimary, margin: '0 0 10px', letterSpacing: '-1.2px',
          }}
        >
          TripMind
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            fontSize: '16px', fontFamily: fonts.body,
            color: tm.textSecondary, margin: '0 0 8px',
            fontWeight: 400, lineHeight: 1.5,
          }}
        >
          Your AI business travel companion
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          style={{
            fontSize: '11px', fontFamily: fonts.mono,
            color: tm.textSecondary, margin: 0, letterSpacing: '0.06em', opacity: 0.55,
          }}
        >
          TAP ANYWHERE TO CONTINUE
        </motion.p>
      </motion.div>

      {/* Pulsing dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ position: 'absolute', bottom: '50px', display: 'flex', gap: '8px', zIndex: 1 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.25, 0.9, 0.25], scale: [0.75, 1.25, 0.75] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.24 }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#F5A623' }}
          />
        ))}
      </motion.div>
    </div>
  );
}
