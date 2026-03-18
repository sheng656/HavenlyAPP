import { useState, useMemo } from 'react';
import type { Screen, AgeGroup } from '../types';
import { getMoodEntries, getMoodEntriesLast7Days, getMoodEntriesLast30Days, getStreak } from '../utils/storage';
import { getMoodById } from '../utils/moodData';
import styles from './DashboardScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  ageGroup: AgeGroup;
}

type Period = '7' | '30' | 'all';

export default function DashboardScreen({ onNavigate, ageGroup }: Props) {
  const [period, setPeriod] = useState<Period>('7');
  const streak = getStreak();

  const entries = useMemo(() => {
    if (period === '7') return getMoodEntriesLast7Days();
    if (period === '30') return getMoodEntriesLast30Days();
    return getMoodEntries();
  }, [period]);

  // 7-day calendar: always shows the last 7 calendar days
  const weekCalendar = useMemo(() => {
    const allEntries = getMoodEntries();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      const dayEntries = allEntries.filter(
        (e) => e.timestamp >= dayStart.getTime() && e.timestamp <= dayEnd.getTime(),
      );
      // Show the most recent mood emoji for that day (if any)
      const topEntry = dayEntries[0];
      const topMood = topEntry ? getMoodById(topEntry.moodId) : null;
      return {
        dayLabel: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        date: d.getDate(),
        emoji: topMood?.emoji ?? null,
        color: topMood?.color ?? null,
        count: dayEntries.length,
        isToday: i === 6,
      };
    });
  }, []);

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

      {/* 7-day Mood Calendar */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>近 7 天心情日历</h2>
        <div className={styles.calendar}>
          {weekCalendar.map((day, idx) => (
            <div key={idx} className={`${styles.calDay} ${day.isToday ? styles.calToday : ''}`}>
              <div className={styles.calDayLabel}>周{day.dayLabel}</div>
              <div
                className={styles.calDayCell}
                style={day.color ? { background: `${day.color}40`, borderColor: day.color } : {}}
                title={day.count > 0 ? `${day.count} 条记录` : '暂无记录'}
              >
                {day.emoji ?? <span className={styles.calEmpty}>·</span>}
              </div>
              <div className={styles.calDate}>{day.date}</div>
            </div>
          ))}
        </div>
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
          {/* Streak + Summary Cards */}
          {streak.count > 0 && (
            <div className={styles.section}>
              <div className={styles.streakCard}>
                <span className={styles.streakFlame}>🔥</span>
                <div>
                  <div className={styles.streakNum}>{streak.count} 天</div>
                  <div className={styles.streakLabel}>连续记录</div>
                </div>
              </div>
            </div>
          )}
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

          {/* Insight - Age-specific */}
          <div className={styles.section}>
            <div className={styles.insightCard}>
              <div className={styles.insightEmoji}>
                {ageGroup === 'toddler' ? '🎈' : ageGroup === 'teen' ? '📖' : '💡'}
              </div>
              <div className={styles.insightText}>
                {ageGroup === 'toddler' ? (
                  // Toddler: Simple, playful insights
                  positivePercent >= 60
                    ? `太棒了！你笑得很开心呢！${positivePercent}% 都是开心时刻 😊`
                    : positivePercent >= 40
                    ? `你有开心的时候，也有难过的时候，这都很正常呀 🤗`
                    : `最近有点伤心呢？和岛岛聊聊天吧，我们一起加油 💙`
                ) : ageGroup === 'teen' ? (
                  // Teen: Detailed, reflective insights
                  positivePercent >= 60
                    ? `亮眼的数据！你的积极情绪占比达到 ${positivePercent}%。这反映了纷繁生活中你仍然保持的乐观态度。继续保持这种心态，好事会继续发生。`
                    : positivePercent >= 40
                    ? `你的情绪在 ${positivePercent}% 的积极水平。这说明你在经历一些变化。建议你在日记中记录一下最近发生的事情和你的想法，这会帮你更好地理解自己。`
                    : `最近的情绪数据显示你可能经历了一些挑战。${positivePercent}% 的积极情绪率提示你可能需要更多的自我关怀。记得和信任的人倾诉，或考虑记录更多的想法。`
                ) : (
                  // Kid: Balanced, encouraging insights
                  positivePercent >= 60
                    ? `太棒了！在所选时段内，有 ${positivePercent}% 的时间你保持了积极的情绪状态。继续保持！`
                    : positivePercent >= 40
                    ? `在所选时段内积极情绪占 ${positivePercent}%。情绪有些波动，这很正常。记得多和岛岛聊聊哦 💙`
                    : `我注意到这段时间积极情绪较少（${positivePercent}%）。如果感到持续的压力，请告知信任的大人或咨询老师 💙`
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
