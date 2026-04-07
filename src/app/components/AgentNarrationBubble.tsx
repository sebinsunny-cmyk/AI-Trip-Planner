import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, ChevronDown } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

export type BubbleStatus = 'typing' | 'active' | 'done' | 'failed';

export interface NarrationBubble {
  id: string;
  step: number;
  text: string;
  status: BubbleStatus;
  timestamp: string;
  integration?: string;
  integrationIcon?: 'calendar' | 'flight' | 'cab' | 'hotel' | 'expense';
  completionText?: string; // shown in collapsed done row instead of truncated text
}

function IntegrationBadge({ name, icon }: { name: string; icon?: string }) {
  const iconMap: Record<string, string> = {
    calendar: '📅',
    flight:   '✈️',
    cab:      '🚕',
    hotel:    '🏨',
    expense:  '💳',
  };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
      borderRadius: '20px', padding: '2px 8px', marginBottom: '8px',
    }}>
      <span style={{ fontSize: '11px' }}>{icon ? iconMap[icon] : '🔗'}</span>
      <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 500 }}>
        {name}
      </span>
    </div>
  );
}

function StepStatusPill({ status }: { status: BubbleStatus | 'typing' }) {
  if (status === 'typing') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
        borderRadius: '20px', padding: '3px 10px',
      }}>
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: 'easeInOut' }}
            style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: tm.accentAmber }}
          />
        ))}
      </div>
    );
  }
  if (status === 'done') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        background: `${tm.accentTeal}20`, border: `1px solid ${tm.accentTeal}40`,
        borderRadius: '20px', padding: '3px 10px',
      }}>
        <Check size={10} color={tm.accentTeal} strokeWidth={3} />
        <span style={{ fontSize: '11px', color: tm.accentTeal, fontFamily: fonts.mono, fontWeight: 500 }}>Done</span>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        background: `${tm.accentRed}20`, border: `1px solid ${tm.accentRed}40`,
        borderRadius: '20px', padding: '3px 10px',
      }}>
        <AlertCircle size={10} color={tm.accentRed} />
        <span style={{ fontSize: '11px', color: tm.accentRed, fontFamily: fonts.mono, fontWeight: 500 }}>Failed</span>
      </div>
    );
  }
  if (status === 'active') {
    return (
      <motion.div
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          background: `${tm.accentAmber}20`, border: `1px solid ${tm.accentAmber}40`,
          borderRadius: '20px', padding: '3px 10px',
        }}
      >
        <span style={{ fontSize: '11px', color: tm.accentAmber, fontFamily: fonts.mono, fontWeight: 500 }}>In Progress</span>
      </motion.div>
    );
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: tm.bgElevated, border: `1px solid ${tm.borderSubtle}`,
      borderRadius: '20px', padding: '3px 10px',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: tm.textSecondary, display: 'inline-block' }} />
      <span style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, fontWeight: 500 }}>Pending</span>
    </div>
  );
}

export function TypewriterText({ text, onComplete, speed = 18 }: { text: string; onComplete?: () => void; speed?: number }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span>
      {displayText}
      {displayText.length < text.length && (
        <span style={{
          display: 'inline-block', width: '2px', height: '14px',
          background: tm.accentAmber, marginLeft: '1px',
          verticalAlign: 'text-bottom', animation: 'blink 0.7s step-end infinite',
        }} />
      )}
    </span>
  );
}

interface AgentNarrationBubbleProps {
  bubble: NarrationBubble;
  isLatest?: boolean;
  onTypingComplete?: () => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  actionCard?: React.ReactNode;
}

export function AgentNarrationBubble({
  bubble, isLatest, onTypingComplete, isExpanded, onToggle, actionCard,
}: AgentNarrationBubbleProps) {
  const isTyping   = bubble.status === 'typing' && isLatest;
  const isDone     = bubble.status === 'done';
  const isActive   = bubble.status === 'active' || isTyping;
  const collapsible = isDone && !isLatest;

  const iconMap: Record<string, string> = {
    calendar: '📅', flight: '✈️', cab: '🚕', hotel: '🏨', expense: '💳',
  };
  const integrationEmoji = bubble.integrationIcon ? iconMap[bubble.integrationIcon] : '🔗';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{
        background: tm.bgSurface,
        border: `1px solid ${collapsible && !isExpanded ? tm.borderSubtle : isActive ? `${tm.accentAmber}30` : tm.borderSubtle}`,
        borderRadius: '16px',
        marginBottom: '10px',
        overflow: 'hidden',
        opacity: collapsible && !isExpanded ? 0.7 : 1,
        transition: 'opacity 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* ── Collapsed done row (clickable header) ── */}
      {collapsible ? (
        <button
          onClick={onToggle}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
          }}
        >
          {/* Integration emoji badge */}
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: `${tm.accentTeal}18`, border: `1px solid ${tm.accentTeal}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', flexShrink: 0,
          }}>
            {integrationEmoji}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Prominent completion text */}
            <p style={{
              fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700,
              color: tm.accentTeal,
              margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {bubble.completionText ?? `${bubble.text.slice(0, 60)}…`}
            </p>
            {/* Step + integration as small secondary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                Step {bubble.step}
              </span>
              {bubble.integration && (
                <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                  · {bubble.integration}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <StepStatusPill status="done" />
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} color={tm.textSecondary} />
            </motion.div>
          </div>
        </button>
      ) : (
        /* ── Full bubble header (active / typing) ── */
        <div style={{ padding: '14px 14px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <motion.div
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${tm.accentAmber}, #e8890f)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px',
                  boxShadow: isActive ? `0 0 10px ${tm.accentAmber}60` : 'none',
                }}
              >
                🤖
              </motion.div>
              <span style={{ fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                TripMind
              </span>
              {bubble.step && (
                <span style={{
                  fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono,
                  background: tm.bgElevated, padding: '1px 6px', borderRadius: '4px',
                }}>
                  Step {bubble.step}
                </span>
              )}
            </div>
            <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
              {bubble.timestamp}
            </span>
          </div>
          {bubble.integration && (
            <IntegrationBadge name={bubble.integration} icon={bubble.integrationIcon} />
          )}
        </div>
      )}

      {/* ── Expandable body ── */}
      <AnimatePresence initial={false}>
        {(!collapsible || isExpanded) && (
          <motion.div
            key="body"
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: collapsible ? '12px 14px 14px' : '0 14px 14px' }}>
              {/* Show integration badge again when expanded from collapsed */}
              {collapsible && bubble.integration && (
                <IntegrationBadge name={bubble.integration} icon={bubble.integrationIcon} />
              )}

              <p style={{
                fontSize: '14px', lineHeight: 1.65, color: tm.textNarration,
                fontFamily: fonts.body, margin: '0 0 12px', fontWeight: 400,
              }}>
                {isTyping
                  ? <TypewriterText text={bubble.text} onComplete={onTypingComplete} />
                  : bubble.text}
              </p>

              <StepStatusPill status={isTyping ? 'typing' : bubble.status} />

              {/* Inline action card for expanded done steps */}
              {collapsible && isExpanded && actionCard && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ marginTop: '14px' }}
                >
                  {actionCard}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
