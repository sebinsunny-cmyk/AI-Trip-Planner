import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, CalendarX, HeartPulse, Search, Briefcase, MessageCircle } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

const REASONS: { id: string; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'change_of_plans', label: 'Change of plans',       icon: <CalendarX    size={16} />, color: tm.accentAmber },
  { id: 'medical',         label: 'Medical / emergency',   icon: <HeartPulse   size={16} />, color: '#FF5C5C'      },
  { id: 'better_option',   label: 'Found a better option', icon: <Search       size={16} />, color: tm.accentTeal  },
  { id: 'company_policy',  label: 'Company policy change', icon: <Briefcase    size={16} />, color: '#7C3AED'      },
  { id: 'other',           label: 'Other',                 icon: <MessageCircle size={16} />, color: tm.textSecondary },
];

interface CancellationReasonSheetProps {
  open: boolean;
  nonRefundableAmount: number;
  onConfirm: (reason: string) => void;
  onBack: () => void;
}

export function CancellationReasonSheet({
  open,
  nonRefundableAmount,
  onConfirm,
  onBack,
}: CancellationReasonSheetProps) {
  const [selected, setSelected] = useState<string | null>(null);

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
            onClick={onBack}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.65)',
            }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
              background: tm.bgSurface,
              borderRadius: '24px 24px 0 0',
              padding: '0 0 40px',
            }}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: tm.borderSubtle }} />
            </div>

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 20px 16px',
              borderBottom: `1px solid ${tm.borderSubtle}`,
            }}>
              <div>
                <h2 style={{
                  fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800,
                  color: tm.textPrimary, margin: '0 0 2px',
                }}>
                  Why are you cancelling?
                </h2>
                <p style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.textSecondary, margin: 0 }}>
                  This helps us improve for next time
                </p>
              </div>
              <button
                onClick={onBack}
                style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={14} color={tm.textSecondary} />
              </button>
            </div>

            {/* Reason options */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {REASONS.map((r, i) => {
                  const isSelected = selected === r.id;
                  return (
                    <motion.button
                      key={r.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelected(r.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '13px 14px', borderRadius: '12px',
                        background: isSelected ? `${r.color}10` : tm.bgPrimary,
                        border: `1.5px solid ${isSelected ? r.color : tm.borderSubtle}`,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
                        background: isSelected ? `${r.color}18` : tm.bgElevated,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? r.color : tm.textSecondary,
                        transition: 'all 0.15s ease',
                      }}>
                        {r.icon}
                      </div>
                      <span style={{
                        fontSize: '13px', fontFamily: fonts.body, fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? tm.textPrimary : tm.textNarration, flex: 1,
                      }}>
                        {r.label}
                      </span>
                      {/* Selection indicator */}
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${isSelected ? r.color : tm.borderSubtle}`,
                        background: isSelected ? r.color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}>
                        {isSelected && (
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Final warning — shown only if non-refundable > 0 */}
              {nonRefundableAmount > 0 && selected && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    background: `${tm.accentRed}0A`, border: `1px solid ${tm.accentRed}30`,
                    borderRadius: '10px', padding: '10px 12px', marginBottom: '16px',
                  }}
                >
                  <AlertTriangle size={13} color={tm.accentRed} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '11px', fontFamily: fonts.body, color: tm.textNarration, lineHeight: 1.5 }}>
                    You'll permanently lose <strong style={{ color: tm.accentRed }}>₹{nonRefundableAmount.toLocaleString()}</strong> in non-refundable flight tickets. This cannot be undone.
                  </span>
                </motion.div>
              )}

              {/* Confirm button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => selected && onConfirm(selected)}
                disabled={!selected}
                style={{
                  width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                  background: selected ? tm.accentRed : tm.bgElevated,
                  cursor: selected ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{
                  fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700,
                  color: selected ? '#fff' : tm.textSecondary,
                }}>
                  Confirm Cancellation
                </span>
              </motion.button>

              <button
                onClick={onBack}
                style={{
                  width: '100%', marginTop: '10px', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '6px',
                }}
              >
                <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary }}>
                  ← Go back
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
