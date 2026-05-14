import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Home, Plane, Building2, Car } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import type { CancelledTripRecord } from '../data/cancellationStore';
import { RefundStatusTracker } from '../components/RefundStatusTracker';

interface LocationState {
  record: CancelledTripRecord;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  flight: <Plane     size={12} />,
  hotel:  <Building2 size={12} />,
  cab:    <Car       size={12} />,
};

export function CancellationConfirmedScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as LocationState | undefined;
  const record   = state?.record;

  // Guard: if navigated here directly without state, go to trips
  useEffect(() => {
    if (!record) navigate('/trips', { replace: true });
  }, []);

  if (!record) return null;

  const nonRefundable = record.totalPaid - record.totalRefund;

  return (
    <div style={{
      background: tm.bgPrimary, minHeight: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '36px 20px 40px', fontFamily: fonts.body,
    }}>
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}
      >
        <div style={{
          width: '68px', height: '68px', borderRadius: '50%',
          background: `${tm.accentTeal}14`, border: `2px solid ${tm.accentTeal}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
          filter: `drop-shadow(0 0 12px ${tm.accentTeal}30)`,
        }}>
          ✅
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ textAlign: 'center', marginBottom: '24px' }}
      >
        <h1 style={{
          fontSize: '22px', fontFamily: fonts.heading, fontWeight: 800,
          color: tm.textPrimary, margin: '0 0 6px',
        }}>
          Booking Cancelled
        </h1>
        <p style={{
          fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.body,
          margin: 0, lineHeight: 1.5,
        }}>
          Your trip has been cancelled and the refund has been initiated.
        </p>
      </motion.div>

      {/* Refund summary card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '18px', overflow: 'hidden', marginBottom: '14px',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: `1px solid ${tm.borderSubtle}`,
          background: `${tm.accentTeal}08`,
        }}>
          <div>
            <div style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.textSecondary, marginBottom: '2px' }}>
              TOTAL REFUND
            </div>
            <div style={{ fontSize: '26px', fontFamily: fonts.heading, fontWeight: 800, color: tm.accentTeal }}>
              ₹{record.totalRefund.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontFamily: fonts.mono, color: tm.textSecondary, marginBottom: '3px' }}>
              Refund to
            </div>
            <div style={{ fontSize: '12px', fontFamily: fonts.mono, fontWeight: 600, color: tm.textPrimary }}>
              💳 Visa ••4211
            </div>
            <div style={{ fontSize: '10px', fontFamily: fonts.mono, color: tm.textSecondary, marginTop: '2px' }}>
              5–7 business days
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ padding: '10px 0' }}>
          {record.refundBreakdown.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 16px',
              borderBottom: i < record.refundBreakdown.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
            }}>
              <div style={{
                color: item.refundable ? tm.accentTeal : tm.textSecondary,
                display: 'flex', alignItems: 'center',
              }}>
                {CATEGORY_ICONS[item.category]}
              </div>
              <span style={{
                flex: 1, fontSize: '11px', fontFamily: fonts.body,
                color: tm.textSecondary,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize: '12px', fontFamily: fonts.mono, fontWeight: 600,
                color: item.refundable ? tm.accentTeal : tm.textSecondary,
                textDecoration: !item.refundable ? 'line-through' : 'none',
                flexShrink: 0,
              }}>
                {item.refundable ? `₹${item.amount.toLocaleString()}` : '₹0'}
              </span>
            </div>
          ))}

          {/* Forfeited row */}
          {nonRefundable > 0 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 16px', marginTop: '2px',
              borderTop: `1px solid ${tm.borderSubtle}`,
              background: `${tm.accentRed}06`,
            }}>
              <span style={{ fontSize: '11px', fontFamily: fonts.body, color: tm.accentRed }}>
                Non-refundable (forfeited)
              </span>
              <span style={{ fontSize: '12px', fontFamily: fonts.mono, fontWeight: 600, color: tm.accentRed }}>
                −₹{nonRefundable.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Refund status tracker */}
        <div style={{ padding: '4px 16px 16px', borderTop: `1px solid ${tm.borderSubtle}` }}>
          <RefundStatusTracker
            tripId={record.tripId}
            refundStatus={record.refundStatus}
            autoAdvance
          />
        </div>
      </motion.div>

      {/* Cancellation reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '12px', padding: '12px 14px', marginBottom: '24px',
        }}
      >
        <p style={{
          fontSize: '11px', fontFamily: fonts.mono, color: tm.textSecondary,
          margin: 0, lineHeight: 1.6,
        }}>
          📧 A cancellation confirmation has been sent to your email. Track refund status anytime in <strong>My Trips</strong>.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/trips')}
          style={{
            width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
            background: tm.accentAmber, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
            Back to My Trips
          </span>
        </motion.button>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '8px',
          }}
        >
          <Home size={13} color={tm.textSecondary} />
          <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary }}>
            Back to Home
          </span>
        </button>
      </motion.div>
    </div>
  );
}
