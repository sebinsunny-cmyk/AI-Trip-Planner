import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Edit3, Mail, Phone, User, Calendar,
  Globe, CreditCard, Plane, Clock, TrendingUp, ShieldCheck,
  LogOut, Copy, Check, RotateCcw,
} from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { label: 'Trips this year', value: '23',   icon: Plane,       color: '#60A5FA' },
  { label: 'Hours saved',     value: '47h',  icon: Clock,       color: '#00C9A7' },
  { label: 'Policy score',    value: '98%',  icon: ShieldCheck, color: '#A78BFA' },
  { label: 'Avg savings',     value: '₹2.4k',icon: TrendingUp,  color: '#F5A623' },
];

const TRAVEL_ID = [
  { label: 'Travel tier',   value: 'Gold — IndiGo', icon: Plane },
  { label: 'PAN',           value: 'BNZPM3829K',    icon: CreditCard },
  { label: 'Passport',      value: 'Z8831042',      icon: Globe },
];

const PERSONAL = [
  { label: 'Full name',     value: 'Arjun Menon',            icon: User },
  { label: 'Date of birth', value: 'Mar 14, 1990',           icon: Calendar },
  { label: 'Email',         value: 'arjun.menon@company.com', icon: Mail },
  { label: 'Phone',         value: '+91 98400 12345',         icon: Phone },
];


export function ProfileScreen() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { signOut } = useAuth();
  const [copied, setCopied] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  function copyField(label: string, value: string) {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div style={{ background: tm.bgPrimary, minHeight: '100%', fontFamily: fonts.body, paddingBottom: '32px' }}>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(160deg, #2D1B6B 0%, #1B2A5A 45%, ${isDark ? '#0D1117' : '#1e3a5f'} 100%)`,
        padding: '14px 16px 28px',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, #7C3AED33, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, left: 20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, #4F46E533, transparent 70%)', pointerEvents: 'none' }} />

        {/* Back + Edit row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={16} color="#fff" />
          </button>
          <button
            onClick={() => setEditMode(e => !e)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
              background: editMode ? 'rgba(245,166,35,0.25)' : 'rgba(255,255,255,0.12)',
              border: `1px solid ${editMode ? 'rgba(245,166,35,0.5)' : 'rgba(255,255,255,0.18)'}`,
            }}
          >
            <Edit3 size={13} color={editMode ? '#F5A623' : '#fff'} />
            <span style={{ fontSize: '12px', fontFamily: fonts.body, color: editMode ? '#F5A623' : '#fff', fontWeight: 600 }}>
              {editMode ? 'Done' : 'Edit'}
            </span>
          </button>
        </div>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              style={{
                width: '72px', height: '72px', borderRadius: '22px',
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontFamily: fonts.heading, fontWeight: 800, color: '#fff',
                boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              A
            </motion.div>
            {/* Online dot */}
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderRadius: '50%', background: '#00C9A7', border: '2px solid #1B2A5A' }} />
          </div>

          <div style={{ paddingBottom: '4px' }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontFamily: fonts.heading, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              Arjun Menon
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.65)', fontFamily: fonts.mono }}>
              Senior Product Manager
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,215,0,0.18)', border: '1px solid rgba(255,215,0,0.35)', borderRadius: '8px', padding: '2px 8px' }}>
                <span style={{ fontSize: '9px', color: '#FFD700', fontFamily: fonts.mono, letterSpacing: '0.05em' }}>✦ GOLD TIER</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0,201,167,0.15)', border: '1px solid rgba(0,201,167,0.3)', borderRadius: '8px', padding: '2px 8px' }}>
                <span style={{ fontSize: '9px', color: '#00C9A7', fontFamily: fonts.mono }}>Pro Plan · Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>

        {/* ── Stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', margin: '14px 0' }}>
          {STATS.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: tm.bgSurface,
                border: `1px solid ${tm.borderSubtle}`,
                borderRadius: '14px',
                padding: '10px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              }}
            >
              <Icon size={15} color={color} />
              <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>{value}</span>
              <span style={{ fontSize: '9px', color: tm.textSecondary, fontFamily: fonts.mono, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
            </motion.div>
          ))}
        </div>

        {/* ── Personal Details ── */}
        <SectionLabel label="PERSONAL DETAILS" />
        <InfoCard rows={PERSONAL} copyable={editMode} copied={copied} onCopy={copyField} />

        {/* ── Travel Identity ── */}
        <SectionLabel label="TRAVEL IDENTITY" />
        <InfoCard rows={TRAVEL_ID} copyable={true} copied={copied} onCopy={copyField} />

        {/* ── Reset Preferences ── */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.removeItem('tripmind-onboarded');
            signOut();
            navigate('/signin', { replace: true });
          }}
          style={{
            width: '100%', padding: '14px', borderRadius: '14px', marginBottom: '10px',
            background: `${tm.accentAmber}10`, border: `1px solid ${tm.accentAmber}30`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <RotateCcw size={15} color={tm.accentAmber} />
          <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.accentAmber }}>
            Reset Preferences
          </span>
        </motion.button>

        {/* ── Sign out ── */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { signOut(); navigate('/signin', { replace: true }); }}
          style={{
            width: '100%', padding: '14px', borderRadius: '14px',
            background: `${tm.accentRed}12`, border: `1px solid ${tm.accentRed}30`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <LogOut size={15} color={tm.accentRed} />
          <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: tm.accentRed }}>
            Sign out
          </span>
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginTop: '12px' }}>
          TripMind v1.0.0 · arjun.menon@company.com
        </p>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '2px' }}>
      {label}
    </div>
  );
}

function InfoCard({ rows, copyable, copied, onCopy }: {
  rows: { label: string; value: string; icon: React.ElementType }[];
  copyable: boolean;
  copied: string | null;
  onCopy: (label: string, value: string) => void;
}) {
  return (
    <div style={{
      background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
      borderRadius: '14px', overflow: 'hidden', marginBottom: '16px',
    }}>
      {rows.map(({ label, value, icon: Icon }, i) => (
        <div
          key={label}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 14px',
            borderBottom: i < rows.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
          }}
        >
          <Icon size={14} color={tm.textSecondary} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, marginBottom: '1px' }}>{label}</div>
            <div style={{ fontSize: '13px', color: tm.textPrimary, fontFamily: fonts.body, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
          </div>
          {copyable && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onCopy(label, value)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
            >
              {copied === label
                ? <Check size={13} color={tm.accentTeal} />
                : <Copy size={13} color={tm.textSecondary} />}
            </motion.button>
          )}
        </div>
      ))}
    </div>
  );
}