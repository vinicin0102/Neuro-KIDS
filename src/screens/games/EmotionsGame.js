import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Shadows } from '../../themes/Colors';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const EMOTIONS = [
  { name: 'Feliz', emoji: '😊', color: '#F0C05A', desc: 'Estou contente!' },
  { name: 'Triste', emoji: '😢', color: '#6C9BCF', desc: 'Estou chorando' },
  { name: 'Bravo', emoji: '😠', color: '#E07070', desc: 'Estou com raiva' },
  { name: 'Assustado', emoji: '😨', color: '#B48EAD', desc: 'Estou com medo' },
  { name: 'Surpreso', emoji: '😲', color: '#E8956A', desc: 'Nossa!' },
  { name: 'Sonolento', emoji: '😴', color: '#4C566A', desc: 'Estou com sono' },
  { name: 'Amando', emoji: '🥰', color: '#E07070', desc: 'Estou amando!' },
  { name: 'Pensando', emoji: '🤔', color: '#7BC47F', desc: 'Estou pensando' },
];

export default function EmotionsGame() {
  const [target, setTarget] = useState(EMOTIONS[0]);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [mode, setMode] = useState('find'); // 'find' = find emoji, 'name' = name the emotion
  const { addStars } = useApp();

  useEffect(() => {
    nextRound();
  }, []);

  const nextRound = () => {
    const random = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    setTarget(random);
    setFeedback('');

    let shuff = [...EMOTIONS].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (!shuff.find(s => s.name === random.name)) {
      shuff[0] = random;
    }
    setOptions(shuff.sort(() => 0.5 - Math.random()));

    if (mode === 'find') {
      speechService.speakSlow(`Quem está ${random.name.toLowerCase()}? Toque no rosto ${random.name.toLowerCase()}!`);
    } else {
      speechService.speak(`Esse rosto está sentindo o que? ${random.emoji}`);
    }
  };

  const handleSelect = (item) => {
    if (item.name === target.name) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFeedback('Acertou! 🌟');
      speechService.speakExcited(`Isso mesmo! Esse rosto está ${target.name.toLowerCase()}! ${target.desc}`);
      setScore(score + 1);
      addStars(1);
      setTimeout(nextRound, 2000);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setFeedback('Quase! Tente de novo! 💪');
      speechService.speak(`Esse rosto está ${item.name.toLowerCase()}. Tente achar quem está ${target.name.toLowerCase()}!`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      <Text style={styles.prompt}>Quem está:</Text>
      <Text style={styles.targetName}>{target.name}?</Text>

      <View style={styles.options}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.emotionCard, Shadows.light]}
            onPress={() => handleSelect(opt)}
            activeOpacity={0.8}
          >
            <Text style={styles.emotionEmoji}>{opt.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  scoreRow: { position: 'absolute', top: 10, right: 20 },
  score: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  prompt: { fontSize: 26, color: Colors.textSecondary, marginBottom: 4 },
  targetName: { fontSize: 36, fontWeight: 'bold', color: Colors.text, marginBottom: 30 },
  options: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  emotionCard: {
    width: (width - 100) / 2,
    height: (width - 100) / 2,
    maxWidth: 130,
    maxHeight: 130,
    margin: 10,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.border,
  },
  emotionEmoji: { fontSize: 60 },
  feedback: { fontSize: 26, fontWeight: 'bold', marginTop: 30, color: Colors.text },
});
