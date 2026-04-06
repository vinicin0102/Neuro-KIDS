import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors, Shadows } from '../themes/Colors';
import * as Haptics from 'expo-haptics';
import { speechService } from '../services/speechService';

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (isLogin) {
      speechService.speak('Bem vindo de volta!', { style: 'friendly' });
    } else {
      speechService.speak(`Bem vindo ao NeuroKids, ${name || 'amiguinho'}!`, { style: 'friendly' });
    }
    
    // Substituindo fluxo para a tela principal
    navigation.replace('Tabs');
  };

  const toggleAuthMode = () => {
    Haptics.selectionAsync();
    setIsLogin(!isLogin);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.logoText}>🧠 NeuroKids AI</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Faça login para continuar' : 'Crie sua conta para começar'}
            </Text>
          </View>

          <View style={[styles.formContainer, Shadows.medium]}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da Criança</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Lucas"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail dos Pais</Text>
              <TextInput
                style={styles.input}
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, Shadows.light]} 
              onPress={handleAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.switchButton} onPress={toggleAuthMode}>
            <Text style={styles.switchButtonText}>
              {isLogin 
                ? 'Ainda não tem conta? Clique para Cadastrar' 
                : 'Já tem uma conta? Clique para Entrar'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 10,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 30,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 10,
  },
  switchButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
