import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated, SafeAreaView, Dimensions } from 'react-native';
import { Colors, Shadows } from '../themes/Colors';
import { Ionicons } from '@expo/vector-icons';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function AIScreen() {
  const { settings } = useApp();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Olá ${settings.userName || 'amiguinho'}! 👋 Eu sou o Astro, seu amigo espacial! Como você está hoje?` }
  ]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const quickPrompts = aiService.getQuickPrompts();

  useEffect(() => {
    // Gentle bounce animation for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1.0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    speechService.speak(messages[0].text);
  }, []);

  const handleSend = async (text) => {
    const userMsg = (text || inputValue).trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setLoading(true);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const response = await aiService.sendMessage(userMsg, settings.userName);
    setLoading(false);

    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    speechService.speak(response);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Animated.View style={[styles.avatar, { transform: [{ scale: bounceAnim }] }]}>
          <Text style={styles.avatarEmoji}>🤖</Text>
        </Animated.View>
        <Text style={styles.avatarName}>Astro</Text>
        <Text style={styles.avatarSub}>Seu amigo inteligente</Text>
      </View>

      {/* Chat */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.chatScroll}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, i) => (
          <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            {msg.role === 'assistant' && <Text style={styles.botEmoji}>🤖</Text>}
            <Text style={[styles.msgText, msg.role === 'user' && styles.userText]}>{msg.text}</Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.bubble, styles.aiBubble]}>
            <Text style={styles.botEmoji}>🤖</Text>
            <Text style={styles.loadingText}>Pensando... 💭</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick prompts */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickRow}
      >
        {quickPrompts.map((prompt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.quickBtn, Shadows.light]}
            onPress={() => handleSend(prompt)}
          >
            <Text style={styles.quickBtnText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Diga algo..."
          placeholderTextColor="#999"
          value={inputValue}
          onChangeText={setInputValue}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, Shadows.medium]}
          onPress={() => handleSend()}
          disabled={loading}
        >
          <Ionicons name="send" size={28} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...Shadows.light,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 52,
  },
  avatarName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  avatarSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 8,
  },
  bubble: {
    padding: 14,
    borderRadius: 22,
    maxWidth: '85%',
    marginBottom: 10,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 4,
    ...Shadows.light,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderTopRightRadius: 4,
  },
  botEmoji: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 2,
  },
  msgText: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 26,
    flex: 1,
  },
  userText: {
    color: Colors.surface,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  quickRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  quickBtnText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 14,
    paddingBottom: 100,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 17,
    marginRight: 10,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
