import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Shadows } from '../themes/Colors';
import { Ionicons } from '@expo/vector-icons';
import { storageService } from '../services/storageService';
import { speechService } from '../services/speechService';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';
import { ProgressBar } from '../components/ProgressBar';
import { RewardPopup } from '../components/RewardPopup';

export default function RoutineScreen() {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');
  const { addStars } = useApp();

  useEffect(() => {
    loadRoutine();
  }, []);

  const loadRoutine = async () => {
    const data = await storageService.load(storageService.KEYS.ROUTINE, storageService.DEFAULT_ROUTINE);
    setTasks(data);
    calculateProgress(data);
  };

  const calculateProgress = (taskList) => {
    if (!taskList.length) return;
    const completed = taskList.filter(t => t.completed).length;
    setProgress(completed / taskList.length);
  };

  const toggleTask = async (id) => {
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        const newState = !task.completed;
        if (newState) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          speechService.speakExcited(`Muito bem! ${task.title} concluído!`);
          addStars(1);
        }
        return { ...task, completed: newState };
      }
      return task;
    });
    setTasks(newTasks);
    calculateProgress(newTasks);
    await storageService.save(storageService.KEYS.ROUTINE, newTasks);

    // All tasks completed?
    const allDone = newTasks.every(t => t.completed);
    if (allDone) {
      addStars(5); // Bonus!
      setRewardMsg('Dia completo!\n+5 estrelas bônus! 🌟');
      setShowReward(true);
      speechService.speakExcited('Incrível! Você completou todo o dia! Parabéns!');
    }
  };

  const resetDay = async () => {
    const resetTasks = tasks.map(t => ({ ...t, completed: false }));
    setTasks(resetTasks);
    calculateProgress(resetTasks);
    await storageService.save(storageService.KEYS.ROUTINE, resetTasks);
    speechService.speak('Novo dia, novas aventuras!', { style: 'friendly' });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.completed && styles.taskCompleted, Shadows.light]}
      onPress={() => toggleTask(item.id)}
      activeOpacity={0.8}
    >
      <View style={[styles.orderBadge, item.completed && styles.orderBadgeCompleted]}>
        <Text style={styles.orderText}>{index + 1}</Text>
      </View>
      <View style={styles.taskContent}>
        <Text style={styles.taskEmoji}>{item.emoji || '📋'}</Text>
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, item.completed && styles.textCompleted]}>{item.title}</Text>
          {item.time && <Text style={styles.taskTime}>{item.time}</Text>}
        </View>
      </View>
      <View style={[styles.checkCircle, item.completed && styles.checkCircleCompleted]}>
        {item.completed && <Ionicons name="checkmark" size={24} color="#fff" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗓️ Minha Rotina</Text>
        <ProgressBar progress={progress} label="Meu Dia" color={Colors.secondary} />
      </View>

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={[styles.resetBtn, Shadows.light]} onPress={resetDay}>
        <Ionicons name="refresh" size={20} color={Colors.surface} />
        <Text style={styles.resetText}>Novo Dia</Text>
      </TouchableOpacity>

      <RewardPopup
        visible={showReward}
        type="celebrate"
        message={rewardMsg}
        onDone={() => setShowReward(false)}
      />
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
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Shadows.light,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
  },
  taskCompleted: {
    backgroundColor: '#f0fff4',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  orderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderBadgeCompleted: {
    backgroundColor: Colors.secondaryLight,
  },
  orderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  taskTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  textCompleted: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  resetBtn: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: Colors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
