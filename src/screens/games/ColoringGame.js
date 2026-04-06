import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Colors, Shadows } from '../../themes/Colors';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const COLOR_PALETTE = [
  { id: 'red', hex: '#FF595E', name: 'Vermelho' },
  { id: 'orange', hex: '#FFCA3A', name: 'Amarelo' }, // Calling yellow 'Amarelo' because hex matches yellow-orange
  { id: 'true_orange', hex: '#FF924C', name: 'Laranja' },
  { id: 'green', hex: '#8AC926', name: 'Verde' },
  { id: 'blue', hex: '#1982C4', name: 'Azul' },
  { id: 'purple', hex: '#6A4C93', name: 'Roxo' },
];

const DRAWINGS = [
  {
    id: 'sol',
    name: 'Sol',
    speakName: 'O Sol',
    parts: ['center', 'ray1', 'ray2', 'ray3', 'ray4', 'ray5', 'ray6', 'ray7', 'ray8'],
    render: (coloredParts, handleColorPart) => (
      <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 100 100">
        <G stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Rays - using paths */}
          <Path d="M50 5 L50 20" stroke={coloredParts['ray1'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('ray1')} />
          <Path d="M50 80 L50 95" stroke={coloredParts['ray2'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('ray2')} />
          <Path d="M5 50 L20 50" stroke={coloredParts['ray3'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('ray3')} />
          <Path d="M80 50 L95 50" stroke={coloredParts['ray4'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('ray4')} />
          <Path d="M18 18 L28 28" stroke={coloredParts['ray5'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('ray5')} />
          <Path d="M82 82 L72 72" stroke={coloredParts['ray6'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('ray6')} />
          <Path d="M18 82 L28 72" stroke={coloredParts['ray7'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('ray7')} />
          <Path d="M82 18 L72 28" stroke={coloredParts['ray8'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('ray8')} />
          
          {/* Center */}
          <Circle cx="50" cy="50" r="22" fill={coloredParts['center'] || '#FFFFFF'} onPress={() => handleColorPart('center')} />
        </G>
      </Svg>
    )
  },
  {
    id: 'flor',
    name: 'Flor',
    speakName: 'A Flor',
    parts: ['center', 'petal1', 'petal2', 'petal3', 'petal4', 'stem', 'leaf'],
    render: (coloredParts, handleColorPart) => (
      <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 100 100">
        <G stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Stem & Leaf */}
          <Path d="M50 65 L50 95" stroke={coloredParts['stem'] || '#FFFFFF'} strokeWidth="6" onPress={() => handleColorPart('stem')} />
          <Path d="M50 85 Q70 85 60 70 Q50 70 50 85" fill={coloredParts['leaf'] || '#FFFFFF'} onPress={() => handleColorPart('leaf')} />
          {/* Petals */}
          <Circle cx="50" cy="30" r="18" fill={coloredParts['petal1'] || '#FFFFFF'} onPress={() => handleColorPart('petal1')} />
          <Circle cx="30" cy="50" r="18" fill={coloredParts['petal2'] || '#FFFFFF'} onPress={() => handleColorPart('petal2')} />
          <Circle cx="70" cy="50" r="18" fill={coloredParts['petal3'] || '#FFFFFF'} onPress={() => handleColorPart('petal3')} />
          <Circle cx="50" cy="70" r="18" fill={coloredParts['petal4'] || '#FFFFFF'} onPress={() => handleColorPart('petal4')} />
          {/* Center */}
          <Circle cx="50" cy="50" r="16" fill={coloredParts['center'] || '#FFFFFF'} onPress={() => handleColorPart('center')} />
        </G>
      </Svg>
    )
  },
  {
    id: 'casa',
    name: 'Casa',
    speakName: 'A Casa',
    parts: ['roof', 'base', 'door', 'window1', 'window2'],
    render: (coloredParts, handleColorPart) => (
      <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 100 100">
        <G stroke="#333" strokeWidth="2" strokeLinejoin="round">
          {/* Base */}
          <Path d="M20 45 L80 45 L80 95 L20 95 Z" fill={coloredParts['base'] || '#FFFFFF'} onPress={() => handleColorPart('base')} />
          {/* Roof */}
          <Path d="M10 45 L50 15 L90 45 Z" fill={coloredParts['roof'] || '#FFFFFF'} onPress={() => handleColorPart('roof')} />
          {/* Door */}
          <Path d="M40 95 L40 65 L60 65 L60 95 Z" fill={coloredParts['door'] || '#FFFFFF'} onPress={() => handleColorPart('door')} />
          {/* Windows */}
          <Path d="M25 55 L35 55 L35 65 L25 65 Z" fill={coloredParts['window1'] || '#FFFFFF'} onPress={() => handleColorPart('window1')} />
          <Path d="M65 55 L75 55 L75 65 L65 65 Z" fill={coloredParts['window2'] || '#FFFFFF'} onPress={() => handleColorPart('window2')} />
        </G>
      </Svg>
    )
  },
  {
    id: 'maca',
    name: 'Maçã',
    speakName: 'A Maçã',
    parts: ['body', 'leaf', 'stem'],
    render: (coloredParts, handleColorPart) => (
      <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 100 100">
        <G stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Stem */}
          <Path d="M50 25 Q55 15 60 10" stroke={coloredParts['stem'] || '#FFFFFF'} strokeWidth="4" fill="none" onPress={() => handleColorPart('stem')} />
          {/* Leaf */}
          <Path d="M60 10 Q75 10 70 25 Q55 25 60 10" fill={coloredParts['leaf'] || '#FFFFFF'} onPress={() => handleColorPart('leaf')} />
          {/* Body */}
          <Circle cx="50" cy="60" r="35" fill={coloredParts['body'] || '#FFFFFF'} onPress={() => handleColorPart('body')} />
        </G>
      </Svg>
    )
  }
];

export default function ColoringGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[1]);
  const [coloredParts, setColoredParts] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { addStars } = useApp();

  const currentDrawing = DRAWINGS[currentIdx];

  useEffect(() => {
    speechService.speakSlow(`Vamos colorir ${currentDrawing.speakName}!`);
  }, [currentIdx]);

  const handleSelectColor = (color) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedColor(color);
    speechService.speak(color.name);
  };

  const handleColorPart = (partId) => {
    if (isCompleted) return;
    
    Haptics.selectionAsync();
    const newColoredParts = { ...coloredParts, [partId]: selectedColor.hex };
    setColoredParts(newColoredParts);

    // Check completion
    const allColored = currentDrawing.parts.every(part => newColoredParts[part] !== undefined);
    
    if (allColored && !isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        speechService.speakExcited(`Lindo! Você pintou ${currentDrawing.speakName}!`);
        addStars(5);
      }, 500);
    }
  };

  const reset = () => {
    setColoredParts({});
    setIsCompleted(false);
    speechService.speak('Vamos pintar de novo!');
  };

  const nextDrawing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setColoredParts({});
    setIsCompleted(false);
    setCurrentIdx((currentIdx + 1) % DRAWINGS.length);
  };

  const prevDrawing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setColoredParts({});
    setIsCompleted(false);
    setCurrentIdx((currentIdx - 1 + DRAWINGS.length) % DRAWINGS.length);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🎨 Colorir</Text>
      
      <View style={[styles.canvasContainer, Shadows.medium]}>
        {currentDrawing.render(coloredParts, handleColorPart)}
      </View>

      <View style={styles.carouselControl}>
        <TouchableOpacity style={[styles.arrowBtn, Shadows.light]} onPress={prevDrawing}>
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.drawingName}>{currentDrawing.name}</Text>

        <TouchableOpacity style={[styles.arrowBtn, Shadows.light]} onPress={nextDrawing}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>

      {isCompleted && (
        <View style={styles.celebration}>
          <Text style={styles.celebrationText}>🌟 Lindo! É um {currentDrawing.name}! 🌟</Text>
          <TouchableOpacity style={[styles.resetBtn, Shadows.light]} onPress={reset}>
            <Text style={styles.resetBtnText}>Pintar de novo</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.paletteTitle}>Escolha uma cor:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.palette}>
        {COLOR_PALETTE.map((color) => (
          <TouchableOpacity
            key={color.id}
            style={[
              styles.colorSwatch,
              { backgroundColor: color.hex },
              selectedColor.id === color.id && styles.colorSwatchSelected,
              Shadows.light
            ]}
            onPress={() => handleSelectColor(color)}
            activeOpacity={0.7}
          >
            {selectedColor.id === color.id && <Text style={styles.checkIcon}>✓</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 10,
    letterSpacing: 1,
  },
  carouselControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.8,
    marginBottom: 20,
  },
  drawingName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  arrowBtn: {
    backgroundColor: Colors.surface,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  canvasContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 10,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  celebration: {
    alignItems: 'center',
    marginBottom: 10,
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  resetBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paletteTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
    marginTop: 10,
  },
  palette: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 8,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchSelected: {
    borderColor: Colors.text,
    transform: [{ scale: 1.15 }],
  },
  checkIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});
