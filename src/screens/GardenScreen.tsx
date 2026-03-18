import { useState } from 'react';
import type { Screen, Pet, Plant, AgeGroup } from '../types';
import { getPets, savePets, getPlants, savePlants, getCoins, spendCoins } from '../utils/storage';
import styles from './GardenScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  ageGroup: AgeGroup;
}

const PLANT_STAGES = ['🌱', '🌿', '🪴', '🌸', '🌻'];
const UNLOCK_COST = 50;

export default function GardenScreen({ onNavigate, ageGroup }: Props) {
  const [tab, setTab] = useState<'pets' | 'plants'>('pets');
  const [pets, setPets] = useState<Pet[]>(getPets);
  const [plants, setPlants] = useState<Plant[]>(getPlants);
  const [coins, setCoins] = useState(getCoins);
  const [feedAnim, setFeedAnim] = useState<string | null>(null);
  const [waterAnim, setWaterAnim] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleFeed = (petId: string) => {
    if (!spendCoins(5)) {
      showMessage('快乐币不足 😢');
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
    showMessage('喂食成功！🍎 -5🪙');
    setTimeout(() => setFeedAnim(null), 600);
  };

  const handleUnlockPet = (petId: string) => {
    if (!spendCoins(UNLOCK_COST)) {
      showMessage(`需要 ${UNLOCK_COST} 快乐币 🪙`);
      return;
    }
    const updated = pets.map((p) =>
      p.id === petId ? { ...p, unlocked: true, happiness: 60 } : p
    );
    setPets(updated);
    savePets(updated);
    setCoins(getCoins());
    showMessage('新伙伴解锁啦！🎉');
  };

  const handleWater = (plantId: string) => {
    if (!spendCoins(3)) {
      showMessage('快乐币不足 😢');
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
    showMessage('浇水成功！💧 -3🪙');
    setTimeout(() => setWaterAnim(null), 600);
  };

  const handleUnlockPlant = (plantId: string) => {
    if (!spendCoins(UNLOCK_COST)) {
      showMessage(`需要 ${UNLOCK_COST} 快乐币 🪙`);
      return;
    }
    const updated = plants.map((pl) =>
      pl.id === plantId ? { ...pl, unlocked: true, waterLevel: 25, stage: 1 } : pl
    );
    setPlants(updated);
    savePlants(updated);
    setCoins(getCoins());
    showMessage('新植物解锁啦！🌱');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => onNavigate('home')}>← 返回</button>
        <h1 className={styles.title}>我的小花园</h1>
        <div className={styles.coinsBadge}>🪙 {coins}</div>
      </div>

      {message && <div className={styles.toast}>{message}</div>}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'pets' ? styles.tabActive : ''}`}
          onClick={() => setTab('pets')}
        >
          🐾 宠物伙伴
        </button>
        <button
          className={`${styles.tab} ${tab === 'plants' ? styles.tabActive : ''}`}
          onClick={() => setTab('plants')}
        >
          🌱 我的植物
        </button>
      </div>

      {tab === 'pets' && (
        <div className={styles.grid}>
          {pets.map((pet) => (
            <div key={pet.id} className={`${styles.card} ${!pet.unlocked ? styles.locked : ''}`}>
              {!pet.unlocked && <div className={styles.lockOverlay}>🔒</div>}
              <div
                className={`${styles.petEmoji} ${feedAnim === pet.id ? styles.bounce : ''}`}
              >
                {pet.emoji}
              </div>
              <div className={styles.cardName}>{pet.name}</div>
              {pet.unlocked && (
                <>
                  <div className={styles.happinessBar}>
                    <div
                      className={styles.happinessFill}
                      style={{ width: `${pet.happiness}%` }}
                    />
                  </div>
                  <div className={styles.happinessLabel}>开心度 {pet.happiness}%</div>
                  <button className={styles.actionBtn} onClick={() => handleFeed(pet.id)}>
                    喂食 🍎 (-5🪙)
                  </button>
                </>
              )}
              {!pet.unlocked && (
                <button
                  className={styles.unlockBtn}
                  onClick={() => handleUnlockPet(pet.id)}
                >
                  解锁 ({UNLOCK_COST}🪙)
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'plants' && (
        <div className={styles.grid}>
          {plants.map((plant) => (
            <div key={plant.id} className={`${styles.card} ${!plant.unlocked ? styles.locked : ''}`}>
              {!plant.unlocked && <div className={styles.lockOverlay}>🔒</div>}
              <div
                className={`${styles.petEmoji} ${waterAnim === plant.id ? styles.bounce : ''}`}
              >
                {plant.unlocked ? PLANT_STAGES[plant.stage] : plant.emoji}
              </div>
              <div className={styles.cardName}>{plant.name}</div>
              {plant.unlocked && (
                <>
                  <div className={styles.stageLabel}>
                    {'🌱🌿🪴🌸🌻'[plant.stage]} 阶段 {plant.stage + 1}/5
                  </div>
                  <div className={styles.happinessBar}>
                    <div
                      className={styles.waterFill}
                      style={{ width: `${plant.waterLevel}%` }}
                    />
                  </div>
                  <div className={styles.happinessLabel}>水分 {plant.waterLevel}%</div>
                  <button className={styles.actionBtn} onClick={() => handleWater(plant.id)}>
                    浇水 💧 (-3🪙)
                  </button>
                </>
              )}
              {!plant.unlocked && (
                <button
                  className={styles.unlockBtn}
                  onClick={() => handleUnlockPlant(plant.id)}
                >
                  解锁 ({UNLOCK_COST}🪙)
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.hint}>
        <p>💡 每次记录心情可获得 10🪙 · 快乐币可用于解锁和养护</p>
      </div>
    </div>
  );
}
