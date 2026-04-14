import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, Calendar } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { NovaBubble, StepDots } from '../components/NovaBubble';

const ITEMS = [
  {
    id:        'notifications',
    icon:      Bell,
    accent:    tm.accentAmber,
    benefit:   'Never miss a flight update',
    detail:    'Wake-up alerts, gate changes & departure reminders — delivered at the right time.',
    cta:       'Enable Notifications',
  },
  {
    id:        'calendar',
    icon:      Calendar,
    accent:    '#3B82F6',
    benefit:   'Plan around your meetings',
    detail:    'Nova reads your calendar so it never books a flight that clashes with a meeting.',
    cta:       'Connect Google Calendar',
  },
];

export function OnboardingPermissionsScreen() {
  const navigate = useNavigate();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [calEnabled,   setCalEnabled]   = useState(false);

  const values: Record<string, boolean> = { notifications: notifEnabled, calendar: calEnabled };

  async function handleToggle(id: string) {
    if (id === 'notifications') {
      if (!notifEnabled) {
        try {
          const result = await Notification.requestPermission();
          setNotifEnabled(result === 'granted');
        } catch {
          setNotifEnabled(v => !v);
        }
      } else {
        setNotifEnabled(false);
      }
    } else {
      setCalEnabled(v => !v);
    }
  }

  function proceed() { navigate('/onboarding/all-set'); }

  return (
    <div style={{
      background: tm.bgPrimary, height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '20px 20px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/onboarding/prefs-hotel')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={15} color={tm.textPrimary} />
        </motion.button>
        <StepDots step={7} />
      </div>

      {/* Nova question */}
      <div style={{ paddingTop: '22px', flexShrink: 0 }}>
        <NovaBubble message="One last thing — let me set up your alerts so I can keep you informed." />
      </div>

      {/* Benefit cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0', scrollbarWidth: 'none' }}>
        {ITEMS.map(({ id, icon: Icon, accent, benefit, detail, cta }, i) => {
          const enabled = values[id];
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              style={{
                background: tm.bgSurface,
                border: `1.5px solid ${enabled ? accent + '55' : tm.borderSubtle}`,
                borderRadius: '18px', padding: '18px 16px',
                marginBottom: '12px', transition: 'border-color 0.2s',
              }}
            >
              {/* Benefit headline */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '12px', flexShrink: 0,
                  background: `${accent}18`, border: `1px solid ${accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800,
                    color: tm.textPrimary, marginBottom: '4px',
                  }}>
                    {benefit}
                  </div>
                  <div style={{
                    fontSize: '12px', color: tm.textSecondary,
                    fontFamily: fonts.mono, lineHeight: 1.55,
                  }}>
                    {detail}
                  </div>
                </div>
              </div>

              {/* Enable button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleToggle(id)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '12px',
                  border: `1px solid ${enabled ? accent : tm.borderSubtle}`,
                  background: enabled ? `${accent}18` : tm.bgElevated,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <motion.div
                  animate={{ scale: enabled ? 1 : 0.85, opacity: enabled ? 1 : 0 }}
                  style={{
                    width: 16, height: 16, borderRadius: '50%', background: accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '10px', fontWeight: 800 }}>✓</span>
                </motion.div>
                <span style={{
                  fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700,
                  color: enabled ? accent : tm.textSecondary,
                }}>
                  {enabled ? 'Enabled' : cta}
                </span>
              </motion.button>
            </motion.div>
          );
        })}

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            background: `${tm.accentAmber}0A`,
            border: `1px solid ${tm.accentAmber}22`,
            borderRadius: '12px', padding: '11px 14px',
          }}
        >
          <p style={{
            fontSize: '11px', color: tm.textSecondary,
            fontFamily: fonts.mono, margin: 0, lineHeight: 1.6,
          }}>
            💡 Connect more apps (MakeMyTrip, Uber, Concur) anytime from <strong style={{ color: tm.textPrimary }}>Settings → Connected Apps</strong>.
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px 36px', flexShrink: 0,
        borderTop: `1px solid ${tm.borderSubtle}`,
        display: 'flex', flexDirection: 'column', gap: '10px',
        background: tm.bgPrimary,
      }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={proceed}
          style={{
            width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
            background: tm.accentAmber, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
            All done →
          </span>
        </motion.button>
        <button onClick={proceed} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary }}>
            Skip for now
          </span>
        </button>
      </div>
    </div>
  );
}
