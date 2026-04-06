import * as Speech from 'expo-speech';

let voiceEnabled = true;
let currentVoiceStyle = 'friendly';
let selectedVoice = null; // Will be set to a female voice

const VOICE_STYLES = {
  friendly: { pitch: 1.05, rate: 0.95 },   // Mais natural, quase padrão
  calm: { pitch: 0.95, rate: 0.85 },      // Um pouco mais grave e lenta
  excited: { pitch: 1.1, rate: 1.0 },     // Ligeiramente aguda, sem distorcer
  slow: { pitch: 1.0, rate: 0.75 },       // Mesma voz, apenas levemente devagar
};

// Busca e seleciona uma voz feminina em pt-BR natural
const initFemaleVoice = async () => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    
    // Tenta primeiro vozes de alta qualidade (Enhanced/Neural/Online) que são mais fluidas
    const premiumFemale = voices.find(v => 
      v.language?.startsWith('pt') &&
      (v.quality === 'Enhanced' || v.identifier?.toLowerCase().includes('network') || v.identifier?.toLowerCase().includes('online')) &&
      (v.name?.toLowerCase().includes('maria') || v.name?.toLowerCase().includes('luciana') || v.name?.toLowerCase().includes('francisca') || v.identifier?.toLowerCase().includes('female'))
    );

    if (premiumFemale) {
      selectedVoice = premiumFemale.identifier;
      console.log('🔊 Voz Premium selecionada:', premiumFemale.name);
      return;
    }

    // Fallback: pt-BR feminina padrão
    const ptBrFemale = voices.find(v =>
      v.language?.startsWith('pt') &&
      (v.name?.toLowerCase().includes('female') ||
       v.name?.toLowerCase().includes('feminino') ||
       v.name?.toLowerCase().includes('woman') ||
       v.name?.toLowerCase().includes('luciana') ||
       v.name?.toLowerCase().includes('vitoria') ||
       v.name?.toLowerCase().includes('francisca') ||
       v.name?.toLowerCase().includes('letícia') ||
       v.name?.toLowerCase().includes('maria') ||
       v.name?.toLowerCase().includes('google português do brasil') ||
       v.identifier?.toLowerCase().includes('female') ||
       v.quality === 'Enhanced')
    );

    if (ptBrFemale) {
      selectedVoice = ptBrFemale.identifier;
      console.log('🔊 Voz feminina selecionada:', ptBrFemale.name);
      return;
    }

    // Fallback: qualquer voz em português
    const ptVoice = voices.find(v => v.language?.startsWith('pt'));
    if (ptVoice) {
      selectedVoice = ptVoice.identifier;
      console.log('🔊 Voz pt selecionada:', ptVoice.name);
    }
  } catch (e) {
    console.log('Vozes não disponíveis, usando padrão');
  }
};

// Inicializa ao carregar
initFemaleVoice();

export const speechService = {
  speak: async (text, options = {}) => {
    if (!voiceEnabled) return;
    const style = VOICE_STYLES[options.style || currentVoiceStyle] || VOICE_STYLES.friendly;
    const language = options.language || 'pt-BR';

    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      const speechOptions = {
        language,
        pitch: style.pitch,
        rate: style.rate,
        onDone: options.onDone || undefined,
        onError: (e) => console.warn('Speech error:', e),
      };

      // Usa voz feminina se disponível
      if (selectedVoice) {
        speechOptions.voice = selectedVoice;
      }

      Speech.speak(text, speechOptions);
    } catch (e) {
      console.error('Speech synthesis error', e);
    }
  },

  speakExcited: (text) => speechService.speak(text, { style: 'excited' }),
  speakCalm: (text) => speechService.speak(text, { style: 'calm' }),
  speakSlow: (text) => speechService.speak(text, { style: 'slow' }),

  stop: async () => {
    try {
      await Speech.stop();
    } catch (e) {
      console.error('Speech stop error', e);
    }
  },

  setEnabled: (enabled) => { voiceEnabled = enabled; },
  isEnabled: () => voiceEnabled,
  setStyle: (style) => { if (VOICE_STYLES[style]) currentVoiceStyle = style; },
  getStyles: () => Object.keys(VOICE_STYLES),

  /** Força recarregar voz feminina */
  refreshVoice: () => initFemaleVoice(),
};
