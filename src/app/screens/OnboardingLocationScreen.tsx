import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, LocateFixed, Home, Briefcase } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { StepDots } from '../components/NovaBubble';

const DEFAULT_CITY = 'Kochi, Kerala';

export function OnboardingLocationScreen() {
  const navigate   = useNavigate();
  const [flat,     setFlat]     = useState('');
  const [landmark, setLandmark] = useState('');
  const [label,    setLabel]    = useState<'Home' | 'Work' | 'Other'>('Home');
  const [locating, setLocating] = useState(false);

  function getCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => setLocating(false),
      () => setLocating(false),
    );
  }

  function proceed() { navigate('/onboarding/prefs-flight'); }

  return (
    <div style={{
      background: tm.bgPrimary, height: '100%',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Map section ── */}
      <div style={{ position: 'relative', height: '44%', flexShrink: 0 }}>

        {/* Map iframe */}
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(DEFAULT_CITY)}&output=embed&z=13`}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Location map"
          loading="lazy"
        />

        {/* Dropped pin — centered */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.35 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Pin head */}
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            }}>
              <MapPin size={18} color="#fff" />
            </div>
            {/* Pin tail */}
            <div style={{
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `9px solid #e8890f`,
            }} />
            {/* Shadow dot */}
            <div style={{
              width: 10, height: 4, borderRadius: '50%',
              background: 'rgba(0,0,0,0.22)',
              marginTop: '1px', filter: 'blur(2px)',
            }} />
          </motion.div>
        </div>

        {/* Top overlay: back + step dots */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3,
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.38), transparent)',
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/onboarding/contact')}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
            }}
          >
            <ArrowLeft size={15} color="#0D1117" />
          </motion.button>
          <div style={{
            background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(8px)',
            borderRadius: '20px', padding: '6px 12px',
          }}>
            <StepDots step={4} />
          </div>
        </div>

        {/* Use current location — floating just above bottom sheet */}
        <div style={{
          position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 3,
          display: 'flex', justifyContent: 'center',
        }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={getCurrentLocation}
            disabled={locating}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '24px',
              background: 'rgba(255,255,255,0.95)', border: 'none',
              cursor: locating ? 'default' : 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              opacity: locating ? 0.75 : 1,
            }}
          >
            <LocateFixed size={15} color={locating ? '#999' : '#00C9A7'} />
            <span style={{ fontSize: '13px', fontFamily: fonts.body, fontWeight: 600, color: locating ? '#999' : '#111' }}>
              {locating ? 'Getting location…' : 'Use current location'}
            </span>
          </motion.button>
        </div>

      </div>

      {/* ── Bottom sheet ── */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.15 }}
        style={{
          flex: 1,
          background: tm.bgPrimary,
          borderRadius: '20px 20px 0 0',
          marginTop: '-18px',
          zIndex: 4,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -6px 24px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Handle */}
        <div style={{ paddingTop: '10px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: tm.borderSubtle }} />
        </div>

        {/* Scrollable body */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '14px 20px 8px',
          scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: '12px',
        }}>

          {/* Nova hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
            }}>🤖</div>
            <span style={{ fontSize: '12px', fontFamily: fonts.mono, color: tm.textSecondary, lineHeight: 1.5 }}>
              Which city do you usually fly out from?
            </span>
          </div>


          {/* Additional details */}
          <div style={{
            fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono,
            fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const,
            marginTop: '8px',
          }}>
            Additional details
          </div>

          {/* Flat / Floor */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '14px', padding: '0 14px', height: '48px',
          }}>
            <input
              type="text"
              value={flat}
              onChange={e => setFlat(e.target.value)}
              placeholder="Flat / Floor / Building (optional)"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '14px', fontFamily: fonts.body, color: tm.textPrimary,
              }}
            />
          </div>

          {/* Landmark */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '14px', padding: '0 14px', height: '48px',
          }}>
            <input
              type="text"
              value={landmark}
              onChange={e => setLandmark(e.target.value)}
              placeholder="Landmark (optional)"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '14px', fontFamily: fonts.body, color: tm.textPrimary,
              }}
            />
          </div>

          {/* Label chips */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['Home', 'Work', 'Other'] as const).map(l => (
              <motion.button
                key={l}
                whileTap={{ scale: 0.93 }}
                onClick={() => setLabel(l)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  padding: '7px 16px', borderRadius: '20px',
                  background: label === l ? `${tm.accentAmber}18` : tm.bgSurface,
                  border: `1px solid ${label === l ? tm.accentAmber : tm.borderSubtle}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: label === l ? tm.accentAmber : tm.textSecondary }}>
                  {l === 'Home' ? <Home size={13} /> : l === 'Work' ? <Briefcase size={13} /> : <MapPin size={13} />}
                </span>
                <span style={{
                  fontSize: '13px', fontFamily: fonts.body, lineHeight: 1,
                  fontWeight: label === l ? 700 : 400,
                  color: label === l ? tm.accentAmber : tm.textSecondary,
                }}>
                  {l}
                </span>
              </motion.button>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px 32px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={proceed}
            style={{
              width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
              background: tm.accentAmber,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 16px ${tm.accentAmber}40`,
            }}
          >
            <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
              Confirm address
            </span>
          </motion.button>
          <button
            onClick={proceed}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <span style={{ fontSize: '13px', fontFamily: fonts.body, color: tm.textSecondary }}>
              Skip for now
            </span>
          </button>
        </div>
      </motion.div>

    </div>
  );
}
