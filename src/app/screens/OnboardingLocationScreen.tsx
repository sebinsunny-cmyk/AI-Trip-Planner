import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, LocateFixed, X } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { NovaBubble, StepDots } from '../components/NovaBubble';

export function OnboardingLocationScreen() {
  const navigate = useNavigate();
  const [draft,    setDraft]    = useState('');
  const [mapQuery, setMapQuery] = useState('');
  const [locating, setLocating] = useState(false);

  // Debounce map update
  useEffect(() => {
    const t = setTimeout(() => setMapQuery(draft), 900);
    return () => clearTimeout(t);
  }, [draft]);

  function getCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setDraft(loc);
        setMapQuery(loc);
        setLocating(false);
      },
      () => setLocating(false),
    );
  }

  function proceed() { navigate('/onboarding/prefs-flight'); }

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
          onClick={() => navigate('/onboarding/contact')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={15} color={tm.textPrimary} />
        </motion.button>
        <StepDots step={4} />
      </div>

      {/* Nova question */}
      <div style={{ paddingTop: '22px' }}>
        <NovaBubble message="Which city do you usually fly out from? I'll use this as your home base." />
      </div>

      {/* Search + map */}
      <div style={{ flex: 1, padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', scrollbarWidth: 'none' }}>
        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: tm.bgSurface, border: `1px solid ${draft ? tm.accentAmber : tm.borderSubtle}`,
            borderRadius: '14px', padding: '0 14px', height: '52px',
            transition: 'border-color 0.2s',
          }}
        >
          <MapPin size={16} color={draft ? tm.accentAmber : tm.textSecondary} style={{ flexShrink: 0, transition: 'color 0.2s' }} />
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="e.g. Mumbai, Delhi, Bengaluru"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '15px', fontFamily: fonts.body, color: tm.textPrimary,
            }}
          />
          {draft && (
            <button onClick={() => { setDraft(''); setMapQuery(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
              <X size={14} color={tm.textSecondary} />
            </button>
          )}
        </motion.div>

        {/* Use current location */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          whileTap={{ scale: 0.97 }}
          onClick={getCurrentLocation}
          disabled={locating}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', borderRadius: '12px',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: locating ? 'default' : 'pointer', opacity: locating ? 0.65 : 1,
          }}
        >
          <LocateFixed size={15} color={tm.accentTeal} />
          <span style={{ fontSize: '13px', fontFamily: fonts.body, fontWeight: 600, color: tm.accentTeal }}>
            {locating ? 'Getting location…' : 'Use my current location'}
          </span>
        </motion.button>

        {/* Live map preview */}
        <AnimatePresence>
          {mapQuery.trim() && (
            <motion.div
              key="map"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 160 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: '14px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}
            >
              <iframe
                key={mapQuery}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=11`}
                style={{ width: '100%', height: '160px', border: 'none', display: 'block' }}
                title="Location preview"
                loading="lazy"
              />
              <div style={{
                position: 'absolute', bottom: '8px', left: '8px',
                background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(6px)',
                borderRadius: '20px', padding: '4px 10px',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <MapPin size={10} color="#fff" />
                <span style={{ fontSize: '11px', color: '#fff', fontFamily: fonts.mono, fontWeight: 600 }}>
                  {mapQuery}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            background: draft.trim() ? tm.accentAmber : tm.bgSurface,
            cursor: draft.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s',
          }}
        >
          <span style={{
            fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700,
            color: draft.trim() ? '#fff' : tm.textSecondary,
          }}>
            Set as home base
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
