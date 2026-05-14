import { motion } from 'motion/react';
import { tm, fonts } from '../constants/colors';

export type EmptyStateVariant =
  | 'cancelled'
  | 'upcoming'
  | 'completed'
  | 'inProgress'
  | 'default';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void };
}

// ─── Per-variant accent color ─────────────────────────────────────────────────

const VARIANT_ACCENT: Record<EmptyStateVariant, string> = {
  cancelled:   tm.accentTeal,
  upcoming:    tm.accentAmber,
  completed:   tm.accentTeal,
  inProgress:  tm.accentAmber,
  default:     tm.accentAmber,
};

// ─── Single generic illustration — search / magnifying glass ─────────────────

function Illustration({ accent }: { accent: string }) {
  return (
    <svg width="160" height="152" viewBox="0 0 160 152" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outermost glow ring */}
      <circle cx="80" cy="74" r="72" fill={`${accent}08`} />

      {/* Mid ring */}
      <circle cx="80" cy="74" r="56" fill={`${accent}0E`} stroke={`${accent}18`} strokeWidth="1" />

      {/* Inner filled circle — card background */}
      <circle cx="80" cy="74" r="40" fill={tm.bgSurface} stroke={`${accent}25`} strokeWidth="1" />

      {/* ── Magnifying glass ── */}
      {/* Lens circle */}
      <circle
        cx="76"
        cy="70"
        r="17"
        fill={`${accent}12`}
        stroke={accent}
        strokeWidth="2.5"
      />
      {/* Lens inner glint */}
      <circle cx="70" cy="64" r="4" fill={`${accent}20`} />

      {/* Handle */}
      <line
        x1="88"
        y1="82"
        x2="97"
        y2="91"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Handle cap */}
      <circle cx="97" cy="91" r="2" fill={accent} />

      {/* ── Floating decorative dots ── */}
      <circle cx="26"  cy="34"  r="3"   fill={`${accent}38`} />
      <circle cx="136" cy="40"  r="2"   fill={`${accent}2C`} />
      <circle cx="20"  cy="104" r="2"   fill={`${accent}28`} />
      <circle cx="140" cy="110" r="3"   fill={`${accent}32`} />
      <circle cx="48"  cy="18"  r="1.5" fill={`${accent}28`} />
      <circle cx="114" cy="20"  r="1.5" fill={`${accent}22`} />
      <circle cx="144" cy="72"  r="1.5" fill={`${accent}22`} />
      <circle cx="16"  cy="70"  r="1.5" fill={`${accent}28`} />

      {/* ── Small sparkle crosses ── */}
      <g opacity="0.55">
        <line x1="32" y1="72" x2="32" y2="78" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="75" x2="35" y2="75" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g opacity="0.38">
        <line x1="128" y1="60" x2="128" y2="65" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="125.5" y1="62.5" x2="130.5" y2="62.5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* ── Dashed orbit ring ── */}
      <circle
        cx="80"
        cy="74"
        r="56"
        stroke={`${accent}18`}
        strokeWidth="1"
        strokeDasharray="4 6"
        fill="none"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EmptyState({ variant = 'default', title, subtitle, action }: EmptyStateProps) {
  const accent = VARIANT_ACCENT[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px 32px',
        textAlign: 'center',
      }}
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.4, ease: 'easeOut' }}
        style={{ marginBottom: '20px' }}
      >
        <Illustration accent={accent} />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <h3 style={{
          fontSize: '15px',
          fontFamily: fonts.heading,
          fontWeight: 800,
          color: tm.textPrimary,
          margin: '0 0 6px',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '12px',
          fontFamily: fonts.body,
          color: tm.textSecondary,
          margin: 0,
          lineHeight: 1.6,
          maxWidth: '220px',
        }}>
          {subtitle}
        </p>
      </motion.div>

      {/* Optional CTA */}
      {action && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          whileTap={{ scale: 0.96 }}
          onClick={action.onClick}
          style={{
            marginTop: '20px',
            padding: '10px 22px',
            borderRadius: '22px',
            background: accent,
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: fonts.heading,
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
