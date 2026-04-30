import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Settings, Minimize2, Plane, Car, Building2, CalendarDays, CreditCard, ClipboardList, RotateCcw, Ban, Wallet } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { ProgressRail } from '../components/ProgressRail';
import { AgentNarrationBubble, NarrationBubble } from '../components/AgentNarrationBubble';
import { FlightOptionCard, FlightOption } from '../components/FlightOptionCard';
import { CabBookingCard, CabBooking } from '../components/CabBookingCard';
import { HotelOptionCard, HotelOption } from '../components/HotelOptionCard';
import { ItineraryTimeline } from '../components/ItineraryTimeline';
import { ExpenseSummarySheet } from '../components/ExpenseSummarySheet';
import { CalendarPreview } from '../components/CalendarPreview';
import { AlertBanner } from '../components/AlertBanner';
import { TripInputBar, GateChip } from '../components/TripInputBar';
import { ReminderToastContainer, useReminderToasts, TRIP_REMINDERS } from '../components/ReminderToast';
const hotelExterior = '/hotels/hotel-exterior.jpg';
const hotelMeeting = '/hotels/hotels-meeting.jpg';

// ─── Data ────────────────────────────────────────────────────────────────────

const FLIGHTS: FlightOption[] = [
  {
    id: 'f1',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-342',
    departure: '6:20',
    arrival: '8:10',
    duration: '1h 50m',
    stops: 0,
    price: 4850,
    carbonKg: 82,
    recommended: true,
    reasoning:
      'Gets you to Mumbai at 8:10 AM — nearly 6 hours before your 2 PM meeting. Non-stop, lowest carbon, best value.',
  },
  {
    id: 'f2',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-612',
    departure: '7:05',
    arrival: '9:00',
    duration: '1h 55m',
    stops: 0,
    price: 5400,
    carbonKg: 91,
  },
  {
    id: 'f3',
    airline: 'Vistara',
    airlineCode: 'UK',
    flightNumber: 'UK-844',
    departure: '8:30',
    arrival: '10:25',
    duration: '1h 55m',
    stops: 0,
    price: 6200,
    carbonKg: 89,
  },
];

const RETURN_FLIGHTS: FlightOption[] = [
  {
    id: 'r1',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-351',
    departure: '7:15 PM',
    arrival: '9:00 PM',
    duration: '1h 45m',
    stops: 0,
    price: 4650,
    carbonKg: 79,
    recommended: true,
    reasoning:
      'Departs 3 hours after your meeting ends — comfortable buffer for any overruns or a quick dinner. Arrives Kochi by 9 PM.',
  },
  {
    id: 'r2',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-619',
    departure: '8:30 PM',
    arrival: '10:15 PM',
    duration: '1h 45m',
    stops: 0,
    price: 5200,
    carbonKg: 86,
  },
  {
    id: 'r3',
    airline: 'Vistara',
    airlineCode: 'UK',
    flightNumber: 'UK-857',
    departure: '6:00 PM',
    arrival: '7:45 PM',
    duration: '1h 45m',
    stops: 0,
    price: 5900,
    carbonKg: 84,
  },
];

const CABS: CabBooking[] = [
  {
    id: 'c1',
    type: 'Sedan',
    pickupTime: '8:30 AM',
    pickupLocation: 'BOM T2 Arrivals',
    dropLocation: 'BKC Office District',
    estimatedFare: 650,
    travelTime: '45–55 min',
    provider: 'Uber',
    label: 'Arrival Cab',
  },
  {
    id: 'c2',
    type: 'Sedan',
    pickupTime: '5:00 PM',
    pickupLocation: 'BKC Office District',
    dropLocation: 'BOM T2 Departures',
    estimatedFare: 640,
    travelTime: '45–60 min',
    provider: 'Ola',
    label: 'Departure Cab',
  },
];

