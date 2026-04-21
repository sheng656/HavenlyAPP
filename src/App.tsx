import { useEffect, useState } from 'react';
import type { Screen, MoodId, AgeGroup, Language } from './types';
import HomeScreen from './screens/HomeScreen';
import MoodGridScreen from './screens/MoodGridScreen';
import AIChatScreen from './screens/AIChatScreen';
import GardenScreen from './screens/GardenScreen';
import DashboardScreen from './screens/DashboardScreen';
import BottomNav from './components/BottomNav';
import { hydrateLocalStorageFromCloud } from './utils/cloudSync';
import './App.css';

const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en';

  const languages = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean);

  for (const lang of languages) {
    const normalized = lang.toLowerCase();
    if (normalized.startsWith('zh')) return 'zh';
    if (normalized.startsWith('en')) return 'en';
  }

  return 'en';
};

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [lastMoodId, setLastMoodId] = useState<MoodId | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('kid');
  const [language, setLanguage] = useState<Language>(detectBrowserLanguage);

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
          language={language}
          onLanguageChange={setLanguage}
        />
      )}
      {screen === 'mood' && (
        <MoodGridScreen
          onNavigate={setScreen}
          onMoodSaved={setLastMoodId}
          ageGroup={ageGroup}
          language={language}
        />
      )}
      {screen === 'chat' && (
        <AIChatScreen
          onNavigate={setScreen}
          initialMoodId={lastMoodId}
          ageGroup={ageGroup}
          language={language}
        />
      )}
      {screen === 'garden' && (
        <GardenScreen
          onNavigate={setScreen}
          ageGroup={ageGroup}
          language={language}
        />
      )}
      {screen === 'dashboard' && (
        <DashboardScreen
          onNavigate={setScreen}
          ageGroup={ageGroup}
          language={language}
        />
      )}

      <BottomNav current={screen} onNavigate={setScreen} language={language} />
    </div>
  );
}

export default App;
