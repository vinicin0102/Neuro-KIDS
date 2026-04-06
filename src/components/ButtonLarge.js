import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Sizes, Shadows } from '../themes/Colors';
import { Ionicons } from '@expo/vector-icons';
import { speechService } from '../services/speechService';

export const ButtonLarge = ({
  title,
  icon,
  emoji,
  onPress,
  color = Colors.primary,
  textColor = Colors.surface,
  textStyle = {},
  speak = true,
  style = {},
  size = 'large', // 'large' | 'medium' | 'small'
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (speak) {
      speechService.speak(title);
    }
    if (onPress) onPress();
  };

  const sizeStyles = {
    large: { height: 120, borderRadius: 30 },
    medium: { height: 90, borderRadius: 25 },
    small: { height: 70, borderRadius: 20 },
  };

  const iconSizes = { large: 48, medium: 36, small: 28 };
  const fontSizes = { large: 24, medium: 20, small: 16 };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        { backgroundColor: color },
        Shadows.medium,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {emoji ? (
          <Text style={{ fontSize: iconSizes[size] + 4 }}>{emoji}</Text>
        ) : icon ? (
          <Ionicons name={icon} size={iconSizes[size]} color={textColor} style={styles.icon} />
        ) : null}
        <Text style={[styles.text, { fontSize: fontSizes[size], color: textColor }, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    marginTop: 6,
  },
  icon: {
    marginBottom: 2,
  },
});
