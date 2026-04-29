import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Car, Plane, PlaneLanding, MapPin, Building2, Briefcase } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

interface TimelineItem {
  time: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  reasoning?: string;
  type: 'flight' | 'cab' | 'meeting' | 'reminder' | 'buffer' | 'hotel';
}

const ITEMS: TimelineItem[] = [
  { time: '04:45 AM', icon: <Bell size={9} />,         title: 'Wake-up Reminder', subtitle: 'Auto-set by TripMind', type: 'reminder', reasoning: 'You need 35 min to get ready and 5 min buffer before cab.' },
  { time: '05:20 AM', icon: <Car size={9} />,          title: 'Cab to COK Airport', subtitle: '~30 min drive', type: 'cab', reasoning: 'Booking the cab 35 min before check-in opens gives comfortable buffer.' },
  { time: '06:00 AM', icon: <Plane size={9} />,        title: 'Arrive COK — Check-in opens', subtitle: 'IndiGo 6E-342', type: 'flight' },
  { time: '06:20 AM', icon: <Plane size={9} />,        title: 'Flight 6E-342 departs', subtitle: 'COK → BOM', type: 'flight', reasoning: 'Non-stop morning flight, lands 8:10 AM — 6 hrs before your meeting.' },
  { time: '08:10 AM', icon: <PlaneLanding size={9} />, title: 'Land BOM T2', subtitle: 'Terminal 2', type: 'flight' },
  { time: '08:30 AM', icon: <Car size={9} />,          title: 'Cab pickup — BOM T2 Arrivals', subtitle: 'Uber Sedan · ₹650', type: 'cab', reasoning: '20 min buffer for deplaning + baggage claim (traveling light).' },
  { time: '09:30 AM', icon: <MapPin size={9} />,       title: 'Arrive at venue (BKC)', subtitle: '4.5 hrs before meeting ✅', type: 'buffer', reasoning: 'Plenty of time to grab breakfast, freshen up, review materials.' },
  { time: '09:45 AM', icon: <Building2 size={9} />,    title: 'Hotel Check-in', subtitle: 'Hyatt Regency BKC · Conf: HY-BKC-8821', type: 'hotel', reasoning: 'Day-use room booked to freshen up before the meeting. 0.4 km from your venue.' },
  { time: '02:00 PM', icon: <Briefcase size={9} />,    title: 'Meeting begins', subtitle: 'BKC Office', type: 'meeting' },
  { time: '04:00 PM', icon: <Briefcase size={9} />,    title: 'Meeting ends', subtitle: 'BKC Office', type: 'meeting' },
  { time: '04:30 PM', icon: <Building2 size={9} />,    title: 'Hotel Check-out', subtitle: 'Hyatt Regency BKC', type: 'hotel' },
  { time: '05:00 PM', icon: <Car size={9} />,          title: 'Cab to BOM T2', subtitle: 'Ola Sedan · ₹640', type: 'cab', reasoning: 'BKC to BOM is 45 min in evening traffic. 5 PM gives 2h 15m buffer for your 7:15 PM flight.' },
  { time: '05:45 PM', icon: <Plane size={9} />,        title: 'Arrive BOM — Security/Check-in', subtitle: 'Terminal 2', type: 'flight' },
  { time: '07:15 PM', icon: <Plane size={9} />,        title: 'Return flight departs', subtitle: 'BOM → COK', type: 'flight' },
  { time: '09:00 PM', icon: <PlaneLanding size={9} />, title: 'Land COK', subtitle: 'Home', type: 'flight' },
];

const TYPE_COLORS: Record<string, string> = {
  flight:  '#F5A623',
  cab:     '#00C9A7',
  meeting: '#7C3AED',
  reminder:'#8B949E',
  buffer:  '#00C9A7',
  hotel:   '#4A9EFF',
};

export function ItineraryTimeline() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  return (
    <div style={{ padding: '0 4px' }}>
      {ITEMS.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
          style={{ display: 'flex', gap: '12px', marginBottom: '2px' }}
        >
          {/* Timeline rail */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: `${TYPE_COLORS[item.type]}25`,
                border: `1.5px solid ${TYPE_COLORS[item.type]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: TYPE_COLORS[item.type],
                flexShrink: 0,
                marginTop: '6px',
              }}
            >
              {item.icon}
            </div>
            {index < ITEMS.length - 1 && (
              <div
                style={{
                  width: '1px',
                  flex: 1,
                  minHeight: '24px',
                  background: `linear-gradient(to bottom, ${TYPE_COLORS[item.type]}60, ${TYPE_COLORS[ITEMS[index + 1].type]}40)`,
                  margin: '4px 0',
                }}
              />
            )}
          </div>

          {/* Content */}
          <button
            onClick={() => setExpandedItem(expandedItem === index ? null : index)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              cursor: item.reasoning ? 'pointer' : 'default',
              textAlign: 'left',
              padding: '4px 0 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
              <span
                style={{
                  fontSize: '10px',
                  color: TYPE_COLORS[item.type],
                  fontFamily: fonts.mono,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {item.time}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body, fontWeight: 500, marginBottom: '2px' }}>
              {item.title}
            </div>
            {item.subtitle && (
              <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                {item.subtitle}
              </div>
            )}
            {item.reasoning && expandedItem === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  marginTop: '8px',
                  background: tm.bgElevated,
                  borderRadius: '8px',
                  padding: '8px 10px',
                }}
              >
                <p style={{ fontSize: '11px', color: tm.textNarration, fontFamily: fonts.body, margin: 0, lineHeight: 1.6 }}>
                  💡 {item.reasoning}
                </p>
              </motion.div>
            )}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
