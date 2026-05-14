import { motion, AnimatePresence } from 'motion/react';
import { tm, fonts } from '../constants/colors';

interface ConfirmBackSheetProps {
  open: boolean;
  title: string;
  message: string;
  keepLabel: string;
  exitLabel: string;
  onKeep: () => void;
  onExit: () => void;
  /** Makes the exit button red — use when leaving has destructive consequences */
  exitDestructive?: boolean;
}

export function ConfirmBackSheet({
  open,
  title,
  message,
  keepLabel,
  exitLabel,
  onKeep,
  onExit,
  exitDestructive = false,
}: ConfirmBackSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onKeep}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.55)',
            }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
              background: tm.bgSurface,
              borderRadius: '24px 24px 0 0',
              padding: '0 20px 40px',
            }}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: tm.borderSubtle }} />
            </div>

            {/* Content */}
            <div style={{ padding: '8px 0 20px' }}>
              <h3 style={{
                fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800,
                color: tm.textPrimary, margin: '0 0 8px',
              }}>
                {title}
              </h3>
              <p style={{
                fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary,
                margin: 0, lineHeight: 1.6,
              }}>
                {message}
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Keep — primary */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onKeep}
                style={{
                  width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                  background: tm.accentAmber, cursor: 'pointer',
                  fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff',
                }}
              >
                {keepLabel}
              </motion.button>

              {/* Exit — secondary or destructive */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onExit}
                style={{
                  width: '100%', padding: '13px', borderRadius: '14px',
                  border: `1px solid ${exitDestructive ? `${tm.accentRed}40` : tm.borderSubtle}`,
                  background: exitDestructive ? `${tm.accentRed}08` : 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px', fontFamily: fonts.heading, fontWeight: 600,
                  color: exitDestructive ? tm.accentRed : tm.textSecondary,
                }}
              >
                {exitLabel}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
