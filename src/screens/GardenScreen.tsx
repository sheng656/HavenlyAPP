import { useState } from 'react';
import type { Screen, Pet, Plant, AgeGroup, Language } from '../types';
import { getPets, savePets, getPlants, savePlants, getCoins, spendCoins, getStreak } from '../utils/storage';
import SpeciesCard from '../components/SpeciesCard';
import { SPECIES_DATA } from '../utils/speciesData';
import styles from './GardenScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  ageGroup: AgeGroup;
  language: Language;
}

const PLANT_STAGES = ['🌱', '🌿', '🪴', '🌸', '🌻'];
const UNLOCK_COST = 50;

export default function GardenScreen({ onNavigate, language }: Props) {
  const [tab, setTab] = useState<'pets' | 'plants'>('pets');
  const [pets, setPets] = useState<Pet[]>(getPets);
  const [plants, setPlants] = useState<Plant[]>(getPlants);
  const [coins, setCoins] = useState(getCoins);
  const [feedAnim, setFeedAnim] = useState<string | null>(null);
  const [waterAnim, setWaterAnim] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [speciesCardId, setSpeciesCardId] = useState<string | null>(null);
  const streak = getStreak();
  const isZh = language === 'zh';

  const t = {
    noCoins: isZh ? '快乐币不足 😢' : 'Not enough joy coins 😢',
    needCoins: (amount: number) => (isZh ? `需要 ${amount} 快乐币 🪙` : `${amount} joy coins needed 🪙`),
    feedSuccess: isZh ? '喂食成功！🍎 -5🪙' : 'Fed successfully! 🍎 -5🪙',
    unlockPet: isZh ? '新伙伴解锁啦！🎉' : 'New buddy unlocked! 🎉',
    waterSuccess: isZh ? '浇水成功！💧 -3🪙' : 'Watered successfully! 💧 -3🪙',
    unlockPlant: isZh ? '新植物解锁啦！🌱' : 'New plant unlocked! 🌱',
    back: isZh ? '← 返回' : '← Back',
    title: isZh ? '我的小花园' : 'My Garden',
    petsTab: isZh ? '🐾 宠物伙伴' : '🐾 Pet Buddies',
    plantsTab: isZh ? '🌱 我的植物' : '🌱 My Plants',
    happiness: isZh ? '开心度' : 'Happiness',
    water: isZh ? '水分' : 'Water',
    feedBtn: isZh ? '喂食 🍎 (-5🪙)' : 'Feed 🍎 (-5🪙)',
    waterBtn: isZh ? '浇水 💧 (-3🪙)' : 'Water 💧 (-3🪙)',
    encyclopedia: isZh ? '📖 百科' : '📖 Info',
    unlock: isZh ? '解锁' : 'Unlock',
    stage: isZh ? '阶段' : 'Stage',
    streakHint: (count: number, bonus: number) =>
      isZh
        ? `🔥 连续记录 ${count} 天！每次记录心情都会自动浇水 💧 +${bonus}%`
        : `🔥 ${count}-day streak! Each mood log auto-waters plants 💧 +${bonus}%`,
    coinsHint: isZh
      ? '💡 每次记录心情可获得 10🪙 · 快乐币可用于解锁和养护'
      : '💡 Each mood log gives 10🪙 · Use joy coins to unlock and care',
  };

  const getSpeciesName = (id: string, fallbackName: string): string => {
    const species = SPECIES_DATA[id];
    if (!species) return fallbackName;
    return isZh ? species.name : species.nameEn;
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleFeed = (petId: string) => {
    if (!spendCoins(5)) {
      showMessage(t.noCoins);
      return;
    }
    const updated = pets.map((p) =>
      p.id === petId
        ? { ...p, happiness: Math.min(100, p.happiness + 15) }
        : p
    );
    setPets(updated);
    savePets(updated);
    setCoins(getCoins());
    setFeedAnim(petId);
    showMessage(t.feedSuccess);
    setTimeout(() => setFeedAnim(null), 600);
  };

  const handleUnlockPet = (petId: string) => {
    if (!spendCoins(UNLOCK_COST)) {
      showMessage(t.needCoins(UNLOCK_COST));
      return;
    }
    const updated = pets.map((p) =>
      p.id === petId ? { ...p, unlocked: true, happiness: 60 } : p
    );
    setPets(updated);
    savePets(updated);
    setCoins(getCoins());
    showMessage(t.unlockPet);
  };

  const handleWater = (plantId: string) => {
    if (!spendCoins(3)) {
      showMessage(t.noCoins);
      return;
    }
    const updated = plants.map((pl) => {
      if (pl.id !== plantId) return pl;
      const newWater = Math.min(100, pl.waterLevel + 20);
      const newStage = Math.min(4, Math.floor(newWater / 25));
      return { ...pl, waterLevel: newWater, stage: newStage };
    });
    setPlants(updated);
    savePlants(updated);
    setCoins(getCoins());
    setWaterAnim(plantId);
    showMessage(t.waterSuccess);
    setTimeout(() => setWaterAnim(null), 600);
  };

  const handleUnlockPlant = (plantId: string) => {
    if (!spendCoins(UNLOCK_COST)) {
      showMessage(t.needCoins(UNLOCK_COST));
      return;
    }
    const updated = plants.map((pl) =>
      pl.id === plantId ? { ...pl, unlocked: true, waterLevel: 25, stage: 1 } : pl
    );
    setPlants(updated);
    savePlants(updated);
    setCoins(getCoins());
    showMessage(t.unlockPlant);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => onNavigate('home')}>{t.back}</button>
        <h1 className={styles.title}>{t.title}</h1>
        <div className={styles.coinsBadge}>🪙 {coins}</div>
      </div>

      {message && <div className={styles.toast}>{message}</div>}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'pets' ? styles.tabActive : ''}`}
          onClick={() => setTab('pets')}
        >
          {t.petsTab}
        </button>
        <button
          className={`${styles.tab} ${tab === 'plants' ? styles.tabActive : ''}`}
          onClick={() => setTab('plants')}
        >
          {t.plantsTab}
        </button>
      </div>

      {tab === 'pets' && (
        <div className={styles.grid}>
          {pets.map((pet) => (
            <div
              key={pet.id}
              className={`${styles.card} ${!pet.unlocked ? styles.locked : ''}`}
              onClick={pet.unlocked ? () => setSpeciesCardId(pet.id) : undefined}
              style={pet.unlocked ? { cursor: 'pointer' } : {}}
            >
              {!pet.unlocked && <div className={styles.lockOverlay}>🔒</div>}
              <div
                className={`${styles.petEmoji} ${feedAnim === pet.id ? styles.bounce : ''}`}
              >
                {pet.emoji}
              </div>
              <div className={styles.cardName}>{getSpeciesName(pet.id, pet.name)}</div>
              {pet.unlocked && (
                <>
                  <div className={styles.happinessBar}>
                    <div
                      className={styles.happinessFill}
                      style={{ width: `${pet.happiness}%` }}
                    />
                  </div>
                  <div className={styles.happinessLabel}>{t.happiness} {pet.happiness}%</div>
                  <button
                    className={styles.actionBtn}
                    onClick={(e) => { e.stopPropagation(); handleFeed(pet.id); }}
                  >
                    {t.feedBtn}
                  </button>
                  <button
                    className={styles.encyclopediaBtn}
                    onClick={(e) => { e.stopPropagation(); setSpeciesCardId(pet.id); }}
                  >
                    {t.encyclopedia}
                  </button>
                </>
              )}
              {!pet.unlocked && (
                <button
                  className={styles.unlockBtn}
                  onClick={() => handleUnlockPet(pet.id)}
                >
                  {t.unlock} ({UNLOCK_COST}🪙)
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'plants' && (
        <div className={styles.grid}>
          {plants.map((plant) => (
            <div
              key={plant.id}
              className={`${styles.card} ${!plant.unlocked ? styles.locked : ''}`}
              onClick={plant.unlocked ? () => setSpeciesCardId(plant.id) : undefined}
              style={plant.unlocked ? { cursor: 'pointer' } : {}}
            >
              {!plant.unlocked && <div className={styles.lockOverlay}>🔒</div>}
              <div
                className={`${styles.petEmoji} ${waterAnim === plant.id ? styles.bounce : ''}`}
              >
                {plant.unlocked ? PLANT_STAGES[plant.stage] : plant.emoji}
              </div>
              <div className={styles.cardName}>{getSpeciesName(plant.id, plant.name)}</div>
              {plant.unlocked && (
                <>
                  <div className={styles.stageLabel}>
                    {'🌱🌿🪴🌸🌻'[plant.stage]} {t.stage} {plant.stage + 1}/5
                  </div>
                  <div className={styles.happinessBar}>
                    <div
                      className={styles.waterFill}
                      style={{ width: `${plant.waterLevel}%` }}
                    />
                  </div>
                  <div className={styles.happinessLabel}>{t.water} {plant.waterLevel}%</div>
                  <button
                    className={styles.actionBtn}
                    onClick={(e) => { e.stopPropagation(); handleWater(plant.id); }}
                  >
                    {t.waterBtn}
                  </button>
                  <button
                    className={styles.encyclopediaBtn}
                    onClick={(e) => { e.stopPropagation(); setSpeciesCardId(plant.id); }}
                  >
                    {t.encyclopedia}
                  </button>
                </>
              )}
              {!plant.unlocked && (
                <button
                  className={styles.unlockBtn}
                  onClick={() => handleUnlockPlant(plant.id)}
                >
                  {t.unlock} ({UNLOCK_COST}🪙)
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.hint}>
        {streak.count > 0 && (
          <p>{t.streakHint(streak.count, Math.min(20, 5 + Math.min(streak.count - 1, 7) * 2))}</p>
        )}
        <p>{t.coinsHint}</p>
      </div>

      {speciesCardId && (
        <SpeciesCard
          speciesId={speciesCardId}
          onClose={() => setSpeciesCardId(null)}
          language={language}
        />
      )}
    </div>
  );
}
