import { useState } from 'react';
import type { Screen, MoodId } from './types';
import HomeScreen from './screens/HomeScreen';
import MoodGridScreen from './screens/MoodGridScreen';
import AIChatScreen from './screens/AIChatScreen';
import GardenScreen from './screens/GardenScreen';
import DashboardScreen from './screens/DashboardScreen';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [lastMoodId, setLastMoodId] = useState<MoodId | null>(null);

  return (
    <div className="app">
      {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
      {screen === 'mood' && (
        <MoodGridScreen
          onNavigate={setScreen}
          onMoodSaved={setLastMoodId}
        />
      )}
      {screen === 'chat' && (
        <AIChatScreen onNavigate={setScreen} initialMoodId={lastMoodId} />
      )}
      {screen === 'garden' && <GardenScreen onNavigate={setScreen} />}
      {screen === 'dashboard' && <DashboardScreen onNavigate={setScreen} />}

      <BottomNav current={screen} onNavigate={setScreen} />
    </div>
  );
}

export default App;
