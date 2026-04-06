import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Shadows } from '../../themes/Colors';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  {
    name: 'Frutas',
    emoji: '🍎',
    color: '#E07070',
    items: [
      { emoji: '🍎', name: 'Maçã' },
      { emoji: '🍌', name: 'Banana' },
      { emoji: '🍊', name: 'Laranja' },
      { emoji: '🍇', name: 'Uva' },
    ],
  },
  {
    name: 'Animais',
    emoji: '🐶',
    color: '#E8956A',
    items: [
      { emoji: '🐶', name: 'Cachorro' },
      { emoji: '🐱', name: 'Gato' },
      { emoji: '🐸', name: 'Sapo' },
      { emoji: '🐰', name: 'Coelho' },
    ],
  },
  {
    name: 'Comidas',
    emoji: '🍕',
    color: '#F0C05A',
    items: [
      { emoji: '🍕', name: 'Pizza' },
      { emoji: '🍔', name: 'Hambúrguer' },
      { emoji: '🍪', name: 'Biscoito' },
      { emoji: '🍰', name: 'Bolo' },
    ],
  },
];

export default function DragGame() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState([]);
  const [targets, setTargets] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState([]);
  const { addStars } = useApp();

  useEffect(() => {
    newRound();
  }, []);

  const newRound = () => {
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setCategory(cat);
    setItems(cat.items.sort(() => 0.5 - Math.random()));
    setTargets(cat.items.sort(() => 0.5 - Math.random()));
    setSelectedItem(null);
    setMatched([]);
    speechService.speak(`Combine os ${cat.name.toLowerCase()}! Toque em um item e depois no nome dele.`);
  };

  const selectItem = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedItem(item);
    speechService.speak(item.name);
  };

  const selectTarget = (target) => {
    if (!selectedItem) {
      speechService.speak('Primeiro escolha um item de cima!');
      return;
    }

    if (selectedItem.name === target.name) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      speechService.speakExcited(`Certo! ${target.name}!`);
      const newMatched = [...matched, target.name];
      setMatched(newMatched);
      setSelectedItem(null);
      setScore(s => s + 1);
      addStars(1);

      if (newMatched.length === category.items.length) {
        setTimeout(() => {
          speechService.speakExcited('Parabéns! Você combinou tudo!');
          addStars(2);
          setTimeout(newRound, 2000);
        }, 500);
      }
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      speechService.speak(`Esse é ${target.name}. Esse não é o ${selectedItem.name}. Tente de novo!`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>⭐ {score}</Text>
      </View>

      <Text style={styles.prompt}>Combine os {category.name}!</Text>
      <Text style={styles.hint}>
        {selectedItem ? `Selecionado: ${selectedItem.emoji}` : 'Toque em um item ⬇️'}
      </Text>

      {/* Items to select */}
      <View style={styles.row}>
        {items.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.itemCard,
              selectedItem?.name === item.name && styles.itemSelected,
              matched.includes(item.name) && styles.itemMatched,
              Shadows.light,
            ]}
            onPress={() => !matched.includes(item.name) && selectItem(item)}
            disabled={matched.includes(item.name)}
            activeOpacity={0.8}
          >
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.arrow}>⬇️ combine com ⬇️</Text>

      {/* Target names */}
      <View style={styles.row}>
        {targets.map((target, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.targetCard,
              matched.includes(target.name) && styles.targetMatched,
              Shadows.light,
            ]}
            onPress={() => !matched.includes(target.name) && selectTarget(target)}
            disabled={matched.includes(target.name)}
            activeOpacity={0.8}
          >
            <Text style={[styles.targetText, matched.includes(target.name) && styles.targetTextMatched]}>
              {target.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {matched.length === category.items.length && (
        <TouchableOpacity style={[styles.nextBtn, Shadows.medium]} onPress={newRound}>
          <Text style={styles.nextText}>Próxima Rodada 🎮</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  scoreRow: { position: 'absolute', top: 10, right: 20 },
  score: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  prompt: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  hint: { fontSize: 18, color: Colors.textSecondary, marginBottom: 20 },
  arrow: { fontSize: 20, color: Colors.textSecondary, marginVertical: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  itemCard: {
    width: 80,
    height: 80,
    margin: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  itemSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
    backgroundColor: Colors.primaryLight + '30',
  },
  itemMatched: {
    backgroundColor: '#f0fff4',
    borderColor: Colors.secondary,
    opacity: 0.6,
  },
  itemEmoji: { fontSize: 36 },
  targetCard: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    margin: 6,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  targetMatched: {
    backgroundColor: '#f0fff4',
    borderColor: Colors.secondary,
    opacity: 0.6,
  },
  targetText: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  targetTextMatched: { textDecorationLine: 'line-through', color: Colors.textSecondary },
  nextBtn: {
    marginTop: 30,
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  nextText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
});
