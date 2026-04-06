import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Colors, Shadows } from '../themes/Colors';
import { useApp } from '../context/AppContext';

// Import individual games
import ColorsGame from './games/ColorsGame';
import EmotionsGame from './games/EmotionsGame';
import ShapesGame from './games/ShapesGame';
import SoundsGame from './games/SoundsGame';
import MemoryGame from './games/MemoryGame';
import DragGame from './games/DragGame';
import ColoringGame from './games/ColoringGame';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 56) / 2;

const GAMES = [
  { id: 'colors', title: 'Cores', emoji: '🎨', color: '#E07070', desc: 'Aprenda as cores!' },
  { id: 'emotions', title: 'Emoções', emoji: '😊', color: '#F0C05A', desc: 'Como se sente?' },
  { id: 'shapes', title: 'Formas', emoji: '🔷', color: '#6C9BCF', desc: 'Descubra formas!' },
  { id: 'sounds', title: 'Sons', emoji: '🔊', color: '#7BC47F', desc: 'Ouça e aprenda!' },
  { id: 'memory', title: 'Memória', emoji: '🧠', color: '#B48EAD', desc: 'Encontre os pares!' },
  { id: 'drag', title: 'Arrastar', emoji: '👆', color: '#E8956A', desc: 'Mova os objetos!' },
  { id: 'coloring', title: 'Colorir', emoji: '🖍️', color: '#9B5DE5', desc: 'Pinte o desenho!' },
];

export default function GamesScreen() {
  const [activeGame, setActiveGame] = useState(null);
  const { rewards } = useApp();

  if (activeGame) {
    const GameComponent = {
      colors: ColorsGame,
      emotions: EmotionsGame,
      shapes: ShapesGame,
      sounds: SoundsGame,
      memory: MemoryGame,
      drag: DragGame,
      coloring: ColoringGame,
    }[activeGame];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.gameHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setActiveGame(null)}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ {rewards.stars}</Text>
          </View>
        </View>
        <GameComponent />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Jogos</Text>
        <Text style={styles.subtitle}>Escolha um jogo para brincar!</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {GAMES.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, { backgroundColor: game.color }, Shadows.medium]}
            onPress={() => setActiveGame(game.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.gameEmoji}>{game.emoji}</Text>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameDesc}>{game.desc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Shadows.light,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  grid: {
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 120,
  },
  gameCard: {
    width: CARD_SIZE,
    height: CARD_SIZE * 0.85,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    padding: 16,
  },
  gameEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  gameDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: Colors.surface,
    ...Shadows.light,
  },
  backBtn: {
    padding: 10,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  scoreBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
