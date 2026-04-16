import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Link2, Link2Off, Clock } from 'lucide-react';
import { tm, fonts } from '../constants/colors';
import {
  INTEGRATION_SERVICES,
  isIntegrationConnected,
  setIntegrationConnected,
} from '../data/integrations';

export function IntegrationDetailScreen() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = INTEGRATION_SERVICES.find(s => s.id === serviceId);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (serviceId) setConnected(isIntegrationConnected(serviceId));
  }, [serviceId]);

  if (!service) {
    return (
      <div style={{ background: tm.bgPrimary, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: tm.textSecondary, fontFamily: fonts.mono, fontSize: '13px' }}>Integration not found</span>
      </div>
    );
  }

  const isGoogle = service.oauthStyle === 'google';
  const logoEl = (size: number) =>
    service.logoUrl ? (
      <img src={service.logoUrl} alt={service.name} style={{ width: size, height: size, objectFit: 'contain', display: 'block' }} />
    ) : service.logo ? (
      <img src={service.logo} alt={service.name} style={{ width: size * 0.72, height: size * 0.72, objectFit: 'contain', display: 'block', filter: service.logoFilter ?? 'none' }} />
    ) : service.logoWordmark ? (
      <span style={{ fontSize: `${size * 0.38}px`, fontWeight: service.logoWordmark.fontWeight, color: service.logoWordmark.color, letterSpacing: service.logoWordmark.letterSpacing, fontFamily: 'sans-serif', lineHeight: 1 }}>
        {service.logoWordmark.text}
      </span>
    ) : null;

  function handleDisconnect() {
    if (serviceId) {
      setIntegrationConnected(serviceId, false);
      setConnected(false);
    }
  }

  return (
    <div style={{ background: tm.bgPrimary, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

      {/* ── Header ── */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/settings')}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <ArrowLeft size={16} color={tm.textPrimary} />
        </motion.button>
        <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary, flex: 1 }}>
          {service.name}
        </span>
        {connected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: `${tm.accentTeal}18`, border: `1px solid ${tm.accentTeal}40`,
              borderRadius: '20px', padding: '4px 10px',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: tm.accentTeal }} />
            <span style={{ fontSize: '11px', color: tm.accentTeal, fontFamily: fonts.mono, fontWeight: 600 }}>Connected</span>
          </motion.div>
        )}
      </div>

      {/* ── Brand Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        style={{
          margin: '20px 20px 0',
          background: isGoogle ? tm.bgSurface : `${service.brand.color}12`,
          border: `1px solid ${isGoogle ? tm.borderSubtle : `${service.brand.color}30`}`,
          borderRadius: '20px',
          padding: '24px 20px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}
      >
        <div style={{
          width: 60, height: 60, borderRadius: '16px', flexShrink: 0,
          background: service.brand.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}>
          {logoEl(isGoogle ? 44 : 36)}
        </div>
        <div>
          <div style={{ fontSize: '18px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary, marginBottom: '3px' }}>
            {service.name}
          </div>
          <div style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.mono }}>
            {service.tagline}
          </div>
          <div style={{
            display: 'inline-block', marginTop: '8px',
            background: `${service.brand.color}18`,
            border: `1px solid ${service.brand.color}35`,
            borderRadius: '8px', padding: '2px 8px',
          }}>
            <span style={{ fontSize: '10px', color: service.brand.color, fontFamily: fonts.mono, fontWeight: 600 }}>
              {service.category}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Connected Account (when connected) ── */}
      {connected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '12px 20px 0',
            background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
            borderRadius: '16px', padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', letterSpacing: '0.08em' }}>
            CONNECTED ACCOUNT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: service.brand.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
                {service.mockAccount[0].toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontFamily: fonts.body, fontWeight: 600, color: tm.textPrimary }}>
                {service.mockAccount}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <Clock size={10} color={tm.textSecondary} />
                <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  Last synced: just now
                </span>
              </div>
            </div>
            <Check size={16} color={tm.accentTeal} />
          </div>
        </motion.div>
      )}

      {/* ── Capabilities ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ margin: '16px 20px 0' }}
      >
        <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', letterSpacing: '0.08em' }}>
          WHAT TRIPMIND CAN DO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {service.capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.07 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
                borderRadius: '12px', padding: '11px 14px',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{cap.icon}</span>
              <span style={{ fontSize: '12px', color: tm.textPrimary, fontFamily: fonts.body, lineHeight: 1.45 }}>
                {cap.text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Permissions ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        style={{ margin: '16px 20px 0' }}
      >
        <div style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 600, marginBottom: '10px', letterSpacing: '0.08em' }}>
          {connected ? 'GRANTED PERMISSIONS' : 'PERMISSIONS REQUIRED'}
        </div>
        <div style={{
          background: tm.bgSurface, border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '14px', overflow: 'hidden',
        }}>
          {service.permissions.map((perm, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 14px',
                borderBottom: i < service.permissions.length - 1 ? `1px solid ${tm.borderSubtle}` : 'none',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                background: connected ? `${tm.accentTeal}20` : `${tm.borderSubtle}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {connected
                  ? <Check size={10} color={tm.accentTeal} />
                  : <div style={{ width: 5, height: 5, borderRadius: '50%', background: tm.textSecondary }} />
                }
              </div>
              <span style={{ fontSize: '12px', color: tm.textSecondary, fontFamily: fonts.body, lineHeight: 1.4 }}>
                {perm}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <div style={{ padding: '20px 20px 40px', marginTop: 'auto' }}>
        {!connected ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/settings/integrations/${service.id}/connect`)}
            style={{
              width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
              background: isGoogle ? '#4285F4' : service.brand.color,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: `0 4px 20px ${isGoogle ? '#4285F440' : `${service.brand.color}40`}`,
            }}
          >
            <Link2 size={16} color="#fff" />
            <span style={{ fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
              Connect {service.name}
            </span>
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDisconnect}
            style={{
              width: '100%', padding: '14px', borderRadius: '14px', cursor: 'pointer',
              background: `${tm.accentRed}10`, border: `1px solid ${tm.accentRed}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <Link2Off size={15} color={tm.accentRed} />
            <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 600, color: tm.accentRed }}>
              Disconnect
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
