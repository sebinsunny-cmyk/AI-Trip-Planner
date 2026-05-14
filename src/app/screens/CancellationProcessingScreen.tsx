import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Plane, Building2, Car } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import type { CancelledTripRecord } from '../data/cancellationStore';
import { saveCancellation } from '../data/cancellationStore';

interface LocationState {
  record: CancelledTripRecord;
}

type StepStatus = 'pending' | 'active' | 'done';

interface CancellationStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  doneLabel: string;
}

const STEPS: CancellationStep[] = [
  { id: 'flight',  label: 'Cancelling flights…',  icon: <Plane     size={16} />, doneLabel: 'Flights cancelled' },
  { id: 'hotel',   label: 'Cancelling hotel…',    icon: <Building2 size={16} />, doneLabel: 'Hotel cancelled'   },
  { id: 'cab',     label: 'Cancelling cabs…',     icon: <Car       size={16} />, doneLabel: 'Cabs cancelled'    },
];

// Timing (ms)
const STEP_DELAYS  = [400,  1800, 3000];  // when each step becomes 'active'
const DONE_DELAYS  = [1600, 2800, 4000];  // when each step becomes 'done'
const NAV_DELAY    = 4800;

export function CancellationProcessingScreen() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const state      = location.state as LocationState | undefined;
  const record     = state?.record;

  const [statuses, setStatuses] = useState<StepStatus[]>(['pending', 'pending', 'pending']);

  useEffect(() => {
    if (!record) {
      navigate('/trips', { replace: true });
      return;
    }

    // Save the cancellation record immediately (status: initiated)
    saveCancellation(record);

    const timers: ReturnType<typeof setTimeout>[] = [];

    STEP_DELAYS.forEach((delay, i) => {
      timers.push(setTimeout(() => {
        setStatuses(prev => {
          const next = [...prev] as StepStatus[];
          next[i] = 'active';
          return next;
        });
      }, delay));
    });

    DONE_DELAYS.forEach((delay, i) => {
      timers.push(setTimeout(() => {
        setStatuses(prev => {
          const next = [...prev] as StepStatus[];
          next[i] = 'done';
          return next;
        });
      }, delay));
    });

    timers.push(setTimeout(() => {
      navigate('/cancellation/confirmed', { state: { record }, replace: true });
    }, NAV_DELAY));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      background: tm.bgPrimary, minHeight: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px',
    }}>
      {/* Pulsing ring */}
      <div style={{ position: 'relative', marginBottom: '36px' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute', inset: '-12px', borderRadius: '50%',
            background: `${tm.accentRed}20`,
          }}
        />
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: `${tm.accentRed}15`, border: `2px solid ${tm.accentRed}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px',
        }}>
          🚫
        </div>
      </div>

      <h2 style={{
        fontSize: '20px', fontFamily: fonts.heading, fontWeight: 800,
        color: tm.textPrimary, margin: '0 0 6px', textAlign: 'center',
      }}>
        Cancelling your trip
      </h2>
      <p style={{
        fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary,
        margin: '0 0 36px', textAlign: 'center', lineHeight: 1.5,
      }}>
        Please don't close the app…
      </p>

      {/* Step list */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {STEPS.map((step, i) => {
          const status = statuses[i];
          const isDone   = status === 'done';
          const isActive = status === 'active';
          const isPending = status === 'pending';

          return (
            <AnimatePresence key={step.id} mode="wait">
              <motion.div
                key={`${step.id}-${status}`}
                initial={{ opacity: isPending ? 0.4 : 0.8, x: isActive ? -4 : 0 }}
                animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '14px',
                  background: isDone ? `${tm.accentTeal}10` : isActive ? `${tm.accentAmber}08` : tm.bgSurface,
                  border: `1px solid ${isDone ? tm.accentTeal + '40' : isActive ? tm.accentAmber + '30' : tm.borderSubtle}`,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Icon area */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: isDone ? `${tm.accentTeal}18` : isActive ? `${tm.accentAmber}18` : tm.bgElevated,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isDone ? tm.accentTeal : isActive ? tm.accentAmber : tm.textSecondary,
                  transition: 'all 0.3s ease',
                }}>
                  {isDone ? <Check size={16} strokeWidth={2.5} color={tm.accentTeal} /> : step.icon}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: '13px', fontFamily: fonts.body, fontWeight: isDone ? 600 : 400,
                  color: isDone ? tm.accentTeal : isActive ? tm.textPrimary : tm.textSecondary,
                  flex: 1,
                }}>
                  {isDone ? step.doneLabel : step.label}
                </span>

                {/* Spinner or check */}
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      border: `2px solid ${tm.accentAmber}40`,
                      borderTopColor: tm.accentAmber,
                      flexShrink: 0,
                    }}
                  />
                )}
                {isDone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Check size={16} color={tm.accentTeal} strokeWidth={3} />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
}
