import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { tm, fonts } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { Signal, Wifi, Battery } from 'lucide-react';

const HIDE_BOTTOM_NAV = ['/new-trip', '/trip-params', '/agent-auto', '/unified-review', '/agent', '/confirmed', '/notifications', '/profile', '/signin'];
const HIDE_BOTTOM_NAV_PREFIXES = ['/onboarding', '/settings/integrations'];

export function PhoneFrame() {
  const location = useLocation();
  const { isDark } = useTheme();
  const hideBottomNav = HIDE_BOTTOM_NAV.includes(location.pathname)
    || location.pathname.startsWith('/trips/')
    || HIDE_BOTTOM_NAV_PREFIXES.some(p => location.pathname.startsWith(p));

  const pageBg = isDark
    ? 'radial-gradient(ellipse at 50% 30%, #1a1f2e 0%, #070A0E 70%)'
    : 'radial-gradient(ellipse at 50% 30%, #D8E3F5 0%, #BCC9DC 70%)';

  const shellBorder = isDark ? '1px solid #1f2937' : '1px solid #BCC5D0';
  const shellShadow = isDark
    ? `0 0 0 1px #0a0e16, 0 0 0 11px #111827, 0 0 0 13px #1f2937, 0 50px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)`
    : `0 0 0 1px #C8D4E0, 0 0 0 11px #E2EAF2, 0 0 0 13px #D0D9E4, 0 50px 120px rgba(100,120,150,0.25), inset 0 1px 0 rgba(255,255,255,0.8)`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: pageBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: fonts.body,
      }}
    >
      {/* Phone shell */}
      <div
        style={{
          width: '390px',
          height: '844px',
          background: tm.bgPrimary,
          borderRadius: '48px',
          overflow: 'hidden',
          position: 'relative',
          border: shellBorder,
          boxShadow: shellShadow,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '34px',
            background: '#000',
            borderRadius: '20px',
            zIndex: 50,
          }}
        />

        {/* Status Bar */}
        <div
          style={{
            height: '54px',
            background: tm.bgPrimary,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 28px 8px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: tm.textPrimary,
              fontSize: '14px',
              fontFamily: fonts.mono,
              fontWeight: 600,
            }}
          >
            9:41
          </span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Signal size={14} color={tm.textPrimary} />
            <Wifi size={14} color={tm.textPrimary} />
            <Battery size={14} color={tm.textPrimary} />
          </div>
        </div>

        {/* Screen content */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.8 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          {!hideBottomNav && <BottomNav />}
        </div>

        {/* Home indicator */}
        <div
          style={{
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: tm.bgPrimary,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '130px',
              height: '5px',
              background: isDark ? 'rgba(240,246,252,0.3)' : 'rgba(26,31,46,0.2)',
              borderRadius: '3px',
            }}
          />
        </div>
      </div>
    </div>
  );
}