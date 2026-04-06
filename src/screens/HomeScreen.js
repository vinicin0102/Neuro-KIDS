import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Shadows } from '../themes/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const MENU_ITEMS = [
  { key: 'Rotina', title: 'Rotina', emoji: '🗓️', color: '#7BC47F', route: 'Rotina' },
  { key: 'Falar', title: 'Falar', emoji: '💬', color: '#6C9BCF', route: 'Falar' },
  { key: 'Jogos', title: 'Jogos', emoji: '🎮', color: '#F0C05A', route: 'Jogos' },
  { key: 'Rewards', title: 'Estrelas', emoji: '⭐', color: '#E8956A', route: 'Rewards' },
];

export default function HomeScreen({ navigation }) {
  const { rewards, settings } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.name}>{settings.userName || 'Amiguinho'}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.starBadge}>
            <Text style={styles.starCount}>⭐ {rewards.stars}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Parents')}
            style={styles.settingsBtn}
          >
            <Ionicons name="settings-outline" size={28} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main 2x2 Grid */}
        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.card, { backgroundColor: item.color }, Shadows.medium]}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Atalhos ✨</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: '#B48EAD' }, Shadows.light]}
            onPress={() => navigation.navigate('Astro')}
          >
            <Text style={styles.quickEmoji}>🤖</Text>
            <Text style={styles.quickText}>IA Amigo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: '#6C9BCF' }, Shadows.light]}
            onPress={() => navigation.navigate('Parents')}
          >
            <Text style={styles.quickEmoji}>👨‍👩‍👧</Text>
            <Text style={styles.quickText}>Pais</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={[styles.statsCard, Shadows.light]}>
          <Text style={styles.statsTitle}>Meu Progresso</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{rewards.stars}</Text>
              <Text style={styles.statLabel}>Estrelas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statValue}>{rewards.medals}</Text>
              <Text style={styles.statLabel}>Medalhas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👑</Text>
              <Text style={styles.statValue}>{rewards.trophies}</Text>
              <Text style={styles.statLabel}>Troféus</Text>
            </View>
          </View>
        </View>
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
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Shadows.light,
  },
  greeting: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  starCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  settingsBtn: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 16,
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickBtn: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  quickText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
  },
});
