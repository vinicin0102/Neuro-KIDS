import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Colors, Shadows } from '../themes/Colors';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const LEVELS = [
  { stars: 10, title: 'Explorador', emoji: '🌟', color: '#F0C05A' },
  { stars: 25, title: 'Campeão', emoji: '🏅', color: '#E8956A' },
  { stars: 50, title: 'Super Herói', emoji: '🦸', color: '#B48EAD' },
  { stars: 100, title: 'Lendário', emoji: '👑', color: '#DAA520' },
  { stars: 200, title: 'Mestre', emoji: '🌈', color: '#7BC47F' },
];

export default function RewardsScreen() {
  const { rewards } = useApp();

  const currentLevel = LEVELS.reduce((prev, curr) =>
    rewards.stars >= curr.stars ? curr : prev
  , { stars: 0, title: 'Iniciante', emoji: '✨', color: Colors.primary });

  const nextLevel = LEVELS.find(l => l.stars > rewards.stars) || LEVELS[LEVELS.length - 1];
  const progressToNext = rewards.stars >= nextLevel.stars ? 1 :
    (rewards.stars - (LEVELS[LEVELS.indexOf(nextLevel) - 1]?.stars || 0)) /
    (nextLevel.stars - (LEVELS[LEVELS.indexOf(nextLevel) - 1]?.stars || 0));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Stats */}
        <View style={[styles.mainCard, Shadows.medium]}>
          <Text style={styles.levelEmoji}>{currentLevel.emoji}</Text>
          <Text style={styles.levelTitle}>{currentLevel.title}</Text>
          <Text style={styles.starsCount}>{rewards.stars} ⭐</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, Shadows.light]}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>{rewards.stars}</Text>
            <Text style={styles.statLabel}>Estrelas</Text>
          </View>
          <View style={[styles.statBox, Shadows.light]}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{rewards.medals}</Text>
            <Text style={styles.statLabel}>Medalhas</Text>
          </View>
          <View style={[styles.statBox, Shadows.light]}>
            <Text style={styles.statEmoji}>👑</Text>
            <Text style={styles.statValue}>{rewards.trophies}</Text>
            <Text style={styles.statLabel}>Troféus</Text>
          </View>
        </View>

        {/* Next Level */}
        <View style={[styles.nextLevelCard, Shadows.light]}>
          <Text style={styles.nextTitle}>Próximo Nível</Text>
          <View style={styles.nextRow}>
            <Text style={styles.nextEmoji}>{nextLevel.emoji}</Text>
            <View style={styles.nextInfo}>
              <Text style={styles.nextName}>{nextLevel.title}</Text>
              <Text style={styles.nextStars}>{rewards.stars}/{nextLevel.stars} estrelas</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(100, progressToNext * 100)}%`, backgroundColor: nextLevel.color }]} />
          </View>
        </View>

        {/* Achievements List */}
        <Text style={styles.sectionTitle}>🏆 Conquistas</Text>
        {LEVELS.map((level) => {
          const unlocked = rewards.stars >= level.stars;
          return (
            <View
              key={level.stars}
              style={[
                styles.achievementCard,
                unlocked ? styles.achievementUnlocked : styles.achievementLocked,
                Shadows.light,
              ]}
            >
              <View style={[styles.achieveIcon, { backgroundColor: unlocked ? level.color + '30' : '#eee' }]}>
                <Text style={[styles.achieveEmoji, !unlocked && styles.lockedEmoji]}>
                  {unlocked ? level.emoji : '🔒'}
                </Text>
              </View>
              <View style={styles.achieveInfo}>
                <Text style={[styles.achieveTitle, !unlocked && styles.lockedText]}>{level.title}</Text>
                <Text style={styles.achieveStars}>{level.stars} estrelas</Text>
              </View>
              {unlocked && <Text style={styles.achieveCheck}>✅</Text>}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 120,
  },
  mainCard: {
    backgroundColor: Colors.surface,
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  levelEmoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
  },
  starsCount: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  nextLevelCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  nextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  nextEmoji: {
    fontSize: 40,
    marginRight: 14,
  },
  nextInfo: {
    flex: 1,
  },
  nextName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  nextStars: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressTrack: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 14,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 22,
    marginBottom: 10,
  },
  achievementUnlocked: {
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achieveIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  achieveEmoji: {
    fontSize: 28,
  },
  lockedEmoji: {
    fontSize: 22,
  },
  achieveInfo: {
    flex: 1,
  },
  achieveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  lockedText: {
    color: Colors.textSecondary,
  },
  achieveStars: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  achieveCheck: {
    fontSize: 24,
  },
});
