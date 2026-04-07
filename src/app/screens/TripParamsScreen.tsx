import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MapPin, Calendar, Users, Plane, Car,
  Building2, Package, ChevronRight, Check, ChevronLeft, User,
  Sparkles, MicOff, X,
} from 'lucide-react';
import { tm, fonts } from '../constants/colors';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_SHORT = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

const PICKER_OPTIONS: Record<string, string[]> = {
  flightClass:      ['Economy', 'Business', 'First Class'],
  flightType:       ['Cheapest', 'Fastest', 'Best Value', 'No Preference'],
  seatPreference:   ['Window', 'Aisle', 'Middle', 'No preference'],
  roomType:         ['Standard', 'Deluxe', 'Suite', 'Day use'],
  hotelStars:       ['5 Star', '4 Star', '3 Star', '2 Star', 'Any'],
  passengers:       ['1', '2', '3', '4', '5+'],
  preferredAirline: ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Akasa Air', 'No Preference'],
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PassengerInfo {
  name:     string;
  dob:      string;
  passport: string;
}

interface TripParams {
  origin: string;
  destination: string;
  outboundDate: string;
  returnDate: string;
  passengers: string;
  passengerName: string;
  additionalPassengers: PassengerInfo[];
  luggageCabinOnly: boolean;
  flightClass: string;
  flightType: string;
  seatPreference: string;
  directOnly: boolean;
  preferredAirline: string;
  cabPickup: string;
  cabDrop: string;
  hotelCheckIn: string;
  hotelCheckOut: string;
  roomType: string;
  hotelStars: string;
}

type ActiveSheet =
  | { kind: 'picker';    field: keyof TripParams;  title: string; options: string[] }
  | { kind: 'text';      field: keyof TripParams;  title: string; placeholder?: string; note?: string }
  | { kind: 'calendar';  field: keyof TripParams;  title: string }
  | { kind: 'passenger'; index: number;            title: string };

// ─── Date helpers ─────────────────────────────────────────────────────────────

function parseDate(str: string): { year: number; month: number; day: number } | null {
  const m = str.match(/^(\w{3})\s+(\d{1,2}),\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTH_SHORT.indexOf(m[1]);
  if (month < 0) return null;
  return { year: parseInt(m[3]), month, day: parseInt(m[2]) };
}

function formatDate(year: number, month: number, day: number): string {
  return `${MONTH_SHORT[month]} ${day}, ${year}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ─── Calendar Picker ──────────────────────────────────────────────────────────

function CalendarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const parsed = parseDate(value);
  const [viewYear, setViewYear]   = useState(parsed?.year  ?? 2026);
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? 3);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfWeek(viewYear, viewMonth);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  return (
    <div>
      {/* Month navigation */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={prevMonth}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChevronLeft size={15} color={tm.textPrimary} />
        </motion.button>

        <span style={{
          fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700,
          color: tm.textPrimary,
        }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={nextMonth}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChevronRight size={15} color={tm.textPrimary} />
        </motion.button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontSize: '11px', color: tm.textSecondary,
            fontFamily: fonts.mono, fontWeight: 600, padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} style={{ height: '38px' }} />;
          const isSel = parsed?.year === viewYear && parsed?.month === viewMonth && parsed?.day === day;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={() => onChange(formatDate(viewYear, viewMonth, day))}
              style={{
                height: '38px', width: '38px', margin: '0 auto',
                borderRadius: '50%',
                background: isSel ? tm.accentAmber : 'transparent',
                border: 'none', cursor: 'pointer',
                fontSize: '13px', fontFamily: fonts.mono,
                color: isSel ? '#fff' : tm.textPrimary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: isSel ? 700 : 400,
              }}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Intent parser ────────────────────────────────────────────────────────────

function parseFromText(text: string): Partial<TripParams> {
  const lower = text.toLowerCase();
  const p: Partial<TripParams> = {};
  if (lower.includes('mumbai') || lower.includes('bom')) {
    p.destination = 'Mumbai (BOM)';
    p.cabPickup   = 'BOM T2 Arrivals';
    p.cabDrop     = 'BKC Office District';
  }
  if (lower.includes('kochi') || lower.includes('cok') || lower.includes('cochin')) {
    p.origin = 'Kochi (COK)';
  }
  if (lower.includes('15') || lower.includes('april') || lower.includes('apr')) {
    p.outboundDate  = 'Apr 15, 2026';
    p.returnDate    = 'Apr 15, 2026';
    p.hotelCheckIn  = 'Apr 15, 2026';
    p.hotelCheckOut = 'Apr 15, 2026';
  }
  if (lower.includes('morning')) p.directOnly = true;
  if (lower.includes('business')) p.flightClass = 'Business';
  return p;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function TripParamsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState<string>(
    (location.state as any)?.inputText ??
    "I have a meeting in Mumbai on the 15th. Morning flight, back same evening.",
  );

  const parsed = parseFromText(inputText);

  const [params, setParams] = useState<TripParams>({
    origin:               parsed.origin          ?? 'Kochi (COK)',
    destination:          parsed.destination     ?? '',
    outboundDate:         parsed.outboundDate    ?? '',
    returnDate:           parsed.returnDate      ?? '',
    passengers:           '1',
    passengerName:        'Arjun Menon',
    additionalPassengers: [],
    luggageCabinOnly:     true,
    flightClass:          parsed.flightClass     ?? 'Economy',
    flightType:           'Cheapest',
    seatPreference:       'Window',
    directOnly:           parsed.directOnly      ?? false,
    preferredAirline:     'No Preference',
    cabPickup:            parsed.cabPickup       ?? '',
    cabDrop:              parsed.cabDrop         ?? '',
    hotelCheckIn:         parsed.hotelCheckIn    ?? '',
    hotelCheckOut:        parsed.hotelCheckOut   ?? '',
    roomType:             'Day use',
    hotelStars:           'Any',
  });

  const [activeSheet, setActiveSheet]         = useState<ActiveSheet | null>(null);
  const [voiceOverlayOpen, setVoiceOverlayOpen] = useState(false);
  const [overlayText, setOverlayText]           = useState('');
  const [isRecording, setIsRecording]           = useState(false);
  const [voiceStatus, setVoiceStatus]           = useState<'idle' | 'listening' | 'done'>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  function openVoiceOverlay() {
    setOverlayText(inputText);
    setVoiceOverlayOpen(true);
  }

  function closeVoiceOverlay() {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setVoiceStatus('idle');
    setVoiceOverlayOpen(false);
  }

  function handleUpdateRequest() {
    if (overlayText.trim()) setInputText(overlayText.trim());
    closeVoiceOverlay();
  }

  function toggleRecording() {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setVoiceStatus('done');
      return;
    }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      setOverlayText("I have a meeting in Mumbai on the 15th. Morning flight, back same evening.");
      setVoiceStatus('done');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart  = () => { setIsRecording(true);  setVoiceStatus('listening'); };
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ');
      setOverlayText(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    rec.onend    = () => { setIsRecording(false); setVoiceStatus('done'); };
    rec.onerror  = () => { setIsRecording(false); setVoiceStatus('idle'); };
    recognitionRef.current = rec;
    rec.start();
  }

  const passengerCount = params.passengers === '5+' ? 5 : parseInt(params.passengers) || 1;
  const additionalCount = Math.max(0, passengerCount - 1);

  function update<K extends keyof TripParams>(key: K, val: TripParams[K]) {
    setParams(prev => ({ ...prev, [key]: val }));
  }

  function handlePassengersChange(val: string) {
    const newCount = val === '5+' ? 5 : parseInt(val) || 1;
    const addCount = Math.max(0, newCount - 1);
    setParams(prev => ({
      ...prev,
      passengers: val,
      additionalPassengers: Array.from(
        { length: addCount },
        (_, i) => prev.additionalPassengers[i] ?? { name: '', dob: '', passport: '' },
      ),
    }));
  }

  function openPicker(field: keyof TripParams, title: string) {
    setActiveSheet({ kind: 'picker', field, title, options: PICKER_OPTIONS[field] ?? [] });
  }

  function openText(field: keyof TripParams, title: string, placeholder?: string, note?: string) {
    setActiveSheet({ kind: 'text', field, title, placeholder, note });
  }

  function openCalendar(field: keyof TripParams, title: string) {
    setActiveSheet({ kind: 'calendar', field, title });
  }

  function openPassenger(index: number) {
    setActiveSheet({
      kind: 'passenger',
      index,
      title: `Passenger ${index + 2} Details`,
    });
  }

  // ── Sub-components ──────────────────────────────────────────────────────────

  function SectionLabel({ label }: { label: string }) {
    return (
      <div style={{
        fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
        fontWeight: 600, marginBottom: '10px', paddingLeft: '4px',
        letterSpacing: '0.08em', textTransform: 'uppercase' as const,
      }}>
        {label}
      </div>
    );
  }

  function Card({ children }: { children: React.ReactNode }) {
    return (
      <div style={{
        background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
        borderRadius: '14px', overflow: 'hidden', marginBottom: '20px',
      }}>
        {children}
      </div>
    );
  }

  function RowDivider() {
    return <div style={{ height: '1px', background: tm.borderSubtle, marginLeft: '44px' }} />;
  }

  function ChevronRow({
    icon: Icon, label, value, onPress, placeholder = '—',
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
    onPress: () => void;
    placeholder?: string;
  }) {
    return (
      <motion.div
        whileTap={{ opacity: 0.7 }}
        onClick={onPress}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 14px', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Icon size={15} color={tm.textSecondary} />
          <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>
            {label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <span style={{
            fontSize: '12px',
            color: value ? tm.accentAmber : tm.textSecondary,
            fontFamily: fonts.mono,
            textAlign: 'right',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: '160px',
          }}>
            {value || placeholder}
          </span>
          <ChevronRight size={13} color={tm.textSecondary} style={{ flexShrink: 0 }} />
        </div>
      </motion.div>
    );
  }

  function ToggleRow({
    icon: Icon, label, field,
  }: { icon: React.ElementType; label: string; field: keyof TripParams }) {
    const on = params[field] as boolean;
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon size={15} color={tm.textSecondary} />
          <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>
            {label}
          </span>
        </div>
        <button
          onClick={() => update(field, !on as TripParams[typeof field])}
          style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: on ? tm.accentTeal : tm.bgElevated,
            border: `1px solid ${on ? tm.accentTeal : tm.borderSubtle}`,
            cursor: 'pointer', position: 'relative', padding: 0,
            transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <motion.div
            animate={{ x: on ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
              position: 'absolute', top: '2px', left: 0,
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          />
        </button>
      </div>
    );
  }

  // ── Sheet body renderer ─────────────────────────────────────────────────────

  function renderSheetBody() {
    if (!activeSheet) return null;

    if (activeSheet.kind === 'picker') {
      const options = activeSheet.options;
      const currentVal = params[activeSheet.field] as string;
      return (
        <div>
          {options.map((opt, i) => (
            <motion.div
              key={opt}
              whileTap={{ opacity: 0.6 }}
              onClick={() => {
                if (activeSheet.field === 'passengers') {
                  handlePassengersChange(opt);
                } else {
                  update(activeSheet.field, opt as TripParams[typeof activeSheet.field]);
                }
                setActiveSheet(null);
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 4px', cursor: 'pointer',
                borderBottom: i < options.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
              }}
            >
              <span style={{ fontSize: '14px', color: tm.textPrimary, fontFamily: fonts.body }}>
                {opt}
              </span>
              {currentVal === opt && <Check size={16} color={tm.accentTeal} />}
            </motion.div>
          ))}
        </div>
      );
    }

    if (activeSheet.kind === 'text') {
      const val = params[activeSheet.field] as string;
      return (
        <div>
          <input
            autoFocus
            value={val}
            onChange={e => update(activeSheet.field, e.target.value as TripParams[typeof activeSheet.field])}
            placeholder={activeSheet.placeholder ?? '—'}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '12px', padding: '14px 16px',
              fontSize: '14px', fontFamily: fonts.body,
              color: tm.textPrimary, outline: 'none',
            }}
          />
          {activeSheet.note && (
            <p style={{
              fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
              marginTop: '10px', marginBottom: 0, paddingLeft: '4px',
            }}>
              {activeSheet.note}
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSheet(null)}
            style={{
              width: '100%', marginTop: '16px',
              background: tm.accentAmber, border: 'none',
              borderRadius: '12px', padding: '13px',
              cursor: 'pointer', fontSize: '14px',
              fontFamily: fonts.heading, fontWeight: 700,
              color: '#fff',
            }}
          >
            Done
          </motion.button>
        </div>
      );
    }

    if (activeSheet.kind === 'calendar') {
      return (
        <CalendarPicker
          value={params[activeSheet.field] as string}
          onChange={val => {
            update(activeSheet.field, val as TripParams[typeof activeSheet.field]);
            setActiveSheet(null);
          }}
        />
      );
    }

    if (activeSheet.kind === 'passenger') {
      const { index } = activeSheet;
      const pax = params.additionalPassengers[index] ?? { name: '', dob: '', passport: '' };

      function updatePax(field: keyof PassengerInfo, value: string) {
        const updated = [...params.additionalPassengers];
        updated[index] = { ...pax, [field]: value };
        update('additionalPassengers', updated);
      }

      const fieldStyle: React.CSSProperties = {
        width: '100%', boxSizing: 'border-box',
        background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
        borderRadius: '12px', padding: '13px 16px',
        fontSize: '14px', fontFamily: fonts.body,
        color: tm.textPrimary, outline: 'none',
      };

      const fieldLabelStyle: React.CSSProperties = {
        fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono,
        fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: '6px', paddingLeft: '2px',
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Name */}
          <div>
            <div style={fieldLabelStyle}>Full Name</div>
            <input
              autoFocus
              value={pax.name}
              onChange={e => updatePax('name', e.target.value)}
              placeholder="As it appears on passport"
              style={fieldStyle}
            />
            <p style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '6px 0 0 2px' }}>
              Must match passport exactly
            </p>
          </div>

          {/* Date of Birth */}
          <div>
            <div style={fieldLabelStyle}>Date of Birth</div>
            <input
              value={pax.dob}
              onChange={e => updatePax('dob', e.target.value)}
              placeholder="e.g. Mar 14, 1992"
              style={fieldStyle}
            />
          </div>

          {/* Passport Number */}
          <div>
            <div style={fieldLabelStyle}>Passport Number</div>
            <input
              value={pax.passport}
              onChange={e => updatePax('passport', e.target.value)}
              placeholder="e.g. Z8831042"
              style={{ ...fieldStyle, fontFamily: fonts.mono, letterSpacing: '0.04em' }}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSheet(null)}
            style={{
              width: '100%', marginTop: '4px',
              background: tm.accentAmber, border: 'none',
              borderRadius: '12px', padding: '13px',
              cursor: 'pointer', fontSize: '14px',
              fontFamily: fonts.heading, fontWeight: 700,
              color: '#fff',
            }}
          >
            Done
          </motion.button>
        </div>
      );
    }

    return null;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{
      background: tm.bgPrimary, flex: 1, display: 'flex', flexDirection: 'column',
      fontFamily: fonts.body, position: 'relative', overflow: 'hidden',
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: `1px solid ${tm.borderSubtle}`, flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={16} color={tm.textPrimary} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700,
            color: tm.textPrimary, margin: 0,
          }}>
            Review Trip Details
          </h1>
          <p style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, margin: 0 }}>
            Confirm or edit before planning
          </p>
        </div>
        <div style={{ width: '36px' }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 40px', scrollbarWidth: 'none' }}>

        {/* User input quote */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: `${tm.accentAmber}10`,
            border: `1px solid ${tm.accentAmber}30`,
            borderLeft: `3px solid ${tm.accentAmber}`,
            borderRadius: '12px', padding: '12px 14px', marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{
              fontSize: '10px', color: tm.accentAmber, fontFamily: fonts.mono,
              fontWeight: 600, letterSpacing: '0.06em',
            }}>
              YOUR REQUEST
            </div>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={openVoiceOverlay}
              style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 8px ${tm.accentAmber}50`, flexShrink: 0,
              }}
            >
              <Sparkles size={12} color="#fff" />
            </motion.button>
          </div>
          <p style={{
            fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body,
            margin: 0, lineHeight: 1.6, fontStyle: 'italic',
          }}>
            "{inputText}"
          </p>
        </motion.div>

        {/* ── TRIP DETAILS ── */}
        <SectionLabel label="Trip Details" />
        <Card>
          <ChevronRow
            icon={MapPin} label="Origin"
            value={params.origin}
            onPress={() => openText('origin', 'Origin', 'City or airport code')}
          />
          <RowDivider />
          <ChevronRow
            icon={MapPin} label="Destination"
            value={params.destination}
            placeholder="City or airport code"
            onPress={() => openText('destination', 'Destination', 'City or airport code')}
          />
          <RowDivider />
          <ChevronRow
            icon={Calendar} label="Outbound Date"
            value={params.outboundDate}
            placeholder="Select date"
            onPress={() => openCalendar('outboundDate', 'Outbound Date')}
          />
          <RowDivider />
          <ChevronRow
            icon={Calendar} label="Return Date"
            value={params.returnDate}
            placeholder="Select date"
            onPress={() => openCalendar('returnDate', 'Return Date')}
          />
        </Card>

        {/* ── TRAVELLER INFO ── */}
        <SectionLabel label="Traveller Info" />
        <Card>
          <ChevronRow
            icon={Users} label="Passengers"
            value={params.passengers}
            onPress={() => openPicker('passengers', 'Number of Passengers')}
          />
          <RowDivider />
          <ChevronRow
            icon={User} label="Primary Passenger"
            value={params.passengerName}
            placeholder="Full name"
            onPress={() => openText('passengerName', 'Primary Passenger Name', 'Full name as on passport', 'Must match passport exactly')}
          />
          {Array.from({ length: additionalCount }, (_, i) => (
            <div key={i}>
              <RowDivider />
              <motion.div
                whileTap={{ opacity: 0.7 }}
                onClick={() => openPassenger(i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 14px', cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <User size={15} color={tm.textSecondary} />
                  <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>
                    Passenger {i + 2}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: params.additionalPassengers[i]?.name ? tm.accentAmber : tm.textSecondary,
                    fontFamily: fonts.mono, maxWidth: '140px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {params.additionalPassengers[i]?.name || 'Add details'}
                  </span>
                  <ChevronRight size={13} color={tm.textSecondary} />
                </div>
              </motion.div>
            </div>
          ))}
          <RowDivider />
          <ToggleRow icon={Package} label="Cabin baggage only" field="luggageCabinOnly" />
        </Card>

        {/* ── FLIGHT PREFERENCES ── */}
        <SectionLabel label="Flight Preferences" />
        <Card>
          <ChevronRow
            icon={Plane} label="Class"
            value={params.flightClass}
            onPress={() => openPicker('flightClass', 'Flight Class')}
          />
          <RowDivider />
          <ChevronRow
            icon={Plane} label="Flight Type"
            value={params.flightType}
            onPress={() => openPicker('flightType', 'Flight Type')}
          />
          <RowDivider />
          <ChevronRow
            icon={Plane} label="Seat Preference"
            value={params.seatPreference}
            onPress={() => openPicker('seatPreference', 'Seat Preference')}
          />
          <RowDivider />
          <ChevronRow
            icon={Plane} label="Preferred Airline"
            value={params.preferredAirline}
            onPress={() => openPicker('preferredAirline', 'Preferred Airline')}
          />
          <RowDivider />
          <ToggleRow icon={Plane} label="Direct flights only" field="directOnly" />
        </Card>

        {/* ── CAB INFO ── */}
        <SectionLabel label="Cab Info" />
        <Card>
          <ChevronRow
            icon={Car} label="Pickup Address"
            value={params.cabPickup}
            placeholder="e.g. BOM T2 Arrivals"
            onPress={() => openText('cabPickup', 'Pickup Address', 'e.g. BOM T2 Arrivals')}
          />
          <RowDivider />
          <ChevronRow
            icon={Car} label="Drop-off Address"
            value={params.cabDrop}
            placeholder="e.g. BKC, Mumbai"
            onPress={() => openText('cabDrop', 'Drop-off Address', 'e.g. BKC, Mumbai')}
          />
        </Card>

        {/* ── HOTEL PREFERENCES ── */}
        <SectionLabel label="Hotel Preferences" />
        <Card>
          <ChevronRow
            icon={Building2} label="Check-in"
            value={params.hotelCheckIn}
            placeholder="Select date"
            onPress={() => openCalendar('hotelCheckIn', 'Hotel Check-in')}
          />
          <RowDivider />
          <ChevronRow
            icon={Building2} label="Check-out"
            value={params.hotelCheckOut}
            placeholder="Select date"
            onPress={() => openCalendar('hotelCheckOut', 'Hotel Check-out')}
          />
          <RowDivider />
          <ChevronRow
            icon={Building2} label="Room Type"
            value={params.roomType}
            onPress={() => openPicker('roomType', 'Room Type')}
          />
          <RowDivider />
          <ChevronRow
            icon={Building2} label="Hotel Type"
            value={params.hotelStars}
            onPress={() => openPicker('hotelStars', 'Hotel Type')}
          />
        </Card>

        {/* ── CTA ── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/agent-auto', { state: { params, inputText } })}
          style={{
            width: '100%', background: tm.accentAmber, border: 'none',
            borderRadius: '16px', padding: '16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: `0 4px 18px ${tm.accentAmber}40`,
          }}
        >
          <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
            Looks Good, Let's Plan
          </span>
          <span style={{ fontSize: '15px', color: '#ffffff' }}>→</span>
        </motion.button>

      </div>

      {/* ── Voice Overlay ── */}
      <AnimatePresence>
        {voiceOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVoiceOverlay}
            style={{
              position: 'absolute', inset: 0, zIndex: 60,
              display: 'flex', alignItems: 'center', padding: '0 16px',
            }}
          >
            {/* Backdrop */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)' }} />

            {/* Card */}
            <motion.div
              initial={{ scale: 0.93, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 18 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative', width: '100%', zIndex: 1,
                background: tm.bgSurface, borderRadius: '22px',
                padding: '20px', border: `1px solid ${tm.borderSubtle}`,
                boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                  Update Request
                </span>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={closeVoiceOverlay}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={13} color={tm.textSecondary} />
                </motion.button>
              </div>

              {/* Mic button + status */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AnimatePresence>
                    {isRecording && [1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1 + i * 0.35, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.3, ease: 'easeOut' }}
                        style={{ position: 'absolute', width: '54px', height: '54px', borderRadius: '50%', background: tm.accentAmber, pointerEvents: 'none' }}
                      />
                    ))}
                  </AnimatePresence>
                  {!isRecording && (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.1, 0.25] }}
                      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                      style={{ position: 'absolute', width: '54px', height: '54px', borderRadius: '50%', background: tm.accentAmber, pointerEvents: 'none' }}
                    />
                  )}
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={toggleRecording}
                    animate={isRecording ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={isRecording ? { repeat: Infinity, duration: 0.8 } : {}}
                    style={{
                      width: '54px', height: '54px', borderRadius: '50%',
                      background: isRecording
                        ? `linear-gradient(135deg, ${tm.accentRed}, #c0392b)`
                        : `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isRecording ? `0 4px 20px ${tm.accentRed}60` : `0 4px 20px ${tm.accentAmber}60`,
                      position: 'relative', zIndex: 1,
                      transition: 'background 0.3s, box-shadow 0.3s',
                    }}
                  >
                    {isRecording ? <MicOff size={22} color="#fff" /> : <Sparkles size={22} color="#fff" />}
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={voiceStatus}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '12px', fontFamily: fonts.mono, margin: 0, color: isRecording ? tm.accentAmber : tm.textSecondary, fontWeight: isRecording ? 600 : 400 }}
                  >
                    {voiceStatus === 'listening' ? 'Listening...' : voiceStatus === 'done' ? 'Tap to speak again' : 'Tap to speak'}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Text input */}
              <textarea
                value={overlayText}
                onChange={e => setOverlayText(e.target.value)}
                rows={3}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
                  borderRadius: '12px', padding: '12px 14px',
                  fontSize: '13px', fontFamily: fonts.body, color: tm.textPrimary,
                  resize: 'none', outline: 'none', lineHeight: 1.6,
                  marginBottom: '14px',
                }}
              />

              {/* CTA */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleUpdateRequest}
                style={{
                  width: '100%', background: tm.accentAmber, border: 'none',
                  borderRadius: '12px', padding: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: `0 4px 16px ${tm.accentAmber}40`,
                }}
              >
                <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
                  Update Request
                </span>
                <span style={{ fontSize: '14px', color: '#fff' }}>→</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Sheet Overlay ── */}
      <AnimatePresence>
        {activeSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.55)', zIndex: 50,
              }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: tm.bgSurface, borderRadius: '20px 20px 0 0',
                padding: '16px 16px 40px', zIndex: 51,
                maxHeight: '75%', overflowY: 'auto', scrollbarWidth: 'none',
              }}
            >
              {/* Drag handle */}
              <div style={{
                width: '36px', height: '4px', borderRadius: '2px',
                background: tm.borderSubtle, margin: '0 auto 16px',
              }} />

              {/* Sheet title */}
              <div style={{
                fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700,
                color: tm.textPrimary, marginBottom: '20px', paddingLeft: '4px',
              }}>
                {activeSheet.title}
              </div>

              {/* Sheet body */}
              {renderSheetBody()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
