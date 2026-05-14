import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import type { RefundStatus } from '../data/cancellationStore';
import { updateRefundStatus } from '../data/cancellationStore';

const STAGES: { key: RefundStatus; label: string; sub: string }[] = [
  { key: 'initiated',  label: 'Initiated',   sub: 'Refund triggered'  },
  { key: 'processing', label: 'Processing',  sub: 'Bank processing'   },
  { key: 'credited',   label: 'Credited',    sub: 'Back on your card' },
];

const STATUS_ORDER: RefundStatus[] = ['initiated', 'processing', 'credited'];

interface RefundStatusTrackerProps {
  tripId: string;
  refundStatus: RefundStatus;
  /** If true, auto-advances through stages using timers (for demo) */
  autoAdvance?: boolean;
  /** Compact single-line variant for use in My Trips cards */
  compact?: boolean;
}

export function RefundStatusTracker({
  tripId,
  refundStatus: initialStatus,
  autoAdvance = false,
  compact = false,
}: RefundStatusTrackerProps) {
  const [status, setStatus] = useState<RefundStatus>(initialStatus);

  // Sync if parent passes an updated status
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  // Auto-advance timers for demo: initiated → processing (4s) → credited (12s)
  useEffect(() => {
    if (!autoAdvance) return;
    if (status === 'credited') return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (status === 'initiated') {
      timers.push(setTimeout(() => {
        setStatus('processing');
        updateRefundStatus(tripId, 'processing');
      }, 4000));
      timers.push(setTimeout(() => {
        setStatus('credited');
        updateRefundStatus(tripId, 'credited');
      }, 12000));
    } else if (status === 'processing') {
      timers.push(setTimeout(() => {
        setStatus('credited');
        updateRefundStatus(tripId, 'credited');
      }, 8000));
    }

    return () => timers.forEach(clearTimeout);
  }, [autoAdvance, status, tripId]);

  const activeIdx = STATUS_ORDER.indexOf(status);

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 12px',
        background: `${tm.accentAmber}08`,
        border: `1px solid ${tm.accentAmber}25`,
        borderRadius: '10px',
        marginTop: '8px',
      }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
          background: status === 'credited' ? tm.accentTeal : tm.accentAmber,
          boxShadow: status !== 'credited'
            ? `0 0 6px ${tm.accentAmber}80`
            : `0 0 6px ${tm.accentTeal}80`,
        }} />
        <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.textSecondary }}>
          Refund
        </span>
        <span style={{
          fontSize: '11px', fontFamily: fonts.mono, fontWeight: 600,
          color: status === 'credited' ? tm.accentTeal : tm.accentAmber,
        }}>
          {status === 'initiated' ? 'Initiated' : status === 'processing' ? 'Processing' : 'Credited ✓'}
        </span>
        {status !== 'credited' && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            style={{ marginLeft: 'auto', fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}
          >
            updating…
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{
        fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono,
        fontWeight: 600, letterSpacing: '0.06em', marginBottom: '14px',
      }}>
        REFUND STATUS
      </div>

      {/* Timeline row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {/* Connecting track */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: 'calc(16.66% + 14px)',
          right: 'calc(16.66% + 14px)',
          height: '2px',
          background: tm.bgElevated,
          zIndex: 0,
        }} />
        {/* Filled portion */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: activeIdx === 0 ? '0%' : activeIdx === 1 ? '50%' : '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '14px',
            left: 'calc(16.66% + 14px)',
            height: '2px',
            background: tm.accentTeal,
            zIndex: 0,
          }}
        />

        {STAGES.map((stage, i) => {
          const isDone   = i < activeIdx;
          const isActive = i === activeIdx;

          const dotColor  = isDone ? tm.accentTeal : isActive ? tm.accentAmber : tm.bgElevated;
          const dotBorder = isDone ? tm.accentTeal : isActive ? tm.accentAmber : tm.borderSubtle;
          const labelColor = isDone || isActive ? tm.textPrimary : tm.textSecondary;

          return (
            <div key={stage.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              {/* Dot */}
              <motion.div
                animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.8 }}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: isDone ? tm.accentTeal : isActive ? `${tm.accentAmber}20` : tm.bgElevated,
                  border: `2px solid ${dotBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isActive ? `0 0 10px ${tm.accentAmber}50` : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                {isDone
                  ? <Check size={12} color="#fff" strokeWidth={3} />
                  : isActive
                    ? (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: tm.accentAmber }}
                      />
                    )
                    : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tm.borderSubtle }} />
                }
              </motion.div>

              {/* Labels */}
              <div style={{ marginTop: '8px', textAlign: 'center' }}>
                <div style={{
                  fontSize: '11px', fontFamily: fonts.heading, fontWeight: isDone || isActive ? 700 : 400,
                  color: labelColor, marginBottom: '2px',
                }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '9px', fontFamily: fonts.mono, color: tm.textSecondary }}>
                  {stage.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimated note */}
      {status !== 'credited' && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            fontSize: '10px', fontFamily: fonts.mono, color: tm.textSecondary,
            margin: '14px 0 0', textAlign: 'center',
          }}
        >
          Estimated credit: 5–7 business days · Visa ••4211
        </motion.p>
      )}
      {status === 'credited' && (
        <p style={{
          fontSize: '11px', fontFamily: fonts.mono, color: tm.accentTeal,
          margin: '14px 0 0', textAlign: 'center',
        }}>
          ✓ Refund credited to Visa ••4211
        </p>
      )}
    </div>
  );
}
