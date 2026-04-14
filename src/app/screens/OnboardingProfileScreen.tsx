import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Mail, Phone, Calendar, MapPin, CreditCard, Globe, ChevronRight } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < step ? tm.accentAmber : tm.borderSubtle,
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

const FIELDS = [
  { key: 'name',         label: 'Full Name',       icon: User,       placeholder: 'Arjun Menon',           type: 'text' },
  { key: 'email',        label: 'Work Email',       icon: Mail,       placeholder: 'you@company.com',       type: 'email' },
  { key: 'phone',        label: 'Phone Number',     icon: Phone,      placeholder: '+91 98765 43210',       type: 'tel' },
  { key: 'dob',          label: 'Date of Birth',    icon: Calendar,   placeholder: 'DD / MM / YYYY',        type: 'text' },
  { key: 'baseLocation', label: 'Base City',        icon: MapPin,     placeholder: 'e.g. Kochi, Kerala',    type: 'text' },
  { key: 'pan',          label: 'PAN Number',       icon: CreditCard, placeholder: 'BNZPM3829K',            type: 'text' },
  { key: 'passport',     label: 'Passport Number',  icon: Globe,      placeholder: 'Z8831042',              type: 'text' },
] as const;

export function OnboardingProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name:         user?.name  ?? '',
    email:        user?.email ?? '',
    phone:        '',
    dob:          '',
    baseLocation: '',
    pan:          '',
    passport:     '',
  });

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function proceed() {
    navigate('/onboarding/prefs-flight');
  }

  return (
    <div style={{
      background: tm.bgPrimary, height: '100%',
      display: 'flex', flexDirection: 'column', fontFamily: fonts.body,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <StepBar step={1} total={4} />
        <div style={{ marginTop: '4px', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>Step 1 of 4</span>
        </div>
        <h1 style={{ fontSize: '22px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, margin: '10px 0 4px' }}>
          Your profile
        </h1>
        <p style={{ fontSize: '13px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '0 0 16px' }}>
          Used for bookings &amp; travel documents
        </p>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px', scrollbarWidth: 'none' }}>
        {FIELDS.map(({ key, label, icon: Icon, placeholder, type }) => (
          <div key={key} style={{ marginBottom: '14px' }}>
            <div style={{
              fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
              fontWeight: 600, marginBottom: '7px', letterSpacing: '0.07em',
            }}>
              {label.toUpperCase()}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
              borderRadius: '12px', padding: '0 14px', height: '48px',
            }}>
              <Icon size={15} color={tm.textSecondary} style={{ flexShrink: 0 }} />
              <input
                type={type}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  outline: 'none', fontSize: '14px',
                  fontFamily: fonts.body, color: tm.textPrimary,
                }}
              />
            </div>
          </div>
        ))}
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
            Continue
          </span>
          <ChevronRight size={16} color="#fff" />
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
