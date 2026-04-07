export type TripStatus = 'confirmed' | 'Booking in progress' | 'completed';

export interface TimelineEntry {
  time: string;
  icon: string;
  title: string;
  subtitle?: string;
  reasoning?: string;
  type: 'flight' | 'cab' | 'meeting' | 'reminder' | 'buffer' | 'hotel';
}

export interface FlightLeg {
  flightNumber: string;
  airline: string;
  airlineColor: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  departure: string;
  arrival: string;
  duration: string;
  terminal: string;
  pnr: string;
  seat: string;
  class: string;
  stops: number;
  carbonKg: number;
}

export interface HotelEntry {
  name: string;
  stars: number;
  checkIn: string;
  checkOut: string;
  address: string;
  distanceFromVenue: string;
  pricePerNight: number;
  nights: number;
  confirmationId: string;
  status: 'booked' | 'pending' | 'completed';
  amenities: string[];
}

export interface CabEntry {
  id: string;
  label: string;
  provider: 'Uber' | 'Ola';
  type: string;
  pickupTime: string;
  from: string;
  to: string;
  fare: number;
  duration: string;
  status: 'booked' | 'pending' | 'completed';
}

export interface ExpenseEntry {
  icon: string;
  label: string;
  category: 'flight' | 'cab' | 'hotel' | 'other';
  amount: number;
}

export interface TripDetail {
  id: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  date: string;
  returnDate?: string;
  status: TripStatus;
  statusColor: string;
  price: string;
  totalAmount: number;
  policyLimit: number;
  purpose: string;
  description: string;
  agentNote: string;
  outbound: FlightLeg;
  inbound?: FlightLeg;
  hotel?: HotelEntry;
  cabs: CabEntry[];
  expenses: ExpenseEntry[];
  itinerary: TimelineEntry[];
  itinerary2Note?: string;
}

