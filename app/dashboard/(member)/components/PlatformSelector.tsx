'use client';

import styles from './PlatformSelector.module.scss';

export type Platform =
  | 'BABYLIST'
  | 'AMAZON'
  | 'TARGET'
  | 'BUYBUYBABY'
  | 'WALMART'
  | 'OTHER';

const PLATFORMS: { value: Platform; label: string; icon: string; hint: string }[] = [
  { value: 'BABYLIST',   label: 'Babylist',    icon: '👶', hint: 'babylist.com'    },
  { value: 'AMAZON',     label: 'Amazon',      icon: '📦', hint: 'amazon.com'      },
  { value: 'TARGET',     label: 'Target',      icon: '🎯', hint: 'target.com'      },
  { value: 'BUYBUYBABY', label: 'buybuy BABY', icon: '🍼', hint: 'buybuybaby.com'  },
  { value: 'WALMART',    label: 'Walmart',     icon: '🛒', hint: 'walmart.com'     },
  { value: 'OTHER',      label: 'Other',       icon: '🔗', hint: 'any registry'    },
];

type Props = {
  value:    Platform | '';
  onChange: (p: Platform) => void;
};

export default function PlatformSelector({ value, onChange }: Props) {
  return (
    <div className={styles.grid} role="radiogroup" aria-label="Select registry platform">
      {PLATFORMS.map(({ value: pv, label, icon, hint }) => {
        const selected = pv === value;
        return (
          <button
            key={pv}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`${styles.tile} ${selected ? styles.tileSelected : ''}`}
            onClick={() => onChange(pv)}
          >
            <span className={styles.tileIcon} aria-hidden>{icon}</span>
            <span className={styles.tileLabel}>{label}</span>
            <span className={styles.tileHint}>{hint}</span>
          </button>
        );
      })}
    </div>
  );
}
