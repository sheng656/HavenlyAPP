import { useState, useMemo } from 'react';
import type { Screen } from '../types';
import { getMoodEntries, getMoodEntriesLast7Days, getMoodEntriesLast30Days } from '../utils/storage';
import { getMoodById } from '../utils/moodData';
import styles from './DashboardScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
}

type Period = '7' | '30' | 'all';

export default function DashboardScreen({ onNavigate }: Props) {
  const [period, setPeriod] = useState<Period>('7');

  const entries = useMemo(() => {
    if (period === '7') return getMoodEntriesLast7Days();
    if (period === '30') return getMoodEntriesLast30Days();
    return getMoodEntries();
  }, [period]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => {
      counts[e.moodId] = (counts[e.moodId] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({ mood: getMoodById(id as never), count }))
      .filter((x) => x.mood)
      .sort((a, b) => b.count - a.count);
  }, [entries]);

  const totalEntries = entries.length;

  const positiveCount = useMemo(
    () => entries.filter((e) => ['happy', 'excited', 'calm', 'loved'].includes(e.moodId)).length,
    [entries]
  );

  const positivePercent = totalEntries > 0 ? Math.round((positiveCount / totalEntries) * 100) : 0;

  const recentEntries = [...entries].slice(0, 10);

  const avgIntensity = useMemo(() => {
    if (!totalEntries) return 0;
    const sum = entries.reduce((acc, e) => acc + e.intensity, 0);
    return (sum / totalEntries).toFixed(1);
  }, [entries, totalEntries]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => onNavigate('home')}>← 返回</button>
        <h1 className={styles.title}>数据分析</h1>
        <div className={styles.headerSpacer} />
      </div>

      <div className={styles.periodSelector}>
        {(['7', '30', 'all'] as Period[]).map((p) => (
          <button
            key={p}
            className={`${styles.periodBtn} ${period === p ? styles.periodActive : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p === '7' ? '近 7 天' : p === '30' ? '近 30 天' : '全部'}
          </button>
        ))}
      </div>

      {totalEntries === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyEmoji}>📊</div>
          <p>还没有心情记录</p>
          <p>去记录第一次心情吧！</p>
          <button className={styles.goBtn} onClick={() => onNavigate('mood')}>
            记录心情 🌈
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryNum}>{totalEntries}</div>
              <div className={styles.summaryLabel}>记录次数</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={`${styles.summaryNum} ${styles.positive}`}>{positivePercent}%</div>
              <div className={styles.summaryLabel}>积极情绪占比</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryNum}>{avgIntensity}</div>
              <div className={styles.summaryLabel}>平均情绪强度</div>
            </div>
          </div>

          {/* Mood Breakdown */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>情绪分布</h2>
            <div className={styles.moodBreakdown}>
              {moodCounts.map(({ mood, count }) => (
                <div key={mood!.id} className={styles.moodRow}>
                  <span className={styles.moodRowEmoji}>{mood!.emoji}</span>
                  <span className={styles.moodRowLabel}>{mood!.label}</span>
                  <div className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${(count / totalEntries) * 100}%`,
                        background: mood!.color,
                      }}
                    />
                  </div>
                  <span className={styles.moodRowCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Entries */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>最近记录</h2>
            <div className={styles.entriesList}>
              {recentEntries.map((entry) => {
                const mood = getMoodById(entry.moodId);
                const date = new Date(entry.timestamp);
                return (
                  <div key={entry.id} className={styles.entryItem}>
                    <div
                      className={styles.entryDot}
                      style={{ background: mood?.color }}
                    />
                    <div className={styles.entryContent}>
                      <div className={styles.entryHeader}>
                        <span>{mood?.emoji} {mood?.label}</span>
                        <span className={styles.entryDate}>
                          {date.getMonth() + 1}/{date.getDate()} {date.getHours()}:{String(date.getMinutes()).padStart(2, '0')}
                        </span>
                      </div>
                      {entry.note && (
                        <p className={styles.entryNote}>{entry.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insight */}
          <div className={styles.section}>
            <div className={styles.insightCard}>
              <div className={styles.insightEmoji}>💡</div>
              <div className={styles.insightText}>
                {positivePercent >= 60
                  ? `太棒了！在所选时段内，有 ${positivePercent}% 的时间你保持了积极的情绪状态。继续保持！`
                  : positivePercent >= 40
                  ? `在所选时段内积极情绪占 ${positivePercent}%。情绪有些波动，这很正常。记得多和岛岛聊聊哦 💙`
                  : `我注意到这段时间积极情绪较少（${positivePercent}%）。如果感到持续的压力，请告知信任的大人或咨询老师 💙`}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
