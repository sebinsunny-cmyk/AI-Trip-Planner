import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCheck, Trash2 } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

type NType = 'trip' | 'reminder' | 'alert' | 'system';

interface Notif {
  id: string;
  type: NType;
  read: boolean;
  emoji: string;
  color: string;
  bgColor: string;
  title: string;
  desc: string;
  time: string;
  group: 'Today' | 'Yesterday' | 'Earlier';
}

const INITIAL: Notif[] = [
  {
    id: 'n1', type: 'trip', read: false,
    emoji: '✈️', color: '#00C9A7', bgColor: '#00C9A715',
    title: 'Flight confirmed — COK → BOM',
    desc: 'IndiGo 6E‑342 · Apr 15, 06:20 AM · PNR: AXMK92',
    time: '2m ago', group: 'Today',
  },
  {
    id: 'n2', type: 'reminder', read: false,
    emoji: '⏰', color: '#F5A623', bgColor: '#F5A62315',
    title: 'Check-in opens in 2 hours',
    desc: 'Web check-in for IndiGo 6E‑342 is now open. Seat 12A confirmed.',
    time: '14m ago', group: 'Today',
  },
  {
    id: 'n3', type: 'alert', read: false,
    emoji: '🤖', color: '#F5A623', bgColor: '#F5A62315',
    title: 'Agent found a cheaper option',
    desc: 'Air India AI‑501 at ₹10,200 — save ₹2,600 vs current booking.',
    time: '1h ago', group: 'Today',
  },
  {
    id: 'n4', type: 'trip', read: false,
    emoji: '🏨', color: '#60A5FA', bgColor: '#60A5FA15',
    title: 'Hotel booking confirmed',
    desc: 'Taj Santacruz, Mumbai · Apr 15–16 · Room 714',
    time: '3h ago', group: 'Today',
  },
  {
    id: 'n5', type: 'reminder', read: true,
    emoji: '🚗', color: '#F5A623', bgColor: '#F5A62315',
    title: 'Cab pre-booked for tomorrow',
    desc: 'Uber XL pickup at 04:45 AM from your registered home address.',
    time: '5h ago', group: 'Today',
  },
  {
    id: 'n6', type: 'alert', read: true,
    emoji: '💳', color: '#FF5C5C', bgColor: '#FF5C5C15',
    title: 'Budget alert — 80% used',
    desc: "You've spent ₹12,200 of your ₹15,000 travel policy this trip.",
    time: '8h ago', group: 'Today',
  },
  {
    id: 'n7', type: 'trip', read: true,
    emoji: '✅', color: '#00C9A7', bgColor: '#00C9A715',
    title: 'Approval received',
    desc: 'Your BLR → DEL trip (Apr 22) was approved by Priya Nair.',
    time: 'Yesterday', group: 'Yesterday',
  },
  {
    id: 'n8', type: 'system', read: true,
    emoji: '🔄', color: '#8B949E', bgColor: '#8B949E15',
    title: 'Sync complete',
    desc: 'Google Calendar synced · 2 new events imported successfully.',
    time: 'Yesterday', group: 'Yesterday',
  },
  {
    id: 'n9', type: 'alert', read: true,
    emoji: '📋', color: '#A78BFA', bgColor: '#A78BFA15',
    title: 'Travel policy updated',
    desc: 'Max hotel spend raised to ₹6,500/night. Effective immediately.',
    time: '3 days ago', group: 'Earlier',
  },
  {
    id: 'n10', type: 'trip', read: true,
    emoji: '🎫', color: '#60A5FA', bgColor: '#60A5FA15',
    title: 'E-ticket in your inbox',
    desc: 'IndiGo 6E‑342 boarding pass sent to arjun.menon@company.com',
    time: '3 days ago', group: 'Earlier',
  },
];

const TABS: { key: NType | 'all'; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'trip',     label: 'Trips' },
  { key: 'reminder', label: 'Reminders' },
  { key: 'alert',    label: 'Alerts' },
  { key: 'system',   label: 'System' },
];

const GROUPS: Notif['group'][] = ['Today', 'Yesterday', 'Earlier'];

