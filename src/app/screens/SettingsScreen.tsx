import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Globe, Car, Plane, Shield, Sun, Moon, Check, X, Building2, Package, MapPin, Navigation } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import uberLogo from '../../assets/logos/uber-logo.webp';
import olaLogo from '../../assets/logos/white_ola_logo.png';
import makemtLogo from '../../assets/logos/makemt.png';
import { useNavigate } from 'react-router';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  color: string;
}

const INTEGRATION_LOGOS: Record<string, string> = {
  gcal:  'https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_2_2x.png',
  gmail: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png',
  uber:  uberLogo,
  ola:   olaLogo,
  mmt:   makemtLogo,
};

const INTEGRATIONS: Integration[] = [
  { id: 'gcal', name: 'Google Calendar', description: 'Read & write calendar events', icon: '📅', connected: true, color: '#ffffff' },
  { id: 'mmt', name: 'MakeMyTrip', description: 'Flight search & booking', icon: '✈️', connected: true, color: '#E8203D' },
  { id: 'uber', name: 'Uber for Business', description: 'Cab booking & tracking', icon: '⚫', connected: true, color: '#000000' },
  { id: 'ola', name: 'Ola Corporate', description: 'Cab booking alternative', icon: '🟢', connected: false, color: '#3CB371' },
  { id: 'gmail', name: 'Gmail', description: 'Booking confirmations & e-tickets', icon: '📧', connected: true, color: '#ffffff' },
  { id: 'concur', name: 'Concur Expense', description: 'Expense pre-approval & reports', icon: '💳', connected: false, color: '#009CDE' },
];

const PREFERENCE_OPTIONS: Record<string, string[]> = {
  // Flight
  'Flight class':      ['Economy', 'Business', 'First Class'],
  'Flight type':       ['Cheapest', 'Fastest', 'Best Value', 'No Preference'],
  'Seat preference':   ['Window', 'Aisle', 'Middle', 'No preference'],
  'Preferred airline': ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Akasa Air', 'No Preference'],
  // Cab
  'Cab type':          ['Sedan', 'SUV', 'Mini', 'Hatchback', 'No preference'],
  // Hotel
  'Room type':         ['Standard', 'Deluxe', 'Suite', 'Day use'],
  'Hotel stars':       ['5 Star', '4 Star', '3 Star', '2 Star', 'Any'],
  // Traveller
  'Meal preference':   ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'No preference'],
  // Policy
  'Travel policy': [
    'Economy — ₹10,000/trip',
    'Standard — ₹15,000/trip',
    'Premium — ₹25,000/trip',
    'Executive — ₹40,000/trip',
  ],
};

const PREFERENCE_ICONS: Record<string, string> = {
  'Flight class':      '✈️',
  'Flight type':       '✈️',
  'Seat preference':   '💺',
  'Preferred airline': '✈️',
  'Cab type':          '🚕',
  'Room type':         '🏨',
  'Hotel stars':       '🏨',
  'Meal preference':   '🍽️',
  'Travel policy':     '🛡️',
};

