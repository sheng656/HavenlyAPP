import { useEffect } from 'react';
import type { SpeciesData } from '../utils/speciesData';
import { SPECIES_DATA } from '../utils/speciesData';
import styles from './SpeciesCard.module.css';

export type { SpeciesData };
export { SPECIES_DATA };

interface Props {
  speciesId: string;
  onClose: () => void;
}

export default function SpeciesCard({ speciesId, onClose }: Props) {
  const data = SPECIES_DATA[speciesId];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="关闭">✕</button>

        <div className={styles.header}>
          <div className={styles.emoji}>{data.emoji}</div>
          <div className={styles.name}>{data.name}</div>
          <div className={styles.kindBadge}>
            {data.kind === 'pet' ? '🐾 宠物伙伴' : '🌿 花园植物'}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>📖</span>
            <span className={styles.sectionTitle}>生物小知识</span>
          </div>
          <p className={styles.text}>{data.bioFact}</p>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>🧠</span>
            <span className={styles.sectionTitle}>心理启示</span>
          </div>
          <p className={styles.insight}>{data.psychInsight}</p>
          <div className={styles.metaphorBox}>
            <p className={styles.metaphor}>{data.psychMetaphor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
