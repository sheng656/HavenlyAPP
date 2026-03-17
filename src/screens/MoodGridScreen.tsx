import { useState } from 'react';
import type { Screen, MoodId } from '../types';
import { MOODS } from '../utils/moodData';
import { saveMoodEntry, addCoins, generateId } from '../utils/storage';
import styles from './MoodGridScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  onMoodSaved?: (moodId: MoodId) => void;
}

type Step = 'pick' | 'note' | 'done';

export default function MoodGridScreen({ onNavigate, onMoodSaved }: Props) {
  const [selectedMoodId, setSelectedMoodId] = useState<MoodId | null>(null);
  const [step, setStep] = useState<Step>('pick');
  const [note, setNote] = useState('');

  const selectedMood = MOODS.find((m) => m.id === selectedMoodId);

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
    onMoodSaved?.(selectedMoodId);
    setStep('done');
  };

  const handleReset = () => {
    setSelectedMoodId(null);
    setNote('');
    setStep('pick');
  };

  if (step === 'done') {
    return (
      <div className={styles.container}>
        <div className={styles.doneCard}>
          <div className={styles.doneEmoji}>{selectedMood?.emoji}</div>
          <h2 className={styles.doneTitle}>已记录！</h2>
          <p className={styles.doneText}>
            你感到<strong>{selectedMood?.label}</strong>，这种感受很重要。
          </p>
          <p className={styles.coinsEarned}>🪙 +10 快乐币</p>
          <div className={styles.doneActions}>
            <button className={styles.btnPrimary} onClick={() => onNavigate('chat')}>
              💬 和岛岛聊聊
            </button>
            <button className={styles.btnSecondary} onClick={handleReset}>
              再记一次
            </button>
            <button className={styles.btnGhost} onClick={() => onNavigate('home')}>
              回到主页
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'note') {
    return (
      <div className={styles.container}>
        <button className={styles.back} onClick={() => setStep('pick')}>← 返回</button>
        <div className={styles.noteCard}>
          <div className={styles.selectedMoodBig}>{selectedMood?.emoji}</div>
          <h2 className={styles.noteTitle}>你感到{selectedMood?.label}</h2>
          <p className={styles.notePrompt}>（可选）想说点什么吗？</p>
          <textarea
            className={styles.noteInput}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="今天发生了什么事让你有这种感受..."
            maxLength={200}
            rows={4}
          />
          <p className={styles.charCount}>{note.length}/200</p>
          <button className={styles.btnPrimary} onClick={handleSave}>
            保存心情 🌟
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => onNavigate('home')}>← 返回</button>
      <h1 className={styles.title}>现在，你感觉怎么样？</h1>
      <p className={styles.subtitle}>选一个最接近你感受的表情</p>

      <div className={styles.moodGrid}>
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            className={styles.moodBtn}
            style={{ '--mood-color': mood.color } as React.CSSProperties}
            onClick={() => handleMoodSelect(mood.id)}
          >
            <span className={styles.moodEmoji}>{mood.emoji}</span>
            <span className={styles.moodLabel}>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
