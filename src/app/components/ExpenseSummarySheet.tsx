import { motion } from 'motion/react';
import { Check, ChevronRight, Plane, Building2, Car, CreditCard } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

interface ExpenseItem {
  icon: React.ReactNode;
  label: string;
  amount: number;
}

const ITEMS: ExpenseItem[] = [
  { icon: <Plane     size={14} color="#3B82F6" />, label: 'Flight (COK → BOM, 6E-342)', amount: 4850 },
  { icon: <Plane     size={14} color="#3B82F6" />, label: 'Return Flight (BOM → COK, 6E-351)', amount: 4650 },
  { icon: <Building2 size={14} color="#7C3AED" />, label: 'Hyatt Regency BKC — Day use', amount: 2500 },
  { icon: <Car       size={14} color="#00C9A7" />, label: 'Cab — BOM Arrival', amount: 650 },
  { icon: <Car       size={14} color="#00C9A7" />, label: 'Cab — BOM to Airport', amount: 640 },
];

const TOTAL = ITEMS.reduce((sum, item) => sum + item.amount, 0);
const POLICY_LIMIT = 15000;

interface ExpenseSummarySheetProps {
  onSubmit?: () => void;
  onSkip?: () => void;
  readOnly?: boolean;
}

export function ExpenseSummarySheet({ onSubmit, onSkip, readOnly }: ExpenseSummarySheetProps) {
  const withinBudget = TOTAL <= POLICY_LIMIT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      style={{
        background: tm.bgSurface,
        border: `1px solid ${tm.borderSubtle}`,
        borderLeft: `3px solid ${tm.accentAmber}`,
        borderRadius: '16px',
        padding: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${tm.accentAmber}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CreditCard size={15} color={tm.accentAmber} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
            Trip Expense Summary
          </div>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            Apr 15 · Mumbai Day Trip
          </div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ marginBottom: '12px' }}>
        {ITEMS.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 0',
              borderBottom: index < ITEMS.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span style={{ fontSize: '12px', color: tm.textNarration, fontFamily: fonts.body }}>
                {item.label}
              </span>
            </div>
            <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.mono, fontWeight: 600, flexShrink: 0 }}>
              ₹{item.amount.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: tm.accentAmber + '40', marginBottom: '12px' }} />

      {/* Total */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
          TOTAL
        </span>
        <span style={{ fontSize: '20px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
          ₹{TOTAL.toLocaleString()}
        </span>
      </div>

      {/* Policy check */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: withinBudget ? `${tm.accentTeal}15` : `${tm.accentRed}15`,
          border: `1px solid ${withinBudget ? tm.accentTeal + '40' : tm.accentRed + '40'}`,
          borderRadius: '10px',
          padding: '10px 12px',
          marginBottom: '14px',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: withinBudget ? tm.accentTeal : tm.accentRed,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Check size={12} color="#0D1117" strokeWidth={3} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: withinBudget ? tm.accentTeal : tm.accentRed, fontFamily: fonts.body, fontWeight: 500 }}>
            {withinBudget ? 'Within policy limit' : 'Exceeds policy limit'}
          </div>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            Policy limit: ₹{POLICY_LIMIT.toLocaleString()} · Saving ₹{(POLICY_LIMIT - TOTAL).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!readOnly && (
        <>
          <button
            onClick={onSubmit}
            style={{
              width: '100%',
              background: tm.accentAmber,
              border: 'none',
              borderRadius: '12px',
              padding: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
              Submit for Pre-Approval
            </span>
            <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
          </button>

          <button
            onClick={onSkip}
            style={{
              width: '100%',
              background: 'transparent',
              border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer',
              fontSize: '13px',
              color: tm.textSecondary,
              fontFamily: fonts.body,
            }}
          >
            Skip
          </button>
        </>
      )}
    </motion.div>
  );
}
