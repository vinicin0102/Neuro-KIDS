import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Shadows } from '../../themes/Colors';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const SHAPES = [
  { name: 'Círculo', emoji: '⭕', color: '#E07070' },
  { name: 'Quadrado', emoji: '🟧', color: '#E8956A' },
  { name: 'Triângulo', emoji: '🔺', color: '#F0C05A' },
  { name: 'Estrela', emoji: '⭐', color: '#F0C05A' },
  { name: 'Coração', emoji: '❤️', color: '#E07070' },
  { name: 'Diamante', emoji: '💎', color: '#6C9BCF' },
];

export default function ShapesGame() {
  const [target, setTarget] = useState(SHAPES[0]);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { addStars } = useApp();

  useEffect(() => {
    nextRound();
  }, []);

  const nextRound = () => {
    const random = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTarget(random);
    setFeedback('');

    let shuff = [...SHAPES].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (!shuff.find(s => s.name === random.name)) {
      shuff[0] = random;
    }
    setOptions(shuff.sort(() => 0.5 - Math.random()));

    speechService.speak(`Encontre o ${random.name}!`);
  };

  const handleSelect = (item) => {
    if (item.name === target.name) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFeedback('Perfeito! 🎉');
      speechService.speak(`Excelente! Isso é um ${target.name}!`);
      setScore(score + 1);
      addStars(1);
      setTimeout(nextRound, 1500);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setFeedback('Tente de novo! 💪');
      speechService.speak(`Esse é o ${item.name}. Procure o ${target.name}!`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      <Text style={styles.prompt}>Encontre:</Text>
      <Text style={styles.targetName}>{target.emoji} {target.name}</Text>

      <View style={styles.options}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.shapeCard, Shadows.light]}
            onPress={() => handleSelect(opt)}
            activeOpacity={0.8}
          >
            <Text style={styles.shapeEmoji}>{opt.emoji}</Text>
            <Text style={styles.shapeName}>{opt.name}</Text>
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
  shapeCard: {
    width: (width - 100) / 2,
    height: (width - 100) / 2,
    maxWidth: 130,
    maxHeight: 130,
    margin: 10,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  shapeEmoji: { fontSize: 48 },
  shapeName: { fontSize: 16, fontWeight: '600', color: Colors.text, marginTop: 6 },
  feedback: { fontSize: 26, fontWeight: 'bold', marginTop: 30, color: Colors.text },
});
