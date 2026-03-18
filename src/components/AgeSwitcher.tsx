import { AgeGroup } from '../types';
import styles from './AgeSwitcher.module.css';

interface Props {
  current: AgeGroup;
  onChange: (age: AgeGroup) => void;
}

const AGE_OPTIONS: { id: AgeGroup; label: string }[] = [
  { id: 'toddler', label: '小宝贝' },
  { id: 'kid', label: '小朋友' },
  { id: 'teen', label: '少年' },
];

export default function AgeSwitcher({ current, onChange }: Props) {
  return (
    <div className={styles.container}>
      {AGE_OPTIONS.map((option) => (
        <button
          key={option.id}
          className={`${styles.button} ${current === option.id ? `${styles.active} ${styles[option.id]}` : ''}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
