import { useMemo } from 'react';
import type { Screen, AgeGroup, Language } from '../types';
import AgeSwitcher from '../components/AgeSwitcher';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getMoodEntriesLast7Days } from '../utils/storage';
import { getMoodById, getMoodLabel } from '../utils/moodData';
import styles from './HomeScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  ageGroup: AgeGroup;
  onAgeChange: (age: AgeGroup) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const DAILY_GREETINGS: Record<Language, Record<AgeGroup, string[]>> = {
  en: {
    toddler: [
      'You are the brightest star on this island today ⭐',
      'I am right here with you 💙',
      'Want to tell me a tiny secret? 🐧',
      'Did you eat something yummy today? 🍎',
      'How are you feeling today? 😊',
    ],
    kid: [
      'Hi! How was your day? 🌈',
      'Happy or sad, Dodo is here for you 💙',
      'Anything fun happened today? 📖',
      'Got worries? We can talk it through 🐧',
      'Log your mood today. Your garden friends are waiting 🌱',
    ],
    teen: [
      'You can say whatever is on your mind here 💭',
      'You did well today, truly ✨',
      'If stress feels heavy, try writing it down 📔',
      'You do not have to handle everything alone 🐧',
      'Your feelings are valid, exactly as they are 💙',
    ],
  },
  zh: {
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
  },
};

const TEXT = {
  en: {
    appTitle: 'Havenly Island',
    subtitle: 'A safe, warm place for your feelings',
    moodLabel: 'Today\'s Mood',
    moodDesc: 'Track how you feel right now',
    chatLabel: 'Talk with Dodo',
    chatDesc: 'AI companion, always listening',
    gardenLabel: 'My Garden',
    gardenDesc: 'Care for pets and plants',
    dashboardLabel: 'Insights',
    dashboardDesc: 'See your mood trends',
    widgetName: 'Dodo',
    lastMoodPrefix: 'Last mood:',
    footer: 'Log your mood every day and collect joy coins 🪙',
  },
  zh: {
    appTitle: '小岛 · Havenly',
    subtitle: '你的心情小岛，安全、温暖、属于你',
    moodLabel: '今天心情',
    moodDesc: '记录你现在的感受',
    chatLabel: '和岛岛说话',
    chatDesc: 'AI 陪伴，随时倾听',
    gardenLabel: '我的小花园',
    gardenDesc: '养宠物、种植物',
    dashboardLabel: '数据分析',
    dashboardDesc: '了解心情变化趋势',
    widgetName: '岛岛',
    lastMoodPrefix: '上次心情：',
    footer: '🌟 每天记录心情，积累快乐币 🪙',
  },
};

export default function HomeScreen({ onNavigate, ageGroup, onAgeChange, language, onLanguageChange }: Props) {
  const greeting = useMemo(() => {
    const list = DAILY_GREETINGS[language][ageGroup];
    // Pick by day-of-week so it feels "daily" but is deterministic
    return list[new Date().getDay() % list.length];
  }, [ageGroup, language]);

  const lastMoodEntry = useMemo(() => {
    const entries = getMoodEntriesLast7Days();
    return entries[0] ?? null;
  }, []);

  const lastMood = lastMoodEntry ? getMoodById(lastMoodEntry.moodId) : null;
  const t = TEXT[language];

  return (
    <div className={styles.container}>
      <LanguageSwitcher current={language} onChange={onLanguageChange} />
      <AgeSwitcher current={ageGroup} onChange={onAgeChange} language={language} />
      <div className={styles.sky}>
        <div className={styles.cloud} style={{ top: '8%', left: '10%', animationDelay: '0s' }} />
        <div className={styles.cloud} style={{ top: '14%', right: '15%', animationDelay: '2s' }} />
        <div className={styles.cloud} style={{ top: '5%', left: '50%', animationDelay: '4s' }} />
      </div>

      <div className={styles.hero}>
        <div className={styles.islandEmoji}>🏝️</div>
        <h1 className={styles.title}>{t.appTitle}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </div>

      <div className={styles.grid}>
        <button
          className={`${styles.card} ${styles.cardMood}`}
          onClick={() => onNavigate('mood')}
        >
          <span className={styles.cardEmoji}>🌈</span>
          <span className={styles.cardLabel}>{t.moodLabel}</span>
          <span className={styles.cardDesc}>{t.moodDesc}</span>
        </button>

        <button
          className={`${styles.card} ${styles.cardChat}`}
          onClick={() => onNavigate('chat')}
        >
          <span className={styles.cardEmoji}>💬</span>
          <span className={styles.cardLabel}>{t.chatLabel}</span>
          <span className={styles.cardDesc}>{t.chatDesc}</span>
        </button>

        <button
          className={`${styles.card} ${styles.cardGarden}`}
          onClick={() => onNavigate('garden')}
        >
          <span className={styles.cardEmoji}>🌱</span>
          <span className={styles.cardLabel}>{t.gardenLabel}</span>
          <span className={styles.cardDesc}>{t.gardenDesc}</span>
        </button>

        <button
          className={`${styles.card} ${styles.cardDashboard}`}
          onClick={() => onNavigate('dashboard')}
        >
          <span className={styles.cardEmoji}>📊</span>
          <span className={styles.cardLabel}>{t.dashboardLabel}</span>
          <span className={styles.cardDesc}>{t.dashboardDesc}</span>
        </button>
      </div>

      {/* Quick Chat Widget */}
      <button className={styles.chatWidget} onClick={() => onNavigate('chat')}>
        <span className={styles.chatWidgetAvatar}>🐧</span>
        <div className={styles.chatWidgetBody}>
          <div className={styles.chatWidgetName}>{t.widgetName}</div>
          <div className={styles.chatWidgetMsg}>{greeting}</div>
          {lastMood && (
            <div className={styles.chatWidgetMood}>
              {t.lastMoodPrefix} {lastMood.emoji} {getMoodLabel(lastMood, language)}
            </div>
          )}
        </div>
        <span className={styles.chatWidgetArrow}>›</span>
      </button>

      <div className={styles.footer}>
        <span className={styles.footerText}>{t.footer}</span>
      </div>
    </div>
  );
}
