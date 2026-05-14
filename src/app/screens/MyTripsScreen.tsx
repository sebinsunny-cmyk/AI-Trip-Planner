import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Plane, ChevronRight, Plus } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { BookingProgressBar } from '../components/BookingProgressBar';
import { RefundStatusTracker } from '../components/RefundStatusTracker';
import { EmptyState } from '../components/EmptyState';
import { ALL_TRIPS } from '../data/trips';
import { getCancellations } from '../data/cancellationStore';

type Filter = 'All' | 'Upcoming' | 'Completed' | 'In Progress' | 'Cancelled';

const FILTER_STATUS: Record<Filter, string[]> = {
  All:          ['confirmed', 'Booking in progress', 'completed', 'cancelled'],
  Upcoming:     ['confirmed'],
  Completed:    ['completed'],
  'In Progress':['Booking in progress'],
  Cancelled:    ['cancelled'],
};

export function MyTripsScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  // Merge static trip list with any live cancellation records
  const cancellations = getCancellations();

  // Build enriched trip list: override status to 'cancelled' for any cancelled trip
  const enrichedTrips = ALL_TRIPS.map(t => {
    if (cancellations[t.id]) {
      return { ...t, status: 'cancelled' as const, statusColor: tm.accentRed };
    }
    return t;
  });

  const filtered = enrichedTrips.filter(t => FILTER_STATUS[activeFilter].includes(t.status));

  const totalSpend = enrichedTrips
    .filter(t => t.status !== 'cancelled')
    .reduce((s, t) => {
      const num = parseInt(t.price.replace(/[^\d]/g, ''), 10);
      return s + num;
    }, 0);

  const uniqueCities = new Set(enrichedTrips.flatMap(t => [t.from, t.to])).size;

  return (
    <div
      style={{
        background: tm.bgPrimary,
        minHeight: '100%',
        fontFamily: fonts.body,
        paddingBottom: '80px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${tm.borderSubtle}`,
        }}
      >
        <h1
          style={{
            fontSize: '20px',
            fontFamily: fonts.heading,
            fontWeight: 800,
            color: tm.textPrimary,
            margin: 0,
          }}
        >
          My Trips
        </h1>
        <button
          onClick={() => navigate('/new-trip')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: tm.accentAmber,
            border: 'none',
            borderRadius: '20px',
            padding: '8px 14px',
            cursor: 'pointer',
          }}
        >
          <Plus size={14} color="#ffffff" strokeWidth={2.5} />
          <span style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
            New Trip
          </span>
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: '14px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {(['All', 'Upcoming', 'Completed', 'In Progress', 'Cancelled'] as Filter[]).map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? tm.accentAmber : tm.bgSurface,
                border: `1px solid ${isActive ? tm.accentAmber : tm.borderSubtle}`,
                borderRadius: '20px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: fonts.body,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#ffffff' : tm.textSecondary,
                transition: 'all 0.2s ease',
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Stats bar */}
      <div
        style={{
          margin: '0 16px 16px',
          background: tm.bgSurface,
          border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex',
          gap: '0',
          justifyContent: 'space-around',
        }}
      >
        {[
          { label: 'Total trips', value: String(ALL_TRIPS.length) },
          { label: 'Total spend', value: `₹${totalSpend.toLocaleString()}` },
          { label: 'Cities visited', value: String(uniqueCities) },
        ].map((stat, i) => (
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
            <div
              style={{
                fontSize: '18px',
                fontFamily: fonts.heading,
                fontWeight: 800,
                color: tm.textPrimary,
                marginBottom: '2px',
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Trip list */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 && (() => {
          const CONFIG: Record<string, { variant: 'cancelled' | 'upcoming' | 'completed' | 'inProgress' | 'default'; title: string; subtitle: string }> = {
            Cancelled:    { variant: 'cancelled',   title: 'No cancelled trips',      subtitle: "You haven't cancelled any bookings. That's a good sign!" },
            Upcoming:     { variant: 'upcoming',    title: 'No upcoming trips',       subtitle: 'Your next adventure is one tap away. Book a trip to get started.'  },
            Completed:    { variant: 'completed',   title: 'No completed trips yet',  subtitle: 'Completed trips will show up here once you travel.'                 },
            'In Progress':{ variant: 'inProgress',  title: 'Nothing in progress',     subtitle: 'Trips being booked by TripMind will appear here.'                   },
            All:          { variant: 'default',     title: 'No trips yet',            subtitle: 'Start by creating your first trip and let TripMind handle the rest.' },
          };
          const cfg = CONFIG[activeFilter] ?? CONFIG['All'];
          return (
            <EmptyState
              variant={cfg.variant}
              title={cfg.title}
              subtitle={cfg.subtitle}
            />
          );
        })()}
        {filtered.map((trip, i) => {
          const isCancelledCard = trip.status === 'cancelled';
          const cancelRecord    = cancellations[trip.id];
          const routeColor      = isCancelledCard ? tm.textSecondary : tm.textPrimary;
          const planeColor      = isCancelledCard ? tm.textSecondary : tm.accentAmber;

          return (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() =>
                trip.status === 'Booking in progress'
                  ? navigate('/agent-auto')
                  : navigate(`/trips/${trip.id}`)
              }
              style={{
                background: isCancelledCard ? `${tm.accentRed}05` : tm.bgSurface,
                border: `1px solid ${isCancelledCard ? tm.accentRed + '25' : tm.borderSubtle}`,
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                opacity: isCancelledCard ? 0.85 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: routeColor }}>
                    {trip.from}
                  </span>
                  <Plane size={12} color={planeColor} />
                  <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: routeColor }}>
                    {trip.to}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: `${trip.statusColor}15`,
                    border: `1px solid ${trip.statusColor}40`,
                    borderRadius: '20px', padding: '3px 8px',
                  }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: trip.statusColor }} />
                    <span style={{
                      fontSize: '10px', color: trip.statusColor, fontFamily: fonts.mono, fontWeight: 600,
                      textTransform: trip.status !== 'Booking in progress' ? 'capitalize' : 'none',
                    }}>
                      {trip.status}
                    </span>
                  </div>
                  <ChevronRight size={14} color={tm.textSecondary} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', fontFamily: fonts.body, fontWeight: 500, color: isCancelledCard ? tm.textSecondary : tm.textPrimary }}>
                    {trip.purpose}
                  </div>
                  <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                    {trip.date} · {trip.airline}
                  </div>
                </div>
                <span style={{
                  fontSize: '15px', fontFamily: fonts.heading, fontWeight: 800,
                  color: isCancelledCard ? tm.textSecondary : tm.textPrimary,
                  textDecoration: isCancelledCard ? 'line-through' : 'none',
                }}>
                  {trip.price}
                </span>
              </div>

              {/* Booking progress */}
              {trip.status === 'Booking in progress' && <BookingProgressBar />}

              {/* Refund tracker for cancelled trips */}
              {isCancelledCard && cancelRecord && (
                <RefundStatusTracker
                  tripId={cancelRecord.tripId}
                  refundStatus={cancelRecord.refundStatus}
                  autoAdvance
                  compact
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}