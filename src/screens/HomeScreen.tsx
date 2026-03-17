import type { Screen } from '../types';
import styles from './HomeScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.sky}>
        <div className={styles.cloud} style={{ top: '8%', left: '10%', animationDelay: '0s' }} />
        <div className={styles.cloud} style={{ top: '14%', right: '15%', animationDelay: '2s' }} />
        <div className={styles.cloud} style={{ top: '5%', left: '50%', animationDelay: '4s' }} />
      </div>

      <div className={styles.hero}>
        <div className={styles.islandEmoji}>🏝️</div>
        <h1 className={styles.title}>小岛 · Havenly</h1>
        <p className={styles.subtitle}>你的心情小岛，安全、温暖、属于你</p>
      </div>

      <div className={styles.grid}>
        <button
          className={`${styles.card} ${styles.cardMood}`}
          onClick={() => onNavigate('mood')}
        >
          <span className={styles.cardEmoji}>🌈</span>
          <span className={styles.cardLabel}>今天心情</span>
          <span className={styles.cardDesc}>记录你现在的感受</span>
        </button>

        <button
          className={`${styles.card} ${styles.cardChat}`}
          onClick={() => onNavigate('chat')}
        >
          <span className={styles.cardEmoji}>💬</span>
          <span className={styles.cardLabel}>和岛岛说话</span>
          <span className={styles.cardDesc}>AI 陪伴，随时倾听</span>
        </button>

        <button
          className={`${styles.card} ${styles.cardGarden}`}
          onClick={() => onNavigate('garden')}
        >
          <span className={styles.cardEmoji}>🌱</span>
          <span className={styles.cardLabel}>我的小花园</span>
          <span className={styles.cardDesc}>养宠物、种植物</span>
        </button>

        <button
          className={`${styles.card} ${styles.cardDashboard}`}
          onClick={() => onNavigate('dashboard')}
        >
          <span className={styles.cardEmoji}>📊</span>
          <span className={styles.cardLabel}>数据分析</span>
          <span className={styles.cardDesc}>了解心情变化趋势</span>
        </button>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerText}>🌟 每天记录心情，积累快乐币 🪙</span>
      </div>
    </div>
  );
}
