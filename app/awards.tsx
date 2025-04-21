import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../stores/auth';

const { width } = Dimensions.get('window');
const AWARD_SIZE = (width - 60) / 2;

export default function AwardsScreen() {
  const { user } = useAuth();

  // Define all possible awards
  const allAwards = [
    {
      id: 'first-test',
      title: 'Primer Paso',
      description: 'Completaste tu primer test diario',
      icon: 'footsteps-outline',
      color: '#4285F4',
      image:
        'https://images.pexels.com/photos/2923/young-game-match-kids.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      unlocked: user?.testsCompleted >= 1,
    },
    {
      id: 'streak-3',
      title: 'Constancia',
      description: '3 días consecutivos de tests',
      icon: 'calendar-outline',
      color: '#4CAF50',
      image:
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500',
      unlocked: user?.streak >= 3 || user?.highestStreak >= 3,
    },
    {
      id: 'streak-7',
      title: 'Dedicación',
      description: '7 días consecutivos de tests',
      icon: 'calendar-outline',
      color: '#FFC107',
      image:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
      unlocked: user?.streak >= 7 || user?.highestStreak >= 7,
    },
    {
      id: 'streak-14',
      title: 'Compromiso',
      description: '14 días consecutivos de tests',
      icon: 'trophy-outline',
      color: '#FF9800',
      image:
        'https://images.pexels.com/photos/7005491/pexels-photo-7005491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      unlocked: user?.streak >= 14 || user?.highestStreak >= 14,
    },
    {
      id: 'streak-30',
      title: 'Maestría',
      description: '30 días consecutivos de tests',
      icon: 'ribbon-outline',
      color: '#9C27B0',
      image:
        'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=500',
      unlocked: user?.streak >= 30 || user?.highestStreak >= 30,
    },
    {
      id: 'tests-5',
      title: 'Explorador',
      description: 'Completaste 5 tests diarios',
      icon: 'compass-outline',
      color: '#2196F3',
      image:
        'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=500',
      unlocked: user?.testsCompleted >= 5,
    },
    {
      id: 'tests-10',
      title: 'Aventurero',
      description: 'Completaste 10 tests diarios',
      icon: 'map-outline',
      color: '#3F51B5',
      image:
        'https://images.pexels.com/photos/7942430/pexels-photo-7942430.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      unlocked: user?.testsCompleted >= 10,
    },
    {
      id: 'tests-20',
      title: 'Experto',
      description: 'Completaste 20 tests diarios',
      icon: 'star-outline',
      color: '#E91E63',
      image:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500',
      unlocked: user?.testsCompleted >= 20,
    },
  ];

  // Count unlocked awards
  const unlockedCount = allAwards.filter((award) => award.unlocked).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Logros</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>
          Has desbloqueado {unlockedCount} de {allAwards.length} logros
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(unlockedCount / allAwards.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.awardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {allAwards.map((award) => (
          <View key={award.id} style={styles.awardCard}>
            <View style={styles.awardImageContainer}>
              <Image source={{ uri: award.image }} style={styles.awardImage} />
              {!award.unlocked && (
                <View style={styles.lockOverlay}>
                  <Ionicons name="lock-closed" size={30} color="#fff" />
                </View>
              )}
            </View>
            <View
              style={[
                styles.awardIconContainer,
                { backgroundColor: award.color },
                !award.unlocked && styles.awardIconLocked,
              ]}
            >
              <Ionicons
                name={award.icon}
                size={24}
                color={award.unlocked ? '#fff' : '#999'}
              />
            </View>
            <Text
              style={[
                styles.awardTitle,
                !award.unlocked && styles.awardTitleLocked,
              ]}
            >
              {award.title}
            </Text>
            <Text
              style={[
                styles.awardDescription,
                !award.unlocked && styles.awardDescriptionLocked,
              ]}
            >
              {award.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 4,
  },
  awardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 30,
  },
  awardCard: {
    width: AWARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  awardImageContainer: {
    width: '100%',
    height: AWARD_SIZE * 0.6,
    position: 'relative',
  },
  awardImage: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  awardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: AWARD_SIZE * 0.6 - 24,
    right: 15,
    borderWidth: 3,
    borderColor: '#fff',
  },
  awardIconLocked: {
    backgroundColor: '#E0E0E0',
  },
  awardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  awardTitleLocked: {
    color: '#999',
  },
  awardDescription: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  awardDescriptionLocked: {
    color: '#999',
  },
});
