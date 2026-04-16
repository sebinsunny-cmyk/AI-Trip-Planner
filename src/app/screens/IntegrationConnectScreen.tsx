import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Shield, Check } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import { INTEGRATION_SERVICES, setIntegrationConnected } from '../data/integrations';

type Phase = 'redirecting-out' | 'oauth' | 'redirecting-back';

// ── TripMind logo mark ───────────────────────────────────────────────────────
function TripMindLogo({ size = 40 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: 'linear-gradient(135deg, #F5A623, #e8890f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.48, flexShrink: 0,
      boxShadow: '0 2px 10px rgba(245,166,35,0.4)',
    }}>
      🧭
    </div>
  );
}

// ── Phase 1 & 3: redirect splash ─────────────────────────────────────────────
function RedirectSplash({ serviceName, serviceColor, serviceLogo, redirectingBack }: {
  serviceName: string;
  serviceColor: string;
  serviceLogo: React.ReactNode;
  redirectingBack: boolean;
}) {
  return (
    <div style={{
      background: tm.bgPrimary, height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '32px', padding: '40px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {redirectingBack ? serviceLogo : <TripMindLogo size={52} />}
        <motion.div
          animate={{ x: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.9 }}
          style={{ display: 'flex', gap: '4px' }}
        >
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: serviceColor, opacity: 0.6,
            }} />
          ))}
        </motion.div>
        {redirectingBack ? <TripMindLogo size={52} /> : serviceLogo}
      </div>
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          style={{ fontSize: '14px', color: tm.textSecondary, fontFamily: fonts.mono }}
        >
          {redirectingBack
            ? `Authorized! Redirecting back to TripMind…`
            : `Opening ${serviceName} to authorize…`}
        </motion.div>
      </div>
    </div>
  );
}

