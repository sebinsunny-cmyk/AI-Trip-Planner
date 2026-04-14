import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

interface Props {
  message: string;
  delay?: number;
}

export function NovaBubble({ message, delay = 0.08 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 280, damping: 26 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 20px' }}
    >
      {/* Nova avatar */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.04, type: 'spring', stiffness: 340, damping: 22 }}
        style={{
          width: 36, height: 36, borderRadius: '11px', flexShrink: 0,
          background: 'linear-gradient(135deg, #00C9A7 0%, #0B8C71 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 14px rgba(0,201,167,0.3)',
        }}
      >
        <Sparkles size={16} color="#fff" />
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.1 }}
        style={{
          flex: 1,
          background: tm.bgSurface,
          border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '4px 16px 16px 16px',
          padding: '10px 14px',
        }}
      >
        <div style={{
          fontSize: '9px', color: tm.accentTeal, fontFamily: fonts.mono,
          fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px',
        }}>
          NOVA
        </div>
        <p style={{
          fontSize: '14px', fontFamily: fonts.body, fontWeight: 500,
          color: tm.textPrimary, margin: 0, lineHeight: 1.55,
        }}>
          {message}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Shared step-dot progress indicator ──────────────────────────────────── */
export function StepDots({ step, total = 7 }: { step: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === step - 1 ? 20 : 6,
            background: i < step ? tm.accentAmber : tm.borderSubtle,
          }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          style={{ height: 6, borderRadius: 3 }}
        />
      ))}
    </div>
  );
}
