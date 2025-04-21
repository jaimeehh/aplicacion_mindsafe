import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../stores/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { signOut, user, selectedAvatar } = useAuth();

  console.log('Valor de user:', user);

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const navigateToAwards = () => {
    router.push('/awards');
  };

  const navigateToTrend = () => {
    router.push('/trend');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                selectedAvatar?.url ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500',
            }}
            style={styles.avatar}
          />
          {user?.role === 'patient' && (
            <TouchableOpacity
              style={styles.changeAvatarButton}
              onPress={() => router.push('/profile/avatar-selection')}
            >
              <Ionicons name="camera" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.name}>{user?.email || 'John Doe'}</Text>
        <Text style={styles.subtitle}>
          {user?.role === 'family' ? 'Familiar' : 'Usuario'}
        </Text>
        <Text style={styles.joinDate}>
          Miembro desde {new Date(user?.joinDate || Date.now()).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user?.streak || 0}</Text>
          <Text style={styles.statLabel}>Racha Actual</Text>
          {user?.highestStreak ? (
            <Text style={styles.recordText}>Record: {user.highestStreak}</Text>
          ) : null}
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user?.testsCompleted || 0}</Text>
          <Text style={styles.statLabel}>Tests Diarios</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.resultsButton}
        onPress={navigateToTrend}
      >
        <View style={styles.resultsButtonContent}>
          <Ionicons name="stats-chart" size={24} color="#4285F4" />
          <Text style={styles.resultsButtonText}>Ver Resultados</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.awardsPreviewSection}
        onPress={navigateToAwards}
      >
        <View style={styles.awardsHeader}>
          <Text style={styles.sectionTitle}>Logros</Text>
          <Ionicons name="chevron-forward" size={24} color="#4285F4" />
        </View>

        <Text style={styles.awardsDescription}>
          Descubre tus logros y desbloquea nuevos retos completando tests diarios
        </Text>

        <View style={styles.awardsPreview}>
          <View style={[styles.previewIcon, { backgroundColor: '#4285F4' }]}>
            <Ionicons name="trophy-outline" size={20} color="#fff" />
          </View>
          <View style={[styles.previewIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="ribbon-outline" size={20} color="#fff" />
          </View>
          <View style={[styles.previewIcon, { backgroundColor: '#5E35B1' }]}>
            <Ionicons name="clipboard-outline" size={20} color="#fff" />
          </View>
          <View style={styles.moreAwardsIcon}>
            <Text style={styles.moreAwardsText}>
              +{user?.testsCompleted ? Math.min(user.testsCompleted, 10) : 0}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={navigateToSettings}
      >
        <Ionicons name="settings-outline" size={24} color="#4285F4" />
        <Text style={styles.settingsButtonText}>Configuración</Text>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  joinDate: {
    color: '#666',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 5,
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
  },
  recordText: {
    color: '#4285F4',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  resultsButton: {
    backgroundColor: '#f5f7fa',
    borderRadius: 15,
    marginBottom: 20,
  },
  resultsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  resultsButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  awardsPreviewSection: {
    backgroundColor: '#f0f7ff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  awardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  awardsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  awardsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  moreAwardsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  moreAwardsText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  settingsButtonText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});