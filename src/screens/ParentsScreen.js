import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, SafeAreaView, Alert, Dimensions } from 'react-native';
import { Colors, Shadows } from '../themes/Colors';
import { Ionicons } from '@expo/vector-icons';
import { storageService } from '../services/storageService';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

const AVATARS = ['🧒', '👦', '👧', '🧒🏽', '👦🏾', '👧🏻', '🧒🏿', '👶'];

export default function ParentsScreen({ navigation }) {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState('1234');
  const { settings, updateSettings, profiles, addProfile, selectProfile, currentProfile, resetAll, rewards } = useApp();
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newAvatar, setNewAvatar] = useState('🧒');

  useEffect(() => {
    loadPin();
  }, []);

  const loadPin = async () => {
    const pinData = await storageService.load(storageService.KEYS.PARENT_PIN, '1234');
    setSavedPin(pinData);
  };

  const handleUnlock = () => {
    if (pin === savedPin) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsLocked(false);
      setPin('');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('PIN Incorreto', 'Tente novamente. PIN padrão: 1234');
      setPin('');
    }
  };

  const handleAddProfile = () => {
    if (!newName.trim()) {
      Alert.alert('Atenção', 'Digite o nome da criança.');
      return;
    }
    addProfile({ name: newName, age: newAge, avatar: newAvatar });
    setNewName('');
    setNewAge('');
    setNewAvatar('🧒');
    setShowAddProfile(false);
    Alert.alert('Sucesso', `Perfil "${newName}" criado!`);
  };

  const resetData = () => {
    Alert.alert(
      'Resetar Dados',
      'Isso resetará estrelas, rotina e progresso. Continuar?',
      [
        { text: 'Não' },
        {
          text: 'Sim', onPress: () => {
            resetAll();
            Alert.alert('Sucesso', 'Dados resetados!');
          }
        },
      ]
    );
  };

  if (isLocked) {
    return (
      <View style={styles.lockContainer}>
        <View style={styles.lockContent}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={styles.lockTitle}>Área dos Pais</Text>
          <Text style={styles.lockSub}>Digite o PIN de 4 dígitos</Text>
          <View style={styles.pinContainer}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.pinDot, pin.length > i && styles.pinDotFilled]} />
            ))}
          </View>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={(t) => {
              setPin(t);
              if (t.length === 4) {
                setTimeout(() => {
                  if (t === savedPin) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setIsLocked(false);
                    setPin('');
                  } else {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    Alert.alert('PIN Incorreto', 'PIN padrão: 1234');
                    setPin('');
                  }
                }, 200);
              }
            }}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            autoFocus
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>⚙️ Configurações</Text>
          <TouchableOpacity onPress={() => { setIsLocked(true); navigation.goBack(); }}>
            <Text style={styles.exitText}>Sair ✕</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={[styles.section, Shadows.light]}>
          <Text style={styles.sectionTitle}>👶 Perfil da Criança</Text>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.textInput}
              value={settings.userName}
              onChangeText={(t) => updateSettings({ userName: t })}
              placeholder="Nome"
            />
          </View>

          {/* Profiles List */}
          {profiles.length > 0 && (
            <View style={styles.profilesList}>
              <Text style={styles.profilesLabel}>Perfis:</Text>
              {profiles.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.profileItem, currentProfile?.id === p.id && styles.profileActive]}
                  onPress={() => selectProfile(p)}
                >
                  <Text style={styles.profileAvatar}>{p.avatar}</Text>
                  <Text style={styles.profileName}>{p.name}</Text>
                  {p.age ? <Text style={styles.profileAge}>{p.age} anos</Text> : null}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.addProfileBtn}
            onPress={() => setShowAddProfile(!showAddProfile)}
          >
            <Text style={styles.addProfileText}>+ Novo Perfil</Text>
          </TouchableOpacity>

          {showAddProfile && (
            <View style={styles.addProfileForm}>
              <Text style={styles.formLabel}>Avatar:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarRow}>
                {AVATARS.map((av) => (
                  <TouchableOpacity
                    key={av}
                    style={[styles.avatarOption, newAvatar === av && styles.avatarSelected]}
                    onPress={() => setNewAvatar(av)}
                  >
                    <Text style={styles.avatarEmoji}>{av}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TextInput
                style={styles.textInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="Nome da criança"
              />
              <TextInput
                style={[styles.textInput, { marginTop: 10 }]}
                value={newAge}
                onChangeText={setNewAge}
                placeholder="Idade"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.saveProfileBtn} onPress={handleAddProfile}>
                <Text style={styles.saveProfileText}>Salvar Perfil</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* AI Config */}
        <View style={[styles.section, Shadows.light]}>
          <Text style={styles.sectionTitle}>🤖 IA (OpenAI)</Text>
          <Text style={styles.hint}>Insira sua API Key para ativar o assistente online. Sem chave, funciona offline!</Text>
          <TextInput
            style={styles.textInput}
            placeholder="sk-..."
            value={settings.aiKey}
            onChangeText={(t) => updateSettings({ aiKey: t })}
            secureTextEntry
          />
        </View>

        {/* Sensory Mode */}
        <View style={[styles.section, Shadows.light]}>
          <Text style={styles.sectionTitle}>🧠 Modo Sensorial</Text>
          <Text style={styles.hint}>Reduz animações, sons e estímulos visuais</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Modo Sensorial:</Text>
            <Switch
              value={settings.sensoryMode}
              onValueChange={(v) => updateSettings({ sensoryMode: v })}
              trackColor={{ true: Colors.secondary }}
            />
          </View>
        </View>

        {/* Voice */}
        <View style={[styles.section, Shadows.light]}>
          <Text style={styles.sectionTitle}>🔊 Voz e Sons</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Voz Inteligente:</Text>
            <Switch
              value={settings.voiceEnabled}
              onValueChange={(v) => updateSettings({ voiceEnabled: v })}
              trackColor={{ true: Colors.secondary }}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.section, Shadows.light]}>
          <Text style={styles.sectionTitle}>📊 Progresso</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{rewards.stars}</Text>
              <Text style={styles.statLabel}>Estrelas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{rewards.medals}</Text>
              <Text style={styles.statLabel}>Medalhas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{rewards.trophies}</Text>
              <Text style={styles.statLabel}>Troféus</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.error }]} onPress={resetData}>
            <Ionicons name="refresh" size={22} color="#fff" />
            <Text style={styles.actionText}>Resetar Progresso</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  lockContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface },
  lockContent: { alignItems: 'center', padding: 40 },
  lockEmoji: { fontSize: 64, marginBottom: 20 },
  lockTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  lockSub: { fontSize: 18, color: Colors.textSecondary, marginBottom: 30 },
  pinContainer: { flexDirection: 'row', marginBottom: 20 },
  pinDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.border, marginHorizontal: 8 },
  pinDotFilled: { backgroundColor: Colors.primary },
  pinInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  backBtn: { marginTop: 30 },
  backText: { fontSize: 18, color: Colors.primary, fontWeight: '600' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  exitText: { fontSize: 18, color: Colors.error, fontWeight: '600' },
  section: { backgroundColor: Colors.surface, padding: 20, borderRadius: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  label: { fontSize: 17, color: Colors.textSecondary, flex: 1 },
  textInput: { backgroundColor: Colors.background, padding: 12, borderRadius: 16, fontSize: 16, flex: 1 },
  hint: { fontSize: 14, color: Colors.textSecondary, marginBottom: 10, lineHeight: 20 },
  profilesList: { marginTop: 14 },
  profilesLabel: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  profileItem: {
    flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16,
    backgroundColor: Colors.background, marginBottom: 8,
  },
  profileActive: { borderWidth: 2, borderColor: Colors.primary },
  profileAvatar: { fontSize: 28, marginRight: 10 },
  profileName: { fontSize: 18, fontWeight: '600', color: Colors.text, flex: 1 },
  profileAge: { fontSize: 14, color: Colors.textSecondary },
  addProfileBtn: { marginTop: 10, alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed' },
  addProfileText: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  addProfileForm: { marginTop: 14, padding: 14, backgroundColor: Colors.background, borderRadius: 16 },
  formLabel: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  avatarRow: { marginBottom: 12 },
  avatarOption: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: Colors.surface },
  avatarSelected: { borderWidth: 3, borderColor: Colors.primary },
  avatarEmoji: { fontSize: 28 },
  saveProfileBtn: { marginTop: 14, backgroundColor: Colors.primary, padding: 14, borderRadius: 18, alignItems: 'center' },
  saveProfileText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  statLabel: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  actionsSection: { marginTop: 8 },
  actionBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 12 },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 17, marginLeft: 10 },
});