const HOTELS: HotelOption[] = [
  {
    id: 'h1',
    name: 'Hyatt Regency BKC',
    stars: 5,
    distanceFromVenue: '0.4 km',
    pricePerNight: 6200,
    rating: '4.6',
    ratingCount: '2.1k',
    amenities: ['Wifi', 'Breakfast', 'Parking'],
    recommended: true,
    reasoning: 'Closest 5-star to your BKC meeting venue. Check-in after your meeting and check out before your 7:15 PM flight — no extra travel needed.',
    image: hotelExterior,
  },
  {
    id: 'h2',
    name: 'The Oberoi Mumbai',
    stars: 5,
    distanceFromVenue: '3.2 km',
    pricePerNight: 8500,
    rating: '4.8',
    ratingCount: '1.4k',
    amenities: ['Wifi', 'Breakfast'],
    image: hotelMeeting,
  },
  {
    id: 'h3',
    name: 'ibis Mumbai BKC',
    stars: 3,
    distanceFromVenue: '0.8 km',
    pricePerNight: 3800,
    rating: '4.2',
    ratingCount: '3.8k',
    amenities: ['Wifi', 'Parking'],
    image: hotelMeeting,
  },
];

const CALENDAR_EVENTS_SYNC = [
  { time: '6:20 AM – 8:10 AM', title: 'Flight 6E-342 COK→BOM', color: '#F5A623', isNew: true },
  { time: '8:30 AM', title: 'Cab · BOM T2 Arrivals', color: '#00C9A7', isNew: true },
  { time: '2:00 PM – 4:00 PM', title: 'Team Meeting · BKC', color: '#7C3AED' },
  { time: '5:00 PM', title: 'Cab · BKC → BOM T2', color: '#00C9A7', isNew: true },
  { time: '7:15 PM – 9:00 PM', title: 'Return Flight BOM→COK', color: '#F5A623', isNew: true },
];

// ─── Edge-case data (Leh trip) ───────────────────────────────────────────────

const LEH_FLIGHTS: FlightOption[] = [
  {
    id: 'lf1',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-2041',
    departure: '6:00',
    arrival: '12:30',
    duration: '6h 30m',
    stops: 1,
    price: 8200,
    carbonKg: 145,
    recommended: true,
    reasoning: 'Best connection via Delhi. Departs early from Kochi, arrives Leh at 12:30 PM — giving you the afternoon to acclimatise before any activity.',
  },
  {
    id: 'lf2',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-442',
    departure: '7:15',
    arrival: '14:00',
    duration: '6h 45m',
    stops: 1,
    price: 9400,
    carbonKg: 158,
  },
];

const LEH_RETURN_FLIGHTS: FlightOption[] = [
  {
    id: 'lr1',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-2042',
    departure: '10:00 AM',
    arrival: '5:30 PM',
    duration: '7h 30m',
    stops: 1,
    price: 7800,
    carbonKg: 138,
    recommended: true,
    reasoning: 'Morning departure from Leh via Delhi. Arrives Kochi by early evening — a comfortable next-day return.',
  },
  {
    id: 'lr2',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-443',
    departure: '11:30 AM',
    arrival: '7:00 PM',
    duration: '7h 30m',
    stops: 1,
    price: 8900,
    carbonKg: 152,
  },
];

const LEH_CABS: CabBooking[] = [
  {
    id: 'lc1', type: 'Sedan', pickupTime: '1:00 PM',
    pickupLocation: 'Leh Kushok Bakula Airport',
    dropLocation: 'The Grand Dragon Ladakh',
    estimatedFare: 400, travelTime: '15–20 min', provider: 'Uber', label: 'Arrival Cab',
  },
  {
    id: 'lc2', type: 'Sedan', pickupTime: '8:30 AM',
    pickupLocation: 'The Grand Dragon Ladakh',
    dropLocation: 'Leh Kushok Bakula Airport',
    estimatedFare: 400, travelTime: '15–20 min', provider: 'Ola', label: 'Departure Cab',
  },
];

const LEH_HOTELS: HotelOption[] = [
  {
    id: 'lh1',
    name: 'The Grand Dragon Ladakh',
    stars: 5,
    distanceFromVenue: '1.2 km',
    pricePerNight: 7800,
    rating: '4.7',
    ratingCount: '1.2k',
    amenities: ['Wifi', 'Breakfast'],
    recommended: true,
    reasoning: 'Top-rated hotel in Leh with oxygen-enriched rooms to ease altitude adjustment. Breakfast included and mountain views from every room.',
    image: hotelExterior,
  },
  {
    id: 'lh2',
    name: 'Hotel Ladakh Palace',
    stars: 4,
    distanceFromVenue: '0.8 km',
    pricePerNight: 4200,
    rating: '4.4',
    ratingCount: '890',
    amenities: ['Wifi', 'Breakfast', 'Parking'],
    image: hotelMeeting,
  },
];

