import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Shadows } from '../../themes/Colors';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

const ANIMALS = [
  { name: 'Gato', emoji: '🐱', sound: 'Miau miau!' },
  { name: 'Cachorro', emoji: '🐶', sound: 'Au au au!' },
  { name: 'Vaca', emoji: '🐮', sound: 'Muuu muuu!' },
  { name: 'Galo', emoji: '🐓', sound: 'Cocoricó!' },
  { name: 'Pato', emoji: '🦆', sound: 'Quá quá quá!' },
  { name: 'Ovelha', emoji: '🐑', sound: 'Mé mé mé!' },
  { name: 'Porco', emoji: '🐷', sound: 'Oinc oinc!' },
  { name: 'Leão', emoji: '🦁', sound: 'Raaawrrr!' },
];

export default function SoundsGame() {
  const [target, setTarget] = useState(ANIMALS[0]);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { addStars } = useApp();

  useEffect(() => {
    nextRound();
  }, []);

  const nextRound = () => {
    const random = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setTarget(random);
    setFeedback('');

    let shuff = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (!shuff.find(s => s.name === random.name)) {
      shuff[0] = random;
    }
    setOptions(shuff.sort(() => 0.5 - Math.random()));

    speechService.speak(`${random.sound} Qual animal faz esse som?`);
  };

  const playSound = () => {
    speechService.speak(`${target.sound} Qual animal faz esse som?`);
  };

  const handleSelect = (item) => {
    if (item.name === target.name) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFeedback('Acertou! 🎉');
      speechService.speakExcited(`Isso! O ${target.name} faz ${target.sound}`);
      setScore(score + 1);
      addStars(1);
      setTimeout(nextRound, 2000);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setFeedback('Quase! Tente de novo! 💪');
      speechService.speak(`Esse é o ${item.name}. Ele faz ${item.sound} Tente de novo!`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      <TouchableOpacity style={[styles.soundBtn, Shadows.medium]} onPress={playSound}>
        <Text style={styles.soundEmoji}>🔊</Text>
        <Text style={styles.soundLabel}>Ouvir de novo</Text>
      </TouchableOpacity>

      <Text style={styles.prompt}>Qual animal faz esse som?</Text>

      <View style={styles.options}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.animalCard, Shadows.light]}
            onPress={() => handleSelect(opt)}
            activeOpacity={0.8}
          >
            <Text style={styles.animalEmoji}>{opt.emoji}</Text>
            <Text style={styles.animalName}>{opt.name}</Text>
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
  soundBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  soundEmoji: { fontSize: 32, marginRight: 10 },
  soundLabel: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  prompt: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 24 },
  options: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  animalCard: {
    width: 130,
    height: 130,
    margin: 10,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  animalEmoji: { fontSize: 48 },
  animalName: { fontSize: 16, fontWeight: '600', color: Colors.text, marginTop: 6 },
  feedback: { fontSize: 26, fontWeight: 'bold', marginTop: 20, color: Colors.text },
});
