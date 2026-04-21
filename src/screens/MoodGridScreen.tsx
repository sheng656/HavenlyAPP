import { useState } from 'react';
import type { Screen, MoodId, AgeGroup, Language } from '../types';
import { MOODS, getMoodLabel } from '../utils/moodData';
import { saveMoodEntry, addCoins, generateId, onMoodLogged } from '../utils/storage';
import styles from './MoodGridScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  onMoodSaved?: (moodId: MoodId) => void;
  ageGroup: AgeGroup;
  language: Language;
}

type Step = 'pick' | 'note' | 'done';

export default function MoodGridScreen({ onNavigate, onMoodSaved, ageGroup, language }: Props) {
  const [selectedMoodId, setSelectedMoodId] = useState<MoodId | null>(null);
  const [step, setStep] = useState<Step>('pick');
  const [note, setNote] = useState('');

  const selectedMood = MOODS.find((m) => m.id === selectedMoodId);

  // Filter moods based on age group
  const displayedMoods = ageGroup === 'toddler'
    ? MOODS.filter((m) => ['happy', 'sad', 'angry', 'scared', 'loved'].includes(m.id))
    : MOODS;

  const handleMoodSelect = (id: MoodId) => {
    setSelectedMoodId(id);
    setStep('note');
  };

  const handleSave = () => {
    if (!selectedMoodId) return;
    saveMoodEntry({
      id: generateId(),
      moodId: selectedMoodId,
      note,
      timestamp: Date.now(),
      intensity: selectedMood?.intensity ?? 3,
    });
    addCoins(10);
    onMoodLogged(); // update streak and apply garden auto-bonus
    onMoodSaved?.(selectedMoodId);
    setStep('done');
  };

  const handleReset = () => {
    setSelectedMoodId(null);
    setNote('');
    setStep('pick');
  };

  const isZh = language === 'zh';
  const selectedMoodLabel = selectedMood ? getMoodLabel(selectedMood, language) : '';

  const text = {
    doneTitle: isZh ? '已记录！' : 'Saved!',
    doneText: isZh
      ? <>你感到<strong>{selectedMoodLabel}</strong>，这种感受很重要。</>
      : <>You felt <strong>{selectedMoodLabel}</strong>. This feeling matters.</>,
    coinsEarned: isZh ? '🪙 +10 快乐币' : '🪙 +10 Joy Coins',
    chatBtn: isZh ? '💬 和岛岛聊聊' : '💬 Talk with Dodo',
    againBtn: isZh ? '再记一次' : 'Log Again',
    homeBtn: isZh ? '回到主页' : 'Back Home',
    back: isZh ? '← 返回' : '← Back',
    noteTitle: ageGroup === 'teen'
      ? (isZh ? `此刻感到: ${selectedMoodLabel}` : `Feeling right now: ${selectedMoodLabel}`)
      : isZh
      ? `你感到${selectedMoodLabel}`
      : `You feel ${selectedMoodLabel}`,
    notePrompt: ageGroup === 'teen'
      ? (isZh ? '写下你的想法（日记）...' : 'Write your thoughts (journal)...')
      : (isZh ? '（可选）想说点什么吗？' : '(Optional) Want to share more?'),
    teenPlaceholder: isZh ? '今天经历了什么？...' : 'What happened today?...',
    kidPlaceholder: isZh ? '今天发生了什么事让你有这种感受...' : 'What happened that made you feel this way...',
    saveBtn: ageGroup === 'teen'
      ? (isZh ? '保存日记 📔' : 'Save Journal 📔')
      : (isZh ? '保存心情 🌟' : 'Save Mood 🌟'),
    pageTitle: ageGroup === 'toddler'
      ? (isZh ? '今天开心吗？' : 'How do you feel today?')
      : ageGroup === 'teen'
      ? (isZh ? '此刻的心情...' : 'Mood right now...')
      : (isZh ? '现在，你感觉怎么样？' : 'How are you feeling right now?'),
    subtitle: ageGroup === 'toddler'
      ? (isZh ? '点一个小脸蛋' : 'Tap a little face')
      : (isZh ? '选一个最接近你感受的表情' : 'Pick the emoji closest to your feeling'),
  };

  if (step === 'done') {
    return (
      <div className={styles.container}>
        <div className={styles.doneCard}>
          <div className={styles.doneEmoji}>{selectedMood?.emoji}</div>
          <h2 className={styles.doneTitle}>{text.doneTitle}</h2>
          <p className={styles.doneText}>{text.doneText}</p>
          <p className={styles.coinsEarned}>{text.coinsEarned}</p>
          <div className={styles.doneActions}>
            <button className={styles.btnPrimary} onClick={() => onNavigate('chat')}>
              {text.chatBtn}
            </button>
            <button className={styles.btnSecondary} onClick={handleReset}>
              {text.againBtn}
            </button>
            <button className={styles.btnGhost} onClick={() => onNavigate('home')}>
              {text.homeBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'note') {
    return (
      <div className={styles.container}>
        <button className={styles.back} onClick={() => setStep('pick')}>{text.back}</button>
        <div className={styles.noteCard}>
          <div className={styles.selectedMoodBig}>{selectedMood?.emoji}</div>
          <h2 className={styles.noteTitle}>{text.noteTitle}</h2>
          
          {ageGroup !== 'toddler' && (
            <>
              <p className={styles.notePrompt}>{text.notePrompt}</p>
              <textarea
                className={styles.noteInput}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={ageGroup === 'teen' ? text.teenPlaceholder : text.kidPlaceholder}
                maxLength={ageGroup === 'teen' ? 1000 : 200}
                rows={ageGroup === 'teen' ? 8 : 4}
              />
              <p className={styles.charCount}>{note.length}/{ageGroup === 'teen' ? 1000 : 200}</p>
            </>
          )}

          <button className={styles.btnPrimary} onClick={handleSave}>
            {text.saveBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => onNavigate('home')}>{text.back}</button>
      <h1 className={styles.title}>{text.pageTitle}</h1>
      <p className={styles.subtitle}>{text.subtitle}</p>

      <div className={styles.moodGrid}>
        {displayedMoods.map((mood) => (
          <button
            key={mood.id}
            className={styles.moodBtn}
            style={{ '--mood-color': mood.color } as React.CSSProperties}
            onClick={() => handleMoodSelect(mood.id)}
          >
            <span className={styles.moodEmoji}>{mood.emoji}</span>
            <span className={styles.moodLabel}>{getMoodLabel(mood, language)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
