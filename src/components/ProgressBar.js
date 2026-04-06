import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { Colors } from '../themes/Colors';

export const ProgressBar = ({ progress, label = 'Progresso', color = Colors.secondary, showEmoji = true }) => {
  const percentage = Math.min(100, Math.max(0, progress * 100));
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const getEmoji = () => {
    if (percentage >= 100) return '🎉';
    if (percentage >= 75) return '🌟';
    if (percentage >= 50) return '💪';
    if (percentage >= 25) return '🔥';
    return '✨';
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.percent}>
            {Math.round(percentage)}% {showEmoji && getEmoji()}
          </Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: animWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  percent: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  track: {
    height: 24,
    backgroundColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 12,
  },
});
