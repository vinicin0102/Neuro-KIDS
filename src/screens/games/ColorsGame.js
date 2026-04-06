import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Shadows } from '../../themes/Colors';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const GAME_COLORS = [
  { name: 'Vermelho', hex: '#E07070', emoji: '🔴' },
  { name: 'Verde', hex: '#7BC47F', emoji: '🟢' },
  { name: 'Azul', hex: '#6C9BCF', emoji: '🔵' },
  { name: 'Amarelo', hex: '#F0C05A', emoji: '🟡' },
  { name: 'Roxo', hex: '#B48EAD', emoji: '🟣' },
  { name: 'Laranja', hex: '#E8956A', emoji: '🟠' },
];

export default function ColorsGame() {
  const [target, setTarget] = useState(GAME_COLORS[0]);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { addStars } = useApp();

  useEffect(() => {
    nextRound();
  }, []);

  const nextRound = () => {
    const random = GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
    setTarget(random);
    setFeedback('');

    let shuff = [...GAME_COLORS].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (!shuff.find(s => s.name === random.name)) {
      shuff[0] = random;
    }
    setOptions(shuff.sort(() => 0.5 - Math.random()));

    speechService.speakSlow(`Toque na cor ${random.name}!`);
  };

  const handleSelect = (item) => {
    if (item.name === target.name) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFeedback('Muito bem! 🎉');
      speechService.speakExcited('Muito bem! Você acertou!');
      setScore(score + 1);
      addStars(1);
      setTimeout(nextRound, 1500);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setFeedback('Tente de novo! 💪');
      speechService.speak(`Essa é ${item.name}. Tente achar ${target.name}!`, { style: 'friendly' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      <Text style={styles.prompt}>
        Toque na cor:
      </Text>
      <Text style={[styles.targetName, { color: target.hex }]}>
        {target.emoji} {target.name}
      </Text>

      <View style={styles.options}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.colorCircle, { backgroundColor: opt.hex }, Shadows.medium]}
            onPress={() => handleSelect(opt)}
            activeOpacity={0.8}
          />
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
  prompt: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  targetName: { fontSize: 36, fontWeight: 'bold', marginBottom: 40 },
  options: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  colorCircle: {
    width: (width - 100) / 2,
    height: (width - 100) / 2,
    maxWidth: 130,
    maxHeight: 130,
    margin: 12,
    borderRadius: 999,
    borderWidth: 5,
    borderColor: '#fff',
  },
  feedback: { fontSize: 28, fontWeight: 'bold', marginTop: 30, color: Colors.text },
});
