import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Plane, Clock, Car } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

export type ReminderType = 'wake-up' | 'cab' | 'flight' | 'general';

export interface ReminderToastData {
  id: string;
  type: ReminderType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  autoDismissMs?: number;
}

const TYPE_CONFIG: Record<ReminderType, { icon: React.ComponentType<{ size: number; color: string }>; accent: string; bg: string }> = {
  'wake-up': { icon: Bell,  accent: '#F5A623', bg: '#F5A62315' },
  'cab':     { icon: Car,   accent: '#00C9A7', bg: '#00C9A715' },
  'flight':  { icon: Plane, accent: '#F5A623', bg: '#F5A62315' },
  'general': { icon: Bell,  accent: '#8B949E', bg: '#8B949E15' },
};

interface ReminderToastProps {
  toast: ReminderToastData;
  onDismiss: (id: string) => void;
}

function SingleToast({ toast, onDismiss }: ReminderToastProps) {
  const cfg = TYPE_CONFIG[toast.type];
  const Icon = cfg.icon;

  useEffect(() => {
    if (!toast.autoDismissMs) return;
    const timer = setTimeout(() => onDismiss(toast.id), toast.autoDismissMs);
    return () => clearTimeout(timer);
  }, [toast.id, toast.autoDismissMs]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      style={{
        background: tm.bgSurface,
        border: `1px solid ${cfg.accent}40`,
        borderLeft: `3px solid ${cfg.accent}`,
        borderRadius: '16px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${cfg.accent}10`,
        backdropFilter: 'blur(12px)',
        marginBottom: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${cfg.accent}60, transparent)`,
          borderRadius: '16px 16px 0 0',
        }}
      />

      {/* Icon */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: cfg.bg,
          border: `1px solid ${cfg.accent}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        <Icon size={18} color={cfg.accent} />
      </motion.div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '12px',
            fontFamily: fonts.heading,
            fontWeight: 700,
            color: tm.textPrimary,
            marginBottom: '2px',
          }}
        >
          {toast.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: fonts.body,
            color: tm.textNarration,
            lineHeight: 1.5,
            marginBottom: toast.actionLabel ? '10px' : '0',
          }}
        >
          {toast.message}
        </div>
        {toast.actionLabel && toast.onAction && (
          <button
            onClick={() => { toast.onAction?.(); onDismiss(toast.id); }}
            style={{
              background: cfg.accent,
              border: 'none',
              borderRadius: '8px',
              padding: '5px 12px',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: fonts.heading,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            {toast.actionLabel}
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
        }}
      >
        <X size={13} color={tm.textSecondary} />
      </button>
    </motion.div>
  );
}

// ─── Container: manages a queue of toasts ────────────────────────────────────

interface ReminderToastContainerProps {
  toasts: ReminderToastData[];
  onDismiss: (id: string) => void;
}

export function ReminderToastContainer({ toasts, onDismiss }: ReminderToastContainerProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '8px',
        left: '12px',
        right: '12px',
        zIndex: 200,
        pointerEvents: toasts.length === 0 ? 'none' : 'auto',
      }}
    >
      <AnimatePresence mode="sync">
        {toasts.map(t => (
          <SingleToast key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Demo hook: fires sample toasts on AgentLiveScreen ───────────────────────

export function useReminderToasts() {
  const [toasts, setToasts] = useState<ReminderToastData[]>([]);

  const add = (toast: Omit<ReminderToastData, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, add, dismiss };
}

// ─── Pre-built reminder payloads (used in TripConfirmedScreen) ────────────────

export const TRIP_REMINDERS = {
  wakeUp: (time: string): Omit<ReminderToastData, 'id'> => ({
    type: 'wake-up',
    title: `Wake-up reminder set`,
    message: `TripMind will wake you at ${time} on April 15. Your cab departs at 5:20 AM.`,
    autoDismissMs: 6000,
  }),
  flightBoarding: (flight: string): Omit<ReminderToastData, 'id'> => ({
    type: 'flight',
    title: `${flight} — Boarding soon`,
    message: `Gate closes in 35 minutes. Head to security now.`,
    actionLabel: 'View E-ticket',
    autoDismissMs: 8000,
  }),
  cabArriving: (mins: number): Omit<ReminderToastData, 'id'> => ({
    type: 'cab',
    title: `Cab arriving in ${mins} min`,
    message: `Your Uber Sedan is en route. Meet at T2 Arrivals door 4.`,
    actionLabel: 'Track cab',
    autoDismissMs: 7000,
  }),
};
