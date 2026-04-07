import { motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

interface AlertBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function AlertBanner({ message, onDismiss }: AlertBannerProps) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        background: `${tm.accentRed}15`,
        border: `1px solid ${tm.accentRed}50`,
        borderTop: 'none',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        position: 'relative',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ flexShrink: 0, marginTop: '1px' }}
      >
        <AlertTriangle size={16} color={tm.accentRed} />
      </motion.div>
      <p
        style={{
          fontSize: '12px',
          color: tm.textNarration,
          fontFamily: fonts.body,
          margin: 0,
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {message}
      </p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            flexShrink: 0,
          }}
        >
          <X size={14} color={tm.textSecondary} />
        </button>
      )}
    </motion.div>
  );
}
