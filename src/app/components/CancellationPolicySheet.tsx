import { motion, AnimatePresence } from 'motion/react';
import { X, Plane, Building2, Car, AlertTriangle } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import type { RefundBreakdownItem } from '../data/cancellationStore';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  flight: <Plane     size={13} />,
  hotel:  <Building2 size={13} />,
  cab:    <Car       size={13} />,
};

interface CancellationPolicySheetProps {
  open: boolean;
  tripLabel: string;          // e.g. "COK → BOM · Apr 15"
  breakdown: RefundBreakdownItem[];
  totalPaid: number;
  totalRefund: number;
  onCancel: () => void;       // proceed to reason sheet
  onKeep: () => void;         // dismiss sheet
}

export function CancellationPolicySheet({
  open,
  tripLabel,
  breakdown,
  totalPaid,
  totalRefund,
  onCancel,
  onKeep,
}: CancellationPolicySheetProps) {
  const nonRefundable = totalPaid - totalRefund;

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
              maxHeight: '92vh',
              overflowY: 'auto',
              scrollbarWidth: 'none',
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
                  Cancel this trip?
                </h2>
                <p style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.textSecondary, margin: 0 }}>
                  {tripLabel}
                </p>
              </div>
              <button
                onClick={onKeep}
                style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={14} color={tm.textSecondary} />
              </button>
            </div>

            {/* Refund breakdown */}
            <div style={{ padding: '16px 20px 0' }}>
              <div style={{
                fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono,
                fontWeight: 600, letterSpacing: '0.06em', marginBottom: '10px',
              }}>
                REFUND BREAKDOWN
              </div>

              <div style={{
                background: tm.bgPrimary, border: `1px solid ${tm.borderSubtle}`,
                borderRadius: '14px', overflow: 'hidden', marginBottom: '12px',
              }}>
                {breakdown.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '11px 14px',
                      borderBottom: i < breakdown.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                      background: item.refundable ? `${tm.accentTeal}14` : `${tm.accentRed}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: item.refundable ? tm.accentTeal : tm.accentRed,
                    }}>
                      {CATEGORY_ICONS[item.category]}
                    </div>

                    {/* Label */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px', fontFamily: fonts.body,
                        color: tm.textNarration,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: '10px', fontFamily: fonts.mono,
                        color: item.refundable ? tm.accentTeal : tm.accentRed,
                        marginTop: '1px',
                      }}>
                        {item.refundable ? 'Full refund' : 'Non-refundable'}
                      </div>
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: '13px', fontFamily: fonts.mono, fontWeight: 700,
                        color: item.refundable ? tm.accentTeal : tm.textSecondary,
                        textDecoration: !item.refundable ? 'line-through' : 'none',
                      }}>
                        ₹{item.amount.toLocaleString()}
                      </div>
                      {!item.refundable && (
                        <div style={{ fontSize: '10px', fontFamily: fonts.mono, color: tm.accentRed }}>
                          ₹0 back
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary row */}
              <div style={{
                background: tm.bgPrimary, border: `1px solid ${tm.borderSubtle}`,
                borderRadius: '14px', padding: '14px', marginBottom: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontFamily: fonts.body, color: tm.textSecondary }}>
                    Total paid
                  </span>
                  <span style={{ fontSize: '13px', fontFamily: fonts.mono, fontWeight: 600, color: tm.textPrimary }}>
                    ₹{totalPaid.toLocaleString()}
                  </span>
                </div>
                {nonRefundable > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontFamily: fonts.body, color: tm.textSecondary }}>
                      Non-refundable (lost)
                    </span>
                    <span style={{ fontSize: '13px', fontFamily: fonts.mono, fontWeight: 600, color: tm.accentRed }}>
                      −₹{nonRefundable.toLocaleString()}
                    </span>
                  </div>
                )}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  paddingTop: '8px', borderTop: `1px solid ${tm.borderSubtle}`,
                }}>
                  <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                    You'll get back
                  </span>
                  <span style={{ fontSize: '18px', fontFamily: fonts.heading, fontWeight: 800, color: tm.accentTeal }}>
                    ₹{totalRefund.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Refund destination note */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: `${tm.accentAmber}0C`, border: `1px solid ${tm.accentAmber}25`,
                borderRadius: '10px', padding: '10px 12px', marginBottom: '20px',
              }}>
                <span style={{ fontSize: '12px' }}>💳</span>
                <span style={{ fontSize: '11px', fontFamily: fonts.body, color: tm.textNarration, lineHeight: 1.5 }}>
                  Refund of <strong style={{ color: tm.accentTeal }}>₹{totalRefund.toLocaleString()}</strong> to Visa ••4211 in 5–7 business days.
                </span>
              </div>

              {/* Non-refundable warning */}
              {nonRefundable > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  background: `${tm.accentRed}0A`, border: `1px solid ${tm.accentRed}25`,
                  borderRadius: '10px', padding: '10px 12px', marginBottom: '20px',
                }}>
                  <AlertTriangle size={14} color={tm.accentRed} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '11px', fontFamily: fonts.body, color: tm.textNarration, lineHeight: 1.5 }}>
                    Flight tickets worth <strong style={{ color: tm.accentRed }}>₹{nonRefundable.toLocaleString()}</strong> are non-refundable and will be forfeited.
                  </span>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Keep — prominent default */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onKeep}
                  style={{
                    width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                    background: tm.accentAmber, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
                    Keep my booking
                  </span>
                </motion.button>

                {/* Cancel — subtle destructive */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onCancel}
                  style={{
                    width: '100%', padding: '13px', borderRadius: '14px', border: `1px solid ${tm.accentRed}40`,
                    background: `${tm.accentRed}08`, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 600, color: tm.accentRed }}>
                    Proceed to cancel
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
