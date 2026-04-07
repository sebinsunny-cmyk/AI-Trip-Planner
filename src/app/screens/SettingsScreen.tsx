import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Globe, Car, Plane, Shield, Sun, Moon, Check, X } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  color: string;
}

const INTEGRATIONS: Integration[] = [
  { id: 'gcal', name: 'Google Calendar', description: 'Read & write calendar events', icon: '📅', connected: true, color: '#4285F4' },
  { id: 'mmt', name: 'MakeMyTrip', description: 'Flight search & booking', icon: '✈️', connected: true, color: '#E8203D' },
  { id: 'uber', name: 'Uber for Business', description: 'Cab booking & tracking', icon: '⚫', connected: true, color: '#000000' },
  { id: 'ola', name: 'Ola Corporate', description: 'Cab booking alternative', icon: '🟢', connected: false, color: '#3CB371' },
  { id: 'gmail', name: 'Gmail', description: 'Booking confirmations & e-tickets', icon: '📧', connected: true, color: '#EA4335' },
  { id: 'concur', name: 'Concur Expense', description: 'Expense pre-approval & reports', icon: '💳', connected: false, color: '#009CDE' },
];

const PREFERENCE_OPTIONS: Record<string, string[]> = {
  'Preferred seat': ['Window', 'Aisle', 'Middle', 'No preference'],
  'Cab preference': ['Sedan', 'SUV', 'Mini', 'Hatchback', 'No preference'],
  'Meal preference': ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'No preference'],
  'Travel policy': [
    'Economy — ₹10,000/trip',
    'Standard — ₹15,000/trip',
    'Premium — ₹25,000/trip',
    'Executive — ₹40,000/trip',
  ],
};

const PREFERENCE_ICONS: Record<string, string> = {
  'Preferred seat':  '💺',
  'Cab preference':  '🚕',
  'Meal preference': '🍽️',
  'Travel policy':   '🛡️',
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
    'Preferred seat':  'Window',
    'Cab preference':  'Sedan',
    'Meal preference': 'Vegetarian',
    'Travel policy':   'Standard — ₹15,000/trip',
  });
  const [activePicker, setActivePicker] = useState<string | null>(null);

  const PREFERENCES = [
    { label: 'Preferred seat', icon: Plane },
    { label: 'Cab preference', icon: Car },
    { label: 'Meal preference', icon: Globe },
    { label: 'Travel policy', icon: Shield },
  ];

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  };

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
                {integration.icon}
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

        {/* Preferences */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', paddingLeft: '4px', letterSpacing: '0.08em' }}>
            TRAVEL PREFERENCES
          </div>
          <div style={{ background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, borderRadius: '14px', overflow: 'hidden' }}>
            {PREFERENCES.map(({ label, icon: Icon }, i) => (
              <motion.div
                key={i}
                whileTap={{ backgroundColor: `${tm.bgElevated}` }}
                onClick={() => setActivePicker(label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 14px',
                  borderBottom: i < PREFERENCES.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={15} color={tm.textSecondary} />
                  <span style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body }}>
                    {label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: tm.accentAmber, fontFamily: fonts.mono }}>
                    {prefValues[label]}
                  </span>
                  <ChevronRight size={13} color={tm.textSecondary} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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