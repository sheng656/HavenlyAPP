import type { Screen, Language } from '../types';
import styles from './BottomNav.module.css';

interface Props {
  current: Screen;
  onNavigate: (screen: Screen) => void;
  language: Language;
}

const NAV_ITEMS: { id: Screen; emoji: string; label: Record<Language, string> }[] = [
  { id: 'home', emoji: '🏝️', label: { en: 'Home', zh: '主页' } },
  { id: 'mood', emoji: '🌈', label: { en: 'Mood', zh: '心情' } },
  { id: 'chat', emoji: '💬', label: { en: 'Chat', zh: '对话' } },
  { id: 'garden', emoji: '🌱', label: { en: 'Garden', zh: '花园' } },
  { id: 'dashboard', emoji: '📊', label: { en: 'Insights', zh: '数据' } },
];

export default function BottomNav({ current, onNavigate, language }: Props) {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${current === item.id ? styles.active : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className={styles.navEmoji}>{item.emoji}</span>
          <span className={styles.navLabel}>{item.label[language]}</span>
        </button>
      ))}
    </nav>
  );
}
