import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mic, ChevronRight, Plane } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { BookingProgressBar } from '../components/BookingProgressBar';

const UPCOMING_TRIPS = [
  {
    id: '1',
    from: 'COK',
    to: 'BOM',
    date: 'Apr 15',
    time: '06:20 AM',
    returnTime: '07:15 PM',
    airline: 'IndiGo 6E-342',
    price: '₹9,340',
    status: 'confirmed',
    statusColor: '#00C9A7',
  },
  {
    id: '2',
    from: 'BLR',
    to: 'DEL',
    date: 'Apr 22',
    time: '08:00 AM',
    returnTime: '09:30 PM',
    airline: 'Air India AI-501',
    price: '₹12,800',
    status: 'Booking in progress',
    statusColor: '#F5A623',
  },
];

const STATUS_ORDER: Record<string, number> = {
  'Booking in progress': 0,
  'confirmed': 1,
  'completed': 2,
};

const SORTED_TRIPS = [...UPCOMING_TRIPS].sort(
  (a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
);

export function HomeScreen() {
  const navigate = useNavigate();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div
      style={{
        background: tm.bgPrimary,
        minHeight: '100%',
        fontFamily: fonts.body,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: '16px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            🧭
          </div>
          <span
            style={{
              fontSize: '16px',
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: tm.textPrimary,
            }}
          >
            TripMind
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, #7C3AED, #4F46E5)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: '#fff',
              fontSize: '14px',
            }}
          >
            A
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div style={{ padding: '8px 20px 20px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontFamily: fonts.heading,
            fontWeight: 800,
            color: tm.textPrimary,
            margin: '0 0 4px',
          }}
        >
          {greeting}, Arjun 👋
        </h1>
        <p style={{ fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.body, margin: 0, lineHeight: 1.5 }}>
          I'm Nova - here to plan & book your trips effortlessly.
        </p>
      </div>

      {/* Quick prompt card */}
      <div style={{ padding: '0 16px 20px' }}>
        <motion.button
          onClick={() => navigate('/new-trip')}
          animate={{
            boxShadow: [
              `0 0 20px ${tm.accentAmber}15`,
              `0 0 35px ${tm.accentAmber}30`,
              `0 0 20px ${tm.accentAmber}15`,
            ],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{
            width: '100%',
            background: tm.bgSurface,
            border: `1px solid ${tm.accentAmber}40`,
            borderRadius: '20px',
            padding: '18px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Plane size={20} color={tm.accentAmber} />
            </motion.div>
            <span
              style={{
                fontSize: '15px',
                fontFamily: fonts.heading,
                fontWeight: 700,
                color: tm.textPrimary,
              }}
            >
              Where are you headed?
            </span>
          </div>

          <div
            style={{
              background: tm.bgElevated,
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.body }}>
              Describe your trip...
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Mic size={16} color={tm.accentAmber} />
              <ChevronRight size={16} color={tm.textSecondary} />
            </div>
          </div>

        </motion.button>
      </div>


      {/* Upcoming trips */}
      <div style={{ padding: '0 16px 100px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontFamily: fonts.heading,
              fontWeight: 700,
              color: tm.textPrimary,
              margin: 0,
            }}
          >
            Upcoming Trips
          </h2>
          <button
            onClick={() => navigate('/trips')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              color: tm.accentAmber,
              fontFamily: fonts.body,
            }}
          >
            See all
          </button>
        </div>

        {SORTED_TRIPS.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            style={{
              background: tm.bgSurface,
              border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '16px',
              padding: '14px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
            onClick={() =>
              trip.status === 'Booking in progress'
                ? navigate('/agent-auto')
                : navigate(`/trips/${trip.id}`)
            }
          >
            {/* Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: trip.statusColor,
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    color: trip.statusColor,
                    fontFamily: fonts.mono,
                    fontWeight: 600,
                    textTransform: trip.status !== 'Booking in progress' ? 'capitalize' : 'none',
                  }}
                >
                  {trip.status}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                {trip.date}
              </span>
            </div>

            {/* Route */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '20px',
                    fontFamily: fonts.heading,
                    fontWeight: 800,
                    color: tm.textPrimary,
                  }}
                >
                  {trip.from}
                </div>
                <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  {trip.time}
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
                <Plane size={14} color={tm.accentAmber} />
                <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '20px',
                    fontFamily: fonts.heading,
                    fontWeight: 800,
                    color: tm.textPrimary,
                  }}
                >
                  {trip.to}
                </div>
                <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  {trip.returnTime}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: `1px solid ${tm.borderSubtle}`,
              }}
            >
              <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                {trip.airline}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  color: tm.textPrimary,
                }}
              >
                {trip.price}
              </span>
            </div>

            {/* Live booking progress */}
            {trip.status === 'Booking in progress' && <BookingProgressBar />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}