// ─── Edge-case step definitions ───────────────────────────────────────────────

const EDGE_CASE_STEP_DEFS: StepDef[] = [
  {
    step: 1,
    header: 'Step 1: Searching for flights to Leh',
    integration: 'MakeMyTrip',
    integrationIcon: 'flight',
    text: "I checked all airlines flying to Leh (IXL) on January 26th — that's Republic Day, a national holiday. All commercial flights to Leh are suspended on this date due to restricted airspace operations. I'll need to adjust the travel date. Would you prefer to fly on January 25th or January 27th?",
    isGate: true,
    duration: 0,
    completionText: 'Travel date adjusted — searching Leh flights',
    accent: '#3B82F6',
  },
  {
    step: 2,
    header: 'Step 2: Checking same-day return flights',
    integration: 'MakeMyTrip',
    integrationIcon: 'flight',
    text: "I searched for same-day return flights from Leh on your adjusted travel date. Unfortunately, Leh airport operates only 2–3 flights per day and the last outbound departs at 11:30 AM — a same-day return isn't feasible after arriving and settling in. Should I book a next-morning return flight instead?",
    isGate: true,
    duration: 0,
    completionText: 'Return rescheduled to next morning',
    accent: '#3B82F6',
  },
  {
    step: 3,
    header: 'Step 3: Overnight stay — hotel needed?',
    integration: 'Hotels.com',
    integrationIcon: 'hotel',
    text: "Since you're now returning the next morning, you'll need accommodation in Leh for the night. Worth noting — Leh sits at 3,524m altitude, so rest and acclimatisation matter. Should I find a hotel, or do you have accommodation arranged?",
    isGate: true,
    duration: 0,
    completionText: 'Accommodation sorted for Leh',
    accent: '#7C3AED',
  },
  {
    step: 4,
    header: 'Step 4: Ground transport in Leh',
    integration: 'Local Taxis',
    integrationIcon: 'cab',
    text: "One last thing — Leh airport is about 5 km from the city. Taxis are the primary transport; app-based cabs aren't widely available here. Should I pre-book airport transfers for your arrival and departure?",
    isGate: true,
    duration: 0,
    completionText: 'Ground transport sorted for Leh',
    accent: '#00C9A7',
  },
  {
    step: 5,
    header: 'Step 5: Preparing trip summary',
    integration: 'TripMind',
    integrationIcon: 'flight',
    text: "Your Leh trip is all set. I've put together a complete itinerary — flights, hotel, and airport transfers are lined up with the right buffers. Here's how your trip looks.",
    isGate: false,
    duration: 3000,
    completionText: 'Trip summary ready — Leh',
    accent: '#F5A623',
  },
];

// ─── Edge-case chip options (shown above input bar during gate steps) ────────

const EDGE_CASE_CHIPS: Record<number, GateChip[]> = {
  1: [
    { label: 'Jan 25 — Day before', value: 'Jan 25', primary: true, accent: '#EF4444' },
    { label: 'Jan 27 — Day after',  value: 'Jan 27',               accent: '#EF4444' },
  ],
  2: [
    { label: 'Book next-day return',  value: 'next-day', primary: true, accent: '#F5A623' },
    { label: "I'll manage my return", value: 'own',                    accent: '#F5A623' },
  ],
  3: [
    { label: 'Yes, find a hotel',    value: 'hotel', primary: true, accent: '#7C3AED' },
    { label: 'I have accommodation', value: 'own',                  accent: '#7C3AED' },
  ],
  4: [
    { label: 'Yes, book transfers', value: 'cab', primary: true, accent: '#00C9A7' },
    { label: "I'll arrange my own", value: 'own',                accent: '#00C9A7' },
  ],
};

// ─── Step definitions ────────────────────────────────────────────────────────

interface StepDef {
  step: number;
  header: string; // bubble title shown in the header row
  integration: string;
  integrationIcon: 'calendar' | 'flight' | 'cab' | 'hotel' | 'expense';
  text: string;
  isGate?: boolean;
  duration: number; // ms before auto-advancing (0 = gate/manual)
  completionText?: string; // shown in collapsed accordion row when done
  accent?: string; // active bubble border color
}

