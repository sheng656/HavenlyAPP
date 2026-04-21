import type { Language } from '../types';
import styles from './LanguageSwitcher.module.css';

interface Props {
  current: Language;
  onChange: (language: Language) => void;
}

const OPTIONS: { id: Language; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'zh', label: '中文' },
];

export default function LanguageSwitcher({ current, onChange }: Props) {
  return (
    <div className={styles.container}>
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          className={`${styles.button} ${current === option.id ? styles.active : ''}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
