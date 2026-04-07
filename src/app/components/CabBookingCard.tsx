import { motion } from 'motion/react';
import { Clock, ChevronRight } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

export interface CabBooking {
  id: string;
  type: 'Sedan' | 'SUV' | 'Auto';
  pickupTime: string;
  pickupLocation: string;
  dropLocation: string;
  estimatedFare: number;
  travelTime: string;
  provider: 'Uber' | 'Ola';
  label: 'Arrival Cab' | 'Departure Cab';
}

const PROVIDER_COLORS: Record<string, string> = {
  Uber: '#000000',
  Ola: '#3CB371',
};

const PROVIDER_EMOJI: Record<string, string> = {
  Uber: '⚫',
  Ola: '🟢',
};

interface CabBookingCardProps {
  cabs: CabBooking[];
  onConfirm: () => void;
}

export function CabBookingCard({ cabs, onConfirm }: CabBookingCardProps) {
  return (
    <div>
      {cabs.map((cab, index) => (
        <motion.div
          key={cab.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, type: 'spring', stiffness: 280, damping: 28 }}
          style={{
            background: tm.bgSurface,
            border: `1px solid ${tm.borderSubtle}`,
            borderLeft: `3px solid ${tm.accentAmber}`,
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '10px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: PROVIDER_COLORS[cab.provider],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
              >
                {PROVIDER_EMOJI[cab.provider]}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                  {cab.label}
                </div>
                <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  via {cab.provider}
                </div>
              </div>
            </div>
            <div
              style={{
                background: tm.bgElevated,
                border: `1px solid ${tm.borderSubtle}`,
                borderRadius: '8px',
                padding: '4px 8px',
              }}
            >
              <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                {cab.type}
              </span>
            </div>
          </div>

          {/* Journey details */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tm.accentAmber, flexShrink: 0 }} />
              <div style={{ width: '1px', flex: 1, background: tm.borderSubtle, margin: '3px 0' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: tm.accentTeal, flexShrink: 0 }} />
            </div>

            {/* Locations */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', color: tm.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {cab.pickupLocation}
                </div>
                <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  Pickup: {cab.pickupTime}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: tm.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                  {cab.dropLocation}
                </div>
                <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  ~{cab.travelTime} travel
                </div>
              </div>
            </div>
          </div>

          {/* Fare */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: tm.bgElevated,
              borderRadius: '10px',
              padding: '10px 12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} color={tm.textSecondary} />
              <span style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                Est. fare
              </span>
            </div>
            <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
              ₹{cab.estimatedFare}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Confirm button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onConfirm}
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
          Confirm Both Cabs
        </span>
        <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
      </motion.button>

      <button
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
        Modify
      </button>
    </div>
  );
}