export function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL);
  const [activeTab, setActiveTab] = useState<NType | 'all'>('all');

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = activeTab === 'all' ? notifs : notifs.filter(n => n.type === activeTab);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  function dismiss(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  const visibleGroups = GROUPS.filter(g =>
    filtered.some(n => n.group === g)
  );

  return (
    <div style={{ background: tm.bgPrimary, minHeight: '100%', fontFamily: fonts.body, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{
        padding: '12px 16px 0',
        background: tm.bgPrimary,
        borderBottom: `1px solid ${tm.borderSubtle}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ArrowLeft size={16} color={tm.textPrimary} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <motion.div
                  key={unreadCount}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  style={{
                    minWidth: '20px', height: '20px', borderRadius: '10px',
                    background: tm.accentAmber, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                  }}
                >
                  <span style={{ fontSize: '10px', color: '#fff', fontFamily: fonts.mono, fontWeight: 600 }}>
                    {unreadCount}
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: `${tm.accentTeal}18`, border: `1px solid ${tm.accentTeal}35`,
                borderRadius: '10px', padding: '5px 10px', cursor: 'pointer',
              }}
            >
              <CheckCheck size={13} color={tm.accentTeal} />
              <span style={{ fontSize: '11px', color: tm.accentTeal, fontFamily: fonts.mono }}>
                Mark all read
              </span>
            </button>
          )}
        </div>

        {/* ── Filter tabs ── */}
        <div style={{ display: 'flex', gap: '6px', paddingBottom: '12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const tabUnread = tab.key === 'all'
              ? unreadCount
              : notifs.filter(n => n.type === tab.key && !n.read).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flexShrink: 0,
                  padding: '5px 12px',
                  borderRadius: '20px',
                  border: isActive ? 'none' : `1px solid ${tm.borderSubtle}`,
                  background: isActive ? tm.accentAmber : tm.bgElevated,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  fontSize: '11px',
                  fontFamily: fonts.body,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#fff' : tm.textSecondary,
                }}>
                  {tab.label}
                </span>
                {tabUnread > 0 && (
                  <span style={{
                    fontSize: '9px', fontFamily: fonts.mono,
                    color: isActive ? '#fff' : tm.accentAmber,
                    background: isActive ? 'rgba(255,255,255,0.25)' : `${tm.accentAmber}22`,
                    padding: '1px 5px', borderRadius: '8px',
                  }}>
                    {tabUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── List ── */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: '20px' }}>
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '60px 20px', gap: '12px',
              }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
              }}>
                🔔
              </div>
              <div style={{ fontSize: '15px', color: tm.textPrimary, fontFamily: fonts.heading, fontWeight: 700 }}>
                All caught up
              </div>
              <div style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.body, textAlign: 'center' }}>
                No notifications here yet. We'll let you know when something needs your attention.
              </div>
            </motion.div>
          ) : (
            visibleGroups.map(group => {
              const items = filtered.filter(n => n.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  {/* Group label */}
                  <div style={{
                    padding: '14px 16px 6px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ fontSize: '11px', fontFamily: fonts.mono, fontWeight: 600, color: tm.textSecondary, letterSpacing: '0.07em' }}>
                      {group.toUpperCase()}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
                  </div>

                  {/* Notification cards */}
                  {items.map((n, i) => (
                    <AnimatePresence key={n.id}>
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, x: 20, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, padding: 0, transition: { duration: 0.22 } }}
                        transition={{ delay: i * 0.04, type: 'spring', stiffness: 360, damping: 30 }}
                        onClick={() => markRead(n.id)}
                        style={{
                          margin: '0 12px 6px',
                          borderRadius: '16px',
                          background: tm.bgSurface,
                          border: `1px solid ${n.read ? tm.borderSubtle : n.color + '40'}`,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        {/* Unread left accent bar */}
                        {!n.read && (
                          <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: '3px', background: n.color, borderRadius: '0',
                          }} />
                        )}

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 12px 12px 13px' }}>
                          {/* Icon */}
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '10px',
                            background: n.bgColor,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', flexShrink: 0,
                          }}>
                            {n.emoji}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
                              <span style={{
                                fontSize: '13px', fontFamily: fonts.heading,
                                fontWeight: n.read ? 600 : 800,
                                color: n.read ? tm.textSecondary : tm.textPrimary,
                                lineHeight: 1.3,
                              }}>
                                {n.title}
                              </span>
                              <button
                                onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0, opacity: 0.4 }}
                              >
                                <Trash2 size={12} color={tm.textSecondary} />
                              </button>
                            </div>
                            <p style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '0 0 5px', lineHeight: 1.45 }}>
                              {n.desc}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>{n.time}</span>
                              {!n.read && (
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: n.color, marginLeft: 'auto' }} />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ))}
                </div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
