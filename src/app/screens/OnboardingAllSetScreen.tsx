import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check, Plane, Car, Hotel, Bell, Calendar } from 'lucide-react';
import { fonts, tm } from '../constants/colors';

// Pre-computed confetti particles — avoids Math.random() in render
const PARTICLES = [
  { x:  75, y: -130, color: '#F5A623', size: 10, delay: 0.00, round: true  },
  { x: -85, y: -115, color: '#00C9A7', size:  7, delay: 0.04, round: false },
  { x: 135, y:  -75, color: '#7C3AED', size:  8, delay: 0.08, round: true  },
  { x:-125, y:  -60, color: '#3B82F6', size:  9, delay: 0.04, round: false },
  { x:  55, y: -175, color: '#EC4899', size:  6, delay: 0.14, round: true  },
  { x: -50, y: -155, color: '#F5A623', size:  8, delay: 0.10, round: false },
  { x: 105, y: -125, color: '#00C9A7', size:  7, delay: 0.18, round: true  },
  { x: -95, y: -145, color: '#7C3AED', size:  6, delay: 0.08, round: false },
  { x:  25, y: -195, color: '#3B82F6', size: 10, delay: 0.12, round: true  },
  { x: -65, y: -175, color: '#EC4899', size:  7, delay: 0.16, round: false },
  { x: 155, y:  -40, color: '#F5A623', size:  6, delay: 0.22, round: true  },
  { x:-145, y:  -30, color: '#00C9A7', size:  8, delay: 0.20, round: false },
  { x:  85, y: -100, color: '#7C3AED', size:  9, delay: 0.15, round: true  },
  { x: -75, y:  -90, color: '#3B82F6', size:  6, delay: 0.13, round: false },
  { x:  35, y: -235, color: '#EC4899', size:  7, delay: 0.26, round: true  },
  { x: -35, y: -215, color: '#F5A623', size:  8, delay: 0.24, round: false },
  { x: 125, y: -165, color: '#00C9A7', size:  6, delay: 0.30, round: true  },
  { x:-115, y: -185, color: '#7C3AED', size:  7, delay: 0.28, round: false },
  { x:  65, y: -255, color: '#3B82F6', size:  9, delay: 0.34, round: true  },
  { x: -55, y: -240, color: '#EC4899', size:  6, delay: 0.32, round: false },
];

const SUMMARY_ITEMS = [
  { icon: Plane,    color: '#3B82F6', bg: '#3B82F618', text: 'Flight preferences saved' },
  { icon: Car,      color: '#00C9A7', bg: '#00C9A718', text: 'Cab & meal preferences saved' },
  { icon: Hotel,    color: '#7C3AED', bg: '#7C3AED18', text: 'Hotel preferences saved' },
  { icon: Bell,     color: '#F5A623', bg: '#F5A62318', text: 'Smart reminders configured' },
  { icon: Calendar, color: '#3B82F6', bg: '#3B82F618', text: 'Integrations ready to connect' },
];

export function OnboardingAllSetScreen() {
  const navigate = useNavigate();
  const [fired, setFired] = useState(false);

  useEffect(() => {
    // Mark as onboarded
    localStorage.setItem('tripmind-onboarded', '1');
    // Trigger confetti burst after a short delay
    const t = setTimeout(() => setFired(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      background: tm.bgPrimary,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      padding: '0 20px',
    }}>
      {/* Background orb */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ repeat: Infinity, duration: 4.5 }}
        style={{
          position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, #00C9A725, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Confetti burst */}
      {fired && (
        <div style={{ position: 'absolute', top: '38%', left: '50%', pointerEvents: 'none', zIndex: 10 }}>
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: 360, scale: 0.4 }}
              transition={{ duration: 0.9 + p.delay, delay: p.delay, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: p.size, height: p.size,
                borderRadius: p.round ? '50%' : '2px',
                background: p.color,
              }}
            />
          ))}
        </div>
      )}

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.1 }}
          style={{
            width: 88, height: 88, borderRadius: '50%', marginBottom: '20px',
            background: 'linear-gradient(135deg, #00C9A7 0%, #0B8C71 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 60px rgba(0,201,167,0.6)',
          }}
        >
          <Check size={40} color="#fff" strokeWidth={3} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '30px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, margin: '0 0 8px', letterSpacing: '-0.5px' }}
        >
          You're all set! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          style={{ fontSize: '14px', fontFamily: fonts.body, color: tm.textSecondary, margin: '0 0 28px', lineHeight: 1.55, maxWidth: '260px' }}
        >
          TripMind is ready to plan your trips. Here's what we set up:
        </motion.p>

        {/* Summary list */}
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SUMMARY_ITEMS.map(({ icon: Icon, color, bg, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: tm.bgSurface,
                border: `1px solid ${tm.borderSubtle}`,
                borderRadius: '12px', padding: '10px 14px',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '9px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color={color} />
              </div>
              <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textPrimary, fontWeight: 500 }}>
                {text}
              </span>
              <Check size={13} color="#00C9A7" strokeWidth={3} style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        style={{ width: '100%', paddingBottom: '44px', zIndex: 1 }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/', { replace: true })}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
            background: 'linear-gradient(135deg, #F5A623 0%, #e8890f 100%)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 24px rgba(245,166,35,0.45)',
          }}
        >
          <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>
            Start Planning
          </span>
          <span style={{ fontSize: '18px' }}>✈️</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
