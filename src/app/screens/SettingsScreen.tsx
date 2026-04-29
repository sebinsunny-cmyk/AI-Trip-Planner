import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Globe, Car, Plane, Shield, Sun, Moon, Check, X, Building2, Package, MapPin, LocateFixed } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router';
import { INTEGRATION_SERVICES, isIntegrationConnected } from '../data/integrations';


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

const PREFERENCE_ICONS: Record<string, React.ReactNode> = {
  'Flight class':      <Plane    size={20} />,
  'Flight type':       <Plane    size={20} />,
  'Seat preference':   <Plane    size={20} />,
  'Preferred airline': <Plane    size={20} />,
  'Cab type':          <Car      size={20} />,
  'Room type':         <Building2 size={20} />,
  'Hotel stars':       <Building2 size={20} />,
  'Meal preference':   <Package  size={20} />,
  'Travel policy':     <Shield   size={20} />,
};

export function SettingsScreen() {
  const [, forceUpdate] = useState(0);
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
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [locating,          setLocating]          = useState(false);
  const [locFlat,           setLocFlat]           = useState('');
  const [locLandmark,       setLocLandmark]       = useState('');
  const [locLabel,          setLocLabel]          = useState<'Home' | 'Work' | 'Other'>('Home');

  function getCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => setLocating(false),
      () => setLocating(false),
      { timeout: 8000 },
    );
  }


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
          {INTEGRATION_SERVICES.map((svc, i) => {
            const connected = isIntegrationConnected(svc.id);
            const isGoogle = svc.oauthStyle === 'google';
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/settings/integrations/${svc.id}`)}
                style={{
                  background: tm.bgSurface,
                  border: `1px solid ${tm.borderSubtle}`,
                  borderRadius: '14px',
                  padding: '12px 14px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                  background: svc.brand.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${tm.borderSubtle}`,
                  overflow: 'hidden',
                }}>
                  {svc.logoUrl
                    ? <img src={svc.logoUrl} alt={svc.name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                    : svc.logo
                      ? <img src={svc.logo} alt={svc.name} style={{ width: 24, height: 24, objectFit: 'contain', filter: svc.logoFilter ?? 'none' }} />
                      : svc.logoWordmark
                        ? <span style={{ fontSize: svc.logoWordmark.fontSize, fontWeight: svc.logoWordmark.fontWeight, color: svc.logoWordmark.color, letterSpacing: svc.logoWordmark.letterSpacing, fontFamily: 'sans-serif', lineHeight: 1 }}>{svc.logoWordmark.text}</span>
                        : null}
                </div>
                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                    {svc.name}
                  </div>
                  <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '2px' }}>
                    {svc.description}
                  </div>
                </div>
                {/* Status pill */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: connected ? `${tm.accentTeal}15` : tm.bgElevated,
                  border: `1px solid ${connected ? `${tm.accentTeal}40` : tm.borderSubtle}`,
                  borderRadius: '20px', padding: '3px 8px', flexShrink: 0,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: connected ? tm.accentTeal : tm.textSecondary }} />
                  <span style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600, color: connected ? tm.accentTeal : tm.textSecondary }}>
                    {connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
                <ChevronRight size={14} color={tm.textSecondary} style={{ flexShrink: 0 }} />
              </motion.div>
            );
          })}
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
              onClick={() => setLocationSheetOpen(true)}
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
          <motion.div
            key="loc-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 50,
              background: tm.bgPrimary,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* ── Map section ── */}
            <div style={{ position: 'relative', height: '44%', flexShrink: 0 }}>

              {/* Map iframe */}
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(baseLocation)}&output=embed&z=13`}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="Location map"
                loading="lazy"
              />

              {/* Dropped pin — centered */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none', zIndex: 2,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <motion.div
                  initial={{ y: -24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
                  }}>
                    <MapPin size={18} color="#fff" />
                  </div>
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `9px solid #e8890f`,
                  }} />
                  <div style={{
                    width: 10, height: 4, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.22)',
                    marginTop: '1px', filter: 'blur(2px)',
                  }} />
                </motion.div>
              </div>

              {/* Top overlay: close button */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3,
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.38), transparent)',
              }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLocationSheetOpen(false)}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.92)', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
                  }}
                >
                  <X size={15} color="#0D1117" />
                </motion.button>
                <div style={{
                  background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(8px)',
                  borderRadius: '20px', padding: '6px 14px',
                }}>
                  <span style={{ fontSize: '12px', fontFamily: fonts.mono, fontWeight: 600, color: '#fff' }}>
                    Base Location
                  </span>
                </div>
              </div>

              {/* Use current location — floating just above bottom sheet */}
              <div style={{
                position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 3,
                display: 'flex', justifyContent: 'center',
              }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={getCurrentLocation}
                  disabled={locating}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '24px',
                    background: 'rgba(255,255,255,0.95)', border: 'none',
                    cursor: locating ? 'default' : 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    opacity: locating ? 0.75 : 1,
                  }}
                >
                  <LocateFixed size={15} color={locating ? '#999' : '#00C9A7'} />
                  <span style={{ fontSize: '13px', fontFamily: fonts.body, fontWeight: 600, color: locating ? '#999' : '#111' }}>
                    {locating ? 'Getting location…' : 'Use current location'}
                  </span>
                </motion.button>
              </div>

            </div>

            {/* ── Bottom sheet ── */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.1 }}
              style={{
                flex: 1,
                background: tm.bgPrimary,
                borderRadius: '20px 20px 0 0',
                marginTop: '-18px',
                zIndex: 4,
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 -6px 24px rgba(0,0,0,0.18)',
                overflow: 'hidden',
              }}
            >
              {/* Handle */}
              <div style={{ paddingTop: '10px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: tm.borderSubtle }} />
              </div>

              {/* Scrollable body */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '14px 20px 8px',
                scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: '12px',
              }}>

                {/* Nova hint */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                  }}>🤖</div>
                  <span style={{ fontSize: '12px', fontFamily: fonts.mono, color: tm.textSecondary, lineHeight: 1.5 }}>
                    Which city do you usually fly out from?
                  </span>
                </div>

                {/* Additional details */}
                <div style={{
                  fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
                  fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const,
                  marginTop: '8px',
                }}>
                  Additional details
                </div>

                {/* Flat / Floor */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
                  borderRadius: '14px', padding: '0 14px', height: '48px',
                }}>
                  <input
                    type="text"
                    value={locFlat}
                    onChange={e => setLocFlat(e.target.value)}
                    placeholder="Flat / Floor / Building (optional)"
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      fontSize: '14px', fontFamily: fonts.body, color: tm.textPrimary,
                    }}
                  />
                </div>

                {/* Landmark */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
                  borderRadius: '14px', padding: '0 14px', height: '48px',
                }}>
                  <input
                    type="text"
                    value={locLandmark}
                    onChange={e => setLocLandmark(e.target.value)}
                    placeholder="Landmark (optional)"
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      fontSize: '14px', fontFamily: fonts.body, color: tm.textPrimary,
                    }}
                  />
                </div>

                {/* Label chips */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['Home', 'Work', 'Other'] as const).map(l => (
                    <motion.button
                      key={l}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setLocLabel(l)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                        padding: '7px 16px', borderRadius: '20px',
                        background: locLabel === l ? `${tm.accentAmber}18` : tm.bgSurface,
                        border: `1px solid ${locLabel === l ? tm.accentAmber : tm.borderSubtle}`,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', color: locLabel === l ? tm.accentAmber : tm.textSecondary }}>
                        {l === 'Home' ? <Globe size={13} /> : l === 'Work' ? <Package size={13} /> : <MapPin size={13} />}
                      </span>
                      <span style={{
                        fontSize: '13px', fontFamily: fonts.body, lineHeight: 1,
                        fontWeight: locLabel === l ? 700 : 400,
                        color: locLabel === l ? tm.accentAmber : tm.textSecondary,
                      }}>
                        {l}
                      </span>
                    </motion.button>
                  ))}
                </div>

              </div>

              {/* Footer */}
              <div style={{ padding: '12px 20px 32px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setLocationSheetOpen(false)}
                  style={{
                    width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                    background: tm.accentAmber,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 16px ${tm.accentAmber}40`,
                  }}
                >
                  <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
                    Confirm address
                  </span>
                </motion.button>
                <button
                  onClick={() => setLocationSheetOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary }}>
                    Cancel
                  </span>
                </button>
              </div>
            </motion.div>

          </motion.div>
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
                  <span style={{ display: 'flex', alignItems: 'center', color: tm.textSecondary }}>{PREFERENCE_ICONS[activePicker]}</span>
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