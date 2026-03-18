import { useMemo } from 'react';
import type { Screen, AgeGroup } from '../types';
import AgeSwitcher from '../components/AgeSwitcher';
import { getMoodEntriesLast7Days } from '../utils/storage';
import { getMoodById } from '../utils/moodData';
import styles from './HomeScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  ageGroup: AgeGroup;
  onAgeChange: (age: AgeGroup) => void;
}

const DAILY_GREETINGS: Record<AgeGroup, string[]> = {
  toddler: [
    '今天，你是小岛上最亮的星星 ⭐',
    '我在这里，随时陪着你 💙',
    '有没有想和我说的悄悄话呀？🐧',
    '今天吃了什么好吃的？🍎',
    '你今天开心吗？来和我说说！😊',
  ],
  kid: [
    '嗨！今天过得怎么样？有什么想说的吗？🌈',
    '无论开心还是难过，岛岛都在这里 💙',
    '今天发生了什么有趣的事吗？📖',
    '有什么烦恼吗？我们可以一起聊聊 🐧',
    '记得今天记录一下心情哦，花园里的小伙伴等着你呢 🌱',
  ],
  teen: [
    '你有什么想法，都可以在这里说出来 💭',
    '今天的你，已经很了不起了 ✨',
    '压力大的时候，试试把感受写下来 📔',
    '不需要独自面对一切，我在这里 🐧',
    '情绪没有对错。你现在的感受，都是真实的 💙',
  ],
};

export default function HomeScreen({ onNavigate, ageGroup, onAgeChange }: Props) {
  const greeting = useMemo(() => {
    const list = DAILY_GREETINGS[ageGroup];
    // Pick by day-of-week so it feels "daily" but is deterministic
    return list[new Date().getDay() % list.length];
  }, [ageGroup]);

  const lastMoodEntry = useMemo(() => {
    const entries = getMoodEntriesLast7Days();
    return entries[0] ?? null;
  }, []);

  const lastMood = lastMoodEntry ? getMoodById(lastMoodEntry.moodId) : null;
  return (
    <div className={styles.container}>
      <AgeSwitcher current={ageGroup} onChange={onAgeChange} />
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

      {/* Quick Chat Widget */}
      <button className={styles.chatWidget} onClick={() => onNavigate('chat')}>
        <span className={styles.chatWidgetAvatar}>🐧</span>
        <div className={styles.chatWidgetBody}>
          <div className={styles.chatWidgetName}>岛岛</div>
          <div className={styles.chatWidgetMsg}>{greeting}</div>
          {lastMood && (
            <div className={styles.chatWidgetMood}>
              上次心情：{lastMood.emoji} {lastMood.label}
            </div>
          )}
        </div>
        <span className={styles.chatWidgetArrow}>›</span>
      </button>

      <div className={styles.footer}>
        <span className={styles.footerText}>🌟 每天记录心情，积累快乐币 🪙</span>
      </div>
    </div>
  );
}
