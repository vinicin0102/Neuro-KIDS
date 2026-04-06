import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@user_profile',
  ROUTINE: '@routine',
  PECS: '@pecs',
  REWARDS: '@rewards',
  SETTINGS: '@settings',
  PARENT_PIN: '@parent_pin',
  PROFILES: '@profiles',
  CURRENT_PROFILE: '@current_profile',
  GAME_SCORES: '@game_scores',
};

const DEFAULT_ROUTINE = [
  { id: '1', title: 'Acordar', icon: 'sunny', completed: false, time: '07:00', emoji: '🌅' },
  { id: '2', title: 'Escovar dentes', icon: 'brush', completed: false, time: '07:15', emoji: '🪥' },
  { id: '3', title: 'Tomar café', icon: 'cafe', completed: false, time: '07:30', emoji: '☕' },
  { id: '4', title: 'Estudar', icon: 'school', completed: false, time: '09:00', emoji: '📚' },
  { id: '5', title: 'Brincar', icon: 'game-controller', completed: false, time: '11:00', emoji: '🎮' },
  { id: '6', title: 'Almoçar', icon: 'restaurant', completed: false, time: '12:00', emoji: '🍽️' },
  { id: '7', title: 'Descansar', icon: 'bed', completed: false, time: '13:00', emoji: '😴' },
  { id: '8', title: 'Dormir', icon: 'moon', completed: false, time: '21:00', emoji: '🌙' },
];

const DEFAULT_PECS = [
  { id: '1', text: 'Água', icon: 'water', color: '#88C0D0', emoji: '💧' },
  { id: '2', text: 'Comida', icon: 'fast-food', color: '#A3BE8C', emoji: '🍎' },
  { id: '3', text: 'Banheiro', icon: 'body', color: '#B48EAD', emoji: '🚽' },
  { id: '4', text: 'Dor', icon: 'medkit', color: '#BF616A', emoji: '🤕' },
  { id: '5', text: 'Sono', icon: 'moon', color: '#4C566A', emoji: '😴' },
  { id: '6', text: 'Brincar', icon: 'game-controller', color: '#EBCB8B', emoji: '🎮' },
  { id: '7', text: 'Sim', icon: 'checkmark-circle', color: '#81A1C1', emoji: '✅' },
  { id: '8', text: 'Não', icon: 'close-circle', color: '#D08770', emoji: '❌' },
  { id: '9', text: 'Ajuda', icon: 'help-circle', color: '#5E81AC', emoji: '🆘' },
  { id: '10', text: 'Quero', icon: 'hand-left', color: '#8FBCBB', emoji: '👋' },
  { id: '11', text: 'Abraço', icon: 'heart', color: '#BF616A', emoji: '🤗' },
  { id: '12', text: 'Feliz', icon: 'happy', color: '#EBCB8B', emoji: '😊' },
];

export const storageService = {
  save: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to storage', e);
    }
  },

  load: async (key, defaultValue) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error('Error loading from storage', e);
      return defaultValue;
    }
  },

  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from storage', e);
    }
  },

  getInitialData: async () => {
    const routine = await storageService.load(KEYS.ROUTINE, DEFAULT_ROUTINE);
    const pecs = await storageService.load(KEYS.PECS, DEFAULT_PECS);
    const rewards = await storageService.load(KEYS.REWARDS, { stars: 0, medals: 0, trophies: 0 });
    const settings = await storageService.load(KEYS.SETTINGS, { sensoryMode: false, voiceEnabled: true, nightMode: false });
    const profile = await storageService.load(KEYS.USER_PROFILE, { name: 'Amiguinho', age: '', avatar: 'default' });
    const pin = await storageService.load(KEYS.PARENT_PIN, '1234');

    return { routine, pecs, rewards, settings, profile, pin };
  },

  KEYS,
  DEFAULT_ROUTINE,
  DEFAULT_PECS,
};
