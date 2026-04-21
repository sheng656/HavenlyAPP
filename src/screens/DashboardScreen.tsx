import { useState, useMemo } from 'react';
import type { Screen, AgeGroup, Language } from '../types';
import { getMoodEntries, getMoodEntriesLast7Days, getMoodEntriesLast30Days, getStreak } from '../utils/storage';
import { getMoodById, getMoodLabel } from '../utils/moodData';
import styles from './DashboardScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  ageGroup: AgeGroup;
  language: Language;
}

type Period = '7' | '30' | 'all';

export default function DashboardScreen({ onNavigate, ageGroup, language }: Props) {
  const [period, setPeriod] = useState<Period>('7');
  const streak = getStreak();
  const isZh = language === 'zh';

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
        dayLabel: (isZh
          ? ['日', '一', '二', '三', '四', '五', '六']
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])[d.getDay()],
        date: d.getDate(),
        emoji: topMood?.emoji ?? null,
        color: topMood?.color ?? null,
        count: dayEntries.length,
        isToday: i === 6,
      };
    });
  }, [isZh]);

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

  const t = {
    back: isZh ? '← 返回' : '← Back',
    title: isZh ? '数据分析' : 'Insights',
    period7: isZh ? '近 7 天' : 'Last 7 Days',
    period30: isZh ? '近 30 天' : 'Last 30 Days',
    periodAll: isZh ? '全部' : 'All Time',
    calendarTitle: isZh ? '近 7 天心情日历' : '7-Day Mood Calendar',
    dayPrefix: isZh ? '周' : '',
    entriesUnit: isZh ? '条记录' : 'entries',
    noEntry: isZh ? '暂无记录' : 'No entries',
    emptyTitle: isZh ? '还没有心情记录' : 'No mood logs yet',
    emptyDesc: isZh ? '去记录第一次心情吧！' : 'Log your first mood to get started.',
    goMood: isZh ? '记录心情 🌈' : 'Log Mood 🌈',
    streakSuffix: isZh ? '天' : 'days',
    streakLabel: isZh ? '连续记录' : 'Current streak',
    totalLogs: isZh ? '记录次数' : 'Total logs',
    positiveRatio: isZh ? '积极情绪占比' : 'Positive ratio',
    avgIntensity: isZh ? '平均情绪强度' : 'Average intensity',
    breakdown: isZh ? '情绪分布' : 'Mood breakdown',
    recent: isZh ? '最近记录' : 'Recent logs',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => onNavigate('home')}>{t.back}</button>
        <h1 className={styles.title}>{t.title}</h1>
        <div className={styles.headerSpacer} />
      </div>

      <div className={styles.periodSelector}>
        {(['7', '30', 'all'] as Period[]).map((p) => (
          <button
            key={p}
            className={`${styles.periodBtn} ${period === p ? styles.periodActive : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p === '7' ? t.period7 : p === '30' ? t.period30 : t.periodAll}
          </button>
        ))}
      </div>

      {/* 7-day Mood Calendar */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.calendarTitle}</h2>
        <div className={styles.calendar}>
          {weekCalendar.map((day, idx) => (
            <div key={idx} className={`${styles.calDay} ${day.isToday ? styles.calToday : ''}`}>
              <div className={styles.calDayLabel}>{t.dayPrefix}{day.dayLabel}</div>
              <div
                className={styles.calDayCell}
                style={day.color ? { background: `${day.color}40`, borderColor: day.color } : {}}
                title={day.count > 0 ? `${day.count} ${t.entriesUnit}` : t.noEntry}
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
          <p>{t.emptyTitle}</p>
          <p>{t.emptyDesc}</p>
          <button className={styles.goBtn} onClick={() => onNavigate('mood')}>
            {t.goMood}
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
                  <div className={styles.streakNum}>{streak.count} {t.streakSuffix}</div>
                  <div className={styles.streakLabel}>{t.streakLabel}</div>
                </div>
              </div>
            </div>
          )}
          {/* Summary Cards */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryNum}>{totalEntries}</div>
              <div className={styles.summaryLabel}>{t.totalLogs}</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={`${styles.summaryNum} ${styles.positive}`}>{positivePercent}%</div>
              <div className={styles.summaryLabel}>{t.positiveRatio}</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryNum}>{avgIntensity}</div>
              <div className={styles.summaryLabel}>{t.avgIntensity}</div>
            </div>
          </div>

          {/* Mood Breakdown */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.breakdown}</h2>
            <div className={styles.moodBreakdown}>
              {moodCounts.map(({ mood, count }) => (
                <div key={mood!.id} className={styles.moodRow}>
                  <span className={styles.moodRowEmoji}>{mood!.emoji}</span>
                  <span className={styles.moodRowLabel}>{getMoodLabel(mood!, language)}</span>
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
            <h2 className={styles.sectionTitle}>{t.recent}</h2>
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
                        <span>{mood?.emoji} {mood ? getMoodLabel(mood, language) : ''}</span>
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
                {isZh
                  ? ageGroup === 'toddler'
                    ? positivePercent >= 60
                      ? `太棒了！你笑得很开心呢！${positivePercent}% 都是开心时刻 😊`
                      : positivePercent >= 40
                      ? `你有开心的时候，也有难过的时候，这都很正常呀 🤗`
                      : `最近有点伤心呢？和岛岛聊聊天吧，我们一起加油 💙`
                    : ageGroup === 'teen'
                    ? positivePercent >= 60
                      ? `亮眼的数据！你的积极情绪占比达到 ${positivePercent}%。这说明你在复杂生活中依然保持乐观。`
                      : positivePercent >= 40
                      ? `你的积极情绪占比是 ${positivePercent}%。最近情绪有波动，可以在日记里写写发生了什么。`
                      : `最近积极情绪偏少（${positivePercent}%）。你可能需要更多休息和支持，记得向信任的人求助。`
                    : positivePercent >= 60
                    ? `太棒了！在所选时段内，有 ${positivePercent}% 的时间你保持了积极情绪。`
                    : positivePercent >= 40
                    ? `在所选时段内积极情绪占 ${positivePercent}%。情绪波动是正常的，记得多和岛岛聊聊。`
                    : `我注意到这段时间积极情绪较少（${positivePercent}%）。如果压力持续，请告诉信任的大人。`
                  : ageGroup === 'toddler'
                  ? positivePercent >= 60
                    ? `Awesome! You had lots of happy moments. ${positivePercent}% were positive 😊`
                    : positivePercent >= 40
                    ? `You had both happy and sad moments. That is completely okay 🤗`
                    : `Looks like things felt hard lately. Want to chat with Dodo? 💙`
                  : ageGroup === 'teen'
                  ? positivePercent >= 60
                    ? `Strong trend: ${positivePercent}% positive mood in this period. You are keeping your balance even with daily pressure.`
                    : positivePercent >= 40
                    ? `Your positive mood ratio is ${positivePercent}%. Recent ups and downs are normal. Writing a short journal can help.`
                    : `Positive mood ratio is ${positivePercent}% lately. You may need extra rest and support. Reach out to someone you trust.`
                  : positivePercent >= 60
                  ? `Great work. ${positivePercent}% of your recent logs were positive. Keep it up!`
                  : positivePercent >= 40
                  ? `${positivePercent}% of your recent logs were positive. Some mood changes are normal. Keep checking in with Dodo.`
                  : `I noticed fewer positive moments lately (${positivePercent}%). If stress continues, talk to a trusted adult.`}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
