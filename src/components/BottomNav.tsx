import type { Screen } from '../types';
import styles from './BottomNav.module.css';

interface Props {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { id: Screen; emoji: string; label: string }[] = [
  { id: 'home', emoji: '🏝️', label: '主页' },
  { id: 'mood', emoji: '🌈', label: '心情' },
  { id: 'chat', emoji: '💬', label: '对话' },
  { id: 'garden', emoji: '🌱', label: '花园' },
  { id: 'dashboard', emoji: '📊', label: '数据' },
];

export default function BottomNav({ current, onNavigate }: Props) {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${current === item.id ? styles.active : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className={styles.navEmoji}>{item.emoji}</span>
          <span className={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
