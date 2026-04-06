import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [rewards, setRewards] = useState({ stars: 0, medals: 0, trophies: 0 });
  const [settings, setSettings] = useState({
    sensoryMode: false,
    voiceEnabled: true,
    nightMode: false,
    aiKey: '',
    userName: 'Amiguinho',
  });
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const r = await storageService.load(storageService.KEYS.REWARDS, { stars: 0, medals: 0, trophies: 0 });
    const s = await storageService.load(storageService.KEYS.SETTINGS, settings);
    const p = await storageService.load(storageService.KEYS.PROFILES, []);
    const cp = await storageService.load(storageService.KEYS.CURRENT_PROFILE, null);
    setRewards(r);
    setSettings(s);
    setProfiles(p);
    setCurrentProfile(cp);
    setLoaded(true);
  };

  const addStars = async (count = 1) => {
    const newRewards = { ...rewards };
    newRewards.stars += count;

    // Check level ups
    if (newRewards.stars >= 50 && newRewards.trophies < Math.floor(newRewards.stars / 50)) {
      newRewards.trophies = Math.floor(newRewards.stars / 50);
    }
    if (newRewards.stars >= 25 && newRewards.medals < Math.floor(newRewards.stars / 25)) {
      newRewards.medals = Math.floor(newRewards.stars / 25);
    }

    setRewards(newRewards);
    await storageService.save(storageService.KEYS.REWARDS, newRewards);
    return newRewards;
  };

  const updateSettings = async (newVal) => {
    const updated = { ...settings, ...newVal };
    setSettings(updated);
    await storageService.save(storageService.KEYS.SETTINGS, updated);
  };

  const addProfile = async (profile) => {
    const newProfiles = [...profiles, { ...profile, id: Date.now().toString() }];
    setProfiles(newProfiles);
    await storageService.save(storageService.KEYS.PROFILES, newProfiles);
  };

  const selectProfile = async (profile) => {
    setCurrentProfile(profile);
    await storageService.save(storageService.KEYS.CURRENT_PROFILE, profile);
    if (profile) {
      updateSettings({ userName: profile.name });
    }
  };

  const resetAll = async () => {
    const defaultRewards = { stars: 0, medals: 0, trophies: 0 };
    setRewards(defaultRewards);
    await storageService.save(storageService.KEYS.REWARDS, defaultRewards);
    await storageService.save(storageService.KEYS.ROUTINE, null);
  };

  return (
    <AppContext.Provider value={{
      rewards,
      settings,
      profiles,
      currentProfile,
      loaded,
      addStars,
      updateSettings,
      addProfile,
      selectProfile,
      resetAll,
    }}>
      {children}
    </AppContext.Provider>
  );
};