export function SettingsScreen() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [autoBook, setAutoBook] = useState(false);
  const [autoBookFlight, setAutoBookFlight] = useState(false);
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  // Preference values & picker state
  const [prefValues, setPrefValues] = useState<Record<string, string>>({
    'Flight class':      'Economy',
    'Flight type':       'Cheapest',
    'Seat preference':   'Window',
    'Preferred airline': 'No Preference',
    'Cab type':          'Sedan',
    'Room type':         'Day use',
    'Hotel stars':       'Any',
    'Meal preference':   'Vegetarian',
    'Travel policy':     'Standard — ₹15,000/trip',
  });
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [directOnly,   setDirectOnly]   = useState(false);
  const [cabinOnly,    setCabinOnly]    = useState(true);
  const [baseLocation,      setBaseLocation]      = useState('Kochi, Kerala');
  const [locationDraft,     setLocationDraft]     = useState('');
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [locating,          setLocating]          = useState(false);
  const [mapQuery,          setMapQuery]          = useState('');

  // Debounce map query so iframe only reloads after user stops typing
  useEffect(() => {
    if (!locationSheetOpen) return;
    const t = setTimeout(() => setMapQuery(locationDraft), 900);
    return () => clearTimeout(t);
  }, [locationDraft, locationSheetOpen]);

  function getCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
          const state = data.address?.state || '';
          const loc = [city, state].filter(Boolean).join(', ');
          if (loc) { setLocationDraft(loc); setMapQuery(loc); }
        } catch { /* silently ignore */ }
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  }

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  };

  function renderPrefSection(
    title: string,
    pickers: { label: string; icon: React.ElementType }[],
    toggles: { label: string; value: boolean; onToggle: () => void }[] = [],
  ) {
    const rows = pickers.length + toggles.length;
    let idx = 0;
    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', paddingLeft: '4px', letterSpacing: '0.08em' }}>
          {title}
        </div>
        <div style={{ background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, borderRadius: '14px', overflow: 'hidden' }}>
          {pickers.map(({ label, icon: Icon }) => {
            const isLast = idx++ === rows - 1;
            return (
              <motion.div
                key={label}
                whileTap={{ backgroundColor: tm.bgElevated }}
                onClick={() => setActivePicker(label)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', borderBottom: isLast ? 'none' : `1px solid ${tm.borderSubtle}`, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={15} color={tm.textSecondary} />
                  <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>{label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: tm.accentAmber, fontFamily: fonts.mono }}>{prefValues[label]}</span>
                  <ChevronRight size={13} color={tm.textSecondary} />
                </div>
              </motion.div>
            );
          })}
          {toggles.map(({ label, value, onToggle }) => {
            const isLast = idx++ === rows - 1;
            return (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', borderBottom: isLast ? 'none' : `1px solid ${tm.borderSubtle}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={15} color={tm.textSecondary} />
                  <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>{label}</span>
                </div>
                <button
                  onClick={onToggle}
                  style={{ width: '44px', height: '24px', borderRadius: '12px', background: value ? tm.accentTeal : tm.bgElevated, border: `1px solid ${value ? tm.accentTeal : tm.borderSubtle}`, cursor: 'pointer', position: 'relative', padding: 0, transition: 'all 0.2s', flexShrink: 0 }}
                >
                  <motion.div
                    animate={{ x: value ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

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
          borderBottom: `1px solid ${tm.borderSubtle}`,
        }}
      >
        <h1
          style={{
            fontSize: '20px',
            fontFamily: fonts.heading,
            fontWeight: 800,
            color: tm.textPrimary,
            margin: '0 0 4px',
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, margin: 0 }}>
          Integrations & Preferences
        </p>
      </div>

      {/* Profile */}
      <div style={{ padding: '16px' }}>
        <motion.div
          whileTap={{ scale: 0.98, opacity: 0.85 }}
          onClick={() => navigate('/profile')}
          style={{
            background: tm.bgSurface,
            border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
              Arjun Menon
            </div>
            <div style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              arjun.menon@company.com
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px',
                background: `${tm.accentTeal}20`,
                border: `1px solid ${tm.accentTeal}40`,
                borderRadius: '8px',
                padding: '2px 8px',
              }}
            >
              <span style={{ fontSize: '10px', color: tm.accentTeal, fontFamily: fonts.mono }}>
                Pro Plan · Active
              </span>
            </div>
          </div>
          <ChevronRight size={16} color={tm.textSecondary} style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </motion.div>

        {/* Integrations */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', paddingLeft: '4px', letterSpacing: '0.08em' }}>
            INTEGRATIONS
          </div>
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: tm.bgSurface,
                border: `1px solid ${tm.borderSubtle}`,
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: integration.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                {INTEGRATION_LOGOS[integration.id]
                  ? <img src={INTEGRATION_LOGOS[integration.id]} alt={integration.name} style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
                  : integration.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                  {integration.name}
                </div>
                <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  {integration.description}
                </div>
              </div>
              <button
                onClick={() => toggleIntegration(integration.id)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  background: integration.connected ? tm.accentTeal : tm.bgElevated,
                  border: `1px solid ${integration.connected ? tm.accentTeal : tm.borderSubtle}`,
                  cursor: 'pointer',
                  position: 'relative',
                  padding: 0,
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                <motion.div
                  animate={{ x: integration.connected ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: '2px',
                    left: '0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }}
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* ── Flight Preferences ── */}
        {renderPrefSection('FLIGHT PREFERENCES', [
          { label: 'Flight class',      icon: Plane },
          { label: 'Flight type',       icon: Plane },
          { label: 'Seat preference',   icon: Plane },
          { label: 'Preferred airline', icon: Plane },
        ], [
          { label: 'Direct flights only', value: directOnly, onToggle: () => setDirectOnly(v => !v) },
        ])}

        {/* ── Cab Preferences ── */}
        {renderPrefSection('CAB PREFERENCES', [
          { label: 'Cab type', icon: Car },
        ])}

        {/* ── Hotel Preferences ── */}
        {renderPrefSection('HOTEL PREFERENCES', [
          { label: 'Room type',   icon: Building2 },
          { label: 'Hotel stars', icon: Building2 },
        ])}

        {/* ── Traveller Defaults ── */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', paddingLeft: '4px', letterSpacing: '0.08em' }}>
            TRAVELLER DEFAULTS
          </div>
          <div style={{ background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, borderRadius: '14px', overflow: 'hidden' }}>
            {/* Base Location row */}
            <motion.div
              whileTap={{ backgroundColor: tm.bgElevated }}
              onClick={() => { setLocationDraft(baseLocation); setMapQuery(baseLocation); setLocationSheetOpen(true); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', borderBottom: `1px solid ${tm.borderSubtle}`, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={15} color={tm.textSecondary} />
                <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>Base Location</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: tm.accentAmber, fontFamily: fonts.mono }}>{baseLocation}</span>
                <ChevronRight size={13} color={tm.textSecondary} />
              </div>
            </motion.div>
            {/* Meal preference row */}
            <motion.div
              whileTap={{ backgroundColor: tm.bgElevated }}
              onClick={() => setActivePicker('Meal preference')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', borderBottom: `1px solid ${tm.borderSubtle}`, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={15} color={tm.textSecondary} />
                <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>Meal preference</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: tm.accentAmber, fontFamily: fonts.mono }}>{prefValues['Meal preference']}</span>
                <ChevronRight size={13} color={tm.textSecondary} />
              </div>
            </motion.div>
            {/* Cabin baggage toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={15} color={tm.textSecondary} />
                <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>Cabin baggage only</span>
              </div>
              <button
                onClick={() => setCabinOnly(v => !v)}
                style={{ width: '44px', height: '24px', borderRadius: '12px', background: cabinOnly ? tm.accentTeal : tm.bgElevated, border: `1px solid ${cabinOnly ? tm.accentTeal : tm.borderSubtle}`, cursor: 'pointer', position: 'relative', padding: 0, transition: 'all 0.2s', flexShrink: 0 }}
              >
                <motion.div
                  animate={{ x: cabinOnly ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── Travel Policy ── */}
        {renderPrefSection('TRAVEL POLICY', [
          { label: 'Travel policy', icon: Shield },
        ])}

        {/* Appearance */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', paddingLeft: '4px', letterSpacing: '0.08em' }}>
            APPEARANCE
          </div>
          <div style={{ background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: isDark ? '#1C2A3A' : '#FFF4E0',
                  border: `1px solid ${isDark ? '#2D3F52' : '#FFD580'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isDark
                    ? <Moon size={17} color={tm.accentAmber} />
                    : <Sun size={17} color={tm.accentAmber} />}
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                    {isDark ? 'Dark mode' : 'Light mode'}
                  </div>
                  <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                    {isDark ? 'Easy on the eyes at night' : 'Clean & bright interface'}
                  </div>
                </div>
              </div>

              {/* Animated toggle */}
              <button
                onClick={toggle}
                style={{
                  width: '52px', height: '28px', borderRadius: '14px', padding: 0,
                  background: isDark ? tm.accentAmber : tm.accentTeal,
                  border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                  transition: 'background 0.25s ease',
                }}
              >
                <motion.div
                  animate={{ x: isDark ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: '#fff', position: 'absolute', top: '3px', left: 0,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {isDark
                    ? <Moon size={11} color={tm.accentAmber} />
                    : <Sun size={11} color={tm.accentTeal} />}
                </motion.div>
              </button>
            </div>

            {/* Theme preview strip */}
            <div style={{
              borderTop: `1px solid ${tm.borderSubtle}`,
              padding: '10px 14px',
              display: 'flex', gap: '6px', alignItems: 'center',
            }}>
              <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginRight: '4px' }}>PREVIEW</span>
              {[
                { bg: isDark ? '#0D1117' : '#FAFBFC', label: 'BG' },
                { bg: isDark ? '#161B22' : '#F1F3F5', label: 'Surface' },
                { bg: isDark ? '#F5A623' : '#C2680A', label: 'Amber' },
                { bg: isDark ? '#00C9A7' : '#0B8C71', label: 'Teal' },
                { bg: isDark ? '#F0F6FC' : '#1A1F2E', label: 'Text' },
              ].map(({ bg, label }) => (
                <div
                  key={label}
                  title={label}
                  style={{
                    width: '20px', height: '20px', borderRadius: '6px',
                    background: bg, border: `1px solid ${tm.borderSubtle}`,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', paddingLeft: '4px', letterSpacing: '0.08em' }}>
            AGENT BEHAVIOUR
          </div>
          <div
            style={{
              background: tm.bgSurface,
              border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            {[
              { label: 'Smart reminders', desc: 'Wake-up & departure alerts', value: notifEnabled, toggle: () => setNotifEnabled(!notifEnabled) },
              { label: 'Auto pre-book cabs', desc: 'Book without asking (within policy)', value: autoBook, toggle: () => setAutoBook(!autoBook) },
              { label: 'Auto book flight tickets', desc: 'Confirm best fare instantly, no confirmation needed', value: autoBookFlight, toggle: () => setAutoBookFlight(!autoBookFlight) },
            ].map((item, i, arr) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 14px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                    {item.desc}
                  </div>
                </div>
                <button
                  onClick={item.toggle}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    background: item.value ? tm.accentAmber : tm.bgElevated,
                    border: `1px solid ${item.value ? tm.accentAmber : tm.borderSubtle}`,
                    cursor: 'pointer',
                    position: 'relative',
                    padding: 0,
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    animate={{ x: item.value ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '2px',
                      left: 0,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* App version */}
        <div style={{ textAlign: 'center', padding: '8px' }}>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            TripMind v1.0.0 · Built with ❤️ for business travellers
          </div>
        </div>
      </div>

      {/* ── Base Location bottom sheet ── */}
      <AnimatePresence>
        {locationSheetOpen && (
          <>
            <motion.div
              key="loc-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLocationSheetOpen(false)}
              style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
            />
            <motion.div
              key="loc-sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 51, background: tm.bgSurface, borderRadius: '20px 20px 0 0', border: `1px solid ${tm.borderSubtle}`, borderBottom: 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px' }}>
                <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: tm.borderSubtle }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px 14px', borderBottom: `1px solid ${tm.borderSubtle}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📍</span>
                  <div>
                    <div style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>Base Location</div>
                    <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>Your home city for trip planning</div>
                  </div>
                </div>
                <button
                  onClick={() => setLocationSheetOpen(false)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={13} color={tm.textSecondary} />
                </button>
              </div>
              <div style={{ padding: '18px 18px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`, borderRadius: '12px', padding: '0 14px', height: '48px' }}>
                  <MapPin size={15} color={tm.textSecondary} />
                  <input
                    autoFocus
                    value={locationDraft}
                    onChange={e => setLocationDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && locationDraft.trim()) { setBaseLocation(locationDraft.trim()); setLocationSheetOpen(false); } }}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', fontFamily: fonts.body, color: tm.textPrimary }}
                  />
                  {locationDraft && (
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setLocationDraft('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                      <X size={13} color={tm.textSecondary} />
                    </motion.button>
                  )}
                </div>
                {/* Map preview */}
                <AnimatePresence>
                  {mapQuery.trim() && (
                    <motion.div
                      key="map"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 140 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${tm.borderSubtle}`, flexShrink: 0, position: 'relative' }}
                    >
                      <iframe
                        key={mapQuery}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=11`}
                        style={{ width: '100%', height: '140px', border: 'none', display: 'block' }}
                        title="Location map"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      {/* Location label pill */}
                      <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={10} color="#fff" />
                        <span style={{ fontSize: '11px', color: '#fff', fontFamily: fonts.mono, fontWeight: 600 }}>{mapQuery}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Get Current Location button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={getCurrentLocation}
                  disabled={locating}
                  style={{ width: '100%', padding: '13px', borderRadius: '12px', border: `1px solid ${tm.borderSubtle}`, cursor: locating ? 'default' : 'pointer', background: tm.bgElevated, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: locating ? 0.7 : 1 }}
                >
                  {locating ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${tm.borderSubtle}`, borderTopColor: tm.accentTeal }} />
                  ) : (
                    <Navigation size={14} color={tm.accentTeal} />
                  )}
                  <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 600, color: tm.accentTeal }}>
                    {locating ? 'Detecting…' : 'Get Current Location'}
                  </span>
                </motion.button>

                {/* Save Location button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { if (locationDraft.trim()) { setBaseLocation(locationDraft.trim()); setLocationSheetOpen(false); } }}
                  disabled={!locationDraft.trim()}
                  style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', cursor: locationDraft.trim() ? 'pointer' : 'not-allowed', background: locationDraft.trim() ? tm.accentAmber : tm.bgElevated, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Check size={14} color={locationDraft.trim() ? '#fff' : tm.textSecondary} strokeWidth={3} />
                  <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: locationDraft.trim() ? '#fff' : tm.textSecondary }}>Save Location</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Preference picker bottom sheet ── */}
      <AnimatePresence>
        {activePicker && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePicker(null)}
              style={{
                position: 'absolute', inset: 0, zIndex: 50,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(2px)',
              }}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 51,
                background: tm.bgSurface,
                borderRadius: '20px 20px 0 0',
                border: `1px solid ${tm.borderSubtle}`,
                borderBottom: 'none',
                overflow: 'hidden',
              }}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px' }}>
                <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: tm.borderSubtle }} />
              </div>

              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 18px 14px',
                borderBottom: `1px solid ${tm.borderSubtle}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{PREFERENCE_ICONS[activePicker]}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
                      {activePicker}
                    </div>
                    <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                      Choose your preference
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActivePicker(null)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={13} color={tm.textSecondary} />
                </button>
              </div>

              {/* Options */}
              <div style={{ padding: '8px 14px 28px' }}>
                {PREFERENCE_OPTIONS[activePicker].map((option, i) => {
                  const isSelected = prefValues[activePicker] === option;
                  return (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setPrefValues(v => ({ ...v, [activePicker]: option }));
                        setTimeout(() => setActivePicker(null), 180);
                      }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '13px 14px', marginBottom: '6px',
                        borderRadius: '12px', cursor: 'pointer', border: 'none',
                        background: isSelected ? `${tm.accentAmber}14` : tm.bgElevated,
                        outline: isSelected ? `1.5px solid ${tm.accentAmber}50` : `1px solid ${tm.borderSubtle}`,
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{
                        fontSize: '13px',
                        fontFamily: fonts.body,
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? tm.accentAmber : tm.textPrimary,
                      }}>
                        {option}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: tm.accentAmber,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Check size={11} color="#fff" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}