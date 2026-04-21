import { useEffect } from 'react';
import type { Language } from '../types';
import type { SpeciesData } from '../utils/speciesData';
import { SPECIES_DATA } from '../utils/speciesData';
import styles from './SpeciesCard.module.css';

export type { SpeciesData };
export { SPECIES_DATA };

interface Props {
  speciesId: string;
  onClose: () => void;
  language: Language;
}

export default function SpeciesCard({ speciesId, onClose, language }: Props) {
  const data = SPECIES_DATA[speciesId];
  const isZh = language === 'zh';

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
        <button type="button" className={styles.close} onClick={onClose} aria-label={isZh ? '关闭' : 'Close'}>✕</button>

        <div className={styles.header}>
          <div className={styles.emoji}>{data.emoji}</div>
          <div className={styles.name}>{isZh ? data.name : data.nameEn}</div>
          <div className={styles.kindBadge}>
            {data.kind === 'pet'
              ? (isZh ? '🐾 宠物伙伴' : '🐾 Pet Buddy')
              : (isZh ? '🌿 花园植物' : '🌿 Garden Plant')}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>📖</span>
            <span className={styles.sectionTitle}>{isZh ? '生物小知识' : 'Bio Facts'}</span>
          </div>
          <p className={styles.text}>{isZh ? data.bioFact : data.bioFactEn}</p>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>🧠</span>
            <span className={styles.sectionTitle}>{isZh ? '心理启示' : 'Mind Insight'}</span>
          </div>
          <p className={styles.insight}>{isZh ? data.psychInsight : data.psychInsightEn}</p>
          <div className={styles.metaphorBox}>
            <p className={styles.metaphor}>{isZh ? data.psychMetaphor : data.psychMetaphorEn}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