const STEP_DEFS: StepDef[] = [
  {
    step: 1,
    header: 'Step 1: Searching for flights',
    integration: 'MakeMyTrip',
    integrationIcon: 'flight',
    text: "I found flights for both legs of your trip. For the outbound I'd recommend the 6:20 AM IndiGo (₹4,850, non-stop, arrives 8:10 AM). For the return, the 7:15 PM IndiGo gets you home by 9 PM with a comfortable buffer after your 2 PM meeting. Pick your preferred options below.",
    isGate: true,
    duration: 0,
    completionText: 'Flights booked — IndiGo 6E-342 + 6E-351',
    accent: '#3B82F6',
  },
  {
    step: 2,
    header: 'Step 2: Searching for cabs',
    integration: 'Uber / Ola',
    integrationIcon: 'cab',
    text: "Now let me sort your ground transport. You land at T2 at 8:10 AM — I'm adding a 20-minute buffer for deplaning. I'll book a cab for 8:30 AM pickup. For the return, your meeting ends at 4 PM — I'm recommending a 5:00 PM cab from BKC to catch your 7:15 PM flight. That's a comfortable 2h 15m buffer.",
    isGate: true,
    duration: 0,
    completionText: 'Cabs confirmed — Arrival 8:30 AM · Departure 5:00 PM',
  },
  {
    step: 3,
    header: 'Step 3: Searching for hotels',
    integration: 'Hotels.com',
    integrationIcon: 'hotel',
    text: "You land at 8:10 AM with a 2 PM meeting — that's nearly 6 hours. I found 3 great options near BKC. I'd recommend the Hyatt Regency — it's 0.4 km from your venue, a 5-star, and you can check in right after landing. Want me to book it, or would you prefer to skip?",
    isGate: true,
    duration: 0,
    completionText: 'Hotel booked — Hyatt Regency BKC',
  },
  {
    step: 4,
    header: 'Step 4: Preparing trip summary',
    integration: 'TripMind',
    integrationIcon: 'flight',
    text: "Your full day is taking shape. Here's how April 15th looks — I've built a detailed itinerary with buffers baked in. Tap any item to see my reasoning for that time slot.",
    duration: 3000,
    completionText: 'Itinerary ready — April 15 · 6 events',
  },
  {
    step: 5,
    header: 'Step 5: Syncing calendar',
    integration: 'Google Calendar',
    integrationIcon: 'calendar',
    text: "I'm adding all of this to your Google Calendar now — the flights, both cab pickups, and I've blocked your full day as 'Travel: Mumbai'. I've also set 3 reminders: the night before, 2 hours before cab, and 30 minutes before cab.",
    duration: 3500,
    completionText: 'Calendar synced — 5 events added',
  },
  {
    step: 6,
    header: 'Step 6: Submitting expense',
    integration: 'Concur Expense',
    integrationIcon: 'expense',
    text: "Here's your complete trip cost breakdown. Total spend is ₹13,290 — well within your ₹15,000 policy limit. Submitting for pre-approval automatically.",
    duration: 3000,
    completionText: 'Expense submitted for pre-approval',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AgentLiveScreen() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const feedRef    = useRef<HTMLDivElement>(null);

  // Edge-case mode — triggered by Example 2
  const edgeCaseMode = (location.state as any)?.mode === 'edge-case';
  const totalSteps   = edgeCaseMode ? EDGE_CASE_STEP_DEFS.length : STEP_DEFS.length;

  const [bubbles, setBubbles]       = useState<NarrationBubble[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGateActive, setIsGateActive] = useState(false);
  const [isTyping, setIsTyping]     = useState(false);
  const [showDisruption, setShowDisruption] = useState(false);
  const [showPip, setShowPip]       = useState(false);
  const [activeCard, setActiveCard] = useState<
    | 'flights' | 'cabs' | 'hotels' | 'itinerary' | 'calendar-sync' | 'expense'
    | 'no-flights-question' | 'no-return-question' | 'hotel-question' | 'cab-question'
    | null
  >('flights');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const { toasts, add: addToast, dismiss: dismissToast } = useReminderToasts();

  // Edge-case user choices
  const [chosenDate,    setChosenDate]    = useState<string>('Jan 25');
  const [wantsHotel,    setWantsHotel]    = useState(true);
  const [wantsOwnReturn, setWantsOwnReturn] = useState(false);
  const [wantsCab,      setWantsCab]      = useState(true);

  // Edge-case user response labels shown between bubbles
  const [edgeCaseResponses, setEdgeCaseResponses] = useState<Record<number, string>>({});

  function recordResponse(step: number, value: string) {
    const chips = EDGE_CASE_CHIPS[step] ?? [];
    const label = chips.find(c => c.value === value)?.label ?? value;
    setEdgeCaseResponses(prev => ({ ...prev, [step]: label }));
  }

  // Scroll feed to bottom when new bubbles appear or action card slides in
  useEffect(() => {
    if (feedRef.current) {
      // Small delay so the action card has rendered before we measure height
      const t = setTimeout(() => {
        if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }, 80);
      return () => clearTimeout(t);
    }
  }, [bubbles, isTyping]);

  // Start first step on mount
  useEffect(() => {
    startStep(1);
  }, []);

  function startStep(stepNum: number) {
    const defs = edgeCaseMode ? EDGE_CASE_STEP_DEFS : STEP_DEFS;
    const def  = defs[stepNum - 1];
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
      accent: def.accent,
    };

    setBubbles(prev => {
      const updated = prev.map((b, i) =>
        i === prev.length - 1 && b.status !== 'done' ? { ...b, status: 'done' as const } : b
      );
      return [...updated, bubble];
    });

    setCurrentStep(stepNum);
    setIsTyping(true);
    setIsGateActive(def.isGate ?? false);

    // Card map — normal vs edge-case
    const cardMap: Record<number, typeof activeCard> = edgeCaseMode
      ? { 1: 'no-flights-question', 2: 'no-return-question', 3: 'hotel-question', 4: 'cab-question' }
      : { 1: 'flights', 2: 'cabs', 3: 'hotels', 4: 'itinerary', 5: 'calendar-sync', 6: 'expense' };
    setActiveCard(cardMap[stepNum] ?? null);
  }

  function onTypingComplete() {
    setIsTyping(false);
    // Mark current bubble active
    setBubbles(prev =>
      prev.map((b, i) => (i === prev.length - 1 ? { ...b, status: 'active' } : b))
    );

    const defs = edgeCaseMode ? EDGE_CASE_STEP_DEFS : STEP_DEFS;
    const def  = defs[currentStep - 1];
    if (!def?.isGate && def?.duration) {
      // Auto-advance
      setTimeout(() => {
        completeBubble();
        if (currentStep < totalSteps) {
          setTimeout(() => startStep(currentStep + 1), 400);
        } else if (edgeCaseMode) {
          // Edge-case flow ends after trip summary — navigate to unified review
          setTimeout(() => navigate('/unified-review', {
            state: {
              selectedFlight:       LEH_FLIGHTS[0],
              selectedReturnFlight: wantsOwnReturn ? null : LEH_RETURN_FLIGHTS[0],
              selectedCabs:         wantsCab ? LEH_CABS : [],
              selectedHotel:        wantsHotel ? LEH_HOTELS[0] : null,
              allFlights:           LEH_FLIGHTS,
              allReturnFlights:     wantsOwnReturn ? [] : LEH_RETURN_FLIGHTS,
              allCabs:              LEH_CABS,
              allHotels:            LEH_HOTELS,
            },
          }), 600);
        } else {
          setTimeout(() => navigate('/confirmed'), 600);
        }
      }, def.duration);
    }
  }

  function completeBubble() {
    setBubbles(prev =>
      prev.map((b, i) => (i === prev.length - 1 ? { ...b, status: 'done' } : b))
    );
  }

  function handleGateApproval() {
    setIsGateActive(false);
    completeBubble();
    if (currentStep < totalSteps) {
      if (!edgeCaseMode && currentStep === 2) {
        setTimeout(() => addToast(TRIP_REMINDERS.cabArriving(12)), 1200);
      }
      setTimeout(() => startStep(currentStep + 1), 500);
    } else {
      setTimeout(() => navigate('/confirmed'), 800);
    }
  }

  // Edge-case gate: capture user choice then advance
  function handleEdgeCaseChoice(step: number, choice: string) {
    recordResponse(step, choice);
    if (step === 1) {
      setChosenDate(choice);
      handleGateApproval();
    } else if (step === 2) {
      setWantsOwnReturn(choice === 'own');
      handleGateApproval();
    } else if (step === 3) {
      setWantsHotel(choice === 'hotel');
      handleGateApproval();
    } else if (step === 4) {
      setWantsCab(choice === 'cab');
      handleGateApproval();
    }
  }

  // Highlighted section banner shown above results
  function SectionBanner({
    icon, title, subtitle, accent,
  }: { icon: React.ReactNode; title: string; subtitle: string; accent: string }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          background: `${accent}12`,
          border: `1px solid ${accent}35`,
          borderRadius: '12px',
          marginBottom: '10px',
        }}
      >
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: `${accent}20`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: accent, flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
            {title}
          </div>
          <div style={{ fontSize: '11px', color: accent, fontFamily: fonts.mono, marginTop: '1px' }}>
            {subtitle}
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: accent, flexShrink: 0,
          }}
        />
      </motion.div>
    );
  }

  // Shimmer skeleton row
  function ShimmerRow({ label, delay }: { label: string; delay: number }) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 0',
        }}
      >
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, delay }}
          style={{ flex: 1, height: '10px', background: tm.bgElevated, borderRadius: '5px' }}
        />
        <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, flexShrink: 0 }}>
          {label}
        </span>
      </motion.div>
    );
  }

  // Current action card
  function renderActionCard() {
    if (isTyping) return null;

    switch (activeCard) {
      case 'flights':
        return (
          <>
            <SectionBanner
              icon={<Plane size={16} />}
              title="Flights Found"
              subtitle="Round trip · COK ↔ BOM · Apr 15 · Select outbound & return"
              accent="#3B82F6"
            />
            <FlightOptionCard
              flights={FLIGHTS}
              returnFlights={RETURN_FLIGHTS}
              origin="COK"
              destination="BOM"
              date="Apr 15"
              onSelect={() => handleGateApproval()}
            />
          </>
        );

      case 'cabs':
        return (
          <>
            <SectionBanner
              icon={<Car size={16} />}
              title="2 Cabs Arranged"
              subtitle="Apr 15 · Arrival + departure transfers · Approve to confirm"
              accent={tm.accentTeal}
            />
            <CabBookingCard cabs={CABS} onConfirm={handleGateApproval} />
          </>
        );

      case 'hotels':
        return (
          <>
            <SectionBanner
              icon={<Building2 size={16} />}
              title="3 Hotels Near BKC"
              subtitle="Apr 15 · Day use & overnight · Select to book"
              accent="#7C3AED"
            />
            <HotelOptionCard hotels={HOTELS} onSelect={handleGateApproval} />
          </>
        );

      case 'itinerary':
        return (
          <>
            <SectionBanner
              icon={<ClipboardList size={16} />}
              title={edgeCaseMode ? `Your Leh Trip — ${chosenDate}` : 'Your Day — April 15'}
              subtitle={edgeCaseMode ? 'Flights · Hotel · Transfers · Full plan' : 'Full itinerary with buffers · Tap any item to see reasoning'}
              accent={tm.accentAmber}
            />
            <div style={{
              background: tm.bgSurface,
              border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '16px',
              padding: '16px',
            }}>
              <ItineraryTimeline />
            </div>
          </>
        );

      case 'calendar-sync':
        return (
          <>
            <SectionBanner
              icon={<CalendarDays size={16} />}
              title="Calendar Updated"
              subtitle="Google Calendar · 5 events added · Apr 15"
              accent={tm.accentAmber}
            />
            <CalendarPreview events={CALENDAR_EVENTS_SYNC} showSync={true} />
          </>
        );

      case 'expense':
        return (
          <>
            <SectionBanner
              icon={<Wallet size={16} />}
              title="Trip Cost Breakdown"
              subtitle="Total ₹13,290 · Within ₹15,000 policy limit"
              accent="#7C3AED"
            />
            <ExpenseSummarySheet readOnly />
          </>
        );

      // ── Edge-case question cards ──────────────────────────────────────────
      case 'no-flights-question':
        return (
          <SectionBanner
            icon={<Ban size={16} />}
            title="No Flights on Republic Day"
            subtitle="Jan 26 — Leh (IXL) · Airspace restricted · Choose a travel date below"
            accent="#EF4444"
          />
        );

      case 'no-return-question':
        return (
          <SectionBanner
            icon={<RotateCcw size={16} />}
            title="Same-Day Return Unavailable"
            subtitle={`Leh → Kochi · ${chosenDate} · Last outbound at 11:30 AM · Choose below`}
            accent={tm.accentAmber}
          />
        );

      case 'hotel-question':
        return (
          <SectionBanner
            icon={<Building2 size={16} />}
            title="Overnight Stay in Leh"
            subtitle="Accommodation needed · 3,524m altitude · 1 night · Choose below"
            accent="#7C3AED"
          />
        );

      case 'cab-question':
        return (
          <SectionBanner
            icon={<Car size={16} />}
            title="Airport Transfers in Leh"
            subtitle="Leh (IXL) · ~5 km to city · Pre-book taxi · Choose below"
            accent={tm.accentTeal}
          />
        );

      default:
        return null;
    }
  }

  // Action card for a COMPLETED step shown inline when expanded in accordion
  function getActionCardForStep(step: number): React.ReactNode {
    // Edge-case completed accordion cards
    if (edgeCaseMode) {
      switch (step) {
        case 1: return (
          <>
            <SectionBanner icon={<CalendarDays size={16} />} title="Date Adjusted" subtitle={`Travel date changed to ${chosenDate} · Leh (IXL)`} accent="#EF4444" />
          </>
        );
        case 2: return (
          <>
            <SectionBanner icon={<RotateCcw size={16} />} title={wantsOwnReturn ? 'Managing own return' : 'Next-day return booked'} subtitle={`Leh → Kochi · ${chosenDate === 'Jan 25' ? 'Jan 26' : 'Jan 28'} morning`} accent={tm.accentAmber} />
          </>
        );
        case 3: return (
          <SectionBanner icon={<Building2 size={16} />} title={wantsHotel ? 'Hotel — The Grand Dragon Ladakh' : 'Own accommodation'} subtitle="Leh · 1 night" accent="#7C3AED" />
        );
        case 4: return (
          <>
            {wantsCab
              ? (
                <>
                  <SectionBanner icon={<Car size={16} />} title="Transfers Booked" subtitle="Arrival + departure · Leh airport ↔ hotel" accent={tm.accentTeal} />
                  <CabBookingCard cabs={LEH_CABS} onConfirm={() => {}} />
                </>
              ) : (
                <SectionBanner icon={<Car size={16} />} title="Own transport arranged" subtitle="Leh airport transfers · self-managed" accent={tm.accentTeal} />
              )
            }
          </>
        );
        case 5: return (
          <>
            <SectionBanner icon={<ClipboardList size={16} />} title={`Your Leh Trip — ${chosenDate}`} subtitle="Flights · Hotel · Transfers · Full plan" accent={tm.accentAmber} />
            <div style={{ background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, borderRadius: '16px', padding: '16px' }}>
              <ItineraryTimeline />
            </div>
          </>
        );
        default: return null;
      }
    }

    // Normal flow accordion cards
    switch (step) {
      case 1:
        return (
          <>
            <SectionBanner icon={<Plane size={16} />} title="Flights Booked" subtitle="Round trip · COK ↔ BOM · IndiGo 6E-342 + 6E-351" accent="#3B82F6" />
            <FlightOptionCard
              flights={FLIGHTS}
              returnFlights={RETURN_FLIGHTS}
              origin="COK"
              destination="BOM"
              date="Apr 15"
              onSelect={() => {}}
            />
          </>
        );
      case 2:
        return (
          <>
            <SectionBanner icon={<Car size={16} />} title="2 Cabs Confirmed" subtitle="Apr 15 · Arrival 8:30 AM + Departure 5:00 PM" accent={tm.accentTeal} />
            <CabBookingCard cabs={CABS} onConfirm={() => {}} />
          </>
        );
      case 3:
        return (
          <>
            <SectionBanner icon={<Building2 size={16} />} title="Hotel Booked" subtitle="Hyatt Regency BKC · Apr 15 · Day use" accent="#7C3AED" />
            <HotelOptionCard hotels={HOTELS} onSelect={() => {}} />
          </>
        );
      case 4:
        return (
          <>
            <SectionBanner icon={<ClipboardList size={16} />} title="Your Day — April 15" subtitle="Full itinerary with buffers" accent={tm.accentAmber} />
            <div style={{
              background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '16px', padding: '16px',
            }}>
              <ItineraryTimeline />
            </div>
          </>
        );
      case 5:
        return (
          <>
            <SectionBanner icon={<CalendarDays size={16} />} title="Calendar Synced" subtitle="Google Calendar · 5 events added · Apr 15" accent={tm.accentAmber} />
            <CalendarPreview events={CALENDAR_EVENTS_SYNC} showSync={true} />
          </>
        );
      case 6:
        return (
          <>
            <SectionBanner icon={<Wallet size={16} />} title="Trip Cost Breakdown" subtitle="Total ₹13,290 · Within ₹15,000 policy limit" accent="#7C3AED" />
            <ExpenseSummarySheet readOnly />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div
      style={{
        background: tm.bgPrimary,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: fonts.body,
        position: 'relative',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Reminder toasts */}
      <ReminderToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Floating PiP pill */}
      <AnimatePresence>
        {showPip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowPip(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              zIndex: 100,
              background: tm.bgSurface,
              border: `1px solid ${tm.accentAmber}60`,
              borderRadius: '20px',
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: tm.accentAmber }}
            />
            <span style={{ fontSize: '11px', color: tm.textPrimary, fontFamily: fonts.mono }}>
              TripMind working… Step {currentStep} of {totalSteps}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div
        style={{
          padding: '10px 16px 8px',
          borderBottom: `1px solid ${tm.borderSubtle}`,
          background: tm.bgPrimary,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: tm.bgSurface,
              border: `1px solid ${tm.borderSubtle}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={14} color={tm.textPrimary} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                boxShadow: `0 0 10px ${tm.accentAmber}40`,
              }}
            >
              🤖
            </motion.div>
            <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
              TripMind Agent
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowPip(!showPip)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: tm.bgSurface,
                border: `1px solid ${tm.borderSubtle}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Minimize2 size={14} color={tm.textSecondary} />
            </button>
            {!edgeCaseMode && (
              <button
                onClick={() => setShowDisruption(!showDisruption)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: tm.bgSurface,
                  border: `1px solid ${tm.borderSubtle}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Settings size={14} color={tm.textSecondary} />
              </button>
            )}
          </div>
        </div>

        <ProgressRail currentStep={currentStep} totalSteps={totalSteps} isGate={isGateActive} />
      </div>

      {/* Disruption banner */}
      <AnimatePresence>
        {showDisruption && (
          <AlertBanner
            message="⚠️ Your 6:20 AM flight is delayed by 90 minutes. New departure: 7:50 AM. New arrival: 9:40 AM. I'm re-checking your day — you'll still reach the venue by 10:45 AM, well before your 2 PM meeting. Arrival cab rescheduled to 10:00 AM."
            onDismiss={() => setShowDisruption(false)}
          />
        )}
      </AnimatePresence>

      {/* Single continuous scroll — bubbles + action card together */}
      <div
        ref={feedRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '14px 14px 16px',
          scrollbarWidth: 'none',
        }}
      >
        {bubbles.map((bubble, index) => (
          <React.Fragment key={bubble.id}>
            <AgentNarrationBubble
              bubble={bubble}
              isLatest={index === bubbles.length - 1}
              onTypingComplete={index === bubbles.length - 1 ? onTypingComplete : undefined}
              isExpanded={expandedStep === bubble.step}
              onToggle={() => setExpandedStep(prev => prev === bubble.step ? null : bubble.step)}
              actionCard={getActionCardForStep(bubble.step)}
            />
            {/* User response — shown after each completed edge-case gate bubble */}
            {edgeCaseMode && edgeCaseResponses[bubble.step] && bubble.status === 'done' && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '12px',
                  paddingLeft: '40px',
                }}
              >
                <div style={{
                  background: tm.bgElevated,
                  border: `1px solid ${tm.borderSubtle}`,
                  borderRadius: '16px 16px 4px 16px',
                  padding: '9px 14px',
                  maxWidth: '80%',
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontFamily: fonts.body,
                    fontWeight: 500,
                    color: tm.textPrimary,
                    lineHeight: 1.4,
                  }}>
                    {edgeCaseResponses[bubble.step]}
                  </span>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}

        {/* Agent thinking indicator */}
        {isTyping && bubbles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

        {/* Action card — inline in feed, appears after current bubble finishes typing */}
        <AnimatePresence mode="wait">
          {!isTyping && activeCard && bubbles[bubbles.length - 1]?.status === 'active' && (
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {renderActionCard()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar — gate options appear above it once narration finishes typing */}
      <TripInputBar
        placeholder="Ask me anything..."
        chips={edgeCaseMode && isGateActive && !isTyping ? EDGE_CASE_CHIPS[currentStep] : undefined}
        onGateSubmit={edgeCaseMode && isGateActive && !isTyping ? val => handleEdgeCaseChoice(currentStep, val) : undefined}
      />
    </div>
  );
}