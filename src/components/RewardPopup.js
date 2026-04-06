import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '../themes/Colors';

const { width } = Dimensions.get('window');

export const RewardPopup = ({ visible, type = 'star', message = 'Parabéns!', onDone }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after 2.5s
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onDone) onDone();
        });
      }, 2500);
    }
  }, [visible]);

  if (!visible) return null;

  const emojis = { star: '⭐', medal: '🏆', trophy: '👑', celebrate: '🎉' };
  const colors = { star: Colors.star, medal: Colors.medal, trophy: Colors.trophy, celebrate: Colors.accent };

  return (
    <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
      <Animated.View style={[styles.popup, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.emoji}>{emojis[type]}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={[styles.glow, { backgroundColor: colors[type] }]} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 999,
  },
  popup: {
    backgroundColor: Colors.surface,
    borderRadius: 40,
    padding: 40,
    alignItems: 'center',
    width: width * 0.8,
    maxWidth: 350,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 15,
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
    top: -20,
  },
});
