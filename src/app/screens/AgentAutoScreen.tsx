import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Minimize2, Plane, Car, Building2 } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { ProgressRail } from '../components/ProgressRail';
import { AgentNarrationBubble, NarrationBubble } from '../components/AgentNarrationBubble';
import { FlightOption } from '../components/FlightOptionCard';
import { CabBooking } from '../components/CabBookingCard';
import { HotelOption } from '../components/HotelOptionCard';
import { TripInputBar } from '../components/TripInputBar';
import { ReminderToastContainer, useReminderToasts } from '../components/ReminderToast';
const hotelExterior = '/hotels/hotel-exterior.jpg';
const hotelMeeting = '/hotels/hotels-meeting.jpg';

// ─── Shared data (same as AgentLiveScreen) ───────────────────────────────────

export const AUTO_FLIGHTS: FlightOption[] = [
  {
    id: 'f1', airline: 'IndiGo', airlineCode: '6E', flightNumber: '6E-342',
    departure: '6:20', arrival: '8:10', duration: '1h 50m', stops: 0,
    price: 4850, carbonKg: 82, recommended: true,
    reasoning: 'Gets you to Mumbai at 8:10 AM — nearly 6 hours before your 2 PM meeting. Non-stop, lowest carbon, best value.',
  },
  {
    id: 'f2', airline: 'Air India', airlineCode: 'AI', flightNumber: 'AI-612',
    departure: '7:05', arrival: '9:00', duration: '1h 55m', stops: 0,
    price: 5400, carbonKg: 91,
  },
  {
    id: 'f3', airline: 'Vistara', airlineCode: 'UK', flightNumber: 'UK-844',
    departure: '8:30', arrival: '10:25', duration: '1h 55m', stops: 0,
    price: 6200, carbonKg: 89,
  },
];

export const AUTO_RETURN_FLIGHTS: FlightOption[] = [
  {
    id: 'r1', airline: 'IndiGo', airlineCode: '6E', flightNumber: '6E-351',
    departure: '7:15 PM', arrival: '9:00 PM', duration: '1h 45m', stops: 0,
    price: 4650, carbonKg: 79, recommended: true,
    reasoning: 'Departs 3 hours after your meeting ends — comfortable buffer. Arrives Kochi by 9 PM.',
  },
  {
    id: 'r2', airline: 'Air India', airlineCode: 'AI', flightNumber: 'AI-619',
    departure: '8:30 PM', arrival: '10:15 PM', duration: '1h 45m', stops: 0,
    price: 5200, carbonKg: 86,
  },
  {
    id: 'r3', airline: 'Vistara', airlineCode: 'UK', flightNumber: 'UK-857',
    departure: '6:00 PM', arrival: '7:45 PM', duration: '1h 45m', stops: 0,
    price: 5900, carbonKg: 84,
  },
];

export const AUTO_CABS: CabBooking[] = [
  {
    id: 'c1', type: 'Sedan', pickupTime: '8:30 AM',
    pickupLocation: 'BOM T2 Arrivals', dropLocation: 'BKC Office District',
    estimatedFare: 650, travelTime: '45–55 min', provider: 'Uber', label: 'Arrival Cab',
  },
  {
    id: 'c2', type: 'Sedan', pickupTime: '5:00 PM',
    pickupLocation: 'BKC Office District', dropLocation: 'BOM T2 Departures',
    estimatedFare: 640, travelTime: '45–60 min', provider: 'Ola', label: 'Departure Cab',
  },
];

export const AUTO_HOTELS: HotelOption[] = [
  {
    id: 'h1', name: 'Hyatt Regency BKC', stars: 5, distanceFromVenue: '0.4 km',
    pricePerNight: 2500, rating: '4.6', ratingCount: '2.1k',
    amenities: ['Wifi', 'Breakfast', 'Parking'], recommended: true,
    reasoning: 'Closest 5-star to your BKC meeting venue. Check-in after your meeting.',
    image: hotelExterior,
  },
  {
    id: 'h2', name: 'The Oberoi Mumbai', stars: 5, distanceFromVenue: '3.2 km',
    pricePerNight: 8500, rating: '4.8', ratingCount: '1.4k', amenities: ['Wifi', 'Breakfast'],
    image: hotelMeeting,
  },
  {
    id: 'h3', name: 'ibis Mumbai BKC', stars: 3, distanceFromVenue: '0.8 km',
    pricePerNight: 3800, rating: '4.2', ratingCount: '3.8k', amenities: ['Wifi', 'Parking'],
    image: hotelMeeting,
  },
];

// ─── Step definitions (auto-select, no gates) ─────────────────────────────────