export const TRIP_DETAILS: Record<string, TripDetail> = {
  '1': {
    id: '1',
    from: 'COK',
    fromCity: 'Kochi',
    to: 'BOM',
    toCity: 'Mumbai',
    date: 'Apr 15, 2026',
    returnDate: 'Apr 15, 2026',
    status: 'confirmed',
    statusColor: '#00C9A7',
    price: '₹9,340',
    totalAmount: 9340,
    policyLimit: 15000,
    purpose: 'Team Meeting · BKC',
    description: 'Same-day round trip to Mumbai for Q2 strategy meeting at BKC office.',
    agentNote: "I chose IndiGo 6E-342 for its non-stop morning slot — you land 6 hrs before the meeting, which is perfect for a stress-free day. The evening 7:15 PM return gets you home by 9 PM. Both cab slots are pre-booked for buffer time.",
    outbound: {
      flightNumber: '6E-342',
      airline: 'IndiGo',
      airlineColor: '#1A56DB',
      from: 'COK',
      fromCity: 'Kochi',
      to: 'BOM',
      toCity: 'Mumbai',
      departure: '06:20',
      arrival: '08:10',
      duration: '1h 50m',
      terminal: 'COK Terminal 2',
      pnr: 'XY7K29',
      seat: '14A',
      class: 'Economy',
      stops: 0,
      carbonKg: 68,
    },
    inbound: {
      flightNumber: '6E-543',
      airline: 'IndiGo',
      airlineColor: '#1A56DB',
      from: 'BOM',
      fromCity: 'Mumbai',
      to: 'COK',
      toCity: 'Kochi',
      departure: '19:15',
      arrival: '21:00',
      duration: '1h 45m',
      terminal: 'BOM Terminal 2',
      pnr: 'XY7K30',
      seat: '12C',
      class: 'Economy',
      stops: 0,
      carbonKg: 64,
    },
    hotel: {
      name: 'Hyatt Regency BKC',
      stars: 5,
      checkIn: '09:00 AM',
      checkOut: '05:00 PM',
      address: 'Sahar Rd, Andheri East, BKC, Mumbai',
      distanceFromVenue: '0.4 km from BKC Office',
      pricePerNight: 6200,
      nights: 1,
      confirmationId: 'HY-BKC-8821',
      status: 'booked',
      amenities: ['Wifi', 'Breakfast', 'Parking'],
    },
    cabs: [
      {
        id: 'c1',
        label: 'Arrival Cab',
        provider: 'Uber',
        type: 'Sedan',
        pickupTime: '08:30 AM',
        from: 'BOM T2 Arrivals',
        to: 'BKC Office',
        fare: 650,
        duration: '45 min',
        status: 'booked',
      },
      {
        id: 'c2',
        label: 'Departure Cab',
        provider: 'Ola',
        type: 'Sedan',
        pickupTime: '05:00 PM',
        from: 'BKC Office',
        to: 'BOM T2',
        fare: 640,
        duration: '50 min',
        status: 'booked',
      },
    ],
    expenses: [
      { icon: '✈️', label: 'IndiGo 6E-342 (COK→BOM)', category: 'flight', amount: 4850 },
      { icon: '✈️', label: 'IndiGo 6E-543 (BOM→COK)', category: 'flight', amount: 3200 },
      { icon: '🏨', label: 'Hyatt Regency BKC — Day use', category: 'hotel', amount: 6200 },
      { icon: '🚕', label: 'Uber Sedan — BOM Arrival', category: 'cab', amount: 650 },
      { icon: '🚕', label: 'Ola Sedan — BOM Departure', category: 'cab', amount: 640 },
    ],
    itinerary: [
      { time: '04:45 AM', icon: '🔔', title: 'Wake-up Reminder', subtitle: 'Auto-set by TripMind', type: 'reminder', reasoning: 'You need 35 min to get ready and 5 min buffer before cab.' },
      { time: '05:20 AM', icon: '🚕', title: 'Cab to COK Airport', subtitle: '~30 min drive', type: 'cab', reasoning: 'Booking the cab 35 min before check-in opens gives comfortable buffer.' },
      { time: '06:00 AM', icon: '✈️', title: 'Arrive COK — Check-in opens', subtitle: 'IndiGo 6E-342', type: 'flight' },
      { time: '06:20 AM', icon: '✈️', title: 'Flight 6E-342 departs', subtitle: 'COK → BOM', type: 'flight', reasoning: 'Non-stop morning flight, lands 8:10 AM — 6 hrs before your meeting.' },
      { time: '08:10 AM', icon: '🛬', title: 'Land BOM T2', subtitle: 'Terminal 2', type: 'flight' },
      { time: '08:30 AM', icon: '🚕', title: 'Uber pickup — BOM T2', subtitle: 'Sedan · ₹650', type: 'cab', reasoning: '20 min buffer for deplaning + baggage claim.' },
      { time: '09:30 AM', icon: '📍', title: 'Arrive at BKC', subtitle: '4.5 hrs before meeting ✅', type: 'buffer', reasoning: 'Plenty of time to grab breakfast, freshen up, review materials.' },
      { time: '09:45 AM', icon: '🏨', title: 'Hotel Check-in', subtitle: 'Hyatt Regency BKC · Conf: HY-BKC-8821', type: 'hotel', reasoning: 'Day-use room booked to freshen up before the meeting. 0.4 km from your venue.' },
      { time: '02:00 PM', icon: '💼', title: 'Meeting begins', subtitle: 'BKC Office', type: 'meeting' },
      { time: '04:00 PM', icon: '💼', title: 'Meeting ends', subtitle: 'BKC Office', type: 'meeting' },
      { time: '04:30 PM', icon: '🏨', title: 'Hotel Check-out', subtitle: 'Hyatt Regency BKC', type: 'hotel' },
      { time: '05:00 PM', icon: '🚕', title: 'Ola pickup — BKC', subtitle: 'Sedan · ₹640', type: 'cab', reasoning: 'BKC to BOM is 45 min in evening traffic. 5 PM gives 2h 15m buffer.' },
      { time: '07:15 PM', icon: '✈️', title: 'Return flight departs', subtitle: 'BOM → COK · 6E-543', type: 'flight' },
      { time: '09:00 PM', icon: '🛬', title: 'Land COK', subtitle: 'Home ✈', type: 'flight' },
    ],
  },
  '2': {
    id: '2',
    from: 'BLR',
    fromCity: 'Bengaluru',
    to: 'DEL',
    toCity: 'Delhi',
    date: 'Apr 22, 2026',
    returnDate: 'Apr 23, 2026',
    status: 'Booking in progress',
    statusColor: '#F5A623',
    price: '₹12,800',
    totalAmount: 12800,
    policyLimit: 18000,
    purpose: 'Client Presentation',
    description: 'Overnight trip to Delhi for client pitch at Connaught Place office.',
    agentNote: "Still in planning mode — I've shortlisted Air India AI-501 for the smooth morning slot. I'm monitoring 3 fare options and will lock in once you confirm the return date. Hotel near CP has been pre-scouted.",
    outbound: {
      flightNumber: 'AI-501',
      airline: 'Air India',
      airlineColor: '#C8001E',
      from: 'BLR',
      fromCity: 'Bengaluru',
      to: 'DEL',
      toCity: 'Delhi',
      departure: '07:45',
      arrival: '10:30',
      duration: '2h 45m',
      terminal: 'BLR Terminal 2',
      pnr: 'PENDING',
      seat: 'TBD',
      class: 'Economy',
      stops: 0,
      carbonKg: 122,
    },
    hotel: {
      name: 'The Claridges New Delhi',
      stars: 5,
      checkIn: '12:00 PM',
      checkOut: '11:00 AM',
      address: '12 Aurangzeb Rd, Connaught Place, New Delhi',
      distanceFromVenue: '1.2 km from CP Office',
      pricePerNight: 7800,
      nights: 1,
      confirmationId: 'PENDING',
      status: 'pending',
      amenities: ['Wifi', 'Breakfast'],
    },
    cabs: [
      {
        id: 'c1',
        label: 'Airport Pickup',
        provider: 'Uber',
        type: 'SUV',
        pickupTime: '10:45 AM',
        from: 'DEL T3 Arrivals',
        to: 'Connaught Place Hotel',
        fare: 950,
        duration: '50 min',
        status: 'pending',
      },
    ],
    expenses: [
      { icon: '✈️', label: 'Air India AI-501 (BLR→DEL)', category: 'flight', amount: 7200 },
      { icon: '✈️', label: 'Return flight (DEL→BLR) — TBD', category: 'flight', amount: 4650 },
      { icon: '🏨', label: 'The Claridges New Delhi — 1 night', category: 'hotel', amount: 7800 },
      { icon: '🚕', label: 'Uber SUV — DEL Arrival', category: 'cab', amount: 950 },
    ],
    itinerary: [
      { time: '05:30 AM', icon: '🔔', title: 'Wake-up Reminder', subtitle: 'Auto-set by TripMind', type: 'reminder' },
      { time: '06:15 AM', icon: '🚕', title: 'Cab to BLR Airport', subtitle: '~45 min drive', type: 'cab', reasoning: 'BLR T2 traffic is heavy during morning peak. 90 min before departure is comfortable.' },
      { time: '07:15 AM', icon: '✈️', title: 'Arrive BLR — Check-in', subtitle: 'Air India AI-501', type: 'flight' },
      { time: '07:45 AM', icon: '✈️', title: 'Flight AI-501 departs', subtitle: 'BLR → DEL', type: 'flight', reasoning: 'Morning departure avoids afternoon turbulence and gets you in before lunch.' },
      { time: '10:30 AM', icon: '🛬', title: 'Land DEL T3', subtitle: 'Terminal 3', type: 'flight' },
      { time: '10:45 AM', icon: '🚕', title: 'Uber pickup — DEL T3', subtitle: 'SUV · ₹950', type: 'cab' },
      { time: '12:00 PM', icon: '🏨', title: 'Hotel Check-in', subtitle: 'The Claridges New Delhi · Awaiting confirmation', type: 'hotel', reasoning: 'Pre-negotiated early check-in. Time to freshen up before presentation. 1.2 km from CP Office.' },
      { time: '03:00 PM', icon: '💼', title: 'Client presentation', subtitle: 'CP Office', type: 'meeting' },
      { time: '05:30 PM', icon: '💼', title: 'Presentation wrap-up', subtitle: 'Q&A + networking', type: 'meeting' },
    ],
    itinerary2Note: 'Return itinerary pending confirmation of Apr 23 flight.',
  },
  '3': {
    id: '3',
    from: 'COK',
    fromCity: 'Kochi',
    to: 'HYD',
    toCity: 'Hyderabad',
    date: 'Mar 28, 2026',
    returnDate: 'Mar 28, 2026',
    status: 'completed',
    statusColor: '#8B949E',
    price: '₹7,200',
    totalAmount: 7200,
    policyLimit: 12000,
    purpose: 'Product Review',
    description: 'Day trip to Hyderabad for Q1 product review with engineering team.',
    agentNote: "Trip completed smoothly. IndiGo 6E-910 was on time, both cabs were booked well in advance. You returned home by 10 PM. Expense report auto-filed.",
    outbound: {
      flightNumber: '6E-910',
      airline: 'IndiGo',
      airlineColor: '#1A56DB',
      from: 'COK',
      fromCity: 'Kochi',
      to: 'HYD',
      toCity: 'Hyderabad',
      departure: '07:00',
      arrival: '08:40',
      duration: '1h 40m',
      terminal: 'COK Terminal 1',
      pnr: 'AB4M91',
      seat: '22F',
      class: 'Economy',
      stops: 0,
      carbonKg: 58,
    },
    inbound: {
      flightNumber: '6E-921',
      airline: 'IndiGo',
      airlineColor: '#1A56DB',
      from: 'HYD',
      fromCity: 'Hyderabad',
      to: 'COK',
      toCity: 'Kochi',
      departure: '19:50',
      arrival: '21:25',
      duration: '1h 35m',
      terminal: 'HYD Terminal 1',
      pnr: 'AB4M92',
      seat: '18B',
      class: 'Economy',
      stops: 0,
      carbonKg: 55,
    },
    cabs: [
      {
        id: 'c1',
        label: 'Airport Pickup',
        provider: 'Uber',
        type: 'Sedan',
        pickupTime: '08:55 AM',
        from: 'HYD Airport',
        to: 'Hitech City Office',
        fare: 580,
        duration: '35 min',
        status: 'completed',
      },
      {
        id: 'c2',
        label: 'Departure Cab',
        provider: 'Ola',
        type: 'Sedan',
        pickupTime: '06:30 PM',
        from: 'Hitech City Office',
        to: 'HYD Airport',
        fare: 590,
        duration: '40 min',
        status: 'completed',
      },
    ],
    expenses: [
      { icon: '✈️', label: 'IndiGo 6E-910 (COK→HYD)', category: 'flight', amount: 3100 },
      { icon: '✈️', label: 'IndiGo 6E-921 (HYD→COK)', category: 'flight', amount: 2930 },
      { icon: '🚕', label: 'Uber — HYD Arrival', category: 'cab', amount: 580 },
      { icon: '🚕', label: 'Ola — HYD Departure', category: 'cab', amount: 590 },
    ],
    itinerary: [
      { time: '05:00 AM', icon: '🔔', title: 'Wake-up Reminder', subtitle: 'Auto-set by TripMind', type: 'reminder' },
      { time: '05:45 AM', icon: '🚕', title: 'Cab to COK Airport', subtitle: '~30 min drive', type: 'cab' },
      { time: '06:30 AM', icon: '✈️', title: 'Arrive COK — Check-in', subtitle: 'IndiGo 6E-910', type: 'flight' },
      { time: '07:00 AM', icon: '✈️', title: 'Flight 6E-910 departs', subtitle: 'COK → HYD', type: 'flight' },
      { time: '08:40 AM', icon: '🛬', title: 'Land HYD', subtitle: 'Terminal 1', type: 'flight' },
      { time: '08:55 AM', icon: '🚕', title: 'Uber pickup — HYD', subtitle: 'Sedan · ₹580', type: 'cab' },
      { time: '10:00 AM', icon: '💼', title: 'Product review begins', subtitle: 'Hitech City Office', type: 'meeting' },
      { time: '05:30 PM', icon: '💼', title: 'Review wrap-up', subtitle: 'Action items assigned', type: 'meeting' },
      { time: '06:30 PM', icon: '🚕', title: 'Ola pickup — Hitech City', subtitle: 'Sedan · ₹590', type: 'cab' },
      { time: '07:10 PM', icon: '✈️', title: 'Arrive HYD — Security', subtitle: 'Terminal 1', type: 'flight' },
      { time: '19:50', icon: '✈️', title: 'Flight 6E-921 departs', subtitle: 'HYD → COK', type: 'flight' },
      { time: '21:25', icon: '🛬', title: 'Land COK ✅', subtitle: 'Trip complete', type: 'flight' },
    ],
  },
  '4': {
    id: '4',
    from: 'BOM',
    fromCity: 'Mumbai',
    to: 'BLR',
    toCity: 'Bengaluru',
    date: 'Mar 10, 2026',
    returnDate: 'Mar 12, 2026',
    status: 'completed',
    statusColor: '#8B949E',
    price: '₹5,800',
    totalAmount: 5800,
    policyLimit: 10000,
    purpose: 'Leadership Offsite',
    description: '3-day leadership offsite in Bengaluru with the senior management team.',
    agentNote: "3-day offsite completed. Vistara UK-830 was on time and smooth. Hotel at Indiranagar was well-rated by the team. Expense report filed and approved on Mar 14.",
    outbound: {
      flightNumber: 'UK-830',
      airline: 'Vistara',
      airlineColor: '#6B21A8',
      from: 'BOM',
      fromCity: 'Mumbai',
      to: 'BLR',
      toCity: 'Bengaluru',
      departure: '09:15',
      arrival: '11:10',
      duration: '1h 55m',
      terminal: 'BOM Terminal 2',
      pnr: 'VK8302',
      seat: '8D',
      class: 'Business',
      stops: 0,
      carbonKg: 72,
    },
    inbound: {
      flightNumber: 'UK-843',
      airline: 'Vistara',
      airlineColor: '#6B21A8',
      from: 'BLR',
      fromCity: 'Bengaluru',
      to: 'BOM',
      toCity: 'Mumbai',
      departure: '18:30',
      arrival: '20:25',
      duration: '1h 55m',
      terminal: 'BLR Terminal 1',
      pnr: 'VK8303',
      seat: '9D',
      class: 'Business',
      stops: 0,
      carbonKg: 70,
    },
    cabs: [
      {
        id: 'c1',
        label: 'Hotel Pickup',
        provider: 'Uber',
        type: 'SUV',
        pickupTime: '11:30 AM',
        from: 'BLR Airport T1',
        to: 'Indiranagar Hotel',
        fare: 720,
        duration: '45 min',
        status: 'completed',
      },
    ],
    expenses: [
      { icon: '✈️', label: 'Vistara UK-830 (BOM→BLR)', category: 'flight', amount: 3200 },
      { icon: '✈️', label: 'Vistara UK-843 (BLR→BOM)', category: 'flight', amount: 1880 },
      { icon: '🚕', label: 'Uber SUV — BLR Arrival', category: 'cab', amount: 720 },
    ],
    itinerary: [
      { time: '07:30 AM', icon: '🔔', title: 'Departure Reminder', subtitle: 'Auto-set by TripMind', type: 'reminder' },
      { time: '08:00 AM', icon: '🚕', title: 'Cab to BOM T2', subtitle: '~35 min drive', type: 'cab' },
      { time: '09:15 AM', icon: '✈️', title: 'Vistara UK-830 departs', subtitle: 'BOM → BLR', type: 'flight' },
      { time: '11:10 AM', icon: '🛬', title: 'Land BLR T1', subtitle: 'Terminal 1', type: 'flight' },
      { time: '11:30 AM', icon: '🚕', title: 'Uber pickup — BLR T1', subtitle: 'SUV · ₹720', type: 'cab' },
      { time: '12:15 PM', icon: '🏨', title: 'Hotel check-in', subtitle: 'Indiranagar', type: 'buffer' },
      { time: '02:00 PM', icon: '💼', title: 'Day 1 — Offsite begins', subtitle: 'Leadership sessions', type: 'meeting' },
      { time: '06:00 PM', icon: '💼', title: 'Day 2 — Strategy workshops', subtitle: 'Mar 11', type: 'meeting' },
      { time: '10:00 AM', icon: '💼', title: 'Day 3 — Wrap & planning', subtitle: 'Mar 12', type: 'meeting' },
      { time: '04:30 PM', icon: '🚕', title: 'Cab to BLR Airport', subtitle: 'Mar 12', type: 'cab' },
      { time: '18:30', icon: '✈️', title: 'Vistara UK-843 departs', subtitle: 'BLR → BOM', type: 'flight' },
      { time: '20:25', icon: '🛬', title: 'Land BOM ✅', subtitle: 'Trip complete', type: 'flight' },
    ],
  },
};

export const ALL_TRIPS = Object.values(TRIP_DETAILS).map(t => ({
  id: t.id,
  from: t.from,
  to: t.to,
  date: t.date,
  status: t.status,
  statusColor: t.statusColor,
  price: t.price,
  airline: `${t.outbound.airline} ${t.outbound.flightNumber}`,
  purpose: t.purpose,
}));