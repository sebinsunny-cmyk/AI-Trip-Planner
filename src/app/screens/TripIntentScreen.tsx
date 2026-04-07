import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, MicOff, SendHorizonal } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

const EXAMPLE_TEXT = "I have a meeting in Mumbai on the 15th. Morning flight, back same evening.";

const DETECTED_CHIPS = [
  { id: 'dest',   label: '📍 Mumbai',         delay: 0   },
  { id: 'date',   label: '🗓 Apr 15',          delay: 200 },
  { id: 'flight', label: '🌅 Morning Flight',  delay: 400 },
  { id: 'return', label: '↩ Same Day Return',  delay: 600 },
];

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function TripIntentScreen() {
  const navigate = useNavigate();
  const [inputText, setInputText]         = useState('');
  const [committedText, setCommittedText] = useState('');
  const [visibleChips, setVisibleChips]   = useState<string[]>([]);
  const [removedChips, setRemovedChips]   = useState<string[]>([]);
  const [isRecording, setIsRecording]     = useState(false);
  const [voiceStatus, setVoiceStatus]     = useState<'idle' | 'listening' | 'done'>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Chips derive from committedText only (updated on send)
  useEffect(() => {
    const words = committedText.toLowerCase();
    const chips: string[] = [];
    if (words.includes('mumbai') || words.includes('bom'))                                                          chips.push('dest');
    if (words.includes('15') || words.includes('april'))                                                            chips.push('date');
    if (words.includes('morning') || words.includes('early'))                                                       chips.push('flight');
    if (words.includes('return') || words.includes('back') || words.includes('evening') || words.includes('same')) chips.push('return');
    setVisibleChips(chips.filter(c => !removedChips.includes(c)));
  }, [committedText, removedChips]);

  const isDirty   = inputText.trim() !== committedText.trim();
  const canSubmit = visibleChips.includes('dest') && visibleChips.includes('date');

  function commitText() {
    if (!inputText.trim()) return;
    setCommittedText(inputText);
  }

  function toggleRecording() {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setVoiceStatus('done');
      return;
    }

    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      // Fallback: fill with example text to demo the flow
      setInputText(EXAMPLE_TEXT);
      setVoiceStatus('done');
      return;
    }

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setIsRecording(true);
      setVoiceStatus('listening');
    };
    rec.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join(' ');
      const updated = inputText ? `${inputText} ${transcript}` : transcript;
      setInputText(updated);
      setCommittedText(updated);
    };
    rec.onend = () => {
      setIsRecording(false);
      setVoiceStatus('done');
    };
    rec.onerror = () => {
      setIsRecording(false);
      setVoiceStatus('idle');
    };

    recognitionRef.current = rec;
    rec.start();
  }

  const handleSubmit = () => {
    if (canSubmit || inputText.trim()) navigate('/trip-params', { state: { inputText } });
  };

  const statusLabel =
    voiceStatus === 'listening' ? 'Listening...' :
    voiceStatus === 'done'      ? 'Tap to speak again' :
                                  'Tap to speak';

  return (
    <div
      style={{
        background: tm.bgPrimary,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: fonts.body,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: `1px solid ${tm.borderSubtle}`,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={16} color={tm.textPrimary} />
        </button>
        <h1 style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary, margin: 0 }}>
          New Trip
        </h1>
        <div style={{ width: '36px' }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 16px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── Voice section ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>


          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, margin: '0 0 6px' }}>
              Tell me about your trip
            </h2>
          </div>

          {/* Pulsing mic button */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px' }}>
            {/* Pulse rings — only when recording */}
            <AnimatePresence>
              {isRecording && (
                <>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1 + i * 0.4, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.3, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: tm.accentAmber,
                        pointerEvents: 'none',
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Idle soft pulse */}
            {!isRecording && (
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.1, 0.25] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: tm.accentAmber,
                  pointerEvents: 'none',
                }}
              />
            )}

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={toggleRecording}
              animate={isRecording ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={isRecording ? { repeat: Infinity, duration: 0.8 } : {}}
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: isRecording
                  ? `linear-gradient(135deg, ${tm.accentRed}, #c0392b)`
                  : `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isRecording
                  ? `0 6px 28px ${tm.accentRed}60`
                  : `0 6px 28px ${tm.accentAmber}60`,
                position: 'relative', zIndex: 1,
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {isRecording
                ? <MicOff size={28} color="#fff" />
                : <Sparkles size={28} color="#fff" />
              }
            </motion.button>
          </div>

          {/* Status label */}
          <AnimatePresence mode="wait">
            <motion.p
              key={voiceStatus}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: '12px', fontFamily: fonts.mono, margin: 0,
                color: isRecording ? tm.accentAmber : tm.textSecondary,
                fontWeight: isRecording ? 600 : 400,
              }}
            >
              {statusLabel}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── Divider ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>or type below</span>
          <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
        </div>

        {/* ── Text input ── */}
        <div
          style={{
            background: tm.bgSurface,
            border: `1px solid ${inputText ? `${tm.accentAmber}50` : tm.borderSubtle}`,
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'border-color 0.2s ease',
          }}
        >
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitText(); } }}
            placeholder={EXAMPLE_TEXT}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: '15px', color: tm.textPrimary, fontFamily: fonts.body,
              resize: 'none', lineHeight: 1.7, minHeight: '90px',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            {!inputText && (
              <button
                onClick={() => { setInputText(EXAMPLE_TEXT); setCommittedText(EXAMPLE_TEXT); }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: 0, fontSize: '12px',
                  color: tm.accentAmber, fontFamily: fonts.mono,
                }}
              >
                ↑ Use example
              </button>
            )}
            <div style={{ flex: 1 }} />
            <AnimatePresence>
              {isDirty && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={commitText}
                  onKeyDown={e => e.key === 'Enter' && commitText()}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: tm.accentAmber, border: 'none',
                    borderRadius: '50%', width: '30px', height: '30px',
                    cursor: 'pointer',
                  }}
                >
                  <SendHorizonal size={13} color="#ffffff" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Chips ── */}
        <AnimatePresence>
          {inputText.trim() ? (
            <motion.div
              key="chips"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* Detected */}
              <div>
                <p style={{ fontSize: '10px', fontFamily: fonts.mono, fontWeight: 600, color: tm.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                  Detected
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <AnimatePresence>
                    {DETECTED_CHIPS.filter(c => visibleChips.includes(c.id)).map(chip => (
                      <motion.div
                        key={chip.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{
                          display: 'inline-flex', alignItems: 'center',
                          background: `${tm.accentAmber}20`, border: `1px solid ${tm.accentAmber}50`,
                          borderRadius: '20px', padding: '6px 12px',
                        }}
                      >
                        <span style={{ fontSize: '12px', color: tm.accentAmber, fontFamily: fonts.mono, fontWeight: 600 }}>
                          {chip.label}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {visibleChips.length === 0 && (
                    <p style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, margin: 0 }}>
                      No details detected yet
                    </p>
                  )}
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, margin: 0 }}
            >
              Detected details will appear here...
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── CTA ── */}
        <div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!canSubmit && !inputText.trim()}
            style={{
              width: '100%',
              background: canSubmit || inputText.trim() ? tm.accentAmber : tm.bgElevated,
              border: `1px solid ${canSubmit || inputText.trim() ? tm.accentAmber : tm.borderSubtle}`,
              borderRadius: '16px', padding: '16px', cursor: canSubmit || inputText.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: canSubmit || inputText.trim() ? `0 4px 18px ${tm.accentAmber}40` : 'none',
            }}
          >
            <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: canSubmit || inputText.trim() ? '#ffffff' : tm.textSecondary }}>
              Review Trip Details
            </span>
            <span style={{ fontSize: '15px', color: canSubmit || inputText.trim() ? '#ffffff' : tm.textSecondary }}>→</span>
          </motion.button>

        </div>

      </div>
    </div>
  );
}