interface StepDef {
  step: number;
  header: string;
  integration: string;
  integrationIcon: NarrationBubble['integrationIcon'];
  text: string;
  duration: number;
  completionText: string;
}

const STEP_DEFS: StepDef[] = [
  {
    step: 1,
    header: 'Step 1: Searching for flights',
    integration: 'MakeMyTrip',
    integrationIcon: 'flight',
    text: "Scanning morning flights from Kochi to Mumbai on Apr 15. Found 3 options — selecting the best fit: IndiGo 6E-342 departs 6:20 AM, arrives 8:10 AM, non-stop, ₹4,850. Outbound locked in. Now checking return flights — IndiGo 6E-351 at 7:15 PM is ideal. Both flights selected ✓",
    duration: 4000,
    completionText: 'Best flights selected — 6E-342 + 6E-351',
  },
  {
    step: 2,
    header: 'Step 2: Searching for cabs',
    integration: 'Uber / Ola',
    integrationIcon: 'cab',
    text: "Arranging ground transport. Arrival cab: Uber Sedan from BOM T2 at 8:30 AM to BKC (₹650, ~50 min). Departure cab: Ola Sedan from BKC at 5:00 PM to BOM T2 (₹640, ~50 min). Both cabs lined up ✓",
    duration: 3500,
    completionText: 'Best cabs selected — Arrival 8:30 AM · Departure 5:00 PM',
  },
  {
    step: 3,
    header: 'Step 3: Searching for hotels',
    integration: 'Hotels.com',
    integrationIcon: 'hotel',
    text: "Checking hotels near BKC for day use. Hyatt Regency BKC is the top pick — 0.4 km from your meeting venue, 5-star rated 4.6, day use ₹2,500. Selected ✓",
    duration: 3500,
    completionText: 'Best hotel selected — Hyatt Regency BKC',
  },
  {
    step: 4,
    header: 'Step 4: Preparing trip summary',
    integration: 'TripMind',
    integrationIcon: 'flight',
    text: "All three services selected. Preparing your complete trip summary — flights, cabs, and hotel together on one screen. Review everything before I confirm the bookings.",
    duration: 2500,
    completionText: 'Trip summary ready — review & confirm',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimestamp() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AgentAutoScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const state     = (location.state as any) ?? {};
  const feedRef   = useRef<HTMLDivElement>(null);

  const [bubbles, setBubbles]       = useState<NarrationBubble[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTyping, setIsTyping]     = useState(false);
  const [showPip, setShowPip]       = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const { toasts, dismiss } = useReminderToasts();

  // Scroll to bottom on new content
  useEffect(() => {
    const t = setTimeout(() => {
      if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }, 80);
    return () => clearTimeout(t);
  }, [bubbles, isTyping]);

  // Kick off step 1
  useEffect(() => { startStep(1); }, []);

  function startStep(stepNum: number) {
    const def = STEP_DEFS[stepNum - 1];
    if (!def) return;

    const bubble: NarrationBubble = {
      id: `bubble-${stepNum}`,
      step: stepNum,
      header: def.header,
      text: def.text,
      status: 'typing',
      timestamp: getTimestamp(),
      integration: def.integration,
      integrationIcon: def.integrationIcon,
      completionText: def.completionText,
    };

    setBubbles(prev => {
      const updated = prev.map((b, i) =>
        i === prev.length - 1 && b.status !== 'done' ? { ...b, status: 'done' as const } : b
      );
      return [...updated, bubble];
    });
    setCurrentStep(stepNum);
    setIsTyping(true);
  }

  function onTypingComplete() {
    setIsTyping(false);
    setBubbles(prev =>
      prev.map((b, i) => (i === prev.length - 1 ? { ...b, status: 'active' as const } : b))
    );

    const def = STEP_DEFS[currentStep - 1];
    if (!def) return;

    setTimeout(() => {
      // Mark done
      setBubbles(prev =>
        prev.map((b, i) => (i === prev.length - 1 ? { ...b, status: 'done' as const } : b))
      );

      if (currentStep < STEP_DEFS.length) {
        setTimeout(() => startStep(currentStep + 1), 400);
      } else {
        // All steps done — navigate to unified review
        setTimeout(() => {
          navigate('/unified-review', {
            state: {
              ...state,
              selectedFlight:       AUTO_FLIGHTS.find(f => f.recommended)!,
              selectedReturnFlight: AUTO_RETURN_FLIGHTS.find(f => f.recommended)!,
              selectedCabs:         AUTO_CABS,
              selectedHotel:        AUTO_HOTELS.find(h => h.recommended)!,
              allFlights:           AUTO_FLIGHTS,
              allReturnFlights:     AUTO_RETURN_FLIGHTS,
              allCabs:              AUTO_CABS,
              allHotels:            AUTO_HOTELS,
            },
          });
        }, 600);
      }
    }, def.duration);
  }

  // Inline status card per step (auto-only, read-only preview)
  function AutoStatusCard({ step }: { step: number }) {
    if (step === 1) return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#3B82F608', border: '1px solid #3B82F625',
          borderRadius: '12px', padding: '12px 14px',
        }}
      >
        <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: '#3B82F6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plane size={12} color="#3B82F6" /> Flights — Auto-Selected
        </div>
        {[{ label: 'Outbound', val: 'IndiGo 6E-342 · 6:20 AM → 8:10 AM · ₹4,850' },
          { label: 'Return',   val: 'IndiGo 6E-351 · 7:15 PM → 9:00 PM · ₹4,650' }].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${tm.borderSubtle}` }}>
            <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>{r.label}</span>
            <span style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.mono }}>{r.val}</span>
          </div>
        ))}
        <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '8px' }}>
          You can change these on the review screen
        </div>
      </motion.div>
    );

    if (step === 2) return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: `${tm.accentTeal}10`, border: `1px solid ${tm.accentTeal}25`,
          borderRadius: '12px', padding: '12px 14px',
        }}
      >
        <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.accentTeal, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Car size={12} color={tm.accentTeal} /> Cabs — Auto-Selected
        </div>
        {AUTO_CABS.map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${tm.borderSubtle}` }}>
            <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>{c.label}</span>
            <span style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.mono }}>{c.pickupTime} · ₹{c.estimatedFare}</span>
          </div>
        ))}
        <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '8px' }}>
          You can change these on the review screen
        </div>
      </motion.div>
    );

    if (step === 3) return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#7C3AED18', border: '1px solid #7C3AED30',
          borderRadius: '12px', padding: '12px 14px',
        }}
      >
        <div style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: '#7C3AED', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Building2 size={12} color="#7C3AED" /> Hotel — Auto-Selected
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>Hyatt Regency BKC</span>
          <span style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.mono }}>Day use · ₹2,500</span>
        </div>
        <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '8px' }}>
          You can change this on the review screen
        </div>
      </motion.div>
    );

    return null;
  }

  // Accordion action card for completed steps
  function getActionCardForStep(step: number) {
    return <AutoStatusCard step={step} />;
  }

  return (
    <div style={{
      background: tm.bgPrimary, flex: 1, display: 'flex', flexDirection: 'column',
      fontFamily: fonts.body, position: 'relative', minHeight: 0, overflow: 'hidden',
    }}>

      <ReminderToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* PiP pill */}
      <AnimatePresence>
        {showPip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowPip(false)}
            style={{
              position: 'absolute', top: '8px', right: '12px', zIndex: 100,
              background: tm.bgSurface, border: `1px solid ${tm.accentAmber}60`,
              borderRadius: '20px', padding: '8px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: tm.accentAmber }}
            />
            <span style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.mono }}>
              TripMind working… Step {currentStep} of {STEP_DEFS.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div style={{
        padding: '10px 16px 8px', borderBottom: `1px solid ${tm.borderSubtle}`,
        background: tm.bgPrimary, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={14} color={tm.textPrimary} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', boxShadow: `0 0 10px ${tm.accentAmber}40`,
              }}
            >
              🤖
            </motion.div>
            <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
              TripMind Agent
            </span>
          </div>

          <button
            onClick={() => setShowPip(!showPip)}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Minimize2 size={14} color={tm.textSecondary} />
          </button>
        </div>

        <ProgressRail currentStep={currentStep} totalSteps={STEP_DEFS.length} isGate={false} />
      </div>

      {/* Feed */}
      <div
        ref={feedRef}
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '14px 14px 16px', scrollbarWidth: 'none' }}
      >
        {bubbles.map((bubble, index) => (
          <AgentNarrationBubble
            key={bubble.id}
            bubble={bubble}
            isLatest={index === bubbles.length - 1}
            onTypingComplete={index === bubbles.length - 1 ? onTypingComplete : undefined}
            isExpanded={expandedStep === bubble.step}
            onToggle={() => setExpandedStep(prev => prev === bubble.step ? null : bubble.step)}
            actionCard={getActionCardForStep(bubble.step)}
          />
        ))}

        {/* Thinking dots while empty */}
        {isTyping && bubbles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '4px', padding: '16px' }}
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                style={{ width: '6px', height: '6px', borderRadius: '50%', background: tm.accentAmber }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <TripInputBar placeholder="Ask me anything…" />
    </div>
  );
}
