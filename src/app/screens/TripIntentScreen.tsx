import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Sparkles, MicOff, SendHorizonal,
  MapPin, Calendar, Users, Plane, Car, Building2, Package,
  ChevronRight, ChevronLeft, Check, User, X,
} from 'lucide-react';
import { tm, fonts } from '../constants/colors';

// ─── Constants ────────────────────────────────────────────────────────────────

const EXAMPLE_TEXT = "I have a meeting in Mumbai on the 15th. Morning flight, back same evening.";

const DETECTED_CHIPS = [
  { id: 'dest',   label: '📍 Mumbai',         delay: 0   },
  { id: 'date',   label: '🗓 Apr 15',          delay: 200 },
  { id: 'flight', label: '🌅 Morning Flight',  delay: 400 },
  { id: 'return', label: '↩ Same Day Return',  delay: 600 },
];

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

interface PassengerInfo { name: string; dob: string; passport: string; }

interface TripParams {
  origin: string; destination: string;
  outboundDate: string; returnDate: string;
  passengers: string; passengerName: string;
  additionalPassengers: PassengerInfo[];
  luggageCabinOnly: boolean;
  flightClass: string; flightType: string;
  seatPreference: string; directOnly: boolean; preferredAirline: string;
  cabPickup: string; cabDrop: string;
  hotelCheckIn: string; hotelCheckOut: string;
  roomType: string; hotelStars: string;
}

type ActiveSheet =
  | { kind: 'picker';    field: keyof TripParams; title: string; options: string[] }
  | { kind: 'text';      field: keyof TripParams; title: string; placeholder?: string; note?: string }
  | { kind: 'calendar';  field: keyof TripParams; title: string }
  | { kind: 'passenger'; index: number; title: string };

