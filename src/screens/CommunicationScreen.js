import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Colors, Shadows } from '../themes/Colors';
import { Ionicons } from '@expo/vector-icons';
import { speechService } from '../services/speechService';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 56) / 2;

const PECS_DATA = [
  { id: '1', text: 'Água', emoji: '💧', icon: 'water', color: '#6C9BCF' },
  { id: '2', text: 'Comida', emoji: '🍎', icon: 'fast-food', color: '#7BC47F' },
  { id: '3', text: 'Banheiro', emoji: '🚽', icon: 'body', color: '#B48EAD' },
  { id: '4', text: 'Dor', emoji: '🤕', icon: 'medkit', color: '#E07070' },
  { id: '5', text: 'Sono', emoji: '😴', icon: 'moon', color: '#4C566A' },
  { id: '6', text: 'Brincar', emoji: '🎮', icon: 'game-controller', color: '#F0C05A' },
  { id: '7', text: 'Sim', emoji: '✅', icon: 'checkmark-circle', color: '#7BC47F' },
  { id: '8', text: 'Não', emoji: '❌', icon: 'close-circle', color: '#E8956A' },
  { id: '9', text: 'Ajuda', emoji: '🆘', icon: 'help-circle', color: '#6C9BCF' },
  { id: '10', text: 'Quero', emoji: '👋', icon: 'hand-left', color: '#8FBCBB' },
  { id: '11', text: 'Abraço', emoji: '🤗', icon: 'heart', color: '#BF616A' },
  { id: '12', text: 'Feliz', emoji: '😊', icon: 'happy', color: '#F0C05A' },
];

const PHRASE_STARTERS = [
  { id: 'eu', text: 'Eu', emoji: '🙋' },
  { id: 'quero', text: 'quero', emoji: '👉' },
  { id: 'nao_quero', text: 'não quero', emoji: '🙅' },
  { id: 'preciso', text: 'preciso', emoji: '🆘' },
  { id: 'gosto', text: 'gosto de', emoji: '❤️' },
];

export default function CommunicationScreen() {
  const [phrase, setPhrase] = useState([]);
  const [showStarters, setShowStarters] = useState(false);

  const addToPhrase = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhrase([...phrase, item]);
    speechService.speak(item.text);
  };

  const addStarter = (starter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhrase([...phrase, { id: starter.id, text: starter.text, emoji: starter.emoji, color: '#888' }]);
    speechService.speak(starter.text);
    setShowStarters(false);
  };

  const clearPhrase = () => {
    setPhrase([]);
  };

  const playPhrase = () => {
    if (phrase.length === 0) return;
    const fullText = phrase.map(item => item.text).join(' ');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    speechService.speak(fullText);
  };

  const removeLast = () => {
    setPhrase(phrase.slice(0, -1));
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, Shadows.light]}
      onPress={() => addToPhrase(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.cardEmojiContainer, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.cardText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Phrase Builder */}
      <View style={[styles.phraseContainer, Shadows.medium]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.phraseScroll}>
          {phrase.length === 0 ? (
            <Text style={styles.placeholder}>Toque nos cards para falar... 💬</Text>
          ) : (
            phrase.map((item, index) => (
              <View key={`${item.id}-${index}`} style={[styles.phraseItem, { backgroundColor: item.color || '#888' }]}>
                <Text style={styles.phraseEmoji}>{item.emoji}</Text>
                <Text style={styles.phraseText}>{item.text}</Text>
              </View>
            ))
          )}
        </ScrollView>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setShowStarters(!showStarters)} style={styles.controlBtn}>
            <Text style={styles.controlEmoji}>📝</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={removeLast} style={styles.controlBtn}>
            <Ionicons name="backspace-outline" size={28} color={Colors.error} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playPhrase} style={styles.playBtn}>
            <Ionicons name="volume-high" size={36} color={Colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearPhrase} style={styles.controlBtn}>
            <Ionicons name="trash-outline" size={28} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Phrase Starters */}
      {showStarters && (
        <View style={styles.startersRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PHRASE_STARTERS.map((s) => (
              <TouchableOpacity key={s.id} style={styles.starterBtn} onPress={() => addStarter(s)}>
                <Text style={styles.starterEmoji}>{s.emoji}</Text>
                <Text style={styles.starterText}>{s.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* PECS Grid */}
      <FlatList
        data={PECS_DATA}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  phraseContainer: {
    minHeight: 130,
    backgroundColor: Colors.surface,
    padding: 12,
    margin: 12,
    borderRadius: 24,
    justifyContent: 'space-between',
  },
  phraseScroll: {
    alignItems: 'center',
    paddingBottom: 8,
    minHeight: 60,
  },
  placeholder: {
    fontSize: 18,
    color: Colors.textLight,
    paddingLeft: 10,
  },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    marginRight: 8,
    height: 50,
  },
  phraseEmoji: {
    fontSize: 20,
  },
  phraseText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 6,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingTop: 8,
  },
  playBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  controlBtn: {
    padding: 8,
  },
  controlEmoji: {
    fontSize: 24,
  },
  startersRow: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  starterBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.light,
  },
  starterEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  starterText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  grid: {
    padding: 12,
    paddingBottom: 120,
  },
  card: {
    width: CARD_SIZE,
    backgroundColor: Colors.surface,
    margin: 8,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  cardEmojiContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
});
