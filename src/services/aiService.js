import { storageService } from './storageService';

const DEFAULT_AI_PROMPT = `Você é o Astro, um assistente carinhoso e paciente para crianças.
Use linguagem simples, frases curtas e um tom motivador e amigável.
Trate a criança pelo nome se fornecido.
Seu objetivo é dar instruções simples, ajudar na rotina e sugerir atividades de forma lúdica.
Identifique emoções e responda com empatia.
Não use palavras complexas ou sarcasmo.
Se a criança estiver agitada, sugira uma respiração lenta.
Sempre termine com algo positivo.
Máximo 2 frases por resposta.`;

const OFFLINE_RESPONSES = [
  "Que legal! Vamos brincar juntos? 🎮",
  "Você é super especial! ⭐",
  "Vamos respirar devagar... inspira... expira... Muito bem! 🌈",
  "Hora de uma pausa! Que tal desenhar? 🎨",
  "Você já tomou água hoje? Vamos beber! 💧",
  "Eu gosto muito de conversar com você! 💙",
  "Vamos contar até 5? 1... 2... 3... 4... 5! 🎉",
  "Que tal ouvir uma música calma? 🎵",
  "Você está indo muito bem hoje! Continue assim! 🌟",
  "Se estiver difícil, tudo bem pedir ajuda! 🤗",
  "Vamos escovar os dentes? É importante! 🪥",
  "Hora de estudar! Você consegue! 📚",
  "Tá na hora de dormir? Boa noite! 🌙",
  "Que dia lindo hoje, né? ☀️",
  "Vou te contar um segredo: você é incrível! 🦸",
];

const EMOTION_RESPONSES = {
  feliz: "Que bom que você está feliz! Isso me deixa feliz também! 😊🌈",
  triste: "Tudo bem ficar triste às vezes. Quer um abraço virtual? 🤗💙",
  medo: "Não precisa ter medo, eu estou aqui com você! Vamos respirar juntos? 🌟",
  bravo: "Respira fundo comigo... inspira... expira... Está se sentindo melhor? 🍃",
  cansado: "Que tal descansar um pouquinho? Depois a gente brinca! 😴💤",
  entediado: "Vamos jogar um jogo? Ou que tal desenhar? 🎮🎨",
};

export const aiService = {
  sendMessage: async (message, userName = 'Amiguinho') => {
    try {
      const settings = await storageService.load(storageService.KEYS.SETTINGS, { aiKey: '' });

      // Check for emotion keywords first
      const lowerMsg = message.toLowerCase();
      for (const [emotion, response] of Object.entries(EMOTION_RESPONSES)) {
        if (lowerMsg.includes(emotion)) {
          return response;
        }
      }

      if (!settings.aiKey) {
        // Offline fallback
        const idx = Math.floor(Math.random() * OFFLINE_RESPONSES.length);
        return OFFLINE_RESPONSES[idx];
      }

      // Online mode with OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.aiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `${DEFAULT_AI_PROMPT}\nNome da criança: ${userName}` },
            { role: 'user', content: message }
          ],
          max_tokens: 80,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }

      return OFFLINE_RESPONSES[Math.floor(Math.random() * OFFLINE_RESPONSES.length)];
    } catch (e) {
      console.error('Error in AI service', e);
      return OFFLINE_RESPONSES[Math.floor(Math.random() * OFFLINE_RESPONSES.length)];
    }
  },

  getQuickPrompts: () => [
    "Como você está?",
    "Vamos brincar!",
    "Estou com fome",
    "Estou triste",
    "Me conta uma história",
    "Quero dormir",
  ],
};
