import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

export interface GateChip {
  label: string;
  value: string;
  primary?: boolean;
  accent: string;
}

interface TripInputBarProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  chips?: GateChip[];
  onGateSubmit?: (value: string) => void;
}

export function TripInputBar({
  placeholder = 'Ask me anything...',
  onSend,
  chips,
  onGateSubmit,
}: TripInputBarProps) {
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const gateActive = !!onGateSubmit;
  const showOptions = gateActive && chips && chips.length > 0;

  const handleSend = () => {
    if (!value.trim()) return;
    if (gateActive) {
      onGateSubmit!(value.trim());
    } else {
      onSend?.(value.trim());
    }
    setValue('');
  };

  return (
    <div style={{ flexShrink: 0 }}>

      {/* Gate options — slide up when gate becomes active */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            key="gate-options"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            style={{
              overflow: 'hidden',
              margin: '0 8px',
              borderRadius: '14px 14px 0 0',
              background: tm.bgSurface,
            }}
          >
            {chips!.map((chip, i) => (
              <div key={chip.value}>
                {i > 0 && (
                  <div style={{ height: '1px', background: tm.borderSubtle, margin: '0 16px' }} />
                )}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  whileTap={{ background: `${chip.accent}15` } as any}
                  onClick={() => onGateSubmit?.(chip.value)}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left' as const,
                  }}
                >
                  {/* Accent indicator dot */}
                  <div style={{
                    width: '7px', height: '7px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: chip.primary ? chip.accent : tm.borderSubtle,
                    boxShadow: chip.primary ? `0 0 6px ${chip.accent}60` : 'none',
                  }} />
                  <span style={{
                    flex: 1,
                    fontSize: '13px',
                    fontFamily: fonts.body,
                    fontWeight: chip.primary ? 600 : 400,
                    color: chip.primary ? tm.textPrimary : tm.textSecondary,
                    lineHeight: 1.4,
                  }}>
                    {chip.label}
                  </span>
                </motion.button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row — separator lives here so options always sit above the line */}
      <div style={{ padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'flex-end', borderTop: `1px solid ${tm.borderSubtle}`, background: tm.bgSurface }}>
        <div
          style={{
            flex: 1,
            background: tm.bgElevated,
            border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '20px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'border-color 0.2s',
          }}
        >
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={gateActive ? 'Or describe your preference…' : placeholder}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              color: tm.textPrimary,
              fontFamily: fonts.body,
            }}
          />
        </div>

        {/* Mic button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsRecording(!isRecording)}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: isRecording ? `${tm.accentRed}20` : tm.bgElevated,
            border: `1px solid ${isRecording ? tm.accentRed : tm.borderSubtle}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <motion.div
            animate={isRecording ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <Mic size={16} color={isRecording ? tm.accentRed : tm.textSecondary} />
          </motion.div>
        </motion.button>

        {/* Send button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: value.trim() ? tm.accentAmber : tm.bgElevated,
            border: `1px solid ${value.trim() ? tm.accentAmber : tm.borderSubtle}`,
            cursor: value.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          <Send size={16} color={value.trim() ? '#ffffff' : tm.textSecondary} />
        </motion.button>
      </div>
    </div>
  );
}
