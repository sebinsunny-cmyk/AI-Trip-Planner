import { useNavigate, useLocation } from 'react-router';
import { Home, Briefcase, Bell, Settings } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

const TABS = [
  { label: 'Home',          icon: Home,     path: '/' },
  { label: 'My Trips',      icon: Briefcase, path: '/trips' },
  { label: 'Notifications', icon: Bell,      path: '/notifications' },
  { label: 'Settings',      icon: Settings,  path: '/settings' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        background: tm.bgSurface,
        borderTop: `1px solid ${tm.borderSubtle}`,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0 4px',
        flexShrink: 0,
      }}
    >
      {TABS.map(({ label, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        const isNotifications = label === 'Notifications';

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon
                size={22}
                style={{
                  color: isActive ? tm.accentAmber : tm.textSecondary,
                  strokeWidth: isActive ? 2 : 1.5,
                }}
              />
              {/* Unread badge */}
              {isNotifications && !isActive && (
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-3px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: tm.accentAmber,
                  border: `1.5px solid ${tm.bgSurface}`,
                }} />
              )}
            </div>
            <span
              style={{
                fontSize: '10px',
                fontFamily: fonts.body,
                color: isActive ? tm.accentAmber : tm.textSecondary,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
