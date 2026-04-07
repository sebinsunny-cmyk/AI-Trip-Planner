import { useState } from 'react';
import { motion } from 'motion/react';
import { Mic, Send } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

interface TripInputBarProps {
  placeholder?: string;
  onSend?: (message: string) => void;
}

export function TripInputBar({ placeholder = 'Ask me anything...', onSend }: TripInputBarProps) {
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (value.trim()) {
      onSend?.(value.trim());
      setValue('');
    }
  };

  return (
    <div
      style={{
        padding: '10px 14px',
        background: tm.bgSurface,
        borderTop: `1px solid ${tm.borderSubtle}`,
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end',
      }}
    >
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
          placeholder={placeholder}
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
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: isRecording ? `${tm.accentRed}20` : tm.bgElevated,
          border: `1px solid ${isRecording ? tm.accentRed : tm.borderSubtle}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
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
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: value.trim() ? tm.accentAmber : tm.bgElevated,
          border: `1px solid ${value.trim() ? tm.accentAmber : tm.borderSubtle}`,
          cursor: value.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
      >
        <Send size={16} color={value.trim() ? '#ffffff' : tm.textSecondary} />
      </motion.button>
    </div>
  );
}
