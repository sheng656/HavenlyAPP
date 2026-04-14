import { useEffect, useState } from 'react';
import type { Screen, MoodId, AgeGroup } from './types';
import HomeScreen from './screens/HomeScreen';
import MoodGridScreen from './screens/MoodGridScreen';
import AIChatScreen from './screens/AIChatScreen';
import GardenScreen from './screens/GardenScreen';
import DashboardScreen from './screens/DashboardScreen';
import BottomNav from './components/BottomNav';
import { hydrateLocalStorageFromCloud } from './utils/cloudSync';
import './App.css';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [lastMoodId, setLastMoodId] = useState<MoodId | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('kid');

  useEffect(() => {
    void hydrateLocalStorageFromCloud();
  }, []);

  return (
    <div className={`app ${ageGroup}`}>
      {screen === 'home' && (
        <HomeScreen
          onNavigate={setScreen}
          ageGroup={ageGroup}
          onAgeChange={setAgeGroup}
        />
      )}
      {screen === 'mood' && (
        <MoodGridScreen
          onNavigate={setScreen}
          onMoodSaved={setLastMoodId}
          ageGroup={ageGroup}
        />
      )}
      {screen === 'chat' && (
        <AIChatScreen
          onNavigate={setScreen}
          initialMoodId={lastMoodId}
          ageGroup={ageGroup}
        />
      )}
      {screen === 'garden' && (
        <GardenScreen
          onNavigate={setScreen}
          ageGroup={ageGroup}
        />
      )}
      {screen === 'dashboard' && (
        <DashboardScreen
          onNavigate={setScreen}
          ageGroup={ageGroup}
        />
      )}

      <BottomNav current={screen} onNavigate={setScreen} />
    </div>
  );
}

export default App;
