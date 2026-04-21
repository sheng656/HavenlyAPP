import type { AgeGroup, Language } from '../types';
import styles from './AgeSwitcher.module.css';

interface Props {
  current: AgeGroup;
  onChange: (age: AgeGroup) => void;
  language: Language;
}

const AGE_OPTIONS: { id: AgeGroup; label: Record<Language, string> }[] = [
  { id: 'toddler', label: { en: 'Little One', zh: '小宝贝' } },
  { id: 'kid', label: { en: 'Kid', zh: '小朋友' } },
  { id: 'teen', label: { en: 'Teen', zh: '少年' } },
];

export default function AgeSwitcher({ current, onChange, language }: Props) {
  return (
    <div className={styles.container}>
      {AGE_OPTIONS.map((option) => (
        <button
          key={option.id}
          className={`${styles.button} ${current === option.id ? `${styles.active} ${styles[option.id]}` : ''}`}
          onClick={() => onChange(option.id)}
        >
          {option.label[language]}
        </button>
      ))}
    </div>
  );
}
