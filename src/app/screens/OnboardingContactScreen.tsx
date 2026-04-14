import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Calendar } from 'lucide-react';
import { tm, fonts, darkTheme } from '../constants/colors';
import { NovaBubble, StepDots } from '../components/NovaBubble';

export function OnboardingContactScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [dob,   setDob]   = useState('');

  function proceed() { navigate('/onboarding/location'); }

  return (
    <div style={{
      background: tm.bgPrimary, height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '20px 20px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/onboarding/name')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={15} color={tm.textPrimary} />
        </motion.button>
        <StepDots step={3} />
      </div>

      {/* Nova question */}
      <div style={{ paddingTop: '22px' }}>
        <NovaBubble message="A couple quick details — you'll never have to re-enter these for a booking." />
      </div>

      {/* Inputs */}
      <div style={{
        flex: 1, padding: '0 20px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px',
      }}>
        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{
            fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
            fontWeight: 600, letterSpacing: '0.07em', marginBottom: '8px',
          }}>
            MOBILE NUMBER
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: tm.bgSurface, border: `1px solid ${phone ? tm.accentAmber : tm.borderSubtle}`,
            borderRadius: '14px', padding: '0 16px', height: '52px',
            transition: 'border-color 0.2s',
          }}>
            <Phone size={16} color={phone ? tm.accentAmber : tm.textSecondary} style={{ flexShrink: 0, transition: 'color 0.2s' }} />
            <span style={{ fontSize: '14px', color: tm.textSecondary, fontFamily: fonts.mono, flexShrink: 0 }}>+91</span>
            <div style={{ width: 1, height: 20, background: tm.borderSubtle }} />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="98765 43210"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '15px', fontFamily: fonts.body, color: tm.textPrimary,
              }}
            />
          </div>
        </motion.div>

        {/* Date of Birth */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{
            fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
            fontWeight: 600, letterSpacing: '0.07em', marginBottom: '8px',
          }}>
            DATE OF BIRTH
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: tm.bgSurface, border: `1px solid ${dob ? tm.accentAmber : tm.borderSubtle}`,
            borderRadius: '14px', padding: '0 16px', height: '52px',
            transition: 'border-color 0.2s',
          }}>
            <Calendar size={16} color={dob ? tm.accentAmber : tm.textSecondary} style={{ flexShrink: 0, transition: 'color 0.2s' }} />
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '15px', fontFamily: fonts.body, color: dob ? tm.textPrimary : tm.textSecondary,
                colorScheme: tm.bgPrimary === darkTheme.bgPrimary ? 'dark' : 'light',
              }}
            />
          </div>
        </motion.div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          style={{
            background: `${tm.accentAmber}0A`,
            border: `1px solid ${tm.accentAmber}22`,
            borderRadius: '12px', padding: '10px 14px',
          }}
        >
          <p style={{
            fontSize: '11px', color: tm.textSecondary,
            fontFamily: fonts.mono, margin: 0, lineHeight: 1.6,
          }}>
            🔒 Used only for flight check-ins and booking confirmations. Never shared.
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
            Continue
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
