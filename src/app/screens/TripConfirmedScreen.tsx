import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Home, FileText, Ticket, Share2 } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import confetti from 'canvas-confetti';
import { ReminderToastContainer, useReminderToasts, TRIP_REMINDERS } from '../components/ReminderToast';

export function TripConfirmedScreen() {
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const { toasts, add: addToast, dismiss } = useReminderToasts();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Subtle confetti — restrained, 2 seconds only
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F5A623', '#00C9A7', '#F0F6FC'],
        zIndex: 9999,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F5A623', '#00C9A7', '#F0F6FC'],
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    setTimeout(frame, 300);

    // Fire a wake-up reminder toast after confetti settles
    setTimeout(() => addToast(TRIP_REMINDERS.wakeUp('4:45 AM')), 2600);
  }, []);

  const ACTIONS = [
    { icon: FileText, label: 'View Full Itinerary', primary: true },
    { icon: Ticket, label: 'View E-tickets', primary: false },
    { icon: Share2, label: 'Share Itinerary', primary: false },
  ];

  return (
    <div
      style={{
        background: tm.bgPrimary,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px 24px',
        fontFamily: fonts.body,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Reminder toasts */}
      <ReminderToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Animated check — pure SVG, immune to flex/CSS distortion */}
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 88 88"
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        style={{ marginBottom: '20px', flexShrink: 0, filter: `drop-shadow(0 0 10px ${tm.accentTeal}40)` }}
      >
        {/* Circle fill */}
        <circle cx="44" cy="44" r="43" fill={`${tm.accentTeal}18`} />
        {/* Circle border */}
        <circle cx="44" cy="44" r="42" fill="none" stroke={tm.accentTeal} strokeWidth="2" />
        {/* Checkmark */}
        <polyline
          points="24,46 38,60 64,28"
          fill="none"
          stroke={tm.accentTeal}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          fontSize: '13px',
          fontFamily: fonts.mono,
          color: tm.textSecondary,
          margin: '0 0 6px',
        }}
      >
        All booked for
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: '26px',
          fontFamily: fonts.heading,
          fontWeight: 800,
          color: tm.textPrimary,
          margin: '0 0 4px',
        }}
      >
        Arjun Menon
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: '15px',
          fontFamily: fonts.heading,
          fontWeight: 600,
          color: tm.accentTeal,
          margin: '0 0 6px',
        }}
      >
        Mumbai · April 15 is all set. ✈️
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          fontSize: '13px',
          color: tm.textSecondary,
          fontFamily: fonts.body,
          margin: '0 0 28px',
        }}
      >
        Everything booked, synced &amp; ready to go
      </motion.p>

      {/* Summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        style={{
          background: tm.bgSurface,
          border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '20px',
          padding: '16px 20px',
          width: '100%',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', gap: '0', justifyContent: 'space-around' }}>
          {[
            { label: 'Departure', value: '6:20 AM', sub: 'COK → BOM' },
            { label: 'Return', value: '7:15 PM', sub: 'BOM → COK' },
            { label: 'Total', value: '₹13,290', sub: 'Within budget' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
              {i > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '10%',
                    height: '80%',
                    width: '1px',
                    background: tm.borderSubtle,
                  }}
                />
              )}
              <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, marginBottom: '4px' }}>
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  color: tm.textPrimary,
                  marginBottom: '2px',
                }}
              >
                {item.value}
              </div>
              <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* PNR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        style={{
          background: `${tm.accentAmber}10`,
          border: `1px solid ${tm.accentAmber}30`,
          borderRadius: '12px',
          padding: '10px 20px',
          marginBottom: '28px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginBottom: '4px' }}>
          PNR NUMBER
        </div>
        <div
          style={{
            fontSize: '22px',
            fontFamily: fonts.mono,
            fontWeight: 600,
            color: tm.accentAmber,
            letterSpacing: '4px',
          }}
        >
          XY7K29
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}
      >
        {ACTIONS.map(({ icon: Icon, label, primary }, i) => (
          <button
            key={i}
            style={{
              width: '100%',
              background: primary ? tm.accentAmber : tm.bgSurface,
              border: `1px solid ${primary ? tm.accentAmber : tm.borderSubtle}`,
              borderRadius: '14px',
              padding: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Icon size={16} color={primary ? '#ffffff' : tm.textSecondary} />
            <span
              style={{
                fontSize: '14px',
                fontFamily: fonts.heading,
                fontWeight: 700,
                color: primary ? '#ffffff' : tm.textPrimary,
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Reminder note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          background: tm.bgSurface,
          border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '14px',
          padding: '14px',
          width: '100%',
          marginBottom: '12px',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: tm.textNarration,
            fontFamily: fonts.body,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          🔔 I'll remind you tomorrow evening and on travel morning. Wake-up reminder set for{' '}
          <span style={{ color: tm.accentAmber, fontFamily: fonts.mono, fontWeight: 600 }}>4:45 AM</span> on April 15.
        </p>
      </motion.div>

      {/* Home button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        onClick={() => navigate('/')}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: tm.textSecondary,
          fontFamily: fonts.body,
          fontSize: '13px',
          padding: '8px',
        }}
      >
        <Home size={14} color={tm.textSecondary} />
        Back to Dashboard
      </motion.button>
    </div>
  );
}
