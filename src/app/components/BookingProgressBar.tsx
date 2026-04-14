import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tm, fonts } from '../constants/colors';

const STEPS = [
  'Searching flights',
  'Booking flight',
  'Booking cab',
  'Reserving hotel',
];

export function BookingProgressBar() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep(s => (s < STEPS.length - 1 ? s + 1 : 0));
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: `1px solid ${tm.borderSubtle}`,
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Segmented bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '7px' }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: i <= activeStep ? tm.accentAmber : tm.borderSubtle,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Shimmer on the active segment */}
            {i === activeStep && (
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <motion.div
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.1 }}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: tm.accentAmber, flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, overflow: 'hidden', height: '14px', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              style={{
                position: 'absolute',
                fontSize: '10px',
                color: tm.accentAmber,
                fontFamily: fonts.mono,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {STEPS[activeStep]}…
            </motion.span>
          </AnimatePresence>
        </div>
        <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, flexShrink: 0 }}>
          {activeStep + 1}/{STEPS.length}
        </span>
      </div>
    </div>
  );
}
