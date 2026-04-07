import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DEMO_EMAIL    = 'arjun.menon@company.com';
const DEMO_PASSWORD = 'tripmind2024';

export function SignInScreen() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { isDark } = useTheme();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [demoFilled, setDemoFilled] = useState(false);

  const emailRef    = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSignIn() {
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.error ?? 'Something went wrong. Try again.');
    }
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setDemoFilled(true);
    setError('');
  }

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <div style={{
      background: tm.bgPrimary,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: fonts.body,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Decorative background ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: -80, left: -60,
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: 120, right: -80,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          width: 260, height: 100,
          background: 'radial-gradient(ellipse, rgba(245,166,35,0.10) 0%, transparent 70%)',
        }} />
        {/* Grid dots */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i % 6) * 20 + 5}%`,
            top: `${Math.floor(i / 6) * 22 + 8}%`,
            width: 2, height: 2, borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          }} />
        ))}
      </div>

      {/* ── Top hero ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '44px 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 26 }}
          style={{
            width: '72px', height: '72px', borderRadius: '22px',
            background: `linear-gradient(135deg, ${tm.accentAmber} 0%, #e8890f 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '34px',
            boxShadow: '0 8px 32px rgba(245,166,35,0.45)',
            marginBottom: '16px',
          }}
        >
          🤖
        </motion.div>

        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ margin: 0, fontSize: '26px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, letterSpacing: '-0.5px' }}
        >
          TripMind
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ margin: '4px 0 0', fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono }}
        >
          AI-powered corporate travel
        </motion.p>
      </div>

      {/* ── Form card ── */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          position: 'relative', zIndex: 1,
          margin: '0 16px',
          background: tm.bgSurface,
          border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '24px',
          padding: '24px 20px',
        }}
      >
        <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
          Welcome back 👋
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono }}>
          Sign in to continue managing your trips.
        </p>

        {/* Email */}
        <FieldLabel label="Work email" />
        <InputWrap icon={<Mail size={14} color={tm.textSecondary} />}>
          <input
            ref={emailRef}
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && passwordRef.current?.focus()}
            style={inputStyle()}
          />
        </InputWrap>

        {/* Password */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <FieldLabel label="Password" inline />
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: tm.accentAmber, fontFamily: fonts.mono }}
            >
              Forgot password?
            </button>
          </div>
          <InputWrap icon={<Lock size={14} color={tm.textSecondary} />} trailing={
            <button
              onClick={() => setShowPass(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center' }}
            >
              {showPass
                ? <EyeOff size={14} color={tm.textSecondary} />
                : <Eye size={14} color={tm.textSecondary} />}
            </button>
          }>
            <input
              ref={passwordRef}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && canSubmit && handleSignIn()}
              style={inputStyle()}
            />
          </InputWrap>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                marginTop: '10px', padding: '8px 12px', borderRadius: '10px',
                background: `${tm.accentRed}12`, border: `1px solid ${tm.accentRed}30`,
              }}
            >
              <AlertCircle size={13} color={tm.accentRed} />
              <span style={{ fontSize: '11px', color: tm.accentRed, fontFamily: fonts.mono }}>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign in button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSignIn}
          disabled={!canSubmit || loading}
          style={{
            width: '100%', marginTop: '18px', padding: '14px',
            borderRadius: '14px', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
            background: canSubmit
              ? 'linear-gradient(135deg, #F5A623 0%, #e8890f 100%)'
              : isDark ? '#21262D' : '#E4E8ED',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s',
            boxShadow: canSubmit ? '0 4px 18px rgba(245,166,35,0.35)' : 'none',
          }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }}
            />
          ) : (
            <>
              <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: canSubmit ? '#fff' : tm.textSecondary }}>
                Sign in
              </span>
              <ArrowRight size={15} color={canSubmit ? '#fff' : tm.textSecondary} />
            </>
          )}
        </motion.button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
          <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono }}>or</span>
          <div style={{ flex: 1, height: '1px', background: tm.borderSubtle }} />
        </div>

        {/* Google */}
        <button
          style={{
            width: '100%', padding: '12px', borderRadius: '14px',
            background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span style={{ fontSize: '13px', fontFamily: fonts.body, fontWeight: 500, color: tm.textPrimary }}>
            Continue with Google
          </span>
        </button>
      </motion.div>

      {/* ── Demo credentials hint ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          position: 'relative', zIndex: 1,
          margin: '12px 16px 0',
          padding: '12px 16px',
          borderRadius: '16px',
          background: `${tm.accentAmber}10`,
          border: `1px solid ${tm.accentAmber}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
          <Sparkles size={13} color={tm.accentAmber} style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: '11px', fontFamily: fonts.heading, fontWeight: 700, color: tm.accentAmber }}>
              Try demo credentials
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, lineHeight: 1.4 }}>
              {DEMO_EMAIL} · tripmind2024
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={fillDemo}
          style={{
            flexShrink: 0, padding: '6px 12px', borderRadius: '10px',
            background: tm.accentAmber, border: 'none', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '11px', fontFamily: fonts.mono, fontWeight: 600, color: '#fff' }}>
            {demoFilled ? 'Filled ✓' : 'Use it'}
          </span>
        </motion.button>
      </motion.div>

      {/* ── Footer ── */}
      <div style={{ flex: 1 }} />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        style={{ textAlign: 'center', fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono, padding: '20px 24px 28px' }}
      >
        Don't have an account?{' '}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: tm.accentAmber, fontFamily: fonts.mono, fontSize: '12px', fontWeight: 600 }}>
          Get started →
        </button>
      </motion.p>
    </div>
  );
}

/* ── Tiny helpers ── */
function FieldLabel({ label, inline }: { label: string; inline?: boolean }) {
  return (
    <p style={{ margin: inline ? 0 : '0 0 6px', fontSize: '11px', fontFamily: fonts.mono, fontWeight: 600, color: tm.textSecondary, letterSpacing: '0.04em' }}>
      {label}
    </p>
  );
}

function InputWrap({ icon, trailing, children }: { icon: React.ReactNode; trailing?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
      borderRadius: '12px', padding: '0 12px', height: '46px',
    }}>
      {icon}
      {children}
      {trailing}
    </div>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    fontSize: '13px', fontFamily: fonts.mono, color: tm.textPrimary,
    minWidth: 0,
  };
}
