import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Colors, Shadows } from '../../themes/Colors';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 80) / 4;

const EMOJI_PAIRS = ['🐶', '🐱', '🐸', '🦋', '🌺', '⭐', '🎈', '🍎'];

function generateCards() {
  const pairs = EMOJI_PAIRS.slice(0, 6); // 6 pairs = 12 cards
  const cards = [];
  pairs.forEach((emoji, index) => {
    cards.push({ id: `${index}a`, emoji, matched: false });
    cards.push({ id: `${index}b`, emoji, matched: false });
  });
  return cards.sort(() => 0.5 - Math.random());
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(0);
  const [score, setScore] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const { addStars } = useApp();

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setCards(generateCards());
    setFlipped([]);
    setMatched(0);
    setScore(0);
    speechService.speak('Encontre os pares iguais!');
  };

  const handleFlip = (card) => {
    if (disabled) return;
    if (flipped.find(f => f.id === card.id)) return;
    if (card.matched) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      if (newFlipped[0].emoji === newFlipped[1].emoji) {
        // Match!
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        speechService.speakExcited('Par encontrado!');
        setScore(s => s + 1);
        addStars(1);
        const newMatched = matched + 1;
        setMatched(newMatched);

        setCards(prev => prev.map(c =>
          c.emoji === card.emoji ? { ...c, matched: true } : c
        ));
        setFlipped([]);
        setDisabled(false);

        if (newMatched === 6) {
          setTimeout(() => {
            speechService.speakExcited('Parabéns! Você encontrou todos os pares!');
            addStars(3);
          }, 500);
        }
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const isFlipped = (card) => {
    return flipped.find(f => f.id === card.id) || card.matched;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>⭐ {score} | Pares: {matched}/6</Text>
      </View>

      <Text style={styles.prompt}>🧠 Encontre os pares!</Text>

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              isFlipped(card) ? styles.cardFlipped : styles.cardBack,
              card.matched && styles.cardMatched,
              Shadows.light,
            ]}
            onPress={() => handleFlip(card)}
            activeOpacity={0.8}
            disabled={card.matched}
          >
            {isFlipped(card) ? (
              <Text style={styles.cardEmoji}>{card.emoji}</Text>
            ) : (
              <Text style={styles.cardQuestion}>❓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {matched === 6 && (
        <View style={styles.celebrateContainer}>
          <Text style={styles.celebrate}>🎉 Parabéns! 🎉</Text>
          <TouchableOpacity style={[styles.replayBtn, Shadows.medium]} onPress={resetGame}>
            <Text style={styles.replayText}>Jogar de Novo</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 16, paddingBottom: 120 },
  scoreRow: { width: '100%', alignItems: 'center', marginBottom: 10, marginTop: 10 },
  score: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  prompt: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 400,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.2,
    margin: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: Colors.primary,
  },
  cardFlipped: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  cardMatched: {
    backgroundColor: '#f0fff4',
    borderWidth: 2,
    borderColor: Colors.secondary,
    opacity: 0.8,
  },
  cardEmoji: { fontSize: 32 },
  cardQuestion: { fontSize: 28 },
  celebrateContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  celebrate: { fontSize: 36, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  replayBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  replayText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
});
