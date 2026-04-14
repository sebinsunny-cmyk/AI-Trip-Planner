import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { NovaBubble, StepDots } from '../components/NovaBubble';
import { useAuth } from '../context/AuthContext';

export function OnboardingNameScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Pre-fill full name from auth (passport name)
  const [name, setName] = useState(user?.name ?? '');

  const canProceed = name.trim().length > 0;

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
          onClick={() => navigate('/onboarding/tour')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={15} color={tm.textPrimary} />
        </motion.button>
        <StepDots step={2} />
      </div>

      {/* Nova question */}
      <div style={{ paddingTop: '22px' }}>
        <NovaBubble message="What's your full name? I'll use your first name to address you and the full name for flight bookings." />
      </div>

      {/* Large name input — centred */}
      <div style={{
        flex: 1, padding: '0 28px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      }}>
        <motion.input
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          autoFocus
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && canProceed) navigate('/onboarding/contact'); }}
          placeholder="Full name as per passport"
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            fontSize: '34px', fontFamily: fonts.heading, fontWeight: 800,
            color: tm.textPrimary, textAlign: 'center',
            padding: '12px 0 14px',
            borderBottom: `2px solid ${canProceed ? tm.accentAmber : tm.borderSubtle}`,
            transition: 'border-color 0.2s',
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            fontSize: '12px', color: tm.textSecondary,
            fontFamily: fonts.mono, margin: '10px 0 0', textAlign: 'center',
          }}
        >
          As per passport · Nova will call you by your first name
        </motion.p>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px 36px', flexShrink: 0,
        borderTop: `1px solid ${tm.borderSubtle}`,
        background: tm.bgPrimary,
      }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { if (canProceed) navigate('/onboarding/contact'); }}
          style={{
            width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
            background: canProceed ? tm.accentAmber : tm.bgSurface,
            cursor: canProceed ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s',
          }}
        >
          <span style={{
            fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700,
            color: canProceed ? '#fff' : tm.textSecondary,
          }}>
            That's me →
          </span>
        </motion.button>
      </div>
    </div>
  );
}
