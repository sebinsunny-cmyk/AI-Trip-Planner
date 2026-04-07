import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

interface CalendarEvent {
  time: string;
  title: string;
  color: string;
  isNew?: boolean;
}

interface CalendarPreviewProps {
  events: CalendarEvent[];
  showSync?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPreview({ events, showSync }: CalendarPreviewProps) {
  // April 2026 — April 1 is a Wednesday
  const today = 15; // April 15

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: tm.bgSurface,
        border: `1px solid ${tm.borderSubtle}`,
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Calendar header */}
      <div
        style={{
          background: tm.bgElevated,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${tm.borderSubtle}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>📅</span>
          <span style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
            Google Calendar
          </span>
        </div>
        <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
          April 2026
        </span>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '10px 12px 4px' }}>
        {DAYS.map(day => (
          <div key={day} style={{ textAlign: 'center', fontSize: '9px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600 }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days - show week of Apr 13-19 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '4px 12px 12px', gap: '4px' }}>
        {[13, 14, 15, 16, 17, 18, 19].map(day => {
          const isToday = day === today;
          return (
            <div
              key={day}
              style={{
                textAlign: 'center',
                padding: '6px 4px',
                borderRadius: '8px',
                background: isToday ? `${tm.accentAmber}25` : 'transparent',
                border: isToday ? `1.5px solid ${tm.accentAmber}` : '1.5px solid transparent',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontFamily: fonts.heading,
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? tm.accentAmber : tm.textPrimary,
                }}
              >
                {day}
              </div>
              {isToday && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '3px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: tm.accentAmber }} />
                  {showSync && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: tm.accentTeal }} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Events for Apr 15 */}
      <div style={{ padding: '0 12px 12px', borderTop: `1px solid ${tm.borderSubtle}`, paddingTop: '10px' }}>
        <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '8px' }}>
          APR 15 EVENTS
        </div>
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 0',
              borderBottom: index < events.length - 1 ? `1px solid ${tm.borderSubtle}40` : 'none',
            }}
          >
            <div
              style={{
                width: '3px',
                height: '28px',
                borderRadius: '2px',
                background: event.color,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                {event.title}
              </div>
              <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                {event.time}
              </div>
            </div>
            {event.isNew && showSync && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: tm.accentTeal,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={9} color="#0D1117" strokeWidth={3} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Agent note */}
      <div
        style={{
          margin: '0 12px 12px',
          background: tm.bgElevated,
          borderRadius: '10px',
          padding: '10px',
          borderLeft: `3px solid ${tm.accentAmber}`,
        }}
      >
        <p style={{ fontSize: '11px', color: tm.textNarration, fontFamily: fonts.body, margin: 0, lineHeight: 1.6 }}>
          {showSync
            ? '✅ All trip events synced. 3 reminders set: night before, 2h before cab, 30 min before cab.'
            : '💡 Your meeting is at 2 PM. I\'ll target a morning arrival in Mumbai before 11 AM and evening return after 5 PM.'}
        </p>
      </div>
    </motion.div>
  );
}
