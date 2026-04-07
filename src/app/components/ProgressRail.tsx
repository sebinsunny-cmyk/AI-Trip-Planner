import { motion } from 'motion/react';
import { tm, fonts } from '../constants/colors';

interface ProgressRailProps {
  currentStep: number;
  totalSteps?: number;
  isGate?: boolean;
}

export function ProgressRail({ currentStep, totalSteps = 8, isGate }: ProgressRailProps) {
  return (
    <div style={{ padding: '10px 16px 8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: '3px',
                borderRadius: '2px',
                background: isCompleted ? tm.accentTeal : tm.bgElevated,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isActive && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isGate
                      ? `linear-gradient(90deg, ${tm.accentAmber}, ${tm.accentAmber}aa)`
                      : tm.accentAmber,
                    borderRadius: '2px',
                    boxShadow: isGate ? `0 0 8px ${tm.accentAmber}` : 'none',
                  }}
                  animate={isGate ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '11px',
            color: isGate ? tm.accentAmber : tm.textSecondary,
            fontFamily: fonts.mono,
            fontWeight: 500,
          }}
        >
          {isGate ? '⏸ Waiting for you' : `Step ${currentStep} of ${totalSteps}`}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: tm.textSecondary,
            fontFamily: fonts.mono,
          }}
        >
          {Math.round(((currentStep - 1) / totalSteps) * 100)}%
        </span>
      </div>
    </div>
  );
}
