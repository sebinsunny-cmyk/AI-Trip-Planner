import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, Bell, Calendar, ArrowLeft } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? tm.accentAmber : tm.borderSubtle, transition: 'background 0.3s' }} />
      ))}
    </div>
  );
}

export function OnboardingPermissionsScreen() {
  const navigate = useNavigate();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [calEnabled,   setCalEnabled]   = useState(false);

  async function handleNotifToggle() {
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
  }

  function proceed() { navigate('/onboarding/all-set'); }

  const ITEMS = [
    {
      id: 'notifications',
      icon: Bell,
      iconColor: tm.accentAmber,
      iconBg: `${tm.accentAmber}18`,
      iconBorder: `${tm.accentAmber}35`,
      title: 'Smart Reminders',
      desc: 'Wake-up alerts & departure reminders so you never miss a flight',
      value: notifEnabled,
      onToggle: handleNotifToggle,
    },
    {
      id: 'calendar',
      icon: Calendar,
      iconColor: '#3B82F6',
      iconBg: '#3B82F618',
      iconBorder: '#3B82F635',
      title: 'Google Calendar',
      desc: 'So Nova knows when your meetings are and plans around them',
      value: calEnabled,
      onToggle: () => setCalEnabled(v => !v),
    },
  ];

  return (
    <div style={{ background: tm.bgPrimary, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: fonts.body }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <StepBar step={4} total={4} />
        <div style={{ marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>Step 4 of 4</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0 4px' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/onboarding/prefs-hotel')}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <ArrowLeft size={15} color={tm.textPrimary} />
          </motion.button>
          <h1 style={{ fontSize: '22px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, margin: 0 }}>
            Permissions &amp; integrations
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '0 0 20px', paddingLeft: '42px' }}>
          Optional — you can always change these in Settings
        </p>
      </div>

      {/* Permission cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', scrollbarWidth: 'none' }}>
        {ITEMS.map(({ id, icon: Icon, iconColor, iconBg, iconBorder, title, desc, value, onToggle }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: id === 'notifications' ? 0.05 : 0.15 }}
            style={{
              background: tm.bgSurface,
              border: `1px solid ${value ? iconBorder : tm.borderSubtle}`,
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '13px', flexShrink: 0,
              background: iconBg, border: `1px solid ${iconBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={20} color={iconColor} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary, marginBottom: '4px' }}>
                {title}
              </div>
              <div style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, lineHeight: 1.5 }}>
                {desc}
              </div>
            </div>

            <button
              onClick={onToggle}
              style={{
                width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0, marginTop: '2px',
                background: value ? tm.accentTeal : tm.bgElevated,
                border: `1px solid ${value ? tm.accentTeal : tm.borderSubtle}`,
                cursor: 'pointer', position: 'relative', padding: 0, transition: 'all 0.2s',
              }}
            >
              <motion.div
                animate={{ x: value ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
              />
            </button>
          </motion.div>
        ))}

        {/* Info note */}
        <div style={{
          background: `${tm.accentAmber}0C`, border: `1px solid ${tm.accentAmber}25`,
          borderRadius: '12px', padding: '12px 14px', marginTop: '4px',
        }}>
          <p style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, margin: 0, lineHeight: 1.6 }}>
            💡 You can connect more services (MakeMyTrip, Uber, Concur) anytime from <strong style={{ color: tm.textPrimary }}>Settings → Integrations</strong>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px 36px', flexShrink: 0, borderTop: `1px solid ${tm.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: '10px', background: tm.bgPrimary }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={proceed}
          style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', background: tm.accentAmber, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>Continue</span>
          <ChevronRight size={16} color="#fff" />
        </motion.button>
        <button onClick={proceed} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary }}>Skip everything</span>
        </button>
      </div>
    </div>
  );
}