// ── Google OAuth screen ──────────────────────────────────────────────────────
function GoogleOAuthScreen({ service, onAllow, onCancel }: {
  service: typeof INTEGRATION_SERVICES[0];
  onAllow: () => void;
  onCancel: () => void;
}) {
  const logoUrl = service.logoUrl ?? '';
  return (
    <div style={{ background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Google header */}
      <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
        <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
          alt="Google" style={{ height: 24, marginBottom: '20px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '18px' }}>
          <img src={logoUrl} alt={service.name} style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <div style={{ width: 28, height: 1, background: '#e0e0e0' }} />
          <TripMindLogo size={44} />
        </div>
        <p style={{ fontSize: '14px', color: '#202124', fontFamily: 'Google Sans, sans-serif', fontWeight: 500, margin: '0 0 4px' }}>
          TripMind wants access to your Google Account
        </p>
        <p style={{ fontSize: '12px', color: '#5f6368', fontFamily: 'Roboto, sans-serif', margin: 0 }}>
          {service.mockAccount}
        </p>
      </div>
      {/* Divider */}
      <div style={{ height: 1, background: '#e8eaed', margin: '18px 0' }} />
      {/* Scopes */}
      <div style={{ padding: '0 24px', flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: '12px', color: '#5f6368', fontFamily: 'Roboto, sans-serif', marginBottom: '12px' }}>
          This will allow TripMind to:
        </p>
        {service.permissions.map((perm, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
            <Check size={16} color='#1a73e8' style={{ marginTop: '1px', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#202124', fontFamily: 'Roboto, sans-serif', lineHeight: 1.45 }}>
              {perm}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', padding: '10px 12px', background: '#f8f9fa', borderRadius: '8px' }}>
          <Shield size={13} color='#5f6368' />
          <span style={{ fontSize: '11px', color: '#5f6368', fontFamily: 'Roboto, sans-serif', lineHeight: 1.4 }}>
            TripMind's use of this data is governed by its Privacy Policy and Terms of Service.
          </span>
        </div>
      </div>
      {/* Actions */}
      <div style={{ padding: '16px 24px 40px', display: 'flex', gap: '12px' }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #dadce0',
          background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#1a73e8',
          fontFamily: 'Google Sans, sans-serif', fontWeight: 500,
        }}>
          Cancel
        </button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onAllow} style={{
          flex: 1, padding: '10px', borderRadius: '6px', border: 'none',
          background: '#1a73e8', cursor: 'pointer', fontSize: '14px', color: '#fff',
          fontFamily: 'Google Sans, sans-serif', fontWeight: 500,
        }}>
          Allow
        </motion.button>
      </div>
    </div>
  );
}

// ── MakeMyTrip OAuth screen ───────────────────────────────────────────────────
function MMTOAuthScreen({ service, onAllow, onCancel }: {
  service: typeof INTEGRATION_SERVICES[0];
  onAllow: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{ background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* MMT Red header */}
      <div style={{ background: '#E8203D', padding: '24px 20px 20px', textAlign: 'center' }}>
        {service.logo && (
          <img src={service.logo} alt="MakeMyTrip"
            style={{ height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
        )}
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontFamily: 'sans-serif', margin: 0 }}>
          Authorization Request
        </p>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px 14px', background: '#fff5f6', border: '1px solid #ffd0d5', borderRadius: '10px' }}>
          <TripMindLogo size={36} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', fontFamily: 'sans-serif' }}>TripMind</div>
            <div style={{ fontSize: '11px', color: '#666', fontFamily: 'sans-serif' }}>is requesting access to your MakeMyTrip account</div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#555', fontFamily: 'sans-serif', marginBottom: '14px', fontWeight: 600 }}>
          TripMind will be able to:
        </p>
        {service.permissions.map((perm, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#E8203D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
              <Check size={10} color="#fff" />
            </div>
            <span style={{ fontSize: '12px', color: '#333', fontFamily: 'sans-serif', lineHeight: 1.4 }}>{perm}</span>
          </div>
        ))}
        <p style={{ fontSize: '10px', color: '#999', fontFamily: 'sans-serif', marginTop: '16px', lineHeight: 1.5 }}>
          By authorizing, you agree to share your MakeMyTrip account data with TripMind as described above.
        </p>
      </div>
      {/* Actions */}
      <div style={{ padding: '16px 20px 40px', display: 'flex', gap: '10px' }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
          background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#555', fontFamily: 'sans-serif', fontWeight: 500,
        }}>
          Cancel
        </button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onAllow} style={{
          flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
          background: '#E8203D', cursor: 'pointer', fontSize: '14px', color: '#fff', fontFamily: 'sans-serif', fontWeight: 700,
        }}>
          Authorize
        </motion.button>
      </div>
    </div>
  );
}

// ── Uber OAuth screen ─────────────────────────────────────────────────────────
function UberOAuthScreen({ service, onAllow, onCancel }: {
  service: typeof INTEGRATION_SERVICES[0];
  onAllow: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{ background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Black header */}
      <div style={{ background: '#000', padding: '28px 20px 22px', textAlign: 'center' }}>
        <div style={{ fontSize: '26px', fontWeight: 900, color: '#fff', fontFamily: 'sans-serif', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Uber
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontFamily: 'sans-serif', margin: 0, letterSpacing: '0.05em' }}>
          FOR BUSINESS
        </p>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <TripMindLogo size={40} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#000', fontFamily: 'UberMove, sans-serif' }}>TripMind</div>
            <div style={{ fontSize: '12px', color: '#666', fontFamily: 'sans-serif' }}>wants to connect to your Uber for Business account</div>
          </div>
        </div>
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: '18px' }} />
        <p style={{ fontSize: '12px', color: '#888', fontFamily: 'sans-serif', fontWeight: 600, marginBottom: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Access requested
        </p>
        {service.permissions.map((perm, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#000', flexShrink: 0, marginTop: '5px' }} />
            <span style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: 'sans-serif', lineHeight: 1.45 }}>{perm}</span>
          </div>
        ))}
        <p style={{ fontSize: '11px', color: '#aaa', fontFamily: 'sans-serif', marginTop: '18px', lineHeight: 1.5 }}>
          TripMind's access is subject to Uber for Business's Terms of Use.
        </p>
      </div>
      {/* Actions */}
      <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <motion.button whileTap={{ scale: 0.98 }} onClick={onAllow} style={{
          width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
          background: '#000', cursor: 'pointer', fontSize: '15px', color: '#fff',
          fontFamily: 'UberMove, sans-serif', fontWeight: 700, letterSpacing: '-0.2px',
        }}>
          Allow access
        </motion.button>
        <button onClick={onCancel} style={{
          width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0',
          background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#555', fontFamily: 'sans-serif',
        }}>
          Not now
        </button>
      </div>
    </div>
  );
}

// ── Ola OAuth screen ──────────────────────────────────────────────────────────
function OlaOAuthScreen({ service, onAllow, onCancel }: {
  service: typeof INTEGRATION_SERVICES[0];
  onAllow: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{ background: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Green header */}
      <div style={{ background: '#1A9E49', padding: '28px 20px 22px', textAlign: 'center' }}>
        {service.logo && (
          <img src={service.logo} alt="Ola" style={{ height: 30, objectFit: 'contain', filter: 'brightness(0) invert(1)', display: 'block', margin: '0 auto 10px' }} />
        )}
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontFamily: 'sans-serif', margin: 0, letterSpacing: '0.06em' }}>
          CORPORATE
        </p>
      </div>
      {/* White card */}
      <div style={{ margin: '16px', background: '#fff', borderRadius: '12px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 18px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <TripMindLogo size={38} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: 'sans-serif' }}>TripMind</div>
              <div style={{ fontSize: '11px', color: '#666', fontFamily: 'sans-serif' }}>Requesting permission for your Ola Corporate account</div>
            </div>
          </div>
          <div style={{ height: 1, background: '#f0f0f0', marginBottom: '16px' }} />
          {service.permissions.map((perm, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
              <Check size={14} color='#1A9E49' style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#333', fontFamily: 'sans-serif', lineHeight: 1.45 }}>{perm}</span>
            </div>
          ))}
        </div>
        {/* Actions inside white card */}
        <div style={{ padding: '14px 18px 20px', display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #e0e0e0',
            background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#555', fontFamily: 'sans-serif',
          }}>
            Deny
          </button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onAllow} style={{
            flex: 2, padding: '11px', borderRadius: '8px', border: 'none',
            background: '#1A9E49', cursor: 'pointer', fontSize: '14px', color: '#fff',
            fontFamily: 'sans-serif', fontWeight: 700,
          }}>
            Allow TripMind
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export function IntegrationConnectScreen() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = INTEGRATION_SERVICES.find(s => s.id === serviceId);
  const [phase, setPhase] = useState<Phase>('redirecting-out');

  // Auto-advance from Phase 1 → Phase 2
  useEffect(() => {
    const t = setTimeout(() => setPhase('oauth'), 1600);
    return () => clearTimeout(t);
  }, []);

  if (!service) return null;

  function handleAllow() {
    setPhase('redirecting-back');
    setTimeout(() => {
      if (serviceId) setIntegrationConnected(serviceId, true);
      navigate(`/settings/integrations/${serviceId}`, { replace: true });
    }, 1800);
  }

  function handleCancel() {
    navigate(`/settings/integrations/${serviceId}`, { replace: true });
  }

  const serviceLogoEl = (
    <div style={{
      width: 52, height: 52, borderRadius: 14,
      background: service.brand.iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)', flexShrink: 0,
    }}>
      {service.logoUrl
        ? <img src={service.logoUrl} alt={service.name} style={{ width: 36, height: 36, objectFit: 'contain' }} />
        : service.logo
          ? <img src={service.logo} alt={service.name} style={{ width: 32, height: 32, objectFit: 'contain', filter: service.logoFilter ?? 'none' }} />
          : service.logoWordmark
            ? <span style={{ fontSize: service.logoWordmark.fontSize, fontWeight: service.logoWordmark.fontWeight, color: service.logoWordmark.color, letterSpacing: service.logoWordmark.letterSpacing, fontFamily: 'sans-serif', lineHeight: 1 }}>{service.logoWordmark.text}</span>
            : null}
    </div>
  );

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Cancel button shown only in oauth phase */}
      {phase === 'oauth' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleCancel}
          style={{
            position: 'absolute', top: 16, left: 16, zIndex: 10,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(0,0,0,0.08)', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={15} color='#333' />
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {(phase === 'redirecting-out' || phase === 'redirecting-back') && (
          <motion.div
            key="redirect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ height: '100%' }}
          >
            <RedirectSplash
              serviceName={service.name}
              serviceColor={service.brand.color}
              serviceLogo={serviceLogoEl}
              redirectingBack={phase === 'redirecting-back'}
            />
          </motion.div>
        )}

        {phase === 'oauth' && (
          <motion.div
            key="oauth"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{ height: '100%' }}
          >
            {service.oauthStyle === 'google' && (
              <GoogleOAuthScreen service={service} onAllow={handleAllow} onCancel={handleCancel} />
            )}
            {service.oauthStyle === 'mmt' && (
              <MMTOAuthScreen service={service} onAllow={handleAllow} onCancel={handleCancel} />
            )}
            {service.oauthStyle === 'uber' && (
              <UberOAuthScreen service={service} onAllow={handleAllow} onCancel={handleCancel} />
            )}
            {service.oauthStyle === 'ola' && (
              <OlaOAuthScreen service={service} onAllow={handleAllow} onCancel={handleCancel} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