const DEFAULT_PARAMS: TripParams = {
  origin: 'Kochi (COK)', destination: 'Mumbai (BOM)',
  outboundDate: 'Apr 15, 2026', returnDate: 'Apr 15, 2026',
  passengers: '1', passengerName: 'Arjun Menon',
  additionalPassengers: [], luggageCabinOnly: true,
  flightClass: 'Economy', flightType: 'Cheapest',
  seatPreference: 'Window', directOnly: false, preferredAirline: 'No Preference',
  cabPickup: 'BOM T2 Arrivals', cabDrop: 'BKC Office District',
  hotelCheckIn: 'Apr 15, 2026', hotelCheckOut: 'Apr 15, 2026',
  roomType: 'Day use', hotelStars: 'Any',
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function parseDate(str: string) {
  const m = str.match(/^(\w{3})\s+(\d{1,2}),\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTH_SHORT.indexOf(m[1]);
  if (month < 0) return null;
  return { year: parseInt(m[3]), month, day: parseInt(m[2]) };
}

function formatDate(year: number, month: number, day: number) {
  return `${MONTH_SHORT[month]} ${day}, ${year}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ─── CalendarPicker ───────────────────────────────────────────────────────────

function CalendarPicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <motion.button whileTap={{ scale: 0.85 }} onClick={prevMonth}
          style={{ width: '32px', height: '32px', borderRadius: '50%', background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={15} color={tm.textPrimary} />
        </motion.button>
        <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <motion.button whileTap={{ scale: 0.85 }} onClick={nextMonth}
          style={{ width: '32px', height: '32px', borderRadius: '50%', background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={15} color={tm.textPrimary} />
        </motion.button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} style={{ height: '38px' }} />;
          const isSel = parsed?.year === viewYear && parsed?.month === viewMonth && parsed?.day === day;
          return (
            <motion.button key={i} whileTap={{ scale: 0.85 }}
              onClick={() => onChange(formatDate(viewYear, viewMonth, day))}
              style={{
                height: '38px', width: '38px', margin: '0 auto', borderRadius: '50%',
                background: isSel ? tm.accentAmber : 'transparent', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontFamily: fonts.mono,
                color: isSel ? '#fff' : tm.textPrimary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: isSel ? 700 : 400,
              }}
            >{day}</motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// ─── Assumption chips derived from saved prefs ───────────────────────────────

function buildAssumptionChips(p: TripParams): { label: string }[] {
  return [
    { label: `✈️ ${p.flightClass}` },
    { label: `👤 ${p.passengers === '1' ? 'Solo traveller' : `${p.passengers} passengers`}` },
    { label: p.luggageCabinOnly ? '🧳 Cabin baggage only' : '🧳 Check-in baggage' },
    { label: `💺 ${p.seatPreference} seat` },
  ];
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function TripIntentScreen() {
  const navigate = useNavigate();
  const [inputText, setInputText]         = useState('');
  const [committedText, setCommittedText] = useState('');
  const [visibleChips, setVisibleChips]   = useState<string[]>([]);
  const [removedChips, setRemovedChips]   = useState<string[]>([]);
  const [isRecording, setIsRecording]     = useState(false);
  const [voiceStatus, setVoiceStatus]     = useState<'idle' | 'listening' | 'done'>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // ── Preferences sheet state ────────────────────────────────────────────────
  const [showPrefs, setShowPrefs]         = useState(false);
  const [prefParams, setPrefParams]       = useState<TripParams>(DEFAULT_PARAMS);
  const [savedParams, setSavedParams]     = useState<TripParams>(DEFAULT_PARAMS);
  const [prefSheet, setPrefSheet]         = useState<ActiveSheet | null>(null);

  // Chips derive from committedText only
  useEffect(() => {
    const words = committedText.toLowerCase();
    const chips: string[] = [];
    if (words.includes('mumbai') || words.includes('bom'))                                                          chips.push('dest');
    if (words.includes('15') || words.includes('april'))                                                            chips.push('date');
    if (words.includes('morning') || words.includes('early'))                                                       chips.push('flight');
    if (words.includes('return') || words.includes('back') || words.includes('evening') || words.includes('same')) chips.push('return');
    setVisibleChips(chips.filter(c => !removedChips.includes(c)));
  }, [committedText, removedChips]);

  const isDirty   = inputText.trim() !== committedText.trim();
  const canSubmit = visibleChips.includes('dest') && visibleChips.includes('date');

  function commitText() {
    if (!inputText.trim()) return;
    setCommittedText(inputText);
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
      setInputText(EXAMPLE_TEXT);
      setCommittedText(EXAMPLE_TEXT);
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
      const updated = inputText ? `${inputText} ${transcript}` : transcript;
      setInputText(updated);
      setCommittedText(updated);
    };
    rec.onend    = () => { setIsRecording(false); setVoiceStatus('done'); };
    rec.onerror  = () => { setIsRecording(false); setVoiceStatus('idle'); };
    recognitionRef.current = rec;
    rec.start();
  }

  const handleSubmit = () => {
    if (canSubmit || inputText.trim()) navigate('/agent-auto', { state: { inputText } });
  };

  const statusLabel =
    voiceStatus === 'listening' ? 'Listening...' :
    voiceStatus === 'done'      ? 'Tap to speak again' :
                                  'Tap to speak';

  // ── Preferences helpers ────────────────────────────────────────────────────

  function openPrefs() {
    setPrefParams({ ...savedParams });
    setPrefSheet(null);
    setShowPrefs(true);
  }

  function savePrefs() {
    setSavedParams({ ...prefParams });
    setShowPrefs(false);
    setPrefSheet(null);
  }

  function cancelPrefs() {
    setShowPrefs(false);
    setPrefSheet(null);
  }

  function updatePref<K extends keyof TripParams>(key: K, val: TripParams[K]) {
    setPrefParams(prev => ({ ...prev, [key]: val }));
  }

  function handlePrefPassengersChange(val: string) {
    const newCount = val === '5+' ? 5 : parseInt(val) || 1;
    const addCount = Math.max(0, newCount - 1);
    setPrefParams(prev => ({
      ...prev,
      passengers: val,
      additionalPassengers: Array.from(
        { length: addCount },
        (_, i) => prev.additionalPassengers[i] ?? { name: '', dob: '', passport: '' },
      ),
    }));
  }

  const prefPassengerCount   = prefParams.passengers === '5+' ? 5 : parseInt(prefParams.passengers) || 1;
  const prefAdditionalCount  = Math.max(0, prefPassengerCount - 1);

  // ── Preferences sub-sheet renderer ────────────────────────────────────────

  function renderPrefSheetBody() {
    if (!prefSheet) return null;

    if (prefSheet.kind === 'picker') {
      const currentVal = prefParams[prefSheet.field] as string;
      return (
        <div>
          {prefSheet.options.map((opt, i) => (
            <motion.div key={opt} whileTap={{ opacity: 0.6 }}
              onClick={() => {
                if (prefSheet.field === 'passengers') handlePrefPassengersChange(opt);
                else updatePref(prefSheet.field, opt as TripParams[typeof prefSheet.field]);
                setPrefSheet(null);
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 4px', cursor: 'pointer',
                borderBottom: i < prefSheet.options.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
              }}
            >
              <span style={{ fontSize: '14px', color: tm.textPrimary, fontFamily: fonts.body }}>{opt}</span>
              {currentVal === opt && <Check size={16} color={tm.accentTeal} />}
            </motion.div>
          ))}
        </div>
      );
    }

    if (prefSheet.kind === 'text') {
      const val = prefParams[prefSheet.field] as string;
      return (
        <div>
          <input
            autoFocus
            value={val}
            onChange={e => updatePref(prefSheet.field, e.target.value as TripParams[typeof prefSheet.field])}
            placeholder={prefSheet.placeholder ?? '—'}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '12px', padding: '14px 16px',
              fontSize: '14px', fontFamily: fonts.body,
              color: tm.textPrimary, outline: 'none',
            }}
          />
          {prefSheet.note && (
            <p style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '10px', marginBottom: 0, paddingLeft: '4px' }}>
              {prefSheet.note}
            </p>
          )}
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setPrefSheet(null)}
            style={{ width: '100%', marginTop: '16px', background: tm.accentAmber, border: 'none', borderRadius: '12px', padding: '13px', cursor: 'pointer', fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
            Done
          </motion.button>
        </div>
      );
    }

    if (prefSheet.kind === 'calendar') {
      return (
        <CalendarPicker
          value={prefParams[prefSheet.field] as string}
          onChange={val => {
            updatePref(prefSheet.field, val as TripParams[typeof prefSheet.field]);
            setPrefSheet(null);
          }}
        />
      );
    }

    if (prefSheet.kind === 'passenger') {
      const { index } = prefSheet;
      const pax = prefParams.additionalPassengers[index] ?? { name: '', dob: '', passport: '' };
      function updatePax(field: keyof PassengerInfo, value: string) {
        const updated = [...prefParams.additionalPassengers];
        updated[index] = { ...pax, [field]: value };
        updatePref('additionalPassengers', updated);
      }
      const fieldStyle: React.CSSProperties = {
        width: '100%', boxSizing: 'border-box',
        background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
        borderRadius: '12px', padding: '13px 16px',
        fontSize: '14px', fontFamily: fonts.body, color: tm.textPrimary, outline: 'none',
      };
      const labelStyle: React.CSSProperties = {
        fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono,
        fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px', paddingLeft: '2px',
      };
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={labelStyle}>Full Name</div>
            <input autoFocus value={pax.name} onChange={e => updatePax('name', e.target.value)} placeholder="As it appears on passport" style={fieldStyle} />
            <p style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '6px 0 0 2px' }}>Must match passport exactly</p>
          </div>
          <div>
            <div style={labelStyle}>Date of Birth</div>
            <input value={pax.dob} onChange={e => updatePax('dob', e.target.value)} placeholder="e.g. Mar 14, 1992" style={fieldStyle} />
          </div>
          <div>
            <div style={labelStyle}>Passport Number</div>
            <input value={pax.passport} onChange={e => updatePax('passport', e.target.value)} placeholder="e.g. Z8831042" style={{ ...fieldStyle, fontFamily: fonts.mono, letterSpacing: '0.04em' }} />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setPrefSheet(null)}
            style={{ width: '100%', marginTop: '4px', background: tm.accentAmber, border: 'none', borderRadius: '12px', padding: '13px', cursor: 'pointer', fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
            Done
          </motion.button>
        </div>
      );
    }

    return null;
  }

  // ── Section helpers (inside prefs sheet) ──────────────────────────────────

  function PrefSectionLabel({ label }: { label: string }) {
    return (
      <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', paddingLeft: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
        {label}
      </div>
    );
  }

  function PrefCard({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
        {children}
      </div>
    );
  }

  function RowDivider() {
    return <div style={{ height: '1px', background: tm.borderSubtle, marginLeft: '44px' }} />;
  }

  function ChevronRow({ icon: Icon, label, value, onPress, placeholder = '—' }: { icon: React.ElementType; label: string; value: string; onPress: () => void; placeholder?: string }) {
    return (
      <motion.div whileTap={{ opacity: 0.7 }} onClick={onPress}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Icon size={15} color={tm.textSecondary} />
          <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <span style={{ fontSize: '12px', color: value ? tm.accentAmber : tm.textSecondary, fontFamily: fonts.mono, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
            {value || placeholder}
          </span>
          <ChevronRight size={13} color={tm.textSecondary} style={{ flexShrink: 0 }} />
        </div>
      </motion.div>
    );
  }

  function ToggleRow({ icon: Icon, label, field }: { icon: React.ElementType; label: string; field: keyof TripParams }) {
    const on = prefParams[field] as boolean;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon size={15} color={tm.textSecondary} />
          <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>{label}</span>
        </div>
        <button onClick={() => updatePref(field, !on as TripParams[typeof field])}
          style={{ width: '44px', height: '24px', borderRadius: '12px', background: on ? tm.accentTeal : tm.bgElevated, border: `1px solid ${on ? tm.accentTeal : tm.borderSubtle}`, cursor: 'pointer', position: 'relative', padding: 0, transition: 'background 0.2s', flexShrink: 0 }}>
          <motion.div animate={{ x: on ? 20 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
        </button>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: tm.bgPrimary, flex: 1, display: 'flex', flexDirection: 'column', fontFamily: fonts.body, position: 'relative', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${tm.borderSubtle}`, flexShrink: 0 }}>
        <button onClick={() => navigate('/')}
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={16} color={tm.textPrimary} />
        </button>
        <h1 style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary, margin: 0 }}>
          New Trip
        </h1>
        <div style={{ width: '36px' }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* ── Voice section ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '19px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, margin: 0 }}>
              Tell me about your trip
            </h2>
          </div>

          {/* Pulsing mic button */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence>
              {isRecording && [1, 2, 3].map(i => (
                <motion.div key={i} initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1 + i * 0.4, opacity: 0 }} exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.3, ease: 'easeOut' }}
                  style={{ position: 'absolute', width: '72px', height: '72px', borderRadius: '50%', background: tm.accentAmber, pointerEvents: 'none' }} />
              ))}
            </AnimatePresence>
            {!isRecording && (
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.1, 0.25] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                style={{ position: 'absolute', width: '72px', height: '72px', borderRadius: '50%', background: tm.accentAmber, pointerEvents: 'none' }} />
            )}
            <motion.button whileTap={{ scale: 0.93 }} onClick={toggleRecording}
              animate={isRecording ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={isRecording ? { repeat: Infinity, duration: 0.8 } : {}}
              style={{
                width: '68px', height: '68px', borderRadius: '50%',
                background: isRecording ? `linear-gradient(135deg, ${tm.accentRed}, #c0392b)` : `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isRecording ? `0 6px 28px ${tm.accentRed}60` : `0 6px 28px ${tm.accentAmber}60`,
                position: 'relative', zIndex: 1, transition: 'background 0.3s ease, box-shadow 0.3s ease',
              }}>
              {isRecording ? <MicOff size={28} color="#fff" /> : <Sparkles size={28} color="#fff" />}
            </motion.button>
          </div>

          {/* Status label */}
          <AnimatePresence mode="wait">
            <motion.p key={voiceStatus} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
              style={{ fontSize: '12px', fontFamily: fonts.mono, margin: 0, color: isRecording ? tm.accentAmber : tm.textSecondary, fontWeight: isRecording ? 600 : 400 }}>
              {statusLabel}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── Divider ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>or type below</span>
          <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
        </div>

        {/* ── Text input ── */}
        <div style={{ background: tm.bgSurface, border: `1px solid ${inputText ? `${tm.accentAmber}50` : tm.borderSubtle}`, borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s ease' }}>
          <textarea value={inputText} onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitText(); } }}
            placeholder={EXAMPLE_TEXT}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', color: tm.textPrimary, fontFamily: fonts.body, resize: 'none', lineHeight: 1.6, minHeight: '80px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            {!inputText && (
              <button onClick={() => { setInputText(EXAMPLE_TEXT); setCommittedText(EXAMPLE_TEXT); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontSize: '12px', color: tm.accentAmber, fontFamily: fonts.mono }}>
                ↑ Use example
              </button>
            )}
            <div style={{ flex: 1 }} />
            <AnimatePresence>
              {isDirty && (
                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 26 }} whileTap={{ scale: 0.93 }}
                  onClick={commitText} onKeyDown={e => e.key === 'Enter' && commitText()}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: tm.accentAmber, border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>
                  <SendHorizonal size={13} color="#ffffff" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Chips ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Detected + Assumptions */}
          <AnimatePresence>
            {committedText.trim() ? (
              <motion.div key="chips" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Detected */}
                <div>
                  <p style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600, color: tm.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Detected</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <AnimatePresence>
                      {DETECTED_CHIPS.filter(c => visibleChips.includes(c.id)).map(chip => (
                        <motion.div key={chip.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          style={{ display: 'inline-flex', alignItems: 'center', background: `${tm.accentAmber}20`, border: `1px solid ${tm.accentAmber}50`, borderRadius: '20px', padding: '6px 12px' }}>
                          <span style={{ fontSize: '12px', color: tm.accentAmber, fontFamily: fonts.mono, fontWeight: 600 }}>{chip.label}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {visibleChips.length === 0 && (
                      <p style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, margin: 0 }}>No details detected yet</p>
                    )}
                  </div>
                </div>

                {/* Missing Details */}
                <div>
                  <p style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600, color: tm.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Missing Details</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {buildAssumptionChips(savedParams).map((chip, i) => (
                      <motion.div key={chip.label} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.05 }}
                        style={{ display: 'inline-flex', alignItems: 'center', background: `${tm.accentRed}12`, border: `1px solid ${tm.accentRed}35`, borderRadius: '20px', padding: '6px 12px' }}>
                        <span style={{ fontSize: '12px', color: tm.accentRed, fontFamily: fonts.mono }}>{chip.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, margin: 0, lineHeight: 1.7 }}>
                Detected & missing details<br />will appear here...
              </motion.p>
            )}
          </AnimatePresence>

        </div>

        {/* Spacer — only when chips are visible to push CTAs down */}
        {committedText.trim() && <div style={{ flex: 1 }} />}

        {/* ── CTAs — only visible after input is entered ── */}
        <AnimatePresence>
          {committedText.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                style={{
                  width: '100%',
                  background: tm.accentAmber,
                  border: `1px solid ${tm.accentAmber}`,
                  borderRadius: '16px', padding: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 18px ${tm.accentAmber}40`,
                }}>
                <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>Looks Good, Let's Plan</span>
                <span style={{ fontSize: '15px', color: '#ffffff' }}>→</span>
              </motion.button>

              <motion.button whileTap={{ scale: 0.97 }} onClick={openPrefs}
                style={{
                  width: '100%', marginTop: '10px', background: 'transparent',
                  border: `1px solid ${tm.borderSubtle}`, borderRadius: '16px', padding: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 600, color: tm.textSecondary }}>View Preferences</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Preferences Overlay ── */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}
          >
            {/* Backdrop */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} onClick={cancelPrefs} />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: tm.bgPrimary, borderRadius: '22px 22px 0 0',
                maxHeight: '92%', display: 'flex', flexDirection: 'column',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
              }}
            >
              {/* Sheet header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 16px 12px', borderBottom: `1px solid ${tm.borderSubtle}`, flexShrink: 0,
              }}>
                <div>
                  <div style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>Preferences</div>
                  <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '2px' }}>Edit your trip defaults</div>
                </div>
                <motion.button whileTap={{ scale: 0.88 }} onClick={cancelPrefs}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} color={tm.textSecondary} />
                </motion.button>
              </div>

              {/* Scrollable form */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 8px', scrollbarWidth: 'none' }}>

                {/* Trip Details */}
                <PrefSectionLabel label="Trip Details" />
                <PrefCard>
                  <ChevronRow icon={MapPin} label="Origin" value={prefParams.origin}
                    onPress={() => setPrefSheet({ kind: 'text', field: 'origin', title: 'Origin', placeholder: 'City or airport code' })} />
                  <RowDivider />
                  <ChevronRow icon={MapPin} label="Destination" value={prefParams.destination} placeholder="City or airport code"
                    onPress={() => setPrefSheet({ kind: 'text', field: 'destination', title: 'Destination', placeholder: 'City or airport code' })} />
                  <RowDivider />
                  <ChevronRow icon={Calendar} label="Outbound Date" value={prefParams.outboundDate} placeholder="Select date"
                    onPress={() => setPrefSheet({ kind: 'calendar', field: 'outboundDate', title: 'Outbound Date' })} />
                  <RowDivider />
                  <ChevronRow icon={Calendar} label="Return Date" value={prefParams.returnDate} placeholder="Select date"
                    onPress={() => setPrefSheet({ kind: 'calendar', field: 'returnDate', title: 'Return Date' })} />
                </PrefCard>

                {/* Traveller Info */}
                <PrefSectionLabel label="Traveller Info" />
                <PrefCard>
                  <ChevronRow icon={Users} label="Passengers" value={prefParams.passengers}
                    onPress={() => setPrefSheet({ kind: 'picker', field: 'passengers', title: 'Number of Passengers', options: PICKER_OPTIONS.passengers })} />
                  <RowDivider />
                  <ChevronRow icon={User} label="Primary Passenger" value={prefParams.passengerName} placeholder="Full name"
                    onPress={() => setPrefSheet({ kind: 'text', field: 'passengerName', title: 'Primary Passenger Name', placeholder: 'Full name as on passport', note: 'Must match passport exactly' })} />
                  {Array.from({ length: prefAdditionalCount }, (_, i) => (
                    <div key={i}>
                      <RowDivider />
                      <motion.div whileTap={{ opacity: 0.7 }} onClick={() => setPrefSheet({ kind: 'passenger', index: i, title: `Passenger ${i + 2} Details` })}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                          <User size={15} color={tm.textSecondary} />
                          <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>Passenger {i + 2}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', color: prefParams.additionalPassengers[i]?.name ? tm.accentAmber : tm.textSecondary, fontFamily: fonts.mono, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {prefParams.additionalPassengers[i]?.name || 'Add details'}
                          </span>
                          <ChevronRight size={13} color={tm.textSecondary} />
                        </div>
                      </motion.div>
                    </div>
                  ))}
                  <RowDivider />
                  <ToggleRow icon={Package} label="Cabin baggage only" field="luggageCabinOnly" />
                </PrefCard>

                {/* Flight Preferences */}
                <PrefSectionLabel label="Flight Preferences" />
                <PrefCard>
                  <ChevronRow icon={Plane} label="Class" value={prefParams.flightClass}
                    onPress={() => setPrefSheet({ kind: 'picker', field: 'flightClass', title: 'Flight Class', options: PICKER_OPTIONS.flightClass })} />
                  <RowDivider />
                  <ChevronRow icon={Plane} label="Flight Type" value={prefParams.flightType}
                    onPress={() => setPrefSheet({ kind: 'picker', field: 'flightType', title: 'Flight Type', options: PICKER_OPTIONS.flightType })} />
                  <RowDivider />
                  <ChevronRow icon={Plane} label="Seat Preference" value={prefParams.seatPreference}
                    onPress={() => setPrefSheet({ kind: 'picker', field: 'seatPreference', title: 'Seat Preference', options: PICKER_OPTIONS.seatPreference })} />
                  <RowDivider />
                  <ChevronRow icon={Plane} label="Preferred Airline" value={prefParams.preferredAirline}
                    onPress={() => setPrefSheet({ kind: 'picker', field: 'preferredAirline', title: 'Preferred Airline', options: PICKER_OPTIONS.preferredAirline })} />
                  <RowDivider />
                  <ToggleRow icon={Plane} label="Direct flights only" field="directOnly" />
                </PrefCard>

                {/* Cab Info */}
                <PrefSectionLabel label="Cab Info" />
                <PrefCard>
                  <ChevronRow icon={Car} label="Pickup Address" value={prefParams.cabPickup} placeholder="e.g. BOM T2 Arrivals"
                    onPress={() => setPrefSheet({ kind: 'text', field: 'cabPickup', title: 'Pickup Address', placeholder: 'e.g. BOM T2 Arrivals' })} />
                  <RowDivider />
                  <ChevronRow icon={Car} label="Drop-off Address" value={prefParams.cabDrop} placeholder="e.g. BKC, Mumbai"
                    onPress={() => setPrefSheet({ kind: 'text', field: 'cabDrop', title: 'Drop-off Address', placeholder: 'e.g. BKC, Mumbai' })} />
                </PrefCard>

                {/* Hotel Preferences */}
                <PrefSectionLabel label="Hotel Preferences" />
                <PrefCard>
                  <ChevronRow icon={Building2} label="Check-in" value={prefParams.hotelCheckIn} placeholder="Select date"
                    onPress={() => setPrefSheet({ kind: 'calendar', field: 'hotelCheckIn', title: 'Hotel Check-in' })} />
                  <RowDivider />
                  <ChevronRow icon={Building2} label="Check-out" value={prefParams.hotelCheckOut} placeholder="Select date"
                    onPress={() => setPrefSheet({ kind: 'calendar', field: 'hotelCheckOut', title: 'Hotel Check-out' })} />
                  <RowDivider />
                  <ChevronRow icon={Building2} label="Room Type" value={prefParams.roomType}
                    onPress={() => setPrefSheet({ kind: 'picker', field: 'roomType', title: 'Room Type', options: PICKER_OPTIONS.roomType })} />
                  <RowDivider />
                  <ChevronRow icon={Building2} label="Hotel Type" value={prefParams.hotelStars}
                    onPress={() => setPrefSheet({ kind: 'picker', field: 'hotelStars', title: 'Hotel Type', options: PICKER_OPTIONS.hotelStars })} />
                </PrefCard>

              </div>

              {/* Save / Cancel footer */}
              <div style={{ padding: '12px 16px 24px', borderTop: `1px solid ${tm.borderSubtle}`, display: 'flex', gap: '10px', flexShrink: 0 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={cancelPrefs}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textSecondary }}>
                  Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={savePrefs}
                  style={{ flex: 2, padding: '14px', borderRadius: '14px', background: tm.accentAmber, border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff', boxShadow: `0 4px 14px ${tm.accentAmber}40` }}>
                  Save Preferences
                </motion.button>
              </div>

              {/* Sub-sheet (picker / text / calendar / passenger) */}
              <AnimatePresence>
                {prefSheet && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={() => setPrefSheet(null)} />
                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                      style={{ position: 'relative', background: tm.bgSurface, borderRadius: '20px 20px 0 0', padding: '20px 16px 32px', maxHeight: '70%', overflowY: 'auto', scrollbarWidth: 'none' }}>
                      {/* Sub-sheet header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                          {prefSheet.kind !== 'passenger' ? prefSheet.title : prefSheet.title}
                        </span>
                        <motion.button whileTap={{ scale: 0.88 }} onClick={() => setPrefSheet(null)}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X size={13} color={tm.textSecondary} />
                        </motion.button>
                      </div>
                      {renderPrefSheetBody()}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
