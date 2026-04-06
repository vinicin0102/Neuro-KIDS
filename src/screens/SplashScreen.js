import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { Colors } from '../themes/Colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dotScale1 = useRef(new Animated.Value(0)).current;
  const dotScale2 = useRef(new Animated.Value(0)).current;
  const dotScale3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 30,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading dots
    const animDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };
    animDot(dotScale1, 0);
    animDot(dotScale2, 200);
    animDot(dotScale3, 400);

    // Auto-proceed
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
        <Text style={styles.logoEmoji}>🧠</Text>
        <View style={styles.logoGlow} />
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        NeuroKids AI
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Seu amigo inteligente ✨
      </Animated.Text>

      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { opacity: dotScale1, backgroundColor: Colors.accent }]} />
        <Animated.View style={[styles.dot, { opacity: dotScale2, backgroundColor: Colors.secondary }]} />
        <Animated.View style={[styles.dot, { opacity: dotScale3, backgroundColor: Colors.purple }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -width * 0.3,
    left: -width * 0.25,
  },
  bgCircle2: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width * 0.5,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: -width * 0.3,
    right: -width * 0.2,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 72,
  },
  logoGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 60,
  },
  dotsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 80,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
});
